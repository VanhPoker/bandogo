import { Link } from "react-router-dom";
import { Card, CardContent } from "./ui/card";
import { ArrowRight } from "lucide-react";

interface Category {
  id: string;
  name: string;
  image: string;
  description: string;
  productCount: number;
}

interface CategoryCardProps {
  category: Category;
}

export const CategoryCard = ({ category }: CategoryCardProps) => {
  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 bg-background border-border">
      <div className="relative">
        <div className="aspect-[4/3] overflow-hidden">
          <img 
            src={category.image} 
            alt={category.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Content overlay */}
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <h3 className="text-lg font-bold mb-1">{category.name}</h3>
          <p className="text-sm text-white/80 mb-2 line-clamp-2">{category.description}</p>
          <p className="text-xs text-white/70">{category.productCount} sản phẩm</p>
        </div>
      </div>

      <CardContent className="p-4">
        <Link 
          to={`/products?category=${category.id}`}
          className="flex items-center justify-between text-primary hover:text-primary/80 transition-colors group"
        >
          <span className="font-medium">Xem tất cả sản phẩm</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </CardContent>
    </Card>
  );
};