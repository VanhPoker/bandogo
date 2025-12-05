import { Link } from "react-router-dom";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Star, ShoppingCart, Heart, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";

interface ProductCardProps {
  id: string;
  name: string;
  image: string;
  category: string;
  price?: string;
  originalPrice?: string;
  rating?: number;
  reviews?: number;
  specs?: string[];
  isNew?: boolean;
  isBestSeller?: boolean;
  className?: string;
}

export const ProductCard = ({
  id,
  name,
  image,
  category,
  price,
  originalPrice,
  rating,
  reviews,
  specs,
  isNew,
  isBestSeller,
  className
}: ProductCardProps) => {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation if inside a Link
    if (price) {
      addItem({
        id,
        name,
        price: parseInt(price.replace(/,/g, '')),
        image,
        quantity: 1
      });
    }
  };

  return (
    <Card className={cn("group overflow-hidden hover:shadow-lg transition-all duration-300 bg-background border-border", className)}>
      <div className="relative">
        <div className="aspect-square overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {isNew && (
            <Badge className="bg-primary text-primary-foreground">Mới</Badge>
          )}
          {isBestSeller && (
            <Badge className="bg-secondary text-secondary-foreground">Bán chạy</Badge>
          )}
          {originalPrice && price && (
            <Badge variant="destructive" className="text-xs">
              -{Math.round(((parseInt(originalPrice.replace(/,/g, '')) - parseInt(price.replace(/,/g, ''))) / parseInt(originalPrice.replace(/,/g, ''))) * 100)}%
            </Badge>
          )}
        </div>

        {/* Action buttons - show on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex items-center gap-2">
            <Link to={`/products/${id}`}>
              <Button size="sm" variant="secondary" className="bg-background/90 hover:bg-background">
                <Eye className="w-4 h-4" />
              </Button>
            </Link>
            <Button size="sm" variant="secondary" className="bg-background/90 hover:bg-background">
              <Heart className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              className="bg-primary hover:bg-primary/90"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground mb-1">{category}</p>
            <Link to={`/products/${id}`}>
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
                {name}
              </h3>
            </Link>

            {/* Specs */}
            {specs && specs.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {specs.slice(0, 3).map((spec, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {spec}
                  </Badge>
                ))}
              </div>
            )}

            {/* Rating */}
            {rating && reviews && (
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${i < Math.floor(rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-muted-foreground'
                        }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">({reviews})</span>
              </div>
            )}
          </div>

          {/* Price */}
          {price && (
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-lg font-bold text-primary">{price}₫</span>
              {originalPrice && (
                <span className="text-sm text-muted-foreground line-through">{originalPrice}₫</span>
              )}
            </div>
          )}

          <div className="flex items-center justify-between gap-2">
            <Link to={`/products/${id}`} className="flex-1">
              <Button variant="outline" size="sm" className="w-full text-xs">
                Xem chi tiết
              </Button>
            </Link>
            <Button
              size="sm"
              className="flex-1 text-xs"
              onClick={handleAddToCart}
            >
              {price ? 'Thêm giỏ hàng' : 'Liên hệ giá'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};