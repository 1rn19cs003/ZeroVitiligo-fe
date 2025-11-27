"use client";

import { useState } from "react";
import { ImageIcon, Video } from "lucide-react";
import styles from "./styles.module.css";
import { MEDIA_TAB } from "@/lib/constants";
import ImageGallery from "../ImageGallery";
import VideoGallery from "../VideoGallery";

export default function Advertisement() {
  const [tab, setTab] = useState(MEDIA_TAB.VIDEOS);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.tabs}>
          <button
            className={`${styles.tabBtn} ${tab === MEDIA_TAB.PHOTOS ? styles.activeTab : ""
              }`}
            onClick={() => setTab(MEDIA_TAB.PHOTOS)}
          >
            <ImageIcon size={20} /> Photos
          </button>
          <button
            className={`${styles.tabBtn} ${tab === MEDIA_TAB.VIDEOS ? styles.activeTab : ""
              }`}
            onClick={() => setTab(MEDIA_TAB.VIDEOS)}
          >
            <Video size={20} /> Videos
          </button>
        </div>

        {tab === MEDIA_TAB.PHOTOS && <ImageGallery />}
        {tab === MEDIA_TAB.VIDEOS && <VideoGallery />}
      </div>
    </section>
  );
}
