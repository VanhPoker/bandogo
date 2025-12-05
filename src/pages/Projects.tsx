import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Briefcase } from "lucide-react";

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

const Projects = () => {
    const [projects, setProjects] = useState<ProjectItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            // @ts-ignore
            const { data, error } = await supabase
                .from("projects")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            // @ts-ignore
            setProjects(data || []);
        } catch (error) {
            console.error("Error fetching projects:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mb-4"></div>
                    <p className="text-muted-foreground">Đang tải dự án...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background py-12">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">Dự Án Tiêu Biểu</h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Khám phá những dự án nội thất và xây dựng đã được chúng tôi thực hiện thành công
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {projects.map((item) => (
                        <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
                            <div className="aspect-video relative overflow-hidden">
                                <img
                                    src={item.image || "/placeholder.svg"}
                                    alt={item.title}
                                    className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                            <CardHeader>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-2">
                                    {item.completion_date && (
                                        <Badge variant="secondary" className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(item.completion_date).toLocaleDateString("vi-VN")}
                                        </Badge>
                                    )}
                                    {item.client && (
                                        <div className="flex items-center gap-1">
                                            <User className="w-4 h-4" />
                                            Khách hàng: {item.client}
                                        </div>
                                    )}
                                </div>
                                <CardTitle className="text-2xl hover:text-primary cursor-pointer">
                                    {item.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <p className="text-muted-foreground mb-4">
                                    {item.description}
                                </p>
                                {item.content && (
                                    <p className="text-sm text-muted-foreground line-clamp-3">
                                        {item.content}
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {projects.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        Chưa có dự án nào được cập nhật.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Projects;
