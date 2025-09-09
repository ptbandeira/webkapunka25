import { loadSiteFragment } from '../src/lib/loadSiteFragment';

export default async function Page() {
  const html = await loadSiteFragment('index');
  return <main dangerouslySetInnerHTML={{ __html: html }} />;
}
