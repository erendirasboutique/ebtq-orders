'use client';
import BrandHeader from '@/components/BrandHeader';
import { getSupabaseBrowser } from '@/lib/supabaseClient';
export default function Login(){
 const supabase=getSupabaseBrowser();
 async function login(){ await supabase.auth.signInWithOAuth({provider:'google',options:{redirectTo:`${location.origin}/auth/callback`}}); }
 return <main className="page"><div className="shell"><BrandHeader/><div className="grid two"><section className="heroOrder"><div className="eyebrow">Admin only</div><h2>Enter the Order Studio.</h2><p>This is separate from billing. It is for customer order tickets, private links, product photos, and Messenger-ready updates.</p><button onClick={login} className="btn primary">Continue with Google</button></section><section className="card"><h3 className="sectionTitle">No customer login</h3><p>Customers open their unique private link only. Admin access is limited to emails inside <b>ADMIN_EMAILS</b>.</p><div className="notice">Use your approved Google account to continue.</div></section></div></div></main>
}
