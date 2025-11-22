"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { X, ImageIcon, Video } from "lucide-react";
import styles from "./styles.module.css";
import { IMAGES_DATA, VIDEO_DATA, MEDIA_TAB } from "@/lib/constants";
import { getEmbedUrl, getVideoId, truncateText } from "@/Utils/youtube.utils";
import { getYouTubeOEmbed } from "@/Utils/youtube.utils";

export default function Advertisement() {
  const [tab, setTab] = useState(MEDIA_TAB.VIDEOS);
  const [activeVideo, setActiveVideo] = useState(null);
  const [videoDetails, setVideoDetails] = useState({});
  const [loading, setLoading] = useState({});
  const [fetchErrors, setFetchErrors] = useState({});
  const [lightboxImage, setLightboxImage] = useState(null);
  const hasFetchedRef = useRef(false);


  useEffect(() => {
    if (hasFetchedRef.current) return;

    const fetchAll = async () => {
      for (const video of VIDEO_DATA) {
        const videoId = getVideoId(video.youtubeUrl);
        if (videoId && !videoDetails[videoId] && !fetchErrors[videoId]) {
          try {
            setLoading(prev => ({ ...prev, [videoId]: true }));
            const response = await getYouTubeOEmbed(video.youtubeUrl);
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
          await new Promise(resolve => setTimeout(resolve, 400)); // debounce
        }
      }
      hasFetchedRef.current = true;
    };

    fetchAll();
  }, []);

  const getVideoInfo = (video) => {
    const videoId = getVideoId(video.youtubeUrl);
    const details = videoDetails[videoId];
    if (loading[videoId])
      return { title: "Loading...", thumbnail: video.thumbnail, isLoading: true };
    if (fetchErrors[videoId])
      return { title: "Not available", thumbnail: video.thumbnail, hasError: true };
    if (details)
      return {
        title: details.title,
        author: details.author_name,
        thumbnail: details.thumbnail_url,
        html: details.html,
        isFetched: true
      };
    return { title: "Loading...", thumbnail: video.thumbnail, isLoading: true };
  };

  const openLightbox = (img) => {
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
            className={`${styles.tabBtn} ${tab === MEDIA_TAB.PHOTOS ? styles.activeTab : ""}`}
            onClick={() => setTab(MEDIA_TAB.PHOTOS)}
          >
            <ImageIcon size={20} /> Photos
          </button>
          <button
            className={`${styles.tabBtn} ${tab === MEDIA_TAB.VIDEOS ? styles.activeTab : ""}`}
            onClick={() => setTab(MEDIA_TAB.VIDEOS)}
          >
            <Video size={20} /> Videos
          </button>
        </div>

        {tab === MEDIA_TAB.PHOTOS && (
          <div>
            <h2 className={styles.sectionTitle}>Treatment Gallery</h2>
            <p className={styles.sectionSubtitle}>View real patient results and treatment progress</p>
            <div className={styles.masonryGrid}>
              {IMAGES_DATA.map((image) => (
                <div
                  key={image.id}
                  className={styles.imageCard}
                  onClick={() => openLightbox(image)}
                >
                  <Image
                    src={image.url}
                    alt={image.caption}
                    className={styles.gridImage}
                    width={430}
                    height={430}
                    sizes="(max-width: 680px) 100vw, 430px"
                    loading="lazy"
                  />
                  <div className={styles.imageOverlay}>
                    <p className={styles.imageCaption}>{image.caption}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === MEDIA_TAB.VIDEOS && (
          <div>
            <h2 className={styles.sectionTitle}>Treatment Videos</h2>
            <p className={styles.sectionSubtitle}>Learn more about vitiligo treatment and patient experiences</p>
            <div className={styles.videoGrid}>
              {VIDEO_DATA.map((video) => {
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
                          {/* Use iframe (manual), or dangerouslySetInnerHTML for oEmbed html */}
                          <iframe
                            src={embedUrl}
                            title={videoInfo.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className={styles.youtubeIframe}
                          />
                        </div>
                      ) : (
                        <div
                          className={styles.videoThumbnail}
                          onClick={() =>
                            !videoInfo.isLoading &&
                            !videoInfo.hasError && setActiveVideo(video.id)
                          }
                        >
                          <Image
                            src={videoInfo.thumbnail}
                            alt={videoInfo.title}
                            width={430}
                            height={242}
                            sizes="(max-width: 680px) 100vw, 430px"
                            loading="lazy"
                            className={styles.thumbnailImage}
                          />
                          {!videoInfo.hasError && (
                            <div className={styles.playButton}>
                              <svg width="64" height="64" viewBox="0 0 24 24" fill="white">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                          )}
                          {videoInfo.isLoading && (
                            <div className={styles.loadingPlaceholder}>Loading video...</div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className={styles.videoInfo}>
                      <h3 className={styles.videoTitle}>{truncateText(videoInfo.title, 60)}</h3>
                      <p className={styles.videoDescription}>
                        {videoInfo.author ? `By ${videoInfo.author}` : ""}
                      </p>
                    </div>
                    {activeVideo !== video.id &&
                      !videoInfo.isLoading &&
                      !videoInfo.hasError && (
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
            />
            <p className={styles.lightboxCaption}>{lightboxImage.caption}</p>
          </div>
        </div>
      )}
    </section>
  );
}
