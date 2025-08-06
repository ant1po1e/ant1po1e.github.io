import { useEffect, useState, useRef } from "react";

const ITEMS_PER_PAGE = 6;

export const OsuBeatmapFeed = () => {
	const [beatmaps, setBeatmaps] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchBeatmaps = async () => {
			try {
				const res = await fetch("/data/osu-beatmaps.json");
				if (!res.ok) throw new Error("Fetch failed");
				const data = await res.json();

				const sorted = [...data].sort(
					(a, b) => (b.badges?.length || 0) - (a.badges?.length || 0)
				);

				setBeatmaps(sorted);
			} catch (err) {
				setError("Failed to load beatmaps. Please try again later.");
			} finally {
				setLoading(false);
			}
		};

		fetchBeatmaps();
	}, []);

	const totalPages = Math.ceil(beatmaps.length / ITEMS_PER_PAGE);
	const start = (currentPage - 1) * ITEMS_PER_PAGE;
	const currentBeatmaps = beatmaps.slice(start, start + ITEMS_PER_PAGE);

	const extractIdFromLink = (link) => {
		const parts = link.split("/beatmapsets/");
		return parts[1]?.split("/")[0] || "";
	};

	const badgeStyle = {
		ranked: "bg-green-100 text-green-700 border border-green-300",
		tournaments: "bg-yellow-100 text-yellow-700 border border-yellow-300",
		contest: "bg-pink-100 text-pink-700 border border-pink-300",
		mpg: "bg-sky-100 text-sky-700 border border-sky-300",
		collab: "bg-indigo-100 text-indigo-700 border border-indigo-300",
		gd: "bg-red-100 text-red-700 border border-red-300",
	};

	const TruncTooltip = ({ children, textClass }) => {
		const ref = useRef(null);
		const [showTooltip, setShowTooltip] = useState(false);

		useEffect(() => {
			if (ref.current) {
				setShowTooltip(ref.current.scrollWidth > ref.current.clientWidth);
			}
		}, [children]);

		return (
			<p
				ref={ref}
				className={`${textClass} truncate`}
				title={showTooltip ? children : ""}>
				{children}
			</p>
		);
	};

	if (loading)
		return <p className="text-center text-black">Loading beatmapsets...</p>;

	if (error)
		return (
			<div className="text-center text-red-500 font-semibold">{error}</div>
		);

	return (
		<section className="w-full px-4 md:px-24 flex justify-center items-center">
			<div className="w-full md:w-4/5 px-5 py-5 bg-white/50 backdrop-blur-md rounded-lg shadow-lg">
				<div className="w-full px-4">
					<div className="mx-auto text-center">
						<h1 className="font-bold text-black font-merienda text-xl md:text-3xl">
							My osu! Beatmaps
						</h1>
					</div>
				</div>

				<div className="text-center mt-5 w-full px-4 py-4 border-t-2 border-t-black text-white">
					{/* Cards Grid */}
					<div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 place-items-center mb-6">
						{currentBeatmaps.map((set, index) => {
							const beatmapId = extractIdFromLink(set.link);
							return (
								<a
									key={index}
									href={set.link}
									target="_blank"
									rel="noopener noreferrer"
									className="w-full max-w-[300px] group transition-transform duration-300 hover:scale-105">
									<div
										className="relative h-[140px] rounded-xl overflow-hidden shadow-md hover:shadow-xl transition duration-300"
										style={{
											backgroundImage: `url(https://assets.ppy.sh/beatmaps/${beatmapId}/covers/card.jpg)`,
											backgroundSize: "cover",
											backgroundPosition: "center",
										}}>
										<div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#3166a7]/80 p-4 flex flex-col justify-end transition-all duration-300 group-hover:backdrop-blur-none">
											<div className="text-white text-center">
												<TruncTooltip textClass="text-sm font-semibold mb-0.5">
													{set.title}
												</TruncTooltip>
												<TruncTooltip textClass="text-xs opacity-90 mb-1">
													{set.artist}
												</TruncTooltip>
											</div>

											{set.badges?.length > 0 && (
												<div className="flex flex-wrap gap-1 mt-1 justify-center uppercase">
													{set.badges.map((badge, i) => (
														<span
															key={i}
															className={`px-2 py-[2px] text-[10px] font-semibold rounded-md shadow ${
																badgeStyle[badge.toLowerCase()] ||
																"bg-gray-200 text-gray-800"
															}`}>
															{badge}
														</span>
													))}
												</div>
											)}
										</div>
									</div>
								</a>
							);
						})}
					</div>

					{/* Pagination */}
					{totalPages > 1 && (
						<div className="flex justify-center gap-4">
							<button
								disabled={currentPage === 1}
								onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
								className="px-4 py-1 text-sm font-medium rounded bg-white text-black hover:bg-blue-300 disabled:opacity-40 disabled:cursor-not-allowed">
								Previous
							</button>

							<span className="text-black text-sm font-medium mt-1">
								Page {currentPage} of {totalPages}
							</span>

							<button
								disabled={currentPage === totalPages}
								onClick={() =>
									setCurrentPage((prev) => Math.min(totalPages, prev + 1))
								}
								className="px-4 py-1 text-sm font-medium rounded bg-white text-black hover:bg-blue-300 disabled:opacity-40 disabled:cursor-not-allowed">
								Next
							</button>
						</div>
					)}
				</div>
			</div>
		</section>
	);
};
