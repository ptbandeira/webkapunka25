import { loadSiteFragment } from '../../src/lib/loadSiteFragment';

export const dynamicParams = false;

export async function generateStaticParams(){
  return [ { lang: 'en' }, { lang: 'pt' }, { lang: 'es' } ];
}

export default async function LocaleHomePage(){
  const html = await loadSiteFragment('index');
  return <main dangerouslySetInnerHTML={{ __html: html }} />;
}

