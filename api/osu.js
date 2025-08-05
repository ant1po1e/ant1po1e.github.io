export default async function handler(req, res) {
	const client_id = 35697;
	const client_secret = "nm8qv9aCoXKjZ9fO5mmiB4iiq3L8n3TwYddyi4tZ";
	const userId = req.query.user || "17258072"; // fallback userId
	const type = req.query.type || "favourite";
	const limit = req.query.limit || 10;

	try {
		// Get access token
		const tokenRes = await fetch("https://osu.ppy.sh/oauth/token", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				client_id,
				client_secret,
				grant_type: "client_credentials",
				scope: "public",
			}),
		});

		const tokenData = await tokenRes.json();
		const access_token = tokenData.access_token;

		if (!access_token) {
			console.error("Failed to retrieve access token:", tokenData);
			return res.status(500).json({ error: "Token retrieval failed" });
		}

		// Fetch beatmapsets
		const beatmapsRes = await fetch(
			`https://osu.ppy.sh/api/v2/users/${userId}/beatmapsets/${type}?limit=${limit}`,
			{
				headers: {
					Authorization: `Bearer ${access_token}`,
				},
			}
		);

		if (!beatmapsRes.ok) {
			const errorText = await beatmapsRes.text();
			console.error("Beatmap fetch error:", errorText);
			return res.status(500).json({ error: "Failed to fetch beatmapsets" });
		}

		const beatmapsets = await beatmapsRes.json();
		return res.status(200).json(beatmapsets);
	} catch (error) {
		console.error("Server error:", error);
		return res.status(500).json({ error: "Server error" });
	}
}
