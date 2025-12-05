-- Fix missing payment_method column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'payment_method') THEN
        ALTER TABLE public.orders ADD COLUMN payment_method TEXT DEFAULT 'cod';
    END IF;
END $$;

-- Ensure it is not null (optional, if you want to enforce it later)
-- ALTER TABLE public.orders ALTER COLUMN payment_method SET NOT NULL;
