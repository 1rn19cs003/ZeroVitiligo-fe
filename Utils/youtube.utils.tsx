export const getYouTubeVideoDetails = async (videoId: string) => {
  const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
  const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${apiKey}`;
  const response = await fetch(apiUrl);
  const data = await response.json();

  if (!data.items.length) return null;

  const video = data.items[0];
  return {
    title: video.snippet.title,
    description: video.snippet.description,
    duration: video.contentDetails.duration,
    views: video.statistics.viewCount,
    likes: video.statistics.likeCount,
    publishedAt: video.snippet.publishedAt,
    thumbnail: video.snippet.thumbnails.high.url,
  };
};

export const getVideoId = (url: string) => {
  const match = url.match(/(?:v=|youtu\.be\/)([^&]+)/);
  return match ? match[1] : null;
};

export const formatDuration = (duration: string) => {
  const match = duration.match(/PT(\d+M)?(\d+S)?/);
  const minutes = match?.[1] ? match[1].replace("M", "") : "0";
  const seconds = match?.[2] ? match[2].replace("S", "") : "00";
  return `${minutes}:${seconds.padStart(2, "0")}`;
};

export const getEmbedUrl = (url: string) => {
  const videoId = getVideoId(url);
  return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
};

export const getThumbnailUrl = (url: string) => {
  const videoId = getVideoId(url);
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
};

export const formatViews = (views: string) => {
  if (!views) return "0";
  const num = parseInt(views);
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return views.toString();
};

export const truncateText = (text: string, maxLength: number) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
};
