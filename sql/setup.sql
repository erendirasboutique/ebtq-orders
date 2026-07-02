-- Erendira's Boutique Order Portal Supabase setup
create extension if not exists "pgcrypto";

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  facebook_psid text,
  created_at timestamptz default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.customers(id) on delete cascade,
  total numeric(10,2) not null default 0,
  status text not null default 'draft' check (status in ('draft','pending_payment','invoice_sent','paid','ready_to_ship','shipped','cancelled')),
  photo_url text,
  notes text,
  tracking_number text,
  private_token text unique not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade,
  name text not null,
  price numeric(10,2) not null default 0,
  quantity int not null default 1,
  created_at timestamptz default now()
);

create or replace function public.set_updated_at()
returns trigger as $$ begin new.updated_at = now(); return new; end; $$ language plpgsql;
drop trigger if exists orders_updated_at on public.orders;
create trigger orders_updated_at before update on public.orders for each row execute function public.set_updated_at();

alter table public.customers enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Admin users are handled in the app through ADMIN_EMAILS. Authenticated users can manage records.
drop policy if exists "authenticated manage customers" on public.customers;
create policy "authenticated manage customers" on public.customers for all to authenticated using (true) with check (true);

drop policy if exists "authenticated manage orders" on public.orders;
create policy "authenticated manage orders" on public.orders for all to authenticated using (true) with check (true);

drop policy if exists "authenticated manage order items" on public.order_items;
create policy "authenticated manage order items" on public.order_items for all to authenticated using (true) with check (true);

-- Customers need to view private token links without login.
drop policy if exists "public can read order by token" on public.orders;
create policy "public can read order by token" on public.orders for select to anon using (private_token is not null);

drop policy if exists "public can read linked customer" on public.customers;
create policy "public can read linked customer" on public.customers for select to anon using (true);

drop policy if exists "public can read linked items" on public.order_items;
create policy "public can read linked items" on public.order_items for select to anon using (true);

insert into storage.buckets (id, name, public) values ('order-photos','order-photos',true) on conflict (id) do nothing;

drop policy if exists "authenticated upload order photos" on storage.objects;
create policy "authenticated upload order photos" on storage.objects for insert to authenticated with check (bucket_id='order-photos');

drop policy if exists "authenticated update order photos" on storage.objects;
create policy "authenticated update order photos" on storage.objects for update to authenticated using (bucket_id='order-photos') with check (bucket_id='order-photos');

drop policy if exists "public read order photos" on storage.objects;
create policy "public read order photos" on storage.objects for select to anon, authenticated using (bucket_id='order-photos');
