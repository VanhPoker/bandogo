import { Play, Factory, Settings, Users, PackageCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const videos = [
    "0ae4bbf2-cc1a-4304-9137-683dab18bbe6.mp4",
    "0b27b049-ed44-46af-9aed-cda77eefadb8.mp4",
    "2bbf5945-f8a7-4cf2-8602-c84d2568121a.mp4",
    "6a445280-7f8b-43f9-b3cb-ba42cd242ec2.mp4",
    "72ea099d-c83e-4228-a064-c55fd87bf0e3.mp4",
    "ac8e936d-c3d7-410c-b9e5-bca44d0f9c71.mp4",
    "b3a8d2b3-641e-4d9c-9a4d-ec56590606e6.mp4"
];

export const ProductionProcess = () => {
    return (
        <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                        Quy Trình Sản Xuất
                    </h2>
                    <div className="h-1 w-20 bg-primary mx-auto rounded-full" />
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Khám phá quy trình công nghệ hiện đại tạo nên những tấm ván gỗ chất lượng cao
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {videos.map((video, index) => (
                        <Card key={index} className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-muted/50">
                            <CardContent className="p-0 relative aspect-video">
                                <video
                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                    controls
                                    preload="metadata"
                                >
                                    <source src={`/video/${video}`} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                    <p className="text-white font-medium text-sm">Giai đoạn {index + 1}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {/* Feature Card for the last grid item if odd number */}
                    <Card className="group overflow-hidden border-0 shadow-lg bg-primary text-primary-foreground flex flex-col items-center justify-center p-6 text-center h-full min-h-[200px]">
                        <Factory className="w-12 h-12 mb-4 animate-pulse" />
                        <h3 className="font-bold text-xl mb-2">Công Nghệ Hiện Đại</h3>
                        <p className="text-primary-foreground/80 text-sm">
                            Dây chuyền sản xuất công nghệ cao
                        </p>
                    </Card>
                </div>
            </div>
        </section>
    );
};
