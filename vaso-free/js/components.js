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
                    <a class="nav-link ms-0" href="index.html">Home</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link ms-0" href="science.html">Science</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link ms-0" href="protocols.html">Protocols</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link ms-0" href="results.html">Results</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link ms-0" href="for-clinics.html">For Clinics</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link ms-0" href="about.html">About</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link ms-0" href="blog.html">Blog</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link ms-0" href="contact.html">Contact</a>
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
                    <h2>Ceramic soft pot</h2>
                    <p class="fs-3">This ceramic soft pot is specially designed by concept of traditional designs.</p>
                    <a href="single-product.html" class="btn">Shop Now</a>
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
                    <h2>Shiny Black Pot</h2>
                    <p class="fs-3">Beautiful shiny black pot is designed for minimalist decors.</p>
                    <a href="single-product.html" class="btn">Shop Now</a>
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
                    <h2>Shell Shape Decor</h2>
                    <p class="fs-3">Buy this beautiful unique pieces of shell shape vase decors for your plants of room.</p>
                    <a href="single-product.html" class="btn">Shop Now</a>
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
                  <img src="data:image/png;base64,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" alt="logo" class="mb-2">
                  <p>Nunc tristique facilisis consectetur vivamus ut porta porta aliquam vitae vehicula leo nullam urna lectus.</p>
                </div>
              </div>
              <div class="col-lg-2 col-sm-6 pb-3" data-aos="fade" data-aos-easing="ease-in" data-aos-duration="1200" data-aos-once="true">
                <div class="footer-menu">
                  <h4 class="widget-title pb-2">Quick Links</h4>
                  <ul class="menu-list list-unstyled">
                    <li class="menu-item pb-2">
                      <a href="index.html">Home</a>
                    </li>
                    <li class="menu-item pb-2">
                      <a href="science.html">Science</a>
                    </li>
                    <li class="menu-item pb-2">
                      <a href="protocols.html">Protocols</a>
                    </li>
                    <li class="menu-item pb-2">
                      <a href="results.html">Results</a>
                    </li>
                    <li class="menu-item pb-2">
                      <a href="for-clinics.html">For Clinics</a>
                    </li>
                    <li class="menu-item pb-2">
                      <a href="about.html">About</a>
                    </li>
                    <li class="menu-item pb-2">
                      <a href="blog.html">Blog</a>
                    </li>
                    <li class="menu-item pb-2">
                      <a href="contact.html">Contact</a>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="col-lg-3 col-sm-6 pb-3" data-aos="fade" data-aos-easing="ease-in" data-aos-duration="1400" data-aos-once="true">
                <div class="footer-menu contact-item">
                  <h4 class="widget-title pb-2">Contact info</h4>
                  <ul class="menu-list list-unstyled">
                    <li class="menu-item pb-2">
                      <a href="#">Tea Berry, Marinette, USA</a>
                    </li>
                    <li class="menu-item pb-2">
                      <a href="#">+55 111 222 333 44</a>
                    </li>
                    <li class="menu-item pb-2">
                      <a href="mailto:">yourinfo@gmail.com</a>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="col-lg-3 col-sm-6 pb-3" data-aos="fade" data-aos-easing="ease-in" data-aos-duration="1600" data-aos-once="true">
                <div class="footer-menu">
                  <h4 class="widget-title pb-2">Social info</h4>
                  <p>You can follow us on our social platforms to get updates.</p>
                  <div class="social-links">
                    <ul class="d-flex list-unstyled">
                      <li>
                        <a href="#">
                          <svg class="facebook">
                            <use xlink:href="#facebook">
                          </svg>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <svg class="instagram">
                            <use xlink:href="#instagram">
                          </svg>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <svg class="twitter">
                            <use xlink:href="#twitter">
                          </svg>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <svg class="linkedin">
                            <use xlink:href="#linkedin">
                          </svg>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <svg class="youtube">
                            <use xlink:href="#youtube">
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
              <p>© Copyright 2023 Vaso. Design by <a href="https://templatesjungle.com/" target="_blank"><b>TemplatesJungle</b></a></p>
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
