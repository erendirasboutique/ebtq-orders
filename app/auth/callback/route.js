import { NextResponse } from 'next/server';
import { getSupabaseRoute, adminEmails } from '@/lib/supabaseServer';
export async function GET(req){
 const url=new URL(req.url); const code=url.searchParams.get('code');
 if(code){ const supabase=getSupabaseRoute(); await supabase.auth.exchangeCodeForSession(code); const {data:{session}}=await supabase.auth.getSession(); const email=session?.user?.email?.toLowerCase(); if(email && adminEmails().includes(email)) return NextResponse.redirect(new URL('/admin', url.origin)); }
 return NextResponse.redirect(new URL('/login?error=not-authorized', url.origin));
}
