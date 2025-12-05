-- Insert Categories
INSERT INTO public.categories (name, description) VALUES
('Ván MDF', 'Ván sợi mật độ trung bình, bề mặt mịn, dễ gia công'),
('Ván MFC', 'Ván dăm phủ Melamine, đa dạng màu sắc, giá thành hợp lý'),
('Gỗ Ghép', 'Gỗ tự nhiên ghép thanh, độ bền cao, vân gỗ đẹp'),
('Ván Okal', 'Ván dăm, chịu lực tốt, giá rẻ'),
('Ván Ép', 'Ván Plywood, chịu nước tốt, độ bền cao'),
('Ván Nhựa PVC', 'Chống nước tuyệt đối, chống mối mọt'),
('Ván OSB', 'Ván dăm định hướng, kết cấu chắc chắn, độc đáo'),
('Ván Phủ Acrylic', 'Bề mặt bóng gương, sang trọng, hiện đại');

-- Insert Products (Sample Data)
-- Note: We need to get category IDs first, but for a seed file we can use subqueries or just assume order if we reset tables.
-- Using subqueries for safety.

-- Ván MDF Products
INSERT INTO public.products (name, description, price, category, stock_quantity, is_active, images, specifications) VALUES
('Ván MDF Chống Ẩm 17mm', 'Ván MDF lõi xanh chống ẩm, thích hợp làm tủ bếp, nội thất phòng tắm.', 450000, 'Ván MDF', 100, true, ARRAY['https://gosaigon.vn/wp-content/uploads/2019/06/van-mdf-chong-am-1.jpg'], '{"thickness": "17mm", "size": "1220x2440mm", "features": ["Chống ẩm", "Bề mặt mịn"]}'),
('Ván MDF Phủ Melamine Trắng', 'Ván MDF phủ Melamine màu trắng, bề mặt chống trầy xước.', 380000, 'Ván MDF', 150, true, ARRAY['https://gosaigon.vn/wp-content/uploads/2019/06/van-mdf-phu-melamine-1.jpg'], '{"thickness": "17mm", "size": "1220x2440mm", "color": "Trắng"}'),
('Ván MDF Phủ Veneer Sồi', 'Ván MDF phủ Veneer gỗ Sồi tự nhiên, vân gỗ đẹp.', 550000, 'Ván MDF', 80, true, ARRAY['https://gosaigon.vn/wp-content/uploads/2019/06/van-mdf-phu-veneer-1.jpg'], '{"thickness": "17mm", "size": "1220x2440mm", "veneer": "Sồi"}');

-- Ván MFC Products
INSERT INTO public.products (name, description, price, category, stock_quantity, is_active, images, specifications) VALUES
('Ván MFC Vân Gỗ Xám', 'Ván MFC màu vân gỗ xám hiện đại, phù hợp nội thất văn phòng.', 320000, 'Ván MFC', 200, true, ARRAY['https://gosaigon.vn/wp-content/uploads/2019/06/van-mfc-van-go-1.jpg'], '{"thickness": "18mm", "size": "1220x2440mm", "color": "Xám vân gỗ"}'),
('Ván MFC Chống Ẩm Lõi Xanh', 'Ván MFC lõi xanh chống ẩm, bền bỉ trong môi trường ẩm.', 360000, 'Ván MFC', 120, true, ARRAY['https://gosaigon.vn/wp-content/uploads/2019/06/van-mfc-chong-am-1.jpg'], '{"thickness": "18mm", "size": "1220x2440mm", "features": ["Chống ẩm"]}');

-- Gỗ Ghép Products
INSERT INTO public.products (name, description, price, category, stock_quantity, is_active, images, specifications) VALUES
('Gỗ Ghép Cao Su 18mm AA', 'Gỗ ghép cao su chất lượng AA, hai mặt đẹp, không mắt chết.', 650000, 'Gỗ Ghép', 50, true, ARRAY['https://gosaigon.vn/wp-content/uploads/2019/06/go-ghep-cao-su-1.jpg'], '{"thickness": "18mm", "size": "1200x2400mm", "wood_type": "Cao su"}'),
('Gỗ Ghép Thông 12mm', 'Gỗ ghép thông tự nhiên, vân gỗ sáng, mùi thơm nhẹ.', 580000, 'Gỗ Ghép', 60, true, ARRAY['https://gosaigon.vn/wp-content/uploads/2019/06/go-ghep-thong-1.jpg'], '{"thickness": "12mm", "size": "1200x2400mm", "wood_type": "Thông"}');

