"use client";
import { Hero } from "@/components/Hero";
import styles from "./styles.module.css";

export default function HomePage() {
  return (
    <div className={styles.container}>
      <Hero/>
      <h1>Welcome Home 🏡</h1>
      <p>This is the Home page content.</p>
    </div>
  );
}
