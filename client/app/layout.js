// Server component layout (no 'use client') so metadata export is allowed

import './globals.css';
import { Manrope } from 'next/font/google';
import Header from '../src/components/header';

const manrope = Manrope({ subsets: ['latin'] });

export const metadata = {
  title: 'Kapunka',
  description: 'Kapunka — Animated Nav (Next.js)',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={manrope.className}>
        <Header />
        {children}
      </body>
    </html>
  );
}
