import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Printer, Eye, Package } from "lucide-react";

export default function MyOrders() {
    const { user } = useAuth();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchOrders();
        }
    }, [user]);

    const fetchOrders = async () => {
        try {
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .eq('user_id', user?.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setOrders(data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen py-12 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background py-8">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold mb-8">Lịch sử đơn hàng</h1>

                {orders.length === 0 ? (
                    <div className="text-center py-12">
                        <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                        <h2 className="text-xl font-semibold mb-2">Bạn chưa có đơn hàng nào</h2>
                        <Button asChild className="mt-4">
                            <Link to="/products">Dạo kho hàng ngay</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <Card key={order.id}>
                                <CardContent className="p-6">
                                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="font-bold text-lg">#{order.id.slice(0, 8).toUpperCase()}</span>
                                                <Badge>{order.status === 'completed' ? 'Hoàn thành' : order.status}</Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                Ngày đặt: {format(new Date(order.created_at), 'dd/MM/yyyy HH:mm', { locale: vi })}
                                            </p>
                                            <p className="text-sm">
                                                Tổng tiền: <span className="font-bold text-primary">{order.total_amount.toLocaleString('vi-VN')}₫</span>
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            {/* We could add a details view via dialog later, for now just print */}
                                            {/* Only allow print if paid or confirm? Usually logic depends on business. */}
                                            {/* Request said: "xuất hóa đơn cho các đơn hàng đã thanh toán" */}
                                            {(order.status === 'completed' || order.status === 'paid') && (
                                                <Button variant="outline" size="sm" onClick={() => window.open(`/print/order/${order.id}`, '_blank')}>
                                                    <Printer className="w-4 h-4 mr-2" />
                                                    In hóa đơn
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
