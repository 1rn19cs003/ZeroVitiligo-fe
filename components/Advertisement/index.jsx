"use client";
import { useState, useRef, useEffect } from "react";
import { X, ImageIcon, Video } from "lucide-react";
import styles from "./styles.module.css";
import { IMAGES_DATA, VIDEO_DATA } from "@/lib/constants";
import {
  getYouTubeVideoDetails,
  getVideoId,
  formatDuration,
  formatViews
} from "@/Utils/youtube.utils";
import ImageGallery from "./ImageGallery";
import VideoGallery from "./VideoGallery";
import Image from "next/image";

export default function Advertisement() {
  const [tab, setTab] = useState("PHOTOS");
  const [activeVideo, setActiveVideo] = useState(null);
  const [videoDetails, setVideoDetails] = useState({});
  const [loading, setLoading] = useState({});
  const [fetchErrors, setFetchErrors] = useState({});
  const [lightboxImage, setLightboxImage] = useState(null);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    async function fetchAll() {
      const ids = VIDEO_DATA.map(v => getVideoId(v.youtubeUrl));

      const results = await Promise.all(
        ids.map(id =>
          getYouTubeVideoDetails(id)
            .then(res => ({ id, res }))
            .catch(err => ({ id, err }))
        )
      );

      const newDetails = {};
      const newErrors = {};

      results.forEach(({ id, res, err }) => {
        if (res) newDetails[id] = res;
        if (err) newErrors[id] = err.message;
      });

      setVideoDetails(newDetails);
      setFetchErrors(newErrors);
    }

    fetchAll();
  }, []);

  const getVideoInfo = (video) => {
    const videoId = getVideoId(video.youtubeUrl);
    const details = videoDetails[videoId];
    if (loading[videoId]) {
      return { title: "Loading...", duration: "--:--", views: "--", description: "", thumbnail: video.thumbnail, isLoading: true };
    }
    if (fetchErrors[videoId]) {
      return { title: "Not available", description: fetchErrors[videoId], duration: "--:--", views: "--", thumbnail: video.thumbnail, hasError: true };
    }
    if (details) {
      return {
        title: details.title,
        description: details.description,
        duration: formatDuration(details.duration),
        views: formatViews(details.views),
        thumbnail: details.thumbnail,
        isFetched: true
      };
    }
    return { title: "Loading...", duration: "--:--", views: "--", description: "", thumbnail: video.thumbnail, isLoading: true };
  };

  const openLightbox = (img) => {
    setLightboxImage(img);
    document.body.style.overflow = 'hidden';
  };
  const closeLightbox = () => {
    setLightboxImage(null);
    document.body.style.overflow = 'auto';
  };

  const handleRetry = (youtubeId) => {
    setFetchErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[youtubeId];
      return newErrors;
    });
    hasFetchedRef.current = false;
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
            <Video size={20} /> Videos
          </button>
        </div>

        {tab === "PHOTOS" && (
          <ImageGallery images={IMAGES_DATA} onImageClick={openLightbox} />
        )}
        {tab === "VIDEOS" && (
          <VideoGallery
            videos={VIDEO_DATA}
            videoDetails={videoDetails}
            loading={loading}
            fetchErrors={fetchErrors}
            activeVideo={activeVideo}
            onSetActiveVideo={setActiveVideo}
            onRetry={handleRetry}
            getVideoInfo={getVideoInfo}
            // SortComponent={null}
          />
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
              loading="lazy"
              width={0}
              height={0}
            />
            <p className={styles.lightboxCaption}>{lightboxImage.caption}</p>
          </div>
        </div>
      )}
    </section>
  );
}
