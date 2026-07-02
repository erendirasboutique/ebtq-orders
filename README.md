# Erendira's Boutique Order Concierge — Manual Messenger Version

This is the fixed branded portal for creating private customer order pages and manually sending the link through Facebook Messenger.

## What is included

- Erendira's Boutique logo in the UI
- Bring Bold Nineties font for headings
- MD Nichrome font for body text, labels, buttons, and navigation
- Brand colors:
  - Background: `#FFF4EB`
  - Green accent/buttons: `#6f9940`
  - Purple accent/buttons: `#9955bb`
- Small flower accents
- No heavy gradients
- Google admin login through Supabase Auth
- Customer does not log in
- Private `/order/[token]` customer pages
- New order workflow
- Saved customer/Facebook name memory
- Copy Messenger Message button
- Copy Link button
- Open Messenger button
- No Messenger API required

## Setup

1. Create a new Supabase project.
2. Go to SQL Editor and run `supabase/schema.sql`.
3. Turn on Google Auth in Supabase.
4. Add these Vercel environment variables:

```txt
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_EMAILS=yourgoogleemail@gmail.com
NEXT_PUBLIC_SITE_URL=https://ebtq-orders.vercel.app
```

5. Supabase Auth URL Configuration:

Site URL:

```txt
https://ebtq-orders.vercel.app
```

Redirect URLs:

```txt
https://ebtq-orders.vercel.app/auth/callback
http://localhost:3000/auth/callback
```

## Manual Messenger workflow

1. Go to `/admin/orders/new`.
2. Enter customer name and Facebook/Messenger name.
3. Upload product photo and enter items.
4. Click **Save Order & Create Message**.
5. Copy the ready-made Messenger message.
6. Open Messenger and paste it to the customer.

## Important

This version intentionally does **not** use the Messenger API because Meta restricted the business account from claiming apps. Manual Messenger is more reliable right now.
