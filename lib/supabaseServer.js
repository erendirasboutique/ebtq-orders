import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export function adminEmails() {
  return (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

async function cookieStore() {
  return await cookies();
}

export async function getSupabaseServer() {
  const store = await cookieStore();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return store.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              store.set(name, value, options);
            });
          } catch {
            // Server Components cannot always set cookies. Route handlers can.
          }
        },
      },
    }
  );
}

export async function getSupabaseRoute() {
  return getSupabaseServer();
}

export async function requireAdmin() {
  const supabase = await getSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  const email = user?.email?.toLowerCase();

  if (!email || !adminEmails().includes(email)) {
    return { supabase, user: null, email: null, allowed: false };
  }

  return { supabase, user, email, allowed: true };
}
