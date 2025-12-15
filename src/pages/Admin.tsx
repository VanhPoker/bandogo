import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Package,
  Users,
  ShoppingCart,
  BarChart3,
  Plus,
  Settings,
  Newspaper,
  Briefcase,
  Briefcase,
  ArrowLeft,
  Printer
} from "lucide-react";
import { ProductForm } from "@/components/ProductForm";
import { NewsManager } from "@/components/admin/NewsManager";
import { ProjectsManager } from "@/components/admin/ProjectsManager";
import { UsersManager } from "@/components/admin/UsersManager";
import { RevenueChart } from "@/components/admin/RevenueChart";
import { ImportManager } from "@/components/admin/ImportManager";
import { SuppliersManager } from "@/components/admin/SuppliersManager";
import { useProducts } from "@/hooks/useProducts";
import { supabase } from "@/integrations/supabase/client";

const OrdersList = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [orderDetails, setOrderDetails] = useState<any[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDetails = async (orderId: string) => {
    setLoadingDetails(true);
    try {
      const { data, error } = await supabase
        .from('order_items')
        .select(`
          *,
          products (
            name,
            images,
            price
          )
        `)
        .eq('order_id', orderId);

      if (error) throw error;
      setOrderDetails(data || []);
    } catch (error) {
      console.error('Error fetching order details:', error);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
    fetchOrderDetails(order.id);
  };

  if (loading) return <div>Đang tải đơn hàng...</div>;

  return (
    <div className="space-y-4">
      {orders.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">Chưa có đơn hàng nào</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="border rounded-lg p-4 flex justify-between items-center hover:bg-muted/50 transition-colors">
            <div>
              <p className="font-medium">Đơn hàng #{order.id.slice(0, 8)}</p>
              <p className="text-sm text-muted-foreground">
                {new Date(order.created_at).toLocaleDateString('vi-VN')} - {order.shipping_name}
              </p>
              <div className="flex gap-2 mt-1">
                <Badge variant="outline">{order.status}</Badge>
                <Badge variant="secondary">{order.payment_method}</Badge>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right mr-4">
                <p className="font-bold text-primary">
                  {order.total_amount.toLocaleString('vi-VN')}₫
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => handleViewOrder(order)}>
                Chi tiết
              </Button>
              <Button variant="ghost" size="icon" onClick={() => window.open(`/print/order/${order.id}`, '_blank')}>
                <Printer className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))
      )}

      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết đơn hàng #{selectedOrder?.id.slice(0, 8)}</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="font-semibold mb-2">Thông tin người nhận</h3>
              <p className="text-sm"><span className="text-muted-foreground">Tên:</span> {selectedOrder?.shipping_name}</p>
              <p className="text-sm"><span className="text-muted-foreground">SĐT:</span> {selectedOrder?.shipping_phone}</p>
              <p className="text-sm"><span className="text-muted-foreground">Địa chỉ:</span> {selectedOrder?.shipping_address}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Thông tin đơn hàng</h3>
              <p className="text-sm"><span className="text-muted-foreground">Ngày đặt:</span> {selectedOrder && new Date(selectedOrder.created_at).toLocaleDateString('vi-VN')}</p>
              <p className="text-sm"><span className="text-muted-foreground">Trạng thái:</span> {selectedOrder?.status}</p>
              <p className="text-sm"><span className="text-muted-foreground">Thanh toán:</span> {selectedOrder?.payment_method}</p>
            </div>
          </div>

          {/* Invoice Info Section */}
          {(selectedOrder?.customer_tax_code || selectedOrder?.invoice_requested) && (
            <div className="mb-6 border p-4 rounded-md bg-muted/30">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Newspaper className="h-4 w-4" /> Thông tin xuất hoá đơn
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <p className="text-sm"><span className="text-muted-foreground">Tên công ty:</span> {selectedOrder?.customer_company || '---'}</p>
                <p className="text-sm"><span className="text-muted-foreground">Mã số thuế:</span> {selectedOrder?.customer_tax_code || '---'}</p>
                <p className="text-sm col-span-2"><span className="text-muted-foreground">Địa chỉ hoá đơn:</span> {selectedOrder?.customer_address_invoice || '---'}</p>
              </div>
            </div>
          )}

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-4">Sản phẩm đã mua</h3>
            {loadingDetails ? (
              <div className="text-center py-4">Đang tải sản phẩm...</div>
            ) : (
              <div className="space-y-4">
                {orderDetails.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 border-b pb-4 last:border-0">
                    <div className="w-16 h-16 rounded overflow-hidden bg-muted flex-shrink-0">
                      {item.products?.images?.[0] ? (
                        <img
                          src={item.products.images[0]}
                          alt={item.products.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">No img</div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.products?.name || "Sản phẩm đã bị xóa"}</p>
                      <p className="text-sm text-muted-foreground">
                        {Number(item.price).toLocaleString('vi-VN')}₫ x {item.quantity}
                      </p>
                    </div>
                    <div className="font-bold">
                      {(Number(item.price) * item.quantity).toLocaleString('vi-VN')}₫
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t pt-4 mt-4 flex justify-between items-center">
            <span className="font-bold text-lg">Tổng cộng</span>
            <span className="font-bold text-xl text-primary">
              {selectedOrder?.total_amount.toLocaleString('vi-VN')}₫
            </span>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const Admin = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const { products, categories, deleteProduct } = useProducts();
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const [stats, setStats] = useState({
    users: 0,
    orders: 0,
    revenue: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch users count
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Fetch orders count and revenue
      const { data: ordersData } = await supabase
        .from('orders')
        .select('total_amount, status')
        .neq('status', 'cancelled');

      const ordersCount = ordersData?.length || 0;
      const totalRevenue = ordersData?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;

      setStats({
        users: usersCount || 0,
        orders: ordersCount,
        revenue: totalRevenue
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate("/auth");
    }
  }, [user, isAdmin, loading, navigate]);

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setIsProductDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?')) {
      await deleteProduct(id);
    }
  };

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
          <Button
            variant="ghost"
            className="mb-4 pl-0 hover:bg-transparent hover:text-primary"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Về trang chủ
          </Button>
          <div className="flex items-center gap-4 mb-2">
            <img src="/moctinhhoa.png" alt="Mộc Tinh Hoa" className="h-12 w-auto object-contain" />
            <h1 className="text-3xl font-bold">Bảng điều khiển Admin</h1>
          </div>
          <p className="text-muted-foreground">Quản lý website và sản phẩm</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tổng sản phẩm</p>
                  <p className="text-2xl font-bold">{products.length}</p>
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
                  <p className="text-2xl font-bold">{stats.users}</p>
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
                  <p className="text-2xl font-bold">{stats.orders}</p>
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
                  <p className="text-2xl font-bold">{stats.revenue.toLocaleString('vi-VN')}₫</p>
                </div>
                <BarChart3 className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Chart */}
        <div className="mb-8">
          <RevenueChart />
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="products" className="space-y-4">
          <TabsList className="flex flex-wrap h-auto">
            <TabsTrigger value="products">Sản phẩm</TabsTrigger>
            <TabsTrigger value="import">Nhập hàng</TabsTrigger>
            <TabsTrigger value="orders">Đơn hàng</TabsTrigger>
            <TabsTrigger value="suppliers">Nhà cung cấp</TabsTrigger>
            <TabsTrigger value="news">Tin tức</TabsTrigger>
            <TabsTrigger value="projects">Dự án</TabsTrigger>
            <TabsTrigger value="users">Người dùng</TabsTrigger>
            <TabsTrigger value="settings">Cài đặt</TabsTrigger>
          </TabsList>

          <TabsContent value="import" className="space-y-4">
            <ImportManager />
          </TabsContent>

          <TabsContent value="suppliers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Quản lý nhà cung cấp</CardTitle>
                <CardDescription>Danh sách các đối tác cung cấp hàng hoá</CardDescription>
              </CardHeader>
              <CardContent>
                <SuppliersManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">Quản lý sản phẩm</h2>
                <p className="text-muted-foreground">
                  Thêm, sửa, xóa và quản lý tất cả sản phẩm gỗ ép
                </p>
              </div>

              <Dialog open={isProductDialogOpen} onOpenChange={(open) => {
                setIsProductDialogOpen(open);
                if (!open) setEditingProduct(null);
              }}>
                <DialogTrigger asChild>
                  <Button onClick={() => setEditingProduct(null)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm sản phẩm
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingProduct ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}</DialogTitle>
                  </DialogHeader>
                  <ProductForm
                    initialData={editingProduct}
                    onSuccess={() => {
                      setIsProductDialogOpen(false);
                      setEditingProduct(null);
                    }}
                  />
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Danh sách sản phẩm</CardTitle>
                <CardDescription>
                  Tổng cộng {products.length} sản phẩm trong {categories.length} danh mục
                </CardDescription>
              </CardHeader>
              <CardContent>
                {products.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Chưa có sản phẩm nào</p>
                    <p className="text-sm mt-2">
                      Nhấn "Thêm sản phẩm" để bắt đầu thêm sản phẩm đầu tiên
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {products.map((product) => (
                      <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <img
                            src={product.images?.[0] || '/placeholder.svg'}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded-md"
                          />
                          <div>
                            <h3 className="font-medium">{product.name}</h3>
                            <p className="text-sm text-muted-foreground">{product.category}</p>
                            <p className="text-sm font-medium">{product.price.toLocaleString('vi-VN')} VNĐ</p>
                            <p className="text-xs text-muted-foreground">Kho: {product.stock_quantity}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={product.is_active ? "default" : "secondary"}>
                            {product.is_active ? "Hoạt động" : "Tạm dừng"}
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(product)}
                          >
                            Sửa
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(product.id)}
                          >
                            Xóa
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
                <OrdersList />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="news" className="space-y-4">
            <NewsManager />
          </TabsContent>

          <TabsContent value="projects" className="space-y-4">
            <ProjectsManager />
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
                <UsersManager />
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