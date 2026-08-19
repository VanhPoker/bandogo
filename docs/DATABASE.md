# Cấu trúc database

Backend là Supabase (PostgreSQL + PostgREST + Auth + Storage). Không có server riêng —
frontend gọi thẳng PostgREST bằng publishable key, **mọi phân quyền do RLS ở database
quyết định**. Đây là điểm quan trọng nhất cần nắm: sửa policy sai là thủng quyền, không
có tầng backend nào đỡ hộ.

## File SQL

| File | Vai trò |
|---|---|
| `supabase/setup_full.sql` | Script chính. Drop + tạo lại toàn bộ schema, RLS, storage, kèm dữ liệu mẫu |
| `supabase/seed_images.sql` | Gán URL ảnh vào `products.images`, `news.image`, `projects.image`. Idempotent, chạy lại nhiều lần được |
| `supabase/fix_rls_recursion.sql` | Vá riêng lỗi đệ quy RLS trên `user_roles` (đã gộp sẵn vào `setup_full.sql`) |
| `supabase/seed_data.sql` | Seed cũ, giữ lại để tham khảo. `setup_full.sql` đã bao trùm |
| `supabase/migrations/` | Lịch sử migration do Lovable sinh ra. Không dùng để dựng mới |
| `supabase/IMAGE_CREDITS.md` | Nguồn 26 ảnh, kèm license |

## Enum và function

```sql
create type public.app_role as enum ('admin', 'user');
```

| Function | Kiểu | Công dụng |
|---|---|---|
| `update_updated_at_column()` | trigger | Set `updated_at = now()` trước mỗi UPDATE |
| `has_role(_user_id uuid, _role app_role)` | `security definer`, stable | Kiểm tra user có role không |
| `is_admin()` | `security definer`, stable | Rút gọn của `has_role(auth.uid(), 'admin')` |
| `handle_new_user()` | `security definer` trigger | Chạy sau khi có row mới ở `auth.users`: tạo `profiles` + gán role `user` |

### Vì sao `has_role` / `is_admin` phải là `SECURITY DEFINER`

Policy trên `user_roles` cần biết user có phải admin không → phải đọc `user_roles` →
lại kích hoạt policy đó → **đệ quy vô hạn** (`infinite recursion detected in policy`).
`SECURITY DEFINER` chạy hàm dưới quyền owner nên bỏ qua RLS, cắt vòng lặp. Cả hai đều
có `set search_path = public` để chặn tấn công chiếm quyền qua search_path.

Trigger `on_auth_user_created` gắn `after insert on auth.users` — nên user đăng ký qua
giao diện là tự có profile và role, không cần code frontend làm gì thêm.

## 14 bảng

### Danh tính

| Bảng | Cột chính | RLS |
|---|---|---|
| `profiles` | `user_id` (unique, FK `auth.users`, cascade), `display_name`, `avatar_url`, `phone`, `address` | User xem/sửa của mình; admin xem hết |
| `user_roles` | `user_id`, `role` (`app_role`), unique `(user_id, role)` | User xem role của mình; **chỉ admin sửa được** |

### Danh mục sản phẩm

| Bảng | Cột chính | RLS |
|---|---|---|
| `categories` | `name` (unique), `description` | Ai cũng đọc; chỉ admin ghi |
| `products` | `name`, `price numeric(12,2)`, `cost_price`, `images text[]`, `category text`, `specifications jsonb`, `stock_quantity`, `is_active` | Khách chỉ thấy `is_active = true`; admin thấy hết và toàn quyền |

`products.category` là **cột text**, không phải FK sang `categories`. Truy vấn theo
danh mục dùng so sánh chuỗi, đừng join. Index: `category`, `is_active`, `created_at desc`.

`images` là mảng text URL. `specifications` là JSONB tự do (độ dày, kích thước, cốt gỗ...).

### Nội dung

| Bảng | Cột chính | RLS |
|---|---|---|
| `news` | `title`, `content`, `image`, `author` | Ai cũng đọc; chỉ admin ghi |
| `projects` | `title`, `description`, `content`, `image`, `client`, `completion_date` | Ai cũng đọc; chỉ admin ghi |

### Bán hàng

