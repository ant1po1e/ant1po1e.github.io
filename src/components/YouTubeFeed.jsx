import { useEffect, useState } from "react";

export const YouTubeFeed = () => {
	const [videos, setVideos] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);

	useEffect(() => {
		const fetchVideos = async () => {
			try {
				const res = await fetch("/api/youtube");
				const data = await res.json();
				setVideos(data);
			} catch (err) {
				console.error("Failed to fetch videos:", err);
				setError(true);
			} finally {
				setLoading(false);
			}
		};

		fetchVideos();
	}, []);

	if (loading) {
		return (
			<section className="w-full px-4 md:px-24 flex justify-center items-center min-h-[40vh]">
				<div className="text-center text-black font-semibold">Loading YouTube feed...</div>
			</section>
		);
	}

	if (error || !videos.length) {
		return (
			<section className="w-full px-4 md:px-24 flex justify-center items-center min-h-[40vh]">
				<div className="text-center text-black font-semibold">
					Failed to load videos. Please try again later.
				</div>
			</section>
		);
	}

	return (
		<section className="w-full px-4 md:px-24 flex justify-center items-center min-h-[70vh]">
			<div className="w-full md:w-2/3 px-5 py-5 bg-white/50 backdrop-blur-md rounded-lg shadow-lg">
				<div className="w-full px-4">
					<div className="mx-auto text-center space-y-4">
						<h2 className="font-bold text-black font-merienda text-2xl md:text-4xl">
							Latest YouTube Videos
						</h2>

						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-6">
							{videos.map((video) => (
								<a
									key={video.id}
									href={`https://www.youtube.com/watch?v=${video.id}`}
									target="_blank"
									rel="noopener noreferrer"
									className="bg-white/80 rounded-lg overflow-hidden hover:scale-105 hover:shadow-lg transition duration-300">
									<img
										src={video.thumbnail}
										alt={video.title}
										className="w-full h-44 object-cover"
									/>
									<div className="p-3 text-left text-black">
										<p className="font-semibold text-sm md:text-base line-clamp-2">{video.title}</p>
									</div>
								</a>
							))}
						</div>

						<div className="pt-6">
							<a
								href="https://www.youtube.com/@ant1po1e"
								target="_blank"
								rel="noopener noreferrer"
								className="inline-block px-6 py-2 bg-black text-white font-semibold rounded-lg hover:bg-blue-400 hover:scale-110 transition duration-300">
								<i className="bi bi-youtube" /> Visit My Channel
							</a>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};
