import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SmartHome-4U Platform',
  description: 'We engineer certainty across design, fabrication, and execution.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main className="mx-auto max-w-7xl p-6">{children}</main>
      </body>
    </html>
  );
}
