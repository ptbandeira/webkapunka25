'use client';

import styles from './style.module.css';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { height } from '../anim';
import Body from './Body';
import Footer from './Footer';
import Image from './Image';
import useI18n from '../useI18n';

const links = [
  // These filenames are synced from the static site's images via `npm run sync-images`
  { title: 'Home',    href: '/',        src: 'home.jpg' },        // from site/images/banner-image.jpg
  { title: 'Shop',    href: '/shop',    src: 'shop.jpg' },        // from site/images/product-item2.jpg
  { title: 'About',   href: '/about',   src: 'about.jpg' },       // from site/images/banner-image1.jpg
  { title: 'Contact', href: '/contact', src: 'contact.jpg' },     // from site/images/banner-image2.jpg
];

export default function Index({ onNavigate }){
  const [selectedLink, setSelectedLink] = useState({ isActive:false, index:0 });
  const { t } = useI18n();

  const navTitles = {
    home: t?.nav?.home || 'Home',
    shop: t?.nav?.shop || 'Shop',
    about: t?.nav?.about || 'About',
    contact: t?.nav?.contact || 'Contact',
  };

  return (
    <motion.div className={styles.nav} variants={height} initial="initial" animate="enter" exit="exit">
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <Body
            links={[
              { title: navTitles.home,   href: '/',        src: 'home.png' },
              { title: navTitles.shop,   href: '/shop',    src: 'shop.png' },
              { title: navTitles.about,  href: '/about',   src: 'about.png' },
              { title: navTitles.contact,href: '/contact', src: 'contact.png' },
            ]}
            selectedLink={selectedLink}
            setSelectedLink={setSelectedLink}
            onNavigate={onNavigate}
          />
          <Footer />
        </div>
        <Image src={links[selectedLink.index].src} selectedLink={selectedLink} />
      </div>
    </motion.div>
  );
}
