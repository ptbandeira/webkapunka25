export const metadata = {
  title: 'Contact – Kapunka',
  description: 'Questions or wholesale? We’ll reply within 1 business day.',
};

import { loadSiteFragment } from '../../src/lib/loadSiteFragment';
import { isFeatureEnabled } from '../../src/lib/config';
import { getDecapPage } from '../../src/lib/cms/decap';
import SectionRenderer from '../../src/components/SectionRenderer';

export default async function ContactPage() {
  if (isFeatureEnabled('decapPages')){
    const sections = getDecapPage('contact', 'en');
    if (sections && sections.length) return <SectionRenderer sections={sections} lang="en" />;
  }
  const html = await loadSiteFragment('contact');
  return <main dangerouslySetInnerHTML={{ __html: html }} />;
}
