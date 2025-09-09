'use client';

import styles from '../style.module.css';
import { translate } from '../../anim';
import { motion } from 'framer-motion';

export default function Footer(){
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
    </div>
  );
}
