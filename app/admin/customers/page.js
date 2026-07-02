import { redirect } from 'next/navigation';
import BrandHeader from '@/components/BrandHeader';
import Flowers from '@/components/Flowers';
import { requireAdmin } from '@/lib/supabaseServer';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic='force-dynamic';
export default async function Customers(){
 const {allowed,user}=await requireAdmin(); if(!user)redirect('/login'); if(!allowed)redirect('/login?error=not_allowed');
 const supabase=getSupabaseAdmin();
 const {data:customersData}=await supabase.from('customers').select('*').order('created_at',{ascending:false}).limit(100);
 const customers=Array.isArray(customersData)?customersData:[];
 return <main className="page"><Flowers/><div className="shell"><BrandHeader/><section className="panel"><p className="eyebrow">Customer memory</p><h1 className="h1">Customers</h1><p className="copy">Saved names, Messenger/Facebook names, contact info, and addresses for faster order creation.</p><br/>{customers.length===0?<p className="copy">No customers yet. They will appear when you save orders.</p>:customers.map(c=><div className="card" style={{marginBottom:12}} key={c.id}><b>{c.customer_name||'Customer'}</b><p className="copy">Facebook: {c.facebook_name||'Unknown'} · Phone: {c.phone||'—'} · Email: {c.email||'—'}</p></div>)}</section></div></main>
}
