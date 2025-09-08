'use client';

import { motion } from 'framer-motion';
import NextImage from 'next/image';
import styles from '../style.module.css';
import { opacity } from '../../anim';

export default function Index({ src, selectedLink }){
  return (
    <motion.div className={styles.imageContainer} variants={opacity} initial="initial" animate={selectedLink.isActive ? 'open' : 'closed'}>
      <NextImage src={`/images/${src}`} alt="image" fill sizes="(max-width:900px) 100vw, 40vw" />
    </motion.div>
  );
}

