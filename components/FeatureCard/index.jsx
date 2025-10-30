import { FEATURES } from '@/lib/constants';
import styles from './styles.module.css';

export default function FeaturesCard() {
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
            <div key={feature.id} className={styles.featureItem}>
              <div className={styles.iconWrapper}>{feature.icon}</div>
              <p className={styles.featureTitle}>{feature.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}