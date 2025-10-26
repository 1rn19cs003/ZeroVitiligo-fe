import styles from './styles.module.css';

const features = [
  {
    id: 1,
    title: 'Holistic Wellness',
    icon: (
      <svg viewBox="0 0 64 64" className={styles.icon} fill="none" stroke="currentColor">
        <circle cx="32" cy="32" r="26" strokeWidth="3" />
        <path
          d="M32 12 L32 18 M32 12 C32 12, 20 18, 20 28 C20 34, 26 38, 32 38 C38 38, 44 34, 44 28 C44 18, 32 12, 32 12"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line x1="32" y1="38" x2="32" y2="48" strokeWidth="3" strokeLinecap="round" />
        <line x1="28" y1="44" x2="36" y2="44" strokeWidth="3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 2,
    title: 'Supportive Community',
    icon: (
      <svg viewBox="0 0 64 64" className={styles.icon} fill="none" stroke="currentColor">
        <circle cx="32" cy="32" r="26" strokeWidth="3" />
        <path
          d="M20 28 L28 36 L44 20"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: 3,
    title: 'Science-Backed Solutions',
    icon: (
      <svg viewBox="0 0 64 64" className={styles.icon} fill="currentColor" stroke="currentColor">
        <circle cx="32" cy="32" r="26" fill="none" strokeWidth="3" />
        <circle cx="32" cy="32" r="6" />
        <circle cx="32" cy="16" r="3" />
        <circle cx="32" cy="48" r="3" />
        <circle cx="16" cy="32" r="3" />
        <circle cx="48" cy="32" r="3" />
        <circle cx="44" cy="20" r="2.5" />
        <circle cx="20" cy="44" r="2.5" />
        <circle cx="44" cy="44" r="2.5" />
        <circle cx="20" cy="20" r="2.5" />
      </svg>
    ),
  },
];

export default function FeaturesCard() {
  return (
    <div className={styles.card}>
      <div className={styles.diagonalBg}></div>
      <div className={styles.content}>
        <h2 className={styles.heading}>
          We Don't Just Treat Skin.
          <br />
          We Support Lives
        </h2>

        <div className={styles.featuresGrid}>
          {features.map((feature) => (
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