"use client";
import { FEATURES } from '@/lib/constants';
import styles from './styles.module.css';

export default function FeaturesCard() {

  const handleClick = (link) => {
    window.location.href = link;
  };
  return (
    <div className={styles.card}>
      <div className={styles.content}>
        <h2 className={styles.heading}>
          We Don't Just Treat Skin.
          <br />
          We Support Lives
        </h2>

        <div className={styles.featuresGrid}>
          {FEATURES.map((feature) => (
            <div
              key={feature.id}
              className={styles.featureItem}
              onClick={() => handleClick(feature.link)}
            >
              <div className={styles.iconWrapper}>{feature.icon}</div>
              <p className={styles.featureTitle}>{feature.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}