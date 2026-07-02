import { NextResponse } from 'next/server';import { getSupabaseServer } from '@/lib/supabaseServer';
export async function POST(request){const supabase=await getSupabaseServer();await supabase.auth.signOut();return NextResponse.redirect(new URL('/login',request.url),303)}
