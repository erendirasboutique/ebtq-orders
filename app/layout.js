import './globals.css';

export const metadata = {
  title: "Erendira's Boutique Order Portal",
  description: 'Boutique order management and private customer order links.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
