import type { Metadata } from 'next';
import './globals.css';
import Navbar from '../src/components/Navbar';
import { Toaster } from '../src/components/Toaster';
import { ReactNode } from 'react';


export const metadata: Metadata = {
  title: 'Cafeteria Vote System',
  description: 'Kurumsal yemek oylama ve menü planlama',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr">
      <body className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-[#e9f5e1] via-[#f8f6e7] to-[#fbeee6] dark:from-[#1a2e23] dark:via-[#23272e] dark:to-[#2e1a1a]">
        {/* SVG Decorative Background */}
        <svg className="pointer-events-none fixed left-0 top-0 z-0 w-full h-full opacity-30" aria-hidden="true">
          <defs>
            <linearGradient id="cafeteria-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#fb923c" />
            </linearGradient>
          </defs>
          <circle cx="80%" cy="10%" r="320" fill="url(#cafeteria-grad)" />
          <ellipse cx="20%" cy="90%" rx="220" ry="120" fill="#fb923c22" />
        </svg>
        <Navbar />
        <main className="container-p py-6">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
