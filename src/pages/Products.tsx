import { useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Grid, List } from "lucide-react";

const MOCK_PRODUCTS = [
  {
    id: "1",
    name: "Ván MFC Melamine Trắng",
    price: "850,000",
    originalPrice: "900,000",
    image: "/placeholder.svg",
    category: "Ván MFC",
    specs: ["18mm", "2440x1220mm", "Chống ẩm"],
    rating: 4.8,
    reviews: 124
  },
  {
    id: "2", 
    name: "Ván MDF Lõi Xanh",
    price: "320,000",
    image: "/placeholder.svg",
    category: "Ván MDF",
    specs: ["15mm", "2440x1220mm", "Chống cháy"],
    rating: 4.6,
    reviews: 89
  },
  {
    id: "3",
    name: "Ván Plywood Eucalyptus",
    price: "1,200,000", 
    image: "/placeholder.svg",
    category: "Ván Plywood",
    specs: ["12mm", "2440x1220mm", "Chống mối mọt"],
    rating: 4.9,
    reviews: 156
  },
  {
    id: "4",
    name: "Ván Dăm Chống Ẩm",
    price: "280,000",
    image: "/placeholder.svg", 
    category: "Ván Dăm",
    specs: ["16mm", "2440x1220mm", "Độ bền cao"],
    rating: 4.5,
    reviews: 67
  }
];

const CATEGORIES = ["Tất cả", "Ván MFC", "Ván MDF", "Ván Plywood", "Ván Dăm", "Phụ kiện"];
const COLORS = ["Tất cả", "Trắng", "Xám", "Vân gỗ sồi", "Vân gỗ óc chó", "Đen"];
const SIZES = ["Tất cả", "2440x1220mm", "2800x2070mm", "1830x2440mm"];
const THICKNESS = ["Tất cả", "6mm", "9mm", "12mm", "15mm", "18mm", "25mm"];

export default function Products() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [selectedColor, setSelectedColor] = useState("Tất cả");
  const [selectedSize, setSelectedSize] = useState("Tất cả");
  const [selectedThickness, setSelectedThickness] = useState("Tất cả");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-primary text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Sản Phẩm Gỗ Ép
            </h1>
            <p className="text-xl opacity-90 mb-8">
              Khám phá bộ sưu tập đa dạng các loại gỗ ép chất lượng cao
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-md">
              <Input
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10 bg-white/10 border-white/20 text-white placeholder:text-white/70"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/70" />
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-card rounded-lg border p-6 sticky top-24">
              <h3 className="font-semibold text-lg mb-6">Bộ lọc sản phẩm</h3>
              
              <div className="space-y-6">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium mb-3">Danh mục</label>
                  <div className="space-y-2">
                    {CATEGORIES.map((category) => (
                      <label key={category} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="category"
                          checked={selectedCategory === category}
                          onChange={() => setSelectedCategory(category)}
                          className="w-4 h-4 text-primary"
                        />
                        <span className="text-sm">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Color Filter */}
                <div>
                  <label className="block text-sm font-medium mb-3">Màu sắc</label>
                  <Select value={selectedColor} onValueChange={setSelectedColor}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {COLORS.map((color) => (
                        <SelectItem key={color} value={color}>{color}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Size Filter */}
                <div>
                  <label className="block text-sm font-medium mb-3">Kích thước</label>
                  <Select value={selectedSize} onValueChange={setSelectedSize}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SIZES.map((size) => (
                        <SelectItem key={size} value={size}>{size}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Thickness Filter */}
                <div>
                  <label className="block text-sm font-medium mb-3">Độ dày</label>
                  <Select value={selectedThickness} onValueChange={setSelectedThickness}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {THICKNESS.map((thickness) => (
                        <SelectItem key={thickness} value={thickness}>{thickness}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSelectedCategory("Tất cả");
                    setSelectedColor("Tất cả"); 
                    setSelectedSize("Tất cả");
                    setSelectedThickness("Tất cả");
                  }}
                  className="w-full"
                >
                  Xóa bộ lọc
                </Button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Bộ lọc
                </Button>
                
                <p className="text-muted-foreground">
                  Hiển thị {MOCK_PRODUCTS.length} sản phẩm
                </p>
              </div>

              <div className="flex items-center gap-4">
                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Mới nhất</SelectItem>
                    <SelectItem value="popular">Phổ biến</SelectItem>
                    <SelectItem value="price-low">Giá thấp đến cao</SelectItem>
                    <SelectItem value="price-high">Giá cao đến thấp</SelectItem>
                    <SelectItem value="name">Tên A-Z</SelectItem>
                  </SelectContent>
                </Select>

                {/* View Mode */}
                <div className="flex border border-input rounded-md">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-r-none"
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-l-none"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            <div className="flex flex-wrap gap-2 mb-6">
              {selectedCategory !== "Tất cả" && (
                <Badge variant="secondary" className="gap-2">
                  {selectedCategory}
                  <button onClick={() => setSelectedCategory("Tất cả")}>×</button>
                </Badge>
              )}
              {selectedColor !== "Tất cả" && (
                <Badge variant="secondary" className="gap-2">
                  {selectedColor}
                  <button onClick={() => setSelectedColor("Tất cả")}>×</button>
                </Badge>
              )}
              {selectedSize !== "Tất cả" && (
                <Badge variant="secondary" className="gap-2">
                  {selectedSize}
                  <button onClick={() => setSelectedSize("Tất cả")}>×</button>
                </Badge>
              )}
              {selectedThickness !== "Tất cả" && (
                <Badge variant="secondary" className="gap-2">
                  {selectedThickness}
                  <button onClick={() => setSelectedThickness("Tất cả")}>×</button>
                </Badge>
              )}
            </div>

            {/* Products Grid */}
            <div className={`grid gap-6 ${
              viewMode === "grid" 
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                : "grid-cols-1"
            }`}>
              {MOCK_PRODUCTS.map((product) => (
                <ProductCard
                  key={product.id}
                  {...product}
                  className={viewMode === "list" ? "flex-row" : ""}
                />
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-12">
              <Button variant="outline" size="lg">
                Xem thêm sản phẩm
              </Button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}