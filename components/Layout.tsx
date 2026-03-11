import React, { ReactNode } from 'react';
import Link from 'next/link';

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="border-b py-4 px-6 flex justify-between items-center">
        <Link href="/" className="text-xl font-semibold">
          SmartHome‑4U Demo
        </Link>
        <nav>
          <Link href="/demo" className="mr-4 hover:underline">
            Start Demo
          </Link>
        </nav>
      </header>
      <div className="p-6">{children}</div>
      <footer className="border-t py-4 px-6 text-sm text-gray-600">
        &copy; {new Date().getFullYear()} SmartHome‑4U (Demo)
      </footer>
    </div>
  );
}
