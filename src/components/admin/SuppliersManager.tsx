import { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Plus, Pencil, Trash2, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Supplier {
    id: string;
    name: string;
    contact_person: string | null;
    phone: string | null;
    email: string | null;
    address: string | null;
    tax_code: string | null;
    created_at: string;
}

export const SuppliersManager = () => {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        contact_person: "",
        phone: "",
        email: "",
        address: "",
        tax_code: ""
    });
    const { toast } = useToast();

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const fetchSuppliers = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('suppliers')
                .select('*')
                .order('name');

            if (error) throw error;
            setSuppliers(data as Supplier[] || []);
        } catch (error) {
            console.error('Error fetching suppliers:', error);
            toast({
                variant: "destructive",
                title: "Lỗi",
                description: "Không thể tải danh sách nhà cung cấp"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingSupplier) {
                const { error } = await supabase
                    .from('suppliers')
                    .update(formData)
                    .eq('id', editingSupplier.id);

                if (error) throw error;
                toast({ title: "Thành công", description: "Đã cập nhật nhà cung cấp" });
            } else {
                const { error } = await supabase
                    .from('suppliers')
                    .insert([formData]);

                if (error) throw error;
                toast({ title: "Thành công", description: "Đã thêm nhà cung cấp mới" });
            }

            setIsDialogOpen(false);
            resetForm();
            fetchSuppliers();
        } catch (error) {
            console.error('Error saving supplier:', error);
            toast({
                variant: "destructive",
                title: "Lỗi",
                description: "Không thể lưu thông tin nhà cung cấp"
            });
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Bạn có chắc chắn muốn xóa nhà cung cấp này?")) return;

        try {
            const { error } = await supabase
                .from('suppliers')
                .delete()
                .eq('id', id);

            if (error) throw error;
            toast({ title: "Thành công", description: "Đã xóa nhà cung cấp" });
            fetchSuppliers();
        } catch (error) {
            console.error('Error deleting supplier:', error);
            toast({
                variant: "destructive",
                title: "Lỗi",
                description: "Không thể xóa nhà cung cấp"
            });
        }
    };

    const handleEdit = (supplier: Supplier) => {
        setEditingSupplier(supplier);
        setFormData({
            name: supplier.name,
            contact_person: supplier.contact_person || "",
            phone: supplier.phone || "",
            email: supplier.email || "",
            address: supplier.address || "",
            tax_code: supplier.tax_code || ""
        });
        setIsDialogOpen(true);
    };

    const resetForm = () => {
        setEditingSupplier(null);
        setFormData({
            name: "",
            contact_person: "",
            phone: "",
            email: "",
            address: "",
            tax_code: ""
        });
    };

    const filteredSuppliers = suppliers.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.contact_person?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div className="relative w-72">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Tìm kiếm nhà cung cấp..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                    />
                </div>

                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                    setIsDialogOpen(open);
                    if (!open) resetForm();
                }}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Thêm nhà cung cấp
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>{editingSupplier ? 'Sửa nhà cung cấp' : 'Thêm nhà cung cấp mới'}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Tên Công Ty *</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="tax_code">Mã Số Thuế</Label>
                                    <Input
                                        id="tax_code"
                                        value={formData.tax_code}
                                        onChange={(e) => setFormData({ ...formData, tax_code: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="contact_person">Người liên hệ</Label>
                                    <Input
                                        id="contact_person"
                                        value={formData.contact_person}
                                        onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Điện thoại</Label>
                                    <Input
                                        id="phone"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address">Địa chỉ</Label>
                                <Input
                                    id="address"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                />
                            </div>

                            <div className="flex justify-end pt-4">
                                <Button type="submit">
                                    {editingSupplier ? 'Cập nhật' : 'Thêm mới'}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Tên Công Ty</TableHead>
                            <TableHead>MST</TableHead>
                            <TableHead>Người liên hệ</TableHead>
                            <TableHead>Liên lạc</TableHead>
                            <TableHead className="text-right">Thao tác</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8">
                                    <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                                </TableCell>
                            </TableRow>
                        ) : filteredSuppliers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                    Chưa có nhà cung cấp nào
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredSuppliers.map((supplier) => (
                                <TableRow key={supplier.id}>
                                    <TableCell className="font-medium">{supplier.name}</TableCell>
                                    <TableCell>{supplier.tax_code}</TableCell>
                                    <TableCell>{supplier.contact_person}</TableCell>
                                    <TableCell>
                                        <div className="text-xs">
                                            {supplier.phone && <div>{supplier.phone}</div>}
                                            {supplier.email && <div className="text-muted-foreground">{supplier.email}</div>}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button variant="ghost" size="icon" onClick={() => handleEdit(supplier)}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(supplier.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
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
