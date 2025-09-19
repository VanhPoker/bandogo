import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { 
  Search, 
  ShoppingCart, 
  User, 
  Menu, 
  X,
  Phone,
  Mail,
  LogOut,
  Settings
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, profile, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  const navigation = [
    { name: "Trang chủ", href: "/" },
    { name: "Sản phẩm", href: "/products" },
    { name: "Dự án", href: "/projects" },
    { name: "Tin tức", href: "/news" },
    { name: "Giới thiệu", href: "/about" },
    { name: "Liên hệ", href: "/contact" }
  ];

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      {/* Top bar with contact info */}
      <div className="bg-primary/5 border-b border-border/50">
        <div className="container mx-auto px-4 py-2">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>Hotline: 0123 456 789</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>info@goep.com</span>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <span className="text-muted-foreground">
                  Xin chào, {profile?.display_name || user.email}
                </span>
              ) : (
                <>
                  <Link to="/auth" className="text-muted-foreground hover:text-primary transition-colors">
                    Đăng nhập
                  </Link>
                  <Link to="/auth" className="text-muted-foreground hover:text-primary transition-colors">
                    Đăng ký
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-wood rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">G</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-foreground">Gỗ Ép Premium</h1>
              <p className="text-xs text-muted-foreground">Chất lượng - Uy tín - Bền vững</p>
            </div>
          </Link>

          {/* Search bar - Desktop */}
          <div className="hidden md:flex items-center flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Input 
                placeholder="Tìm kiếm sản phẩm..." 
                className="pr-10"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Search - Mobile */}
            <Button variant="ghost" size="icon" className="md:hidden">
              <Search className="w-5 h-5" />
            </Button>

            {/* User account */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="hidden sm:flex">
                    <User className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="font-medium">
                    {profile?.display_name || user.email}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="flex items-center gap-2">
                        <Settings className="w-4 h-4" />
                        Quản lý
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 text-destructive">
                    <LogOut className="w-4 h-4" />
                    Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="icon" className="hidden sm:flex" asChild>
                <Link to="/auth">
                  <User className="w-5 h-5" />
                </Link>
              </Button>
            )}

            {/* Shopping cart */}
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="w-5 h-5" />
              <Badge className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center text-xs">
                0
              </Badge>
            </Button>

            {/* Mobile menu button */}
            <Button 
              variant="ghost" 
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Navigation - Desktop */}
        <nav className="hidden md:block border-t border-border/50">
          <div className="flex items-center justify-center space-x-8 py-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </nav>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="container mx-auto px-4 py-4 space-y-4">
            {/* Mobile search */}
            <div className="relative">
              <Input placeholder="Tìm kiếm sản phẩm..." className="pr-10" />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>
            
            {/* Mobile navigation */}
            <nav className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block py-2 text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};