import Link from 'next/link';
import { redirect } from 'next/navigation';
import BrandHeader from '@/components/BrandHeader';
import Flowers from '@/components/Flowers';
import { requireAdmin } from '@/lib/supabaseServer';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic='force-dynamic';
export default async function Orders(){
 const {allowed,user}=await requireAdmin(); if(!user)redirect('/login'); if(!allowed)redirect('/login?error=not_allowed');
 const supabase=getSupabaseAdmin();
 const {data:ordersData}=await supabase.from('orders').select('*').order('created_at',{ascending:false}).limit(100);
 const orders=Array.isArray(ordersData)?ordersData:[];
 return <main className="page"><Flowers/><div className="shell"><BrandHeader/><section className="panel"><div style={{display:'flex',justifyContent:'space-between',gap:16,alignItems:'center',flexWrap:'wrap'}}><div><p className="eyebrow">Order list</p><h1 className="h1">Orders</h1></div><Link className="btn primary" href="/admin/orders/new">+ New Order</Link></div><br/>{orders.length===0?<p className="copy">No orders yet.</p>:orders.map(o=><article className="ticket" key={o.id}><div className="thumb">{o.photo_url?<img src={o.photo_url} alt=""/>:'Photo'}</div><div><b>{o.customer_name||o.facebook_name||'Customer'}</b><p className="copy">Magic link: /order/{o.token||'missing-token'}</p><span className={o.status==='paid'||o.status==='shipped'||o.status==='delivered'?'badge green':'badge'}>{o.status||'draft'}</span></div><div><div className="total">${Number(o.total??0).toFixed(2)}</div>{o.token?<a className="btn purple" href={`/order/${o.token}`} target="_blank">View</a>:<span className="badge">No link</span>}</div></article>)}</section></div></main>
}
