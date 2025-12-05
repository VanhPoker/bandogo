import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function Checkout() {
    const { items, totalAmount, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        address: "",
        paymentMethod: "cod"
    });

    if (items.length === 0) {
        navigate("/cart");
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Create order
            // @ts-ignore
            const { data: order, error: orderError } = await supabase
                .from("orders")
                .insert({
                    user_id: user?.id || null,
                    total_amount: totalAmount,
                    shipping_name: formData.name,
                    shipping_phone: formData.phone,
                    shipping_address: formData.address,
                    payment_method: formData.paymentMethod,
                    status: "pending"
                })
                .select()
                .single();

            if (orderError) throw orderError;

            // Create order items
            const orderItems = items.map(item => ({
                order_id: order.id,
                product_id: item.id,
                quantity: item.quantity,
                price: item.price
            }));

            // @ts-ignore
            const { error: itemsError } = await supabase
                .from("order_items")
                .insert(orderItems);

            if (itemsError) throw itemsError;

            clearCart();
            toast.success("Đặt hàng thành công!");
            navigate("/order-success");

        } catch (error) {
            console.error("Checkout error:", error);
            toast.error("Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background py-8">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold mb-8">Thanh toán</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Shipping Form */}
                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle>Thông tin giao hàng</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Họ và tên</Label>
                                        <Input
                                            id="name"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="Nguyễn Văn A"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Số điện thoại</Label>
                                        <Input
                                            id="phone"
                                            required
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            placeholder="0912345678"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="address">Địa chỉ nhận hàng</Label>
                                        <Input
                                            id="address"
                                            required
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            placeholder="Số 1, Đường ABC, Quận XYZ, TP.HCM"
                                        />
                                    </div>

                                    <div className="space-y-2 pt-4">
                                        <Label>Phương thức thanh toán</Label>
                                        <RadioGroup
                                            value={formData.paymentMethod}
                                            onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
                                        >
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="cod" id="cod" />
                                                <Label htmlFor="cod">Thanh toán khi nhận hàng (COD)</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="banking" id="banking" />
                                                <Label htmlFor="banking">Chuyển khoản ngân hàng</Label>
                                            </div>
                                        </RadioGroup>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Order Summary */}
                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle>Đơn hàng của bạn</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {items.map((item) => (
                                        <div key={item.id} className="flex justify-between text-sm">
                                            <span>{item.name} x {item.quantity}</span>
                                            <span>{(item.price * item.quantity).toLocaleString('vi-VN')}₫</span>
                                        </div>
                                    ))}

                                    <Separator />

                                    <div className="flex justify-between font-bold text-lg">
                                        <span>Tổng cộng</span>
                                        <span className="text-primary">{totalAmount.toLocaleString('vi-VN')}₫</span>
                                    </div>

                                    <Button
                                        type="submit"
                                        form="checkout-form"
                                        className="w-full mt-4"
                                        size="lg"
                                        disabled={loading}
                                    >
                                        {loading ? "Đang xử lý..." : "Đặt hàng"}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
