"use client";
import { useState } from "react";
import { X, ImageIcon, Video as VideoIcon } from "lucide-react";
import Image from "next/image";
import styles from "./styles.module.css";
import { IMAGES_DATA, VIDEO_DATA } from "@/lib/constants";
import PhotosGallery from "./photos";
import VideosGallery from "./videos";
import { useYouTubeVideoDetails } from "../../hooks/useYoutubeVideos";

export default function Advertisement() {
  const [tab, setTab] = useState("PHOTOS");
  const [activeVideo, setActiveVideo] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);

  const videoUrls = VIDEO_DATA.map(video => video.youtubeUrl);
  const videoQueries = useYouTubeVideoDetails(videoUrls);

  const openLightbox = img => {
    setLightboxImage(img);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setLightboxImage(null);
    document.body.style.overflow = "auto";
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
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
            <VideoIcon size={20} /> Videos
          </button>
        </div>
        {tab === "PHOTOS" && (
          <div>
            <h2 className={styles.sectionTitle}>Treatment Gallery</h2>
            <p className={styles.sectionSubtitle}>
              View real patient results and treatment progress
            </p>
            <PhotosGallery images={IMAGES_DATA} onOpenLightbox={openLightbox} />
          </div>
        )}
        {tab === "VIDEOS" && (
          <div>
            <h2 className={styles.sectionTitle}>Treatment Videos</h2>
            <p className={styles.sectionSubtitle}>
              Learn more about vitiligo treatment and patient experiences
            </p>
            <VideosGallery
              videos={VIDEO_DATA}
              videoQueries={videoQueries}
              activeVideo={activeVideo}
              setActiveVideo={setActiveVideo}
            />
          </div>
        )}
      </div>
      {lightboxImage && (
        <div className={styles.lightbox} onClick={closeLightbox}>
          <button className={styles.lightboxClose} onClick={closeLightbox}>
            <X size={32} />
          </button>
          <div className={styles.lightboxContent} onClick={e => e.stopPropagation()}>
            <Image
              src={lightboxImage.url}
              alt={lightboxImage.caption}
              className={styles.lightboxImage}
              width={1200}
              height={800}
              loading="eager"
            />
            <p className={styles.lightboxCaption}>{lightboxImage.caption}</p>
          </div>
        </div>
      )}
    </section>
  );
}
