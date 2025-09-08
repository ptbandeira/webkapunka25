'use client';

import styles from './style.module.css';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { height } from '../anim';
import Body from './Body';
import Footer from './Footer';
import Image from './Image';

const links = [
  { title: 'Home',    href: '/',        src: 'home.png' },
  { title: 'Shop',    href: '/shop',    src: 'shop.png' },
  { title: 'About',   href: '/about',   src: 'about.png' },
  { title: 'Contact', href: '/contact', src: 'contact.png' },
];

export default function Index(){
  const [selectedLink, setSelectedLink] = useState({ isActive:false, index:0 });

  return (
    <motion.div className={styles.nav} variants={height} initial="initial" animate="enter" exit="exit">
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <Body links={links} selectedLink={selectedLink} setSelectedLink={setSelectedLink} />
          <Footer />
        </div>
        <Image src={links[selectedLink.index].src} selectedLink={selectedLink} />
      </div>
    </motion.div>
  );
}

