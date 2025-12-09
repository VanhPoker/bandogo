-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.categories (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT categories_pkey PRIMARY KEY (id)
);
CREATE TABLE public.contracts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  contract_number text NOT NULL UNIQUE,
  client_name text NOT NULL,
  client_info jsonb NOT NULL,
  contract_type USER-DEFINED NOT NULL,
  contract_value numeric NOT NULL,
  status USER-DEFINED NOT NULL DEFAULT 'draft'::contract_status,
  products jsonb NOT NULL DEFAULT '[]'::jsonb,
  terms jsonb,
  signed_date date,
  delivery_date date,
  port_of_origin text,
  port_of_destination text,
  incoterms text,
  payment_terms text,
  documents jsonb DEFAULT '[]'::jsonb,
  created_by uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT contracts_pkey PRIMARY KEY (id)
);
CREATE TABLE public.orders (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  order_number text NOT NULL UNIQUE,
  total_amount numeric NOT NULL DEFAULT 0,
  status USER-DEFINED NOT NULL DEFAULT 'pending'::order_status,
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  shipping_info jsonb,
  billing_info jsonb,
  notes text,
  order_date timestamp with time zone NOT NULL DEFAULT now(),
  confirmed_at timestamp with time zone,
  shipped_at timestamp with time zone,
  delivered_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT orders_pkey PRIMARY KEY (id)
);
CREATE TABLE public.products (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric NOT NULL,
  images ARRAY,
  category text NOT NULL DEFAULT 'other'::text,
  specifications jsonb,
  stock_quantity integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT products_pkey PRIMARY KEY (id)
);
CREATE TABLE public.profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  display_name text,
  avatar_url text,
  phone text,
  address text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.quotes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  quote_number text NOT NULL UNIQUE,
  customer_info jsonb NOT NULL,
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  status USER-DEFINED NOT NULL DEFAULT 'draft'::quote_status,
  total_estimate numeric NOT NULL DEFAULT 0,
  valid_until date,
  notes text,
  terms text,
  created_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT quotes_pkey PRIMARY KEY (id)
);
CREATE TABLE public.shipments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  order_id uuid,
  contract_id uuid,
  tracking_number text NOT NULL UNIQUE,
  shipping_method text NOT NULL,
  carrier text,
  status USER-DEFINED NOT NULL DEFAULT 'pending'::shipping_status,
  origin_address jsonb,
  destination_address jsonb,
  estimated_pickup date,
  actual_pickup date,
  estimated_delivery date,
  actual_delivery date,
  shipping_cost numeric,
  weight numeric,
  dimensions jsonb,
  updates jsonb DEFAULT '[]'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT shipments_pkey PRIMARY KEY (id),
  CONSTRAINT shipments_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id),
  CONSTRAINT shipments_contract_id_fkey FOREIGN KEY (contract_id) REFERENCES public.contracts(id)
);
CREATE TABLE public.user_roles (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role USER-DEFINED NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT user_roles_pkey PRIMARY KEY (id),
  CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);