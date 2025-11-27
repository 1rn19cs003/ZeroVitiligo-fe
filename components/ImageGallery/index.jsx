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
                            alt={`Treatment image ${image.id}`}
                            className={styles.gridImage}
                            width={430}
                            height={430}
                            sizes="(max-width: 680px) 100vw, 430px"
                            loading="lazy"
                        />
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
                            alt={`Treatment image ${lightboxImage.id}`}
                            className={styles.lightboxImage}
                            width={1200}
                            height={800}
                            loading="eager"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
