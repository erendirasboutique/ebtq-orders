import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req){
 const form=await req.formData().catch(()=>null);
 const json=!form?await req.json().catch(()=>({})):{};
 const orderId=form?.get('orderId') || json.orderId;
 if(!orderId) return NextResponse.json({error:'Missing orderId'}, {status:400});
 const supabase=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
 const {data:order,error}=await supabase.from('orders').select('*, customer:customers(*)').eq('id', orderId).single();
 if(error || !order) return NextResponse.json({error:'Order not found'}, {status:404});
 const link=`${process.env.NEXT_PUBLIC_SITE_URL}/order/${order.private_token}`;
 const psid=order.customer?.facebook_psid;
 if(!process.env.META_PAGE_ACCESS_TOKEN || !psid){
   return NextResponse.json({ok:false, link, message:'Messenger is not connected yet. Copy/send this private link manually.'});
 }
 const version=process.env.META_GRAPH_VERSION || 'v20.0';
 const text=`Hi ${order.customer?.name || ''}! Your Erendira's Boutique order total is $${Number(order.total||0).toFixed(2)}. View it here: ${link}`;
 const payload={recipient:{id:psid}, message:{attachment:{type:'template',payload:{template_type:'button',text,buttons:[{type:'web_url',url:link,title:'View Order'}]}}}};
 const r=await fetch(`https://graph.facebook.com/${version}/me/messages?access_token=${process.env.META_PAGE_ACCESS_TOKEN}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
 const data=await r.json();
 return NextResponse.json({ok:r.ok, link, meta:data});
}
