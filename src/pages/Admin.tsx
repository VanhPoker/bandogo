import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Package, 
  Users, 
  ShoppingCart, 
  BarChart3,
  Plus,
  Settings
} from "lucide-react";

const Admin = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate("/auth");
    }
  }, [user, isAdmin, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Bảng điều khiển Admin</h1>
          <p className="text-muted-foreground">Quản lý website và sản phẩm</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tổng sản phẩm</p>
                  <p className="text-2xl font-bold">156</p>
                </div>
                <Package className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Người dùng</p>
                  <p className="text-2xl font-bold">48</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Đơn hàng</p>
                  <p className="text-2xl font-bold">23</p>
                </div>
                <ShoppingCart className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Doanh thu</p>
                  <p className="text-2xl font-bold">2.4M</p>
                </div>
                <BarChart3 className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="products" className="space-y-4">
          <TabsList>
            <TabsTrigger value="products">Sản phẩm</TabsTrigger>
            <TabsTrigger value="orders">Đơn hàng</TabsTrigger>
            <TabsTrigger value="users">Người dùng</TabsTrigger>
            <TabsTrigger value="settings">Cài đặt</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Quản lý sản phẩm</CardTitle>
                    <CardDescription>
                      Thêm, sửa, xóa và quản lý tất cả sản phẩm gỗ ép
                    </CardDescription>
                  </div>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm sản phẩm
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Chức năng quản lý sản phẩm sẽ được triển khai ở đây</p>
                  <p className="text-sm mt-2">
                    Bao gồm: Thêm/sửa/xóa sản phẩm, quản lý hình ảnh, danh mục, giá cả
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Quản lý đơn hàng</CardTitle>
                <CardDescription>
                  Theo dõi và xử lý các đơn hàng từ khách hàng
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Chức năng quản lý đơn hàng sẽ được triển khai ở đây</p>
                  <p className="text-sm mt-2">
                    Bao gồm: Xem đơn hàng, cập nhật trạng thái, in hóa đơn
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Quản lý người dùng</CardTitle>
                <CardDescription>
                  Quản lý tài khoản người dùng và phân quyền
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Chức năng quản lý người dùng sẽ được triển khai ở đây</p>
                  <p className="text-sm mt-2">
                    Bao gồm: Xem danh sách user, phân quyền admin, khóa tài khoản
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Cài đặt hệ thống</CardTitle>
                <CardDescription>
                  Cấu hình các thông số của website
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Chức năng cài đặt hệ thống sẽ được triển khai ở đây</p>
                  <p className="text-sm mt-2">
                    Bao gồm: Thông tin công ty, logo, thông tin liên hệ, SEO
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;