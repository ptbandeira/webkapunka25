import { articles } from '../../../../src/data/articles';
import { buildOgUrl } from '../../../../src/lib/og';

export const dynamicParams = false;

export async function generateStaticParams(){
  const langs = ['en','pt','es'];
  const slugs = articles.map(a => a.slug);
  return langs.flatMap(lang => slugs.map(slug => ({ lang, slug })));
}

export function generateMetadata({ params }){
  const a = articles.find(x => x.slug === params.slug);
  const title = a ? `${a.title} — Learn` : 'Learn';
  const description = a?.excerpt || 'Education hub';
  const ogUrl = buildOgUrl({ title, category: a?.category || null });
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      images: [{ url: ogUrl, width: 1200, height: 630 }],
    },
  };
}

function JsonLd({ a }){
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: a.title,
    datePublished: a.date,
    image: a.image,
    articleSection: a.category,
    description: a.excerpt,
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export default function LearnArticle({ params }){
  const a = articles.find(x => x.slug === params.slug) || articles[0];
  if (!a) return null;
  return (
    <section className="padding-xlarge">
      <div className="container">
        <div className="row g-5">
          <div className="col-md-7">
            <h1 className="mb-3">{a.title}</h1>
            <p className="text-muted">{a.category}</p>
            <div className="image-holder mb-4" style={{ aspectRatio: '1 / 1' }}>
              <img src={a.image} alt={a.title} className="img-fluid" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
            </div>
            <div>
              <p>Placeholder content. This section will include dermatologist‑reviewed guidance for {a.category.toLowerCase()}.</p>
              <ul>
                <li>Simple, fragrance‑free routines</li>
                <li>How to support the skin barrier</li>
                <li>When to consult a professional</li>
              </ul>
            </div>
          </div>
          <div className="col-md-5">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">In this guide</h5>
                <p className="card-text text-muted">Description, Ingredients, and How‑to notes will be expanded here.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <JsonLd a={a} />
    </section>
  );
}
