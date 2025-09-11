import { loadSiteFragment } from '../../src/lib/loadSiteFragment';
import { getPage, getProducts } from '../../src/lib/content';
import Hero from '../../src/components/home/Hero';
import BestSellers from '../../src/components/home/BestSellers';

export default async function LocaleHome({ params }){
  const lang = params?.lang || 'en';
  const { data } = await getPage(lang, 'home');
  const products = await getProducts(lang);
  let html = await loadSiteFragment('index');
  // Strip legacy hero and preloader from the fragment to avoid duplicate/overlay
  html = html
    .replace(/<hero-section[\s\S]*?<\/hero-section>/i, '')
    .replace(/<div id=["']preloader["'][\s\S]*?<\/div>/i, '')
    // Remove the legacy best-sellers swiper; React component will render it
    .replace(/<div class=\"swiper product-swiper\"[\s\S]*?<\/div>\s*<\/div>/i, '');

  return (
    <>
      <Hero title={data?.title || 'Kapunka'} subtitle={data?.subtitle || ''} />
      <BestSellers items={Array.isArray(products?.items) ? products.items : []} />
      <main dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
}
