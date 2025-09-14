export const dynamicParams = false;

export async function generateStaticParams(){
  return [ { lang: 'en' }, { lang: 'pt' }, { lang: 'es' } ];
}

export const metadata = {
  title: 'Terms & Conditions – Kapunka',
  description: 'The rules that govern use of our site and services.'
};

export default function TermsConditions(){
  return (
    <section className="padding-xlarge">
      <div className="container">
        <div className="row">
          <div className="offset-md-2 col-md-8">
            <h1>Terms &amp; Conditions</h1>
            <p className="mb-3">This is a placeholder for Terms &amp; Conditions. Content will be finalized later.</p>
            <p className="mb-0">Usage terms, disclaimers, and limitations of liability.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

