export const metadata = {
  title: 'About – Kapunka',
  description: 'Our story — 100% pure, cold-pressed argan oil.',
};

import { loadSiteFragment } from '../../src/lib/loadSiteFragment';
import { isFeatureEnabled } from '../../src/lib/config';
import { getDecapPage } from '../../src/lib/cms/decap';
import SectionRenderer from '../../src/components/SectionRenderer';

export default async function AboutPage() {
  if (isFeatureEnabled('decapPages')){
    const sections = getDecapPage('about', 'en');
    if (sections && sections.length) return <SectionRenderer sections={sections} lang="en" />;
  }
  const html = await loadSiteFragment('about');
  return <main dangerouslySetInnerHTML={{ __html: html }} />;
}
