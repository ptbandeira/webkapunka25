class SiteHeader extends HTMLElement {
  connectedCallback() {
    this.outerHTML = `
    <header id="header" class="site-header">
      <nav id="header-nav" class="navbar navbar-expand-lg px-3">
        <div class="container">
          <a class="navbar-brand d-lg-none" href="index.html">
            <img src="images/logo-wordmark.svg" class="logo" alt="Kapunka">
          </a>
          <button class="navbar-toggler d-flex d-lg-none order-3 p-2" type="button" data-bs-toggle="offcanvas" data-bs-target="#bdNavbar" aria-controls="bdNavbar" aria-expanded="false" aria-label="Toggle navigation">Menu</button>
          <div class="offcanvas offcanvas-end" tabindex="-1" id="bdNavbar" aria-labelledby="bdNavbarOffcanvasLabel">
            <div class="offcanvas-header px-4 pb-0">
              <a class="navbar-brand" href="index.html">
                <img src="images/logo-wordmark.svg" class="logo" alt="Kapunka">
              </a>
              <button type="button" class="btn-close btn-close-black" data-bs-dismiss="offcanvas" aria-label="Close" data-bs-target="#bdNavbar"></button>
            </div>
            <div class="offcanvas-body">
              <ul id="navbar" class="navbar-nav w-100 d-flex justify-content-between align-items-center">

                <ul class="list-unstyled d-lg-flex justify-content-md-between align-items-center">
                  <li class="nav-item">
                    <a class="nav-link ms-0" href="about.html">About Kapunka</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link ms-0" href="shop.html">Shop</a>
                  </li>
                  <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle ms-0" data-bs-toggle="dropdown" href="#" role="button" aria-expanded="false">Explore<svg class="bi" width="18" height="18"><use xlink:href="#chevron-down"></use></svg></a>
                    <ul class="dropdown-menu">
                      <li>
                        <a href="about.html" class="dropdown-item fs-5 fw-medium">About Kapunka</a>
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
                  <img src="images/logo-wordmark.svg" class="logo" alt="Kapunka">
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
                              <a href="single-product.html">Matt Black</a>
                            </h5>
                            <small class="text-body-secondary">Soft texture matt coated.</small>
                          </div>
                          <span class="text-primary">$120</span>
                        </li>
                        <li class="list-group-item bg-transparent border-dark d-flex justify-content-between lh-sm">
                          <div>
                            <h5 class="card-title fs-3 text-capitalize">
                              <a href="single-product.html">Shiny Pot</a>
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
                    <h2>Pure Argan Oil</h2>
                    <p class="fs-3">Cold-pressed, single-ingredient care for face, body, and hair.</p>
                    <a href="single-product.html" class="btn">Shop Argan Oil</a>
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
                    <h2>Glow Serum</h2>
                    <p class="fs-3">Argan oil + Vitamin E for daily radiance without the heaviness.</p>
                    <a href="single-product.html" class="btn">Shop Serum</a>
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
                    <h2>Hair &amp; Body Oils</h2>
                    <p class="fs-3">Light blends that absorb fast and leave a soft, healthy sheen.</p>
                    <a href="single-product.html" class="btn">Shop Oils</a>
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
                  <img src="images/logo-wordmark.svg" alt="Kapunka" class="logo mb-2">
                  <p>Simple, effective skincare centred on cold-pressed argan oil. Light textures. No perfume. Bottled in the EU.</p>
                </div>
              </div>
              <div class="col-lg-2 col-sm-6 pb-3" data-aos="fade" data-aos-easing="ease-in" data-aos-duration="1200" data-aos-once="true">
                <div class="footer-menu">
                  <h4 class="widget-title pb-2">Quick Links</h4>
                  <ul class="menu-list list-unstyled">
                    <li class="menu-item pb-2">
                      <a href="about.html">About Kapunka</a>
                    </li>
                    <li class="menu-item pb-2">
                      <a href="shop.html">Shop</a>
                    </li>
                    <li class="menu-item pb-2">
                      <a href="contact.html">Contact</a>
                    </li>
                    <li class="menu-item pb-2">
                      <a href="login.html">My Account</a>
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
                      <a href="mailto:hello@kapunka.co">hello@kapunka.co</a>
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
              <p>© Copyright 2025 Kapunka. Design by <a href="https://templatesjungle.com/" target="_blank"><b>TemplatesJungle</b></a></p>
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
