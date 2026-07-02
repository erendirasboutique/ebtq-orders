import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
export async function getSupabaseServer(){
 const cookieStore=await cookies();
 return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,{cookies:{getAll(){return cookieStore.getAll()},setAll(cookiesToSet){try{cookiesToSet.forEach(({name,value,options})=>cookieStore.set(name,value,options))}catch(e){}}}})
}
export async function requireAdmin(){
 const supabase=await getSupabaseServer();
 const {data:{user}}=await supabase.auth.getUser();
 const allowedEmails=(process.env.ADMIN_EMAILS||'').split(',').map(e=>e.trim().toLowerCase()).filter(Boolean);
 const allowed=!!user && allowedEmails.includes(String(user.email||'').toLowerCase());
 return {allowed,user,supabase};
}
