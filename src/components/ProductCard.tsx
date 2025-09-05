import { Link } from "react-router-dom";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ShoppingCart, Heart, Eye } from "lucide-react";

interface Product {
  id: string;
  name: string;
  image: string;
  category: string;
  isNew?: boolean;
  isBestSeller?: boolean;
}

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 bg-background border-border">
      <div className="relative">
        <div className="aspect-square overflow-hidden">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {product.isNew && (
            <Badge className="bg-primary text-primary-foreground">Mới</Badge>
          )}
          {product.isBestSeller && (
            <Badge className="bg-secondary text-secondary-foreground">Bán chạy</Badge>
          )}
        </div>

        {/* Action buttons - show on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex items-center gap-2">
            <Button size="sm" variant="secondary" className="bg-background/90 hover:bg-background">
              <Eye className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="secondary" className="bg-background/90 hover:bg-background">
              <Heart className="w-4 h-4" />
            </Button>
            <Button size="sm" className="bg-primary hover:bg-primary/90">
              <ShoppingCart className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{product.category}</p>
          <Link to={`/products/${product.id}`}>
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>
          <div className="flex items-center justify-between">
            <Button variant="outline" size="sm" className="text-xs">
              Xem chi tiết
            </Button>
            <Button size="sm" className="text-xs">
              Liên hệ giá
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};