import { redirect } from 'next/navigation';
import Link from 'next/link';
import BrandHeader from '@/components/BrandHeader';
import SignOutButton from '@/components/SignOutButton';
import { requireAdmin } from '@/lib/supabaseServer';
export const dynamic='force-dynamic';
export default async function Admin(){
 const {supabase,allowed}=await requireAdmin(); if(!allowed) redirect('/login');
 const {data:orders=[]}=await supabase.from('orders').select('id,status,total,created_at,customer:customers(name),private_token').order('created_at',{ascending:false}).limit(6);
 const total=orders.reduce((s,o)=>s+Number(o.total||0),0);
 const pending=orders.filter(o=>['pending_payment','draft','invoice_sent'].includes(o.status)).length;
 return <main className="page"><span className="flower one"/><span className="flower two"/><div className="shell"><BrandHeader admin/><div className="actions" style={{justifyContent:'flex-end',marginTop:-8}}><SignOutButton/></div><section className="hero"><h2>Order Management Portal</h2><p>Manage customer totals, product photos, private links, payment status, and Messenger-ready order updates.</p><div className="actions"><Link className="btn primary" href="/admin/orders/new">Create New Order</Link><Link className="btn green" href="/admin/orders">View Orders</Link></div></section><section className="grid three" style={{marginTop:18}}><div className="stat"><b>{orders.length}</b><span>Recent orders</span></div><div className="stat"><b>{pending}</b><span>Need attention</span></div><div className="stat"><b>${total.toFixed(2)}</b><span>Recent total</span></div></section><section className="card" style={{marginTop:18}}><h3 className="sectionTitle">Latest Orders</h3><table className="table"><tbody>{orders.map(o=><tr key={o.id}><td><b>{o.customer?.name||'Customer'}</b></td><td><span className="badge">{o.status}</span></td><td>${Number(o.total||0).toFixed(2)}</td><td><Link className="pill" href={`/order/${o.private_token}`} target="_blank">Open</Link></td></tr>)}</tbody></table></section></div></main>
}
