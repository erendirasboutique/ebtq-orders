'use server';
import { redirect } from 'next/navigation';import { randomUUID } from 'crypto';import { requireAdmin } from '@/lib/supabaseServer';
function money(n){return Math.round((Number(n||0)+Number.EPSILON)*100)/100}
function slug(){return randomUUID().replaceAll('-','')}
export async function createOrder(formData){
 const {allowed,user,supabase}=await requireAdmin();if(!user)redirect('/login');if(!allowed)redirect('/login?error=not_allowed');
 const customer_name=String(formData.get('customer_name')||'').trim();
 const facebook_name=String(formData.get('facebook_name')||'').trim();
 const product_title=String(formData.get('product_title')||'').trim();
 const notes=String(formData.get('notes')||'').trim();
 const item1=String(formData.get('item1')||'').trim();const item1_price=money(formData.get('item1_price'));
 const item2=String(formData.get('item2')||'').trim();const item2_price=money(formData.get('item2_price'));
 const shipping=money(formData.get('shipping'));const discount=money(formData.get('discount'));
 const total=money(item1_price+item2_price+shipping-discount);
 const token=slug();let photo_url='';
 const photo=formData.get('photo');
 if(photo && typeof photo==='object' && photo.size>0){
   const ext=(photo.name?.split('.').pop()||'jpg').toLowerCase();const path=`orders/${token}.${ext}`;
   const {error:uploadError}=await supabase.storage.from('order-photos').upload(path,photo,{upsert:true,contentType:photo.type||'image/jpeg'});
   if(!uploadError){const {data}=supabase.storage.from('order-photos').getPublicUrl(path);photo_url=data?.publicUrl||''}
 }
 let customer_id=null;
 if(customer_name || facebook_name){
   const {data:existing}=await supabase.from('customers').select('*').or(`customer_name.eq.${customer_name||'__none__'},facebook_name.eq.${facebook_name||'__none__'}`).limit(1).maybeSingle();
   if(existing?.id){customer_id=existing.id;await supabase.from('customers').update({customer_name:customer_name||existing.customer_name,facebook_name:facebook_name||existing.facebook_name}).eq('id',existing.id)}
   else{const {data:newCustomer}=await supabase.from('customers').insert({customer_name,facebook_name}).select('id').single();customer_id=newCustomer?.id||null}
 }
 const items=[item1?{name:item1,price:item1_price,quantity:1}:null,item2?{name:item2,price:item2_price,quantity:1}:null].filter(Boolean);
 const {error}=await supabase.from('orders').insert({customer_id,customer_name,facebook_name,product_title,notes,items,shipping,discount,total,status:'pending_payment',token,photo_url});
 if(error)redirect('/admin/orders/new?error=save_failed');
 redirect(`/admin/orders/created?token=${token}`);
}
