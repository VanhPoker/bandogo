# CHI TIẾT 32 USE CASE - HỆ THỐNG WEBSITE BANDOGO

Tài liệu này mô tả chi tiết toàn bộ các Use Case của hệ thống, bao gồm cả các chức năng đã hiện thực trong mã nguồn và các chức năng theo thiết kế trong báo cáo.

## BẢNG TỔNG HỢP USE CASE

| ID | Tên Use Case | Actor | Trạng thái (Code) |
|----|--------------|-------|-------------------|
| **A. NHÓM GUEST (KHÁCH VÃNG LAI)** | | |
| UC01 | Xem Trang chủ (Landing Page) | Guest | Đã hiện thực |
| UC02 | Xem Giới thiệu (About Us) | Guest | Đã hiện thực |
| UC03 | Xem Liên hệ & Hotline | Guest | Đã hiện thực |
| UC04 | Gửi Form liên hệ | Guest | Đã hiện thực |
| UC05 | Xem Danh sách Tin tức | Guest | Đã hiện thực |
| UC06 | Xem Chi tiết Tin tức | Guest | Đã hiện thực |
| UC07 | Xem Danh sách Dự án | Guest | Đã hiện thực |
| UC08 | Tìm kiếm Sản phẩm | Guest | Đã hiện thực |
| UC09 | Lọc Sản phẩm (Danh mục) | Guest | Đã hiện thực |
| UC10 | Xem Danh sách Sản phẩm | Guest | Đã hiện thực |
| UC11 | Xem Chi tiết Sản phẩm | Guest | Đã hiện thực |
| **B. NHÓM AUTH (XÁC THỰC)** | | |
| UC12 | Đăng ký Tài khoản | Guest | Đã hiện thực |
| UC13 | Đăng nhập | Guest | Đã hiện thực |
| UC14 | Đăng xuất | User | Đã hiện thực |
| **C. NHÓM CUSTOMER (KHÁCH HÀNG)** | | |
| UC15 | Thêm vào Giỏ hàng | Customer | Đã hiện thực |
| UC16 | Xem Giỏ hàng | Customer | Đã hiện thực |
| UC17 | Cập nhật Số lượng Giỏ hàng | Customer | Đã hiện thực |
| UC18 | Xóa Sản phẩm khỏi Giỏ | Customer | Đã hiện thực |
| UC19 | Thanh toán (Checkout) | Customer | Đã hiện thực |
| UC20 | Xác nhận Đặt hàng thành công | Customer | Đã hiện thực |
| UC21 | Xem Lịch sử Đơn hàng | Customer | *Chưa có UI* |
| UC22 | Cập nhật Hồ sơ Cá nhân | Customer | *Chưa có UI* |
| **D. NHÓM ADMIN (QUẢN TRỊ)** | | |
| UC23 | Đăng nhập Admin | Admin | Đã hiện thực |
| UC24 | Xem Dashboard (Thống kê) | Admin | Đã hiện thực |
| UC25 | Xem Danh sách Sản phẩm | Admin | Đã hiện thực |
| UC26 | Thêm mới Sản phẩm | Admin | Đã hiện thực |
| UC27 | Chỉnh sửa Sản phẩm | Admin | Đã hiện thực |
| UC28 | Xóa Sản phẩm | Admin | Đã hiện thực |
| UC29 | Quản lý Tin tức (CRUD) | Admin | Đã hiện thực |
| UC30 | Quản lý Dự án (CRUD) | Admin | Đã hiện thực |
| UC31 | Quản lý Người dùng (Danh sách) | Admin | Đã hiện thực |
| UC32 | Xem Danh sách Đơn hàng | Admin | Đã hiện thực |

---

## BIỂU ĐỒ HỆ THỐNG (SYSTEM DIAGRAM)

```mermaid
graph LR
    Guest((Khách vãng lai))
    Customer((Khách hàng))
    Admin((Quản trị viên))

    subgraph Public [Public Site]
        Direction TB
        UC01[Xem Trang chủ]
        UC08[Tìm kiếm/Lọc]
        UC11[Xem Sản phẩm]
        UC04[Liên hệ]
    end

    subgraph Auth [Authentication]
        UC12[Đăng ký]
        UC13[Đăng nhập]
    end

    subgraph Shopping [Shopping & Account]
        UC15[Giỏ hàng]
        UC19[Thanh toán]
        UC21[Lịch sử đơn]
    end

    subgraph CMS [Admin CMS]
        UC24[Dashboard]
        UC25[QL Sản phẩm]
        UC32[QL Đơn hàng]
        UC29[QL Nội dung]
    end

    Guest --> Public
    Guest --> Auth
    
    Customer --> Public
    Customer --> Shopping
    
    Admin --> CMS
```

---

## CHI TIẾT ĐẶC TẢ USE CASE

