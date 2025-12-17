import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Loader2 } from "lucide-react";

export default function ImportInvoice() {
    const { id } = useParams();
    const [order, setOrder] = useState<any>(null);
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) fetchOrder();
    }, [id]);

    const fetchOrder = async () => {
        try {
            // Fetch Order
            const { data: orderData, error: orderError } = await supabase
                .from('import_orders')
                .select('*, supplier:suppliers(*)')
                .eq('id', id)
                .single();

            if (orderError) throw orderError;

            // Fetch Items
            const { data: itemsData, error: itemsError } = await supabase
                .from('import_order_items')
                .select('*, product:products(name, category)')
                .eq('import_order_id', id);

            if (itemsError) throw itemsError;

            setOrder(orderData);
            setItems(itemsData || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!loading && order) {
            window.print();
        }
    }, [loading, order]);

    if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
    if (!order) return <div className="p-8 text-center text-red-500">Không tìm thấy đơn hàng</div>;

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white text-black print:p-0">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Gỗ Đại Thắng</h1>
                    <p>Địa chỉ: 123 Đường Gỗ, Khu CN ABC, TP.HCM</p>
                    <p>SĐT: 0123 456 789 | Email: info@moctinhhoa.com</p>
                    <p>Mã số thuế: 0123456789</p>
                </div>
                <div className="text-right">
                    <h2 className="text-2xl font-bold uppercase mb-2">Phiếu Nhập Kho</h2>
                    <p>Số: {order.id.slice(0, 8).toUpperCase()}</p>
                    <p>Ngày: {format(new Date(order.created_at), 'dd/MM/yyyy', { locale: vi })}</p>
                    <p>Invoice NCC: {order.invoice_number || '---'}</p>
                </div>
            </div>

            <div className="mb-8 border-t border-b py-4">
                <div className="grid grid-cols-2 gap-8">
                    <div>
                        <h3 className="font-bold mb-2">Nhà cung cấp</h3>
                        <p className="font-semibold">{order.supplier?.name}</p>
                        <p>Địa chỉ: {order.supplier?.address || '---'}</p>
                        <p>SĐT: {order.supplier?.phone || '---'}</p>
                    </div>
                    <div>
                        <h3 className="font-bold mb-2">Thông tin nhập</h3>
                        <p>Người tạo: Admin</p>
                        <p>Kho nhập: Kho tổng</p>
                        <p>Trạng thái: {order.status === 'completed' ? 'Hoàn thành' : order.status}</p>
                    </div>
                </div>
            </div>

            <table className="w-full mb-8 border-collapse">
                <thead>
                    <tr className="border-b-2 border-black">
                        <th className="text-left py-2 font-bold w-12">STT</th>
                        <th className="text-left py-2 font-bold">Mã sản phẩm</th>
                        <th className="text-left py-2 font-bold">Tên sản phẩm</th>
                        <th className="text-right py-2 font-bold w-24">SL</th>
                        <th className="text-right py-2 font-bold w-32">Đơn giá</th>
                        <th className="text-right py-2 font-bold w-32">Thành tiền</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, index) => (
                        <tr key={item.id} className="border-b border-gray-300">
                            <td className="py-2">{index + 1}</td>
                            <td className="py-2">{item.product_id.slice(0, 8).toUpperCase()}</td>
                            <td className="py-2">
                                <div className="font-semibold">{item.product?.name}</div>
                                <div className="text-sm text-gray-500">{item.product?.category}</div>
                            </td>
                            <td className="text-right py-2">{item.quantity}</td>
                            <td className="text-right py-2">{item.import_price.toLocaleString('vi-VN')}₫</td>
                            <td className="text-right py-2">{(item.quantity * item.import_price).toLocaleString('vi-VN')}₫</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan={5} className="text-right py-4 font-bold border-t-2 border-black">Tổng cộng:</td>
                        <td className="text-right py-4 font-bold border-t-2 border-black text-xl">
                            {order.total_amount.toLocaleString('vi-VN')}₫
                        </td>
                    </tr>
                </tfoot>
            </table>

            <div className="grid grid-cols-3 gap-4 mt-16 text-center">
                <div>
                    <p className="font-bold">Người lập phiếu</p>
                    <p className="text-sm italic text-gray-500">(Ký, ghi rõ họ tên)</p>
                    <div className="h-24"></div>
                </div>
                <div>
                    <p className="font-bold">Người giao hàng</p>
                    <p className="text-sm italic text-gray-500">(Ký, ghi rõ họ tên)</p>
                    <div className="h-24"></div>
                </div>
                <div>
                    <p className="font-bold">Thủ kho</p>
                    <p className="text-sm italic text-gray-500">(Ký, ghi rõ họ tên)</p>
                    <div className="h-24"></div>
                </div>
            </div>

            <div className="mt-8 text-center text-sm text-gray-400 print:hidden">
                <p>Ấn Ctrl + P để in phiếu này nếu cửa sổ in không tự động mở.</p>
            </div>
        </div>
    );
}
