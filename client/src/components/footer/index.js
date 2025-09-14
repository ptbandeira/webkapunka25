'use client';

import { usePathname } from 'next/navigation';
import { getCurrentLang, withLang, stripLang } from '../../lib/locale';
import { isFeatureEnabled } from '../../lib/config';

export default function Footer(){
  const pathname = usePathname();
  const lang = getCurrentLang(pathname || '/');
  const base = `/${lang}`;
  const rest = stripLang(pathname || '/');

  return (
    <>
      <footer id="footer" className="overflow-hidden padding-xlarge pb-0">
        <div className="container">
          <div className="row">
            <div className="footer-top-area pb-5">
              <div className="row d-flex flex-wrap justify-content-between">
                <div className="col-lg-3 col-sm-6 pb-3" data-aos="fade" data-aos-easing="ease-in" data-aos-duration="1000" data-aos-once="true">
                  <div className="footer-menu">
                    <h3 className="pb-2" style={{fontFamily:'Italiana, serif'}}>Kapunka</h3>
                    <p>We make clinic-grade, single-ingredient care that’s gentle, effective, and honest. Pure argan oil. Real skin benefits.</p>
                  </div>
                </div>
                <div className="col-lg-2 col-sm-6 pb-3" data-aos="fade" data-aos-easing="ease-in" data-aos-duration="1200" data-aos-once="true">
                  <div className="footer-menu">
                    <h4 className="widget-title pb-2">Quick Links</h4>
                    <ul className="menu-list list-unstyled">
                      <li className="menu-item pb-2"><a href={withLang(lang, '/about')}>About</a></li>
                      <li className="menu-item pb-2"><a href={withLang(lang, '/shop')}>Shop</a></li>
                      <li className="menu-item pb-2"><a href={withLang(lang, '/contact')}>Contact</a></li>
                      <li className="menu-item pb-2"><a href="#">FAQs</a></li>
                      {isFeatureEnabled('policies') && (
                        <>
                          <li className="menu-item pb-2"><a href={withLang(lang, '/policies/shipping')}>Shipping &amp; Returns</a></li>
                          <li className="menu-item pb-2"><a href={withLang(lang, '/policies/privacy')}>Privacy</a></li>
                          <li className="menu-item pb-2"><a href={withLang(lang, '/policies/terms')}>Terms</a></li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
                <div className="col-lg-3 col-sm-6 pb-3" data-aos="fade" data-aos-easing="ease-in" data-aos-duration="1400" data-aos-once="true">
                  <div className="footer-menu contact-item">
                    <h4 className="widget-title pb-2">Contact info</h4>
                    <ul className="menu-list list-unstyled">
                      <li className="menu-item pb-2"><a href="#">Warsaw, Poland</a></li>
                      <li className="menu-item pb-2"><a href="#">+48 000 000 000</a></li>
                      <li className="menu-item pb-2"><a href="mailto:info@kapunkargan.com">info@kapunkargan.com</a></li>
                    </ul>
                  </div>
                </div>
                <div className="col-lg-3 col-sm-6 pb-3" data-aos="fade" data-aos-easing="ease-in" data-aos-duration="1600" data-aos-once="true">
                  <div className="footer-menu">
                    <h4 className="widget-title pb-2">Social info</h4>
                    <p>Follow Kapunka for launches, routines, and tips.</p>
                    <div className="social-links">
                      <ul className="d-flex list-unstyled">
                        <li><a href="#"><svg className="facebook"><use xlinkHref="#facebook"></use></svg></a></li>
                        <li><a href="#"><svg className="instagram"><use xlinkHref="#instagram"></use></svg></a></li>
                        <li><a href="#"><svg className="twitter"><use xlinkHref="#twitter"></use></svg></a></li>
                        <li><a href="#"><svg className="linkedin"><use xlinkHref="#linkedin"></use></svg></a></li>
                        <li><a href="#"><svg className="youtube"><use xlinkHref="#youtube"></use></svg></a></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <hr />
      </footer>
      <div id="footer-bottom">
        <div className="container">
          <div className="row d-flex flex-wrap justify-content-between">
            <div className="col-12">
              <div className="copyright">
                <p>© Copyright 2025 Kapunka. Design by <a href="https://kapunkargan.com/" target="_blank" rel="noreferrer"><b>Kapunkargan</b></a></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
