"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import styles from "./styles.module.css";

import { VIDEO_DATA } from "@/lib/constants";
import {
    getEmbedUrl,
    getVideoId,
    getYouTubeVideoDetails,
    formatDuration,
    formatViews,
    truncateText
} from "@/Utils/youtube.utils";

import { getCache, setCache } from "@/Utils/youtube.utils";
export default function VideosSection() {
    const [activeVideo, setActiveVideo] = useState(null);
    const [videoDetails, setVideoDetails] = useState({});
    const [loading, setLoading] = useState({});
    const [fetchErrors, setFetchErrors] = useState({});
    const hasFetchedRef = useRef(false);

    useEffect(() => {
        if (hasFetchedRef.current) return;

        const fetchAllVideos = async () => {
            for (const video of VIDEO_DATA) {
                const id = getVideoId(video.youtubeUrl);
                if (!id) continue;

                // 1. Check cache
                const cached = getCache(`yt-${id}`);
                if (cached) {
                    setVideoDetails((prev) => ({ ...prev, [id]: cached }));
                    continue; // Skip API call
                }

                setLoading((prev) => ({ ...prev, [id]: true }));

                try {
                    const response = await getYouTubeVideoDetails(id);

                    if (response) {
                        setVideoDetails((prev) => ({ ...prev, [id]: response }));

                        // 2. Save to cache (24 hours)
                        setCache(`yt-${id}`, response, 1440);
                    } else {
                        setFetchErrors((prev) => ({ ...prev, [id]: "Unable to fetch" }));
                    }
                } catch (err) {
                    setFetchErrors((prev) => ({ ...prev, [id]: err.message }));
                } finally {
                    setLoading((prev) => ({ ...prev, [id]: false }));
                }
            }

            hasFetchedRef.current = true;
        };

        fetchAllVideos();
    }, []);

    // Fetch once when videos tab is opened
    // useEffect(() => {
    //     if (hasFetchedRef.current) return;

    //     const fetchAllVideos = async () => {
    //         for (const video of VIDEO_DATA) {
    //             const id = getVideoId(video.youtubeUrl);
    //             if (!id) continue;

    //             setLoading((prev) => ({ ...prev, [id]: true }));

    //             try {
    //                 const response = await getYouTubeVideoDetails(id);
    //                 if (response) {
    //                     setVideoDetails((prev) => ({ ...prev, [id]: response }));
    //                 } else {
    //                     setFetchErrors((prev) => ({ ...prev, [id]: "Unable to fetch" }));
    //                 }
    //             } catch (err) {
    //                 setFetchErrors((prev) => ({ ...prev, [id]: err.message }));
    //             } finally {
    //                 setLoading((prev) => ({ ...prev, [id]: false }));
    //             }
    //         }
    //         hasFetchedRef.current = true;
    //     };

    //     fetchAllVideos();
    // }, []);

    const getInfo = (video) => {
        const id = getVideoId(video.youtubeUrl);

        if (loading[id])
            return { title: "Loading...", duration: "--:--", views: "--", description: "", thumbnail: video.thumbnail, loading: true };

        if (fetchErrors[id])
            return { title: "Not available", description: fetchErrors[id], duration: "--:--", views: "--", thumbnail: video.thumbnail, error: true };

        const d = videoDetails[id];
        if (!d)
            return { title: "Loading...", duration: "--:--", views: "--", description: "", thumbnail: video.thumbnail, loading: true };

        return {
            title: d.title,
            description: d.description,
            duration: formatDuration(d.duration),
            views: formatViews(d.views),
            thumbnail: d.thumbnail,
        };
    };

    return (
        <>
            <h2 className={styles.sectionTitle}>Treatment Videos</h2>
            <p className={styles.sectionSubtitle}>Learn more about vitiligo treatment and patient experiences</p>

            <div className={styles.videoGrid}>
                {VIDEO_DATA.map((video) => {
                    const videoId = getVideoId(video.youtubeUrl);
                    const embedUrl = getEmbedUrl(video.youtubeUrl);
                    const info = getInfo(video);

                    return (
                        <div
                            key={video.id}
                            className={`${styles.videoCard} ${info.error ? styles.errorCard : ""}`}
                        >
                            <div className={styles.videoContainer}>
                                {activeVideo === video.id ? (
                                    <iframe
                                        src={embedUrl}
                                        title={info.title}
                                        className={styles.youtubeIframe}
                                        allowFullScreen
                                        loading="lazy"
                                    />
                                ) : (
                                    <div
                                        className={styles.videoThumbnail}
                                        onClick={() => !info.loading && !info.error && setActiveVideo(video.id)}
                                    >
                                        <Image
                                            src={info?.thumbnail ?? "src"}
                                            alt={info?.title ?? "alt"}
                                            width={430}
                                            height={242}
                                            className={styles.thumbnailImage}
                                            loading="lazy"
                                        />

                                        {!info.error && (
                                            <>
                                                <div className={styles.playButton}>
                                                    ▶
                                                </div>
                                                <div className={styles.videoDuration}>{info.duration}</div>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className={styles.videoInfo}>
                                <h3 className={styles.videoTitle}>{truncateText(info.title, 60)}</h3>
                                <p className={styles.videoDescription}>{truncateText(info.description, 120)}</p>
                                <div className={styles.videoMeta}>
                                    <span>{info.views} views</span>
                                    <span>{info.duration}</span>
                                </div>
                            </div>

                            {!info.loading && !info.error && activeVideo !== video.id && (
                                <button className={styles.watchButton} onClick={() => setActiveVideo(video.id)}>
                                    Watch Now
                                </button>
                            )}

                            {info.error && (
                                <button
                                    className={styles.retryButton}
                                    onClick={() => {
                                        setFetchErrors((prev) => {
                                            const copy = { ...prev };
                                            delete copy[videoId];
                                            return copy;
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
        </>
    );
}
