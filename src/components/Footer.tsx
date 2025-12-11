import { Link } from "react-router-dom";
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Youtube,
  Clock
} from "lucide-react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src="/moctinhhoa.png" alt="Mộc Tinh Hoa" className="h-10 w-auto object-contain" />
              <div>
                <h3 className="text-lg font-bold text-foreground">Mộc Tinh Hoa</h3>
                <p className="text-xs text-muted-foreground">Chất lượng - Uy tín - Bền vững</p>
              </div>
            </div>
            <p className="text-muted-foreground text-sm">
              Chuyên cung cấp các loại gỗ ép cao cấp cho nội thất và xây dựng.
              Cam kết chất lượng tốt nhất với giá cả hợp lý.
            </p>
            <div className="flex items-center gap-3">
              <Link to="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </Link>
              <Link to="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </Link>
              <Link to="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Youtube className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Liên kết nhanh</h3>
            <div className="space-y-2">
              <Link to="/products" className="block text-muted-foreground hover:text-primary transition-colors">
                Sản phẩm
              </Link>
              <Link to="/projects" className="block text-muted-foreground hover:text-primary transition-colors">
                Dự án tiêu biểu
              </Link>
              <Link to="/about" className="block text-muted-foreground hover:text-primary transition-colors">
                Giới thiệu
              </Link>
              <Link to="/news" className="block text-muted-foreground hover:text-primary transition-colors">
                Tin tức
              </Link>
              <Link to="/contact" className="block text-muted-foreground hover:text-primary transition-colors">
                Liên hệ
              </Link>
            </div>
          </div>

          {/* Product categories */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Danh mục sản phẩm</h3>
            <div className="space-y-2">
              <Link to="/products?category=mfc" className="block text-muted-foreground hover:text-primary transition-colors">
                Ván MFC
              </Link>
              <Link to="/products?category=mdf" className="block text-muted-foreground hover:text-primary transition-colors">
                Ván MDF
              </Link>
              <Link to="/products?category=plywood" className="block text-muted-foreground hover:text-primary transition-colors">
                Ván Plywood
              </Link>
              <Link to="/products?category=particle" className="block text-muted-foreground hover:text-primary transition-colors">
                Ván dăm
              </Link>
              <Link to="/products?category=accessories" className="block text-muted-foreground hover:text-primary transition-colors">
                Phụ kiện
              </Link>
            </div>
          </div>

          {/* Contact info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Thông tin liên hệ</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-muted-foreground text-sm">
                    123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <p className="text-muted-foreground text-sm">0123 456 789</p>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <p className="text-muted-foreground text-sm">info@moctinhhoa.com</p>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-muted-foreground text-sm">T2-T7: 8:00 - 17:30</p>
                  <p className="text-muted-foreground text-sm">CN: 8:00 - 12:00</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border/50 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground text-sm">
              © {currentYear} Mộc Tinh Hoa. Tất cả quyền được bảo lưu.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                Chính sách bảo mật
              </Link>
              <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                Điều khoản sử dụng
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};