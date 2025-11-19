"use client";

import { Hero } from "@/components/Hero";
import FeaturesCard from "@/components/FeatureCard";
import ProgressSection from "@/components/ProgressSection";
import styles from "./styles.module.css";
import Artifact from "@/components/Artifact";
import LogoImage from "../public/images/whatsappIcon.avif";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className={styles.pageContainer}>
      <Hero />
      <a
        href="https://wa.me/919123456789?text=Hi"
        className={styles.whatsappFloat}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Image src={LogoImage} width={40} height={40} alt="WhatsApp" priority className={styles.whatsappIcon} />
      </a>
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
          <Artifact />
        </div>
      </section>
    </div>
  );
}
