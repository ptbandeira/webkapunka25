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
import WIPBadge from '../src/components/WIPBadge';
import MiniCart from '../src/components/cart/MiniCart';
import PromoBar from '../src/components/PromoBar';
import NewsletterTracker from '../src/components/NewsletterTracker';
import AnalyticsLoader from '../src/components/AnalyticsLoader';
import DevFeaturePanel from '../src/components/DevFeaturePanel';

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
        <PromoBar />
        <div className={manrope.className}>
          <Header />
        </div>
        {/* Dummy preloader stub (avoid duplicate id with legacy) */}
        <div id="preloader-stub" className="hide-preloader" aria-hidden="true" style={{ display:'none' }} />
        <PreloaderGuard />
        <LegacyReinit />
        {/* Load only Bootstrap JS on Home (React Home mode) so accordions/toggles work */}
        <BootstrapOnHome />
        {children}
        <Footer />
        {/* Legacy JS only on non-Home routes */}
        <LegacyScripts />
        {/* Dev-only */}
        <WIPBadge />
        {/* Cart drawer */}
        <MiniCart />
        <NewsletterTracker />
        <AnalyticsLoader />
        {process.env.NODE_ENV !== 'production' ? <DevFeaturePanel /> : null}
      </body>
    </html>
  );
}
