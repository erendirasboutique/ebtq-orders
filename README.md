# Erendira's Boutique Order Concierge

This is the fully rebranded order portal version with:

- Uploaded Erendira's Boutique logo included in `/public/eb-logo.png`
- Bring Bold Nineties headings from `/public/fonts/bringbold_nineties_regular.otf`
- MD Nichrome body/buttons from `/public/fonts/MDNichrome-Bold.otf`
- Brand colors: `#FFF4EB`, `#6f9940`, `#9955bb`
- Small flower accents, no heavy gradients, no billing-portal style layout
- Google admin login through Supabase Auth
- Customer pages with private magic links, no customer login
- Facebook/Messenger name field on orders
- Messenger PSID support for sending the magic link to Messenger
- Messenger webhook route to capture customer PSIDs when they message your Page
- Stripe Checkout starter route

## Important Messenger reality

Meta does **not** let you message someone by only typing their Facebook name. The Messenger API requires a Page-scoped ID, called a PSID. This portal saves the customer's Facebook/Messenger display name for your search, but to send the magic link automatically, the customer must have messaged your Facebook Page first so the webhook can save their PSID.

Flow:

1. Customer messages your Facebook Page.
2. `/api/messenger/webhook` receives their PSID and saves it to Supabase.
3. You create an order with their Facebook/Messenger name and PSID if known.
4. The app creates a private `/order/[token]` link.
5. If PSID exists, `/api/messenger/send-order` sends the magic link to Messenger.

## Setup

1. Create a new Supabase project.
2. Run `supabase/schema.sql` in the Supabase SQL Editor.
3. Enable Google provider in Supabase Auth.
4. Add your Vercel URL to Supabase Auth redirect URLs:
   - `https://YOUR-SITE.vercel.app/auth/callback`
5. Add environment variables in Vercel:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_EMAILS=you@gmail.com
NEXT_PUBLIC_SITE_URL=https://your-vercel-url.vercel.app
META_PAGE_ACCESS_TOKEN=
META_VERIFY_TOKEN=erendiras_verify_token
META_PAGE_ID=
STRIPE_SECRET_KEY=
STRIPE_SUCCESS_URL=
STRIPE_CANCEL_URL=
```

## Meta Messenger webhook

Webhook callback URL:

```txt
https://YOUR-SITE.vercel.app/api/messenger/webhook
```

Verify token must match `META_VERIFY_TOKEN`.

Subscribe to Page messaging events.

## Pages

- `/` public landing page
- `/login` admin login
- `/admin` dashboard
- `/admin/orders` orders list
- `/admin/orders/new` create order
- `/admin/customers` Messenger customers
- `/order/[token]` customer magic link
