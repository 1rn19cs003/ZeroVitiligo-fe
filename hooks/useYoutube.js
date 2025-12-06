import api from './axios.config'
import toast from 'react-hot-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useStateLoadingStore } from '@/store/useStatesStore';

export function useYouTubeOEmbed(url) {
    return useQuery({
        queryKey: ['youtube-oembed', url],
        queryFn: async () => {
            const endpoint = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
            const res = await api.get(endpoint);
            return res;
        },
        enabled: !!url,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });
}

export function useAddYoutubeVideo() {
    const queryClient = useQueryClient();
    const { startLoading, stopLoading } = useStateLoadingStore();

    return useMutation({
        mutationFn: (video) =>
            api.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/youtube`, video)
                .then(res => res.data),
        onMutate: () => {
            startLoading('Adding video...');
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['youtubeVideos'] });
            toast.success('YouTube video added!');
        },
        onError: (error) => {
            const message = error?.response?.data?.error || 'Failed to add video.';
            toast.error(message);
        },
        onSettled: () => {
            stopLoading();
        }
    });
}

export function useDeleteYoutubeVideo() {
    const queryClient = useQueryClient();
    const { startLoading, stopLoading } = useStateLoadingStore();

    return useMutation({
        mutationFn: (videoId) =>
            api.delete(`${process.env.NEXT_PUBLIC_SERVER_URL}/youtube/${videoId}`)
                .then(res => res.data),
        onMutate: () => {
            startLoading('Deleting video...');
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['youtubeVideos'] });
            toast.success('YouTube video deleted successfully!');
        },
        onError: (error) => {
            const message = error?.response?.data?.error || 'Failed to delete video.';
            toast.error(message);
        },
        onSettled: () => {
            stopLoading();
        }
    });
}

export function useYoutubeVideos() {
    return useQuery({
        queryKey: ['youtubeVideos'],
        queryFn: async () => {
            const res = await api.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/youtube`);
            return res.data.data;
        },
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });
}

