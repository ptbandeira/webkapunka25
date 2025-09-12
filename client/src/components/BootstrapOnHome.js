'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { USE_REACT_HOME } from '../lib/config';

export default function BootstrapOnHome(){
  const pathname = usePathname() || '/';
  const isHome = /^\/(en|pt|es)\/?$/i.test(pathname);
  // Only needed on React Home (legacy bundle disabled there)
  if (!isHome || !USE_REACT_HOME) return null;
  return (
    <>
      <Script src="/js/bootstrap.bundle.min.js" strategy="afterInteractive" />
    </>
  );
}
