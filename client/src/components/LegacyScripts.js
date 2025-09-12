'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { USE_REACT_HOME } from '../lib/config';

export default function LegacyScripts(){
  const pathname = usePathname() || '/';
  const isHome = /^\/(en|pt|es)\/?$/i.test(pathname);
  const shouldLoadOnHome = !USE_REACT_HOME; // legacy home requires legacy scripts
  if (isHome && !shouldLoadOnHome) return null;
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
