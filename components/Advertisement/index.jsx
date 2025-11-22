"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ImageIcon, Video } from "lucide-react";
import styles from "./styles.module.css";
import { IMAGES_DATA, VIDEO_DATA, MEDIA_TAB } from "@/lib/constants";
import { getEmbedUrl, truncateText } from "@/Utils/youtube.utils";
import { useYouTubeOEmbed } from '../../hooks/usePatients';
import Loader from '../Loader';

export default function Advertisement() {
  const [tab, setTab] = useState(MEDIA_TAB.VIDEOS);
  const [activeVideo, setActiveVideo] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);

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
                    src={image?.url ?? ""}
                    alt={image?.caption ?? ""}
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
              {VIDEO_DATA.map(video => {
                const { data, isLoading, isError, refetch } = useYouTubeOEmbed(video.youtubeUrl);

                if (isLoading) {
                  return (
                    <div
                      key={video.id}
                      className={`${styles.videoCard} ${styles.loadingCard}`}
                    >
                      <div className={styles.videoContainer}>
                        <div className={styles.videoThumbnail}>
                          <div className={styles.loaderContainer}>
                            <Loader message="Loading video..." />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }

                if (isError || !data) {
                  return (
                    <div
                      key={video.id}
                      className={`${styles.videoCard} ${styles.errorCard}`}
                    >
                      <div className={styles.videoContainer}>
                        <div className={styles.videoThumbnail}>
                          <Image
                            src={video.thumbnail}
                            alt="Not available"
                            width={430}
                            height={242}
                            sizes="(max-width: 680px) 100vw, 430px"
                            className={styles.thumbnailImage}
                            loading="lazy"
                          />
                          <div className={styles.errorText}>Failed to load</div>
                        </div>
                      </div>
                      <button className={styles.retryButton} onClick={refetch}>
                        Retry
                      </button>
                    </div>
                  );
                }

                const embedUrl = getEmbedUrl(video.youtubeUrl);
                return (
                  <div
                    key={video.id}
                    className={`${styles.videoCard} ${activeVideo === video.id ? styles.active : ""}`}
                  >
                    <div className={styles.videoContainer}>
                      {activeVideo === video.id ? (
                        <div className={styles.youtubePlayer}>
                          <iframe
                            src={embedUrl}
                            title={data.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className={styles.youtubeIframe}
                          />
                        </div>
                      ) : (
                        <div
                          className={styles.videoThumbnail}
                          onClick={() => setActiveVideo(video.id)}
                        >
                          <Image
                            src={data.thumbnail_url}
                            alt={data.title}
                            width={430}
                            height={242}
                            sizes="(max-width: 680px) 100vw, 430px"
                            loading="lazy"
                            className={styles.thumbnailImage}
                          />
                          <div className={styles.playButton}>
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="white">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className={styles.videoInfo}>
                      <h3 className={styles.videoTitle}>{truncateText(data.title, 60)}</h3>
                      <p className={styles.videoDescription}>
                        {data.author_name ? `By ${data.author_name}` : ""}
                      </p>
                    </div>
                    {activeVideo !== video.id && (
                      <button
                        className={styles.watchButton}
                        onClick={() => setActiveVideo(video.id)}
                      >
                        Watch Now
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
