"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ImageIcon, Video } from "lucide-react";
import styles from "./styles.module.css";
import { IMAGES_DATA, MEDIA_TAB, ROLES } from "@/lib/constants";
import { getEmbedUrl, truncateText, getYouTubeOEmbed } from "@/Utils/youtube.utils";
import { useAddYoutubeVideo, useYoutubeVideos } from "../../hooks/useYoutube";
import Loader from "../Loader";
import { useQueries } from '@tanstack/react-query';
import { useUserStore } from '../../store/useDoctorStore'


export default function Advertisement() {
  const [tab, setTab] = useState(MEDIA_TAB.VIDEOS);
  const [activeVideo, setActiveVideo] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [inputUrl, setInputUrl] = useState("");
  const [addError, setAddError] = useState("");
  const { role } = useUserStore();

  const isAdmin = role === ROLES.ADMIN;

  const {
    data: videoList,
    isLoading: urlsLoading,
    isError: urlsError,
    refetch,
  } = useYoutubeVideos();
  const videoUrls = videoList?.map(v => v.url) ?? [];

  const videoQueries = useQueries({
    queries: videoUrls.map(url => ({
      queryKey: ['youtube-oembed', url],
      queryFn: () => getYouTubeOEmbed(url),
      enabled: !!url,
    })),
  });
  const { mutate: addVideo, isLoading: isAdding } = useAddYoutubeVideo();

  const openLightbox = (img) => {
    setLightboxImage(img);
    document.body.style.overflow = "hidden";
  };
  const closeLightbox = () => {
    setLightboxImage(null);
    document.body.style.overflow = "auto";
  };

  const handleAddUrl = async () => {
    if (!inputUrl.trim()) {
      setAddError("URL required");
      return;
    }
    const urlPattern = /^https?:\/\/(www\.)?youtube\.com\/(watch\?v=|shorts\/)[\w-]{11}/;
    if (!urlPattern.test(inputUrl.trim())) {
      setAddError("Not a valid YouTube URL");
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
          const message = error?.response?.data?.error ?? "Failed to add video";
          setAddError(message);
        },
      },
    );
  };

  const videoCards = videoUrls.map((url, idx) => {
    const { data, isLoading, isError, refetch: refetchOEmbed } = videoQueries[idx];
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
      <div key={url} className={`${styles.videoCard} ${activeVideo === url ? styles.active : ""}`}>
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
            <div className={styles.videoThumbnail} onClick={() => setActiveVideo(url)}>
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
          <p className={styles.videoDescription}>{data.author_name ? `By ${data.author_name}` : ""}</p>
        </div>
        {activeVideo !== url && (
          <button className={styles.watchButton} onClick={() => setActiveVideo(url)}>
            Watch Now
          </button>
        )}
      </div>
    );
  });

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.tabs}>
          <button className={`${styles.tabBtn} ${tab === MEDIA_TAB.PHOTOS ? styles.activeTab : ""}`} onClick={() => setTab(MEDIA_TAB.PHOTOS)}>
            <ImageIcon size={20} /> Photos
          </button>
          <button className={`${styles.tabBtn} ${tab === MEDIA_TAB.VIDEOS ? styles.activeTab : ""}`} onClick={() => setTab(MEDIA_TAB.VIDEOS)}>
            <Video size={20} /> Videos
          </button>
        </div>

        {tab === MEDIA_TAB.PHOTOS && (
          <div>
            <h2 className={styles.sectionTitle}>Treatment Gallery</h2>
            <p className={styles.sectionSubtitle}>View real patient results and treatment progress</p>
            <div className={styles.masonryGrid}>
              {IMAGES_DATA.map((image) => (
                <div key={image.id} className={styles.imageCard} onClick={() => openLightbox(image)}>
                  <Image src={image.url} alt={image.caption} className={styles.gridImage} width={430} height={430} sizes="(max-width: 680px) 100vw, 430px" loading="lazy" />
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

            {isAdmin && (
              <div>
                {addError && <span className={styles.addError}>{addError}</span>}
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    await handleAddUrl();
                  }}
                  className={styles.addForm}
                >
                  <input type="url" value={inputUrl} onChange={e => setInputUrl(e.target.value)} placeholder="YouTube video or shorts URL" className={styles.addInput} required disabled={isAdding} />
                  <button type="submit" className={styles.addButton} disabled={isAdding}>
                    {isAdding ? "Adding..." : "Add"}
                  </button>
                </form>
              </div>
            )}

            {urlsLoading && <Loader message="Loading videos..." />}
            {urlsError && (
              <div className={styles.errorText}>
                Error loading videos. <button onClick={() => refetch()}>Retry</button>
              </div>
            )}
            {!urlsLoading && !urlsError && <div className={styles.videoGrid}>{videoCards}</div>}
          </div>
        )}
      </div>

      {lightboxImage && (
        <div className={styles.lightbox} onClick={closeLightbox}>
          <button className={styles.lightboxClose} onClick={closeLightbox}>
            <X size={32} />
          </button>
          <div className={styles.lightboxContent} onClick={e => e.stopPropagation()}>
            <Image src={lightboxImage.url} alt={lightboxImage.caption} className={styles.lightboxImage} width={1200} height={800} loading="eager" />
            <p className={styles.lightboxCaption}>{lightboxImage.caption}</p>
          </div>
        </div>
      )}
    </section>
  );
}
