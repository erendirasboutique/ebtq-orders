import { notFound } from 'next/navigation';
import Flowers from '@/components/Flowers';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic='force-dynamic';
function prettyStatus(s){return ({draft:'Order created',pending_payment:'Payment pending',paid:'Paid',preparing:'Preparing order',ready_to_ship:'Ready to ship',shipped:'Shipped',delivered:'Delivered'})[s] || 'Order created'}
export default async function CustomerOrder({params}){
 const {token}=await params;
 const supabase=getSupabaseAdmin();
 const {data:order}=await supabase.from('orders').select('*, customer_addresses(*)').eq('token',token).maybeSingle();
 if(!order) notFound();
 const {data:trackingData}=await supabase.from('tracking_numbers').select('*').eq('order_id',order.id).order('created_at',{ascending:false});
 const tracking=Array.isArray(trackingData)?trackingData:[];
 const statuses=['pending_payment','paid','preparing','ready_to_ship','shipped','delivered'];
 const index=Math.max(0,statuses.indexOf(order.status));
 return <main className="page"><Flowers/><div className="shell"><section className="panel customerHero"><img className="logo" src="/logo.png" alt="Erendira's Boutique"/><p className="eyebrow">Private Order Page</p><h1 className="h1">Hello {order.customer_name||order.facebook_name||'beautiful'} 🌸</h1><p className="copy">Thank you for shopping with Erendira's Boutique. You can check your order here anytime.</p></section><br/><section className="grid2"><div className="card">{order.photo_url?<div className="orderPhoto"><img src={order.photo_url} alt="Order photo"/></div>:<div className="orderPhoto" style={{padding:60,textAlign:'center'}}>Order photo coming soon</div>}</div><div className="card"><p className="eyebrow">Order Total</p><div className="total">${Number(order.total??0).toFixed(2)}</div><p className="copy">Subtotal: ${Number(order.subtotal??0).toFixed(2)}<br/>Shipping: ${Number(order.shipping??0).toFixed(2)}<br/>Discount: ${Number(order.discount??0).toFixed(2)}</p><span className={order.status==='paid'||order.status==='shipped'||order.status==='delivered'?'badge green':'badge'}>{prettyStatus(order.status)}</span>{order.stripe_checkout_url&&order.payment_status!=='paid'?<><br/><br/><a className="btn primary" href={order.stripe_checkout_url}>Pay Order</a></>:null}{order.notes?<><br/><br/><p className="eyebrow">Notes</p><p className="copy">{order.notes}</p></>:null}</div></section><br/><section className="card"><h2 className="h2">Order Progress</h2><div className="timeline">{statuses.map((s,i)=><div className={i<=index?'step active':'step'} key={s}><span className="dot"></span><p className="copy">{prettyStatus(s)}</p></div>)}</div></section><br/><section className="card"><h2 className="h2">Tracking</h2>{tracking.length===0?<p className="copy">Tracking will appear here once your order ships.</p>:tracking.map(t=><p className="copy" key={t.id}>{t.carrier||'Carrier'}: {t.tracking_number} {t.tracking_url?<a className="btn light" href={t.tracking_url} target="_blank">Track</a>:null}</p>)}</section></div></main>
}
