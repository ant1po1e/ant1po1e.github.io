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
                (a, b) => (b.badges?.length || 0) - (a.badges?.length || 0),
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
    const currentBeatmaps = filteredBeatmaps.slice(
        start,
        start + ITEMS_PER_PAGE,
    );

    const TruncTooltip = ({ children, textClass }) => {
        const ref = useRef(null);
        const [showTooltip, setShowTooltip] = useState(false);

        useEffect(() => {
            if (ref.current) {
                setShowTooltip(
                    ref.current.scrollWidth > ref.current.clientWidth,
                );
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

    // 🔴 Error State
    if (error) {
        return (
            <section
                className="w-full flex items-center text-ink px-6 md:px-24 mt-10 md:mt-16"
                aria-label="Contributed Beatmaps Section">
                <div className="mx-auto w-full max-w-2xl p-8 rounded-xl shadow-xl bg-paper text-center space-y-4">
                    <p className="font-mono text-sm text-red-600">{error}</p>
                    <button
                        onClick={fetchBeatmaps}
                        className="font-mono text-xs uppercase tracking-wide px-4 py-2 rounded-sm bg-ink text-paper hover:bg-accent transition-colors duration-300">
                        Retry
                    </button>
                </div>
            </section>
        );
    }

    return (
        <section
            className="w-full flex items-center text-ink px-6 md:px-24 mt-10 md:mt-16"
            aria-label="Contributed Beatmaps Section">
            <div className="mx-auto w-full max-w-4xl p-8 rounded-xl shadow-xl bg-paper mb-20 md:mb-0">
                {/* Heading */}
                <div className="relative mb-2 text-center">
                    <h2 className="font-display italic font-medium text-ink text-2xl md:text-4xl">
                        Contributed Beatmaps
                    </h2>

                    <div className="mt-3 flex relative z-50 justify-center md:mt-0 md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2">
                        <DropdownFilter
                            selectedBadge={selectedBadge}
                            setSelectedBadge={setSelectedBadge}
                        />
                    </div>
                </div>

                {/* Cards Grid */}
                <div className="mt-6 pt-6 border-t border-rule">
                    <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 place-items-center mb-6">
                        {loading ? (
                            // Skeleton Loader
                            [...Array(6)].map((_, i) => (
                                <div
                                    key={i}
                                    className="relative w-full max-w-[300px] h-[140px] overflow-hidden rounded-sm border border-rule bg-rule/30">
                                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-paper/70 to-transparent" />
                                </div>
                            ))
                        ) : filteredBeatmaps.length === 0 ? (
                            <div className="col-span-full font-mono text-sm text-muted py-10">
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
                                        className="w-full max-w-[300px] group transition-transform duration-300 md:hover:scale-[1.02]">
                                        <div
                                            className={twMerge(
                                                "relative h-[140px] rounded-sm border border-rule overflow-hidden shadow-sm md:hover:border-accent transition duration-300",
                                            )}
                                            style={{
                                                backgroundImage: `url(https://assets.ppy.sh/beatmaps/${beatmapId}/covers/card.jpg)`,
                                                backgroundSize: "cover",
                                                backgroundPosition: "center",
                                            }}
                                            aria-label={`Beatmap ${set.title} by ${set.artist}`}>
                                            <div
                                                className={twMerge(
                                                    "absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/40 to-accent/70",
                                                    "p-4 flex flex-col justify-end transition-all duration-300 md:group-hover:backdrop-blur-none",
                                                )}>
                                                <div className="text-paper text-center">
                                                    <TruncTooltip textClass="font-display italic text-md mb-0.5">
                                                        {set.title}
                                                    </TruncTooltip>
                                                    <TruncTooltip textClass="font-mono text-xs opacity-90 mb-1">
                                                        {set.artist}
                                                    </TruncTooltip>
                                                </div>

                                                {set.badges?.length > 0 && (
                                                    <div className="flex flex-wrap gap-1 mt-1 justify-center uppercase">
                                                        {set.badges.map(
                                                            (badge, i) => (
                                                                <span
                                                                    key={i}
                                                                    className={`px-1 py-[1px] font-mono text-[10px] font-medium rounded-sm shadow-sm ${
                                                                        badgeStyle[
                                                                            badge.toLowerCase()
                                                                        ] ||
                                                                        "bg-paper text-ink border border-rule"
                                                                    }`}>
                                                                    {badge}
                                                                </span>
                                                            ),
                                                        )}
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
                        <div className="flex justify-center items-center gap-4 font-mono">
                            <button
                                disabled={currentPage === 1}
                                onClick={() =>
                                    setCurrentPage((prev) =>
                                        Math.max(1, prev - 1),
                                    )
                                }
                                aria-label="Previous page"
                                className={twMerge(
                                    "px-3 py-1.5 text-xs uppercase tracking-wide rounded-sm border border-rule bg-paper text-ink hover:border-accent hover:text-accent",
                                    "disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-300",
                                )}>
                                Prev
                            </button>

                            <span className="text-muted text-xs uppercase tracking-wide">
                                Page {currentPage} of {totalPages}
                            </span>

                            <button
                                disabled={currentPage === totalPages}
                                onClick={() =>
                                    setCurrentPage((prev) =>
                                        Math.min(totalPages, prev + 1),
                                    )
                                }
                                aria-label="Next page"
                                className={twMerge(
                                    "px-3 py-1.5 text-xs uppercase tracking-wide rounded-sm border border-rule bg-paper text-ink hover:border-accent hover:text-accent",
                                    "disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-300",
                                )}>
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};
