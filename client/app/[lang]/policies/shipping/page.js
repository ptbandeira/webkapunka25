export const dynamicParams = false;

export async function generateStaticParams(){
  return [ { lang: 'en' }, { lang: 'pt' }, { lang: 'es' } ];
}

export const metadata = {
  title: 'Shipping Policy – Kapunka',
  description: 'Shipping methods, timelines, and order handling.'
};

export default function ShippingPolicy(){
  return (
    <section className="padding-xlarge">
      <div className="container">
        <div className="row">
          <div className="offset-md-2 col-md-8">
            <h1>Shipping Policy</h1>
            <p className="mb-3">This is a placeholder for the Shipping Policy. Content will be finalized later.</p>
            <p className="mb-0">Details on carriers, delivery windows, and order tracking coming soon.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

