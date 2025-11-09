"use client";

import { useState, useEffect, useRef } from 'react';
import styles from './styles.module.css';
import { formatDuration, formatViews, getEmbedUrl, getThumbnailUrl, getVideoId, getYouTubeVideoDetails, truncateText } from '@/Utils/youtube.utils';
import {  IMAGES_DATA,VIDEO_DATA } from '@/lib/constants';
import { X } from 'lucide-react';
import Image from 'next/image';


export default function Advertisement() {
    const [activeVideo, setActiveVideo] = useState(null);
    const [videoDetails, setVideoDetails] = useState({});
    const [loading, setLoading] = useState({});
    const [fetchErrors, setFetchErrors] = useState({});
    const [lightboxImage, setLightboxImage] = useState(null);
    const hasFetchedRef = useRef(false);

    useEffect(() => {
        if (hasFetchedRef.current) return;

        const fetchAllVideoDetails = async () => {
            for (const video of VIDEO_DATA) {
                const videoId = getVideoId(video.youtubeUrl);

                if (videoId && !videoDetails[videoId] && !fetchErrors[videoId]) {
                    try {
                        setLoading(prev => ({ ...prev, [videoId]: true }));
                        const response = await getYouTubeVideoDetails(videoId);

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
                        setFetchErrors(prev => ({
                            ...prev,
                            [videoId]: error.message
                        }));
                    } finally {
                        setLoading(prev => ({ ...prev, [videoId]: false }));
                    }

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

    const openLightbox = (image) => {
        setLightboxImage(image);
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        setLightboxImage(null);
        document.body.style.overflow = 'auto';
    };

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
                {/* Images Section */}
                <div className={styles.mediaSection}>
                    <h2 className={styles.sectionTitle}>Treatment Gallery</h2>
                    <p className={styles.sectionSubtitle}>
                        View real patient results and treatment progress
                    </p>

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
                                    width={0}
                                    height={0}
                                    priority
                                />
                                <div className={styles.imageOverlay}>
                                    <p className={styles.imageCaption}>{image.caption}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Videos Section */}
                <div className={styles.mediaSection}>
                    <h2 className={styles.sectionTitle}>Treatment Videos</h2>
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
                                                        <Image
                                                            src={videoInfo.thumbnail}
                                                            alt={videoInfo.title}
                                                            width={0}
                                                            height={0}
                                                            priority
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

                                    {activeVideo !== video.id && !videoInfo.isLoading && !videoInfo.hasError && (
                                        <button
                                            className={styles.watchButton}
                                            onClick={() => handleVideoClick(video.id)}
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
            </div>

            {/* Lightbox Modal */}
            {lightboxImage && (
                <div className={styles.lightbox} onClick={closeLightbox}>
                    <button className={styles.lightboxClose} onClick={closeLightbox}>
                        <X size={32} />
                    </button>
                    <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
                        <Image
                            src={lightboxImage.url}
                            alt={lightboxImage.caption}
                            className={styles.lightboxImage}
                            priority
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