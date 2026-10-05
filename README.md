# Thiệp cưới Song Phụng Xanh

Trang tĩnh HTML/CSS/JavaScript theo mẫu https://chungdoi.com/vi/mau-thiep/song-phung-xanh/demo. Không cần build. Ảnh và họa tiết nằm trong assets/. Dữ liệu hiện tại là dữ liệu demo, hãy thay bằng thông tin và ảnh của bạn.

## Cấu hình

Sửa config.js để đổi tên, ngày giờ (múi giờ Việt Nam), địa chỉ, gia đình, ảnh và chương trình. Đặt rsvpEmail để khách gửi xác nhận qua ứng dụng email; khi để trống, khách tải tệp xác nhận rồi gửi cho bạn. Trang tĩnh không lưu phản hồi trên máy chủ. Đặt music thành đường dẫn tệp nhạc để bật nhạc.

Thêm ?guest=Nguyễn%20Văn%20A vào cuối URL để cá nhân hóa tên khách.

## Xem trang

Mở index.html hoặc chạy python -m http.server 8000 trong thư mục này rồi mở http://localhost:8000.

## GitHub Pages

Workflow .github/workflows/pages.yml triển khai khi push main. Vào repository → Settings → Pages → Source → chọn GitHub Actions. URL dự kiến: https://ngo-tuan-anh.github.io/chung-doi/

## Tên khách mời trên URL

Tên dưới “Thân Mời” được lấy từ tham số `guest`, ví dụ:

https://ngo-tuan-anh.github.io/chung-doi/?guest=G%C4%90%20b%C3%A1c%20M%E1%BA%A1nh%20-%20Nhung

Nếu thiếu hoặc để trống `guest`, thiệp hiển thị “Quý khách”. Tên cũng được cập nhật trong phần mời dự tiệc. Dùng `encodeURIComponent(tenKhach)` khi tạo URL bằng JavaScript để giữ đúng dấu tiếng Việt và các ký tự đặc biệt.

## Bản đồ và mã QR mừng cưới

Trong config.js, điền venueMapUrl, groomMapUrl và brideMapUrl bằng link Google Maps chính xác nếu có. Để trống thì website tạo link tìm kiếm theo địa chỉ. Mục gifts chứa hai hộp thông tin cô dâu/chú rể: đặt qrImage thành đường dẫn ảnh QR (ví dụ assets/qr-chu-re.png), cùng bank, accountNumber và accountName. Khi chưa có ảnh QR, hộp quà hiển thị thông báo chờ cập nhật, không dùng tài khoản demo.
