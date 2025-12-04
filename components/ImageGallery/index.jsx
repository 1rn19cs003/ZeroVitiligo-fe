"use client";

import Image from "next/image";
import { CldUploadWidget, CldImage } from "next-cloudinary";
import styles from "./styles.module.css";
import { ROLES } from "@/lib/constants";
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
import { useLanguage } from '@/hooks/useLanguage';

export default function ImageGallery() {
    const { t } = useLanguage();
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
        }))
    ];

    return (
        <>
            <div className={styles.gallerySection}>
                <h2 className={styles.sectionTitle}>{t('media.imageGallery.title')}</h2>
                <p className={styles.sectionSubtitle}>
                    {t('media.imageGallery.subtitle')}
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
                                    <p className={styles.uploadText}>{t('media.imageGallery.uploadText')}</p>
                                </div>
                            )}
                        </CldUploadWidget>
                    )}


                    {isLoading && (
                        <div className={styles.loadingState}>
                            <Loader message={t('media.imageGallery.loadingImages')} />
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
                                    alt={`${t('media.imageGallery.imageAlt')} ${image.id}`}
                                    className={styles.gridImage}
                                    width={430}
                                    height={430}
                                    sizes="(max-width: 680px) 100vw, 430px"
                                    loading="lazy" />
                            ) : (
                                <Image
                                    src={image.url}
                                    alt={`${t('media.imageGallery.imageAlt')} ${image.id}`}
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
                                    alt={`${t('media.imageGallery.imageAlt')} ${lightboxImage.id}`}
                                    className={styles.lightboxImage}
                                    width={1200}
                                    height={800}
                                    loading="eager" />
                            ) : (
                                <Image
                                    src={lightboxImage.url}
                                    alt={`${t('media.imageGallery.imageAlt')} ${lightboxImage.id}`}
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
                title={t('media.imageGallery.deleteConfirm.title')}
                message={t('media.imageGallery.deleteConfirm.message')}
                confirmText={t('media.imageGallery.deleteConfirm.confirmText')}
                cancelText={t('media.imageGallery.deleteConfirm.cancelText')}
                variant="danger" />
        </>
    );
}
