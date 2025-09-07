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
  }catch(e){ /* preview must never break */ }
})();

