import { NextResponse } from 'next/server';
import { getSupabaseRoute, adminEmails } from '@/lib/supabaseServer';

export async function GET(req) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');

  if (code) {
    const supabase = await getSupabaseRoute();
    await supabase.auth.exchangeCodeForSession(code);
    const { data: { user } } = await supabase.auth.getUser();
    const email = user?.email?.toLowerCase();

    if (email && adminEmails().includes(email)) {
      return NextResponse.redirect(new URL('/admin', url.origin));
    }

    await supabase.auth.signOut();
  }

  return NextResponse.redirect(new URL('/login?error=not-authorized', url.origin));
}
