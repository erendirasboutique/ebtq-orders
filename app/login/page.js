'use client';
import BrandHeader from '@/components/BrandHeader';
import { getSupabaseBrowser } from '@/lib/supabaseClient';
export default function Login(){
 const supabase=getSupabaseBrowser();
 async function login(){ await supabase.auth.signInWithOAuth({provider:'google',options:{redirectTo:`${location.origin}/auth/callback`}}); }
 return <main className="page"><span className="flower one"/><div className="shell"><BrandHeader/><div className="grid two"><section className="hero"><h2>Admin access</h2><p>Sign in with the approved Google account to manage Erendira&apos;s Boutique orders.</p><button onClick={login} className="btn primary">Continue with Google</button></section><section className="card"><h3 className="sectionTitle">Protected portal</h3><p>Only emails listed in <b>ADMIN_EMAILS</b> can enter the dashboard.</p><div className="notice">Customers do not need to log in. They use private order links.</div></section></div></div></main>
}
