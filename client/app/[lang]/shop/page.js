import { getProducts } from '../../../src/lib/content';

export const dynamicParams = false;

export async function generateStaticParams(){
  return [ { lang: 'en' }, { lang: 'pt' }, { lang: 'es' } ];
}

function Price({ value }){
  const num = typeof value === 'number' ? value : Number(String(value||'').replace(/[^\d.,-]/g,'').replace(',','.'));
  const fmt = new Intl.NumberFormat('en-IE', { style:'currency', currency:'EUR', minimumFractionDigits:0, maximumFractionDigits:0 });
  return <>{fmt.format(isFinite(num) ? num : 0)}</>;
}

export default async function ShopLocalePage({ params }){
  const lang = params?.lang || 'en';
  const data = await getProducts(lang);
  const items = Array.isArray(data?.items) ? data.items : [];

  return (
    <>
      <section className="padding-xlarge">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h1 className="mb-5">Shop</h1>
            </div>
          </div>
          <div className="row g-4">
            {items.map((p, i) => (
              <div className="col-md-4" key={i}>
                <div className="product-card position-relative">
                  <div className="image-holder zoom-effect">
                    <img src={p.image} alt={p.name} className="img-fluid zoom-in" loading="lazy" />
                    <div className="cart-concern position-absolute">
                      <div className="cart-button">
                        <a href={p.link || '#'} className="btn">Add to Cart</a>
                      </div>
                    </div>
                  </div>
                  <div className="card-detail text-center pt-3 pb-2">
                    <h5 className="card-title fs-3 text-capitalize">
                      <a href={p.link || '#'}>{p.name}</a>
                    </h5>
                    <span className="item-price text-primary fs-3 fw-light"><Price value={p.price} /></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <site-footer></site-footer>
    </>
  );
}
