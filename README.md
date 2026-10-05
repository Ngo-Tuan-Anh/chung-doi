# Thiệp cưới Song Phụng Xanh

Trang tĩnh HTML/CSS/JavaScript theo mẫu https://chungdoi.com/vi/mau-thiep/song-phung-xanh/demo. Không cần build. Ảnh và họa tiết nằm trong assets/. Dữ liệu hiện tại là dữ liệu demo, hãy thay bằng thông tin và ảnh của bạn.

## Cấu hình

Sửa config.js để đổi tên, ngày giờ (múi giờ Việt Nam), địa chỉ, gia đình, ảnh và chương trình. Đặt rsvpEmail để khách gửi xác nhận qua ứng dụng email; khi để trống, khách tải tệp xác nhận rồi gửi cho bạn. Trang tĩnh không lưu phản hồi trên máy chủ. Đặt music thành đường dẫn tệp nhạc để bật nhạc.

Thêm ?guest=Nguyễn%20Văn%20A vào cuối URL để cá nhân hóa tên khách.

## Xem trang

Mở index.html hoặc chạy python -m http.server 8000 trong thư mục này rồi mở http://localhost:8000.

## GitHub Pages

Workflow .github/workflows/pages.yml triển khai khi push main. Vào repository → Settings → Pages → Source → chọn GitHub Actions. URL dự kiến: https://ngo-tuan-anh.github.io/chung-doi/
