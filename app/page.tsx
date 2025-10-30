import { Hero } from "@/components/Hero";
import FeaturesCard from "@/components/FeatureCard";
import ProgressSection from "@/components/ProgressSection";
import Advertisement from "@/components/Advertisement";
import styles from "./styles.module.css";

export default function HomePage() {
  return (
    <div className={styles.pageContainer}>
      <Hero />
      <section className={styles.featuresSection}>
        <div className={styles.container}>
          <div className={styles.featuresGrid}>
            <FeaturesCard />
          </div>
          <div className={styles.featuresRight}>
            <ProgressSection />
          </div>
        </div>
        <div>
          <Advertisement/>
        </div>
      </section>
    </div>
  );
}
