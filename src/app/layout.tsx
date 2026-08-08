import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
  title: 'Magic SVG - Convertidor VTracer',
  description: 'Convierte tus logos PNG/JPG a SVG brillante al instante.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="dark">
      <body className={`${outfit.variable} font-sans antialiased bg-gray-950 text-gray-50 min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
