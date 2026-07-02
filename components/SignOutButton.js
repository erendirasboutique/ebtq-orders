'use client';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function SignOutButton(){
  const supabase = createClientComponentClient();
  async function signOut(){ await supabase.auth.signOut(); window.location.href='/login'; }
  return <button className="pill" onClick={signOut}>Sign out</button>;
}
