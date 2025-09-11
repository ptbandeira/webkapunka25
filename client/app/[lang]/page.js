import { loadSiteFragment } from '../../src/lib/loadSiteFragment';
import { getPage, getProducts } from '../../src/lib/content';
import Hero from '../../src/components/home/Hero';
import BestSellers from '../../src/components/home/BestSellers';
import VideoStrip from '../../src/components/home/VideoStrip';

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
    .replace(/<div class=\"swiper product-swiper\"[\s\S]*?<\/div>\s*<\/div>/i, '')
    // Remove the legacy video-section (we'll render a React equivalent)
    .replace(/<div class=\"video-section[\s\S]*?<\/div>\s*<\/div>/i, '')
    // Remove the entire legacy products section wrapper if present
    .replace(/<section-wrapper[^>]*id=["']products["'][\s\S]*?<\/section-wrapper>/i, '')
    .replace(/<section[^>]*id=["']products["'][\s\S]*?<\/section>/i, '');

  return (
    <>
      <Hero title={data?.title || 'Kapunka'} subtitle={data?.subtitle || ''} />
      <BestSellers items={Array.isArray(products?.items) ? products.items : []} />
      <main dangerouslySetInnerHTML={{ __html: html }} />
      <VideoStrip />
    </>
  );
}
