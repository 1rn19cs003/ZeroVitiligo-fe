"use client";

import { useState } from "react";
import { ImageIcon, Video } from "lucide-react";
import styles from "./styles.module.css";
import { MEDIA_TAB } from "@/lib/constants";
import ImageGallery from "../ImageGallery";
import VideoGallery from "../VideoGallery";
import { useLanguage } from '@/hooks/useLanguage';

export default function Advertisement() {
  const { t } = useLanguage();
  const [tab, setTab] = useState(MEDIA_TAB.PHOTOS);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.tabs}>
          <button
            className={`${styles.tabBtn} ${tab === MEDIA_TAB.PHOTOS ? styles.activeTab : ""
              }`}
            onClick={() => setTab(MEDIA_TAB.PHOTOS)}
          >
            <ImageIcon size={20} /> {t('media.tabs.photos')}
          </button>
          <button
            className={`${styles.tabBtn} ${tab === MEDIA_TAB.VIDEOS ? styles.activeTab : ""
              }`}
            onClick={() => setTab(MEDIA_TAB.VIDEOS)}
          >
            <Video size={20} /> {t('media.tabs.videos')}
          </button>
        </div>

        {tab === MEDIA_TAB.PHOTOS && <ImageGallery />}
        {tab === MEDIA_TAB.VIDEOS && <VideoGallery />}
      </div>
    </section>
  );
}
