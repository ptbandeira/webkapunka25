// Locale layout wrapper for i18n routes. Root layout still provides header, CSS, and scripts.

export const dynamicParams = false;

export function generateStaticParams(){
  return [
    { lang: 'en' },
    { lang: 'pt' },
    { lang: 'es' },
  ];
}

export default function LocaleLayout({ children }){
  return children;
}

