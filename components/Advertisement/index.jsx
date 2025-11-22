"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { X, ImageIcon, Video } from "lucide-react";
import styles from "./styles.module.css";
import { IMAGES_DATA, VIDEO_DATA } from "@/lib/constants";
import {
  getEmbedUrl, getVideoId,
  getYouTubeVideoDetails,
  formatDuration,
  formatViews,
  truncateText
} from "@/Utils/youtube.utils";

export default function Advertisement() {
  const [tab, setTab] = useState("PHOTOS");
  const [activeVideo, setActiveVideo] = useState(null);
  const [videoDetails, setVideoDetails] = useState({});
  const [loading, setLoading] = useState({});
  const [fetchErrors, setFetchErrors] = useState({});
  const [lightboxImage, setLightboxImage] = useState(null);
  const hasFetchedRef = useRef(false);

  // Optimized: Fetch video details only when tab is "VIDEOS" and when thumbnails come into view
  useEffect(() => {
    if (tab !== "VIDEOS") return;
    if (hasFetchedRef.current) return;

    const fetchAll = async () => {
      for (const video of VIDEO_DATA) {
        const videoId = getVideoId(video.youtubeUrl);
        if (videoId && !videoDetails[videoId] && !fetchErrors[videoId]) {
          setLoading(prev => ({ ...prev, [videoId]: true }));
          try {
            const response = await getYouTubeVideoDetails(videoId);
            if (response) {
              setVideoDetails(prev => ({ ...prev, [videoId]: response }));
            } else {
              setFetchErrors(prev => ({ ...prev, [videoId]: "Failed to fetch video details" }));
            }
          } catch (error) {
            setFetchErrors(prev => ({ ...prev, [videoId]: error.message }));
          } finally {
            setLoading(prev => ({ ...prev, [videoId]: false }));
          }
        }
      }
      hasFetchedRef.current = true;
    };
    fetchAll();
  }, [tab]); // Run only when Videos tab selected

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

  // Lightbox for images
  const openLightbox = (img) => {
    setLightboxImage(img);
    document.body.style.overflow = 'hidden';
  };
  const closeLightbox = () => {
    setLightboxImage(null);
    document.body.style.overflow = 'auto';
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
          <div>
            <h2 className={styles.sectionTitle}>Treatment Gallery</h2>
            <p className={styles.sectionSubtitle}>View real patient results and treatment progress</p>
            <div className={styles.masonryGrid}>
              {IMAGES_DATA.map((image) => (
                <div key={image.id} className={styles.imageCard} onClick={() => openLightbox(image)}>
                  <Image
                    src={image.url}
                    alt={image.caption}
                    className={styles.gridImage}
                    width={430}
                    height={430}
                    sizes="(max-width: 680px) 100vw, 430px"
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL={image.blurDataUrl || "/blur-placeholder.png"}
                  />
                  <div className={styles.imageOverlay}>
                    <p className={styles.imageCaption}>{image.caption}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "VIDEOS" && (
          <div>
            <h2 className={styles.sectionTitle}>Treatment Videos</h2>
            <p className={styles.sectionSubtitle}>Learn more about vitiligo treatment and patient experiences</p>
            <div className={styles.videoGrid}>
              {VIDEO_DATA.map(video => {
                const youtubeId = getVideoId(video.youtubeUrl);
                const embedUrl = getEmbedUrl(video.youtubeUrl);
                const videoInfo = getVideoInfo(video);
                return (
                  <div
                    key={video.id}
                    className={`${styles.videoCard} ${activeVideo === video.id ? styles.active : ""} ${videoInfo.hasError ? styles.errorCard : ""}`}
                  >
                    <div className={styles.videoContainer}>
                      {activeVideo === video.id ? (
                        <div className={styles.youtubePlayer}>
                          <iframe
                            src={embedUrl}
                            title={videoInfo.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className={styles.youtubeIframe}
                            loading="lazy"
                          />
                        </div>
                      ) : (
                        <div
                          className={styles.videoThumbnail}
                          onClick={() => !videoInfo.isLoading && !videoInfo.hasError && setActiveVideo(video.id)}
                        >
                          <Image
                            src={videoInfo.thumbnail ?? 'src'}
                            alt={videoInfo.title ?? 'alt'}
                            width={430}
                            height={242}
                            sizes="(max-width: 680px) 100vw, 430px"
                            loading="lazy"
                            className={styles.thumbnailImage}
                          />
                          {!videoInfo.hasError && (
                            <>
                              <div className={styles.playButton}>
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z" /></svg>
                              </div>
                              <div className={styles.videoDuration}>{videoInfo.duration}</div>
                            </>
                          )}
                          {videoInfo.isLoading && <div className={styles.loadingPlaceholder}>Loading video...</div>}
                        </div>
                      )}
                    </div>
                    <div className={styles.videoInfo}>
                      <h3 className={styles.videoTitle}>{truncateText(videoInfo.title, 60)}</h3>
                      <p className={styles.videoDescription}>{truncateText(videoInfo.description, 120)}</p>
                      <div className={styles.videoMeta}>
                        <span className={styles.views}>{videoInfo.views} views</span>
                        <span className={styles.duration}>{videoInfo.duration}</span>
                      </div>
                    </div>
                    {activeVideo !== video.id && !videoInfo.isLoading && !videoInfo.hasError && (
                      <button
                        className={styles.watchButton}
                        onClick={() => setActiveVideo(video.id)}
                      >
                        Watch Now
                      </button>
                    )}
                    {videoInfo.hasError && (
                      <button
                        className={styles.retryButton}
                        onClick={() => {
                          setFetchErrors(prev => {
                            const newErrors = { ...prev };
                            delete newErrors[youtubeId];
                            return newErrors;
                          });
                          hasFetchedRef.current = false;
                        }}
                      >
                        Retry
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox for images */}
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
              placeholder="blur"
              blurDataURL={lightboxImage.blurDataUrl || "/blur-placeholder.png"}
            />
            <p className={styles.lightboxCaption}>{lightboxImage.caption}</p>
          </div>
        </div>
      )}
    </section>
  );
}
