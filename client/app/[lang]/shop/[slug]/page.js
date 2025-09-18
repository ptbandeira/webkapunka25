import { products as MODEL_PRODUCTS } from '../../../../src/data/products';
import { readProducts, getProductBySlug } from '../../../../src/lib/products';
import ProductGallery from '../../../../src/components/shop/ProductGallery';
import { withLang, getCurrentLocale } from '../../../../src/lib/locale';
import AddToCart from '../../../../src/components/shop/AddToCart';
import { getImageManifest } from '../../../../src/lib/image-manifest';
import { buildImageSources } from '../../../../src/lib/image-sources';
import { buildOgUrl } from '../../../../src/lib/og';
import { buildAlternateLinks } from '../../../../src/lib/seo/locale';
import { isFeatureEnabled } from '../../../../src/lib/config';
import { readReviews } from '../../../../src/lib/cms/decap';
import ReviewsGrid from '../../../../src/components/reviews/ReviewsGrid';

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

function selectProductReviews(reviews, productSlug){
  if (!Array.isArray(reviews) || !reviews.length) return [];
  const targeted = reviews.filter(review => review.productSlug && review.productSlug === productSlug);
  const generic = reviews.filter(review => !review.productSlug);
  if (targeted.length) {
    const seen = new Set();
    const combined = [];
    targeted.forEach(review => {
      if (seen.has(review.id)) return;
      seen.add(review.id);
      combined.push(review);
    });
    generic.forEach(review => {
      if (seen.has(review.id)) return;
      seen.add(review.id);
      combined.push(review);
    });
    return combined;
  }
  return reviews.filter(review => !review.productSlug || review.productSlug === productSlug);
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
  const imageManifest = getImageManifest();
  const all = decap ? (readProducts() || []) : MODEL_PRODUCTS;
  const related = (Array.isArray(all) ? all : []).filter(p => p.slug !== product.slug).slice(0, 3).map(p => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    image: Array.isArray(p.images) ? p.images[0] : p.image,
    price: Array.isArray(p.prices) ? p.prices[0] : p.price,
  }));
  const reviewsEnabled = isFeatureEnabled('reviews');
  const reviews = reviewsEnabled ? readReviews(lang) : [];
  const productReviews = reviewsEnabled ? selectProductReviews(reviews, product.slug) : [];

  return (
    <>
      <section className="padding-xlarge">
        <div className="container">
          <div className="row g-5">
            <div className="col-md-6">
              <ProductGallery image={product.image} alt={product.name} imageManifest={imageManifest} />
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
                    {(() => {
                      const sources = buildImageSources(imageManifest, p.image);
                      const placeholder = sources?.lqip ? {
                        backgroundImage: `url(${sources.lqip})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      } : null;
                      return (
                        <div className="image-holder zoom-effect" style={placeholder || undefined}>
                          <a href={withLang(lang, `/shop/${p.slug}`)}>
                            <img
                              src={sources?.src || p.image}
                              srcSet={sources?.srcSet}
                              sizes="(min-width: 1200px) 20vw, (min-width: 768px) 33vw, 80vw"
                              alt={p.name}
                              className="img-fluid zoom-in"
                              loading="lazy"
                            />
                          </a>
                        </div>
                      );
                    })()}
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
      {reviewsEnabled && productReviews.length ? (
        <ReviewsGrid id="product-reviews" heading="Customer reviews" reviews={productReviews} />
      ) : null}
    </>
  );
}

export function generateMetadata({ params }){
  const lang = getCurrentLocale(params?.lang);
  const slug = params?.slug || '';
  const product = getProductBySlug(slug);
  const name = product?.name || slug || 'Product';
  const image = Array.isArray(product?.images) && product?.images.length ? product?.images[0] : '';
  const category = Array.isArray(product?.badges) && product?.badges[0] ? product?.badges[0] : null;
  const title = `${name} – Kapunka`;
  const ogUrl = buildOgUrl({ title: name, image, category });
  const alternates = buildAlternateLinks(lang, ['shop', slug]);
  return {
    title,
    openGraph: {
      title,
      images: [{ url: ogUrl, width: 1200, height: 630 }],
    },
    alternates: {
      canonical: alternates.canonical,
      languages: alternates.languages,
    },
  };
}
