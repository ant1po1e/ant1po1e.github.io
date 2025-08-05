import { useEffect, useState } from "react";

export const YouTubeFeed = () => {
	const [videos, setVideos] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchVideos = async () => {
			try {
				const res = await fetch("/api/youtube");
				const data = await res.json();

				// YouTube API response format
				if (data.items) {
					setVideos(data.items);
				}
			} catch (err) {
				console.error("Failed to fetch YouTube feed", err);
			} finally {
				setLoading(false);
			}
		};

		fetchVideos();
	}, []);

	if (loading) return <p className="text-white">Loading videos...</p>;

	return (
		<div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
			{videos.map((video) => {
				const videoId = video.id.videoId || video.id; // in case it's a video object
				const { title, thumbnails } = video.snippet;

				return (
					<a
						key={videoId}
						href={`https://www.youtube.com/watch?v=${videoId}`}
						target="_blank"
						rel="noopener noreferrer"
						className="bg-white rounded-lg overflow-hidden shadow-lg hover:scale-105 transition duration-300">
						<img
							src={thumbnails.high.url}
							alt={title}
							className="w-full h-48 object-cover"
						/>
						<div className="p-4">
							<h3 className="text-sm md:text-lg font-bold text-black line-clamp-2">
								{title}
							</h3>
						</div>
					</a>
				);
			})}
		</div>
	);
};
