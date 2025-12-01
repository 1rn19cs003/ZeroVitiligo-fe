import toast from 'react-hot-toast';
import api from './axios.config';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000/api";

export function useGetCloudinaryImages() {
    return useQuery({
        queryKey: ['cloudinary-images'],
        queryFn: async () => {
            const response = await api.get(`${API_BASE_URL}/cloudinary/list`, {
                withCredentials: true,
            });
            return response.data.images || [];
        },
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        retry: 1,
        onError: (error) => {
            if (error.response?.status !== 401) {
                console.error("Error loading images:", error);
            }
        }
    });
}

export function useDeleteCloudinaryImage() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (publicId) => {
            const response = await api.delete(
                `${API_BASE_URL}/cloudinary/delete/${publicId}`,
                { withCredentials: true }
            );
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cloudinary-images'] });
            toast.success("Image deleted successfully!");
        },
        onError: (error) => {
            console.error("Error deleting image:", error);
            toast.error("Failed to delete image");
        }
    });
}

export function useGetUploadSignature() {
    return useMutation({
        mutationFn: async (folder = '') => {
            const response = await api.post(
                `${API_BASE_URL}/cloudinary/signature`,
                { folder },
                { withCredentials: true }
            );
            return response.data;
        },
        onError: (error) => {
            console.error("Error getting upload signature:", error);
            toast.error("Failed to get upload signature");
        }
    });
}

export function useAddCloudinaryImage() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (imageData) => {
            return imageData;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cloudinary-images'] });
            toast.success("Image uploaded successfully!");
        }
    });
}
