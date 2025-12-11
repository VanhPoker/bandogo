import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Shield, ShieldAlert, ShieldCheck } from "lucide-react";

interface UserProfile {
    id: string;
    user_id: string;
    display_name: string | null;
    email: string | null; // Note: profiles might not have email if not synced, but usually we want it. 
    // If email is not in profiles, we might need to fetch from auth.users which is not directly accessible via client SDK for listing all users without edge function usually.
    // But let's assume we rely on what's in profiles or maybe we can't get email easily if not stored in public profile.
    // Let's check useAuth again, it uses user.email from session.
    // For listing ALL users, we might be limited to what's in 'profiles' table.
    // Let's assume 'profiles' has display_name.
}

interface UserRole {
    id: string;
    user_id: string;
    role: string;
}

interface UserWithRole extends UserProfile {
    role: string;
}

export const UsersManager = () => {
    const [users, setUsers] = useState<UserWithRole[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsersAndRoles();
    }, []);

    const fetchUsersAndRoles = async () => {
        try {
            setLoading(true);

            // Fetch profiles
            const { data: profiles, error: profilesError } = await supabase
                .from('profiles')
                .select('*');

            if (profilesError) throw profilesError;

            // Fetch roles
            const { data: roles, error: rolesError } = await supabase
                .from('user_roles')
                .select('*');

            if (rolesError) throw rolesError;

            // Merge data
            // Note: This assumes profiles table exists and has data.
            const mergedUsers = profiles.map((profile: any) => {
                const userRole = roles.find((r: any) => r.user_id === profile.user_id);
                return {
                    ...profile,
                    role: userRole?.role || 'user'
                };
            });

            setUsers(mergedUsers);
        } catch (error) {
            console.error('Error fetching users:', error);
            console.error('Error updating role:', error);
            toast.error("Lỗi khi cập nhật quyền");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateRole = async (userId: string, newRole: "user" | "admin") => {
        try {
            // Check if role entry exists
            const { data: existingRole } = await supabase
                .from('user_roles')
                .select('*')
                .eq('user_id', userId)
                .single();

            let error;

            if (existingRole) {
                const { error: updateError } = await supabase
                    .from('user_roles')
                    .update({ role: newRole })
                    .eq('user_id', userId);
                error = updateError;
            } else {
                const { error: insertError } = await supabase
                    .from('user_roles')
                    .insert({ user_id: userId, role: newRole });
                error = insertError;
            }

            if (error) throw error;

            toast.success(`Đã cập nhật quyền thành công`);
            fetchUsersAndRoles();
        } catch (error) {
            console.error('Error updating role:', error);
            toast.error("Lỗi khi cập nhật quyền");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center p-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Danh sách người dùng</h2>
                <Badge variant="outline" className="text-sm">
                    Tổng: {users.length}
                </Badge>
            </div>

            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Tên hiển thị</TableHead>
                            <TableHead>Vai trò hiện tại</TableHead>
                            <TableHead className="text-right">Thao tác</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                            {user.display_name?.[0]?.toUpperCase() || 'U'}
                                        </div>
                                        {user.display_name || 'Người dùng ẩn danh'}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={user.role === 'admin' ? 'destructive' : 'secondary'}>
                                        {user.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    {user.role === 'admin' ? (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleUpdateRole(user.user_id, 'user')}
                                            className="text-destructive hover:text-destructive"
                                        >
                                            <ShieldAlert className="w-4 h-4 mr-2" />
                                            Gỡ quyền Admin
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleUpdateRole(user.user_id, 'admin')}
                                            className="text-primary hover:text-primary"
                                        >
                                            <ShieldCheck className="w-4 h-4 mr-2" />
                                            Cấp quyền Admin
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};
