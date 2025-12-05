import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/useCart";
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from "lucide-react";

export default function Cart() {
    const { items, removeItem, updateQuantity, totalAmount, clearCart } = useCart();
    const navigate = useNavigate();

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-background py-12">
                <div className="container mx-auto px-4 text-center">
                    <div className="flex justify-center mb-6">
                        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center">
                            <ShoppingBag className="w-12 h-12 text-muted-foreground" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold mb-4">Giỏ hàng của bạn đang trống</h1>
                    <p className="text-muted-foreground mb-8">
                        Hãy dạo quanh cửa hàng và thêm những sản phẩm yêu thích vào giỏ hàng nhé.
                    </p>
                    <Button asChild size="lg">
                        <Link to="/products">Tiếp tục mua sắm</Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background py-8">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold mb-8">Giỏ hàng ({items.length} sản phẩm)</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {items.map((item) => (
                            <Card key={item.id}>
                                <CardContent className="p-4">
                                    <div className="flex gap-4">
                                        <div className="w-24 h-24 bg-muted rounded-md overflow-hidden flex-shrink-0">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        <div className="flex-1 flex flex-col justify-between">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-medium text-lg">{item.name}</h3>
                                                    <p className="text-primary font-semibold">
                                                        {item.price.toLocaleString('vi-VN')}₫
                                                    </p>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-muted-foreground hover:text-destructive"
                                                    onClick={() => removeItem(item.id)}
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </Button>
                                            </div>

                                            <div className="flex items-center gap-4 mt-4">
                                                <div className="flex items-center border border-input rounded-md">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="px-3 py-1 hover:bg-muted transition-colors"
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </button>
                                                    <span className="w-12 text-center font-medium">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="px-3 py-1 hover:bg-muted transition-colors"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <div className="ml-auto font-semibold">
                                                    {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        <Button
                            variant="outline"
                            className="mt-4"
                            onClick={clearCart}
                        >
                            Xóa tất cả
                        </Button>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-24">
                            <CardContent className="p-6">
                                <h3 className="text-lg font-semibold mb-4">Tổng đơn hàng</h3>

                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-muted-foreground">
                                        <span>Tạm tính</span>
                                        <span>{totalAmount.toLocaleString('vi-VN')}₫</span>
                                    </div>
                                    <div className="flex justify-between text-muted-foreground">
                                        <span>Phí vận chuyển</span>
                                        <span>Chưa tính</span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between font-bold text-lg">
                                        <span>Tổng cộng</span>
                                        <span className="text-primary">{totalAmount.toLocaleString('vi-VN')}₫</span>
                                    </div>
                                </div>

                                <Button className="w-full" size="lg" onClick={() => navigate('/checkout')}>
                                    Tiến hành thanh toán
                                </Button>

                                <Button variant="link" className="w-full mt-2" asChild>
                                    <Link to="/products">
                                        <ArrowLeft className="w-4 h-4 mr-2" />
                                        Tiếp tục mua sắm
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
