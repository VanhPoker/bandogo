-- Fill real photos (CC0 / public domain) into products, news and projects.
-- Files were uploaded to the public storage bucket "product-images" under seed/.
-- Safe to re-run: every statement is an idempotent UPDATE keyed by name/title.

\set ON_ERROR_STOP on

begin;

create temporary table _img (base text) on commit drop;
insert into _img values ('https://jjcpxtoscmljbshilsov.supabase.co/storage/v1/object/public/product-images/seed/');

create function pg_temp.u(k text) returns text
language sql stable as $$ select base || k || '.jpg' from _img limit 1 $$;

-- ---------------------------------------------------------------- products
update products set images = array[pg_temp.u(a), pg_temp.u(b)]
from (values
  ('Gỗ Ghép Cao Su 18mm AA',          'wood_tex_c',   'wood_grain'),
  ('Gỗ Ghép Thông 12mm',              'wood_tex_f',   'wood_planks'),
  ('Keo Dán Gỗ Chuyên Dụng 1kg',      'carpenter_tools', 'woodworker'),
  ('Nẹp Chỉ PVC Dán Cạnh 22mm',       'wood_tex_d',   'wood_tex_e'),
  ('Ván Ép Phủ Phim 18mm',            'wood_planks2', 'plywood_real'),
  ('Ván Plywood Eucalyptus 12mm',     'plywood_real', 'plywood_wall'),
  ('Ván Plywood Nội Thất 12mm',       'plywood_wall', 'plywood_real'),
  ('Ván MDF Chống Ẩm 17mm',           'wood_tex_c',   'wood_tex_f'),
  ('Ván MDF Phủ Melamine Trắng',      'white_washed', 'wood_tex_e'),
  ('Ván MDF Phủ Veneer Sồi',          'wood_tex_d',   'wood_grain'),
  ('Ván MFC Chống Ẩm Lõi Xanh',       'plywood_wall', 'wood_tex_a'),
  ('Ván MFC Melamine Trắng',          'wood_tex_e',   'wardrobe'),
  ('Ván MFC Vân Gỗ Xám',              'wood_tex_b',   'wood_tex_a'),
  ('Ván Nhựa PVC 18mm',               'white_washed', 'wood_tex_e'),
  ('Ván Okal Chống Ẩm 16mm',          'plywood_tex',  'plywood_wall'),
  ('Ván OSB 15mm',                    'osb_close',    'plywood_tex2'),
  ('Ván MDF Phủ Acrylic Bóng Gương',  'kitchen_cab2', 'white_washed')
) as m(nm, a, b)
where products.name = m.nm;

-- ------------------------------------------------------------------- news
update news set image = pg_temp.u(k)
from (values
  ('Bảng giá ván gỗ công nghiệp cập nhật quý này',      'wood_planks'),
  ('Cách bảo quản đồ gỗ công nghiệp bền đẹp',           'living_room'),
  ('Gỗ Sài Gòn Tín Việt mở rộng kho hàng tại Quận 7',   'logistics'),
  ('So sánh ván MDF và ván MFC: nên chọn loại nào?',    'plywood_wall'),
  ('Xu hướng nội thất gỗ công nghiệp 2025',             'living_room2')
) as m(t, k)
where news.title = m.t;

-- --------------------------------------------------------------- projects
update projects set image = pg_temp.u(k)
from (values
  ('Chuỗi quán cà phê BeanHouse — 3 chi nhánh',         'cafe_tables'),
  ('Showroom thời trang ChicStyle',                     'hangers'),
  ('Thi công nội thất căn hộ Vinhomes Grand Park',      'kitchen_int2'),
  ('Văn phòng làm việc công ty TechSolution',           'office_desk')
) as m(t, k)
where projects.title = m.t;

commit;

-- ----------------------------------------------------------------- verify
select 'products placeholder' as check, count(*) from products where '/placeholder.svg' = any(images)
union all select 'news placeholder', count(*) from news where image = '/placeholder.svg'
union all select 'projects placeholder', count(*) from projects where image = '/placeholder.svg'
union all select 'products no image', count(*) from products where images is null or cardinality(images) = 0;
