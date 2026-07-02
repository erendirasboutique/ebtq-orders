create extension if not exists pgcrypto;

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  customer_name text,
  facebook_name text,
  messenger_psid text unique,
  phone text,
  email text,
  last_message text,
  last_seen_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.customers(id) on delete set null,
  customer_name text,
  facebook_name text,
  messenger_psid text,
  item_name text,
  notes text,
  total numeric(10,2) default 0,
  status text default 'pending_payment',
  photo_url text,
  token text unique not null,
  magic_link text,
  stripe_payment_url text,
  tracking_url text,
  created_by text,
  last_messenger_sent_at timestamptz,
  created_at timestamptz default now()
);

alter table public.customers enable row level security;
alter table public.orders enable row level security;

create policy "admins read customers" on public.customers for select using (auth.role() = 'authenticated');
create policy "admins read orders" on public.orders for select using (auth.role() = 'authenticated');
create policy "public can view private token orders" on public.orders for select using (true);

insert into storage.buckets (id, name, public) values ('order-photos','order-photos',true)
on conflict (id) do nothing;

create policy "public read order photos" on storage.objects for select using (bucket_id='order-photos');
create policy "admins upload order photos" on storage.objects for insert with check (bucket_id='order-photos');
