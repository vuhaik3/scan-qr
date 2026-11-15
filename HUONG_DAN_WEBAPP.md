# QR to Sheet - hướng dẫn cài đặt và vận hành

Ứng dụng quét mã QR bằng camera điện thoại và ghi nội dung + thời gian vào Google Sheets. Front-end được host trên GitHub Pages; Google Apps Script xử lý việc ghi dữ liệu.

## 1. Thiết lập Google Sheets và Apps Script

1. Tạo Google Sheet mới bằng tài khoản Google của bạn.
2. Chọn **Tiện ích mở rộng → Apps Script** để tạo dự án gắn với bảng tính.
3. Mở file `apps-script/Code.gs` trong repository, sao chép toàn bộ nội dung vào trình soạn thảo Apps Script và lưu.
4. Trong `Code.gs`, thay giá trị `ACCESS_TOKEN` bằng một chuỗi ngẫu nhiên dài ít nhất 32 ký tự. Ví dụ có thể tạo bằng trình quản lý mật khẩu. Không dùng ví dụ công khai làm mã thật.
5. Chọn **Triển khai → Triển khai mới → Ứng dụng web**:
   - Thực thi dưới tên: **Tôi**.
   - Ai có quyền truy cập: **Bất kỳ ai**.
6. Triển khai, cấp quyền cho Apps Script và sao chép URL ứng dụng web kết thúc bằng `/exec`.
7. Mỗi lần sửa Apps Script, vào **Triển khai → Quản lý bản triển khai → Chỉnh sửa → Phiên bản mới → Triển khai**.

> Endpoint cần truy cập công khai để JSONP từ GitHub Pages gọi được. Mã truy cập là shared secret dạng bearer: người có mã có thể ghi dữ liệu vào Sheet. Không đưa mã vào repository, không gửi cho người không tin cậy và hãy thay mã nếu bị lộ. Vì đây là mô hình client-side, mã không thể được xem là bí mật tuyệt đối trước người dùng thiết bị.

## 2. Đưa giao diện lên GitHub Pages

1. Mở repository và chọn **Settings → Pages**.
2. Source: **Deploy from a branch**.
3. Branch: `main`, thư mục `/(root)`, bấm **Save**.
4. Chờ GitHub Pages xuất bản trang. Địa chỉ thường có dạng `https://TEN-GITHUB.github.io/scan-qr/`.

## 3. Kết nối và sử dụng

1. Mở trang bằng Safari (iPhone) hoặc Chrome (Android).
2. Nhập URL Apps Script và đúng mã truy cập đã cấu hình trong `Code.gs`, bấm **Lưu URL**.
3. Bấm **Gửi thử 1 dòng**. Chỉ khi Apps Script xác nhận thành công, lịch sử mới chuyển sang **Đã gửi**.
4. Bấm **Bắt đầu quét**, cấp quyền camera và đưa QR vào khung.
5. Bật **Quét liên tục** nếu muốn quét nhiều mã. Mã chờ gửi được lưu trên thiết bị và tự thử lại khi có mạng.

Ứng dụng tự chọn tab theo tháng/năm của **thời điểm quét**, đặt tên dạng `MM-YYYY` (ví dụ `11-2026`). Nếu tab chưa tồn tại, Apps Script tự tạo tab và thêm hàng tiêu đề. Mỗi tab có các cột thời gian, nội dung QR và mã bản ghi chống ghi trùng. Mã quét khi mất mạng vẫn được lưu vào đúng tháng lúc quét, kể cả khi đến tháng sau mới gửi lại.

## 4. Lưu dữ liệu theo tháng, ngoại tuyến và giới hạn

- Mỗi tháng có một tab riêng theo định dạng `MM-YYYY`: ví dụ tháng 11 năm 2026 là `11-2026`, tháng 1 năm 2027 là `01-2027`.
- Tab được xác định theo ngày giờ quét lưu trên thiết bị, không phải ngày giờ đồng bộ. Vì vậy mã quét cuối tháng nhưng gửi lại đầu tháng sau vẫn vào tab của tháng đã quét.
- Khi tab của tháng chưa tồn tại, hệ thống tự tạo tab và hàng tiêu đề khi ghi bản ghi đầu tiên.


- Service Worker cache giao diện và thư viện jsQR sau lần tải thành công đầu tiên. Camera vẫn cần quyền truy cập và HTTPS.
- Các bản ghi chờ gửi nằm trong localStorage của trình duyệt/ứng dụng trên từng thiết bị; không xóa dữ liệu trình duyệt khi còn bản ghi chờ.
- Google Apps Script và Google Sheets có hạn mức sử dụng của Google. Với lượng quét lớn hoặc nhiều nhân viên đồng thời, nên chuyển sang backend có xác thực người dùng và hàng đợi bền vững.

## 5. Xử lý sự cố

| Hiện tượng | Cách xử lý |
|---|---|
| Báo mã truy cập không đúng | Kiểm tra token trong app trùng chính xác với `ACCESS_TOKEN` trong bản triển khai Apps Script hiện hành. |
| Không ghi được Sheet | Kiểm tra quyền triển khai là **Bất kỳ ai**, đã cấp quyền và dùng URL `/exec`. |
| Mã vẫn ở trạng thái chờ | Kiểm tra mạng, URL và token; bấm **Gửi lại mã đang chờ**. |
| Không mở được camera | Dùng HTTPS, cấp quyền camera cho Safari/Chrome và đóng ứng dụng khác đang dùng camera. |
| Mở app khi không có mạng không quét được | Mở app một lần khi có mạng để cache trang và thư viện jsQR. |
| Đã đổi Code.gs nhưng app vẫn báo lỗi | Tạo phiên bản mới trong phần Quản lý bản triển khai của Apps Script. |
