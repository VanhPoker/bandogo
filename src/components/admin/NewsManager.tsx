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

interface NewsItem {
    id: string;
    title: string;
    content: string;
    image: string | null;
    author: string | null;
    created_at: string;
}

export const NewsManager = () => {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<NewsItem | null>(null);

    const { register, handleSubmit, reset, setValue } = useForm<NewsItem>();

    useEffect(() => {
        fetchNews();
    }, []);

    useEffect(() => {
        if (editingItem) {
            setValue("title", editingItem.title);
            setValue("content", editingItem.content);
            setValue("image", editingItem.image);
            setValue("author", editingItem.author);
        } else {
            reset();
        }
    }, [editingItem, setValue, reset]);

    const fetchNews = async () => {
        try {
            const { data, error } = await supabase
                .from("news")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            setNews(data || []);
        } catch (error) {
            console.error("Error fetching news:", error);
            toast.error("Không thể tải tin tức");
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data: any) => {
        try {
            if (editingItem) {
                const { error } = await supabase
                    .from("news")
                    .update(data)
                    .eq("id", editingItem.id);
                if (error) throw error;
                toast.success("Cập nhật tin tức thành công");
            } else {
                const { error } = await supabase
                    .from("news")
                    .insert(data);
                if (error) throw error;
                toast.success("Thêm tin tức thành công");
            }
            setIsDialogOpen(false);
            setEditingItem(null);
            reset();
            fetchNews();
        } catch (error) {
            console.error("Error saving news:", error);
            toast.error("Có lỗi xảy ra");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Bạn có chắc chắn muốn xóa tin tức này?")) return;

        try {
            const { error } = await supabase
                .from("news")
                .delete()
                .eq("id", id);
            if (error) throw error;
            toast.success("Xóa tin tức thành công");
            fetchNews();
        } catch (error) {
            console.error("Error deleting news:", error);
            toast.error("Không thể xóa tin tức");
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Quản lý Tin tức</h2>
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
                            Thêm tin tức
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>{editingItem ? "Sửa tin tức" : "Thêm tin tức mới"}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Tiêu đề</label>
                                <Input {...register("title", { required: true })} placeholder="Nhập tiêu đề tin tức" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Hình ảnh (URL)</label>
                                <Input {...register("image")} placeholder="https://example.com/image.jpg" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Tác giả</label>
                                <Input {...register("author")} placeholder="Tên tác giả" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Nội dung</label>
                                <Textarea {...register("content", { required: true })} placeholder="Nội dung chi tiết..." rows={5} />
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
                    <CardTitle>Danh sách tin tức</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Tiêu đề</TableHead>
                                <TableHead>Tác giả</TableHead>
                                <TableHead>Ngày tạo</TableHead>
                                <TableHead className="text-right">Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {news.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.title}</TableCell>
                                    <TableCell>{item.author || "N/A"}</TableCell>
                                    <TableCell>{new Date(item.created_at).toLocaleDateString("vi-VN")}</TableCell>
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
                            {news.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                        Chưa có tin tức nào
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
