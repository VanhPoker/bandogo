# Bandogo - Website Bán Đồ Gỗ Nội Thất

Dự án website thương mại điện tử chuyên cung cấp các sản phẩm gỗ nội thất, ván công nghiệp và phụ kiện mộc. Website bao gồm đầy đủ các tính năng cho người dùng mua sắm và trang quản trị cho admin.

## 🚀 Công Nghệ Sử Dụng

- **Frontend:** React (Vite), TypeScript
- **Styling:** Tailwind CSS, Shadcn UI
- **State Management:** React Hooks (Context API cho Cart, Auth)
- **Routing:** React Router DOM
- **Backend & Database:** Supabase (PostgreSQL, Auth, Storage)
- **Icons:** Lucide React
- **Notifications:** Sonner

## ✨ Tính Năng Chính

### 1. Người Dùng (Public)
- **Trang Chủ (`/`):**
    - Hiển thị danh mục sản phẩm nổi bật.
    - Hiển thị sản phẩm đại diện cho từng danh mục.
- **Sản Phẩm (`/products`):**
    - Danh sách sản phẩm với bộ lọc theo danh mục (URL sync).
    - Chi tiết sản phẩm: Hình ảnh, thông số kỹ thuật, mô tả, sản phẩm liên quan.
- **Tin Tức (`/news`):**
    - Cập nhật tin tức thị trường, xu hướng nội thất.
- **Dự Án (`/projects`):**
    - Showcase các dự án đã thực hiện (hình ảnh, khách hàng, ngày hoàn thành).
- **Giỏ Hàng & Thanh Toán:**
    - Thêm/Sửa/Xóa sản phẩm trong giỏ hàng (`/cart`).
    - Thanh toán (`/checkout`): Hỗ trợ đặt hàng không cần đăng nhập (Guest Checkout).
    - Lưu đơn hàng vào cơ sở dữ liệu.

### 2. Quản Trị Viên (Admin) - `/admin`
- **Quản Lý Sản Phẩm:**
    - Xem danh sách, Thêm mới, Sửa, Xóa sản phẩm.
    - Upload hình ảnh sản phẩm lên Supabase Storage.
- **Quản Lý Tin Tức:**
    - Đăng bài viết mới, chỉnh sửa nội dung.
- **Quản Lý Dự Án:**
    - Cập nhật thông tin dự án mới.
- **Quản Lý Đơn Hàng:** (Đang phát triển)

## 🗄️ Cấu Trúc Cơ Sở Dữ Liệu (Supabase)

Dự án sử dụng các bảng sau trong PostgreSQL:

1.  **`categories`**: Danh mục sản phẩm (Ván MDF, MFC, Gỗ ghép...).
2.  **`products`**: Thông tin chi tiết sản phẩm, giá, kho, thông số kỹ thuật (JSONB).
3.  **`news`**: Bài viết tin tức.
4.  **`projects`**: Thông tin dự án đã thực hiện.
5.  **`orders`**: Đơn hàng (Thông tin khách hàng, tổng tiền, trạng thái).
6.  **`order_items`**: Chi tiết sản phẩm trong đơn hàng.

## 🛠️ Hướng Dẫn Cài Đặt

### 1. Clone dự án
```bash
git clone https://github.com/VanhPoker/bandogo.git
cd bandogo
```

### 2. Cài đặt dependencies
```bash
pnpm install
```

### 3. Cấu hình môi trường
Tạo file `.env` tại thư mục gốc và điền thông tin Supabase của bạn:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Thiết lập Database
Chạy các file SQL trong thư mục `supabase/migrations` hoặc `supabase/seed_data.sql` trên SQL Editor của Supabase để tạo bảng và dữ liệu mẫu.

- `supabase/migrations/20251205154500_add_news_projects.sql`: Tạo bảng News và Projects.
- `supabase/migrations/20251205160000_add_orders.sql`: Tạo bảng Orders và Order Items.
- `supabase/seed_data.sql`: Dữ liệu mẫu (Categories, Products, News, Projects).

### 5. Chạy dự án
```bash
pnpm dev
```
Truy cập `http://localhost:8080` để xem kết quả.

## 📂 Cấu Trúc Thư Mục

```
src/
├── components/         # Các component tái sử dụng (Header, Footer, UI...)
│   ├── admin/          # Component dành riêng cho trang Admin
│   └── ui/             # Shadcn UI components
├── hooks/              # Custom hooks (useCart, useAuth, useProducts...)
├── pages/              # Các trang chính (Index, Products, Admin, Checkout...)
├── integrations/       # Cấu hình Supabase client
└── App.tsx             # Routing và Layout chính
```