| Bảng | Cột chính | RLS |
|---|---|---|
| `orders` | `user_id` (**nullable** — cho khách vãng lai), `total_amount`, `shipping_name/phone/address`, `payment_method`, `status`, cụm `customer_*` + `invoice_requested` để xuất hóa đơn VAT | User xem đơn của mình; admin xem + sửa hết; **ai cũng insert được** |
| `order_items` | `order_id` (cascade delete), `product_id`, `quantity`, `price` | User xem qua đơn của mình; admin xem hết; insert được nếu `order_id` tồn tại |

`orders.user_id` nullable là cố ý — hỗ trợ đặt hàng không cần đăng nhập. Đổi lại,
policy insert là `with check (true)`: **bất kỳ ai cũng tạo được đơn**. Bắt buộc phải
vậy để guest checkout chạy, nhưng nghĩa là endpoint này hở với spam. Có traffic thật
thì nên đặt rate limit ở tầng Edge Function hoặc bật CAPTCHA.

`order_items.price` lưu giá **tại thời điểm mua**, không đọc lại từ `products` — đổi giá
sản phẩm sau này không làm sai lịch sử đơn.

### Mua hàng / nhập kho

| Bảng | Cột chính | RLS |
|---|---|---|
| `suppliers` | `name`, `contact_person`, `phone`, `email`, `address`, `tax_code` | `Enable all access for authenticated users` |
| `import_orders` | `supplier_id`, `total_amount`, `status` (`pending`/`completed`/`cancelled`), `invoice_number`, `created_by` | như trên |
| `import_order_items` | `import_order_id` (cascade), `product_id`, `quantity`, `import_price`, `total_price` | như trên |

> **Lưu ý bảo mật:** 3 bảng này mở cho **mọi user đã đăng nhập**, không riêng admin.
> Nghĩa là một tài khoản khách bình thường vẫn đọc và sửa được giá nhập cùng thông tin
> nhà cung cấp. Trước khi chạy thật nên siết lại thành `using (public.is_admin())` cho
> khớp với các bảng khác.

### Nghiệp vụ mở rộng

| Bảng | Ghi chú |
|---|---|
| `contracts` | Hợp đồng: `contract_number` unique, `client_info`/`products`/`terms`/`documents` dạng jsonb, có trường xuất khẩu (`incoterms`, cảng đi/đến). Chỉ admin |
| `quotes` | Báo giá: `quote_number` unique, `items` jsonb, `valid_until`. User xem báo giá của mình; admin toàn quyền |
| `shipments` | Vận đơn: `tracking_number` unique, link tới `orders` hoặc `contracts`, `updates` jsonb là lịch sử trạng thái. Chỉ admin |

Ba bảng này đã có schema nhưng giao diện chưa nối đầy đủ — coi như phần khung sẵn.

## Storage

Bucket public `product-images`:

```sql
insert into storage.buckets (id, name, public) values ('product-images','product-images',true)
on conflict (id) do update set public = true;
```

| Thao tác | Ai được làm |
|---|---|
| select (đọc ảnh) | Tất cả, kể cả chưa đăng nhập |
| insert / update / delete | Chỉ admin |

Ảnh seed nằm ở prefix `seed/`. URL public có dạng:

```
https://<ref>.supabase.co/storage/v1/object/public/product-images/seed/<ten>.jpg
```

## Dữ liệu mẫu

`setup_full.sql` seed sẵn: 9 danh mục, 17 sản phẩm, 5 tin tức, 4 dự án, 4 nhà cung cấp,
4 đơn nhập (12 dòng chi tiết), 30 đơn hàng (81 dòng chi tiết). Đơn hàng trải qua nhiều
tháng để biểu đồ doanh thu ở trang admin có số liệu.

## Reset sạch

```sql
-- Xoá + tạo lại toàn bộ. MẤT HẾT DỮ LIỆU.
-- Chạy nội dung supabase/setup_full.sql
-- rồi supabase/seed_images.sql
```

Tài khoản trong `auth.users` **không** bị xoá (script chỉ đụng schema `public`). Nhưng
`profiles` và `user_roles` bị tạo lại, nên sau khi reset phải chạy lại lệnh cấp admin
ở [SETUP.md](SETUP.md).
