import { loadSiteFragment } from '../../src/lib/loadSiteFragment';
import { isFeatureEnabled } from '../../src/lib/config';
import { getDecapPage, extractPageMeta } from '../../src/lib/cms/decap';
import SectionRenderer from '../../src/components/SectionRenderer';

function findHeroImage(sections) {
  return Array.isArray(sections) ? sections.find((s) => s.type === 'hero' && s.background_image)?.background_image : undefined;
}

export async function generateMetadata() {
  if (isFeatureEnabled('decapPages')) {
    const sections = getDecapPage('about', 'en');
    const heroImage = findHeroImage(sections);
    const meta = extractPageMeta(sections, { autoOg: { image: heroImage, title: 'About – Kapunka' } });
    if (meta) return meta;
  }
  return { title: 'About – Kapunka', description: 'Our story — 100% pure, cold-pressed argan oil.' };
}

export default async function AboutPage() {
  if (isFeatureEnabled('decapPages')){
    const sections = getDecapPage('about', 'en');
    if (sections && sections.length) return <SectionRenderer sections={sections} lang="en" />;
  }
  const html = await loadSiteFragment('about');
  return <main dangerouslySetInnerHTML={{ __html: html }} />;
}
