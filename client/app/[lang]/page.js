import { loadSiteFragment } from '../../src/lib/loadSiteFragment';
import { isFeatureEnabled } from '../../src/lib/config';
import { readPageSections } from '../../src/lib/cms/decap';
import SectionRenderer from '../../src/components/SectionRenderer';

export const dynamicParams = false;

export async function generateStaticParams(){
  return [ { lang: 'en' }, { lang: 'pt' }, { lang: 'es' } ];
}

export default async function LocaleHomePage({ params }){
  const lang = params?.lang || 'en';
  if (isFeatureEnabled('decapPages')) {
    try {
      const sections = readPageSections(lang, 'home');
      if (Array.isArray(sections) && sections.length > 0) {
        return <SectionRenderer sections={sections} lang={lang} />;
      }
    } catch (e) {
      // fall through to legacy
    }
  }
  const html = await loadSiteFragment('index');
  return <main dangerouslySetInnerHTML={{ __html: html }} />;
}
