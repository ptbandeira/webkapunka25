import { getPage } from '../../../src/lib/content';
import { contact as CONTACT } from '../../../src/lib/config';

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
              <form name="contact" method="POST" data-netlify="true">
                <input type="hidden" name="form-name" value="contact" />
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Name</label>
                  <input type="text" id="name" name="name" className="form-control" required />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input type="email" id="email" name="email" className="form-control" required />
                </div>
                <div className="mb-4">
                  <label htmlFor="message" className="form-label">Message</label>
                  <textarea id="message" name="message" rows="5" className="form-control" required></textarea>
                </div>
                <button type="submit" className="btn btn-primary">Send</button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
