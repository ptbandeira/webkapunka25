import { loadSiteFragment } from '../../src/lib/loadSiteFragment';

export default async function ShopPage() {
  const html = await loadSiteFragment('shop');
  return <main dangerouslySetInnerHTML={{ __html: html }} />;
}
