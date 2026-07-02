# Erendira's Boutique Order Concierge — Final Version

This is the final branded order portal version with:

- Erendira's Boutique logo included
- Bring Bold Nineties for headings
- MD Nichrome for body/buttons/forms
- Brand background `#FFF4EB`
- Accents `#6f9940` and `#9955bb`
- Small flower accents, no heavy gradients
- Google admin login through Supabase
- Customer magic links with no customer login
- Manual Messenger workflow: copy message + copy link + open Messenger
- No product item fields: only subtotal, shipping, discount, final total, photos, notes, address, customer info
- Future-ready tables for payments, tracking numbers, shipping labels, addresses, and message history
- Optional Stripe checkout route included

## 1. Supabase setup

Create a new Supabase project, then run:

`sql/schema.sql`

in **Supabase → SQL Editor**.

## 2. Supabase Auth

Enable Google:

**Authentication → Providers → Google**

Use the Supabase callback URL in Google Cloud:

`https://YOUR-SUPABASE-PROJECT.supabase.co/auth/v1/callback`

In Supabase URL Configuration:

Site URL:

`https://ebtq-orders.vercel.app`

Redirect URLs:

`https://ebtq-orders.vercel.app/auth/callback`

## 3. Vercel Environment Variables

Add these:

```txt
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
ADMIN_EMAILS=your_google_email@gmail.com
NEXT_PUBLIC_SITE_URL=https://ebtq-orders.vercel.app
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

Stripe keys can stay blank until you are ready for payment checkout.

## 4. Admin routes

- `/login`
- `/admin`
- `/admin/orders`
- `/admin/orders/new`
- `/admin/customers`
- `/admin/payments`
- `/admin/shipping`
- `/admin/messages`

## 5. Customer route

Customers use only their private link:

`/order/[token]`

No customer login is required.

## 6. Manual Messenger workflow

When an order is created, the portal generates a message like:

```txt
Hi Maria! 🌸

Thank you for shopping with Erendira's Boutique!

Your private order page is ready.

Total: $85.00

View your order here:
https://ebtq-orders.vercel.app/order/...

Thank you! 💜
```

Click **Copy Message**, open Messenger, and paste it into the customer's conversation.
