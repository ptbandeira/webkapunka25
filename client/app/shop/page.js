import { loadSiteFragment } from '../../src/lib/loadSiteFragment';
import { isFeatureEnabled } from '../../src/lib/config';
import { getDecapPage } from '../../src/lib/cms/decap';
import SectionRenderer from '../../src/components/SectionRenderer';

export default async function ShopPage() {
  if (isFeatureEnabled('decapPages')){
    const sections = getDecapPage('shop', 'en');
    if (sections && sections.length) return <SectionRenderer sections={sections} lang="en" />;
  }
  const html = await loadSiteFragment('shop');
  return <main dangerouslySetInnerHTML={{ __html: html }} />;
}
