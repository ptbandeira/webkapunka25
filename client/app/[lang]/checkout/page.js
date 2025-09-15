export const dynamicParams = false;

export async function generateStaticParams(){
  return [ { lang: 'en' }, { lang: 'pt' }, { lang: 'es' } ];
}

export default function CheckoutStub({ params }){
  const lang = params?.lang || 'en';
  return (
    <section className="padding-xlarge">
      <div className="container">
        <div className="row g-5">
          <div className="col-12">
            <h1>Checkout</h1>
            <p className="text-muted">This is a placeholder checkout. If an external checkout URL is configured, the cart button will redirect there with payload.</p>
          </div>
          <div className="col-md-6">
            <h3 className="mb-3">Shipping</h3>
            <form aria-disabled>
              <div className="mb-3"><label className="form-label">Full name</label><input className="form-control" placeholder="Jane Doe" disabled /></div>
              <div className="mb-3"><label className="form-label">Address</label><input className="form-control" placeholder="123 Main St" disabled /></div>
              <div className="mb-3"><label className="form-label">City</label><input className="form-control" placeholder="City" disabled /></div>
            </form>
          </div>
          <div className="col-md-6">
            <h3 className="mb-3">Billing</h3>
            <form aria-disabled>
              <div className="mb-3"><label className="form-label">Card number</label><input className="form-control" placeholder="•••• •••• •••• ••••" disabled /></div>
              <div className="mb-3"><label className="form-label">Expiry</label><input className="form-control" placeholder="MM/YY" disabled /></div>
            </form>
          </div>
          <div className="col-12">
            <h3 className="mb-3">Review</h3>
            <p className="text-muted">Order summary will appear here.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

