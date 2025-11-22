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

// youtube.utils.js
export function getVideoId(youtubeUrl:string) {
  const vMatch = youtubeUrl.match(/v=([a-zA-Z0-9_-]{11})/);
  if (vMatch) return vMatch[1];
  const shortsMatch = youtubeUrl.match(/shorts\/([a-zA-Z0-9_-]{11})/);
  if (shortsMatch) return shortsMatch[1];
  return youtubeUrl.slice(-11); // fallback
}

export function getEmbedUrl(youtubeUrl:string) {
  const id = getVideoId(youtubeUrl);
  return `https://www.youtube.com/embed/${id}?autoplay=1`;
}

export function isShortUrl(url:string) {
  return url.includes("/shorts/");
}

export function truncateText(text:string, maxLen:number) {
  if (!text) return "";
  return text.length > maxLen ? text.slice(0, maxLen) + "…" : text;
}


export const formatDuration = (duration: string) => {
  const match = duration.match(/PT(\d+M)?(\d+S)?/);
  const minutes = match?.[1] ? match[1].replace("M", "") : "0";
  const seconds = match?.[2] ? match[2].replace("S", "") : "00";
  return `${minutes}:${seconds.padStart(2, "0")}`;
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

