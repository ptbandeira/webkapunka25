(function () {
  const SUPPORTED_LANGS = ["en", "pt", "es"];
  const map = {
    "/": "home",
    "/index.html": "home",
    "/about.html": "about",
    "/shop.html": "shop",
    "/contact.html": "contact",
    "/faq.html": "faqs-page" // dedicated FAQs page JSON
  };

  const rawPath = window.location.pathname.replace(/\/+$/, "") || "/";
  const pathLangMatch = rawPath.match(/^\/(en|pt|es)(\/|$)/i);
  const pathLang = pathLangMatch ? pathLangMatch[1].toLowerCase() : null;
  const url = new URL(window.location.href);
  const qpLang = (url.searchParams.get("lang") || "").toLowerCase();
  const lang = SUPPORTED_LANGS.includes(qpLang) ? qpLang : (SUPPORTED_LANGS.includes(pathLang) ? pathLang : null);

  const normalizedPath = lang ? rawPath.replace(new RegExp(`^/${lang}`), "") || "/" : rawPath;
  const slug = map[normalizedPath];
  if (!slug) return;

  const basePages = lang ? `/content/${lang}/pages` : `/content/pages`;
  const contentUrl = `${basePages}/${slug}.json`;

  function ensureMount() {
    // prefer cmsMount for design-lock; migrate legacy sectionsMount id if present
    let mount = document.getElementById("cmsMount") || document.getElementById("sectionsMount");
    if (!mount) {
      mount = document.createElement("div");
      mount.id = "cmsMount";
      const header = document.querySelector("site-header, header");
      if (header && header.parentNode) header.parentNode.insertBefore(mount, header.nextElementSibling);
      else document.body.insertBefore(mount, document.body.firstChild);
    } else if (mount.id === "sectionsMount") {
      // migrate legacy id
      mount.id = "cmsMount";
    }
    return mount;
  }

  function toggleStatic(takeover) {
    document.body.classList.toggle("cms-takeover", !!takeover);
    // Also hide between header and footer non-destructively (legacy behavior)
    const header = document.querySelector("site-header, header");
    const footer = document.querySelector("site-footer, footer");
    const siblings = [];
    let node = header ? header.nextElementSibling : document.body.firstElementChild;
    while (node && node !== footer) {
      if (node.id !== "cmsMount") siblings.push(node);
      node = node.nextElementSibling;
    }
    siblings.forEach(el => { el.style.display = takeover ? "none" : ""; });
    const staticMain = document.getElementById("staticMain");
    if (staticMain) staticMain.style.display = takeover ? "none" : "";
  }

  const h = (html) => {
    const t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  };

  const priceFmt = new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 0 });
  function fmtPrice(val){
    if (val == null || val === '') return '€…';
    const num = typeof val === 'number' ? val : Number(String(val).replace(/[^\d.,-]/g,'').replace(',','.'));
    if (!isFinite(num)) return String(val);
    return priceFmt.format(num);
  }

  function renderSection(s) {
    switch (s.type) {
      case "hero": {
        const bg = s.background_image ? ` style="background-image:url('${s.background_image}');"` : "";
        return h(`
          <section-wrapper id="hero">
            <div class="hero-section d-flex align-items-center justify-content-center"${bg}>
              <div class="container">
                <h1 class="mb-3">${s.title || ""}</h1>
                ${s.subtitle ? `<p class="lead">${s.subtitle}</p>` : ""}
                ${s.cta_label && s.cta_link ? `<a class="btn mt-3" href="${s.cta_link}">${s.cta_label}</a>` : ""}
              </div>
            </div>
          </section-wrapper>
        `);
      }
      case "text":
        return h(`
          <section-wrapper class="padding-xlarge">
            <div class="container">
              <div class="row">
                <div class="offset-md-2 col-md-8">
                  <h3 class="py-3">${s.heading || ""}</h3>
                  <p>${(s.body || "").replace(/\n/g, "<br>")}</p>
                </div>
              </div>
            </div>
          </section-wrapper>
        `);
      case "productGrid":
        return h(`
          <section-wrapper id="products" class="product-store position-relative">
            <div class="container display-header d-flex flex-wrap justify-content-between pb-4">
              <h3 class="mt-3">${s.title || "Products"}</h3>
              <div class="btn-right d-flex flex-wrap align-items-center">
                <a href="shop.html" class="btn me-5">View all</a>
              </div>
            </div>
            <div class="row" id="cms-products-row"></div>
          </section-wrapper>
        `);
      case "faqs":
        return h(`
          <section-wrapper id="faqs" class="padding-xlarge">
            <div class="container">
              <div class="row">
                <div class="offset-md-2 col-md-8">
                  <h3 class="text-center mb-5">${s.title || "FAQs"}</h3>
                  <div id="cms-faqs"></div>
                </div>
              </div>
            </div>
          </section-wrapper>
        `);
      case "banner": {
        const bg = s.background_image ? ` style="background:url('${s.background_image}') no-repeat left; background-size: cover;"` : "";
        return h(`
          <section-wrapper id="banner">
            <div class="banner-content-1 position-relative"${bg}>
              <div class="banner-content-text position-absolute">
                <h2>${s.heading || ""}</h2>
                ${s.button_label && s.button_link ? `<a href="${s.button_link}" class="btn">${s.button_label}</a>` : ""}
              </div>
            </div>
          </section-wrapper>
        `);
      }
      case "video":
        return h(`
          <section-wrapper id="our-video">
            <div class="video-section d-flex align-items-center justify-content-center">
              <div class="video-player text-center">
                <a class="play-btn" href="${s.youtube_url || "#"}">Play</a>
                ${s.caption ? `<div class="mt-2">${s.caption}</div>` : ""}
              </div>
            </div>
          </section-wrapper>
        `);
      default:
        return document.createTextNode("");
    }
  }

  async function hydrateProducts(container, source, count) {
    try {
      // products are shared (no per-lang file yet)
      const res = await fetch(`/content/${source}`);
      const data = await res.json();
      (data.items || []).slice(0, count || 6).forEach(p => {
        container.appendChild(h(`
          <div class="col-12 col-md-4 mb-4">
            <div class="product-card position-relative">
              <div class="image-holder">
                <img src="${p.image}" alt="${p.name}" class="img-fluid" loading="lazy">
              </div>
              <div class="card-detail text-center pt-3 pb-2">
                <h5 class="card-title fs-4">${p.name}</h5>
                <span class="item-price text-primary fs-4 fw-light">${fmtPrice(p.price)}</span>
              </div>
            </div>
          </div>
        `));
      });
    } catch (e) { console.error("Products load failed", e); }
  }

  async function hydrateFaqs(container, source) {
    try {
      // try language-specific faqs first, then fallback
      let res = await fetch(lang ? `/content/${lang}/${source}` : `/content/${source}`);
      if (!res.ok && lang) res = await fetch(`/content/${source}`);
      const data = await res.json();
      (data.items || []).forEach(f => {
        container.appendChild(h(`
          <div class="accordion-item mb-3">
            <h4 class="accordion-header">${f.q}</h4>
            <div class="accordion-body"><p>${f.a}</p></div>
          </div>
        `));
      });
    } catch (e) { console.error("FAQs load failed", e); }
  }

  fetch(contentUrl)
    .then(r => r.ok ? r.json() : null)
    .then(cfg => {
      if (!cfg) return;
      toggleStatic(!!cfg.takeover);
      const mount = ensureMount();
      (cfg.sections || []).forEach(s => {
        const el = renderSection(s);
        if (el && el.nodeType === 1) mount.appendChild(el);
        if (s.type === "productGrid") {
          const row = mount.querySelector("#cms-products-row");
          if (row) hydrateProducts(row, s.source || "products.json", s.count || 6);
        }
        if (s.type === "faqs") {
          const fwrap = mount.querySelector("#cms-faqs");
          if (fwrap) hydrateFaqs(fwrap, s.source || "faqs.json");
        }
      });
    })
    .catch(e => console.error("Page content load failed", e));
})();
