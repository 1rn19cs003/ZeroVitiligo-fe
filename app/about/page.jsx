import styles from './styles.module.css'

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
          <div className={styles.imagePlaceholder}>
            <span>ZeroVitiligo Impact</span>
          </div>
        </div>
      </div>
    </section>
  )
}