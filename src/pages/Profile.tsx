import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { User, Phone, MapPin, Loader2 } from "lucide-react";

const Profile = () => {
    const { user, profile, loading, updateProfile } = useAuth();
    const navigate = useNavigate();
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        display_name: "",
        phone: "",
        address: "",
    });

    useEffect(() => {
        if (!loading && !user) {
            navigate("/auth");
        }
    }, [user, loading, navigate]);

    useEffect(() => {
        if (profile) {
            setFormData({
                display_name: profile.display_name || "",
                phone: profile.phone || "",
                address: profile.address || "",
            });
        }
    }, [profile]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        await updateProfile(formData);
        setSaving(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Hồ sơ cá nhân
                    </CardTitle>
                    <CardDescription>
                        Cập nhật thông tin cá nhân của bạn
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={user.email || ""}
                                disabled
                                className="bg-muted"
                            />
                            <p className="text-xs text-muted-foreground">
                                Email không thể thay đổi
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="display_name">Tên hiển thị</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="display_name"
                                    placeholder="Nhập tên hiển thị"
                                    value={formData.display_name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, display_name: e.target.value })
                                    }
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Số điện thoại</Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="phone"
                                    placeholder="Nhập số điện thoại"
                                    value={formData.phone}
                                    onChange={(e) =>
                                        setFormData({ ...formData, phone: e.target.value })
                                    }
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="address">Địa chỉ</Label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Textarea
                                    id="address"
                                    placeholder="Nhập địa chỉ của bạn"
                                    value={formData.address}
                                    onChange={(e) =>
                                        setFormData({ ...formData, address: e.target.value })
                                    }
                                    className="pl-10 min-h-[80px]"
                                />
                            </div>
                        </div>

                        <Button type="submit" className="w-full" disabled={saving}>
                            {saving ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Đang lưu...
                                </>
                            ) : (
                                "Lưu thay đổi"
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default Profile;
