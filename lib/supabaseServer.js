import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
export async function getSupabaseServer(){
 const cookieStore=await cookies();
 return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,{cookies:{getAll(){return cookieStore.getAll()},setAll(list){try{list.forEach(({name,value,options})=>cookieStore.set(name,value,options))}catch(e){}}}});
}
export async function requireAdmin(){
 const supabase=await getSupabaseServer();
 const {data:{user}}=await supabase.auth.getUser();
 if(!user)return {allowed:false,user:null,supabase};
 const allowedEmails=(process.env.ADMIN_EMAILS||'').split(',').map(e=>e.trim().toLowerCase()).filter(Boolean);
 const allowed=allowedEmails.includes((user.email||'').toLowerCase());
 return {allowed,user,supabase};
}
