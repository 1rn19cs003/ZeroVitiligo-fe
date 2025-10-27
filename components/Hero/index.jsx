"use client";

import { useState, useEffect } from 'react';
import styles from "./styles.module.css";
import Button from "../Button/index.jsx";
import { BUTOON_TYPES } from "@/lib/constants";
import LogoImage from "@/public/images/LogoImage.svg";
import Image from 'next/image';

export const Hero = () => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // Trigger slide-in animation after component mounts
    const timer = setTimeout(() => {
      setIsActive(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const imageClasses = `${styles.heroImageContainer} ${isActive ? styles.active : ''}`;

  return (
    <section className={styles.heroSection}>
      <div className={styles.heroWrapper}>
        <div className={styles.heroLayout}>
          
          {/* LEFT COLUMN: Hero Content */}
          <div className={styles.contentContainer}>
            <h1 className={styles.heroHeadline}>
              Reclaim Your Color, <br />
              Own Your Story
            </h1>

            <div className={styles.heroSubHeadline}>
              <p>
                The definitive platform for vitiligo wellness and progressives.
              </p>
            </div>

            <div className={styles.heroButtonsContainer}>
              <Button
                variant={BUTOON_TYPES.PRIMARY}
                text="Start Your Personalized Journey"
                onClick={() => { 
                  console.log('Start Your Personalized Journey clicked') 
                }}
              />
              <Button
                variant={BUTOON_TYPES.SECONDARY}
                text="Explore Our Holistic Approach"
                onClick={() => { 
                  console.log('Explore Our Holistic Approach clicked') 
                }}
              />
            </div>
          </div>
          
          {/* RIGHT COLUMN: Hero Image with slide-in transition */}
          <div className={imageClasses}>
            <Image
              src={LogoImage}
              alt="ZeroGreen - Vitiligo Wellness Platform"
              className={styles.heroLogoImage}
              priority
              unoptimized 
            />
          </div>
        </div>
      </div>
    </section>
  );
}