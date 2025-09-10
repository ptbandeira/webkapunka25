import { getPage } from '../../../src/lib/content';

export const dynamicParams = false;

export async function generateStaticParams(){
  return [ { lang: 'en' }, { lang: 'pt' }, { lang: 'es' } ];
}

export default async function AboutLocalePage({ params }){
  const lang = params?.lang || 'en';
  const { data, content } = await getPage(lang, 'about');
  const desc = (data && data.description) ? String(data.description) : '';
  const body = (content || '').trim();

  return (
    <>
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
      <site-footer></site-footer>
    </>
  );
}
