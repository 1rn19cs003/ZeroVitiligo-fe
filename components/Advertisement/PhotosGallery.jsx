"use client";
import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { IMAGES_DATA } from "@/lib/constants";
import styles from "./styles.module.css";

export default function PhotosSection() {
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
    <>
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
              width={430}
              height={430}
              className={styles.gridImage}
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

      {/* Lightbox */}
      {lightboxImage && (
        <div className={styles.lightbox} onClick={closeLightbox}>
          <button className={styles.lightboxClose} onClick={closeLightbox}>
            <X size={32} />
          </button>

          <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
            <Image
              src={lightboxImage.url}
              alt={lightboxImage.caption}
              width={1200}
              height={800}
              className={styles.lightboxImage}
              placeholder="blur"
              blurDataURL={lightboxImage.blurDataUrl || "/blur-placeholder.png"}
            />
            <p className={styles.lightboxCaption}>{lightboxImage.caption}</p>
          </div>
        </div>
      )}
    </>
  );
}
