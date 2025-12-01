"use client";

import { CldUploadWidget, CldImage } from "next-cloudinary";
import { useState, useEffect } from "react";
import { Trash2, Upload } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import styles from "./CloudinaryUpload.module.css";

interface CloudinaryUploadProps {
  onUpload?: (result: any) => void;
  onDelete?: (publicId: string) => void;
  initialImages?: string[];
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

export default function CloudinaryUpload({
  onUpload,
  onDelete,
  initialImages = [],
}: CloudinaryUploadProps) {
  const [images, setImages] = useState<string[]>(initialImages);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  // Load images from backend on mount
  useEffect(() => {
    if (initialImages.length === 0) {
      loadImages();
    }
  }, []);

  const loadImages = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/cloudinary/list`);
      if (response.data.success) {
        const publicIds = response.data.images.map((img: any) => img.public_id);
        setImages(publicIds);
      }
    } catch (error) {
      console.error("Error loading images:", error);
      toast.error("Failed to load images");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = (result: any) => {
    if (result.event === "success") {
      const publicId = result.info.public_id;
      setImages((prev) => [...prev, publicId]);
      if (onUpload) {
        onUpload(result);
      }
      toast.success("Image uploaded successfully!");
    }
  };

  const handleDelete = async (publicId: string) => {
    try {
      setDeleting(publicId);
      const response = await axios.delete(
        `${API_BASE_URL}/cloudinary/delete/${publicId}`
      );

      if (response.data.success) {
        setImages((prev) => prev.filter((id) => id !== publicId));
        if (onDelete) {
          onDelete(publicId);
        }
        toast.success("Image deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Failed to delete image");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Image Upload</h3>
        <CldUploadWidget
          uploadPreset={
            process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "default_preset"
          }
          onSuccess={handleUpload}
          options={{
            maxFiles: 5,
            resourceType: "image",
          }}
        >
          {({ open }) => {
            return (
              <button
                onClick={() => open()}
                className={styles.uploadButton}
                disabled={loading}
              >
                <Upload className="w-4 h-4" />
                Upload Image
              </button>
            );
          }}
        </CldUploadWidget>
      </div>

      <div className={styles.imageGrid}>
        {loading ? (
          <div className={styles.loading}>Loading images...</div>
        ) : images.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No images uploaded yet.</p>
          </div>
        ) : (
          images.map((publicId) => (
            <div key={publicId} className={styles.imageCard}>
              <CldImage
                width="400"
                height="400"
                src={publicId}
                alt="Uploaded image"
                className={styles.image}
              />
              <button
                onClick={() => handleDelete(publicId)}
                disabled={deleting === publicId}
                className={styles.deleteButton}
                type="button"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
