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
 return <main className="page"><div className="shell"><BrandHeader admin/><div className="layout"><aside className="sidePanel"><div className="eyebrow">Order Studio</div><h2 className="sideTitle">Client concierge, not billing.</h2><p>Create a polished order ticket for every customer and send a private review link.</p><div className="sideNav"><Link href="/admin/orders/new">＋ New order ticket</Link><Link href="/admin/orders">Open order desk</Link><SignOutButton/></div></aside><section className="grid"><div className="heroOrder"><div className="eyebrow">Today&apos;s workflow</div><h2>Build, review, send.</h2><p>Upload the customer&apos;s item photo, add totals, then copy or send the private order link.</p><div className="actions"><Link className="btn primary" href="/admin/orders/new">Create Ticket</Link><Link className="btn green" href="/admin/orders">View Order Desk</Link></div></div><div className="grid three"><div className="stat"><b>{orders.length}</b><span>Recent tickets</span></div><div className="stat"><b>{pending}</b><span>Need attention</span></div><div className="stat"><b>${total.toFixed(2)}</b><span>Recent value</span></div></div><div className="card"><h3 className="sectionTitle">Latest Order Tickets</h3><div className="orderStrip">{orders.map(o=><div className="ticket" key={o.id}><div className="ticketTop"><div><b>{o.customer?.name||'Customer'}</b><div className="miniMeta">{new Date(o.created_at).toLocaleDateString()} • {o.status?.replaceAll('_',' ')}</div></div><div><b>${Number(o.total||0).toFixed(2)}</b></div></div><div className="actions"><Link className="pill" href={`/order/${o.private_token}`} target="_blank">Private Link</Link></div></div>)}</div></div></section></div></div></main>
}
