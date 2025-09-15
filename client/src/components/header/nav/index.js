'use client';

import styles from './style.module.css';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { height } from '../anim';
import Body from './Body';
import Footer from './Footer';
import Image from './Image';
import useI18n from '../useI18n';
import { isFeatureEnabled } from '../../../lib/config';

// Preview images (synced into /public/images via sync-images)
// We attach a matching src to each nav link so preview updates correctly

export default function Index({ onNavigate, basePath = '/en' }){
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
          {(() => {
            // Desired L→R order:
            // Row 1: Home, About, Shop
            // Row 2: Learn, Training, Contact
            // Row 3: Clinics
            const ordered = [
              { key:'home',     title: navTitles.home,    href: basePath,                src: 'home.jpg',    show: true },
              { key:'about',    title: navTitles.about,   href: basePath + '/about',     src: 'about.jpg',   show: true },
              { key:'shop',     title: navTitles.shop,    href: basePath + '/shop',      src: 'shop.jpg',    show: true },
              { key:'learn',    title: 'Learn',           href: basePath + '/learn',     src: 'about.jpg',   show: isFeatureEnabled('learn') },
              { key:'training', title: 'Training',        href: basePath + '/training',  src: 'shop.jpg',    show: isFeatureEnabled('training') },
              { key:'contact',  title: navTitles.contact, href: basePath + '/contact',   src: 'contact.jpg', show: true },
              { key:'clinics',  title: 'Clinics',         href: basePath + '/clinics',   src: 'contact.jpg', show: isFeatureEnabled('clinics') },
            ];
            const visible = ordered.filter(l => l.show);
            return (
              <Body
                links={visible.map(l => ({ title: l.title, href: l.href }))}
                selectedLink={selectedLink}
                setSelectedLink={setSelectedLink}
                onNavigate={onNavigate}
              />
            );
          })()}
          <Footer />
        </div>
        {(() => {
          const ordered = [
            { key:'home',     src: 'home.jpg',    show: true },
            { key:'about',    src: 'about.jpg',   show: true },
            { key:'shop',     src: 'shop.jpg',    show: true },
            { key:'learn',    src: 'about.jpg',   show: isFeatureEnabled('learn') },
            { key:'training', src: 'shop.jpg',    show: isFeatureEnabled('training') },
            { key:'contact',  src: 'contact.jpg', show: true },
            { key:'clinics',  src: 'contact.jpg', show: isFeatureEnabled('clinics') },
          ];
          const previews = ordered.filter(l => l.show);
          const idx = Math.min(selectedLink.index, previews.length - 1);
          return <Image src={previews[idx].src} selectedLink={selectedLink} />;
        })()}
      </div>
    </motion.div>
  );
}
