
import { Hero } from "@/components/Hero";
import FeaturesCard from "@/components/FeatureCard";
import styles from "./styles.module.css";

export default function HomePage() {
  return (
    <div className={styles.pageContainer}>
      <Hero />

      <section className={styles.featuresSection}>
        <div className={styles.container}>
          <div className={styles.featuresGrid}>
            <div className={styles.featuresLeft}>
              <FeaturesCard />
            </div>

            <div className={styles.featuresRight}>
            </div>
          </div>
        </div>
      </section>

      {/* Progress Showcase Section */}
      {/* <ProgressShowcase /> */}

      {/* Testimonials Section */}
      {/* <Testimonials /> */}
    </div>
  );
}
