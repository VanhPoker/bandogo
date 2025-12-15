import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductCard } from "@/components/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import {
  Star,
  Heart,
  Share2,
  ShoppingCart,
  Download,
  ChevronLeft,
  ChevronRight,
  Truck,
  Shield,
  Award,
  Phone
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  images: string[];
  specifications: any;
  stock_quantity: number;
  is_active: boolean;
}

const RELATED_PRODUCTS = [
  {
    id: "2",
    name: "Ván MFC Melamine Xám",
    price: 820000,
    image: "/placeholder.svg",
    category: "Ván MFC",
    rating: 4.7,
    reviews: 89
  },
  {
    id: "3",
    name: "Ván MFC Vân Gỗ Sồi",
    price: 950000,
    image: "/placeholder.svg",
    category: "Ván MFC",
    rating: 4.9,
    reviews: 156
  },
  {
    id: "4",
    name: "Cạnh ABS Trắng 2mm",
    price: 45000,
    image: "/placeholder.svg",
    category: "Phụ kiện",
    rating: 4.6,
    reviews: 67
  }
];

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextImage = () => {
    if (!product?.images?.length) return;
    setCurrentImageIndex((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    if (!product?.images?.length) return;
    setCurrentImageIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Không tìm thấy sản phẩm</p>
      </div>
    );
  }

  const images = product.images || ['/placeholder.svg'];
  const specs = product.specifications || {};

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary">Trang chủ</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-primary">Kho hàng</Link>
            <span>/</span>
            <Link to={`/products?category=${product.category}`} className="hover:text-primary">
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-muted rounded-lg overflow-hidden group">
              <img
                src={images[currentImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover"
              />

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Image Counter */}
              <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {currentImageIndex + 1} / {images.length}
              </div>
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${index === currentImageIndex
                    ? 'border-primary'
                    : 'border-transparent hover:border-muted-foreground'
                    }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">{product.category}</Badge>
                <Badge variant="outline">Mã: {product.id.slice(0, 8).toUpperCase()}</Badge>
              </div>

              <h1 className="text-3xl font-bold text-foreground mb-4">
                {product.name}
              </h1>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < 4
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-muted-foreground'
                        }`}
                    />
                  ))}
                  <span className="font-medium ml-2">4.5</span>
                </div>
                <span className="text-muted-foreground">
                  (Đánh giá)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-4">
              <span className="text-3xl font-bold text-primary">
                {product.price.toLocaleString('vi-VN')}₫
              </span>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${product.stock_quantity > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className={product.stock_quantity > 0 ? 'text-green-600' : 'text-red-600'}>
                {product.stock_quantity > 0 ? 'Còn hàng' : 'Hết hàng'}
              </span>
            </div>

            {/* Quantity & Actions */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="font-medium">Số lượng (tấm):</label>
                <div className="flex items-center border border-input rounded-md">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 hover:bg-muted transition-colors"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 px-3 py-2 text-center border-0 focus:outline-none"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 hover:bg-muted transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button size="lg" className="flex-1" onClick={() => {
                  addItem({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: images[0],
                    quantity: quantity
                  });
                }}>
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Thêm vào đơn hàng
                </Button>
                <Button
                  variant={isWishlisted ? "default" : "outline"}
                  size="lg"
                  onClick={() => setIsWishlisted(!isWishlisted)}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </Button>
                <Button variant="outline" size="lg">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Services */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium text-sm">Giao hàng miễn phí</p>
                  <p className="text-xs text-muted-foreground">Đơn từ 5 triệu</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium text-sm">Bảo hành 24 tháng</p>
                  <p className="text-xs text-muted-foreground">Đổi trả miễn phí</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Award className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium text-sm">Chất lượng cao</p>
                  <p className="text-xs text-muted-foreground">Chứng nhận quốc tế</p>
                </div>
              </div>
            </div>

            {/* Contact */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Cần tư vấn thêm?</p>
                    <p className="text-sm text-muted-foreground">Liên hệ ngay với chuyên gia</p>
                  </div>
                  <Button>
                    <Phone className="w-4 h-4 mr-2" />
                    Gọi ngay
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Product Details Tabs */}
        <Tabs defaultValue="description" className="mb-16">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="description">Mô tả</TabsTrigger>
            <TabsTrigger value="specifications">Thông số</TabsTrigger>
            <TabsTrigger value="reviews">Đánh giá</TabsTrigger>
            <TabsTrigger value="documents">Tài liệu</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Mô tả sản phẩm</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {product.description}
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="specifications" className="mt-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Thông số kỹ thuật</h3>
                <div className="grid gap-4">
                  {Object.entries(specs).map(([key, value]) => (
                    <div key={key} className="grid grid-cols-3 py-3 border-b border-border last:border-0">
                      <span className="font-medium">{key}</span>
                      <span className="col-span-2 text-muted-foreground">{String(value)}</span>
                    </div>
                  ))}
                  {Object.keys(specs).length === 0 && (
                    <p className="text-muted-foreground">Chưa có thông số kỹ thuật</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="mt-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Đánh giá khách hàng</h3>
                <div className="text-center py-12 text-muted-foreground">
                  <p>Chức năng đánh giá sẽ được cập nhật sớm</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="mt-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Tài liệu kỹ thuật</h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    Catalogue sản phẩm (PDF)
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Related Products */}
        <section>
          <h2 className="text-2xl font-bold mb-8">Gỗ cùng loại</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {RELATED_PRODUCTS.map((product) => (
              <ProductCard key={product.id} {...product} price={product.price.toString()} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}