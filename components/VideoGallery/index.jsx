"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./styles.module.css";
import { ROLES } from "@/lib/constants";
import {
    getEmbedUrl,
    truncateText,
    getYouTubeOEmbed,
} from "@/Utils/youtube.utils";
import { useAddYoutubeVideo, useDeleteYoutubeVideo, useYoutubeVideos } from "../../hooks/useYoutube";
import Loader from "../Loader";
import { useQueries } from "@tanstack/react-query";
import { useUserStore } from "../../store/useDoctorStore";
import ConfirmDialog from '../ConfirmDialog';
import { Trash2 } from 'lucide-react';
import axios from "axios";

export default function VideoGallery() {
    const [activeVideo, setActiveVideo] = useState(null);
    const [inputUrl, setInputUrl] = useState("");
    const [addError, setAddError] = useState("");
    const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, videoId: null, videoTitle: '' });
    const { role } = useUserStore();

    const isAdmin = role === ROLES.ADMIN;

    const {
        data: videoList,
        isLoading: urlsLoading,
        isError: urlsError,
        refetch,
    } = useYoutubeVideos();
    const videoUrls = videoList?.map((v) => v.url) ?? [];

    const videoQueries = useQueries({
        queries: videoUrls.map((url) => ({
            queryKey: ["youtube-oembed", url],
            queryFn: async () => {
                const endpoint = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
                const res = await axios.get(endpoint);
                return res.data;
            },
            enabled: !!url,
            staleTime: 5 * 60 * 1000,
            gcTime: 10 * 60 * 1000,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
        })),
    });

    const { mutate: addVideo, isLoading: isAdding } = useAddYoutubeVideo();
    const { mutate: deleteVideo } = useDeleteYoutubeVideo();

    const handleAddUrl = async () => {
        if (!inputUrl.trim()) {
            setAddError("URL required");
            return;
        }
        if (videoUrls.includes(inputUrl.trim())) {
            setAddError("URL already added");
            return;
        }
        setAddError("");

        let oembed;
        try {
            oembed = await getYouTubeOEmbed(inputUrl.trim());
        } catch {
            setAddError("Could not fetch info from YouTube");
            return;
        }
        if (!oembed || !oembed.title) {
            setAddError("No video info found for that URL");
            return;
        }

        addVideo(
            {
                url: inputUrl.trim(),
                title: oembed.title ?? "",
                author: oembed.author_name ?? "",
                thumbnail: oembed.thumbnail_url ?? "",
            },
            {
                onSuccess: () => {
                    setAddError("");
                    setInputUrl("");
                    refetch();
                },
                onError: (error) => {
                    const message =
                        error?.response?.data?.error ?? "Failed to add video";
                    setAddError(message);
                },
            }
        );
    };

    const handleDeleteVideo = (videoId, videoTitle) => {
        setDeleteConfirm({ isOpen: true, videoId, videoTitle });
    };

    const confirmDelete = async () => {
        if (deleteConfirm.videoId) {
            deleteVideo(deleteConfirm.videoId);
            setDeleteConfirm({ isOpen: false, videoId: null, videoTitle: '' });
        }
    };

    const videoCards = videoUrls.map((url, idx) => {
        const {
            data,
            isLoading,
            isError,
            refetch: refetchOEmbed,
        } = videoQueries[idx];
        const embedUrl = getEmbedUrl(url);

        if (isLoading && urlsLoading) {
            return (
                <div key={url} className={`${styles.videoCard} ${styles.loadingCard}`}>
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
                <div key={url} className={`${styles.videoCard} ${styles.errorCard}`}>
                    <div className={styles.videoContainer}>
                        <div className={styles.videoThumbnail}>
                            <div className={styles.errorText}>Failed to load</div>
                        </div>
                    </div>
                    <button className={styles.retryButton} onClick={refetchOEmbed}>
                        Retry
                    </button>
                </div>
            );
        }

        return (
            <div
                key={url}
                className={`${styles.videoCard} ${activeVideo === url ? styles.active : ""
                    }`}
            >
                <div className={styles.videoContainer}>
                    {activeVideo === url ? (
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
                            onClick={() => setActiveVideo(url)}
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
                {isAdmin && (
                    <button
                        className={styles.deleteVideoButton}
                        onClick={(e) => {
                            e.stopPropagation();
                            const video = videoList.find(v => v.url === url);
                            handleDeleteVideo(video.id, data.title);
                        }}
                        title="Delete video"
                    >
                        <Trash2 size={18} />
                    </button>
                )}
                {activeVideo !== url && (
                    <button
                        className={styles.watchButton}
                        onClick={() => setActiveVideo(url)}
                    >
                        Watch Now
                    </button>
                )}
            </div>
        );
    });

    return (
        <div className={styles.videoSection}>
            <h2 className={styles.sectionTitle}>Treatment Videos</h2>
            <p className={styles.sectionSubtitle}>
                Learn more about vitiligo treatment and patient experiences
            </p>

            {isAdmin && (
                <div className={styles.adminControls}>
                    {addError && <span className={styles.addError}>{addError}</span>}
                    <form
                        onSubmit={async (e) => {
                            e.preventDefault();
                            await handleAddUrl();
                        }}
                        className={styles.addForm}
                    >
                        <input
                            type="url"
                            value={inputUrl}
                            onChange={(e) => setInputUrl(e.target.value)}
                            placeholder="YouTube video or shorts URL"
                            className={styles.addInput}
                            required
                            disabled={isAdding}
                        />
                        <button
                            type="submit"
                            className={styles.addButton}
                            disabled={isAdding}
                        >
                            {isAdding ? "Adding..." : "Add Video"}
                        </button>
                    </form>
                </div>
            )}

            {urlsLoading && <Loader message="Loading videos..." />}
            {urlsError && (
                <div className={styles.errorText}>
                    Error loading videos.{" "}
                    <button onClick={() => refetch()} className={styles.retryButton}>
                        Retry
                    </button>
                </div>
            )}
            {!urlsLoading && !urlsError && (
                <div className={styles.videoGrid}>{videoCards}</div>
            )}

            <ConfirmDialog
                isOpen={deleteConfirm.isOpen}
                onClose={() => setDeleteConfirm({ isOpen: false, videoId: null, videoTitle: '' })}
                onConfirm={confirmDelete}
                title="Delete Video"
                message={`Are you sure you want to delete "${deleteConfirm.videoTitle}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                variant="danger"
            />
        </div>
    );
}
