'use client';

import styles from '../style.module.css';
import { translate } from '../../anim';
import { motion } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { stripLang, withLang, getCurrentLang } from '../../../lib/locale';

export default function Footer(){
  const pathname = usePathname();
  const router = useRouter();
  const current = getCurrentLang(pathname || '/');
  const rest = stripLang(pathname || '/');

  const switchLang = (l) => {
    try{ router.push(withLang(l, rest)); }catch(e){}
  };
  return (
    <div className={styles.footer}>
      <ul>
        <motion.li custom={[0.3, 0]} variants={translate} initial="initial" animate="enter" exit="exit">
          <span>Made by:</span> Sirona Digital
        </motion.li>
      </ul>
      <ul>
        <motion.li custom={[0.3, 0]} variants={translate} initial="initial" animate="enter" exit="exit">
          <span>Typography:</span> Google Fonts
        </motion.li>
      </ul>
      <ul>
        <motion.li custom={[0.3, 0]} variants={translate} initial="initial" animate="enter" exit="exit">
          <span>Images:</span> Freepik, Envato
        </motion.li>
      </ul>
      <ul>
        <motion.li custom={[0.3, 0]} variants={translate} initial="initial" animate="enter" exit="exit">Privacy Policy</motion.li>
        <motion.li custom={[0.3, 0]} variants={translate} initial="initial" animate="enter" exit="exit">Terms &amp; Conditions</motion.li>
      </ul>
      <ul>
        <motion.li custom={[0.3, 0]} variants={translate} initial="initial" animate="enter" exit="exit">
          <span>Language:</span>
          {['en','pt','es'].map((l) => (
            <button key={l} onClick={() => switchLang(l)} style={{ background:'none', border:'none', cursor:'pointer', marginLeft:8, opacity: l===current?1:.6 }} aria-current={l===current ? 'true' : 'false'}>
              {l.toUpperCase()}
            </button>
          ))}
        </motion.li>
      </ul>
    </div>
  );
}
