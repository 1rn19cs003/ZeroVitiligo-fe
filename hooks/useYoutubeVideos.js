import { useQueries } from "@tanstack/react-query";
import { getYouTubeVideoDetails, getVideoId } from "@/Utils/youtube.utils";

export function useYouTubeVideoDetails(videoUrls) {
  return useQueries({
    queries: videoUrls.map(url => {
      const videoId = getVideoId(url);
      return {
        queryKey: ["youtubeVideo", videoId],
        queryFn: () => getYouTubeVideoDetails(videoId),
        enabled: !!videoId,
        staleTime: 10 * 60 * 1000,
        cacheTime: 30 * 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false
      };
    })
  });
}
