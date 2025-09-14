export const dynamicParams = false;

export async function generateStaticParams(){
  return [ { lang: 'en' }, { lang: 'pt' }, { lang: 'es' } ];
}

export const metadata = {
  title: 'Returns Policy – Kapunka',
  description: 'Returns window, eligibility, and process.'
};

export default function ReturnsPolicy(){
  return (
    <section className="padding-xlarge">
      <div className="container">
        <div className="row">
          <div className="offset-md-2 col-md-8">
            <h1>Returns Policy</h1>
            <p className="mb-3">This is a placeholder for the Returns Policy. Content will be finalized later.</p>
            <p className="mb-0">How to start a return and get a refund or replacement.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