-- Ván Ép Products
INSERT INTO public.products (name, description, price, category, stock_quantity, is_active, images, specifications) VALUES
('Ván Ép Phủ Phim 18mm', 'Ván ép phủ phim đen, dùng cho cốp pha xây dựng, chịu nước tốt.', 420000, 'Ván Ép', 300, true, ARRAY['https://gosaigon.vn/wp-content/uploads/2019/06/van-ep-phu-phim-1.jpg'], '{"thickness": "18mm", "size": "1220x2440mm", "type": "Cốp pha"}'),
('Ván Plywood Nội Thất 12mm', 'Ván Plywood tiêu chuẩn nội thất, bề mặt đẹp.', 350000, 'Ván Ép', 100, true, ARRAY['https://gosaigon.vn/wp-content/uploads/2019/06/van-plywood-1.jpg'], '{"thickness": "12mm", "size": "1220x2440mm"}');

-- Insert News
INSERT INTO public.news (title, content, author, image) VALUES
('Xu hướng nội thất gỗ công nghiệp 2025', 'Năm 2025 đánh dấu sự lên ngôi của các loại ván gỗ công nghiệp thân thiện môi trường và có tính thẩm mỹ cao. Các tông màu trung tính và vân gỗ tự nhiên tiếp tục được ưa chuộng...', 'Admin', 'https://gosaigon.vn/wp-content/uploads/2023/01/xu-huong-noi-that-2023.jpg'),
('Cách bảo quản đồ gỗ công nghiệp bền đẹp', 'Để đồ gỗ công nghiệp luôn bền đẹp, bạn cần tránh để sản phẩm tiếp xúc trực tiếp với nước trong thời gian dài, lau chùi bằng khăn mềm ẩm và tránh ánh nắng gắt...', 'Kỹ thuật viên', 'https://gosaigon.vn/wp-content/uploads/2023/01/bao-quan-do-go.jpg'),
('Gỗ Sài Gòn Tín Việt mở rộng kho hàng tại Quận 7', 'Nhằm đáp ứng nhu cầu ngày càng tăng của khách hàng, chúng tôi đã chính thức mở rộng hệ thống kho hàng tại Quận 7 với sức chứa lớn hơn và quy trình vận hành hiện đại...', 'Ban Giám Đốc', 'https://gosaigon.vn/wp-content/uploads/2023/01/kho-hang-moi.jpg');

-- Insert Projects
INSERT INTO public.projects (title, description, content, client, completion_date, image) VALUES
('Thi công nội thất căn hộ Vinhomes Grand Park', 'Thiết kế và thi công trọn gói nội thất căn hộ 2 phòng ngủ phong cách hiện đại.', 'Dự án sử dụng chủ yếu ván MDF chống ẩm phủ Melamine An Cường. Tông màu chủ đạo là trắng và vân gỗ sồi, tạo cảm giác rộng rãi và ấm cúng. Các hạng mục bao gồm: Tủ bếp, tủ quần áo, giường ngủ, kệ tivi...', 'Anh Nam', '2024-11-15', 'https://gosaigon.vn/wp-content/uploads/2023/01/du-an-vinhomes.jpg'),
('Văn phòng làm việc công ty TechSolution', 'Cung cấp và lắp đặt hệ thống bàn làm việc, tủ hồ sơ cho văn phòng 50 nhân sự.', 'Sử dụng ván MFC chân sắt cho bàn làm việc, đảm bảo độ bền và tính thẩm mỹ. Tủ hồ sơ cao sát trần giúp tối ưu không gian lưu trữ. Thời gian thi công nhanh chóng trong 5 ngày.', 'TechSolution Ltd.', '2024-10-20', 'https://gosaigon.vn/wp-content/uploads/2023/01/du-an-van-phong.jpg'),
('Showroom thời trang ChicStyle', 'Thi công kệ trưng bày và quầy thu ngân cho shop thời trang.', 'Sử dụng gỗ ghép cao su phủ keo bóng cho các kệ trưng bày, mang lại vẻ đẹp tự nhiên và sang trọng. Quầy thu ngân kết hợp MDF phủ Acrylic bóng gương tạo điểm nhấn.', 'Chị Lan', '2024-09-05', 'https://gosaigon.vn/wp-content/uploads/2023/01/du-an-showroom.jpg');
