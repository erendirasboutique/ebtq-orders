'use server';
import { redirect } from 'next/navigation';
import { randomBytes } from 'crypto';
import { requireAdmin } from '@/lib/supabaseServer';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

function money(v){return Math.round((Number(v||0)+Number.EPSILON)*100)/100}
function text(v){return String(v||'').trim()}

export async function createOrder(formData){
 const {allowed,user}=await requireAdmin();
 if(!user) redirect('/login');
 if(!allowed) redirect('/login?error=not_allowed');
 const supabase=getSupabaseAdmin();
 const customerName=text(formData.get('customer_name'));
 const facebookName=text(formData.get('facebook_name'));
 const phone=text(formData.get('phone'));
 const email=text(formData.get('email'));
 const address1=text(formData.get('address1'));
 const address2=text(formData.get('address2'));
 const city=text(formData.get('city'));
 const state=text(formData.get('state'));
 const postalCode=text(formData.get('postal_code'));
 const country=text(formData.get('country')) || 'United States';
 const subtotal=money(formData.get('subtotal'));
 const shipping=money(formData.get('shipping'));
 const discount=money(formData.get('discount'));
 const total=money(subtotal + shipping - discount);
 const notes=text(formData.get('notes'));
 const status=text(formData.get('status')) || 'pending_payment';
 const token=randomBytes(24).toString('hex');
 let photoUrl='';
 const file=formData.get('photo');
 if(file && typeof file === 'object' && file.size > 0){
   const ext=(file.name?.split('.').pop()||'jpg').toLowerCase();
   const path=`orders/${token}.${ext}`;
   const arrayBuffer=await file.arrayBuffer();
   const {error:uploadError}=await supabase.storage.from('order-photos').upload(path, Buffer.from(arrayBuffer), {contentType:file.type||'image/jpeg', upsert:true});
   if(!uploadError){const {data}=supabase.storage.from('order-photos').getPublicUrl(path); photoUrl=data.publicUrl;}
 }
 let customerId=null;
 if(customerName || facebookName || phone || email){
   const {data:existing}=await supabase.from('customers').select('id').or(`facebook_name.eq.${facebookName || '___none___'},phone.eq.${phone || '___none___'},email.eq.${email || '___none___'}`).limit(1).maybeSingle();
   if(existing?.id){customerId=existing.id; await supabase.from('customers').update({customer_name:customerName||null,facebook_name:facebookName||null,phone:phone||null,email:email||null,updated_at:new Date().toISOString()}).eq('id',customerId);}
   else {const {data:newCustomer}=await supabase.from('customers').insert({customer_name:customerName||null,facebook_name:facebookName||null,phone:phone||null,email:email||null}).select('id').single(); customerId=newCustomer?.id||null;}
 }
 let addressId=null;
 if(customerId && (address1 || city || state || postalCode)){
   const {data:addr}=await supabase.from('customer_addresses').insert({customer_id:customerId,full_name:customerName||null,address1,address2,city,state,postal_code:postalCode,country}).select('id').single();
   addressId=addr?.id||null;
 }
 const {data:order,error}=await supabase.from('orders').insert({customer_id:customerId,customer_address_id:addressId,customer_name:customerName||null,facebook_name:facebookName||null,token,subtotal,shipping,discount,total,status,payment_status:status==='paid'?'paid':'unpaid',photo_url:photoUrl||null,notes}).select('id,token').single();
 if(error) throw new Error(error.message);
 const site=process.env.NEXT_PUBLIC_SITE_URL || '';
 const link=`${site.replace(/\/$/,'')}/order/${order.token}`;
 const message=`Hi ${customerName || facebookName || 'there'}! 🌸\n\nThank you for shopping with Erendira's Boutique!\n\nYour private order page is ready.\n\nTotal: $${total.toFixed(2)}\n\nView your order here:\n${link}\n\nThank you! 💜`;
 await supabase.from('message_history').insert({order_id:order.id,customer_id:customerId,channel:'manual_messenger',message_body:message,magic_link:link,status:'created'});
 redirect(`/admin/orders/new?created=${order.id}`);
}
