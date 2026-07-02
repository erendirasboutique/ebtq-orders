'use server';
import { redirect } from 'next/navigation';
import { randomUUID } from 'crypto';
import { requireAdmin } from '@/lib/supabaseServer';

function money(n){ return Math.round((Number(n||0)+Number.EPSILON)*100)/100; }

export async function createOrder(formData){
 const {supabase, allowed}=await requireAdmin(); if(!allowed) throw new Error('Not authorized');
 const name=String(formData.get('customerName')||'').trim();
 if(!name) throw new Error('Customer name is required');
 const email=String(formData.get('email')||'').trim()||null;
 const phone=String(formData.get('phone')||'').trim()||null;
 const facebook_psid=String(formData.get('facebookPsid')||'').trim()||null;
 const notes=String(formData.get('notes')||'').trim()||null;
 const status=String(formData.get('status')||'draft');
 const tracking_number=String(formData.get('trackingNumber')||'').trim()||null;
 const itemNames=formData.getAll('itemName').map(x=>String(x).trim());
 const itemPrices=formData.getAll('itemPrice').map(x=>money(x));
 const itemQtys=formData.getAll('itemQty').map(x=>Number(x||1));
 const items=itemNames.map((n,i)=>({name:n, price:itemPrices[i]||0, quantity:itemQtys[i]||1})).filter(i=>i.name);
 const manual=money(formData.get('manualTotal'));
 const total=manual>0?manual:money(items.reduce((s,i)=>s+(i.price*i.quantity),0));
 const private_token=randomUUID().replaceAll('-','');
 const {data:customer,error:cErr}=await supabase.from('customers').insert({name,email,phone,facebook_psid}).select().single();
 if(cErr) throw new Error(cErr.message);
 let photo_url=null;
 const file=formData.get('photo');
 if(file && file.size){
   const ext=(file.name?.split('.').pop()||'jpg').toLowerCase();
   const path=`orders/${private_token}.${ext}`;
   const {error:uErr}=await supabase.storage.from('order-photos').upload(path,file,{upsert:true,contentType:file.type||'image/jpeg'});
   if(uErr) throw new Error(uErr.message);
   const {data:pub}=supabase.storage.from('order-photos').getPublicUrl(path);
   photo_url=pub.publicUrl;
 }
 const {data:order,error:oErr}=await supabase.from('orders').insert({customer_id:customer.id,total,status,notes,tracking_number,photo_url,private_token}).select().single();
 if(oErr) throw new Error(oErr.message);
 if(items.length){ const rows=items.map(i=>({...i,order_id:order.id})); const {error:iErr}=await supabase.from('order_items').insert(rows); if(iErr) throw new Error(iErr.message); }
 redirect(`/order/${private_token}`);
}
