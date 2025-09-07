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
  }catch(e){ /* preview must never break */ }
})();
