# Erendira's Boutique — Premium Order Portal

A branded Next.js + Vercel + Supabase portal for creating customer orders, uploading product photos, sending private customer order links, and preparing Messenger/Stripe integrations.

## What is included

- Premium Erendira's Boutique styling: soft pink/cream/green palette, glass cards, floral accents, boutique dashboard UI.
- Google-only admin login through Supabase Auth.
- Admin dashboard with order stats, recent orders, and quick actions.
- Create order page with customer info, order items, photo upload, status, notes, and private token links.
- Orders page with search, status badges, private link copy button, and Messenger send button.
- Customer order page with no login required, photo, total, timeline, pay button, and tracking area.
- Supabase SQL setup for profiles, customers, orders, order_items, RLS policies, and storage bucket.
- API routes for Messenger and Stripe checkout starters.

## Setup

1. Upload this project to GitHub.
2. Deploy to Vercel.
3. Create a Supabase project.
4. In Supabase SQL Editor, run `sql/setup.sql`.
5. In Supabase Auth > Providers, enable Google.
6. Add your deployed URL to Supabase Auth redirect URLs:
   - `https://your-domain.vercel.app/auth/callback`
   - `http://localhost:3000/auth/callback`
7. Add environment variables in Vercel from `.env.example`.
8. Add your admin Gmail address to `ADMIN_EMAILS`.
9. Put your real logo as `public/logo.png` if you have one. The app already has a boutique placeholder logo.

## Build fix included

This version uses `@supabase/ssr` instead of the deprecated `@supabase/auth-helpers-nextjs`, so it works with current Next.js/Vercel builds.

## Important

Customers do not log in. They use the private `/order/[token]` link generated for each order.

Messenger sending requires Meta approval/page setup. Until then, the button will still create the order and show/copy the private link.

## Fonts

Do not upload paid font files publicly unless your license allows it. If you own the font files, place them in `public/fonts/` and update `app/globals.css` font-face names.
