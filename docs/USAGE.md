# Hướng dẫn sử dụng

Website có hai mặt: phần khách hàng (public) và trang quản trị `/admin`.

Bản chạy thật: https://bandogo.vercel.app

## Bản đồ route

| Path | Trang | Cần đăng nhập |
|---|---|---|
| `/` | Trang chủ | Không |
| `/products` | Danh sách sản phẩm | Không |
| `/products/:id` | Chi tiết sản phẩm | Không |
| `/news` | Tin tức | Không |
| `/projects` | Dự án đã làm | Không |
| `/about` | Giới thiệu | Không |
| `/contact` | Liên hệ | Không |
| `/cart` | Giỏ hàng | Không |
| `/checkout` | Thanh toán | Không (guest checkout được) |
| `/order-success` | Đặt hàng thành công | Không |
| `/orders` | Đơn hàng của tôi | Có |
| `/profile` | Hồ sơ cá nhân | Có |
| `/auth` | Đăng nhập / Đăng ký | — |
| `/admin` | Trang quản trị | Có, **role admin** |
| `/print/import/:id` | In phiếu nhập kho | Admin |
| `/print/order/:id` | In hóa đơn bán hàng | Admin |

Route dùng tiếng Anh (`/products`, `/news`), không phải tiếng Việt. Path lạ rơi vào
trang `NotFound`.

## Luồng khách hàng

### Mua hàng

1. `/products` → lọc theo danh mục, mở chi tiết.
2. `/products/:id` → chọn số lượng → **Thêm vào giỏ**.
3. `/cart` → sửa số lượng, xoá dòng, xem tổng tiền.
4. `/checkout` → điền họ tên, số điện thoại, địa chỉ giao hàng.
5. Chọn thanh toán: **COD** (`cod`) hoặc **Chuyển khoản ngân hàng** (`banking`).
6. Cần hóa đơn VAT thì bật `invoice_requested` và điền tên công ty, mã số thuế, địa chỉ xuất hóa đơn.
7. Đặt hàng → ghi 1 row `orders` + n row `order_items`, giỏ hàng được xoá, chuyển sang `/order-success`.

**Không cần tài khoản để mua.** Đặt bằng khách vãng lai thì `orders.user_id = null` —
đơn đó sẽ không hiện ở `/orders` của bất kỳ ai, chỉ admin thấy. Muốn khách tra cứu được
lịch sử thì phải đăng nhập trước khi thanh toán.

### Giỏ hàng lưu ở đâu

`localStorage` key `cart`, quản lý bởi `src/hooks/useCart.tsx`. Suy ra:

- Giỏ hàng sống qua reload, nhưng **không đồng bộ giữa các thiết bị**.
- Xoá dữ liệu duyệt web / dùng chế độ ẩn danh là mất giỏ hàng.
- Không có bản sao dưới database.

### Tài khoản

- `/auth` — đăng ký bằng email + mật khẩu. Trigger database tự tạo profile và gán role `user`.
- `/profile` — sửa tên hiển thị, số điện thoại, địa chỉ.
- `/orders` — chỉ hiện đơn có `user_id` khớp tài khoản đang đăng nhập.

## Trang quản trị

Vào `/admin` bằng tài khoản có role `admin` (cách cấp quyền ở [SETUP.md](SETUP.md#5-tạo-tài-khoản-admin)).
Tài khoản không phải admin sẽ bị chặn — RLS trả về rỗng nên có cố mở cũng không thấy dữ liệu.

Có 8 tab:

| Tab | Làm được gì |
|---|---|
| **Sản phẩm** (`products`) | Thêm / sửa / xoá, đặt giá bán và giá vốn, tồn kho, thông số kỹ thuật (JSON), ảnh, bật tắt `is_active` |
| **Nhập hàng** (`import`) | Tạo đơn nhập từ nhà cung cấp, thêm dòng hàng với giá nhập, in phiếu nhập kho |
| **Đơn hàng** (`orders`) | Xem toàn bộ đơn kể cả khách vãng lai, đổi trạng thái, in hóa đơn |
| **Nhà cung cấp** (`suppliers`) | Sổ nhà cung cấp: liên hệ, mã số thuế |
| **Tin tức** (`news`) | Soạn / sửa / xoá bài viết |
| **Dự án** (`projects`) | Quản lý dự án đã thực hiện |
| **Người dùng** (`users`) | Xem tài khoản đã đăng ký và role |
| **Cài đặt** (`settings`) | Thiết lập chung |

Trang chủ admin còn có biểu đồ doanh thu (`RevenueChart.tsx`) dựng từ dữ liệu `orders`.

### Trạng thái đơn hàng

Danh sách khai trong `src/pages/Admin.tsx` (`ORDER_STATUSES`):

| Giá trị | Nhãn |
|---|---|
| `pending` | Chờ xử lý |
| `processing` | Đang xử lý |
| `shipped` | Đang giao |
| `delivered` | Đã giao |
| `cancelled` | Đã hủy |

`orders.status` là **cột text tự do, không phải enum** — database không ép giá trị hợp
lệ. Ghi thẳng giá trị lạ qua API là lọt, không báo lỗi.

### Tồn kho tự động

| Sự kiện | Tác động lên `products.stock_quantity` |
|---|---|
| Đơn bán chuyển sang `delivered` | **Trừ** theo số lượng từng dòng `order_items` |
| Đơn nhập chuyển sang `completed` | **Cộng** theo số lượng từng dòng `import_order_items` |

Chỉ trừ khi trạng thái **trước đó chưa phải** `delivered`, nên bấm lại nhiều lần không
trừ trùng. Sàn dưới là 0 (`Math.max(0, ...)`).

Hai giới hạn nên biết:

- Logic chạy **ở phía client** theo kiểu đọc-rồi-ghi (`select stock_quantity` → `update`),
  không phải giao dịch nguyên tử. Hai admin cùng lúc xử lý hai đơn chứa cùng sản phẩm
  có thể ghi đè nhau làm sai số tồn.
- Đặt hàng **không** giữ chỗ tồn kho. Kho chỉ giảm lúc giao xong, nên vẫn bán vượt số
  lượng thực có được.

### In ấn

- `/print/order/:id` — hóa đơn bán hàng
- `/print/import/:id` — phiếu nhập kho

Hai trang này layout riêng cho máy in, mở rồi Ctrl/Cmd + P.

## Điều chưa có

Nói thẳng để khỏi mất công tìm:

- **Không có cổng thanh toán.** Chọn `banking` chỉ ghi chuỗi đó vào đơn, không sinh QR,
  không đối soát. Xác nhận tiền vào là thủ công.
- **Không gửi email.** Đặt hàng xong không có mail xác nhận cho khách lẫn admin.
- **`contracts` / `quotes` / `shipments`** đã có bảng nhưng giao diện chưa nối đầy đủ.
- **Tìm kiếm** chỉ là `product.name.toLowerCase().includes(...)` chạy trên danh sách đã
  tải về máy khách, không phải full-text search dưới database. Danh mục lớn lên là phải
  đổi sang `ilike` hoặc `textSearch` phía PostgREST.
