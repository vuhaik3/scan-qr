/**
 * QR to Sheet - Google Apps Script endpoint.
 * Bind this project to the destination spreadsheet (Extensions > Apps Script).
 *
 * IMPORTANT: Set ACCESS_TOKEN to a long random value (at least 32 characters),
 * deploy as a Web App executing as you, and grant access to anyone.
 * The token is a shared bearer secret, not a substitute for per-user identity.
 */
var ACCESS_TOKEN = 'CHANGE_THIS_TO_A_RANDOM_SECRET_AT_LEAST_32_CHARS';
var MAX_CODE_LENGTH = 2048;

function doGet(e) {
  var p = (e && e.parameter) || {};
  var callback = String(p.callback || '');
  var isJsonp = /^[A-Za-z_$][0-9A-Za-z_$]{0,100}$/.test(callback);
  var result;

  if (p.action !== 'append') {
    result = { ok: true, message: 'QR to Sheet đang hoạt động.' };
  } else {
    result = appendScan_(p);
  }

  var json = JSON.stringify(result);
  if (isJsonp) {
    return ContentService.createTextOutput(callback + '(' + json.replace(/</g, '\\u003c') + ');')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(json).setMimeType(ContentService.MimeType.JSON);
}

function appendScan_(p) {
  if (!ACCESS_TOKEN || ACCESS_TOKEN.indexOf('CHANGE_THIS') === 0 || ACCESS_TOKEN.length < 20) {
    return { ok: false, error: 'Chủ sở hữu chưa cấu hình ACCESS_TOKEN trong Code.gs.' };
  }
  if (!constantTimeEquals_(String(p.token || ''), ACCESS_TOKEN)) {
    return { ok: false, error: 'Mã truy cập không đúng.' };
  }

  var id = String(p.id || '');
  var code = String(p.code || '');
  var time = String(p.time || '');
  if (!/^[A-Za-z0-9_-]{8,100}$/.test(id)) return { ok: false, error: 'Mã bản ghi không hợp lệ.' };
  if (!code || code.length > MAX_CODE_LENGTH) return { ok: false, error: 'Nội dung QR rỗng hoặc quá dài.' };
  var scanDate = parseScanTime_(time);
  if (!scanDate) return { ok: false, error: 'Thời gian không hợp lệ. Định dạng cần là dd/MM/yyyy HH:mm:ss.' };

  // Tên tab được xác định từ thời điểm quét trên thiết bị, không phải thời điểm gửi.
  var monthTab = pad2_(scanDate.month) + '-' + scanDate.year;

  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    var cache = CacheService.getScriptCache();
    var cacheKey = 'scan_' + id;
    if (cache.get(cacheKey)) return { ok: true, duplicate: true, id: id };

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss) throw new Error('Không tìm thấy bảng tính. Hãy dùng Apps Script gắn với Google Sheet.');
    var sheet = ss.getSheetByName(monthTab);
    if (!sheet) sheet = ss.insertSheet(monthTab);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Ngày giờ quét', 'Nội dung QR', 'Mã bản ghi']);
      sheet.setFrozenRows(1);
    }
    sheet.appendRow([time, code, id]);
    cache.put(cacheKey, '1', 21600);
    return { ok: true, id: id, sheet: monthTab };
  } catch (err) {
    return { ok: false, error: String(err && err.message ? err.message : err) };
  } finally {
    try { lock.releaseLock(); } catch (ignored) {}
  }
}

function constantTimeEquals_(a, b) {
  if (a.length !== b.length) return false;
  var diff = 0;
  for (var i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/**
 * Parse the client timestamp (dd/MM/yyyy HH:mm:ss) without relying on
 * server locale/time zone. Returns numeric date parts for tab naming.
 */
function parseScanTime_(value) {
  var match = /^(\\d{2})\\/(\\d{2})\\/(\\d{4}) (\\d{2}):(\\d{2}):(\\d{2})$/.exec(value);
  if (!match) return null;
  var day = Number(match[1]);
  var month = Number(match[2]);
  var year = Number(match[3]);
  var hour = Number(match[4]);
  var minute = Number(match[5]);
  var second = Number(match[6]);
  var date = new Date(year, month - 1, day, hour, minute, second);
  if (month < 1 || month > 12 || day < 1 || hour > 23 || minute > 59 || second > 59 ||
      date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null;
  }
  return { day: day, month: month, year: year, hour: hour, minute: minute, second: second };
}

function pad2_(value) {
  return value < 10 ? '0' + value : String(value);
}
