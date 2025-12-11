import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageSquare,
  User,
  Building
} from "lucide-react";

const LOCATIONS = [
  {
    name: "Trụ sở chính - TP.HCM",
    address: "123 Đường Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh",
    phone: "028 3123 4567",
    email: "info@moctinhhoa.com",
    hours: "T2-T7: 8:00 - 17:30, CN: 8:00 - 12:00",
    type: "headquarters"
  },
  {
    name: "Chi nhánh Hà Nội",
    address: "456 Đường Giải Phóng, Quận Hai Bà Trưng, Hà Nội",
    phone: "024 3987 6543",
    email: "hanoi@moctinhhoa.com",
    hours: "T2-T7: 8:00 - 17:30, CN: 8:00 - 12:00",
    type: "branch"
  },
  {
    name: "Showroom Đà Nẵng",
    address: "789 Đường Nguyễn Tất Thành, Quận Liên Chiểu, Đà Nẵng",
    phone: "0236 3456 789",
    email: "danang@moctinhhoa.com",
    hours: "T2-T7: 8:00 - 17:30, CN: 8:00 - 12:00",
    type: "showroom"
  }
];

const CONTACT_REASONS = [
  "Tư vấn sản phẩm",
  "Yêu cầu báo giá",
  "Hỗ trợ kỹ thuật",
  "Khiếu nại - Bảo hành",
  "Hợp tác kinh doanh",
  "Khác"
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    phone: "",
    email: "",
    reason: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-primary text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Liên hệ với chúng tôi
            </h1>
            <p className="text-xl opacity-90 mb-8">
              Đội ngũ chuyên gia của chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7.
              Hãy để lại thông tin, chúng tôi sẽ liên hệ trong thời gian sớm nhất.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                <span className="font-medium">Hotline: 1900 1234</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                <span className="font-medium">info@moctinhhoa.com</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-6 h-6 text-primary" />
                  Gửi tin nhắn
                </CardTitle>
                <p className="text-muted-foreground">
                  Điền thông tin vào form bên dưới, chúng tôi sẽ phản hồi trong vòng 24h
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Họ và tên *
                      </label>
                      <Input
                        placeholder="Nhập họ và tên"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Building className="w-4 h-4" />
                        Công ty
                      </label>
                      <Input
                        placeholder="Tên công ty (nếu có)"
                        value={formData.company}
                        onChange={(e) => handleInputChange("company", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Số điện thoại *
                      </label>
                      <Input
                        placeholder="Nhập số điện thoại"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email *
                      </label>
                      <Input
                        type="email"
                        placeholder="Nhập địa chỉ email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Lý do liên hệ *</label>
                    <Select value={formData.reason} onValueChange={(value) => handleInputChange("reason", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn lý do liên hệ" />
                      </SelectTrigger>
                      <SelectContent>
                        {CONTACT_REASONS.map((reason) => (
                          <SelectItem key={reason} value={reason}>
                            {reason}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nội dung tin nhắn *</label>
                    <Textarea
                      placeholder="Mô tả chi tiết yêu cầu của bạn..."
                      rows={6}
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      required
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full">
                    <Send className="w-5 h-5 mr-2" />
                    Gửi tin nhắn
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            {/* Quick Contact */}
            <Card>
              <CardHeader>
                <CardTitle>Liên hệ nhanh</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Hotline 24/7</p>
                    <p className="text-sm text-muted-foreground">1900 1234</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Email hỗ trợ</p>
                    <p className="text-sm text-muted-foreground">support@moctinhhoa.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Live Chat</p>
                    <p className="text-sm text-muted-foreground">Trò chuyện trực tuyến</p>
                  </div>
                </div>

                <Button className="w-full" variant="outline">
                  Bắt đầu chat ngay
                </Button>
              </CardContent>
            </Card>

            {/* Working Hours */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Giờ làm việc
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Thứ 2 - Thứ 7</span>
                  <span className="font-medium">8:00 - 17:30</span>
                </div>
                <div className="flex justify-between">
                  <span>Chủ nhật</span>
                  <span className="font-medium">8:00 - 12:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Ngày lễ</span>
                  <span className="font-medium text-muted-foreground">Đóng cửa</span>
                </div>
                <div className="pt-3 border-t border-border">
                  <Badge variant="secondary" className="w-full justify-center">
                    Hotline 24/7 luôn sẵn sàng hỗ trợ
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Locations */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-8">Hệ thống showroom & văn phòng</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {LOCATIONS.map((location, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    {location.name}
                    {location.type === "headquarters" && (
                      <Badge variant="default" className="ml-2">Trụ sở</Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
                      <p className="text-sm">{location.address}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <p className="text-sm font-medium">{location.phone}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <p className="text-sm">{location.email}</p>
                    </div>

                    <div className="flex items-start gap-3">
                      <Clock className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
                      <p className="text-sm">{location.hours}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Chỉ đường
                    </Button>
                    <Button size="sm" className="flex-1">
                      Gọi ngay
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Map Section */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-8">Bản đồ vị trí</h2>
          <Card>
            <CardContent className="p-0">
              <div className="w-full h-96 bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <MapPin className="w-12 h-12 mx-auto mb-2" />
                  <p>Google Maps sẽ được tích hợp tại đây</p>
                  <p className="text-sm">Hiển thị vị trí các showroom và văn phòng</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}