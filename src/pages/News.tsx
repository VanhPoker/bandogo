import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar, User } from "lucide-react";

interface NewsItem {
    id: string;
    title: string;
    content: string;
    image: string | null;
    author: string | null;
    created_at: string;
}

const News = () => {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        try {
            // @ts-ignore
            const { data, error } = await supabase
                .from("news")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            // @ts-ignore
            setNews(data || []);
        } catch (error) {
            console.error("Error fetching news:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mb-4"></div>
                    <p className="text-muted-foreground">Đang tải tin tức...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background py-12">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">Tin Tức & Sự Kiện</h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Cập nhật những thông tin mới nhất về thị trường gỗ, xu hướng nội thất và hoạt động của chúng tôi
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {news.map((item) => (
                        <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="aspect-video relative overflow-hidden">
                                <img
                                    src={item.image || "/placeholder.svg"}
                                    alt={item.title}
                                    className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                            <CardHeader>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        {new Date(item.created_at).toLocaleDateString("vi-VN")}
                                    </div>
                                    {item.author && (
                                        <div className="flex items-center gap-1">
                                            <User className="w-4 h-4" />
                                            {item.author}
                                        </div>
                                    )}
                                </div>
                                <CardTitle className="line-clamp-2 hover:text-primary cursor-pointer">
                                    {item.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="line-clamp-3">
                                    {item.content}
                                </CardDescription>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {news.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        Chưa có tin tức nào được đăng tải.
                    </div>
                )}
            </div>
        </div>
    );
};

export default News;
