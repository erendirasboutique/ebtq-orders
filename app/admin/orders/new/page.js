import { redirect } from 'next/navigation';
import BrandHeader from '@/components/BrandHeader';
import Flowers from '@/components/Flowers';
import CopyMessageBox from '@/components/CopyMessageBox';
import { requireAdmin } from '@/lib/supabaseServer';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { createOrder } from './actions';

export const dynamic='force-dynamic';
export default async function NewOrder({searchParams}){
 const {allowed,user}=await requireAdmin(); if(!user)redirect('/login'); if(!allowed)redirect('/login?error=not_allowed');
 const supabase=getSupabaseAdmin();
 const sp=await searchParams;
 const createdId=sp?.created;
 let created=null, message=null;
 if(createdId){
   const {data:o}=await supabase.from('orders').select('*').eq('id',createdId).maybeSingle();
   created=o;
   const {data:m}=await supabase.from('message_history').select('*').eq('order_id',createdId).order('created_at',{ascending:false}).limit(1).maybeSingle();
   message=m;
 }
 const {data:customersData}=await supabase.from('customers').select('customer_name,facebook_name,phone,email').order('created_at',{ascending:false}).limit(50);
 const customers=Array.isArray(customersData)?customersData:[];
 const link=created?.token?`${(process.env.NEXT_PUBLIC_SITE_URL||'').replace(/\/$/,'')}/order/${created.token}`:'';
 return <main className="page"><Flowers/><div className="shell"><BrandHeader/>{created && message ? <><CopyMessageBox message={message.message_body} link={link}/><br/><a className="btn primary" href="/admin/orders/new">Create Another Order</a></> : <section className="panel"><p className="eyebrow">New order</p><h1 className="h1">Create Order</h1><p className="copy">No item list. Just customer details, final subtotal, shipping, discount, notes, and photos.</p><br/><form className="form" action={createOrder}><div className="grid2"><div className="field"><label>Customer Name</label><input className="input" name="customer_name" placeholder="Maria Lopez" list="saved-customers" required/></div><div className="field"><label>Facebook / Messenger Name</label><input className="input" name="facebook_name" placeholder="@maria.lopez"/></div></div><datalist id="saved-customers">{customers.map((c,i)=><option key={i} value={c.customer_name||c.facebook_name||''}/>)}</datalist><div className="grid2"><div className="field"><label>Phone</label><input className="input" name="phone"/></div><div className="field"><label>Email</label><input className="input" name="email" type="email"/></div></div><div className="grid2"><div className="field"><label>Address Line 1</label><input className="input" name="address1"/></div><div className="field"><label>Address Line 2</label><input className="input" name="address2"/></div></div><div className="grid2"><div className="field"><label>City</label><input className="input" name="city"/></div><div className="field"><label>State</label><input className="input" name="state"/></div></div><div className="grid2"><div className="field"><label>ZIP / Postal Code</label><input className="input" name="postal_code"/></div><div className="field"><label>Country</label><input className="input" name="country" defaultValue="United States"/></div></div><div className="grid"><div className="field"><label>Final Subtotal</label><input className="input" name="subtotal" type="number" step="0.01" min="0" placeholder="85.00" required/></div><div className="field"><label>Shipping</label><input className="input" name="shipping" type="number" step="0.01" min="0" defaultValue="0"/></div><div className="field"><label>Discount</label><input className="input" name="discount" type="number" step="0.01" min="0" defaultValue="0"/></div></div><div className="grid2"><div className="field"><label>Status</label><select className="select" name="status" defaultValue="pending_payment"><option value="pending_payment">Pending Payment</option><option value="paid">Paid</option><option value="preparing">Preparing</option><option value="ready_to_ship">Ready to Ship</option><option value="shipped">Shipped</option><option value="delivered">Delivered</option></select></div><div className="field"><label>Order Photo</label><input className="input" name="photo" type="file" accept="image/*"/></div></div><div className="field"><label>Notes</label><textarea className="textarea" name="notes" placeholder="Size, pickup/shipping details, customer requests, payment notes..."/></div><button className="btn primary" type="submit">Save Order + Create Messenger Message</button></form></section>}</div></main>
}
