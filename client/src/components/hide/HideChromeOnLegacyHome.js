'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { USE_REACT_HOME } from '../../lib/config';

export default function HideChromeOnLegacyHome(){
  const pathname = usePathname() || '/';
  useEffect(() => {
    const isHome = /^\/(en|pt|es)\/?$/i.test(pathname);
    const header = document.getElementById('react-chrome-header');
    const footer = document.getElementById('react-chrome-footer');
    if (isHome && !USE_REACT_HOME) {
      if (header) header.style.display = 'none';
      if (footer) footer.style.display = 'none';
      document.body.classList.add('legacy-home');
    } else {
      if (header) header.style.display = '';
      if (footer) footer.style.display = '';
      document.body.classList.remove('legacy-home');
    }
  }, [pathname]);
  return null;
}

