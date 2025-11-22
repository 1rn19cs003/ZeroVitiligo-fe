import Image from "next/image";
import styles from "./styles.module.css";
import {
    getEmbedUrl,
    formatDuration,
    formatViews,
    truncateText
} from "@/Utils/youtube.utils";

export default function VideosGallery({
    videos,
    videoQueries,
    activeVideo,
    setActiveVideo
}) {
    return (
        <div className={styles.videoGrid}>
            {videos.map((video, idx) => {
                const embedUrl = getEmbedUrl(video.youtubeUrl);
                const { isLoading, isError, data, refetch } = videoQueries[idx];
                let info;
                if (isLoading) {
                    info = {
                        title: "Loading...",
                        description: "",
                        duration: "--:--",
                        views: "--",
                        thumbnail: video.thumbnail,
                        isLoading: true
                    };
                } else if (isError || !data) {
                    info = {
                        title: "Not available",
                        description: "Failed to fetch video details",
                        duration: "--:--",
                        views: "--",
                        thumbnail: video.thumbnail,
                        hasError: true
                    };
                } else {
                    info = {
                        title: data.title,
                        description: data.description,
                        duration: formatDuration(data.duration),
                        views: formatViews(data.views),
                        thumbnail: data.thumbnail
                    };
                }

                return (
                    <div
                        key={video.id}
                        className={`${styles.videoCard} ${activeVideo === video.id ? styles.active : ""} ${info.hasError ? styles.errorCard : ""}`}
                    >
                        <div className={styles.videoContainer}>
                            {activeVideo === video.id ? (
                                <div className={styles.youtubePlayer}>
                                    <iframe
                                        src={embedUrl}
                                        title={info.title}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        className={styles.youtubeIframe}
                                    />
                                </div>
                            ) : (
                                <div
                                    className={styles.videoThumbnail}
                                    onClick={() => !info.isLoading && !info.hasError && setActiveVideo(video.id)}
                                >
                                    <Image
                                        src={info.thumbnail || "/thumbnail-fallback.jpg"}
                                        alt={info.title}
                                        width={430}
                                        height={242}
                                        sizes="(max-width: 680px) 100vw, 430px"
                                        loading="lazy"
                                        className={styles.thumbnailImage}
                                    />
                                    {!info.hasError && (
                                        <>
                                            <div className={styles.playButton}>
                                                <svg width="64" height="64" viewBox="0 0 24 24" fill="white">
                                                    <path d="M8 5v14l11-7z" />
                                                </svg>
                                            </div>
                                            <div className={styles.videoDuration}>{info.duration}</div>
                                        </>
                                    )}
                                    {info.isLoading && (
                                        <div className={styles.loadingPlaceholder}>Loading video...</div>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className={styles.videoInfo}>
                            <h3 className={styles.videoTitle}>{truncateText(info.title, 60)}</h3>
                            <p className={styles.videoDescription}>{truncateText(info.description, 120)}</p>
                            <div className={styles.videoMeta}>
                                <span className={styles.views}>{info.views} views</span>
                                <span className={styles.duration}>{info.duration}</span>
                            </div>
                        </div>
                        {activeVideo !== video.id && !info.isLoading && !info.hasError && (
                            <button
                                className={styles.watchButton}
                                onClick={() => setActiveVideo(video.id)}
                            >
                                Watch Now
                            </button>
                        )}
                        {info.hasError && (
                            <button className={styles.retryButton} onClick={refetch}>
                                Retry
                            </button>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
