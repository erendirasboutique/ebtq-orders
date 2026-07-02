import { cookies } from 'next/headers';
import { createRouteHandlerClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs';

export function getSupabaseServer(){ return createServerComponentClient({ cookies }); }
export function getSupabaseRoute(){ return createRouteHandlerClient({ cookies }); }
export function adminEmails(){ return (process.env.ADMIN_EMAILS || '').split(',').map(e=>e.trim().toLowerCase()).filter(Boolean); }
export async function requireAdmin(){
  const supabase = getSupabaseServer();
  const { data:{ session } } = await supabase.auth.getSession();
  const email = session?.user?.email?.toLowerCase();
  if(!email || !adminEmails().includes(email)) return { supabase, session:null, email:null, allowed:false };
  return { supabase, session, email, allowed:true };
}
