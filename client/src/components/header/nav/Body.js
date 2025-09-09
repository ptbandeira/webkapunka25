'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import styles from './style.module.css';
import { blur, translate } from '../anim';

export default function Body({ links, selectedLink, setSelectedLink, onNavigate }){
  const getChars = (word) => {
    const chars = [];
    word.split('').forEach((char, i) => {
      chars.push(
        <motion.span
          /* remove per-character stagger so all letters animate together */
          custom={[0, 0]}
          variants={translate}
          initial="initial"
          animate="enter"
          exit="exit"
          key={char + i}
        >
          {char}
        </motion.span>
      );
    });
    return chars;
  };

  return (
    <div className={styles.body}>
      {links.map((link, index) => {
        const { title, href } = link;
        const isBlur = selectedLink.isActive && selectedLink.index !== index;
        return (
          <Link key={`l_${index}`} href={href} className={styles.link} onClick={onNavigate}>
            <motion.p
              onMouseOver={() => setSelectedLink({ isActive: true, index })}
              onMouseLeave={() => setSelectedLink({ isActive: false, index })}
              variants={blur}
              animate={isBlur ? 'open' : 'closed'}
            >
              {getChars(title)}
            </motion.p>
          </Link>
        );
      })}
    </div>
  );
}
