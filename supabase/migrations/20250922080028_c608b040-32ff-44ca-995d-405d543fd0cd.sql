-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);

-- Create storage policies for product images
CREATE POLICY "Product images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'product-images');

CREATE POLICY "Admins can upload product images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'product-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update product images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'product-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete product images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'product-images' AND has_role(auth.uid(), 'admin'::app_role));

-- Insert sample categories
INSERT INTO public.categories (name, description) VALUES 
('Ván MFC', 'Ván sợi gỗ mật độ trung bình phủ melamine'),
('Ván MDF', 'Ván sợi gỗ mật độ trung bình'),
('Ván Plywood', 'Ván dán nhiều lớp gỗ tự nhiên'),
('Ván Dăm', 'Ván ép từ dăm gỗ và keo dính'),
('Phụ kiện', 'Các phụ kiện và vật tư đi kèm');

-- Insert sample products based on mock data
INSERT INTO public.products (name, price, category, description, specifications, images, stock_quantity) VALUES 
(
  'Ván MFC Melamine Trắng',
  850000,
  'Ván MFC',
  'Ván MFC phủ melamine màu trắng chất lượng cao, chống ẩm tốt',
  '{"thickness": "18mm", "size": "2440x1220mm", "features": ["Chống ẩm", "Bề mặt nhẵn", "Độ bền cao"]}',
  ARRAY['/placeholder.svg'],
  50
),
(
  'Ván MDF Lõi Xanh', 
  320000,
  'Ván MDF',
  'Ván MDF lõi xanh chống cháy, phù hợp cho nội thất',
  '{"thickness": "15mm", "size": "2440x1220mm", "features": ["Chống cháy", "Lõi xanh", "Dễ gia công"]}',
  ARRAY['/placeholder.svg'],
  75
),
(
  'Ván Plywood Eucalyptus',
  1200000,
  'Ván Plywood', 
  'Ván plywood gỗ bạch đàn chống mối mọt, độ bền cao',
  '{"thickness": "12mm", "size": "2440x1220mm", "features": ["Chống mối mọt", "Gỗ tự nhiên", "Cường độ cao"]}',
  ARRAY['/placeholder.svg'],
  30
),
(
  'Ván Dăm Chống Ẩm',
  280000,
  'Ván Dăm',
  'Ván dăm chống ẩm độ bền cao, giá thành hợp lý',
  '{"thickness": "16mm", "size": "2440x1220mm", "features": ["Chống ẩm", "Độ bền cao", "Giá hợp lý"]}',
  ARRAY['/placeholder.svg'],
  100
);