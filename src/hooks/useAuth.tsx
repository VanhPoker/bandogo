import { createContext, useContext, useEffect, useRef, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Profile {
  id: string;
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  address: string | null;
}

interface UserRole {
  role: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  roles: string[];
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, displayName?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const isAdmin = roles.includes('admin');
  const loadedUserId = useRef<string | null>(null);

  useEffect(() => {
    // INITIAL_SESSION covers the stored session, so there is no separate
    // getSession() call to avoid fetching everything twice on startup.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        const userId = session?.user?.id ?? null;

        if (!userId) {
          loadedUserId.current = null;
          setProfile(null);
          setRoles([]);
          setLoading(false);
          return;
        }

        // TOKEN_REFRESHED fires for a user whose data is already loading or
        // loaded. Refetching there multiplies requests and helps trip the
        // Supabase rate limit, which ends in a failed refresh and a forced
        // sign-out. Loading is left alone so an in-flight fetch still owns it.
        if (loadedUserId.current === userId) {
          return;
        }

        loadedUserId.current = userId;
        // Keep loading until profile and roles are resolved, otherwise guards
        // see an authenticated user with an empty roles array and redirect.
        setLoading(true);
        // Supabase holds an internal lock for the duration of this callback,
        // so the queries have to run outside it.
        setTimeout(() => {
          fetchUserData(userId).finally(() => setLoading(false));
        }, 0);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserData = async (userId: string) => {
    try {
      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (profileData) {
        setProfile(profileData);
      }

      // Fetch roles
      const { data: rolesData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);

      if (rolesData) {
        setRoles(rolesData.map((r: UserRole) => r.role));
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        toast({
          title: "Lỗi đăng nhập",
          description: error.message,
          variant: "destructive",
        });
      }
      
      return { error };
    } catch (error: any) {
      toast({
        title: "Lỗi đăng nhập",
        description: "Đã xảy ra lỗi không mong muốn",
        variant: "destructive",
      });
      return { error };
    }
  };

  const signUp = async (email: string, password: string, displayName?: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            display_name: displayName || email,
          },
        },
      });

      if (error) {
        toast({
          title: "Lỗi đăng ký",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Đăng ký thành công",
          description: "Vui lòng kiểm tra email để xác thực tài khoản",
        });
      }

      return { error };
    } catch (error: any) {
      toast({
        title: "Lỗi đăng ký",
        description: "Đã xảy ra lỗi không mong muốn",
        variant: "destructive",
      });
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      setRoles([]);
      toast({
        title: "Đăng xuất thành công",
        description: "Hẹn gặp lại bạn!",
      });
    } catch (error: any) {
      toast({
        title: "Lỗi đăng xuất",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error("Chưa đăng nhập") };

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id);

      if (error) {
        toast({
          title: "Lỗi cập nhật",
          description: error.message,
          variant: "destructive",
        });
      } else {
        // Refresh profile data
        fetchUserData(user.id);
        toast({
          title: "Cập nhật thành công",
          description: "Thông tin đã được cập nhật",
        });
      }

      return { error };
    } catch (error: any) {
      toast({
        title: "Lỗi cập nhật",
        description: "Đã xảy ra lỗi không mong muốn",
        variant: "destructive",
      });
      return { error };
    }
  };

  const value = {
    user,
    profile,
    roles,
    isAdmin,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}