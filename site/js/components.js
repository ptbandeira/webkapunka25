class SiteHeader extends HTMLElement {
  connectedCallback() {
    this.outerHTML = `
    <header id="header" class="site-header">
      <nav id="header-nav" class="navbar navbar-expand-lg px-3">
        <div class="container">
          <a class="navbar-brand d-lg-none" href="index.html">
            <img src="data:image/png;base64,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" class="logo">
          </a>
          <button class="navbar-toggler d-flex d-lg-none order-3 p-2" type="button" data-bs-toggle="offcanvas" data-bs-target="#bdNavbar" aria-controls="bdNavbar" aria-expanded="false" aria-label="Toggle navigation">Menu</button>
          <div class="offcanvas offcanvas-end" tabindex="-1" id="bdNavbar" aria-labelledby="bdNavbarOffcanvasLabel">
            <div class="offcanvas-header px-4 pb-0">
              <a class="navbar-brand" href="index.html">
                <img src="data:image/png;base64,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" class="logo">
              </a>
              <button type="button" class="btn-close btn-close-black" data-bs-dismiss="offcanvas" aria-label="Close" data-bs-target="#bdNavbar"></button>
            </div>
            <div class="offcanvas-body">
              <ul id="navbar" class="navbar-nav w-100 d-flex justify-content-between align-items-center">

                <ul class="list-unstyled d-lg-flex justify-content-md-between align-items-center">
                  <li class="nav-item">
                    <a class="nav-link ms-0" href="about.html">About</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link ms-0" href="shop.html">Shop</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link ms-0" href="contact.html">Contact</a>
                  </li>
                  <li class="nav-item dropdown" hidden>
                    <a class="nav-link dropdown-toggle ms-0" data-bs-toggle="dropdown" href="#" role="button" aria-expanded="false">Explore<svg class="bi" width="18" height="18"><use xlink:href="#chevron-down"></use></svg></a>
                    <ul class="dropdown-menu">
                      <li>
                        <a href="about.html" class="dropdown-item fs-5 fw-medium">About</a>
                      </li>
                      <li>
                        <a href="shop.html" class="dropdown-item fs-5 fw-medium">Shop</a>
                      </li>
                      <li>
                        <a href="single-product.html" class="dropdown-item fs-5 fw-medium">Product Details</a>
                      </li>
                      <li>
                        <a href="login.html" class="dropdown-item fs-5 fw-medium">My Account</a>
                      </li>
                      <li>
                        <a href="cart.html" class="dropdown-item fs-5 fw-medium">Cart</a>
                      </li>
                      <li>
                        <a href="checkout.html" class="dropdown-item fs-5 fw-medium">Checkout</a>
                      </li>
                      <li>
                        <a href="blog.html" class="dropdown-item fs-5 fw-medium">Journal</a>
                      </li>
                      <li>
                        <a href="single-post.html" class="dropdown-item fs-5 fw-medium">Article</a>
                      </li>
                      <li>
                        <a href="contact.html" class="dropdown-item fs-5 fw-medium">Contact</a>
                      </li>
                    </ul>
                  </li>
                </ul>

                <a class="navbar-brand d-none d-lg-block me-0" href="index.html">
                  <img src="data:image/png;base64,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" class="logo">
                </a>

                <ul class="list-unstyled d-lg-flex justify-content-between align-items-center">
                  <li class="nav-item search-item">
                    <div id="search-bar" class="border-right d-none d-lg-block">
                      <form action="" autocomplete="on">
                        <input id="search" class="text-dark" name="search" type="text" placeholder="Search Here...">
                        <a type="submit" class="nav-link me-0" href="#">Search</a>
                      </form>
                    </div>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link me-0" href="login.html">Account</a>
                  </li>
                  <li class="cart-dropdown nav-item dropdown">
                    <a class="nav-link dropdown-toggle me-0" data-bs-toggle="dropdown" href="#" role="button" aria-expanded="false">Cart(2)</a>
                    <div class="dropdown-menu dropdown-menu-end p-3">
                      <h4 class="d-flex justify-content-between align-items-center mb-3">
                        <span class="text-primary">Your cart</span>
                        <span class="badge bg-primary rounded-pill">2</span>
                      </h4>
                      <ul class="list-group mb-3">
                        <li class="list-group-item bg-transparent border-dark d-flex justify-content-between lh-sm">
                          <div>
                            <h5 class="card-title fs-3 text-capitalize">
                              <a href="single-product.html">Argan Oil 30ml</a>
                            </h5>
                            <small class="text-body-secondary">Soft texture matt coated.</small>
                          </div>
                          <span class="text-primary">$120</span>
                        </li>
                        <li class="list-group-item bg-transparent border-dark d-flex justify-content-between lh-sm">
                          <div>
                            <h5 class="card-title fs-3 text-capitalize">
                              <a href="single-product.html">Argan Oil 100ml</a>
                            </h5>
                            <small class="text-body-secondary">This pot is ceramic.</small>
                          </div>
                          <span class="text-primary">$870</span>
                        </li>
                        <li class="list-group-item bg-transparent border-dark d-flex justify-content-between">
                          <span class="text-uppercase"><b>Total (USD)</b></span>
                          <strong>$990</strong>
                        </li>
                      </ul>
                      <div class="d-flex flex-wrap justify-content-center">
                        <a class="w-100 btn btn-dark mb-1" type="submit">View Cart</a>
                        <a class="w-100 btn btn-primary" type="submit">Go to checkout</a>
                      </div>
                    </div>
                  </li>
                </ul>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </header>`;
  }
}
customElements.define('site-header', SiteHeader);

