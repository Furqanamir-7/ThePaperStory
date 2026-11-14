-- ===================================================
-- The Paper Story - Supabase Database Schema
-- Run this in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/cldmkkbrovisonhgugvl/sql
-- ===================================================

-- 1. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    city TEXT,
    delivery_address TEXT,
    notes TEXT,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    subtotal NUMERIC,
    shipping_fee NUMERIC DEFAULT 0,
    total_amount NUMERIC NOT NULL,
    payment_method TEXT DEFAULT 'cod',
    payment_status TEXT DEFAULT 'pending',
    order_status TEXT DEFAULT 'new',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Inquiries Table (for bespoke wedding cards, favours, wax seals, etc.)
CREATE TABLE IF NOT EXISTS public.inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inquiry_number TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    product_category TEXT,
    product_name TEXT,
    event_date TEXT,
    quantity TEXT,
    details TEXT,
    inquiry_status TEXT DEFAULT 'new',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Live Store Catalog Table (for multi-device sync of products, prices, descriptions, specifications)
CREATE TABLE IF NOT EXISTS public.store_catalog (
    id TEXT PRIMARY KEY,
    data JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by TEXT DEFAULT 'admin'
);

ALTER TABLE public.store_catalog ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read on store_catalog" ON public.store_catalog;
CREATE POLICY "Allow public read on store_catalog" ON public.store_catalog FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public upsert on store_catalog" ON public.store_catalog;
CREATE POLICY "Allow public upsert on store_catalog" ON public.store_catalog FOR ALL USING (true) WITH CHECK (true);
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    subscribed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow public insert (front-end anon checkout & inquiries)
DROP POLICY IF EXISTS "Allow public insert to orders" ON public.orders;
CREATE POLICY "Allow public insert to orders" ON public.orders FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public insert to inquiries" ON public.inquiries;
CREATE POLICY "Allow public insert to inquiries" ON public.inquiries FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public insert to newsletter" ON public.newsletter_subscribers;
CREATE POLICY "Allow public insert to newsletter" ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);

-- Allow service_role full access
DROP POLICY IF EXISTS "Allow service_role all on orders" ON public.orders;
CREATE POLICY "Allow service_role all on orders" ON public.orders FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow service_role all on inquiries" ON public.inquiries;
CREATE POLICY "Allow service_role all on inquiries" ON public.inquiries FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow service_role all on newsletter" ON public.newsletter_subscribers;
CREATE POLICY "Allow service_role all on newsletter" ON public.newsletter_subscribers FOR ALL USING (true);
