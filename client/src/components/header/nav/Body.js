'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import styles from './style.module.css';
import { blur, translate } from '../../anim';

export default function Body({ links, selectedLink, setSelectedLink }){
  const getChars = (word) => {
    const chars = [];
    word.split('').forEach((char, i) => {
      chars.push(
        <motion.span
          custom={[i * 0.02, (word.length - i) * 0.01]}
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
          <Link key={`l_${index}`} href={href} className={styles.link}>
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

