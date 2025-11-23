import { getYouTubeOEmbed } from '@/Utils/youtube.utils';
import api from './axios.config'
import toast from 'react-hot-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useYouTubeOEmbed(url) {
    return useQuery({
        queryKey: ['youtubeOEmbed', url],
        queryFn: () => getYouTubeOEmbed(url),
        enabled: !!url,
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });
}

export function useAddYoutubeVideo() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (video) =>
            api.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/youtube-videos`, video)
                .then(res => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['youtubeVideos'] });
            toast.success('YouTube video added!');
        },
        onError: (error) => {
            const message = error?.response?.data?.error || 'Failed to add video.';
            toast.error(message);
        }
    });
}

export function useYoutubeVideos() {
    return useQuery({
        queryKey: ['youtubeVideos'],
        queryFn: async () => {
            const res = await api.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/youtube-videos`);
            return res.data.data;
        },
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });
}

