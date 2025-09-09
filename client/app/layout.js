// Server component layout (no 'use client') so metadata export is allowed

import './globals.css';
import { Manrope } from 'next/font/google';
import Header from '../src/components/header';
import Script from 'next/script';
import PreloaderGuard from '../src/components/PreloaderGuard';
import LegacyReinit from '../src/components/LegacyReinit';

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
        <div className={manrope.className}>
          <Header />
        </div>
        <PreloaderGuard />
        <LegacyReinit />
        {children}
        {/* Legacy site JS for interactive pieces present in the HTML */}
        <Script id="preloader-fix" strategy="afterInteractive">{`
          (function(){
            try{
              var el = document.getElementById('preloader');
              if (!el) return;
              function hide(){ try{ el.classList.add('hide-preloader'); }catch(e){} }
              if (document.readyState !== 'loading') setTimeout(hide, 0);
              else document.addEventListener('DOMContentLoaded', hide);
              window.addEventListener('load', hide);
            }catch(e){}
          })();
        `}</Script>
        <Script src="/js/jquery-1.11.0.min.js" strategy="afterInteractive" />
        <Script src="/js/bootstrap.bundle.min.js" strategy="afterInteractive" />
        <Script src="/js/plugins.js" strategy="afterInteractive" />
        <Script src="/js/components.js" strategy="afterInteractive" />
        <Script src="/js/script.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
