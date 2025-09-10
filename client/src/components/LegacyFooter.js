'use client';

import { useEffect } from 'react';

export default function LegacyFooter(){
  useEffect(() => {
    try{
      // Create a single detached footer outside React's managed tree
      if (!document.querySelector('body > site-footer')){
        const el = document.createElement('site-footer');
        document.body.appendChild(el);
      }
    }catch(e){}
    return () => { /* keep footer persistent across routes */ };
  }, []);
  return null;
}

