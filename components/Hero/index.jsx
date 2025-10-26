"use client";

import styles from "./styles.module.css";
import Button from "../Button/index.jsx";
import { BUTOON_TYPES } from "@/lib/constants";

export const Hero = () => {
  return (
    // Apply the main CSS module class
    <section className={styles.heroSection}>
      <div
        className={styles.contentContainer}
      >
        {/* Hero Content */}
        <h1
          className={styles.heroHeadline}
        >
          Reclaim Your Color, <br />
          Own Your Story
        </h1>

        <div className={styles.heroSubHeadline}>
          <p>
            The definitive platform for vitiligo wellness and prognostics.
          </p>
        </div>

        {/* Buttons: Use a dedicated class for mobile responsiveness */}
        <div className={styles.heroButtonsContainer}>
          <Button
            variant={BUTOON_TYPES.PRIMARY}
            text="Start Your Personalized Journey"
            onClick={() => { console.log('Start Your Personalized Journey clicked') }}
          />
          <Button
            variant={BUTOON_TYPES.SECONDARY}
            text="Explore Our Holistic Approach"
            onClick={() => { console.log('Explore Our Holistic Approach clicked') }}
          />
        </div>
      </div>
    </section>
  );
}
