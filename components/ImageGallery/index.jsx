"use client";

import Image from "next/image";
import { CldUploadWidget, CldImage } from "next-cloudinary";
import styles from "./styles.module.css";
import { IMAGES_DATA } from "@/lib/constants";
import { X, Upload, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useIsAuthenticated, useGetCurrentUser } from "@/hooks/useAuth";
import axios from "axios";
import toast from "react-hot-toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

export default function ImageGallery() {
    const [lightboxImage, setLightboxImage] = useState(null);
    const [cloudinaryImages, setCloudinaryImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);

    const isAuthenticatedFn = useIsAuthenticated();
    const getCurrentUserFn = useGetCurrentUser();

    // Check authentication status
    useEffect(() => {
        const user = getCurrentUserFn();
        setIsAdmin(user?.role === "ADMIN");
    }, []);

    // Listen for auth changes
    useEffect(() => {
        const handleAuthChange = () => {
            const user = getCurrentUserFn();
            setIsAdmin(user?.role === "ADMIN");
            // Reload images when auth changes
            loadCloudinaryImages();
        };

        window.addEventListener('authChanged', handleAuthChange);
        return () => window.removeEventListener('authChanged', handleAuthChange);
    }, []);

    useEffect(() => {
        loadCloudinaryImages();
    }, []);

    const loadCloudinaryImages = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/cloudinary/list`, {
                withCredentials: true,
            });
            if (response.data.success) {
                setCloudinaryImages(response.data.images);
            }
        } catch (error) {
            console.error("Error loading images:", error);
            // Don't show error toast if not authenticated
            if (error.response?.status !== 401) {
                toast.error("Failed to load images");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = (result) => {
        if (result.event === "success") {
            const newImage = {
                public_id: result.info.public_id,
                secure_url: result.info.secure_url,
                width: result.info.width,
                height: result.info.height,
            };
            setCloudinaryImages((prev) => [newImage, ...prev]);
            toast.success("Image uploaded successfully!");
        }
    };

    const handleDelete = async (publicId, e) => {
        e.stopPropagation();
        if (!confirm("Are you sure you want to delete this image?")) return;

        try {
            setDeleting(publicId);
            const response = await axios.delete(
                `${API_BASE_URL}/cloudinary/delete/${publicId}`,
                { withCredentials: true }
            );

            if (response.data.success) {
                setCloudinaryImages((prev) =>
                    prev.filter((img) => img.public_id !== publicId)
                );
                toast.success("Image deleted successfully!");
            }
        } catch (error) {
            console.error("Error deleting image:", error);
            toast.error("Failed to delete image");
        } finally {
            setDeleting(null);
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
        <div className={styles.gallerySection}>
            <h2 className={styles.sectionTitle}>Treatment Gallery</h2>
            <p className={styles.sectionSubtitle}>
                View real patient results and treatment progress
            </p>
            <div className={styles.masonryGrid}>
                {/* Upload Card - Only visible to admins */}
                {isAdmin && (
                    <CldUploadWidget
                        uploadPreset={
                            process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ||
                            "default_preset"
                        }
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

                {/* Image Cards */}
                {allImages.map((image) => (
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
                                loading="lazy"
                            />
                        ) : (
                            <Image
                                src={image.url}
                                alt={`Treatment image ${image.id}`}
                                className={styles.gridImage}
                                width={430}
                                height={430}
                                sizes="(max-width: 680px) 100vw, 430px"
                                loading="lazy"
                            />
                        )}

                        {/* Delete Button - Only visible to admins and only for Cloudinary images */}
                        {isAdmin && image.isCloudinary && (
                            <button
                                className={styles.deleteButton}
                                onClick={(e) => handleDelete(image.publicId, e)}
                                disabled={deleting === image.publicId}
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
                                loading="eager"
                            />
                        ) : (
                            <Image
                                src={lightboxImage.url}
                                alt={`Treatment image ${lightboxImage.id}`}
                                className={styles.lightboxImage}
                                width={1200}
                                height={800}
                                loading="eager"
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
