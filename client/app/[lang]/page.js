import { loadSiteFragment } from '../../src/lib/loadSiteFragment';
import { getPage } from '../../src/lib/content';
import Hero from '../../src/components/home/Hero';

export default async function LocaleHome({ params }){
  const lang = params?.lang || 'en';
  const { data } = await getPage(lang, 'home');
  let html = await loadSiteFragment('index');
  // Strip legacy hero and preloader from the fragment to avoid duplicate/overlay
  html = html
    .replace(/<hero-section[\s\S]*?<\/hero-section>/i, '')
    .replace(/<div id=["']preloader["'][\s\S]*?<\/div>/i, '');

  return (
    <>
      <Hero title={data?.title || 'Kapunka'} subtitle={data?.subtitle || ''} />
      <main dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
}
