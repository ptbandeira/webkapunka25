import { products as MODEL_PRODUCTS } from '../../../../src/data/products';
import { readProducts, getProductBySlug } from '../../../../src/lib/products';
import ProductGallery from '../../../../src/components/shop/ProductGallery';
import { withLang, getCurrentLocale } from '../../../../src/lib/locale';
import AddToCart from '../../../../src/components/shop/AddToCart';

export const dynamicParams = false;

export async function generateStaticParams(){
  const langs = ['en','pt','es'];
  const decap = readProducts();
  const slugs = Array.isArray(decap) && decap.length ? decap.map(p => p.slug) : MODEL_PRODUCTS.map(p => p.slug);
  return langs.flatMap(lang => slugs.map(slug => ({ lang, slug })));
}

function Price({ value }){
  const num = typeof value === 'number' ? value : Number(String(value||'').replace(/[^\d.,-]/g,'').replace(',','.'));
  const fmt = new Intl.NumberFormat('en-IE', { style:'currency', currency:'EUR', minimumFractionDigits:0, maximumFractionDigits:0 });
  return <>{fmt.format(isFinite(num) ? num : 0)}</>;
}

export default function PDP({ params }){
  const lang = getCurrentLocale(params?.lang);
  const slug = params?.slug || '';
  const decap = getProductBySlug(slug);
  const fallback = MODEL_PRODUCTS.find(p => p.slug === slug) || MODEL_PRODUCTS[0];
  const product = decap ? {
    id: decap.id,
    slug: decap.slug,
    name: decap.name,
    image: Array.isArray(decap.images) ? decap.images[0] : '',
    price: Array.isArray(decap.prices) ? decap.prices[0] : 0,
    size: Array.isArray(decap.sizes) ? decap.sizes[0] : '',
  } : fallback;
  if (!product) return null;
  const all = decap ? (readProducts() || []) : MODEL_PRODUCTS;
  const related = (Array.isArray(all) ? all : []).filter(p => p.slug !== product.slug).slice(0, 3).map(p => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    image: Array.isArray(p.images) ? p.images[0] : p.image,
    price: Array.isArray(p.prices) ? p.prices[0] : p.price,
  }));

  return (
    <section className="padding-xlarge">
      <div className="container">
        <div className="row g-5">
          <div className="col-md-6">
            <ProductGallery image={product.image} alt={product.name} />
          </div>
          <div className="col-md-6">
            <h1 className="mb-2">{product.name}</h1>
            <p className="text-muted mb-4">{product.size}</p>
            <AddToCart product={product} />

            <div className="mt-4">
              <ul className="nav nav-tabs" role="tablist">
                <li className="nav-item" role="presentation"><button className="nav-link active" data-bs-toggle="tab" data-bs-target="#tab-desc" type="button" role="tab">Description</button></li>
                <li className="nav-item" role="presentation"><button className="nav-link" data-bs-toggle="tab" data-bs-target="#tab-ing" type="button" role="tab">Ingredients</button></li>
                <li className="nav-item" role="presentation"><button className="nav-link" data-bs-toggle="tab" data-bs-target="#tab-use" type="button" role="tab">How to Use</button></li>
                <li className="nav-item" role="presentation"><button className="nav-link" data-bs-toggle="tab" data-bs-target="#tab-lab" type="button" role="tab">Lab Test Note</button></li>
              </ul>
              <div className="tab-content p-3 border border-top-0 rounded-bottom">
                <div className="tab-pane fade show active" id="tab-desc" role="tabpanel">
                  <p>Pure, cold‑pressed argan oil. Clinic‑minded and fragrance‑free.</p>
                </div>
                <div className="tab-pane fade" id="tab-ing" role="tabpanel">
                  <p>INCI: Argania Spinosa Kernel Oil.</p>
                </div>
                <div className="tab-pane fade" id="tab-use" role="tabpanel">
                  <p>Apply 1–3 drops to damp skin or hair. Patch‑test if sensitive.</p>
                </div>
                <div className="tab-pane fade" id="tab-lab" role="tabpanel">
                  <p>Each batch is lab‑tested for purity. Full panel coming soon.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="padding-large">
          <h3 className="mb-4">Related Products</h3>
          <div className="row g-4">
            {related.map(p => (
              <div className="col-md-4" key={p.id}>
                <div className="product-card position-relative">
                  <div className="image-holder zoom-effect">
                    <a href={withLang(lang, `/shop/${p.slug}`)}>
                      <img src={p.image} alt={p.name} className="img-fluid zoom-in" loading="lazy" />
                    </a>
                  </div>
                  <div className="card-detail text-center pt-3 pb-2">
                    <h5 className="card-title fs-5 text-capitalize"><a href={withLang(lang, `/shop/${p.slug}`)}>{p.name}</a></h5>
                    <span className="item-price text-primary fw-light"><Price value={p.price} /></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
