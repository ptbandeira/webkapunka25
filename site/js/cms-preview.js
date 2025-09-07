/* Safe preview-only content mapper for Decap */
(function(){
  try{
    const url = new URL(location.href, location.origin);
    const allow = url.searchParams.get('cms-preview') === '1' || !!window.__DECAP_PREVIEW__;
    if (!allow) return; // no-op in production

    function byId(id){ return document.getElementById(id); }
    function setText(id, text){ const el = byId(id); if(el && text!=null) el.textContent = text; }
    function setImg(id, src, alt){ const el = byId(id); if(el && el.tagName === 'IMG'){ if(src) el.src = src; if(alt) el.alt = alt; } }

    // Fallback setters for known sections (without adding/changing classes)
    function setAbout(title, body){
      const wrap = document.getElementById('about');
      if (!wrap) return;
      const h = wrap.querySelector('h3');
      const p = wrap.querySelector('p');
      if (h && title!=null) h.textContent = title;
      if (p && body!=null) p.textContent = body;
    }

    // Expose one function per page for Decap preview
    window.__applyHome = function(data){
      // hero (safe: just text if ids exist)
      const hero = data && data.hero || {};
      setText('heroTitle', hero.title);
      setText('heroSubtitle', hero.subtitle);
      setImg('heroImage', hero.background_image, hero.title);

      // about
      const about = data && data.about || {};
      setText('aboutTitle', about.title); // if id exists
      setText('aboutBody', about.body);   // if id exists
      setAbout(about.title, about.body);  // fallback into #about structure

      // Products (preview-only): replace carousel items with provided or file items
      (async function(){
        try{
          const wrap = document.querySelector('.product-swiper .swiper-wrapper');
          if (!wrap) return;
          const priceFmt = new Intl.NumberFormat('en-IE', { style:'currency', currency:'EUR', minimumFractionDigits:0, maximumFractionDigits:0 });
          const fmt = v => (v==null? '€…' : priceFmt.format(typeof v==='number'? v : Number(String(v).replace(/[^\d.,-]/g,'').replace(',','.'))));
          const src = await fetch('/content/products.json').then(r=>r.ok?r.json():null).catch(()=>null);
          const items = (src && Array.isArray(src.items)) ? src.items.slice(0,6) : [];
          if (!items.length) return;
          wrap.innerHTML = items.map(p=>`
            <div class="swiper-slide">
              <div class="product-card position-relative">
                <div class="image-holder zoom-effect">
                  <img src="${p.image}" alt="${p.name}" class="img-fluid zoom-in" loading="lazy">
                </div>
                <div class="card-detail text-center pt-3 pb-2">
                  <h5 class="card-title fs-3 text-capitalize">
                    <a href="${p.link||'#'}">${p.name}</a>
                  </h5>
                  <span class="item-price text-primary fs-3 fw-light">${fmt(p.price)}</span>
                </div>
              </div>
            </div>`).join('');
        }catch(e){}
      })();

      // FAQs (preview-only): replace accordion
      (async function(){
        try{
          const acc = document.getElementById('accordionFlush');
          if (!acc) return;
          const faqs = await fetch('/content/faqs.json').then(r=>r.ok?r.json():null).catch(()=>null);
          const items = (faqs && Array.isArray(faqs.items)) ? faqs.items : [];
          if (!items.length) return;
          acc.innerHTML = items.map((it,i)=>{
            const qid = `flush-heading-${i}`; const cid = `flush-collapse-${i}`;
            return `
              <div class="accordion-item">
                <h4 class="accordion-header" id="${qid}">
                  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${cid}" aria-expanded="false" aria-controls="${cid}">
                    ${it.q}
                  </button>
                </h4>
                <div id="${cid}" class="accordion-collapse collapse" aria-labelledby="${qid}" data-bs-parent="#accordionFlush">
                  <div class="accordion-body"><p>${it.a}</p></div>
                </div>
              </div>`;
          }).join('');
        }catch(e){}
      })();
    };

    // About page: set main title and first paragraph
    window.__applyAbout = function(data){
      const title = data && data.title; const body = data && data.body;
      const main = document.querySelector('section-wrapper .container .row .col-md-8') || document.querySelector('h1')?.parentElement;
      if (main){
        const h1 = main.querySelector('h1') || document.querySelector('h1');
        const p  = main.querySelector('p');
        if (h1 && title!=null) h1.textContent = title;
        if (p && body!=null)  p.textContent  = body;
      }
    };

    // Shop page: set page title only
    window.__applyShop = function(data){
      const title = data && data.title;
      const h1 = document.querySelector('section-wrapper h1') || document.querySelector('h1');
      if (h1 && title!=null) h1.textContent = title;
    };

    // Contact page: title, intro, and email link
    window.__applyContact = function(data){
      const title = data && data.title; const intro = data && data.intro; const email = data && data.email;
      const main = document.querySelector('section-wrapper .container .row .col-md-8') || document.querySelector('h1')?.parentElement;
      if (main){
        const h1 = main.querySelector('h1') || document.querySelector('h1');
        const pIntro = main.querySelector('p');
        if (h1 && title!=null) h1.textContent = title;
        if (pIntro && intro!=null) pIntro.textContent = intro;
        if (email){
          const a = main.querySelector('a[href^="mailto:"]');
          if (a){ a.textContent = email; a.setAttribute('href', 'mailto:' + email); }
        }
      }
    };

    // Generic per-language page: set title/body in existing first H1/paragraph
    window.__applyPage = function(data){
      const title = data && data.title; const body = data && data.body;
      const h1 = document.querySelector('h1'); if (h1 && title!=null) h1.textContent = title;
      const p = h1 && h1.parentElement ? h1.parentElement.querySelector('p') : document.querySelector('p');
      if (p && body!=null) p.textContent = body;
    };
  }catch(e){ /* preview must never break */ }
})();
