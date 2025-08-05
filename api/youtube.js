export default async function handler(req, res) {
	const apiKey = process.env.YOUTUBE_API_KEY;
	const channelId = process.env.YOUTUBE_CHANNEL_ID;

	const url = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=6`;

	try {
		const response = await fetch(url);
		const data = await response.json();

		if (!data.items) {
			return res.status(500).json({ error: "No videos found" });
		}

		const videos = data.items
			.filter((item) => item.id.kind === "youtube#video")
			.map((item) => ({
				id: item.id.videoId,
				title: item.snippet.title,
				thumbnail: item.snippet.thumbnails.medium.url,
			}));

		res.status(200).json(videos);
	} catch (error) {
		console.error("YouTube API error:", error);
		res.status(500).json({ error: "Failed to fetch YouTube feed" });
	}
}
