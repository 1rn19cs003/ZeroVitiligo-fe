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

export default function ContactLanding() {
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
      <h2 className={styles.heading}>Follow "ZERO VITILIGO" on Social Media</h2>
      <div className={styles.subheading}>
        Freedom from "Vitiligo".<br />
        <span className={styles.hindi}>आज़ादी "सफेद दाग" से।</span>
      </div>

      <div className={styles.buttonsBlock}>
        <div className={styles.buttonsGrid}>
          <a
            href="https://facebook.com/zerovitiligo"
            target="_blank"
            rel="noopener"
            className={`${styles.socialBtn} ${styles.facebook}`}
          >
            Follow us on Facebook <Facebook size={22} />
          </a>
          <a
            href="https://facebook.com/zerovitiligo"
            target="_blank"
            rel="noopener"
            className={`${styles.socialBtn} ${styles.facebook}`}
          >
            Follow us on Facebook <Facebook size={22} />
          </a>
          <a
            href="https://instagram.com/zerovitiligo"
            target="_blank"
            rel="noopener"
            className={`${styles.socialBtn} ${styles.instagram}`}
          >
            Follow us on Instagram <Instagram size={22} />
          </a>
          <a
            href="https://youtube.com/@zerovitiligo"
            target="_blank"
            rel="noopener"
            className={`${styles.socialBtn} ${styles.youtube}`}
          >
            Subscribe on Youtube <Youtube size={22} />
          </a>
          <a
            href="mailto:info@zerovitiligo.com"
            className={`${styles.socialBtn} ${styles.email}`}
          >
            Send us an email <Mail size={22} />
          </a>
          <a
            href="https://wa.me/919123456789"
            target="_blank"
            rel="noopener"
            className={`${styles.socialBtn} ${styles.whatsapp}`}
          >
            Text us on Whatsapp <MessageSquare size={22} />
          </a>
          <a
            href="tel:919123456789"
            className={`${styles.socialBtn} ${styles.call}`}
          >
            Call us <Phone size={22} />
          </a>
          <a
            href="https://maps.google.com/?q=Zero%20Vitiligo%20Clinic"
            target="_blank"
            rel="noopener"
            className={`${styles.socialBtn} ${styles.map}`}
          >
            Reach us <MapPin size={22} />
          </a>
        </div>
      </div>
    </div>
  );
}
