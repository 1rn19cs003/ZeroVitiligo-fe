import toast from 'react-hot-toast';
import api from './axios.config';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useStateLoadingStore } from '@/store/useStatesStore';

export function useGetCloudinaryImages() {
    return useQuery({
        queryKey: ['cloudinary-images'],
        queryFn: async () => {
            const response = await api.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/cloudinary/list`, {
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
    const { startLoading, stopLoading } = useStateLoadingStore();

    return useMutation({
        mutationFn: async (publicId) => {
            const response = await api.delete(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/cloudinary/delete/${publicId}`,
                { withCredentials: true }
            );
            return response.data;
        },
        onMutate: () => {
            startLoading('Deleting image...');
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cloudinary-images'] });
            toast.success("Image deleted successfully!");
        },
        onError: (error) => {
            console.error("Error deleting image:", error);
            toast.error("Failed to delete image");
        },
        onSettled: () => {
            stopLoading();
        }
    });
}

export function useGetUploadSignature() {
    const { startLoading, stopLoading } = useStateLoadingStore();

    return useMutation({
        mutationFn: async (folder = '') => {
            const response = await api.post(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/cloudinary/signature`,
                { folder },
                { withCredentials: true }
            );
            return response.data;
        },
        onMutate: () => {
            startLoading('Preparing upload...');
        },
        onError: (error) => {
            console.error("Error getting upload signature:", error);
            toast.error("Failed to get upload signature");
        },
        onSettled: () => {
            stopLoading();
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
