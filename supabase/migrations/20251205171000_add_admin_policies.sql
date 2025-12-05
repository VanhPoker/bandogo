-- Policy to allow admins to view all orders
CREATE POLICY "Admins can view all orders" ON public.orders
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

-- Policy to allow admins to view all order items
CREATE POLICY "Admins can view all order items" ON public.order_items
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

-- Policy to allow admins to update orders (e.g. change status)
CREATE POLICY "Admins can update all orders" ON public.orders
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);
