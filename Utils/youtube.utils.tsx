export const getVideoId = (url: string) => {
  if (!url) return null;

  const parsedUrl = new URL(url);
  const hostname = parsedUrl.hostname;

  if (parsedUrl.searchParams.get("v")) {
    return parsedUrl.searchParams.get("v");
  }

  if (
    hostname.includes("youtube.com") &&
    parsedUrl.pathname.startsWith("/shorts/")
  ) {
    return parsedUrl.pathname.split("/shorts/")[1].split("?")[0];
  }

  if (hostname === "youtu.be") {
    return parsedUrl.pathname.slice(1);
  }

  return null;
};


export const getEmbedUrl = (url: string) => {
  const videoId = getVideoId(url);
  return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
};


export const truncateText = (text: string, maxLength: number) => {
  if (!text) return "";
  if (text?.length <= maxLength) return text;
  return text?.slice(0, maxLength)?.trim() + "...";
};

export async function getYouTubeOEmbed(url:string) {
  const endpoint = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
  try {
    const response = await fetch(endpoint);
    if (!response.ok) throw new Error("oEmbed failed or video not found");
    return await response.json();
  } catch (err) {
    return null;
  }
}
