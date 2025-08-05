export default async function handler(req, res) {
	const apiKey = process.env.YOUTUBE_API_KEY;
	const channelId = process.env.YOUTUBE_CHANNEL_ID;

	const url = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=6`;

	try {
		const response = await fetch(url);
		const data = await response.json();

		res.status(200).json(data);
	} catch (error) {
		res.status(500).json({ error: "Failed to fetch YouTube feed" });
	}
}
