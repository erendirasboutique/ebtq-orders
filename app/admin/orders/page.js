import { redirect } from 'next/navigation';
import Link from 'next/link';
import BrandHeader from '@/components/BrandHeader';
import { requireAdmin } from '@/lib/supabaseServer';
export const dynamic='force-dynamic';
function badgeClass(s){ if(s==='paid'||s==='ready_to_ship'||s==='shipped') return 'badge green'; if(s==='pending_payment'||s==='invoice_sent') return 'badge gold'; return 'badge'; }
export default async function Orders(){
 const {supabase,allowed}=await requireAdmin(); if(!allowed) redirect('/login');
 const {data:orders=[]}=await supabase.from('orders').select('id,status,total,created_at,private_token,tracking_number,customer:customers(name,facebook_psid,phone,email)').order('created_at',{ascending:false}).limit(80);
 return <main className="page"><div className="shell"><BrandHeader admin/><section className="card"><div className="topbar"><h2 className="sectionTitle">Orders</h2><Link className="btn primary" href="/admin/orders/new">New Order</Link></div><table className="table"><thead><tr><th>Customer</th><th>Status</th><th>Total</th><th className="hideMobile">Tracking</th><th>Actions</th></tr></thead><tbody>{orders.map(o=><tr key={o.id}><td><b>{o.customer?.name||'Customer'}</b><br/><small>{new Date(o.created_at).toLocaleDateString()}</small></td><td><span className={badgeClass(o.status)}>{o.status?.replaceAll('_',' ')}</span></td><td><b>${Number(o.total||0).toFixed(2)}</b></td><td className="hideMobile">{o.tracking_number||'—'}</td><td><div className="actions" style={{margin:0}}><Link className="pill" href={`/order/${o.private_token}`} target="_blank">View</Link><form action={`/api/send-messenger`} method="post"><input type="hidden" name="orderId" value={o.id}/><button className="pill">Messenger</button></form></div></td></tr>)}</tbody></table></section></div></main>
}
