# QR to Sheet (web app): hướng dẫn cài đặt

Web app chạy trên Safari (iPhone) và Chrome (Android/máy tính), quét QR bằng camera và
ghi mã + ngày giờ vào Google Sheet. Hoàn toàn miễn phí.

Cần 3 phần: **(A)** Google Sheet, **(B)** đưa web app lên mạng, **(C)** cài lên điện thoại.

---------------------------------------------------------------------

## A. Google Sheet + Apps Script (~3 phút)

1. Dùng **Gmail cá nhân**, tạo Google Sheet mới.
2. Menu **Tiện ích mở rộng → Apps Script**.
   *(Nếu gặp lỗi "Rất tiếc, không thể mở tệp": mở cửa sổ ẩn danh, chỉ đăng nhập 1 tài khoản Google
   rồi thử lại. Hoặc dùng https://script.google.com → Dự án mới, và điền ID Google Sheet vào dòng
   `var SHEET_ID = '';` trong code.)*
3. Xóa code mẫu, dán toàn bộ nội dung file `apps-script/Code.gs`, bấm lưu.
4. **Triển khai → Triển khai mới →** bánh răng **→ Ứng dụng web**:
   - Thực thi dưới tên: **Tôi**
   - Ai có quyền truy cập: **Bất kỳ ai**
5. Bấm **Triển khai**, cấp quyền (Nâng cao → Đi tới dự án → Cho phép).
6. **Copy "URL ứng dụng web"** (đuôi `/exec`). Cần dùng ở bước C.

> Đã triển khai bản cũ trước đó? Vào **Triển khai → Quản lý bản triển khai → biểu tượng bút chì →
> Phiên bản: Phiên bản mới → Triển khai**. URL giữ nguyên.

---------------------------------------------------------------------

## B. Đưa web app lên GitHub Pages (miễn phí)

1. Đăng ký tài khoản tại https://github.com (nếu chưa có).
2. Bấm dấu **+ → New repository**:
   - Repository name: `qr-sheet` (hoặc tên bất kỳ, viết liền không dấu)
   - Chọn **Public** (GitHub Pages miễn phí cần repo công khai; repo không chứa dữ liệu nhạy cảm
     vì URL Apps Script chỉ lưu trên điện thoại của bạn)
   - Bấm **Create repository**.
3. Giải nén file zip. Ở trang repository, bấm **uploading an existing file** (hoặc
   **Add file → Upload files**), kéo thả **4 file** này vào:
   `index.html`, `manifest.webmanifest`, `icon-192.png`, `icon-512.png`
   rồi bấm **Commit changes**.
   *(4 file phải nằm ngay ngoài cùng repository, không nằm trong thư mục con.)*
4. Vào **Settings → Pages** (cột trái):
   - Source: **Deploy from a branch**
   - Branch: **main**, thư mục **/ (root)** → bấm **Save**.
5. Chờ 1–2 phút, tải lại trang Pages sẽ hiện dòng:
   **"Your site is live at https://TÊN-BẠN.github.io/qr-sheet/"**. Đây là địa chỉ web app của bạn.

---------------------------------------------------------------------

## C. Cài lên điện thoại và dùng

### iPhone (dùng Safari)
1. Mở địa chỉ web app ở trên bằng **Safari**.
2. Bấm nút **Chia sẻ** (hình vuông có mũi tên lên) → kéo xuống **Thêm vào Màn hình chính** → **Thêm**.
3. Mở app **QR to Sheet** từ màn hình chính.

### Android (dùng Chrome)
1. Mở địa chỉ web app bằng **Chrome**.
2. Bấm **⋮ → Thêm vào màn hình chính** (hoặc **Cài đặt ứng dụng**).

### Dùng lần đầu
1. Dán **URL Apps Script** (bước A.6) vào ô ở mục 1, bấm **Lưu URL**.
   *Lưu ý iPhone: app trên màn hình chính có bộ nhớ riêng, tách biệt với Safari, nên phải dán URL
   lại trong app này một lần.*
2. Bấm **Gửi thử 1 dòng** → mở Google Sheet, thấy dòng "TEST …" là kết nối thành công.
3. Bấm **Bắt đầu quét**, cho phép camera, đưa mã QR vào khung.
4. Điện thoại kêu bíp, mã hiện trong **Lịch sử quét** với trạng thái **✔ Đã gửi**, và xuất hiện
   ở Google Sheet (cột A = ngày giờ, cột B = nội dung mã).
5. Tick **Quét liên tục** nếu muốn quét nhiều mã liên tiếp.

Mất mạng thì mã ở trạng thái **⏳ Chờ gửi** và tự gửi khi có mạng lại (hoặc bấm
**Gửi lại mã đang chờ**).

---------------------------------------------------------------------

## Xử lý sự cố

| Hiện tượng | Cách xử lý |
|---|---|
| Không thấy camera / báo chưa cấp quyền | iPhone: Cài đặt → Safari (hoặc ứng dụng) → Camera → Cho phép. Android: biểu tượng ổ khóa cạnh địa chỉ → Quyền → Camera. |
| Báo "Chưa tải được thư viện quét mã" | Cần có internet ở lần mở đầu tiên. Bật mạng, tải lại trang. |
| Báo "Đã gửi" nhưng Sheet không có dòng mới | Quyền truy cập Apps Script chưa là **Bất kỳ ai**, hoặc sau khi sửa code chưa tạo **phiên bản mới**. Kiểm tra lại bước A.4–A.5. |
| Gửi thử không ra gì, URL đúng | Dán URL trong trình duyệt: nếu hiện "QR to Sheet đang hoạt động" là script ổn, lỗi nằm ở quyền/triển khai. |
| Quét chậm hoặc không nhận | Giữ máy cách mã 15–30 cm, đủ sáng, mã nằm gọn trong khung. |
| Trang không cập nhật sau khi sửa file | Xóa app khỏi màn hình chính, mở lại bằng trình duyệt rồi thêm lại. |
