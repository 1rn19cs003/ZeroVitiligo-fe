"use client";
import { useState } from "react";
import { ImageIcon, Video } from "lucide-react";
import styles from "./styles.module.css";

import PhotosSection from "./PhotosGallery";
import VideosSection from "./VideosGallery";

export default function Advertisement() {
  const [tab, setTab] = useState("PHOTOS");

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        
        {/* Tabs */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tabBtn} ${tab === "PHOTOS" ? styles.activeTab : ""}`}
            onClick={() => setTab("PHOTOS")}
          >
            <ImageIcon size={20} /> Photos
          </button>

          <button
            className={`${styles.tabBtn} ${tab === "VIDEOS" ? styles.activeTab : ""}`}
            onClick={() => setTab("VIDEOS")}
          >
            <Video size={20} /> Videos
          </button>
        </div>

        {/* Render Sections */}
        {tab === "PHOTOS" ? <PhotosSection /> : <VideosSection />}
      </div>
    </section>
  );
}
