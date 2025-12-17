import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  Award,
  Factory,
  Leaf,
  Target,
  Eye,
  Heart,
  ArrowRight,
  CheckCircle,
  Globe,
  Truck,
  Shield
} from "lucide-react";

const MILESTONES = [
  { year: "2010", title: "Thành lập công ty", description: "Khởi đầu với tầm nhìn trở thành nhà cung cấp gỗ ép hàng đầu" },
  { year: "2015", title: "Mở rộng nhà máy", description: "Đầu tư dây chuyền sản xuất hiện đại, nâng cao năng suất" },
  { year: "2018", title: "Chứng nhận quốc tế", description: "Đạt chứng nhận FSC, CARB - khẳng định chất lượng thế giới" },
  { year: "2020", title: "Hệ thống phân phối", description: "Xây dựng mạng lưới đại lý trên toàn quốc" },
  { year: "2023", title: "Công nghệ 4.0", description: "Ứng dụng AI và IoT trong quản lý chất lượng sản phẩm" }
];

const VALUES = [
  {
    icon: Award,
    title: "Chất lượng",
    description: "Cam kết cung cấp sản phẩm đạt tiêu chuẩn quốc tế cao nhất"
  },
  {
    icon: Heart,
    title: "Tận tâm",
    description: "Phục vụ khách hàng với sự nhiệt tình và chuyên nghiệp"
  },
  {
    icon: Leaf,
    title: "Bền vững",
    description: "Sản xuất thân thiện môi trường, bảo vệ tài nguyên thiên nhiên"
  },
  {
    icon: Users,
    title: "Đội ngũ",
    description: "Xây dựng đội ngũ nhân viên có trình độ và kinh nghiệm cao"
  }
];

const CERTIFICATES = [
  { name: "ISO 9001:2015", description: "Hệ thống quản lý chất lượng" },
  { name: "FSC Certificate", description: "Quản lý rừng bền vững" },
  { name: "CARB Phase 2", description: "Tiêu chuẩn phát thải formaldehyde" },
  { name: "CE Marking", description: "Tuân thủ tiêu chuẩn châu Âu" }
];

const STATS = [
  { number: "10,000+", label: "Khách hàng", icon: Users },
  { number: "500+", label: "Dự án", icon: Factory },
  { number: "50+", label: "Đại lý", icon: Globe },
  { number: "99%", label: "Hài lòng", icon: Award }
];

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-primary text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Về Gỗ Đại Thắng
            </h1>
            <p className="text-xl opacity-90 mb-8 leading-relaxed">
              Với hơn 13 năm kinh nghiệm, chúng tôi tự hào là đơn vị tiên phong trong lĩnh vực
              cung cấp và phân phối các sản phẩm gỗ ép chất lượng cao tại Việt Nam.
            </p>
            <Button size="lg" variant="secondary">
              Khám phá hành trình <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-primary" />
                </div>
                <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="w-16 h-16 bg-gradient-primary rounded-lg flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-6">Sứ mệnh</h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                Cung cấp các sản phẩm gỗ ép chất lượng cao, an toàn và thân thiện với môi trường,
                đáp ứng mọi nhu cầu của khách hàng từ dân dụng đến công nghiệp. Chúng tôi cam kết
                mang đến giải pháp tối ưu cho mọi công trình xây dựng và nội thất.
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-1" />
                  <span>Chất lượng sản phẩm đạt tiêu chuẩn quốc tế</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-1" />
                  <span>Dịch vụ khách hàng tận tâm và chuyên nghiệp</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-1" />
                  <span>Giá cả hợp lý và cạnh tranh trên thị trường</span>
                </div>
              </div>
            </div>

            <div>
              <div className="w-16 h-16 bg-gradient-primary rounded-lg flex items-center justify-center mb-6">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-6">Tầm nhìn</h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                Trở thành nhà cung cấp gỗ ép hàng đầu tại Việt Nam và khu vực Đông Nam Á,
                được khách hàng tin tưởng và lựa chọn nhờ chất lượng sản phẩm vượt trội
                và dịch vụ hoàn hảo.
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-1" />
                  <span>Dẫn đầu thị trường về chất lượng và dịch vụ</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-1" />
                  <span>Mở rộng mạng lưới phân phối toàn khu vực</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-1" />
                  <span>Tiên phong trong công nghệ sản xuất xanh</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Giá trị cốt lõi</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Những giá trị cốt lõi định hướng mọi hoạt động và quyết định của chúng tôi
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {VALUES.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Hành trình phát triển</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Những cột mốc quan trọng trong quá trình xây dựng và phát triển công ty
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-border"></div>

              {MILESTONES.map((milestone, index) => (
                <div key={index} className={`relative flex items-center mb-12 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                  }`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8'}`}>
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <Badge variant="secondary" className="mb-3">
                          {milestone.year}
                        </Badge>
                        <h3 className="text-xl font-semibold mb-2">{milestone.title}</h3>
                        <p className="text-muted-foreground">{milestone.description}</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Timeline dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-background"></div>

                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Certificates */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Chứng nhận & Giải thưởng</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Những chứng nhận uy tín khẳng định chất lượng và uy tín của chúng tôi
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CERTIFICATES.map((cert, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{cert.name}</h3>
                  <p className="text-sm text-muted-foreground">{cert.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Tại sao chọn chúng tôi?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Những lợi ích vượt trội khi làm việc với Gỗ Đại Thắng
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Factory className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Nhà máy hiện đại</h3>
                <p className="text-muted-foreground">
                  Trang thiết bị sản xuất tiên tiến, quy trình kiểm soát chất lượng nghiêm ngặt
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Giao hàng nhanh</h3>
                <p className="text-muted-foreground">
                  Hệ thống logistics chuyên nghiệp, giao hàng tận nơi trên toàn quốc
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Bảo hành dài hạn</h3>
                <p className="text-muted-foreground">
                  Chế độ bảo hành và hỗ trợ kỹ thuật toàn diện, cam kết chất lượng lâu dài
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Sẵn sàng bắt đầu dự án với chúng tôi?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Liên hệ ngay để nhận tư vấn miễn phí và báo giá tốt nhất cho dự án của bạn
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary">
              Liên hệ tư vấn
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
              Xem sản phẩm
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}