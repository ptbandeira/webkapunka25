import { getPage } from '../../../src/lib/content';
import { contact as CONTACT } from '../../../src/lib/config';
import ContactForm from '../../../src/components/contact/ContactForm';

export const dynamicParams = false;

export async function generateStaticParams(){
  return [ { lang: 'en' }, { lang: 'pt' }, { lang: 'es' } ];
}

export default async function ContactLocalePage({ params }){
  const lang = params?.lang || 'en';
  const { data } = await getPage(lang, 'contact');
  const title = data?.title || 'Contact';
  const intro = data?.intro || '';
  const email = CONTACT.email || data?.email || 'hello@kapunka.com';

  return (
    <>
      <section className="padding-xlarge">
        <div className="container">
          <div className="row">
            <div className="offset-md-2 col-md-8">
              <h1>{title}</h1>
              {intro ? <p className="mb-3">{intro}</p> : null}
              <p className="mb-4">Email us at <a href={`mailto:${email}`} className="link">{email}</a></p>
              <ContactForm privacyHref={`/${lang}/policies/privacy`} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
