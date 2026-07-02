'use client';

import { getSupabaseBrowser } from '@/lib/supabaseClient';

export default function SignOutButton() {
  const supabase = getSupabaseBrowser();

  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = '/login';
  }

  return <button className="pill" onClick={signOut}>Sign out</button>;
}
