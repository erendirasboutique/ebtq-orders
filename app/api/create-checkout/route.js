import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
export async function POST(req){
 if(!process.env.STRIPE_SECRET_KEY) return NextResponse.json({error:'Missing STRIPE_SECRET_KEY'}, {status:500});
 const {orderId}=await req.json();
 const supabase=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
 const {data:order}=await supabase.from('orders').select('*, customer:customers(*)').eq('id',orderId).single();
 if(!order) return NextResponse.json({error:'Order not found'}, {status:404});
 const stripe=new Stripe(process.env.STRIPE_SECRET_KEY);
 const session=await stripe.checkout.sessions.create({mode:'payment',line_items:[{price_data:{currency:'usd',product_data:{name:`Erendira's Boutique Order`},unit_amount:Math.round(Number(order.total)*100)},quantity:1}],success_url:`${process.env.NEXT_PUBLIC_SITE_URL}/order/${order.private_token}?paid=1`,cancel_url:`${process.env.NEXT_PUBLIC_SITE_URL}/order/${order.private_token}`});
 return NextResponse.json({url:session.url});
}
