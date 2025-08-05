import { useEffect, useState } from "react";

export const OsuBeatmapFeed = ({
	userId = "17258072",
	type = "favourite",
	limit = 6,
}) => {
	const [beatmaps, setBeatmaps] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchBeatmaps = async () => {
			try {
				const res = await fetch(
					`/api/osu-beatmaps?user=${userId}&type=${type}&limit=${limit}`
				);
				const data = await res.json();

				if (data.error) {
					throw new Error(data.error);
				}

				setBeatmaps(data);
			} catch (err) {
				console.error("Fetch failed:", err);
				setError("Failed to load beatmaps. Please try again later.");
			} finally {
				setLoading(false);
			}
		};

		fetchBeatmaps();
	}, [userId, type, limit]);

	if (loading) {
		return <p className="text-center text-black">Loading beatmapsets...</p>;
	}

	if (error) {
		return (
			<div className="text-center text-red-500 font-semibold">{error}</div>
		);
	}

	return (
		<section className="w-full px-4 md:px-24 flex justify-center items-center min-h-[40vh]">
			<div className="w-full md:w-[85%] px-5 py-5 bg-white/50 backdrop-blur-md rounded-lg shadow-lg">
				<h2 className="text-black font-merienda text-2xl md:text-3xl mb-4 text-center">
					osu! Beatmapsets ({type})
				</h2>

				<div className="overflow-x-auto flex gap-4 scrollbar-thin scrollbar-thumb-gray-500 pb-2">
					{beatmaps.map((set) => (
						<a
							key={set.id}
							href={`https://osu.ppy.sh/beatmapsets/${set.id}`}
							target="_blank"
							rel="noopener noreferrer"
							className="min-w-[200px] max-w-[200px] bg-white rounded-lg shadow-md p-2 hover:scale-105 transition duration-300">
							<img
								src={`https://assets.ppy.sh/beatmaps/${set.id}/covers/card.jpg`}
								alt={set.title}
								className="rounded-md w-full mb-2"
							/>
							<div className="text-black text-sm font-semibold line-clamp-2">
								{set.title}
							</div>
							<div className="text-gray-600 text-xs">{set.artist}</div>
						</a>
					))}
				</div>
			</div>
		</section>
	);
};
