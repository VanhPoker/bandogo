-- Policy to allow admins to view all profiles
CREATE POLICY "Admins can view all profiles" ON public.profiles
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

-- Policy to allow admins to view all user_roles
CREATE POLICY "Admins can view all user_roles" ON public.user_roles
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

-- Policy to allow admins to insert/update/delete user_roles
CREATE POLICY "Admins can manage user_roles" ON public.user_roles
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);
