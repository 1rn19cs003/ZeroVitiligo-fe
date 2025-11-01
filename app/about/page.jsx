'use client';
import styles from './styles.module.css';
import { LeftVine, RightVine, FilmReel } from '@/components/Miscellaneous';
import { row1Images, row2Images, row3Images } from '@/lib/constants';


export default function About() {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>
            About <span className={styles.highlight}>ZeroVitiligo</span>
          </h1>
          <p className={styles.subtitle}>
            Revolutionizing vitiligo treatment with advanced technology and compassionate care
          </p>
          <div className={styles.description}>
            <p>
              ZeroVitiligo is dedicated to transforming the lives of individuals affected by vitiligo
              through cutting-edge research, personalized treatment plans, and comprehensive support systems.
            </p>
            <p>
              Our innovative approach combines medical expertise with technological advancements
              to deliver effective, sustainable solutions for skin repigmentation and emotional wellness.
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