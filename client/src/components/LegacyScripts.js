'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';

export default function LegacyScripts(){
  const pathname = usePathname() || '/';
  const isHome = /^\/(en|pt|es)\/?$/i.test(pathname);
  if (isHome) return null;
  return (
    <>
      <Script src="/js/jquery-1.11.0.min.js" strategy="afterInteractive" />
      <Script src="/js/bootstrap.bundle.min.js" strategy="afterInteractive" />
      <Script src="/js/plugins.js" strategy="afterInteractive" />
      <Script src="/js/components.js" strategy="afterInteractive" />
      <Script src="/js/script.js" strategy="afterInteractive" />
    </>
  );
}