class HeroSection extends HTMLElement {
  connectedCallback() {
    this.outerHTML = `
    <section id="billboard" class="position-relative overflow-hidden">
      <div class="swiper main-swiper">
        <div class="swiper-wrapper">
          <div class="swiper-slide" style="background-image: url(images/banner-image.jpg); background-size: cover; background-repeat: no-repeat; height: 100vh; background-position: center;">
            <div class="container ">
              <div class="row">
                <div class="offset-md-1 col-md-6">
                  <div class="banner-content">
                    <h2>Pure Argan Oil for Skin Recovery</h2>
                    <p class="fs-3">Single-ingredient care. 100% organic, cold-pressed, and fragrance-free.</p>
                    <a href="single-product.html" class="btn">Shop the Oil</a>
                  </div>
                </div>
                <div class="col-md-5"></div>
              </div>
            </div>
          </div>
          <div class="swiper-slide" style="background-image: url(images/banner-image1.jpg); background-size: cover; background-repeat: no-repeat; height: 100vh; background-position: center;">
            <div class="container">
              <div class="row">
                <div class="offset-md-6 col-md-6">
                  <div class="banner-content">
                    <h2>Calm, Repair, Protect</h2>
                    <p class="fs-3">Helps restore the skin barrier and ease redness after procedures or everyday stress.</p>
                    <a href="single-product.html" class="btn">See How It Works</a>
                  </div>
                </div>
                <div class="col-md-5"></div>
              </div>
            </div>
          </div>
          <div class="swiper-slide" style="background-image: url(images/banner-image2.jpg); background-size: cover; background-repeat: no-repeat; height: 100vh; background-position: center;">
            <div class="container">
              <div class="row">
                <div class="offset-md-1 col-md-6">
                  <div class="banner-content">
                    <h2>Clinic-Grade. Kind to Skin.</h2>
                    <p class="fs-3">Used by healthcare pros. Safe for sensitive skin and for family use.</p>
                    <a href="single-product.html" class="btn">For Clinics</a>
                  </div>
                </div>
                <div class="col-md-5"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="main-slider-pagination position-absolute text-center"></div>
      </div>
    </section>`;
  }
}
customElements.define('hero-section', HeroSection);

