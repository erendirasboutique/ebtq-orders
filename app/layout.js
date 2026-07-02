import './globals.css';

export const metadata = {
  title: "Erendira's Boutique Order Concierge",
  description: "Private customer order concierge for Erendira's Boutique"
};

export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
