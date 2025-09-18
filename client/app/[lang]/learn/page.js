import { articles } from '../../../src/data/articles';
import { withLang, getCurrentLocale } from '../../../src/lib/locale';
import { buildAlternateLinks } from '../../../src/lib/seo/locale';

export const dynamicParams = false;

export async function generateStaticParams(){
  return [ { lang: 'en' }, { lang: 'pt' }, { lang: 'es' } ];
}

export function generateMetadata({ params }){
  const lang = getCurrentLocale(params?.lang);
  const alternates = buildAlternateLinks(lang, ['learn']);
  return {
    title: 'Learn – Kapunka',
    alternates: { canonical: alternates.canonical, languages: alternates.languages },
  };
}

function ArticleCard({ a, href }){
  return (
    <div className="card border-0 shadow-sm h-100">
      <div className="image-holder" style={{ aspectRatio: '1 / 1' }}>
        <a href={href}>
          <img src={a.image} alt={a.title} className="img-fluid" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </a>
      </div>
      <div className="card-body">
        <span className="badge bg-light text-dark mb-2" aria-label="Category">{a.category}</span>
        <h5 className="card-title fs-4 text-capitalize"><a href={href}>{a.title}</a></h5>
        <p className="card-text text-muted" style={{ display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{a.excerpt}</p>
      </div>
    </div>
  );
}

export default function LearnIndex({ params }){
  const lang = getCurrentLocale(params?.lang);
  const items = articles;
  return (
    <section className="padding-xlarge">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h1>Learn</h1>
            <p className="text-muted mb-4">Clinic‑minded education on post‑procedure care, scars, hair, baby skin, and barrier repair.</p>
          </div>
        </div>
        <div className="row g-4">
          {items.map(a => (
            <div className="col-md-4" key={a.id}>
              <ArticleCard a={a} href={withLang(lang, `/learn/${a.slug}`)} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