class SiteFooter extends HTMLElement {
  connectedCallback() {
    this.outerHTML = `
    <footer id="footer" class="overflow-hidden padding-xlarge pb-0">
      <div class="container">
        <div class="row">
          <div class="footer-top-area pb-5">
            <div class="row d-flex flex-wrap justify-content-between">
              <div class="col-lg-3 col-sm-6 pb-3" data-aos="fade" data-aos-easing="ease-in" data-aos-duration="1000" data-aos-once="true">
                <div class="footer-menu">
                  <img src="data:image/png;base64,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" class="logo mb-2" alt="Kapunka">
                  <p>We make clinic-grade, single-ingredient care that’s gentle, effective, and honest. Pure argan oil. Real skin benefits.</p>
                </div>
              </div>
              <div class="col-lg-2 col-sm-6 pb-3" data-aos="fade" data-aos-easing="ease-in" data-aos-duration="1200" data-aos-once="true">
                <div class="footer-menu">
                  <h4 class="widget-title pb-2">Quick Links</h4>
                  <ul class="menu-list list-unstyled">
                    <li class="menu-item pb-2">
                      <a href="about.html">About</a>
                    </li>
                    <li class="menu-item pb-2">
                      <a href="shop.html">Shop</a>
                    </li>
                    <li class="menu-item pb-2">
                      <a href="contact.html">Contact</a>
                    </li>
                    <li class="menu-item pb-2">
                      <a href="faq.html">FAQs</a>
                    </li>
                    <li class="menu-item pb-2">
                      <a href="shipping-returns.html">Shipping &amp; Returns</a>
                    </li>
                    <li class="menu-item pb-2">
                      <a href="privacy.html">Privacy</a>
                    </li>
                    <li class="menu-item pb-2">
                      <a href="terms.html">Terms</a>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="col-lg-3 col-sm-6 pb-3" data-aos="fade" data-aos-easing="ease-in" data-aos-duration="1400" data-aos-once="true">
                <div class="footer-menu contact-item">
                  <h4 class="widget-title pb-2">Contact info</h4>
                  <ul class="menu-list list-unstyled">
                    <li class="menu-item pb-2">
                      <a href="#">Warsaw, Poland</a>
                    </li>
                    <li class="menu-item pb-2">
                      <a href="#">+48 000 000 000</a>
                    </li>
                    <li class="menu-item pb-2">
                      <a href="mailto:info@kapunkargan.com">info@kapunkargan.com</a>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="col-lg-3 col-sm-6 pb-3" data-aos="fade" data-aos-easing="ease-in" data-aos-duration="1600" data-aos-once="true">
                <div class="footer-menu">
                  <h4 class="widget-title pb-2">Social info</h4>
                  <p>Follow Kapunka for launches, routines, and tips.</p>
                  <div class="social-links">
                    <ul class="d-flex list-unstyled">
                      <li>
                        <a href="#">
                          <svg class="facebook">
                            <use xlink:href="#facebook"></use>
                          </svg>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <svg class="instagram">
                            <use xlink:href="#instagram"></use>
                          </svg>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <svg class="twitter">
                            <use xlink:href="#twitter"></use>
                          </svg>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <svg class="linkedin">
                            <use xlink:href="#linkedin"></use>
                          </svg>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <svg class="youtube">
                            <use xlink:href="#youtube"></use>
                          </svg>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <hr>
      </div>
    </footer>
    <div id="footer-bottom">
      <div class="container">
        <div class="row d-flex flex-wrap justify-content-between">
          <div class="col-12">
            <div class="copyright">
              <p>© Copyright 2025 Kapunka. Design by <a href="https://kapunkargan.com/" target="_blank"><b>Kapunkargan</b></a></p>
            </div>
          </div>
        </div>
      </div>
    </div>`;
  }
}
customElements.define('site-footer', SiteFooter);

class SectionWrapper extends HTMLElement {
  connectedCallback() {
    const section = document.createElement('section');
    for (const {name, value} of Array.from(this.attributes)) {
      section.setAttribute(name, value);
    }
    section.innerHTML = this.innerHTML;
    this.replaceWith(section);
  }
}
customElements.define('section-wrapper', SectionWrapper);
