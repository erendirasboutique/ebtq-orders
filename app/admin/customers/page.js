import { redirect } from 'next/navigation';
import BrandHeader from '@/components/BrandHeader';
import Flowers from '@/components/Flowers';
import { requireAdmin } from '@/lib/supabaseServer';

export const dynamic = 'force-dynamic';

export default async function Customers() {
  const { allowed, user, supabase } = await requireAdmin();

  if (!user) redirect('/login');
  if (!allowed) redirect('/login?error=not_allowed');

  const { data: customersData } = await supabase
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);

  const customers = Array.isArray(customersData) ? customersData : [];

  return (
    <main className="page flowerfield">
      <Flowers />

      <div className="shell">
        <BrandHeader />

        <section className="panel">
          <p className="eyebrow">Facebook contacts</p>
          <h1 className="h1">Customers</h1>

          <p className="copy">
            Messenger IDs are captured when customers message your Facebook Page
            webhook. You can then send future order magic links.
          </p>

          <br />

          {customers.length === 0 ? (
            <p className="copy">No customers yet.</p>
          ) : (
            customers.map((c) => (
              <div className="card" style={{ marginBottom: 12 }} key={c.id}>
                <b>{c.customer_name || 'Customer'}</b>

                <p className="copy">
                  Facebook: {c.facebook_name || 'Unknown'} · Messenger ID:{' '}
                  {c.messenger_psid ? 'Saved' : 'Not connected yet'}
                </p>
              </div>
            ))
          )}
        </section>
      </div>
    </main>
  );
}
