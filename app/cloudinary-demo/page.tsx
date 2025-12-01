"use client";

import CloudinaryUpload from "@/components/CloudinaryUpload";
import styles from "./page.module.css";

export default function CloudinaryDemoPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Cloudinary Integration Demo</h1>
      <div className={styles.card}>
        <CloudinaryUpload />
      </div>
    </div>
  );
}
