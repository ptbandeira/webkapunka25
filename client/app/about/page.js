export const metadata = {
  title: 'About – Kapunka',
  description: 'Our story — 100% pure, cold-pressed argan oil.',
};

import { loadSiteFragment } from '../../src/lib/loadSiteFragment';

export default async function AboutPage() {
  const html = await loadSiteFragment('about');
  return <main dangerouslySetInnerHTML={{ __html: html }} />;
}
