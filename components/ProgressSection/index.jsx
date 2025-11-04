"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import styles from "./styles.module.css";
import { PROGRESS_DATA } from "@/lib/constants";

export default function ProgressSection() {
  const [index, setIndex] = useState(0);
  const intervalRef = useRef(null);
  const SLIDE_INTERVAL = 4000; 

  const resetInterval = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % PROGRESS_DATA.length);
    }, SLIDE_INTERVAL);
  };

  // Initialize auto-slide
  useEffect(() => {
    resetInterval();
    return () => clearInterval(intervalRef.current);
  }, []);

  const handleDotClick = (newIndex) => {
    setIndex(newIndex);
    resetInterval();
  };

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + PROGRESS_DATA.length) % PROGRESS_DATA.length);
    resetInterval();
  };

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % PROGRESS_DATA.length);
    resetInterval();
  };

  return (
    <section className={styles.section}>
      <div className={styles.card}>
        <div className={styles.contentRow}>
          {/* === Carousel === */}
          <div className={styles.carouselWrapper}>
            <div className={styles.carouselInner}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className={styles.carouselItem}
                >
                  <Image
                    src={PROGRESS_DATA[index].imageSrc}
                    alt={PROGRESS_DATA[index].alt}
                    width={600}
                    height={400}
                    className={styles.carouselImage}
                    priority
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className={styles.carouselCaption}
                  >
                    <h5 className={styles.captionTitle}>
                      {PROGRESS_DATA[index].caption}
                    </h5>
                    <p className={styles.captionText}>
                      {PROGRESS_DATA[index].description || "Real results from real people"}
                    </p>
                  </motion.div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Arrows */}
              <button
                onClick={handlePrev}
                className={`${styles.carouselControl} ${styles.carouselControlPrev}`}
                aria-label="Previous slide"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
              <button
                onClick={handleNext}
                className={`${styles.carouselControl} ${styles.carouselControlNext}`}
                aria-label="Next slide"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>

            {/* Indicators/Dots */}
            <div className={styles.carouselIndicators}>
              {PROGRESS_DATA.map((_, i) => (
                <button
                  key={i}
                  onClick={() => handleDotClick(i)}
                  className={`${styles.indicator} ${i === index ? styles.indicatorActive : ""}`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* === Stats === */}
           <div className={styles.statsWrapper}>
            <h2 className={styles.heading}>Progress We're Proud Of</h2>
            <h4 className={styles.subHeading}>See the Change. Trust the Process. We turn commitment into measurable improvement.</h4>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={styles.statsBox}
            >
              <h3 className={styles.statNumber}>94%</h3>
              <p className={styles.statText}>
                of patients report improved skin confidence
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
