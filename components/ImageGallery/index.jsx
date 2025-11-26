"use client";

import Image from "next/image";
import styles from "./styles.module.css";
import { IMAGES_DATA } from "@/lib/constants";
import { X } from "lucide-react";
import { useState } from "react";

export default function ImageGallery() {
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
        <div className={styles.gallerySection}>
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

            {lightboxImage && (
                <div className={styles.lightbox} onClick={closeLightbox}>
                    <button className={styles.lightboxClose} onClick={closeLightbox}>
                        <X size={32} />
                    </button>
                    <div
                        className={styles.lightboxContent}
                        onClick={(e) => e.stopPropagation()}
                    >
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
        </div>
    );
}
