import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ProjectItem {
    id: string;
    title: string;
    description: string;
    content: string | null;
    image: string | null;
    client: string | null;
    completion_date: string | null;
    created_at: string;
}

export const ProjectsManager = () => {
    const [projects, setProjects] = useState<ProjectItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<ProjectItem | null>(null);

    const { register, handleSubmit, reset, setValue } = useForm<ProjectItem>();

    useEffect(() => {
        fetchProjects();
    }, []);

    useEffect(() => {
        if (editingItem) {
            setValue("title", editingItem.title);
            setValue("description", editingItem.description);
            setValue("content", editingItem.content);
            setValue("image", editingItem.image);
            setValue("client", editingItem.client);
            setValue("completion_date", editingItem.completion_date ? editingItem.completion_date.split('T')[0] : '');
        } else {
            reset();
        }
    }, [editingItem, setValue, reset]);

    const fetchProjects = async () => {
        try {
            const { data, error } = await supabase
                .from("projects")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            setProjects(data || []);
        } catch (error) {
            console.error("Error fetching projects:", error);
            toast.error("Không thể tải dự án");
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data: any) => {
        try {
            if (editingItem) {
                const { error } = await supabase
                    .from("projects")
                    .update(data)
                    .eq("id", editingItem.id);
                if (error) throw error;
                toast.success("Cập nhật dự án thành công");
            } else {
                const { error } = await supabase
                    .from("projects")
                    .insert(data);
                if (error) throw error;
                toast.success("Thêm dự án thành công");
            }
            setIsDialogOpen(false);
            setEditingItem(null);
            reset();
            fetchProjects();
        } catch (error) {
            console.error("Error saving project:", error);
            toast.error("Có lỗi xảy ra");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Bạn có chắc chắn muốn xóa dự án này?")) return;

        try {
            const { error } = await supabase
                .from("projects")
                .delete()
                .eq("id", id);
            if (error) throw error;
            toast.success("Xóa dự án thành công");
            fetchProjects();
        } catch (error) {
            console.error("Error deleting project:", error);
            toast.error("Không thể xóa dự án");
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Quản lý Dự án</h2>
                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                    setIsDialogOpen(open);
                    if (!open) {
                        setEditingItem(null);
                        reset();
                    }
                }}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Thêm dự án
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>{editingItem ? "Sửa dự án" : "Thêm dự án mới"}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Tên dự án</label>
                                <Input {...register("title", { required: true })} placeholder="Nhập tên dự án" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Khách hàng</label>
                                <Input {...register("client")} placeholder="Tên khách hàng" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Ngày hoàn thành</label>
                                <Input type="date" {...register("completion_date")} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Hình ảnh (URL)</label>
                                <Input {...register("image")} placeholder="https://example.com/image.jpg" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Mô tả ngắn</label>
                                <Textarea {...register("description", { required: true })} placeholder="Mô tả ngắn về dự án..." rows={3} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Nội dung chi tiết</label>
                                <Textarea {...register("content")} placeholder="Chi tiết dự án..." rows={5} />
                            </div>
                            <Button type="submit" className="w-full">
                                {editingItem ? "Lưu thay đổi" : "Thêm mới"}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Danh sách dự án</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Tên dự án</TableHead>
                                <TableHead>Khách hàng</TableHead>
                                <TableHead>Ngày hoàn thành</TableHead>
                                <TableHead className="text-right">Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {projects.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.title}</TableCell>
                                    <TableCell>{item.client || "N/A"}</TableCell>
                                    <TableCell>{item.completion_date ? new Date(item.completion_date).toLocaleDateString("vi-VN") : "N/A"}</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button variant="ghost" size="icon" onClick={() => {
                                            setEditingItem(item);
                                            setIsDialogOpen(true);
                                        }}>
                                            <Pencil className="w-4 h-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(item.id)}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {projects.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                        Chưa có dự án nào
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};
