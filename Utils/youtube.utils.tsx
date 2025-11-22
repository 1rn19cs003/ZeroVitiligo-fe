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

export const getVideoId = (url: string) => {
  if (!url) return null;

  const parsedUrl = new URL(url);
  const hostname = parsedUrl.hostname;

  // Handle regular watch URLs
  if (parsedUrl.searchParams.get("v")) {
    return parsedUrl.searchParams.get("v");
  }

  // Handle shorts URLs
  if (
    hostname.includes("youtube.com") &&
    parsedUrl.pathname.startsWith("/shorts/")
  ) {
    return parsedUrl.pathname.split("/shorts/")[1].split("?")[0];
  }

  // Handle youtu.be short links
  if (hostname === "youtu.be") {
    return parsedUrl.pathname.slice(1);
  }

  return null;
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


export function setCache(key: string, value: any, ttlMinutes = 1440) {  
  const now = Date.now();
  const item = {
    value,
    expiry: now + ttlMinutes * 60 * 1000,
  };
  localStorage.setItem(key, JSON.stringify(item));
}

export function getCache(key: string) {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) return null;

  try {
    const item = JSON.parse(itemStr);
    if (Date.now() > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }
    return item.value;
  } catch {
    return null;
  }
}
