create extension if not exists pgcrypto;

create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  customer_name text,
  facebook_name text,
  phone text,
  email text,
  notes text,
  created_at timestamptz default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references customers(id) on delete set null,
  customer_name text,
  facebook_name text,
  product_title text,
  notes text,
  items jsonb default '[]'::jsonb,
  shipping numeric default 0,
  discount numeric default 0,
  total numeric default 0,
  status text default 'pending_payment',
  token text unique not null,
  photo_url text,
  tracking_number text,
  created_at timestamptz default now()
);

alter table customers enable row level security;
alter table orders enable row level security;

drop policy if exists "admins can read customers" on customers;
drop policy if exists "admins can write customers" on customers;
drop policy if exists "admins can read orders" on orders;
drop policy if exists "admins can write orders" on orders;
drop policy if exists "public can view token orders" on orders;

create policy "admins can read customers" on customers for select to authenticated using (true);
create policy "admins can write customers" on customers for all to authenticated using (true) with check (true);
create policy "admins can read orders" on orders for select to authenticated using (true);
create policy "admins can write orders" on orders for all to authenticated using (true) with check (true);
create policy "public can view token orders" on orders for select to anon using (token is not null);

insert into storage.buckets (id, name, public) values ('order-photos','order-photos',true)
on conflict (id) do update set public=true;

drop policy if exists "admins upload order photos" on storage.objects;
drop policy if exists "public view order photos" on storage.objects;
create policy "admins upload order photos" on storage.objects for all to authenticated using (bucket_id='order-photos') with check (bucket_id='order-photos');
create policy "public view order photos" on storage.objects for select to anon using (bucket_id='order-photos');
