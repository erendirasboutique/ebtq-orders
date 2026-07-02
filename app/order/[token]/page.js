import { notFound } from 'next/navigation';
import BrandHeader from '@/components/BrandHeader';
import Flowers from '@/components/Flowers';
import { getSupabaseServer } from '@/lib/supabaseServer';

export const dynamic = 'force-dynamic';

export default async function CustomerOrder({ params }) {
  const { token } = await params;

  const supabase = await getSupabaseServer();

  const { data: order } = await supabase
    .from('orders')
    .select('*')
    .eq('token', token)
    .maybeSingle();

  if (!order) notFound();

  return (
    <main className="page flowerfield">
      <Flowers />
      <div className="shell">
        <BrandHeader />

        <section className="panel">
          <p className="eyebrow">Your private order page</p>
          <h1 className="h1">
            Hi {order.customer_name || order.facebook_name || 'beautiful'} 🌸
          </h1>

          <p className="copy">
            Thank you for shopping with Erendira&apos;s Boutique. You can check
            your order here anytime.
          </p>

          {order.photo_url && (
            <img
              src={order.photo_url}
              alt="Order"
              style={{
                width: '100%',
                maxWidth: 420,
                borderRadius: 24,
                marginTop: 20,
                marginBottom: 20,
              }}
            />
          )}

          <div className="card">
            <h2 className="h2">Order Summary</h2>

            <p className="copy">
              Subtotal: ${Number(order.subtotal || 0).toFixed(2)}
            </p>
            <p className="copy">
              Shipping: ${Number(order.shipping || 0).toFixed(2)}
            </p>
            <p className="copy">
              Discount: ${Number(order.discount || 0).toFixed(2)}
            </p>

            <br />

            <div className="total">
              Total: ${Number(order.total || 0).toFixed(2)}
            </div>

            <br />

            <span className="badge">{order.status || 'draft'}</span>

            {order.notes && (
              <>
                <br />
                <br />
                <p className="copy">{order.notes}</p>
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
