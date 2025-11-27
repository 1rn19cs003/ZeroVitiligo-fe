import styles from './styles.module.css';
import {
  Facebook,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  MessageSquare,
} from 'lucide-react';

import LogoImage from "../../public/images/LogoImage.svg";
import Image from 'next/image';
import { useLanguage } from '@/hooks/useLanguage';

export default function ContactLanding() {
  const { t } = useLanguage();

  return (
    <div className={styles.container}>
      <div className={styles.logoSection}>
        <Image
          src={LogoImage}
          alt="Zero Vitiligo Logo"
          width={40}
          height={40}
          style={{ borderRadius: "50%" }}
          className={styles.logo}
          priority="true"
        />
      </div>
      <h2 className={styles.heading}>{t('contact.heading')}</h2>
      <div className={styles.subheading}>
        {t('contact.subheading')}<br />
        <span className={styles.hindi}>{t('contact.subheadingHindi')}</span>
      </div>

      <div className={styles.buttonsBlock}>
        <div className={styles.buttonsGrid}>
          <a
            href="https://facebook.com/zerovitiligo"
            target="_blank"
            rel="noopener"
            className={`${styles.socialBtn} ${styles.facebook}`}
          >
            {t('contact.facebook')} <Facebook size={22} />
          </a>
          <a
            href="https://facebook.com/zerovitiligo"
            target="_blank"
            rel="noopener"
            className={`${styles.socialBtn} ${styles.facebook}`}
          >
            {t('contact.facebook')} <Facebook size={22} />
          </a>
          <a
            href="https://instagram.com/zerovitiligo"
            target="_blank"
            rel="noopener"
            className={`${styles.socialBtn} ${styles.instagram}`}
          >
            {t('contact.instagram')} <Instagram size={22} />
          </a>
          <a
            href="https://youtube.com/@zerovitiligo"
            target="_blank"
            rel="noopener"
            className={`${styles.socialBtn} ${styles.youtube}`}
          >
            {t('contact.youtube')} <Youtube size={22} />
          </a>
          <a
            href="mailto:info@zerovitiligo.com"
            className={`${styles.socialBtn} ${styles.email}`}
          >
            {t('contact.email')} <Mail size={22} />
          </a>
          <a
            href="https://wa.me/919123456789"
            target="_blank"
            rel="noopener"
            className={`${styles.socialBtn} ${styles.whatsapp}`}
          >
            {t('contact.whatsapp')} <MessageSquare size={22} />
          </a>
          <a
            href="tel:919123456789"
            className={`${styles.socialBtn} ${styles.call}`}
          >
            {t('contact.call')} <Phone size={22} />
          </a>
          <a
            href="https://maps.google.com/?q=Zero%20Vitiligo%20Clinic"
            target="_blank"
            rel="noopener"
            className={`${styles.socialBtn} ${styles.map}`}
          >
            {t('contact.map')} <MapPin size={22} />
          </a>
        </div>
      </div>
    </div>
  );
}
