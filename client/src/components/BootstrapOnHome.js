'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';

export default function BootstrapOnHome(){
  const pathname = usePathname() || '/';
  const isHome = /^\/(en|pt|es)\/?$/i.test(pathname);
  if (!isHome) return null;
  return (
    <>
      <Script src="/js/bootstrap.bundle.min.js" strategy="afterInteractive" />
    </>
  );
}

