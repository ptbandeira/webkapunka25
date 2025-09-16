import React from 'react';
import type { Section } from '../types/sections';
import Hero from './home/Hero';
import BestSellers from './home/BestSellers';
import VideoStrip from './home/VideoStrip';
import { readLocaleJSON, readFaqs, type FaqEntry } from '../lib/cms/decap';

type Props = {
  sections: Section[];
  lang?: string;
};

function isProd() {
  return process.env.NODE_ENV === 'production';
}

function warnDev(msg: string) {
  if (!isProd()) {
    // eslint-disable-next-line no-console
    console.warn(`[SectionRenderer] ${msg}`);
  }
}

// Server-side helper: load shared products (optionally localized)
function loadProducts(lang?: string) {
  const data = readLocaleJSON<any>(lang || 'en', 'products.json');
  if (!data) return [] as any[];
  if (Array.isArray((data as any).items)) return (data as any).items as any[];
  if (Array.isArray((data as any).products)) {
    return (data as any).products.map((p: any) => ({
      slug: p.slug,
      name: p.name,
      price: Array.isArray(p.prices) ? p.prices[0] : (p.price ?? 0),
      image: Array.isArray(p.images) ? p.images[0] : p.image,
      link: '#',
    }));
  }
  return [] as any[];
}

// Server-side helper: load FAQs (optionally localized)
function loadFaqs(lang?: string): FaqEntry[] {
  const locale = lang || 'en';
  try {
    const faqs = readFaqs(locale);
    return Array.isArray(faqs) ? faqs : [];
  } catch (err: any) {
    warnDev(`Failed loading FAQs for ${locale}: ${err?.message || err}`);
    return [];
  }
}

export default function SectionRenderer({ sections, lang }: Props) {
  if (!Array.isArray(sections) || sections.length === 0) return null;

  // Preload shared content once per render for simple mapping
  let cachedProducts: any[] | null = null;
  let cachedFaqs: FaqEntry[] | null = null;

  const getProducts = () => {
    if (!cachedProducts) cachedProducts = loadProducts(lang);
    return cachedProducts;
  };
  const getFaqs = () => {
    if (!cachedFaqs) cachedFaqs = loadFaqs(lang);
    return cachedFaqs;
  };

  const out: React.ReactNode[] = [];

  sections.forEach((s, idx) => {
    try {
      switch (s.type) {
        case 'meta': {
          // Meta sections are consumed for metadata only; skip rendering
          break;
        }
        case 'hero': {
          const { title, subtitle } = s;
          out.push(<Hero key={`hero-${idx}`} title={title} subtitle={subtitle} />);
          break;
        }
        case 'text': {
          const { heading, body, align } = s;
          out.push(
            <section key={`text-${idx}`} className="padding-large">
              <div className="container">
                <div className="row">
                  <div className="col-12">
                    {heading ? (
                      <h3 className={align === 'center' ? 'text-center' : align === 'right' ? 'text-end' : ''}>{heading}</h3>
                    ) : null}
                    {body ? <p className="fs-5">{body}</p> : null}
                  </div>
                </div>
              </div>
            </section>
          );
          break;
        }
        case 'productGrid': {
          const all = getProducts();
          // Support optional ids (if provided) or fall back to count/source
          const anyS: any = s as any;
          let items = Array.isArray(anyS.ids) && anyS.ids.length
            ? all.filter(p => anyS.ids.includes(p.slug))
            : all.slice(0, typeof s.count === 'number' ? s.count : all.length);
          out.push(<BestSellers key={`pg-${idx}`} items={items} />);
          break;
        }
        case 'faqs': {
          const faqs = getFaqs();
          const accordionId = `faq-accordion-${idx}`;
          const nodes: React.ReactNode[] = [];
          let lastCategory = '';

          faqs.forEach((faq, i) => {
            const category = (faq.category || '').trim();
            if (category && category !== lastCategory) {
              nodes.push(
                <h4 key={`cat-${idx}-${category}-${i}`} className="mt-4">{category}</h4>
              );
              lastCategory = category;
            } else if (!category) {
              lastCategory = '';
            }

            const collapseId = `${accordionId}-collapse-${i}`;
            const headingId = `${accordionId}-heading-${i}`;
            nodes.push(
              <div className="accordion-item" key={`${collapseId}`}>
                <h4 className="accordion-header" id={headingId}>
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#${collapseId}`}
                    aria-expanded="false"
                    aria-controls={collapseId}
                  >
                    {faq.question}
                  </button>
                </h4>
                <div
                  id={collapseId}
                  className="accordion-collapse collapse"
                  aria-labelledby={headingId}
                  data-bs-parent={`#${accordionId}`}
                >
                  <div className="accordion-body">
                    <p className="mb-0">{faq.answer}</p>
                  </div>
                </div>
              </div>
            );
          });

          out.push(
            <section key={`faq-${idx}`} className="padding-large">
              <div className="container">
                <div className="row justify-content-center">
                  <div className="col-12 col-lg-8">
                    {s.title ? <h3 className="text-center mb-5">{s.title}</h3> : null}
                    <div className="accordion accordion-flush" id={accordionId}>
                      {nodes}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          );
          break;
        }
        case 'banner': {
          const { heading, button_label, button_link } = s;
          const backgroundStyle = s.background_image
            ? {
              backgroundImage: `url(${s.background_image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }
            : {};
          out.push(
            <section key={`bn-${idx}`} className="padding-large">
              <div className="container">
                <div className="row">
                  <div className="col-12">
                    <div
                      className="position-relative overflow-hidden rounded-4 text-center text-white"
                      style={{ minHeight: '360px', ...backgroundStyle }}
                    >
                      <div
                        className="position-absolute top-50 start-50 translate-middle px-4 py-4"
                        style={{ background: 'rgba(0,0,0,0.35)', borderRadius: '18px', minWidth: '260px' }}
                      >
                        {heading ? <h3 className="mb-3 text-white">{heading}</h3> : null}
                        {button_label && button_link ? (
                          <a href={button_link} className="btn btn-light">{button_label}</a>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          );
          break;
        }
        case 'video': {
          out.push(<VideoStrip key={`vid-${idx}`} />);
          break;
        }
        default: {
          warnDev(`Skipping unknown section type: ${(s as any).type}`);
          break;
        }
      }
    } catch (e: any) {
      warnDev(`Failed rendering section[${idx}] (${(s as any).type || 'unknown'}): ${e?.message || e}`);
    }
  });

  return <>{out}</>;
}
