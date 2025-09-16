import { getPage } from '../../../src/lib/content';
import { isFeatureEnabled } from '../../../src/lib/config';
import { getDecapPage, extractPageMeta } from '../../../src/lib/cms/decap';
import { getCurrentLocale } from '../../../src/lib/locale';
import SectionRenderer from '../../../src/components/SectionRenderer';

export const dynamicParams = false;

export async function generateStaticParams(){
  return [ { lang: 'en' }, { lang: 'pt' }, { lang: 'es' } ];
}

export default async function AboutLocalePage({ params }){
  const lang = getCurrentLocale(params?.lang);
  if (isFeatureEnabled('decapPages')){
    const sections = getDecapPage('about', lang);
    if (sections && sections.length) return <SectionRenderer sections={sections} lang={lang} />;
  }
  const { data, content } = await getPage(lang, 'about');
  const desc = (data && data.description) ? String(data.description) : '';
  const body = (content || '').trim();
  return (
    <section className="padding-xlarge">
      <div className="container">
        <div className="row">
          <div className="offset-md-2 col-md-8">
            <h1>{data?.title || 'About'}</h1>
            {desc ? <p>{desc}</p> : null}
            {body ? <p>{body}</p> : null}
          </div>
        </div>
      </div>
    </section>
  );
}

export function generateMetadata({ params }){
  const lang = getCurrentLocale(params?.lang);
  if (isFeatureEnabled('decapPages')){
    const sections = getDecapPage('about', lang);
    const meta = extractPageMeta(sections);
    if (meta) return meta;
  }
  return {
    title: lang === 'pt' ? 'Sobre – Kapunka' : lang === 'es' ? 'Acerca de – Kapunka' : 'About – Kapunka',
    description: 'Our story — 100% pure, cold-pressed argan oil.',
  };
}
