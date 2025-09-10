'use client';

// Renders legacy-compatible Swiper markup for the homepage hero.
// Initialization is handled by the legacy Swiper global via LegacyReinit.

export default function Hero({ title, subtitle }){
  return (
    <section id="billboard" className="position-relative overflow-hidden">
      <div className="swiper main-swiper">
        <div className="swiper-wrapper">
          <div
            className="swiper-slide"
            style={{
              backgroundImage: 'url(/images/banner-image.jpg)',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              height: '100vh',
              backgroundPosition: 'center',
            }}
          >
            <div className="container ">
              <div className="row">
                <div className="offset-md-1 col-md-6">
                  <div className="banner-content">
                    <h2>{title}</h2>
                    {subtitle ? <p className="fs-3">{subtitle}</p> : null}
                    <a href="/shop" className="btn">Shop the Oil</a>
                  </div>
                </div>
                <div className="col-md-5"></div>
              </div>
            </div>
          </div>
          <div
            className="swiper-slide"
            style={{
              backgroundImage: 'url(/images/banner-image1.jpg)',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              height: '100vh',
              backgroundPosition: 'center',
            }}
          >
            <div className="container">
              <div className="row">
                <div className="offset-md-6 col-md-6">
                  <div className="banner-content">
                    <h2>Pure, Cold‑Pressed Argan Oil</h2>
                    <p className="fs-3">Single-ingredient care for skin & hair.</p>
                    <a href="/shop" className="btn">Shop the Oil</a>
                  </div>
                </div>
              </div>
            </div>
        </div>
        <div
          className="swiper-slide"
          style={{
            backgroundImage: 'url(/images/banner-image2.jpg)',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            height: '100vh',
            backgroundPosition: 'center',
          }}
        >
          <div className="container">
            <div className="row">
              <div className="offset-md-1 col-md-6">
                <div className="banner-content">
                  <h2>Calm, Repair, Protect</h2>
                  <p className="fs-3">Fragrance‑free and lab‑tested argan oil.</p>
                  <a href="/shop" className="btn">Shop the Oil</a>
                </div>
              </div>
              <div className="col-md-5"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="main-slider-pagination"></div>
    </div>
  </section>
  );
}
