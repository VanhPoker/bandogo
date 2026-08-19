# Triển khai

Bản chạy thật: https://bandogo.vercel.app — host trên Vercel, tự deploy mỗi lần push
lên nhánh `main`.

## Cách deploy hiện tại

Project Vercel đã nối git với `VanhPoker/bandogo`. Quy trình:

```bash
git push origin main
```

Xong. Vercel tự build và phát hành. Không cần chạy `vercel deploy`.

Cấu hình Vercel tự dò ra, không cần chỉnh:

| Mục | Giá trị |
|---|---|
| Framework | Vite |
| Build command | `pnpm build` |
| Output | `dist` |
| Package manager | pnpm 10.12.1 (theo trường `packageManager` trong `package.json`) |
| Environment variables | **Không cần đặt cái nào** |

Không cần env var vì `src/integrations/supabase/client.ts` có fallback cứng cho URL và
publishable key. Trỏ sang project Supabase khác thì hoặc sửa file đó, hoặc khai
`VITE_SUPABASE_URL` + `VITE_SUPABASE_PUBLISHABLE_KEY` trong Vercel → Settings →
Environment Variables (biến env thắng fallback).

## Hai file cấu hình

### `vercel.json`

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

**Bắt buộc phải có.** App dùng `BrowserRouter` của React Router — định tuyến nằm hết ở
phía trình duyệt. Thiếu rewrite này thì mở thẳng `https://bandogo.vercel.app/products`
hay F5 giữa trang sẽ ra 404, vì trên server không tồn tại file nào tên `/products`.

### `.vercelignore`

```
dist
node_modules
.git
```

Chặn upload thư mục nặng khi deploy bằng CLI.

## Dựng project Vercel mới

1. [vercel.com/new](https://vercel.com/new) → import repo GitHub.
2. Giữ nguyên mặc định (Vercel nhận ra Vite).
3. Deploy.
4. Settings → Deployment Protection → tắt nếu muốn ai cũng xem được. Bật thì mọi request
   bị chuyển hướng 302 sang trang đăng nhập Vercel.

## Kiểm tra sau khi deploy

```bash
# Trang chủ và deep link đều phải trả 200
for p in / /products /news /projects /cart; do
  printf '%-12s %s\n' "$p" "$(curl -s -o /dev/null -w '%{http_code}' https://bandogo.vercel.app$p)"
done

# Bundle phải chứa URL Supabase, và tuyệt đối không chứa secret key
curl -s https://bandogo.vercel.app/assets/index-*.js | grep -c 'sb_secret_'   # phải ra 0
```

Deep link trả 404 → thiếu `vercel.json`. Trả 302 → Deployment Protection còn bật.

## Lỗi từng gặp

Ghi lại để lần sau khỏi mò.

### `Error: fetch failed` khi chạy `vercel deploy`

Payload upload quá lớn — `public/` 51MB cộng `dist/` 59MB, mà lúc đó chưa có
`.vercelignore`. Cách xử: thêm `.vercelignore` rồi chuyển hẳn sang deploy qua git
(`vercel git connect`), khỏi upload từ máy.

### Mọi path trả 302 về `vercel.com/sso-api`

Deployment Protection đang bật (`ssoProtection: all_except_custom_domains`). Tắt ở
Settings → Deployment Protection, hoặc qua API:

```bash
curl -X PATCH "https://api.vercel.com/v9/projects/$PROJECT_ID?teamId=$TEAM_ID" \
  -H "Authorization: Bearer $VERCEL_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"ssoProtection": null}'
```

### Deployment ở trạng thái `BLOCKED`

Lý do trả về:

```
The Deployment was blocked because GitHub could not associate the committer with a GitHub user.
seatBlock: { blockCode: "COMMIT_AUTHOR_REQUIRED" }
```

Email tác giả commit không map được sang tài khoản GitHub nào trong team Vercel. Sửa
`git config` cho khớp email gắn với GitHub rồi commit lại:

```bash
git config user.name  "VanhPoker"
git config user.email "vietanh951325@gmail.com"
```

Không cần force-push hay viết lại lịch sử — một commit mới đúng tác giả là qua.

### Vercel cài bằng npm thay vì pnpm

Repo đang có cả `bun.lockb`, `package-lock.json`, `pnpm-lock.yaml`. Trường
`packageManager` trong `package.json` thắng cơ chế dò lockfile, nên Vercel vẫn dùng
pnpm. Đừng xoá trường đó.

## Chạy thử build y hệt Vercel

Trước khi push, muốn chắc:

```bash
corepack pnpm install --frozen-lockfile
corepack pnpm build
corepack pnpm preview
```

## Cần tối ưu

Đo trên bản deploy hiện tại:

- **`public/` nặng 51MB** — 5 file PNG ~26MB, `favicon.ico` **4.4MB**, một video 12MB.
  Tất cả nằm trong thư mục tĩnh nên đẩy tới trình duyệt người dùng. Nén favicon xuống
  dưới 50KB là việc lời nhất, làm 1 phút.
- **Bundle JS 1.13MB** — Vite cảnh báo vượt ngưỡng 500KB. Muốn giảm thì chia mã theo
  route bằng `React.lazy()`, đặc biệt là `Admin.tsx` và các trang in ấn (khách hàng
  không bao giờ cần tới).