### 1. UC01 - Xem Trang chủ (Landing Page)
- **Mô tả**: Hiển thị giao diện chính của website với các khối: Banner quảng cáo, Sản phẩm nổi bật, Video quy trình sản xuất, và Footer thông tin.
- **Dữ liệu**: Lấy danh sách sản phẩm nổi bật từ bảng `products`.
- **Luồng chính**: Người dùng truy cập tên miền -> Hệ thống tải trang Index -> Hiển thị Slide và Gợi ý sản phẩm.

### 2. UC08, UC09, UC10 - Tìm kiếm & Lọc Sản phẩm
- **Mô tả**: Cho phép người dùng tìm các loại gỗ cụ thể.
- **Chức năng**:
    - **Tìm kiếm**: Nhập từ khóa vào ô Search (Header) -> Hệ thống query `name` like `%keyword%`.
    - **Lọc Danh mục**: Chọn tab (MFC, MDF, Plywood) -> Hệ thống filter `category` = selected.
- **Giao diện**: Trang `Products.tsx` lưới sản phẩm.

### 3. UC11 - Xem Chi tiết Sản phẩm
- **Mô tả**: Hiển thị thông tin đầy đủ của một mã gỗ.
- **Chi tiết**: Tên, Mã sản phẩm, Giá (VND), Kho (Còn/Hết), Mô tả chi tiết, Ảnh Zoom, Sản phẩm liên quan.
- **Giao diện**: `ProductDetail.tsx`.

### 4. UC15, UC16, UC17, UC18 - Quản lý Giỏ hàng
- **Mô tả**: Người dùng thêm sản phẩm muốn mua vào giỏ tạm tính.
- **Logic Code (`useCart`)**:
    - Lưu vào `localStorage` (hoặc DB nếu đã login - hiện tại code dùng Context).
    - Tự động cộng dồn số lượng nếu sản phẩm đã tồn tại.
    - Tính tổng tiền tự động = `Unit Price * Quantity`.

### 5. UC19 - Thanh toán (Checkout)
- **Mô tả**: Quy trình chốt đơn hàng.
- **Các bước**:
    1. Kiểm tra giỏ hàng != rỗng.
    2. Điền thông tin giao hàng: Họ tên, Số điện thoại, Địa chỉ nhận.
    3. Chọn phương thức thanh toán (COD / Chuyển khoản).
    4. Nhấn "Đặt hàng" -> Hệ thống tạo record trong bảng `orders` và `order_items`.
    5. Xóa giỏ hàng và chuyển hướng sang trang UC20 (Order Success).

### 6. UC12, UC13 - Đăng ký & Đăng nhập
- **Công nghệ**: Sử dụng Supabase Auth.
- **Đăng ký**: Validate Email + Password (min 6 chars). Tạo user trong Supabase Auth và trigger tạo record trong bảng `public.users` (nếu có hook).
- **Đăng nhập**: Cấp JWT token, lưu phiên đăng nhập. Phân quyền Admin nếu `role` = 'admin'.

### 7. UC24 - Admin Dashboard
- **Mô tả**: Màn hình tổng quan dành cho chủ cửa hàng.
- **Thông số hiển thị**:
    - Tổng số sản phẩm đang kinh doanh.
    - Số lượng khách hàng đã đăng ký.
    - Tổng số đơn hàng phát sinh.
    - Doanh thu ước tính (Tổng `total_amount` của các đơn).

### 8. UC25, UC26, UC27, UC28 - Quản lý Sản phẩm (CRUD)
- **Quyền hạn**: Chỉ Admin.
- **Chức năng**:
    - **Thêm mới**: Upload ảnh lên Supabase Storage bucket `products`. Lưu thông tin vào DB.
    - **Sửa**: Load dữ liệu cũ vào Form, cho phép cập nhật giá/tồn kho.
    - **Xóa**: Xóa record khỏi DB (Cảnh báo trước khi xóa).

### 9. UC32 - Quản lý Đơn hàng
- **Mô tả**: Admin xem danh sách đơn hàng để xử lý.
- **Hiện thực**:
    - Hiển thị danh sách `orders` sort theo thời gian mới nhất.
    - Hiển thị trạng thái (Pending, Processing, Delivered).
    - Xem chi tiết người mua và tổng tiền.
    
### 10. UC29 - Quản lý Tin tức
- **Mô tả**: Đăng tải các bài viết kiến thức về gỗ hoặc khuyến mãi.
- **Component**: `NewsManager.tsx`.
- **Dữ liệu**: Bảng `news` (title, content, image_url, created_at).

### 11. UC30 - Quản lý Dự án
- **Mô tả**: Đăng tải Portfolio các công trình đã thi công.
- **Component**: `ProjectsManager.tsx`.
- **Mục đích**: Tăng độ uy tín (Social Proof) cho khách hàng tham khảo.
