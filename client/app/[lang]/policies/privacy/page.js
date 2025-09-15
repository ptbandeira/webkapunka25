export const dynamicParams = false;

export async function generateStaticParams(){
  return [ { lang: 'en' }, { lang: 'pt' }, { lang: 'es' } ];
}

export const metadata = {
  title: 'Privacy Policy – Kapunka',
  description: 'Our commitment to your privacy and data protection.'
};

export default function PrivacyPolicy(){
  return (
    <section className="padding-xlarge">
      <div className="container">
        <div className="row">
          <div className="offset-md-2 col-md-8">
            <h1>Privacy Policy</h1>
            <p className="mb-3">This is a placeholder for the Privacy Policy. Content will be finalized later.</p>
            <p className="mb-0">We respect your privacy and handle data with care. Full policy coming soon.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

