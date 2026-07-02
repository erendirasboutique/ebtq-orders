-- Erendira's Boutique Order Concierge Final Schema
-- Run this in Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  customer_name text,
  facebook_name text,
  messenger_psid text,
  phone text,
  email text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists customer_addresses (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references customers(id) on delete cascade,
  full_name text,
  address1 text,
  address2 text,
  city text,
  state text,
  postal_code text,
  country text default 'United States',
  is_default boolean default false,
  created_at timestamptz default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references customers(id) on delete set null,
  customer_address_id uuid references customer_addresses(id) on delete set null,
  customer_name text,
  facebook_name text,
  token text unique not null,
  subtotal numeric default 0,
  shipping numeric default 0,
  discount numeric default 0,
  total numeric default 0,
  status text default 'pending_payment',
  payment_status text default 'unpaid',
  photo_url text,
  notes text,
  stripe_checkout_url text,
  stripe_session_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  amount numeric default 0,
  currency text default 'usd',
  status text default 'pending',
  provider text default 'stripe',
  stripe_session_id text,
  stripe_payment_intent text,
  created_at timestamptz default now()
);

create table if not exists tracking_numbers (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  carrier text,
  tracking_number text,
  tracking_url text,
  status text,
  last_update text,
  created_at timestamptz default now()
);

create table if not exists shipping_labels (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  provider text default 'shippo',
  label_id text,
  label_url text,
  rate_id text,
  carrier text,
  service text,
  cost numeric,
  status text default 'created',
  created_at timestamptz default now()
);

create table if not exists message_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete set null,
  customer_id uuid references customers(id) on delete set null,
  channel text default 'manual_messenger',
  message_body text,
  magic_link text,
  status text default 'created',
  created_at timestamptz default now()
);

-- Public storage bucket for order photos.
insert into storage.buckets (id, name, public)
values ('order-photos', 'order-photos', true)
on conflict (id) do update set public = true;

-- This project uses server-side service role for admin writes and reads.
-- Leave RLS disabled for the starter if you want the simplest setup.
-- For a stricter production setup, enable RLS and add policies later.
