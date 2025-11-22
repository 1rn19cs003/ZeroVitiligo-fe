import Image from "next/image";
import styles from "./styles.module.css";

export default function PhotosGallery({ images, onOpenLightbox }) {
    return (
        <div className={styles.masonryGrid}>
            {images.map(image => (
                <div
                    key={image.id}
                    className={styles.imageCard}
                    onClick={() => onOpenLightbox(image)}
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
    );
}
