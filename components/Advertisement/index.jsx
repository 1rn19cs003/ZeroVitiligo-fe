"use client";

import { useState, useEffect, useRef } from 'react';
import styles from './styles.module.css';
import { formatDuration, formatViews, getEmbedUrl, getThumbnailUrl, getVideoId, getYouTubeVideoDetails, truncateText } from '@/Utils/youtube.utils';
import { VIDEO_DATA } from '@/lib/constants';

export default function Advertisement() {
    const [activeVideo, setActiveVideo] = useState(null);
    const [videoDetails, setVideoDetails] = useState({});
    const [loading, setLoading] = useState({});
    const [fetchErrors, setFetchErrors] = useState({});
    const hasFetchedRef = useRef(false);
    
    useEffect(() => {
        // Prevent multiple fetches
        if (hasFetchedRef.current) return;
        
        const fetchAllVideoDetails = async () => {
            console.log("Fetching details for all videos...");
            
            // Fetch details for all videos
            for (const video of VIDEO_DATA) {
                const videoId = getVideoId(video.youtubeUrl);
                
                if (videoId && !videoDetails[videoId] && !fetchErrors[videoId]) {
                    try {
                        setLoading(prev => ({ ...prev, [videoId]: true }));
                        
                        // Call your YouTube utility function
                        const response = await getYouTubeVideoDetails(videoId);
                        console.log(`Fetched details for ${videoId}:`, response);

                        if (response) {
                            setVideoDetails(prev => ({
                                ...prev,
                                [videoId]: response
                            }));
                        } else {
                            setFetchErrors(prev => ({
                                ...prev,
                                [videoId]: "Failed to fetch video details"
                            }));
                        }
                    } catch (error) {
                        console.error(`Error fetching video ${videoId}:`, error);
                        setFetchErrors(prev => ({
                            ...prev,
                            [videoId]: error.message
                        }));
                    } finally {
                        setLoading(prev => ({ ...prev, [videoId]: false }));
                    }
                    
                    // Add a small delay to avoid hitting API rate limits
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
            }
            
            hasFetchedRef.current = true;
        };

        fetchAllVideoDetails();
    }, []);

    const handleVideoClick = (videoId) => {
        setActiveVideo(videoId === activeVideo ? null : videoId);
    };

    // Get video info - use fetched data or show loading/error state
    const getVideoInfo = (video) => {
        const videoId = getVideoId(video.youtubeUrl);
        const details = videoDetails[videoId];
        const isLoading = loading[videoId];
        const hasError = fetchErrors[videoId];
        
        if (isLoading) {
            return {
                title: "Loading...",
                description: "Fetching video information...",
                duration: "--:--",
                views: "--",
                thumbnail: getThumbnailUrl(video.youtubeUrl),
                isLoading: true
            };
        }
        
        if (hasError) {
            return {
                title: "Video Not Available",
                description: "Unable to load video details. Please try again later.",
                duration: "--:--",
                views: "--",
                thumbnail: getThumbnailUrl(video.youtubeUrl),
                hasError: true
            };
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
        
        return {
            title: "Loading Video...",
            description: "Video information is being loaded...",
            duration: "--:--",
            views: "--",
            thumbnail: getThumbnailUrl(video.youtubeUrl),
            isLoading: true
        };
    };

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <h2 className={styles.sectionTitle}>Medical Treatment Videos</h2>
                <p className={styles.sectionSubtitle}>
                    Learn more about vitiligo treatment and patient experiences
                </p>

                <div className={styles.videoGrid}>
                    {VIDEO_DATA.map((video) => {
                        const youtubeId = getVideoId(video.youtubeUrl);
                        const embedUrl = getEmbedUrl(video.youtubeUrl);
                        const videoInfo = getVideoInfo(video);

                        return (
                            <div
                                key={video.id}
                                className={`${styles.videoCard} ${activeVideo === video.id ? styles.active : ''} ${videoInfo.hasError ? styles.errorCard : ''}`}
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
                                            onClick={() => !videoInfo.isLoading && !videoInfo.hasError && handleVideoClick(video.id)}
                                        >
                                            {videoInfo.isLoading ? (
                                                <div className={styles.loadingPlaceholder}>
                                                    <div className={styles.spinner}></div>
                                                    Loading video...
                                                </div>
                                            ) : (
                                                <>
                                                    <img
                                                        src={videoInfo.thumbnail}
                                                        alt={videoInfo.title}
                                                        className={styles.thumbnailImage}
                                                        onError={(e) => {
                                                            e.target.src = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
                                                        }}
                                                    />
                                                    {!videoInfo.hasError && (
                                                        <>
                                                            <div className={styles.playButton}>
                                                                <svg width="64" height="64" viewBox="0 0 24 24" fill="white">
                                                                    <path d="M8 5v14l11-7z" />
                                                                </svg>
                                                            </div>
                                                            <div className={styles.videoDuration}>
                                                                {videoInfo.duration}
                                                            </div>
                                                        </>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Video Info */}
                                <div className={styles.videoInfo}>
                                    <h3 className={styles.videoTitle} title={videoInfo.title}>
                                        {truncateText(videoInfo.title, 60)}
                                    </h3>
                                    <p className={styles.videoDescription} title={videoInfo.description}>
                                        {truncateText(videoInfo.description, 120)}
                                    </p>
                                    <div className={styles.videoMeta}>
                                        <span className={styles.views}>{videoInfo.views} views</span>
                                        <span className={styles.duration}>{videoInfo.duration}</span>
                                    </div>
                                </div>

                                {/* Watch Button for inactive cards */}
                                {activeVideo !== video.id && !videoInfo.isLoading && !videoInfo.hasError && (
                                    <button
                                        className={styles.watchButton}
                                        onClick={() => handleVideoClick(video.id)}
                                    >
                                        Watch Now
                                    </button>
                                )}

                                {/* Retry button for errored cards */}
                                {videoInfo.hasError && (
                                    <button
                                        className={styles.retryButton}
                                        onClick={() => {
                                            // Reset error and trigger refetch
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
        </section>
    );
}