import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function OrderSuccess() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="text-center max-w-md">
                <div className="flex justify-center mb-6">
                    <CheckCircle className="w-24 h-24 text-green-500" />
                </div>
                <h1 className="text-3xl font-bold mb-4">Đặt hàng thành công!</h1>
                <p className="text-muted-foreground mb-8">
                    Cảm ơn bạn đã mua hàng. Chúng tôi sẽ liên hệ với bạn sớm nhất để xác nhận đơn hàng.
                </p>
                <div className="space-y-4">
                    <Button asChild size="lg" className="w-full">
                        <Link to="/products">Tiếp tục mua sắm</Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="w-full">
                        <Link to="/">Về trang chủ</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
