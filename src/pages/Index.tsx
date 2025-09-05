import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/ProductCard";
import { CategoryCard } from "@/components/CategoryCard";
import { ArrowRight, Star, Shield, Truck, Award } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  // Mock data - will be replaced with real data from Supabase
  const featuredProducts = [
    {
      id: "1",
      name: "Ván MFC Melamine Trắng Sữa 18mm",
      image: "/placeholder.svg",
      category: "Ván MFC",
      isNew: true,
      isBestSeller: false
    },
    {
      id: "2", 
      name: "Ván MDF Chống Ẩm 15mm",
      image: "/placeholder.svg",
      category: "Ván MDF",
      isNew: false,
      isBestSeller: true
    },
    {
      id: "3",
      name: "Ván Plywood Tự Nhiên 12mm",
      image: "/placeholder.svg", 
      category: "Ván Plywood",
      isNew: false,
      isBestSeller: false
    },
    {
      id: "4",
      name: "Ván Dăm Chống Cháy 18mm",
      image: "/placeholder.svg",
      category: "Ván Dăm", 
      isNew: true,
      isBestSeller: true
    }
  ];

  const categories = [
    {
      id: "mfc",
      name: "Ván MFC",
      image: "/placeholder.svg",
      description: "Ván ép phủ melamine cao cấp, bề mặt nhẵn, màu sắc đa dạng",
      productCount: 45
    },
    {
      id: "mdf", 
      name: "Ván MDF",
      image: "/placeholder.svg",
      description: "Ván sợi mật độ cao, dễ gia công, phù hợp làm nội thất",
      productCount: 32
    },
    {
      id: "plywood",
      name: "Ván Plywood", 
      image: "/placeholder.svg",
      description: "Ván ghép nhiều lớp, độ bền cao, chống cong vênh",
      productCount: 28
    },
    {
      id: "particle",
      name: "Ván Dăm",
      image: "/placeholder.svg", 
      description: "Ván dăm ép, giá thành hợp lý, chất lượng ổn định",
      productCount: 18
    }
  ];

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

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
          style={{
            backgroundImage: "url('/placeholder.svg')",
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
            <Button size="lg" className="text-lg px-8 py-6">
              Xem sản phẩm
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-black">
              Liên hệ tư vấn
            </Button>
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

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Danh Mục Sản Phẩm
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Đa dạng các loại gỗ ép chất lượng cao, phù hợp với mọi nhu cầu sử dụng
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
          
          <div className="text-center">
            <Link to="/products">
              <Button variant="outline" size="lg">
                Xem tất cả danh mục
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Sản Phẩm Nổi Bật
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Những sản phẩm được khách hàng tin tưởng và lựa chọn nhiều nhất
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="text-center">
            <Link to="/products">
              <Button size="lg">
                Xem tất cả sản phẩm
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Khách Hàng Nói Gì
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Những đánh giá chân thực từ khách hàng đã sử dụng sản phẩm của chúng tôi
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-background border border-border rounded-lg p-6 shadow-sm">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 italic">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-wood text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Bạn Cần Tư Vấn Sản Phẩm?
          </h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Đội ngũ chuyên gia của chúng tôi sẵn sàng hỗ trợ bạn lựa chọn sản phẩm phù hợp nhất
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg" className="text-lg px-8 py-6">
              Gọi ngay: 0123 456 789
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-black">
              Gửi yêu cầu tư vấn
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
