-- Create suppliers table
create table if not exists public.suppliers (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    contact_person text,
    phone text,
    email text,
    address text,
    tax_code text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create import_orders table
create table if not exists public.import_orders (
    id uuid default gen_random_uuid() primary key,
    supplier_id uuid references public.suppliers(id),
    total_amount numeric not null default 0,
    status text not null default 'pending', -- pending, completed, cancelled
    invoice_number text, -- External invoice number from supplier
    created_by uuid references auth.users(id),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create import_order_items table
create table if not exists public.import_order_items (
    id uuid default gen_random_uuid() primary key,
    import_order_id uuid references public.import_orders(id) on delete cascade,
    product_id uuid references public.products(id),
    quantity integer not null,
    import_price numeric not null, -- Cost price per unit at the time of import
    total_price numeric not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add cost_price to products
alter table public.products 
add column if not exists cost_price numeric default 0;

-- Add invoice fields to orders (Export/Sales)
alter table public.orders
add column if not exists customer_company text,
add column if not exists customer_tax_code text,
add column if not exists customer_address_invoice text,
add column if not exists invoice_requested boolean default false;

-- Add RLS policies (simple admin access for now, assuming existing patterns)
alter table public.suppliers enable row level security;
alter table public.import_orders enable row level security;
alter table public.import_order_items enable row level security;

-- Policy for suppliers: Public read? No, probably Admin only or Authenticated.
-- Let's check existing policies. For now allow authenticated to read/write for simplicity in this "Admin" context.
create policy "Enable all access for authenticated users" on public.suppliers
    for all using (auth.role() = 'authenticated');

create policy "Enable all access for authenticated users" on public.import_orders
    for all using (auth.role() = 'authenticated');

create policy "Enable all access for authenticated users" on public.import_order_items
    for all using (auth.role() = 'authenticated');
