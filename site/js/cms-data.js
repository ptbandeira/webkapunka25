document.addEventListener("DOMContentLoaded", async () => {
  async function getJSON(path) {
    try {
      const res = await fetch(path, { cache: "no-store" });
      if (!res.ok) throw new Error(path + " " + res.status);
      return await res.json();
    } catch (e) {
      console.warn("CMS data load failed:", path, e);
      return null;
    }
  }

  // About on homepage
  const about = await getJSON("/content/about.json");
  if (about) {
    const at = document.getElementById("aboutTitle");
    const ab = document.getElementById("aboutBody");
    if (at && about.title) at.textContent = about.title;
    if (ab && about.body)  ab.textContent  = about.body;
  }

  // FAQs (Bootstrap accordion)
  const faqs = await getJSON("/content/faqs.json");
  if (faqs && Array.isArray(faqs.items)) {
    const acc = document.getElementById("accordionFlush");
    if (acc) {
      acc.innerHTML = "";
      faqs.items.forEach((item, i) => {
        const qid = `flush-heading-${i}`;
        const cid = `flush-collapse-${i}`;
        acc.insertAdjacentHTML("beforeend", `
          <div class="accordion-item">
            <h4 class="accordion-header" id="${qid}">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${cid}" aria-expanded="false" aria-controls="${cid}">
                ${item.q}
              </button>
            </h4>
            <div id="${cid}" class="accordion-collapse collapse" aria-labelledby="${qid}" data-bs-parent="#accordionFlush">
              <div class="accordion-body">
                <p>${item.a}</p>
              </div>
            </div>
          </div>
        `);
      });
    }
  }

  // Products (Swiper slides)
  const prods = await getJSON("/content/products.json");
  const priceFmt = new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 0 });
  const fmtPrice = (val) => {
    if (val == null || val === '') return '€…';
    const num = typeof val === 'number' ? val : Number(String(val).replace(/[^\d.,-]/g,'').replace(',','.'));
    if (!isFinite(num)) return String(val);
    return priceFmt.format(num);
  };
  if (prods && Array.isArray(prods.items)) {
    const wrap = document.getElementById("productWrapper");
    if (wrap) {
      wrap.innerHTML = "";
      prods.items.forEach(p => {
        wrap.insertAdjacentHTML("beforeend", `
          <div class="swiper-slide">
            <div class="product-card position-relative">
              <div class="image-holder zoom-effect">
                <img src="${p.image}" alt="${p.name}" class="img-fluid zoom-in" loading="lazy">
                <div class="cart-concern position-absolute">
                  <div class="cart-button">
                    <a href="${p.link || '#'}" class="btn">Add to Cart</a>
                  </div>
                </div>
              </div>
              <div class="card-detail text-center pt-3 pb-2">
                <h5 class="card-title fs-3 text-capitalize">
                  <a href="${p.link || '#'}">${p.name}</a>
                </h5>
                <span class="item-price text-primary fs-3 fw-light">${fmtPrice(p.price)}</span>
              </div>
            </div>
          </div>
        `);
      });

      // Re-init Swiper if available
      if (window.Swiper) {
        try {
          // destroy any existing instance on this element if your theme created one
          if (wrap.closest('.product-swiper')?.swiper) {
            wrap.closest('.product-swiper').swiper.destroy(true, true);
          }
          // basic init; your theme may override styles/options
          new Swiper('.product-swiper', {
            slidesPerView: 3,
            spaceBetween: 24,
            navigation: {
              nextEl: '.product-carousel-next',
              prevEl: '.product-carousel-prev'
            },
            breakpoints: {
              0:   { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              992: { slidesPerView: 3 }
            }
          });
        } catch (e) {
          console.warn("Swiper reinit failed:", e);
        }
      }
    }
  }
});
