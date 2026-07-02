import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(req){
 try{
  if(!process.env.STRIPE_SECRET_KEY) return NextResponse.json({error:'Missing STRIPE_SECRET_KEY'},{status:500});
  const {orderId}=await req.json();
  const supabase=getSupabaseAdmin();
  const {data:order,error}=await supabase.from('orders').select('*').eq('id',orderId).maybeSingle();
  if(error||!order) return NextResponse.json({error:'Order not found'},{status:404});
  const stripe=new Stripe(process.env.STRIPE_SECRET_KEY);
  const site=(process.env.NEXT_PUBLIC_SITE_URL||'').replace(/\/$/,'');
  const session=await stripe.checkout.sessions.create({
   mode:'payment',
   line_items:[{price_data:{currency:'usd',product_data:{name:`Erendira's Boutique Order`,description:order.customer_name||order.facebook_name||'Customer order'},unit_amount:Math.round(Number(order.total||0)*100)},quantity:1}],
   success_url:`${site}/order/${order.token}?paid=1`,
   cancel_url:`${site}/order/${order.token}`,
   metadata:{order_id:order.id}
  });
  await supabase.from('orders').update({stripe_checkout_url:session.url,stripe_session_id:session.id}).eq('id',order.id);
  await supabase.from('payments').insert({order_id:order.id,amount:order.total,status:'checkout_created',stripe_session_id:session.id});
  return NextResponse.json({url:session.url});
 }catch(e){return NextResponse.json({error:e.message},{status:500})}
}
