import { useEffect, useState, useRef } from "react";
import { twMerge } from "tailwind-merge";
import { DropdownFilter } from "./DropdownFilter";

const ITEMS_PER_PAGE = 6;

export const OsuBeatmapFeed = () => {
	const [beatmaps, setBeatmaps] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [selectedBadge, setSelectedBadge] = useState("all");

	const fetchBeatmaps = async () => {
		try {
			setLoading(true);
			setError(null);
			const res = await fetch("api/beatmaps");
			if (!res.ok) throw new Error("Fetch failed");
			const data = await res.json();

			const sorted = [...data].sort(
				(a, b) => (b.badges?.length || 0) - (a.badges?.length || 0)
			);

			setBeatmaps(sorted);
		} catch (err) {
			console.error(err);
			setError("Failed to load beatmaps. Please try again later.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchBeatmaps();
	}, []);

	useEffect(() => {
		setCurrentPage(1);
	}, [selectedBadge]);

	const extractIdFromLink = (link) => {
		const parts = link.split("/beatmapsets/");
		return parts[1]?.split("/")[0] || "";
	};

	const badgeStyle = {
		ranked: "bg-green-100 text-green-700 border border-green-300",
		tournaments: "bg-yellow-100 text-yellow-700 border border-yellow-300",
		contest: "bg-pink-100 text-pink-700 border border-pink-300",
		hs: "bg-orange-100 text-orange-700 border border-orange-300",
		collab: "bg-violet-100 text-violet-700 border border-violet-300",
		gd: "bg-red-100 text-red-700 border border-red-300",
	};

	const filteredBeatmaps =
		selectedBadge === "all"
			? beatmaps
			: beatmaps.filter((b) => b.badges?.includes(selectedBadge));

	const totalPages = Math.ceil(filteredBeatmaps.length / ITEMS_PER_PAGE);
	const start = (currentPage - 1) * ITEMS_PER_PAGE;
	const currentBeatmaps = filteredBeatmaps.slice(start, start + ITEMS_PER_PAGE);

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
				title={showTooltip ? children : ""}
			>
				{children}
			</p>
		);
	};

	// 🔴 Error State
	if (error) {
		return (
			<section className="w-full px-4 md:px-24 flex justify-center items-center">
				<div className="w-full md:w-4/5 px-5 py-8 bg-white/50 backdrop-blur-md rounded-lg shadow-lg text-center space-y-4">
					<p className="text-red-500 font-semibold">{error}</p>
					<button
						onClick={fetchBeatmaps}
						className="px-4 py-2 bg-black text-white rounded-lg md:hover:bg-blue-400 transition"
					>
						Retry
					</button>
				</div>
			</section>
		);
	}

	return (
		<section className="w-full px-4 md:px-24 flex justify-center items-center">
			<div className="w-full md:w-4/5 px-5 py-5 bg-white/50 backdrop-blur-md rounded-lg shadow-lg mb-20 sm:mb-0">
				<div className="w-full px-4 relative mb-4">
					<h1 className="font-bold text-black text-xl md:text-3xl text-center">
						Contributed Beatmaps
					</h1>

					<div className="mt-3 flex relative z-50 justify-center md:mt-0 md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2">
						<DropdownFilter
							selectedBadge={selectedBadge}
							setSelectedBadge={setSelectedBadge}
						/>
					</div>
				</div>

				{/* Cards Grid */}
				<div className="text-center mt-3 w-full px-4 py-4 border-t-2 border-t-black text-white">
					<div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 place-items-center mb-6">
						{loading ? (
							// Skeleton Loader
							[...Array(6)].map((_, i) => (
								<div
									key={i}
									className="w-full max-w-[300px] h-[140px] bg-gray-200 animate-pulse rounded-xl"
								/>
							))
						) : filteredBeatmaps.length === 0 ? (
							<div className="col-span-full text-black font-medium py-10">
								No beatmaps found for this category.
							</div>
						) : (
							currentBeatmaps.map((set, index) => {
								const beatmapId = extractIdFromLink(set.link);
								return (
									<a
										key={index}
										href={set.link}
										target="_blank"
										rel="noopener noreferrer"
										className="w-full max-w-[300px] group transition-transform duration-300 md:hover:scale-105"
									>
										<div
											className={twMerge(
												"relative h-[140px] rounded-xl overflow-hidden shadow-md md:hover:shadow-xl transition duration-300"
											)}
											style={{
												backgroundImage: `url(https://assets.ppy.sh/beatmaps/${beatmapId}/covers/card.jpg)`,
												backgroundSize: "cover",
												backgroundPosition: "center",
											}}
											aria-label={`Beatmap ${set.title} by ${set.artist}`}
										>
											<div
												className={twMerge(
													"absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#3166a7]/80",
													"p-4 flex flex-col justify-end transition-all duration-300 md:group-hover:backdrop-blur-none"
												)}
											>
												<div className="text-white text-center">
													<TruncTooltip textClass="text-md font-semibold mb-0.5">
														{set.title}
													</TruncTooltip>
													<TruncTooltip textClass="text-sm opacity-90 mb-1">
														{set.artist}
													</TruncTooltip>
												</div>

												{set.badges?.length > 0 && (
													<div className="flex flex-wrap gap-1 mt-1 justify-center uppercase">
														{set.badges.map((badge, i) => (
															<span
																key={i}
																className={`px-1 py-[1px] text-[10px] font-medium rounded-sm shadow ${
																	badgeStyle[badge.toLowerCase()] ||
																	"bg-gray-200 text-gray-800"
																}`}
															>
																{badge}
															</span>
														))}
													</div>
												)}
											</div>
										</div>
									</a>
								);
							})
						)}
					</div>

					{/* Pagination */}
					{totalPages > 1 && !loading && (
						<div className="flex justify-center gap-4">
							<button
								disabled={currentPage === 1}
								onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
								aria-label="Previous page"
								className={twMerge(
									"px-2 py-0.5 md:px-4 md:py-1 text-sm font-medium rounded bg-white text-black md:hover:bg-blue-300",
									"disabled:opacity-40 disabled:cursor-not-allowed transition duration-300"
								)}
							>
								Prev
							</button>

							<span className="text-black text-xs md:text-sm font-medium mt-1">
								Page {currentPage} of {totalPages}
							</span>

							<button
								disabled={currentPage === totalPages}
								onClick={() =>
									setCurrentPage((prev) => Math.min(totalPages, prev + 1))
								}
								aria-label="Next page"
								className={twMerge(
									"px-2 py-0.5 md:px-4 md:py-1 text-sm font-medium rounded bg-white text-black md:hover:bg-blue-300",
									"disabled:opacity-40 disabled:cursor-not-allowed transition duration-300"
								)}
							>
								Next
							</button>
						</div>
					)}
				</div>
			</div>
		</section>
	);
};
