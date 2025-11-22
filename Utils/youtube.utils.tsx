export const getVideoId = (url: string) => {
  if (!url) return "";
  const shortsMatch = url.match(/\/shorts\/([a-zA-Z0-9_-]{11})/);
  if (shortsMatch) return shortsMatch[1];
  const idMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (idMatch) return idMatch[1];
  const pathMatch = url.match(/\/([a-zA-Z0-9_-]{11})(?:\?|&|$)/);
  if (pathMatch) return pathMatch[1];
  return "";
};

export const getEmbedUrl = (url: string) => {
  const id = getVideoId(url);
  return id ? `https://www.youtube.com/embed/${id}` : "";
};

export const formatDuration = (duration: string) => {
  if (!duration) return "--:--";
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return "--:--";
  const hours = match[1] ? Number(match[1]) : 0;
  const mins = match[2] ? Number(match[2]) : 0;
  const secs = match[3] ? Number(match[3]) : 0;
  return hours
    ? `${hours}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
    : `${mins}:${String(secs).padStart(2, "0")}`;
};

export const formatViews = (views: any) =>
  views ? Number(views).toLocaleString() : "--";

export const truncateText = (text: string, length = 60) =>
  text && text.length > length ? text.slice(0, length) + "..." : text;

export const getYouTubeVideoDetails = async (videoId: any) => {
  const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
  if (!apiKey) throw new Error("YouTube API key is missing.");
  if (!videoId) throw new Error("YouTube video ID is required.");
  const apiUrl =
    `https://www.googleapis.com/youtube/v3/videos` +
    `?part=snippet,contentDetails,statistics&id=${videoId}&key=${apiKey}`;
  const response = await fetch(apiUrl, { cache: "force-cache" });
  if (!response.ok) throw new Error("Failed to fetch video details.");
  const data = await response.json();
  if (!data.items || !data.items.length) return null;
  const item = data.items[0];
  return {
    title: item.snippet?.title ?? "No Title",
    description: item.snippet?.description ?? "",
    duration: item.contentDetails?.duration ?? "PT0M0S",
    views: item.statistics?.viewCount ?? "0",
    likes: item.statistics?.likeCount ?? "0",
    publishedAt: item.snippet?.publishedAt ?? "",
    thumbnail:
      item.snippet?.thumbnails?.high?.url ??
      item.snippet?.thumbnails?.default?.url ??
      ""
  };
};

