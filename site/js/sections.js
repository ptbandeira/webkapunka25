(function () {
  const map = {
    "/": "home",
    "/index.html": "home",
    "/about.html": "about",
    "/shop.html": "shop",
    "/contact.html": "contact",
    "/faq.html": "faqs-page" // map to dedicated FAQs page JSON
  };

  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  const slug = map[path];
  if (!slug) return;

  const contentUrl = `/content/pages/${slug}.json`;

  function ensureMount() {
    let mount = document.getElementById("sectionsMount");
    if (!mount) {
      mount = document.createElement("div");
      mount.id = "sectionsMount";
      const header = document.querySelector("site-header, header");
      if (header && header.parentNode) header.parentNode.insertBefore(mount, header.nextElementSibling);
      else document.body.insertBefore(mount, document.body.firstChild);
    }
    return mount;
  }

  function toggleStatic(takeover) {
    const header = document.querySelector("site-header, header");
    const footer = document.querySelector("site-footer, footer");
    const siblings = [];
    let node = header ? header.nextElementSibling : document.body.firstElementChild;
    while (node && node !== footer) {
      if (node.id !== "sectionsMount") siblings.push(node);
      node = node.nextElementSibling;
    }
    siblings.forEach(el => { el.style.display = takeover ? "none" : ""; });
  }

  const h = (html) => {
    const t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  };

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
                <span class="item-price text-primary fs-4 fw-light">${String(p.price).includes('€') ? p.price : `€${p.price}`}</span>
              </div>
            </div>
          </div>
        `));
      });
    } catch (e) { console.error("Products load failed", e); }
  }

  async function hydrateFaqs(container, source) {
    try {
      const res = await fetch(`/content/${source}`);
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
