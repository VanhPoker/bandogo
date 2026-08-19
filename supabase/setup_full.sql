-- =====================================================================
-- bandogo — full database setup (schema + RLS + storage + seed data)
-- Consolidates supabase/migrations/*.sql + fix_rls_recursion.sql
-- + supabase/seed_data.sql + seed.sql into one runnable script.
--
-- Run in Supabase Dashboard -> SQL Editor (role: postgres).
-- WARNING: section 1 DROPs the application tables. Intended for a fresh
-- project. It does NOT touch auth.users.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. Clean slate (application tables only)
-- ---------------------------------------------------------------------
drop table if exists public.import_order_items cascade;
drop table if exists public.import_orders cascade;
drop table if exists public.suppliers cascade;
drop table if exists public.order_items cascade;
drop table if exists public.shipments cascade;
drop table if exists public.orders cascade;
drop table if exists public.quotes cascade;
drop table if exists public.contracts cascade;
drop table if exists public.products cascade;
drop table if exists public.categories cascade;
drop table if exists public.news cascade;
drop table if exists public.projects cascade;
drop table if exists public.user_roles cascade;
drop table if exists public.profiles cascade;

-- ---------------------------------------------------------------------
-- 2. Types
-- ---------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'app_role') then
    create type public.app_role as enum ('admin', 'user');
  end if;
end $$;

-- ---------------------------------------------------------------------
-- 3. Shared functions
-- ---------------------------------------------------------------------
create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------
-- 4. Identity: profiles + user_roles
-- ---------------------------------------------------------------------
create table public.profiles (
  id uuid not null default gen_random_uuid() primary key,
  user_id uuid not null unique references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  phone text,
  address text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_roles (
  id uuid not null default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;

-- has_role / is_admin are SECURITY DEFINER so RLS on user_roles does not
-- recurse when policies call them.
create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

create or replace function public.is_admin()
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  return exists (
    select 1 from public.user_roles
    where user_id = auth.uid() and role = 'admin'
  );
end;
$$;

-- New signups get a profile row and the default 'user' role.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', new.email))
  on conflict (user_id) do nothing;

  insert into public.user_roles (user_id, role)
  values (new.id, 'user')
  on conflict (user_id, role) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create trigger update_profiles_updated_at
  before update on public.profiles
  for each row execute function public.update_updated_at_column();

create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = user_id);
create policy "Admins can view all profiles" on public.profiles
  for select using (public.is_admin());
create policy "Users can update their own profile" on public.profiles
  for update using (auth.uid() = user_id);
create policy "Users can insert their own profile" on public.profiles
  for insert with check (auth.uid() = user_id);

create policy "Users can view own role" on public.user_roles
  for select using (auth.uid() = user_id);
create policy "Admins can view all user_roles" on public.user_roles
  for select using (public.is_admin());
create policy "Admins can manage user_roles" on public.user_roles
  for all using (public.is_admin());

-- ---------------------------------------------------------------------
-- 5. Catalog: categories + products
-- ---------------------------------------------------------------------
create table public.categories (
  id uuid not null default gen_random_uuid() primary key,
  name text not null unique,
  description text,
  created_at timestamptz not null default now()
);

create table public.products (
  id uuid not null default gen_random_uuid() primary key,
  name text not null,
  description text,
  price numeric(12,2) not null,
  cost_price numeric default 0,
  images text[],
  category text not null default 'other',
  specifications jsonb,
  stock_quantity integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.categories enable row level security;
alter table public.products enable row level security;

create index idx_products_category on public.products(category);
create index idx_products_is_active on public.products(is_active);
create index idx_products_created_at on public.products(created_at desc);

create trigger update_products_updated_at
  before update on public.products
  for each row execute function public.update_updated_at_column();

create policy "Anyone can view categories" on public.categories
  for select using (true);
create policy "Admins can manage categories" on public.categories
  for all using (public.has_role(auth.uid(), 'admin'::public.app_role));

create policy "Anyone can view active products" on public.products
  for select using (is_active = true);
create policy "Admins can view all products" on public.products
  for select using (public.has_role(auth.uid(), 'admin'::public.app_role));
create policy "Admins can insert products" on public.products
  for insert with check (public.has_role(auth.uid(), 'admin'::public.app_role));
create policy "Admins can update products" on public.products
  for update using (public.has_role(auth.uid(), 'admin'::public.app_role));
create policy "Admins can delete products" on public.products
  for delete using (public.has_role(auth.uid(), 'admin'::public.app_role));

-- ---------------------------------------------------------------------
-- 6. Content: news + projects
-- ---------------------------------------------------------------------
create table public.news (
  id uuid not null default gen_random_uuid() primary key,
  title text not null,
  content text not null,
  image text,
  author text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.projects (
  id uuid not null default gen_random_uuid() primary key,
  title text not null,
  description text not null,
  content text,
  image text,
  client text,
  completion_date timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.news enable row level security;
alter table public.projects enable row level security;

create trigger update_news_updated_at
  before update on public.news
  for each row execute function public.update_updated_at_column();
create trigger update_projects_updated_at
  before update on public.projects
  for each row execute function public.update_updated_at_column();

create policy "Anyone can view news" on public.news
  for select using (true);
create policy "Admins can manage news" on public.news
  for all using (public.has_role(auth.uid(), 'admin'::public.app_role));

create policy "Anyone can view projects" on public.projects
  for select using (true);
create policy "Admins can manage projects" on public.projects
  for all using (public.has_role(auth.uid(), 'admin'::public.app_role));

-- ---------------------------------------------------------------------
-- 7. Sales: orders + order_items
-- ---------------------------------------------------------------------
create table public.orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id),  -- null for guest checkout
  total_amount numeric(12,2) not null,
  shipping_name text not null,
  shipping_phone text not null,
  shipping_address text not null,
  payment_method text not null,
  status text default 'pending',
  customer_company text,
  customer_tax_code text,
  customer_address_invoice text,
  invoice_requested boolean default false,
  created_at timestamptz not null default timezone('utc'::text, now())
);

create table public.order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.orders(id) on delete cascade,
  product_id uuid references public.products(id),
  quantity integer not null,
  price numeric(12,2) not null,
  created_at timestamptz not null default timezone('utc'::text, now())
);

alter table public.orders enable row level security;
alter table public.order_items enable row level security;

create index idx_orders_user_id on public.orders(user_id);
create index idx_order_items_order_id on public.order_items(order_id);

create policy "Users can view own orders" on public.orders
  for select using (auth.uid() = user_id);
create policy "Admins can view all orders" on public.orders
  for select using (public.is_admin());
create policy "Anyone can insert orders" on public.orders
  for insert with check (true);
create policy "Admins can update all orders" on public.orders
  for update using (public.is_admin());

create policy "Users can view own order items" on public.order_items
  for select using (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
        and orders.user_id = auth.uid()
    )
  );
create policy "Admins can view all order items" on public.order_items
  for select using (public.is_admin());
create policy "Anyone can insert order items" on public.order_items
  for insert with check (
    exists (select 1 from public.orders where orders.id = order_items.order_id)
  );

-- ---------------------------------------------------------------------
-- 8. Purchasing: suppliers + import orders
-- ---------------------------------------------------------------------
create table public.suppliers (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  contact_person text,
  phone text,
  email text,
  address text,
  tax_code text,
  created_at timestamptz not null default timezone('utc'::text, now())
);

create table public.import_orders (
  id uuid default gen_random_uuid() primary key,
  supplier_id uuid references public.suppliers(id),
  total_amount numeric not null default 0,
  status text not null default 'pending',  -- pending | completed | cancelled
  invoice_number text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default timezone('utc'::text, now())
);

create table public.import_order_items (
  id uuid default gen_random_uuid() primary key,
  import_order_id uuid references public.import_orders(id) on delete cascade,
  product_id uuid references public.products(id),
  quantity integer not null,
  import_price numeric not null,
  total_price numeric not null,
  created_at timestamptz not null default timezone('utc'::text, now())
);

alter table public.suppliers enable row level security;
alter table public.import_orders enable row level security;
alter table public.import_order_items enable row level security;

create policy "Enable all access for authenticated users" on public.suppliers
  for all using (auth.role() = 'authenticated');
create policy "Enable all access for authenticated users" on public.import_orders
  for all using (auth.role() = 'authenticated');
create policy "Enable all access for authenticated users" on public.import_order_items
  for all using (auth.role() = 'authenticated');

-- ---------------------------------------------------------------------
-- 9. B2B tables present in generated types.ts (contracts/quotes/shipments)
-- ---------------------------------------------------------------------
create table public.contracts (
  id uuid not null default gen_random_uuid() primary key,
  contract_number text not null unique,
  client_name text not null,
  client_info jsonb not null,
  contract_type text not null,
  contract_value numeric not null,
  status text not null default 'draft',
  products jsonb not null default '[]'::jsonb,
  terms jsonb,
  signed_date date,
  delivery_date date,
  port_of_origin text,
  port_of_destination text,
  incoterms text,
  payment_terms text,
  documents jsonb default '[]'::jsonb,
  created_by uuid not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.quotes (
  id uuid not null default gen_random_uuid() primary key,
  user_id uuid not null,
  quote_number text not null unique,
  customer_info jsonb not null,
  items jsonb not null default '[]'::jsonb,
  status text not null default 'draft',
  total_estimate numeric not null default 0,
  valid_until date,
  notes text,
  terms text,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.shipments (
  id uuid not null default gen_random_uuid() primary key,
  order_id uuid references public.orders(id),
  contract_id uuid references public.contracts(id),
  tracking_number text not null unique,
  shipping_method text not null,
  carrier text,
  status text not null default 'pending',
  origin_address jsonb,
  destination_address jsonb,
  estimated_pickup date,
  actual_pickup date,
  estimated_delivery date,
  actual_delivery date,
  shipping_cost numeric,
  weight numeric,
  dimensions jsonb,
  updates jsonb default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.contracts enable row level security;
alter table public.quotes enable row level security;
alter table public.shipments enable row level security;

create trigger update_contracts_updated_at
  before update on public.contracts
  for each row execute function public.update_updated_at_column();
create trigger update_quotes_updated_at
  before update on public.quotes
  for each row execute function public.update_updated_at_column();
create trigger update_shipments_updated_at
  before update on public.shipments
  for each row execute function public.update_updated_at_column();

create policy "Admins can manage contracts" on public.contracts
  for all using (public.is_admin());
create policy "Users can view own quotes" on public.quotes
  for select using (auth.uid() = user_id);
create policy "Admins can manage quotes" on public.quotes
  for all using (public.is_admin());
create policy "Admins can manage shipments" on public.shipments
  for all using (public.is_admin());

-- ---------------------------------------------------------------------
-- 10. Storage bucket for product images
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

drop policy if exists "Product images are publicly accessible" on storage.objects;
drop policy if exists "Admins can upload product images" on storage.objects;
drop policy if exists "Admins can update product images" on storage.objects;
drop policy if exists "Admins can delete product images" on storage.objects;

create policy "Product images are publicly accessible" on storage.objects
  for select using (bucket_id = 'product-images');
create policy "Admins can upload product images" on storage.objects
  for insert with check (bucket_id = 'product-images' and public.has_role(auth.uid(), 'admin'::public.app_role));
create policy "Admins can update product images" on storage.objects
  for update using (bucket_id = 'product-images' and public.has_role(auth.uid(), 'admin'::public.app_role));
create policy "Admins can delete product images" on storage.objects
  for delete using (bucket_id = 'product-images' and public.has_role(auth.uid(), 'admin'::public.app_role));

-- =====================================================================
-- SEED DATA
-- =====================================================================

-- 11. Categories -------------------------------------------------------
insert into public.categories (name, description) values
  ('Ván MDF',          'Ván sợi mật độ trung bình, bề mặt mịn, dễ gia công'),
  ('Ván MFC',          'Ván dăm phủ Melamine, đa dạng màu sắc, giá thành hợp lý'),
  ('Gỗ Ghép',          'Gỗ tự nhiên ghép thanh, độ bền cao, vân gỗ đẹp'),
  ('Ván Okal',         'Ván dăm, chịu lực tốt, giá rẻ'),
  ('Ván Ép',           'Ván Plywood, chịu nước tốt, độ bền cao'),
  ('Ván Nhựa PVC',     'Chống nước tuyệt đối, chống mối mọt'),
  ('Ván OSB',          'Ván dăm định hướng, kết cấu chắc chắn, độc đáo'),
  ('Ván Phủ Acrylic',  'Bề mặt bóng gương, sang trọng, hiện đại'),
  ('Phụ kiện',         'Các phụ kiện và vật tư đi kèm')
on conflict (name) do nothing;

-- 12. Products ---------------------------------------------------------
insert into public.products (name, description, price, cost_price, category, stock_quantity, is_active, images, specifications) values
  ('Ván MDF Chống Ẩm 17mm', 'Ván MDF lõi xanh chống ẩm, thích hợp làm tủ bếp, nội thất phòng tắm.', 450000, 340000, 'Ván MDF', 100, true, array['/placeholder.svg'], '{"thickness":"17mm","size":"1220x2440mm","features":["Chống ẩm","Bề mặt mịn"]}'),
  ('Ván MDF Phủ Melamine Trắng', 'Ván MDF phủ Melamine màu trắng, bề mặt chống trầy xước.', 380000, 285000, 'Ván MDF', 150, true, array['/placeholder.svg'], '{"thickness":"17mm","size":"1220x2440mm","color":"Trắng"}'),
  ('Ván MDF Phủ Veneer Sồi', 'Ván MDF phủ Veneer gỗ Sồi tự nhiên, vân gỗ đẹp.', 550000, 420000, 'Ván MDF', 80, true, array['/placeholder.svg'], '{"thickness":"17mm","size":"1220x2440mm","veneer":"Sồi"}'),
  ('Ván MFC Vân Gỗ Xám', 'Ván MFC màu vân gỗ xám hiện đại, phù hợp nội thất văn phòng.', 320000, 240000, 'Ván MFC', 200, true, array['/placeholder.svg'], '{"thickness":"18mm","size":"1220x2440mm","color":"Xám vân gỗ"}'),
  ('Ván MFC Chống Ẩm Lõi Xanh', 'Ván MFC lõi xanh chống ẩm, bền bỉ trong môi trường ẩm.', 360000, 270000, 'Ván MFC', 120, true, array['/placeholder.svg'], '{"thickness":"18mm","size":"1220x2440mm","features":["Chống ẩm"]}'),
  ('Ván MFC Melamine Trắng', 'Ván MFC phủ melamine màu trắng chất lượng cao, chống ẩm tốt.', 850000, 640000, 'Ván MFC', 50, true, array['/placeholder.svg'], '{"thickness":"18mm","size":"2440x1220mm","features":["Chống ẩm","Bề mặt nhẵn","Độ bền cao"]}'),
  ('Gỗ Ghép Cao Su 18mm AA', 'Gỗ ghép cao su chất lượng AA, hai mặt đẹp, không mắt chết.', 650000, 500000, 'Gỗ Ghép', 50, true, array['/placeholder.svg'], '{"thickness":"18mm","size":"1200x2400mm","wood_type":"Cao su"}'),
  ('Gỗ Ghép Thông 12mm', 'Gỗ ghép thông tự nhiên, vân gỗ sáng, mùi thơm nhẹ.', 580000, 445000, 'Gỗ Ghép', 60, true, array['/placeholder.svg'], '{"thickness":"12mm","size":"1200x2400mm","wood_type":"Thông"}'),
  ('Ván Ép Phủ Phim 18mm', 'Ván ép phủ phim đen, dùng cho cốp pha xây dựng, chịu nước tốt.', 420000, 315000, 'Ván Ép', 300, true, array['/placeholder.svg'], '{"thickness":"18mm","size":"1220x2440mm","type":"Cốp pha"}'),
  ('Ván Plywood Nội Thất 12mm', 'Ván Plywood tiêu chuẩn nội thất, bề mặt đẹp.', 350000, 260000, 'Ván Ép', 100, true, array['/placeholder.svg'], '{"thickness":"12mm","size":"1220x2440mm"}'),
  ('Ván Plywood Eucalyptus 12mm', 'Ván plywood gỗ bạch đàn chống mối mọt, độ bền cao.', 1200000, 900000, 'Ván Ép', 30, true, array['/placeholder.svg'], '{"thickness":"12mm","size":"2440x1220mm","features":["Chống mối mọt","Gỗ tự nhiên","Cường độ cao"]}'),
  ('Ván Okal Chống Ẩm 16mm', 'Ván dăm chống ẩm độ bền cao, giá thành hợp lý.', 280000, 205000, 'Ván Okal', 100, true, array['/placeholder.svg'], '{"thickness":"16mm","size":"2440x1220mm","features":["Chống ẩm","Độ bền cao","Giá hợp lý"]}'),
  ('Ván Nhựa PVC 18mm', 'Ván nhựa PVC chống nước tuyệt đối, không cong vênh, chống mối mọt.', 720000, 550000, 'Ván Nhựa PVC', 70, true, array['/placeholder.svg'], '{"thickness":"18mm","size":"1220x2440mm","features":["Chống nước","Chống mối mọt"]}'),
  ('Ván OSB 15mm', 'Ván dăm định hướng OSB, kết cấu chắc chắn, bề mặt độc đáo.', 390000, 295000, 'Ván OSB', 90, true, array['/placeholder.svg'], '{"thickness":"15mm","size":"1220x2440mm"}'),
  ('Ván MDF Phủ Acrylic Bóng Gương', 'Ván MDF phủ Acrylic bóng gương, sang trọng cho tủ bếp hiện đại.', 980000, 760000, 'Ván Phủ Acrylic', 40, true, array['/placeholder.svg'], '{"thickness":"18mm","size":"1220x2440mm","finish":"Bóng gương"}'),
  ('Nẹp Chỉ PVC Dán Cạnh 22mm', 'Nẹp chỉ PVC dán cạnh, đồng bộ màu với ván MFC/MDF.', 15000, 9000, 'Phụ kiện', 1000, true, array['/placeholder.svg'], '{"width":"22mm","unit":"mét"}'),
  ('Keo Dán Gỗ Chuyên Dụng 1kg', 'Keo dán gỗ công nghiệp, bám dính cao, khô nhanh.', 65000, 42000, 'Phụ kiện', 500, true, array['/placeholder.svg'], '{"weight":"1kg"}');

-- 13. News -------------------------------------------------------------
insert into public.news (title, content, author, image) values
  ('Xu hướng nội thất gỗ công nghiệp 2025', 'Năm 2025 đánh dấu sự lên ngôi của các loại ván gỗ công nghiệp thân thiện môi trường và có tính thẩm mỹ cao. Các tông màu trung tính và vân gỗ tự nhiên tiếp tục được ưa chuộng...', 'Admin', '/placeholder.svg'),
  ('Cách bảo quản đồ gỗ công nghiệp bền đẹp', 'Để đồ gỗ công nghiệp luôn bền đẹp, bạn cần tránh để sản phẩm tiếp xúc trực tiếp với nước trong thời gian dài, lau chùi bằng khăn mềm ẩm và tránh ánh nắng gắt...', 'Kỹ thuật viên', '/placeholder.svg'),
  ('Gỗ Sài Gòn Tín Việt mở rộng kho hàng tại Quận 7', 'Nhằm đáp ứng nhu cầu ngày càng tăng của khách hàng, chúng tôi đã chính thức mở rộng hệ thống kho hàng tại Quận 7 với sức chứa lớn hơn và quy trình vận hành hiện đại...', 'Ban Giám Đốc', '/placeholder.svg'),
  ('So sánh ván MDF và ván MFC: nên chọn loại nào?', 'MDF có bề mặt mịn, dễ sơn và tạo hình, phù hợp cho các chi tiết cần phay CNC. MFC phủ Melamine sẵn, thi công nhanh và giá thành thấp hơn, phù hợp tủ văn phòng và nội thất phổ thông...', 'Kỹ thuật viên', '/placeholder.svg'),
  ('Bảng giá ván gỗ công nghiệp cập nhật quý này', 'Do biến động giá nguyên liệu đầu vào và chi phí vận chuyển, bảng giá một số dòng ván đã được điều chỉnh. Quý khách vui lòng liên hệ để nhận báo giá chi tiết theo số lượng...', 'Phòng Kinh Doanh', '/placeholder.svg');

-- 14. Projects ---------------------------------------------------------
insert into public.projects (title, description, content, client, completion_date, image) values
  ('Thi công nội thất căn hộ Vinhomes Grand Park', 'Thiết kế và thi công trọn gói nội thất căn hộ 2 phòng ngủ phong cách hiện đại.', 'Dự án sử dụng chủ yếu ván MDF chống ẩm phủ Melamine. Tông màu chủ đạo là trắng và vân gỗ sồi, tạo cảm giác rộng rãi và ấm cúng. Các hạng mục bao gồm: tủ bếp, tủ quần áo, giường ngủ, kệ tivi.', 'Anh Nam', '2024-11-15', '/placeholder.svg'),
  ('Văn phòng làm việc công ty TechSolution', 'Cung cấp và lắp đặt hệ thống bàn làm việc, tủ hồ sơ cho văn phòng 50 nhân sự.', 'Sử dụng ván MFC chân sắt cho bàn làm việc, đảm bảo độ bền và tính thẩm mỹ. Tủ hồ sơ cao sát trần giúp tối ưu không gian lưu trữ. Thời gian thi công 5 ngày.', 'TechSolution Ltd.', '2024-10-20', '/placeholder.svg'),
  ('Showroom thời trang ChicStyle', 'Thi công kệ trưng bày và quầy thu ngân cho shop thời trang.', 'Sử dụng gỗ ghép cao su phủ keo bóng cho các kệ trưng bày, mang lại vẻ đẹp tự nhiên và sang trọng. Quầy thu ngân kết hợp MDF phủ Acrylic bóng gương tạo điểm nhấn.', 'Chị Lan', '2024-09-05', '/placeholder.svg'),
  ('Chuỗi quán cà phê BeanHouse — 3 chi nhánh', 'Đồng bộ nội thất quầy bar, bàn ghế và kệ trang trí cho 3 chi nhánh.', 'Vật liệu chính là ván ép phủ phim và gỗ ghép thông, xử lý chống ẩm cho khu vực pha chế. Thiết kế module hoá để nhân bản nhanh sang các chi nhánh mới.', 'BeanHouse JSC', '2025-02-28', '/placeholder.svg');

-- 15. Suppliers --------------------------------------------------------
insert into public.suppliers (name, contact_person, phone, email, address, tax_code) values
  ('Công ty TNHH Gỗ An Cường',        'Nguyễn Văn Hùng', '02838123456', 'sales@ancuong.example',   'KCN Sóng Thần 1, Dĩ An, Bình Dương',        '0301234567'),
  ('Công ty CP Ván Nhân Tạo Tân Việt', 'Trần Thị Mai',    '02837654321', 'kinhdoanh@tanviet.example','Lô B12, KCN Tân Bình, TP.HCM',              '0302345678'),
  ('Nhà máy Plywood Bình Dương',       'Lê Quốc Bảo',     '02743889900', 'contact@bdplywood.example','QL13, Thuận An, Bình Dương',                '0303456789'),
  ('Công ty TNHH Phụ Kiện Nội Thất Việt Phát', 'Phạm Thu Hà', '02866778899', 'vietphat@phukien.example', '45 Nguyễn Oanh, Gò Vấp, TP.HCM',    '0304567890');

-- 16. Import orders (nhập kho) ----------------------------------------
do $$
declare
  v_supplier record;
  v_import_id uuid;
  v_product record;
  v_total numeric;
  v_qty int;
  v_line numeric;
  i int := 0;
  v_status text;
begin
  for v_supplier in select id from public.suppliers order by created_at loop
    i := i + 1;
    v_status := case when i <= 2 then 'completed' else 'pending' end;

    insert into public.import_orders (supplier_id, total_amount, status, invoice_number, created_at)
    values (v_supplier.id, 0, v_status, 'HD-NK-' || lpad(i::text, 4, '0'), now() - (i * interval '7 days'))
    returning id into v_import_id;

    v_total := 0;
    for v_product in
      select id, cost_price from public.products order by created_at offset (i - 1) * 3 limit 3
    loop
      v_qty := 20 + (i * 5);
      v_line := coalesce(v_product.cost_price, 0) * v_qty;

      insert into public.import_order_items (import_order_id, product_id, quantity, import_price, total_price)
      values (v_import_id, v_product.id, v_qty, coalesce(v_product.cost_price, 0), v_line);

      v_total := v_total + v_line;
    end loop;

    update public.import_orders set total_amount = v_total where id = v_import_id;
  end loop;
end $$;

-- 17. Customer orders + items -----------------------------------------
do $$
declare
  p_ids uuid[];
  u_ids uuid[];
  o_id uuid;
  p_id uuid;
  u_id uuid;
  p_price numeric;
  v_total numeric;
  v_qty int;
  i int;
  j int;
  status_list text[] := array['completed', 'completed', 'completed', 'pending', 'processing', 'cancelled'];
  payment_methods text[] := array['cod', 'banking', 'momo'];
begin
  select array_agg(id) into p_ids from public.products;
  select array_agg(user_id) into u_ids from public.profiles;

  if p_ids is null then
    raise notice 'No products found. Skipping order seed.';
    return;
  end if;

  for i in 1..30 loop
    if u_ids is not null and array_length(u_ids, 1) > 0 then
      u_id := u_ids[1 + floor(random() * array_length(u_ids, 1))::int];
    else
      u_id := null;
    end if;

    insert into public.orders (
      shipping_name, shipping_address, shipping_phone,
      status, payment_method, user_id, total_amount, created_at
    ) values (
      'Khách hàng ' || floor(random() * 1000)::text,
      'Số ' || floor(random() * 100)::text || ' Đường Nguyễn Văn Cừ, TP.HCM',
      '09' || (10000000 + floor(random() * 89999999)::int)::text,
      status_list[1 + floor(random() * array_length(status_list, 1))::int],
      payment_methods[1 + floor(random() * array_length(payment_methods, 1))::int],
      u_id,
      0,
      now() - (random() * interval '60 days')
    ) returning id into o_id;

    v_total := 0;

    for j in 1..(1 + floor(random() * 4)::int) loop
      p_id := p_ids[1 + floor(random() * array_length(p_ids, 1))::int];
      select price into p_price from public.products where id = p_id;
      v_qty := 1 + floor(random() * 3)::int;

      insert into public.order_items (order_id, product_id, quantity, price)
      values (o_id, p_id, v_qty, p_price);

      v_total := v_total + (p_price * v_qty);
    end loop;

    update public.orders set total_amount = v_total where id = o_id;
  end loop;
end $$;

-- 18. Verify -----------------------------------------------------------
select 'categories' as t, count(*) from public.categories
union all select 'products', count(*) from public.products
union all select 'news', count(*) from public.news
union all select 'projects', count(*) from public.projects
union all select 'suppliers', count(*) from public.suppliers
union all select 'import_orders', count(*) from public.import_orders
union all select 'import_order_items', count(*) from public.import_order_items
union all select 'orders', count(*) from public.orders
union all select 'order_items', count(*) from public.order_items
union all select 'profiles', count(*) from public.profiles
union all select 'user_roles', count(*) from public.user_roles;
