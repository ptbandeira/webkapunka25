export const metadata = {
  title: 'Contact – Kapunka',
  description: 'Questions or wholesale? We’ll reply within 1 business day.',
};

import { loadSiteFragment } from '../../src/lib/loadSiteFragment';

export default async function ContactPage() {
  const html = await loadSiteFragment('contact');
  return <main dangerouslySetInnerHTML={{ __html: html }} />;
}
