"use client";

import { useState, useEffect } from 'react';
import styles from "./styles.module.css";
import Button from "../Button/index.jsx";
import { BUTOON_TYPES } from "@/lib/constants";
import LogoImage from "@/public/images/NewLogo.svg";
import Image from 'next/image';
import { BASE_URL } from '@/lib/app.const';
import { useLanguage } from '@/hooks/useLanguage';

export const Hero = () => {
  const { t } = useLanguage();
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // Trigger slide-in animation after component mounts
    const timer = setTimeout(() => {
      setIsActive(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const imageClasses = `${styles.heroImageContainer} ${isActive ? styles.active : ''}`;

  return (
    <section className={styles.heroSection}>
      <div className={styles.heroWrapper}>
        <div className={styles.heroLayout}>

          {/* LEFT COLUMN: Hero Content */}
          <div className={styles.contentContainer}>
            <h1 className={styles.heroHeadline}>
              {t('hero.headline')} <br />
              {t('hero.headlineBreak')}
            </h1>

            <div className={styles.heroSubHeadline}>
              <p>
                {t('hero.subheadline')}
              </p>
            </div>

            <div className={styles.heroButtonsContainer}>
              <Button
                variant={BUTOON_TYPES.PRIMARY}
                text={t('hero.ctaPrimary')}
                onClick={() => {
                  window.location.href = BASE_URL + "/contact";
                }}
              />
              <Button
                variant={BUTOON_TYPES.SECONDARY}
                text={t('hero.ctaSecondary')}
                onClick={() => {
                  const faqSection = document.getElementById("faq");
                  if (faqSection) {
                    faqSection.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              />
            </div>
          </div>

          {/* RIGHT COLUMN: Hero Image with slide-in transition */}
          <div className={imageClasses}>
            <Image
              src={LogoImage}
              alt="ZeroVitiligo - Vitiligo Wellness Platform"
              className={styles.heroLogoImage}
              priority
              unoptimized
            />
          </div>
        </div>
      </div>
    </section>
  );
}