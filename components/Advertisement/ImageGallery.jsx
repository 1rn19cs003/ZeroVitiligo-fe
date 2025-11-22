"use client";
import Image from "next/image";
import styles from "./styles.module.css";

export default function ImageGallery({ images, onImageClick }) {
  return (
    <div>
      <h2 className={styles.sectionTitle}>Treatment Gallery</h2>
      <p className={styles.sectionSubtitle}>
        View real patient results and treatment progress
      </p>
      <div className={styles.masonryGrid}>
        {images.map(image => (
          <div
            key={image.id}
            className={styles.imageCard}
            onClick={() => onImageClick(image)}
          >
            <Image
              src={image.url}
              alt={image.caption}
              width={430}
              height={550}
              blurDataURL="/placeholder.png"
              loading="lazy"
              className={styles.gridImage}
            />

            <div className={styles.imageOverlay}>
              <p className={styles.imageCaption}>{image.caption}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
