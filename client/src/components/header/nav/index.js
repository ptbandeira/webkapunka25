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
            const dynamicLinks = [
              { title: navTitles.home,    href: basePath,               src: 'home.jpg' },
              { title: navTitles.shop,    href: basePath + '/shop',     src: 'shop.jpg' },
              { title: navTitles.about,   href: basePath + '/about',    src: 'about.jpg' },
              { title: navTitles.contact, href: basePath + '/contact',  src: 'contact.jpg' },
            ];
            if (isFeatureEnabled('learn'))    dynamicLinks.push({ title: 'Learn',        href: basePath + '/learn',    src: 'about.jpg' });
            if (isFeatureEnabled('clinics'))  dynamicLinks.push({ title: 'For Clinics',  href: basePath + '/clinics',  src: 'contact.jpg' });
            if (isFeatureEnabled('training')) dynamicLinks.push({ title: 'Training',     href: basePath + '/training', src: 'shop.jpg' });
            // Render body with dynamic links (title + href)
            return (
              <Body
                links={dynamicLinks.map(l => ({ title: l.title, href: l.href }))}
                selectedLink={selectedLink}
                setSelectedLink={setSelectedLink}
                onNavigate={onNavigate}
              />
            );
          })()}
          <Footer />
        </div>
        {(() => {
          const previews = [
            { title: navTitles.home,    src: 'home.jpg' },
            { title: navTitles.shop,    src: 'shop.jpg' },
            { title: navTitles.about,   src: 'about.jpg' },
            { title: navTitles.contact, src: 'contact.jpg' },
          ];
          if (isFeatureEnabled('learn'))    previews.push({ title: 'Learn',       src: 'about.jpg' });
          if (isFeatureEnabled('clinics'))  previews.push({ title: 'For Clinics', src: 'contact.jpg' });
          if (isFeatureEnabled('training')) previews.push({ title: 'Training',    src: 'shop.jpg' });
          const idx = Math.min(selectedLink.index, previews.length - 1);
          return <Image src={previews[idx].src} selectedLink={selectedLink} />;
        })()}
      </div>
    </motion.div>
  );
}
