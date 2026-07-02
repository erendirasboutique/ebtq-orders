import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic='force-dynamic';
export async function POST(req){
 if(!process.env.STRIPE_SECRET_KEY||!process.env.STRIPE_WEBHOOK_SECRET) return NextResponse.json({error:'Stripe not configured'},{status:500});
 const stripe=new Stripe(process.env.STRIPE_SECRET_KEY);
 const body=await req.text();
 const sig=req.headers.get('stripe-signature');
 let event;
 try{event=stripe.webhooks.constructEvent(body,sig,process.env.STRIPE_WEBHOOK_SECRET)}catch(e){return NextResponse.json({error:`Webhook Error: ${e.message}`},{status:400})}
 const supabase=getSupabaseAdmin();
 if(event.type==='checkout.session.completed'){
  const session=event.data.object;
  const orderId=session.metadata?.order_id;
  if(orderId){
   await supabase.from('orders').update({payment_status:'paid',status:'paid'}).eq('id',orderId);
   await supabase.from('payments').update({status:'paid',stripe_payment_intent:session.payment_intent}).eq('stripe_session_id',session.id);
  }
 }
 return NextResponse.json({received:true});
}
