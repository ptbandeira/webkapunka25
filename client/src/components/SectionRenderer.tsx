import React from 'react';
import type { Section } from '../types/sections';
import Hero from './home/Hero';
import BestSellers from './home/BestSellers';
import VideoStrip from './home/VideoStrip';
import { readLocaleJSON } from '../lib/cms/decap';

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
  if (!data || !Array.isArray(data.items)) return [] as any[];
  return data.items as any[];
}

// Server-side helper: load FAQs (optionally localized)
function loadFaqs(lang?: string) {
  const data = readLocaleJSON<any>(lang || 'en', 'faqs.json');
  if (!data || !Array.isArray(data.items)) return [] as any[];
  return data.items as any[];
}

export default function SectionRenderer({ sections, lang }: Props) {
  if (!Array.isArray(sections) || sections.length === 0) return null;

  // Preload shared content once per render for simple mapping
  let cachedProducts: any[] | null = null;
  let cachedFaqs: any[] | null = null;

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
                    {body ? <p className="fs-5" style={{ whiteSpace: 'pre-wrap' }}>{body}</p> : null}
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
          out.push(
            <section key={`faq-${idx}`} className="padding-large">
              <div className="container">
                <div className="row">
                  <div className="col-12">
                    {s.title ? <h3 className="mb-4">{s.title}</h3> : null}
                    <div>
                      {faqs.map((f: any, i: number) => (
                        <details key={`q-${i}`} className="mb-3">
                          <summary className="fw-semibold">{f.q || f.question}</summary>
                          <div className="mt-2">{f.a || f.answer}</div>
                        </details>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          );
          break;
        }
        case 'banner': {
          const { heading, button_label, button_link, background_image } = s;
          out.push(
            <section
              key={`bn-${idx}`}
              className="d-flex align-items-center justify-content-center"
              style={{
                background: background_image ? `url(${background_image}) no-repeat` : undefined,
                backgroundSize: background_image ? 'cover' : undefined,
                backgroundPosition: background_image ? 'center' : undefined,
                minHeight: background_image ? '520px' : undefined,
              }}
            >
              <div className="container text-center py-5">
                {heading ? <h3 className="mb-3">{heading}</h3> : null}
                {button_label && button_link ? (
                  <a href={button_link} className="btn">{button_label}</a>
                ) : null}
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

