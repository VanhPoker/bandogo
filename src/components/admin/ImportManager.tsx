import { useEffect, useState } from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Search, Trash2, Save, ArrowLeft, PackagePlus, Printer } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ImportOrder {
    id: string;
    supplier_id: string;
    total_amount: number;
    status: string;
    invoice_number: string | null;
    created_at: string;
    supplier?: { name: string };
    code?: string; // Virtual ID for display if needed
}

interface ImportItem {
    product_id: string;
    product_name: string;
    quantity: number;
    import_price: number;
    sell_price?: number; // Optional for updating sell price
}

interface Product {
    id: string;
    name: string;
    stock_quantity: number;
    price: number;
    cost_price?: number;
}

interface Supplier {
    id: string;
    name: string;
}

export const ImportManager = () => {
    const [mode, setMode] = useState<'list' | 'create'>('list');
    const [orders, setOrders] = useState<ImportOrder[]>([]);
    const [loading, setLoading] = useState(false);

    // Create Form State
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedSupplier, setSelectedSupplier] = useState("");
    const [invoiceNumber, setInvoiceNumber] = useState("");
    const [importItems, setImportItems] = useState<ImportItem[]>([]);

    // Add Item State
    const [selectedProduct, setSelectedProduct] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [importPrice, setImportPrice] = useState(0);
    const [newSellPrice, setNewSellPrice] = useState(0);

    // New Product State
    const [isNewProductOpen, setIsNewProductOpen] = useState(false);
    const [newProductName, setNewProductName] = useState("");
    const [newProductCategory, setNewProductCategory] = useState("Ván MDF"); // Default category
    const [newProductPrice, setNewProductPrice] = useState(0);

    const { toast } = useToast();

    useEffect(() => {
        if (mode === 'list') {
            fetchOrders();
        } else {
            fetchSuppliers();
            fetchProducts();
        }
    }, [mode]);

    const fetchOrders = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('import_orders')
            .select('*, supplier:suppliers(name)')
            .order('created_at', { ascending: false });

        if (error) {
            console.error(error);
            toast({ variant: "destructive", title: "Lỗi", description: "Không thể tải danh sách đơn nhập" });
        } else {
            setOrders(data as any || []);
        }
        setLoading(false);
    };

    const fetchSuppliers = async () => {
        const { data } = await supabase.from('suppliers').select('id, name');
        setSuppliers(data as any || []);
    };

    const fetchProducts = async () => {
        const { data } = await supabase.from('products').select('*');
        if (data) setProducts(data as any);
    };

    const handleAddItem = () => {
        if (!selectedProduct || quantity <= 0) return;

        const product = products.find(p => p.id === selectedProduct);
        if (!product) return;

        const existingItem = importItems.find(i => i.product_id === selectedProduct);
        if (existingItem) {
            toast({ title: "Thông báo", description: "Sản phẩm này đã có trong danh sách, vui lòng sửa số lượng" });
            return;
        }

        setImportItems([...importItems, {
            product_id: product.id,
            product_name: product.name,
            quantity,
            import_price: importPrice,
            sell_price: newSellPrice > 0 ? newSellPrice : undefined
        }]);

        // Reset inputs
        setSelectedProduct("");
        setQuantity(1);
        setImportPrice(0);
        setNewSellPrice(0);
    };

    const handleRemoveItem = (index: number) => {
        const newItems = [...importItems];
        newItems.splice(index, 1);
        setImportItems(newItems);
    };

    const handleCreateProduct = async () => {
        try {
            const { data, error } = await supabase
                .from('products')
                .insert([{
                    name: newProductName,
                    category: newProductCategory,
                    price: newProductPrice, // Initial sell price
                    stock_quantity: 0,
                    is_active: true
                }])
                .select()
                .single();

            if (error) throw error;

            toast({ title: "Thành công", description: "Đã tạo sản phẩm mới" });
            setProducts([...products, data as any]);
            setSelectedProduct(data.id); // Auto select
            setIsNewProductOpen(false);

            // Reset form
            setNewProductName("");
            setNewProductPrice(0);
        } catch (error) {
            console.error(error);
            toast({ variant: "destructive", title: "Lỗi", description: "Không thể tạo sản phẩm" });
        }
    };

    const handleSubmitOrder = async () => {
        // Auto-add pending item if user forgot to click "Add"
        let finalItems = [...importItems];
        if (finalItems.length === 0 && selectedProduct && quantity > 0) {
            const product = products.find(p => p.id === selectedProduct);
            if (product) {
                finalItems.push({
                    product_id: product.id,
                    product_name: product.name,
                    quantity,
                    import_price: importPrice,
                    sell_price: newSellPrice > 0 ? newSellPrice : undefined
                });
                toast({ title: "Thông báo", description: "Đã tự động thêm sản phẩm vào đơn hàng" });
            }
        }

        if (!selectedSupplier || finalItems.length === 0) {
            toast({ variant: "destructive", title: "Lỗi", description: "Vui lòng chọn nhà cung cấp và thêm sản phẩm" });
            return;
        }

        try {
            setLoading(true);

            // 1. Create Import Order
            const totalAmount = finalItems.reduce((sum, item) => sum + (item.quantity * item.import_price), 0);
            const { data: orderData, error: orderError } = await supabase
                .from('import_orders')
                .insert([{
                    supplier_id: selectedSupplier,
                    invoice_number: invoiceNumber,
                    total_amount: totalAmount,
                    status: 'completed' // Auto complete for now
                }])
                .select()
                .single();

            if (orderError) throw orderError;

            // 2. Create Items and Update Product Stock/Prices
            for (const item of finalItems) {
                // Create Import Item
                await supabase.from('import_order_items').insert({
                    import_order_id: orderData.id,
                    product_id: item.product_id,
                    quantity: item.quantity,
                    import_price: item.import_price,
                    total_price: item.quantity * item.import_price
                });

                // Update Product
                const updates: any = {
                    // We'll rely on our local product data for the calculation or fetch fresh.
                };

                // We will fetch fresh product to be safe
                const { data: currentProd } = await supabase.from('products').select('stock_quantity').eq('id', item.product_id).single();

                if (currentProd) {
                    updates.stock_quantity = currentProd.stock_quantity + item.quantity;
                    updates.cost_price = item.import_price;
                    if (item.sell_price) {
                        updates.price = item.sell_price;
                    }

                    await supabase.from('products').update(updates).eq('id', item.product_id);
                }
            }

            toast({ title: "Thành công", description: "Đã nhập hàng thành công" });
            setMode('list');
            // Reset form
            setImportItems([]);
            setSelectedSupplier("");
            setInvoiceNumber("");

            // Reset pending inputs too
            setSelectedProduct("");
            setQuantity(1);
            setImportPrice(0);
            setNewSellPrice(0);

        } catch (error) {
            console.error("Error creating import:", error);
            toast({ variant: "destructive", title: "Lỗi", description: "Có lỗi khi tạo đơn nhập" });
        } finally {
            setLoading(false);
        }
    };

    if (mode === 'create') {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => setMode('list')}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h2 className="text-xl font-bold">Tạo đơn nhập hàng</h2>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Thông tin chung</CardTitle>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Nhà cung cấp</Label>
                            <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn nhà cung cấp" />
                                </SelectTrigger>
                                <SelectContent>
                                    {suppliers.map(s => (
                                        <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Số hoá đơn (Invoice)</Label>
                            <Input
                                value={invoiceNumber}
                                onChange={(e) => setInvoiceNumber(e.target.value)}
                                placeholder="VD: INV-001"
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Chi tiết sản phẩm</CardTitle>
                        <Dialog open={isNewProductOpen} onOpenChange={setIsNewProductOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                    <PackagePlus className="mr-2 h-4 w-4" />
                                    Tạo SP Mới
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Thêm sản phẩm mới</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label>Tên sản phẩm</Label>
                                        <Input value={newProductName} onChange={e => setNewProductName(e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Danh mục</Label>
                                        <Select value={newProductCategory} onValueChange={setNewProductCategory}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Ván MDF">Ván MDF</SelectItem>
                                                <SelectItem value="Ván MFC">Ván MFC</SelectItem>
                                                <SelectItem value="Gỗ Ghép">Gỗ Ghép</SelectItem>
                                                <SelectItem value="Phụ kiện">Phụ kiện</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Giá bán dự kiến</Label>
                                        <Input type="number" value={newProductPrice} onChange={e => setNewProductPrice(Number(e.target.value))} />
                                    </div>
                                    <Button onClick={handleCreateProduct} className="w-full">Tạo Sản Phẩm</Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-5 gap-4 items-end border p-4 rounded-lg bg-muted/20">
                            <div className="md:col-span-2 space-y-2">
                                <Label>Sản phẩm</Label>
                                <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn sản phẩm..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {products.map(p => (
                                            <SelectItem key={p.id} value={p.id}>
                                                {p.name} (Kho: {p.stock_quantity})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Số lượng</Label>
                                <Input type="number" min="1" value={quantity} onChange={e => setQuantity(Number(e.target.value))} />
                            </div>
                            <div className="space-y-2">
                                <Label>Giá nhập (đơn vị)</Label>
                                <Input type="number" value={importItems.find(i => i.product_id === selectedProduct)?.import_price || importPrice} onChange={e => setImportPrice(Number(e.target.value))} />
                            </div>
                            {/* Optional Sell Price Update */}
                            <div className="space-y-2">
                                <Label>Giá bán mới (tuỳ chọn)</Label>
                                <Input type="number" placeholder="Giữ nguyên" value={newSellPrice || ''} onChange={e => setNewSellPrice(Number(e.target.value))} />
                            </div>

                            <Button onClick={handleAddItem} className="w-full md:w-auto">
                                <Plus className="mr-2 h-4 w-4" /> Thêm
                            </Button>
                        </div>

                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Sản phẩm</TableHead>
                                    <TableHead className="text-right">Số lượng</TableHead>
                                    <TableHead className="text-right">Giá nhập</TableHead>
                                    <TableHead className="text-right">Thành tiền</TableHead>
                                    <TableHead></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {importItems.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <div>{item.product_name}</div>
                                            {item.sell_price && <div className="text-xs text-green-600">Giá bán mới: {item.sell_price.toLocaleString()}đ</div>}
                                        </TableCell>
                                        <TableCell className="text-right">{item.quantity}</TableCell>
                                        <TableCell className="text-right">{item.import_price.toLocaleString()}đ</TableCell>
                                        <TableCell className="text-right">{(item.quantity * item.import_price).toLocaleString()}đ</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm" onClick={() => handleRemoveItem(index)}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {importItems.length > 0 && (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-right font-bold">Tổng cộng:</TableCell>
                                        <TableCell className="text-right font-bold">
                                            {importItems.reduce((sum, item) => sum + (item.quantity * item.import_price), 0).toLocaleString()}đ
                                        </TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-3">
                    <Button variant="ghost" onClick={() => setMode('list')}>Huỷ</Button>
                    <Button onClick={handleSubmitOrder} disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        <Save className="mr-2 h-4 w-4" /> Lưu đơn nhập
                    </Button>
                </div>
            </div>
        );
    }

    // List View
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Quản lý nhập hàng</h2>
                <Button onClick={() => setMode('create')}>
                    <Plus className="mr-2 h-4 w-4" /> Nhập hàng mới
                </Button>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Mã đơn/Ngày</TableHead>
                            <TableHead>Nhà cung cấp</TableHead>
                            <TableHead>Hoá đơn</TableHead>
                            <TableHead className="text-right">Tổng tiền</TableHead>
                            <TableHead>Trạng thái</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow><TableCell colSpan={5} className="text-center py-8"><Loader2 className="mx-auto animate-spin" /></TableCell></TableRow>
                        ) : orders.length === 0 ? (
                            <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Chưa có đơn nhập hàng nào</TableCell></TableRow>
                        ) : (
                            orders.map(order => (
                                <TableRow key={order.id}>
                                    <TableCell>
                                        <div className="font-medium text-xs">{order.id.slice(0, 8)}...</div>
                                        <div className="text-xs text-muted-foreground">{format(new Date(order.created_at), 'dd/MM/yyyy HH:mm', { locale: vi })}</div>
                                    </TableCell>
                                    <TableCell>{order.supplier?.name || 'Unknown'}</TableCell>
                                    <TableCell>{order.invoice_number || '-'}</TableCell>
                                    <TableCell className="text-right font-medium">{order.total_amount.toLocaleString()}đ</TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Badge variant="secondary">{order.status === 'completed' ? 'Hoàn thành' : order.status}</Badge>
                                            <Button variant="ghost" size="icon" onClick={() => window.open(`/print/import/${order.id}`, '_blank')}>
                                                <Printer className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};
