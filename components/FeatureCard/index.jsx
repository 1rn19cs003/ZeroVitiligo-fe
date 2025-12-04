"use client";
import { useCallback, memo } from 'react';
import { FEATURES } from '@/lib/constants';
import styles from './styles.module.css';
import { useLanguage } from '@/hooks/useLanguage';

function FeaturesCard() {
  const { t } = useLanguage();

  const handleClick = useCallback((link) => {
    window.location.href = link;
  }, []);

  return (
    <div className={styles.card}>
      <div className={styles.content}>
        <h2 className={styles.heading}>
          {t('features.heading')}
          <br />
          {t('features.headingBreak')}
        </h2>

        <div className={styles.featuresGrid}>
          {FEATURES.map((feature) => (
            <div
              key={feature.id}
              className={styles.featureItem}
              onClick={() => handleClick(feature.link)}
            >
              <div className={styles.iconWrapper}>{feature.icon}</div>
              <p className={styles.featureTitle}>{t(`features.${feature.translationKey}.title`)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default memo(FeaturesCard);