'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function PreloaderGuard(){
  const pathname = usePathname();

  useEffect(() => {
    function hide(){
      try{
        const ids = ['preloader', 'preloader-stub'];
        ids.forEach(id => {
          const el = document.getElementById(id);
          if (el) el.classList.add('hide-preloader');
        });
      }catch(e){}
    }
    // Hide immediately on mount/route change and after next tick
    hide();
    const t = setTimeout(hide, 0);
    // As a safety, hide again after assets settle
    const t2 = setTimeout(hide, 300);
    return () => { clearTimeout(t); clearTimeout(t2); };
  }, [pathname]);

  return null;
}
