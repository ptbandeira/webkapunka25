// Server component layout (no 'use client') so metadata export is allowed

import './globals.css';
import { Manrope } from 'next/font/google';
import Header from '../src/components/header';
import Script from 'next/script';
import LegacyScripts from '../src/components/LegacyScripts';
import PreloaderGuard from '../src/components/PreloaderGuard';
import LegacyReinit from '../src/components/LegacyReinit';
import Footer from '../src/components/footer';
import BootstrapOnHome from '../src/components/BootstrapOnHome';
import HideChromeOnLegacyHome from '../src/components/hide/HideChromeOnLegacyHome';

const manrope = Manrope({ subsets: ['latin'] });

export const metadata = {
  title: 'Kapunka',
  description: 'Kapunka — Animated Nav (Next.js)',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Italiana&family=Mulish:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;0,1000;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900;1,1000&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="/css/vendor.css" />
        <link rel="stylesheet" href="/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/style.css" />
      </head>
      <body>
        <HideChromeOnLegacyHome />
        <div id="react-chrome-header" className={manrope.className}>
          <Header />
        </div>
        {/* Dummy preloader element to satisfy legacy script hooks */}
        <div id="preloader" className="hide-preloader" aria-hidden="true" style={{ display:'none' }} />
        <PreloaderGuard />
        <LegacyReinit />
        {/* Load only Bootstrap JS on Home (React Home mode) so accordions/toggles work */}
        <BootstrapOnHome />
        {children}
        <div id="react-chrome-footer">
          <Footer />
        </div>
        {/* Legacy JS only on non-Home routes */}
        <LegacyScripts />
      </body>
    </html>
  );
}
