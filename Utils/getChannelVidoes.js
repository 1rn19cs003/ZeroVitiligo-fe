// Step 1: If you only have channel NAME, get channel ID:
export async function getChannelId(channelName) {
    const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
    const apiUrl =
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(channelName)}&key=${apiKey}`;
    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error("Failed to fetch channel info");
    const data = await res.json();
    const channelItem = data.items?.[0];
    if (!channelItem || !channelItem.snippet || !channelItem.snippet.channelId) throw new Error("Channel not found");
    return channelItem.snippet.channelId;
}

// Step 2: Get Uploads Playlist ID for channel
export async function getUploadsPlaylistId(channelId) {
    const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
    const apiUrl =
        `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${apiKey}`;
    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error("Failed to fetch channel uploads playlist");
    const data = await res.json();
    const playlistId = data.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
    if (!playlistId) throw new Error("Uploads playlist not found");
    return playlistId;
}

// Step 3: Get all videos from the uploads playlist
export async function getVideoIdsFromPlaylist(playlistId, maxVideos = 30) {
    const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
    let allVideos = [];
    let nextPageToken = "";
    let fetched = 0;
    do {
        const apiUrl =
            `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50&pageToken=${nextPageToken}&key=${apiKey}`;
        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error("Failed to fetch videos from playlist");
        const data = await res.json();
        const items = data.items || [];
        allVideos.push(...items.map(item => item.snippet.resourceId.videoId));
        fetched += items.length;
        nextPageToken = data.nextPageToken || "";
        if (allVideos.length >= maxVideos) break; // Limit for performance/quota
    } while (nextPageToken);
    return allVideos.slice(0, maxVideos);
}

// Step 4 (optional): Get details for all videos in one batch
export async function getManyVideoDetails(videoIds) {
    const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
    // The API supports up to 50 IDs per call!
    const batches = [];
    for (let i = 0; i < videoIds.length; i += 50) {
        batches.push(videoIds.slice(i, i + 50));
    }
    let details = [];
    for (const batch of batches) {
        const apiUrl =
            `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${batch.join(",")}&key=${apiKey}`;
        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error("Failed to fetch video details");
        const data = await res.json();
        if (data.items) details.push(...data.items);
    }
    return details.map(item => ({
        id: item.id,
        youtubeUrl: `https://www.youtube.com/watch?v=${item.id}`,
        title: item.snippet?.title ?? "",
        description: item.snippet?.description ?? "",
        duration: item.contentDetails?.duration ?? "PT0M0S",
        views: item.statistics?.viewCount ?? "0",
        thumbnail: item.snippet?.thumbnails?.high?.url ?? "",
    }));
}

// Combined function: Given name or ID, get all video details
export async function getVideosByChannel(channelNameOrId, maxVideos = 30) {
    let channelId = channelNameOrId;
    if (!channelId.startsWith("UC")) {
        channelId = await getChannelId(channelNameOrId);
    }
    const uploadsPlaylistId = await getUploadsPlaylistId(channelId);
    const videoIds = await getVideoIdsFromPlaylist(uploadsPlaylistId, maxVideos);
    return await getManyVideoDetails(videoIds);
}
