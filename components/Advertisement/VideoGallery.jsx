"use client";
import Image from "next/image";
import styles from "./styles.module.css";
import { getEmbedUrl, getVideoId, isShortUrl, truncateText } from "@/Utils/youtube.utils";

export default function VideoGallery({
  videos,
  videoDetails,
  loading,
  fetchErrors,
  activeVideo,
  onSetActiveVideo,
  onRetry,
  getVideoInfo,
  SortComponent
}) {
  // Separate videos and shorts
  const shorts = videos.filter(v => isShortUrl(v.youtubeUrl));
  const regularVideos = videos.filter(v => !isShortUrl(v.youtubeUrl));

  // Render card (shared between two sections)
  function renderVideoCard(video, isShortSection = false) {
    const youtubeId = getVideoId(video.youtubeUrl);
    const embedUrl = getEmbedUrl(video.youtubeUrl);
    const videoInfo = getVideoInfo(video);

    return (
      <div
        key={video.id}
        className={
          `${styles.videoCard} ` +
          (activeVideo === video.id ? styles.active : "") +
          (videoInfo.hasError ? ` ${styles.errorCard}` : "")
        }
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
              />
            </div>
          ) : (
            <div
              className={styles.videoThumbnail}
              onClick={() => !videoInfo.isLoading && !videoInfo.hasError && onSetActiveVideo(video.id)}
            >
              <Image
                src={videoInfo.thumbnail}
                alt={videoInfo.title}
                width={0}
                height={0}
                sizes="(max-width: 680px) 100vw, 430px"
                loading="lazy"
                className={styles.thumbnailImage}
              />
              {!videoInfo.hasError && (
                <>
                  <div className={styles.playButton}>
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="white">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  <div className={styles.videoDuration}>{videoInfo.duration}</div>
                </>
              )}
              {videoInfo.isLoading &&
                <div className={styles.loadingPlaceholder}>Loading video...</div>
              }
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
            onClick={() => onSetActiveVideo(video.id)}
          >
            Watch Now
          </button>
        )}
        {videoInfo.hasError && (
          <button
            className={styles.retryButton}
            onClick={() => onRetry(youtubeId)}
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={styles.flexVideoLayout}>
      <aside className={styles.sortPanel}>
        {SortComponent ? <SortComponent /> : (
          <div className={styles.sortPlaceholder}>
            <span>Sort/Filter<br />goes here</span>
          </div>
        )}
      </aside>
      <div className={styles.videoPanel}>
        {/* Regular Videos */}
        {regularVideos.length > 0 && (
          <>
            <h2 className={styles.sectionTitle}>Videos</h2>
            <div className={styles.videoGrid}>
              {regularVideos.map(video => renderVideoCard(video, false))}
            </div>
          </>
        )}

        {/* Shorts Section */}
        {shorts.length > 0 && (
          <>
            <h2 className={styles.sectionTitle}>Shorts</h2>
            <div className={styles.shortsGrid}>
              {shorts.map(video => renderVideoCard(video, true))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
