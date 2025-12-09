-- Fix RLS Recursion on user_roles and profiles

-- 1. Create a helper function to securely check admin status without triggering RLS recursion
-- This function runs with "SECURITY DEFINER" privileges (bypassing RLS on the tables it queries)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Drop the problematic recursive policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all user_roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage user_roles" ON public.user_roles;
-- Also drop orders policies that might use the old recursive check
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can update all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can view all order items" ON public.order_items;

-- 3. Re-create policies using the safe is_admin() function

-- Profiles: Users can see their own, Admins can see all
CREATE POLICY "Users can view own profile" ON public.profiles
FOR SELECT USING (
  auth.uid() = user_id
);

CREATE POLICY "Admins can view all profiles" ON public.profiles
FOR SELECT USING (
  public.is_admin()
);

-- User Roles: Users can see their own role, Admins can see all
CREATE POLICY "Users can view own role" ON public.user_roles
FOR SELECT USING (
  auth.uid() = user_id
);

CREATE POLICY "Admins can view all user_roles" ON public.user_roles
FOR SELECT USING (
  public.is_admin()
);

CREATE POLICY "Admins can manage user_roles" ON public.user_roles
FOR ALL USING (
  public.is_admin()
);

-- Orders: Users can see own, Admins can see all
CREATE POLICY "Users can view own orders" ON public.orders
FOR SELECT USING (
  auth.uid() = user_id
);

CREATE POLICY "Admins can view all orders" ON public.orders
FOR SELECT USING (
  public.is_admin()
);

CREATE POLICY "Admins can update all orders" ON public.orders
FOR UPDATE USING (
  public.is_admin()
);

-- Order Items
CREATE POLICY "Users can view own order items" ON public.order_items
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.orders
    WHERE orders.id = order_items.order_id
    AND orders.user_id = auth.uid()
  )
);

CREATE POLICY "Admins can view all order items" ON public.order_items
FOR SELECT USING (
  public.is_admin()
);
