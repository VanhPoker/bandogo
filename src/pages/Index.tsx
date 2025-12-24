import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/ProductCard";
import { CategoryCard } from "@/components/CategoryCard";
import { ArrowRight, Star, Shield, Truck, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { useProducts } from "@/hooks/useProducts";
import { ProductionProcess } from "@/components/ProductionProcess";

const Index = () => {
  const { products, loading } = useProducts();

  // Get the first product of each category
  const representativeProducts = useMemo(() => {
    const seenCategories = new Set();
    return products.filter(p => {
      if (seenCategories.has(p.category)) return false;
      seenCategories.add(p.category);
      return true;
    });
  }, [products]);

  const testimonials = [
    {
      name: "Nguyễn Văn A",
      role: "Chủ đầu tư dự án Vinhomes",
      content: "Chất lượng sản phẩm rất tốt, giao hàng đúng hẹn. Sẽ tiếp tục hợp tác lâu dài.",
      rating: 5
    },
    {
      name: "Trần Thị B",
      role: "Kiến trúc sư nội thất",
      content: "Đa dạng mẫu mã, tư vấn nhiệt tình. Khách hàng rất hài lòng với sản phẩm.",
      rating: 5
    },
    {
      name: "Lê Minh C",
      role: "Nhà thầu xây dựng",
      content: "Giá cả cạnh tranh, chất lượng đảm bảo. Đội ngũ hỗ trợ chuyên nghiệp.",
      rating: 5
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mb-4"></div>
          <p className="text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/son-hieu-ung-1.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Gỗ Ép Chất Lượng Cao
            <br />
            <span className="text-primary">Giá Tận Gốc</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90">
            Chuyên cung cấp ván MFC, MDF, Plywood cho nội thất và xây dựng
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products">
              <Button size="lg" className="text-lg px-8 py-6">
                Xem sản phẩm
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="lg" className="text-lg px-8 py-6 border-white text-black  hover:bg-white hover:text-black">
                Liên hệ tư vấn
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Chất lượng đảm bảo</h3>
              <p className="text-muted-foreground text-sm">Sản phẩm chính hãng, có chứng nhận chất lượng</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Giao hàng nhanh</h3>
              <p className="text-muted-foreground text-sm">Giao hàng toàn quốc, cam kết đúng hẹn</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Giá tốt nhất</h3>
              <p className="text-muted-foreground text-sm">Giá cạnh tranh, nhiều chương trình ưu đãi</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Dịch vụ tận tâm</h3>
              <p className="text-muted-foreground text-sm">Tư vấn chuyên nghiệp, hỗ trợ 24/7</p>
            </div>
          </div>
        </div>
      </section>

      {/* Production Process Section */}
      <ProductionProcess />

      {/* Categories/Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Sản Phẩm Nổi Bật
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Đại diện các dòng sản phẩm chất lượng cao của chúng tôi
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {representativeProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price.toLocaleString('vi-VN')}
                image={product.images?.[0] || '/placeholder.svg'}
                category={product.category}
                specs={product.specifications?.features || []}
                rating={4.5}
                reviews={0}
                stockQuantity={product.stock_quantity}
              />
            ))}
          </div>

          <div className="text-center">
            <Link to="/products">
              <Button variant="outline" size="lg">
                Xem tất cả sản phẩm
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>



      {/* CTA Section */}
      <section className="py-16 bg-gradient-wood text-black">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Bạn Cần Tư Vấn Sản Phẩm?
          </h2>
          <p className="text-xl mb-8 text-black/90 max-w-2xl mx-auto">
            Đội ngũ chuyên gia của chúng tôi sẵn sàng hỗ trợ bạn lựa chọn sản phẩm phù hợp nhất
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg" className="text-lg px-8 py-6">
              Gọi ngay: 0123 456 789
            </Button>
            <Link to="/contact">
              <Button variant="outline" size="lg" className="text-lg px-8 py-6 border-black text-black hover:bg-black hover:text-white">
                Gửi yêu cầu tư vấn
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
