# Cài đặt & chạy dự án

Hướng dẫn dựng Bandogo từ số 0 trên máy mới. Làm đúng thứ tự 5 bước dưới là chạy được.

## 0. Yêu cầu

| Thứ | Phiên bản | Ghi chú |
|---|---|---|
| Node.js | >= 18 | Vite 5 cần Node 18+ |
| pnpm | 10.12.1 | Bị ghim trong `package.json` → `packageManager`. Bật bằng `corepack enable` |
| Tài khoản Supabase | — | Bản free là đủ |

Repo có sẵn cả `bun.lockb`, `package-lock.json` và `pnpm-lock.yaml`, nhưng **pnpm là
nguồn sự thật** vì trường `packageManager` thắng mọi cơ chế tự dò lockfile (Vercel
cũng theo trường này). Dùng npm/bun sẽ ra cây phụ thuộc khác.

```bash
corepack enable
corepack prepare pnpm@10.12.1 --activate
```

## 1. Clone và cài phụ thuộc

```bash
git clone https://github.com/VanhPoker/bandogo.git
cd bandogo
pnpm install
```

## 2. Dựng database trên Supabase

Tạo project mới tại [supabase.com](https://supabase.com), ghi lại **Project Ref**
(chuỗi trong URL `https://<ref>.supabase.co`).

Vào Dashboard → SQL Editor, chạy hai script theo đúng thứ tự này:

| Thứ tự | Script | Nội dung |
|---|---|---|
| 1 | `supabase/setup_full.sql` | 14 bảng, enum `app_role`, 4 function, trigger, toàn bộ RLS policy, storage bucket `product-images`, và dữ liệu mẫu |
| 2 | `supabase/seed_images.sql` | Gán URL ảnh cho 17 sản phẩm, 5 tin tức, 4 dự án |

> **Cảnh báo:** `setup_full.sql` bắt đầu bằng `drop table ... cascade` cho mọi bảng
> ứng dụng. Nó **xoá sạch dữ liệu hiện có**. Chỉ chạy trên project trống, hoặc khi
> bạn cố tình muốn reset toàn bộ.

Chi tiết schema: [DATABASE.md](DATABASE.md).

### Ảnh nằm ở đâu

`seed_images.sql` trỏ tới bucket public `product-images/seed/` của project
`jjcpxtoscmljbshilsov`. Nếu bạn dùng project Supabase riêng, có 2 lựa chọn:

- **Giữ nguyên** — URL vẫn chạy vì bucket đó là public.
- **Tự host** — upload lại 26 file ảnh vào bucket của bạn rồi sửa dòng `insert into _img`
  ở đầu `seed_images.sql` thành base URL mới.

Nguồn từng ảnh ghi trong `supabase/IMAGE_CREDITS.md` — toàn bộ là CC0 / Public Domain,
dùng thương mại được, không cần ghi công.

## 3. Biến môi trường

```bash
cp .env.example .env
```

Điền từ Supabase Dashboard → Settings → API:

```env
VITE_SUPABASE_PROJECT_ID="jjcpxtoscmljbshilsov"
VITE_SUPABASE_URL="https://jjcpxtoscmljbshilsov.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="sb_publishable_..."
```

Cách nhanh hơn, script tự viết cả `.env`, `src/integrations/supabase/client.ts` và
`supabase/config.toml`:

```bash
bash scripts/point-to-project.sh <PROJECT_REF> <PUBLISHABLE_KEY>
```

**Chỉ dùng publishable key** (`sb_publishable_...`, hoặc anon JWT ở project cũ). Key này
public theo thiết kế — nó đi thẳng vào bundle JS mà ai cũng tải được, an toàn vì mọi
quyền đều bị RLS chặn ở phía database.

**Không bao giờ** đặt `sb_secret_...` / `service_role` vào biến `VITE_*`. Mọi biến
`VITE_*` đều bị nhúng thẳng vào file JS công khai; secret key bỏ qua toàn bộ RLS nên
lộ ra là mất sạch database.

`.env` đã nằm trong `.gitignore`.

### Vì sao build được kể cả khi không có `.env`

`src/integrations/supabase/client.ts` có fallback cứng:

```ts
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? "https://jjcpxtoscmljbshilsov.supabase.co";
```

Nên `pnpm build` không vỡ khi thiếu `.env` (Vercel không cần khai báo env var nào).
Muốn tách hẳn khỏi project mặc định thì sửa file này, hoặc chạy `point-to-project.sh`.

## 4. Chạy local

```bash
pnpm dev
```

Mở http://localhost:8080 — port khai trong `vite.config.ts`, **không phải** 5173 mặc định.

Các lệnh khác:

```bash
pnpm build       # build production ra dist/
pnpm build:dev   # build ở mode development (source map, không minify)
pnpm preview     # phục vụ dist/ để kiểm tra bản build
pnpm lint        # eslint
```

## 5. Tạo tài khoản admin

Đăng ký tài khoản qua giao diện tại `/auth`. Trigger `on_auth_user_created` tự tạo
row `profiles` và gán role `user`.

Nâng lên admin bằng SQL Editor:

```sql
insert into public.user_roles (user_id, role)
select id, 'admin' from auth.users where email = 'you@example.com'
on conflict (user_id, role) do nothing;
```

Đăng xuất, đăng nhập lại, rồi vào `/admin`.

## Xử lý sự cố

| Triệu chứng | Nguyên nhân | Cách xử |
|---|---|---|
| Trang trắng, console báo `Invalid API key` | Sai key hoặc sai project ref | Chạy lại `point-to-project.sh` |
| Danh sách sản phẩm rỗng nhưng không có lỗi | Chưa chạy `setup_full.sql`, hoặc RLS chặn | Kiểm tra `select count(*) from products where is_active = true` |
| Ảnh vỡ hết | Chưa chạy `seed_images.sql` | Chạy script bước 2 |
| `/admin` đá về trang chủ | Tài khoản chưa có role admin | Chạy SQL ở bước 5, rồi đăng nhập lại |
| `infinite recursion detected in policy` | Policy cũ tự truy vấn `user_roles` | Chạy `supabase/fix_rls_recursion.sql` — nó thay bằng function `SECURITY DEFINER` |
| pnpm báo lệch phiên bản | Chưa bật corepack | `corepack enable` |
