import { loadSiteFragment } from '../../src/lib/loadSiteFragment';
import { isFeatureEnabled } from '../../src/lib/config';
import { getDecapPage, extractPageMeta } from '../../src/lib/cms/decap';
import SectionRenderer from '../../src/components/SectionRenderer';

export async function generateMetadata() {
  if (isFeatureEnabled('decapPages')) {
    const sections = getDecapPage('about', 'en');
    const meta = extractPageMeta(sections);
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
