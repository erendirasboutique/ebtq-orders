import Link from 'next/link';

export default function BrandHeader({ admin = false }) {
  return (
    <header className="topbar">
      <Link href={admin ? '/admin' : '/'} className="brand">
        <div className="brandMark"><img src="/logo.svg" alt="Erendira's Boutique" /></div>
        <div>
          <h1>Erendira&apos;s Boutique</h1>
          <p>Order Portal • Envios cada Sábado</p>
        </div>
      </Link>
      {admin && <nav className="nav"><Link className="pill" href="/admin">Dashboard</Link><Link className="pill" href="/admin/orders">Orders</Link><Link className="pill" href="/admin/orders/new">New Order</Link></nav>}
    </header>
  );
}
