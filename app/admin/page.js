import Link from 'next/link';
import { redirect } from 'next/navigation';
import BrandHeader from '@/components/BrandHeader';
import Flowers from '@/components/Flowers';
import { requireAdmin } from '@/lib/supabaseServer';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic='force-dynamic';
export default async function Admin(){
 const {allowed,user}=await requireAdmin(); if(!user)redirect('/login'); if(!allowed)redirect('/login?error=not_allowed');
 const supabase=getSupabaseAdmin();
 const {data:ordersData}=await supabase.from('orders').select('id,customer_name,facebook_name,total,shipping,status,created_at,token,photo_url,payment_status').order('created_at',{ascending:false}).limit(6);
 const orders=Array.isArray(ordersData)?ordersData:[];
 const {count:attention}=await supabase.from('orders').select('*',{count:'exact',head:true}).in('status',['draft','pending_payment','preparing']);
 const {count:customers}=await supabase.from('customers').select('*',{count:'exact',head:true});
 return <main className="page"><Flowers/><div className="shell"><BrandHeader/><section className="hero"><div className="panel"><p className="eyebrow">Welcome back</p><h1 className="h1">Order Concierge</h1><p className="copy">Create a private order page, copy the ready-made Messenger note, and paste it directly to your customer.</p><div className="topActions"><Link className="btn primary" href="/admin/orders/new">Create New Order</Link><Link className="btn light" href="/admin/orders">View Orders</Link></div></div><div className="card soft"><p className="eyebrow">Today’s workspace</p><div className="grid"><div className="stat"><b>{orders.length}</b><p>Recent</p></div><div className="stat"><b>{attention??0}</b><p>Attention</p></div><div className="stat"><b>{customers??0}</b><p>Customers</p></div></div></div></section><br/><section className="card"><h2 className="h2">Recent Orders</h2>{orders.length===0?<p className="copy">No orders yet.</p>:orders.map(o=><article className="ticket" key={o.id}><div className="thumb">{o.photo_url?<img src={o.photo_url} alt=""/>:'Photo'}</div><div><b>{o.customer_name||o.facebook_name||'Customer'}</b><p className="copy">Total ${Number(o.total??0).toFixed(2)} · Shipping ${Number(o.shipping??0).toFixed(2)}</p><span className={o.status==='paid'||o.status==='shipped'||o.status==='delivered'?'badge green':'badge'}>{o.status||'draft'}</span></div><div><a className="btn purple" href={`/order/${o.token}`} target="_blank">Open</a></div></article>)}</section></div></main>
}
