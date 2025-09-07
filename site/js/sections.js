document.addEventListener("DOMContentLoaded", async () => {
  const mount = document.getElementById("sectionsMount");
  if (!mount) return;

  // Load the sections JSON for the current page (home)
  async function getJSON(path){ try{const r=await fetch(path,{cache:"no-store"}); if(!r.ok) throw new Error(path+" "+r.status); return await r.json(); }catch(e){console.warn("CMS data load failed:",path,e); return null; } }
  const data = await getJSON("/content/pages/home.json");
  if (!data || !Array.isArray(data.sections)) return;

  // Hide static content so builder takes over
  const staticMain = document.getElementById("staticMain");
  if (staticMain) staticMain.style.display = "none";

  // helpers
  const el = (tag, attrs={}, html="") => {
    const n = document.createElement(tag);
    Object.entries(attrs).forEach(([k,v]) => v!=null && n.setAttribute(k,v));
    if (html) n.innerHTML = html;
    return n;
  };

  function sectionWrap(inner, cls="padding-xlarge"){ 
    const sec = el("section-wrapper", { class: cls }); 
    sec.appendChild(inner); 
    return sec; 
  }

  function alignClass(a){ return a==="center" ? "text-center" : a==="right" ? "text-end" : ""; }

  // renderers
  async function renderHero(s){
    const box = el("div", { class: `container ${alignClass(s.align||"left")}` }, `
      <h1 class="py-2">${s.title||""}</h1>
      ${s.subtitle ? `<p class="lead">${s.subtitle}</p>` : ""}
      ${s.cta_label ? `<a class="btn mt-2" href="${s.cta_link||'#'}">${s.cta_label}</a>` : ""}
    `);
    const wrap = sectionWrap(box, "padding-xlarge jarallax");
    if (s.background_image) wrap.style.background = `url(${s.background_image}) no-repeat center/cover`;
    mount.appendChild(wrap);
  }

  async function renderText(s){
    const box = el("div", { class: `container ${alignClass(s.align||"left")}` }, `
      ${s.heading ? `<h3 class="py-3">${s.heading}</h3>` : ""}
      ${s.body ? `<p>${s.body}</p>` : ""}
    `);
    mount.appendChild(sectionWrap(box));
  }

  async function renderProducts(s){
    // Load products list from file
    const products = await getJSON("/content/" + (s.source || "products.json"));
    const items = (products && Array.isArray(products.items)) ? products.items.slice(0, s.count||6) : [];
    const container = el("div", { class: "container" });
    container.innerHTML = `
      <div class="display-header d-flex flex-wrap justify-content-between pb-4">
        <h3 class="mt-3">${s.title || "Products"}</h3>
      </div>
      <div class="row" id="builderProductGrid"></div>
    `;
    const grid = container.querySelector("#builderProductGrid");
    items.forEach(p => {
      const col = el("div", { class: "col-12 col-md-4 mb-4" });
      col.innerHTML = `
        <div class="product-card text-center">
          <div class="image-holder zoom-effect">
            <img src="${p.image}" alt="${p.name}" class="img-fluid zoom-in" loading="lazy">
          </div>
          <div class="card-detail pt-3 pb-2">
            <h5 class="card-title fs-4"><a href="${p.link||'#'}">${p.name}</a></h5>
            <span class="item-price text-primary fs-5 fw-light">${p.price||""}</span>
          </div>
        </div>
      `;
      grid.appendChild(col);
    });
    mount.appendChild(sectionWrap(container, "product-store position-relative"));
  }

  async function renderFaqs(s){
    const faqs = await getJSON("/content/" + (s.source || "faqs.json"));
    const items = (faqs && Array.isArray(faqs.items)) ? faqs.items : [];
    const container = el("div", { class: "container" });
    container.innerHTML = `
      <h3 class="text-center mb-5">${s.title || "FAQs"}</h3>
      <div class="accordion accordion-flush" id="builderAcc"></div>
    `;
    const acc = container.querySelector("#builderAcc");
    items.forEach((it,i)=>{
      const qid = `bq-${i}`, cid = `bc-${i}`;
      const item = el("div", { class: "accordion-item" });
      item.innerHTML = `
        <h4 class="accordion-header" id="${qid}">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${cid}" aria-expanded="false" aria-controls="${cid}">
            ${it.q}
          </button>
        </h4>
        <div id="${cid}" class="accordion-collapse collapse" aria-labelledby="${qid}">
          <div class="accordion-body"><p>${it.a}</p></div>
        </div>
      `;
      acc.appendChild(item);
    });
    mount.appendChild(sectionWrap(container));
  }

  async function renderBanner(s){
    const wrap = el("div", { class: "banner-content-3 position-relative", style: `background:url('${s.background_image||""}') no-repeat left; background-size:cover; height:100%;` });
    wrap.innerHTML = `
      <div class="banner-content-text position-absolute">
        <h2>${s.heading||""}</h2>
        ${s.button_label ? `<a href="${s.button_link||'#'}" class="btn">${s.button_label}</a>` : ""}
      </div>
    `;
    mount.appendChild(sectionWrap(wrap, "position-relative"));
  }

  async function renderVideo(s){
    const container = el("div", { class: "video-section d-flex align-items-center justify-content-center" });
    container.innerHTML = `
      <div class="video-player text-center">
        <iframe class="embed-responsive-item" src="${s.youtube_url||""}" allowscriptaccess="always" allow="autoplay" style="width:100%;max-width:960px;height:540px;border:0;"></iframe>
        ${s.caption ? `<div class="mt-2 small text-muted">${s.caption}</div>` : ""}
      </div>
    `;
    mount.appendChild(sectionWrap(container));
  }

  const map = { hero: renderHero, text: renderText, productGrid: renderProducts, faqs: renderFaqs, banner: renderBanner, video: renderVideo };
  for (const sec of data.sections) {
    const fn = map[sec.type];
    if (fn) await fn(sec);
  }
});
