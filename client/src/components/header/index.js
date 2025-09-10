'use client';

import styles from './style.module.css';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { opacity, background } from './anim';
import Nav from './nav';
import useI18n from './useI18n';
import { getCurrentLang, stripLang, withLang, LOCALES } from '../../lib/locale';

export default function Header(){
  const [isActive, setIsActive] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useI18n();
  const currentLang = useMemo(() => getCurrentLang(pathname || '/'), [pathname]);
  const basePath = useMemo(() => `/${currentLang === 'en' ? 'en' : currentLang}` , [currentLang]);

  // Close the nav overlay on route changes
  useEffect(() => { setIsActive(false); }, [pathname]);

  const handleNavLinkClick = () => {
    // Close immediately
    setIsActive(false);
    // Ensure legacy preloader never blocks view if present
    try{
      const el = document.getElementById('preloader');
      if (el) el.classList.add('hide-preloader');
    }catch(e){}
  };

  const switchLang = (target) => {
    try{
      if (!LOCALES.includes(target)) return;
      const rest = stripLang(pathname || '/');
      router.push(withLang(target, rest));
      setIsActive(false);
    }catch(e){}
  };

  return (
    <header className={styles.header}>
      <div className={styles.bar}>
        <Link href={withLang(currentLang, '/')} className={styles.brand}>Kapunka</Link>
        <div onClick={() => setIsActive(!isActive)} className={styles.el} aria-label="Toggle menu">
          <div className={`${styles.burger} ${isActive ? styles.burgerActive : ''}`} />
          <div className={styles.label}>
            <motion.p variants={opacity} initial="initial" animate="open" key={isActive ? 'close' : 'menu'}>
              {isActive ? 'Close' : 'Menu'}
            </motion.p>
          </div>
        </div>
        <motion.div variants={opacity} animate={!isActive ? 'open' : 'closed'} className={styles.shopContainer}>
          <p className={styles.shop}>{t?.nav?.shop || 'Shop'}</p>
          <div className={styles.el}>
            <svg width="19" height="20" viewBox="0 0 19 20" fill="none" aria-hidden="true"><path d="M1.666 1.667h1.088c.205 0 .307 0 .39.038.073.033.134.087.177.154.049.076.063.177.092.38L3.81 5m0 0 .876 6.443c.112.817.167 1.226.362 1.534.172.271.419.487.71.621.331.152.744.152 1.57.152h7.131c.785 0 1.178 0 1.499-.141.283-.125.526-.326.701-.581.199-.289.272-.675.419-1.446L18.182 5.79c.051-.271.077-.407.04-.513a.333.333 0 0 0-.183-.221C17.942 5 17.804 5 17.527 5H3.81ZM8.333 17.5a.833.833 0 1 1-1.667 0 .833.833 0 0 1 1.667 0Zm6.667 0a.833.833 0 1 1-1.667 0 .833.833 0 0 1 1.667 0Z" stroke="#4D3D30" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>
            <p>{t?.nav?.cart || 'Cart'}(0)</p>
          </div>
        </motion.div>
      </div>

      <motion.div variants={background} initial="initial" animate={isActive ? 'open' : 'closed'} className={styles.background} />

      <AnimatePresence mode="wait">
        {isActive && <Nav onNavigate={handleNavLinkClick} basePath={basePath} />}
      </AnimatePresence>
    </header>
  );
}
