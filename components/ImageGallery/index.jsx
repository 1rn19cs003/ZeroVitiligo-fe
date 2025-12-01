"use client";

import Image from "next/image";
import { CldUploadWidget, CldImage } from "next-cloudinary";
import styles from "./styles.module.css";
import { IMAGES_DATA, ROLES } from "@/lib/constants";
import { X, Upload, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useGetCurrentUser } from "@/hooks/useAuth";
import {
    useGetCloudinaryImages,
    useDeleteCloudinaryImage,
    useAddCloudinaryImage
} from "@/hooks/useCloudinary";
import Loader from "../Loader";
import ConfirmDialog from "../ConfirmDialog";

export default function ImageGallery() {
    const [lightboxImage, setLightboxImage] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, publicId: null, imageTitle: '' });


    const getCurrentUserFn = useGetCurrentUser();

    const { data: cloudinaryImages = [], isLoading } = useGetCloudinaryImages();
    const { mutate: deleteImage, isPending: isDeleting } = useDeleteCloudinaryImage();
    const { mutate: addImage } = useAddCloudinaryImage();

    useEffect(() => {
        const user = getCurrentUserFn();
        setIsAdmin(user?.role === ROLES.ADMIN);
    }, []);

    useEffect(() => {
        const handleAuthChange = () => {
            const user = getCurrentUserFn();
            setIsAdmin(user?.role === ROLES.ADMIN);
        };

        window.addEventListener('authChanged', handleAuthChange);
        return () => window.removeEventListener('authChanged', handleAuthChange);
    }, []);

    const handleUpload = (result) => {
        if (result.event === "success") {
            const newImage = {
                public_id: result.info.public_id,
                secure_url: result.info.secure_url,
                width: result.info.width,
                height: result.info.height,
            };
            addImage(newImage);
        }
    };

    const handleDelete = async (image, e) => {
        e.stopPropagation()
        setDeleteConfirm({ isOpen: true, publicId: image.publicId, imageTitle: image.title });
    };

    const confirmDelete = async () => {
        if (deleteConfirm.publicId) {
            deleteImage(deleteConfirm.publicId);
            setDeleteConfirm({ isOpen: false, publicId: null, imageTitle: '' });
        }
    };

    const openLightbox = (img) => {
        setLightboxImage(img);
        document.body.style.overflow = "hidden";
    };

    const closeLightbox = () => {
        setLightboxImage(null);
        document.body.style.overflow = "auto";
    };

    const allImages = [
        ...cloudinaryImages.map((img) => ({
            id: img.public_id,
            url: img.secure_url,
            isCloudinary: true,
            publicId: img.public_id,
        })),
        ...IMAGES_DATA,
    ];

    return (
        <><div className={styles.gallerySection}>
            <h2 className={styles.sectionTitle}>Treatment Gallery</h2>
            <p className={styles.sectionSubtitle}>
                View real patient results and treatment progress
            </p>
            <div className={styles.masonryGrid}>
                {isAdmin && (
                    <CldUploadWidget
                        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ||
                            "default_preset"}
                        onSuccess={handleUpload}
                        options={{
                            maxFiles: 10,
                            resourceType: "image",
                        }}
                    >
                        {({ open }) => (
                            <div
                                className={styles.uploadCard}
                                onClick={() => open()}
                            >
                                <Upload className={styles.uploadIcon} />
                                <p className={styles.uploadText}>Upload Image</p>
                            </div>
                        )}
                    </CldUploadWidget>
                )}


                {isLoading && (
                    <div className={styles.loadingState}>
                        <Loader message="Loading images..." />
                    </div>
                )}

                {!isLoading && allImages.map((image) => (
                    <div
                        key={image.id}
                        className={styles.imageCard}
                        onClick={() => openLightbox(image)}
                    >
                        {image.isCloudinary ? (
                            <CldImage
                                src={image.publicId}
                                alt={`Treatment image ${image.id}`}
                                className={styles.gridImage}
                                width={430}
                                height={430}
                                sizes="(max-width: 680px) 100vw, 430px"
                                loading="lazy" />
                        ) : (
                            <Image
                                src={image.url}
                                alt={`Treatment image ${image.id}`}
                                className={styles.gridImage}
                                width={430}
                                height={430}
                                sizes="(max-width: 680px) 100vw, 430px"
                                loading="lazy" />
                        )}

                        {isAdmin && image.isCloudinary && (
                            <button
                                className={styles.deleteButton}
                                onClick={(e) => handleDelete(image, e)}
                                disabled={isDeleting}
                                type="button"
                            >
                                <Trash2 size={16} />
                            </button>
                        )}
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
                        {lightboxImage.isCloudinary ? (
                            <CldImage
                                src={lightboxImage.publicId}
                                alt={`Treatment image ${lightboxImage.id}`}
                                className={styles.lightboxImage}
                                width={1200}
                                height={800}
                                loading="eager" />
                        ) : (
                            <Image
                                src={lightboxImage.url}
                                alt={`Treatment image ${lightboxImage.id}`}
                                className={styles.lightboxImage}
                                width={1200}
                                height={800}
                                loading="eager" />
                        )}
                    </div>
                </div>
            )}
        </div>
            <ConfirmDialog
                isOpen={deleteConfirm.isOpen}
                onClose={() => setDeleteConfirm({ isOpen: false, publicId: null, imageTitle: '' })}
                onConfirm={confirmDelete}
                title="Delete Image"
                message={`Are you sure you want to delete image? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                variant="danger" />
        </>
    );
}
