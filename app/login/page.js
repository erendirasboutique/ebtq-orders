'use client';
import Flowers from '@/components/Flowers';
import { getSupabaseBrowser } from '@/lib/supabaseBrowser';
export default function Login(){const supabase=getSupabaseBrowser();async function login(){const origin=window.location.origin;await supabase.auth.signInWithOAuth({provider:'google',options:{redirectTo:`${origin}/auth/callback?next=/admin`}})}return <main className="page"><Flowers/><div className="loginbox"><section className="panel"><img src="/logo.png" alt="Erendira's Boutique"/><p className="eyebrow">Admin only</p><h1 className="h1">Order Concierge</h1><p className="copy">Sign in with your approved Google admin email.</p><button className="btn primary full" onClick={login}>Continue with Google</button></section></div></main>}
