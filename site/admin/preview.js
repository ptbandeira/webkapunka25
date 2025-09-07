/**
 * Decap CMS Preview templates
 * Shows a realistic preview for "Pages (builder)"
 * and a simple preview for EN/PT/ES pages.
 */
(function () {
  const el = window.React.createElement;

  // Load your site CSS into the preview iframe
  if (window.CMS && CMS.registerPreviewStyle) {
    CMS.registerPreviewStyle('/css/bootstrap.min.css');
    CMS.registerPreviewStyle('/css/vendor.css');
    CMS.registerPreviewStyle('/style.css');
  }

  // --- Section renderers (simple, fast) ---
  const S = {
    hero: (s) =>
      el('section',
        {
          className: 'padding-xlarge',
          style: s.background_image
            ? { backgroundImage: `url(/${s.background_image})`, backgroundSize: 'cover', backgroundPosition: 'center' }
            : {}
        },
        el('div', { className: 'container' }, [
          el('h1', { className: 'display-4 mb-3' }, s.title || 'Hero title'),
          s.subtitle && el('p', { className: 'lead mb-4' }, s.subtitle),
          s.cta_label && el('a', { className: 'btn btn-dark', href: s.cta_link || '#' }, s.cta_label)
        ])
      ),

    text: (s) =>
      el('section', { className: 'py-5' },
        el('div', { className: 'container' }, [
          s.heading && el('h3', { className: 'mb-3 text-' + (s.align || 'left') }, s.heading),
          s.body && el('p', { className: 'mb-0 text-' + (s.align || 'left') }, s.body)
        ])
      ),

    productGrid: (s) => {
      const count = Math.max(1, Math.min(12, Number(s.count || 6)));
      const cards = Array.from({ length: count }).map((_, i) =>
        el('div', { className: 'col-6 col-md-4 mb-4', key: i },
          el('div', { className: 'border p-3 text-center h-100' }, [
            el('div', { className: 'ratio ratio-1x1 bg-light mb-2' }),
            el('div', { className: 'fw-semibold' }, 'Product'),
            el('div', { className: 'text-muted' }, '€…')
          ])
        )
      );
      return el('section', { className: 'py-5' },
        el('div', { className: 'container' }, [
          s.title && el('h3', { className: 'mb-4' }, s.title),
          el('div', { className: 'row' }, cards)
        ])
      );
    },

    faqs: (s) =>
      el('section', { className: 'py-5' },
        el('div', { className: 'container' }, [
          s.title && el('h3', { className: 'mb-4' }, s.title),
          // Preview placeholders (we don't read files in-panel)
          el('div', { className: 'mb-3' }, [
            el('div', { className: 'fw-semibold' }, 'Question'),
            el('div', null, 'Answer')
          ]),
          el('div', { className: 'mb-3' }, [
            el('div', { className: 'fw-semibold' }, 'Question'),
            el('div', null, 'Answer')
          ])
        ])
      ),

    banner: (s) =>
      el('section',
        {
          className: 'py-5',
          style: s.background_image
            ? { backgroundImage: `url(/${s.background_image})`, backgroundSize: 'cover', backgroundPosition: 'center' }
            : {}
        },
        el('div', { className: 'container' }, [
          s.heading && el('h2', { className: 'mb-3' }, s.heading),
          s.button_label && el('a', { className: 'btn btn-outline-dark', href: s.button_link || '#' }, s.button_label)
        ])
      ),

    video: (s) =>
      el('section', { className: 'py-5' },
        el('div', { className: 'container' }, [
          s.youtube_url
            ? el('div', { className: 'ratio ratio-16x9 mb-2' },
                el('iframe', { src: s.youtube_url, title: 'Video', allow: 'autoplay; encrypted-media', allowFullScreen: true })
              )
            : el('div', { className: 'text-muted' }, 'Add a YouTube URL to see the video here.'),
          s.caption && el('div', { className: 'text-muted small' }, s.caption)
        ])
      ),
  };

  // Maps typed list item -> renderer
  function renderSection(section, i) {
    const t = section.type || section.template || section._type || section._template;
    const r = S[t];
    return r ? el('div', { key: i }, r(section)) : el('div', { key: i });
  }

  // Full-page preview for "Pages (builder)"
  function BuilderPreview({ entry }) {
    const data = entry.get('data').toJS();
    const sections = Array.isArray(data.sections) ? data.sections : [];
    return el('main', null, sections.map(renderSection));
  }

  // Simple preview for EN/PT/ES basic pages
  function SimplePagePreview({ entry }) {
    const d = entry.get('data').toJS();
    return el('main', { className: 'container py-5' }, [
      d.title && el('h1', { className: 'mb-3' }, d.title),
      d.body && el('p', null, d.body)
    ]);
  }

  // Register templates
  CMS.registerPreviewTemplate('pages', BuilderPreview);
  CMS.registerPreviewTemplate('pages_en', SimplePagePreview);
  CMS.registerPreviewTemplate('pages_pt', SimplePagePreview);
  CMS.registerPreviewTemplate('pages_es', SimplePagePreview);
})();
