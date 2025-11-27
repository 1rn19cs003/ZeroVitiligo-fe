'use client';
import styles from './styles.module.css';
import { LeftVine, RightVine, FilmReel } from '@/components/Miscellaneous';
import { row1Images, row2Images, row3Images } from '@/lib/constants';
import { useLanguage } from '@/hooks/useLanguage';


export default function About() {
  const { t } = useLanguage();

  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>
            {t('about.title')} <span className={styles.highlight}>ZeroVitiligo</span>
          </h1>
          <p className={styles.subtitle}>
            {t('about.subtitle')}
          </p>
          <div className={styles.description}>
            <p>
              {t('about.p1')}
            </p>
            <p>
              {t('about.p2')}
            </p>
          </div>
        </div>
        <div className={styles.imageContainer}>
          <div className={styles.vineWrapper}>
            <LeftVine styles={styles} />
            <RightVine styles={styles} />
            <div className={styles.imagePlaceholder}>
              <FilmReel images={row1Images} direction="right" speed={20} styles={styles} />
              <FilmReel images={row2Images} direction="left" speed={18} styles={styles} />
              <FilmReel images={row3Images} direction="right" speed={22} styles={styles} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}