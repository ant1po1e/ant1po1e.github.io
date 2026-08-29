import React, {
    useEffect,
    useMemo,
    useRef,
    useState,
    type ReactNode,
} from "react";
import { Link } from "react-router-dom";
import {
    useContributedBeatmaps,
    extractBeatmapsetId,
} from "../hooks/useContributedBeatmaps";
import {
    ArrowLeft,
    ArrowRight,
    RefreshCw,
    Settings2,
} from "lucide-react";

const ITEMS_PER_PAGE = 6;

const BADGE_STYLE: Record<string, string> = {
    ranked: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
    tournaments: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
    contest: "bg-pink-500/15 text-pink-400 border border-pink-500/30",
    hs: "bg-orange-500/15 text-orange-400 border border-orange-500/30",
    collab: "bg-violet-500/15 text-violet-400 border border-violet-500/30",
    gd: "bg-red-500/15 text-red-400 border border-red-500/30",
};

function TruncTooltip({
    children,
    className,
}: {
    children: ReactNode;
    className: string;
}) {
    const ref = useRef<HTMLParagraphElement>(null);
    const [showTooltip, setShowTooltip] = useState(false);

    useEffect(() => {
        if (ref.current) {
            setShowTooltip(ref.current.scrollWidth > ref.current.clientWidth);
        }
    }, [children]);

    return (
        <p
            ref={ref}
            className={`${className} truncate`}
            title={showTooltip ? String(children) : ""}>
            {children}
        </p>
    );
}

export const BeatmapsPage: React.FC = () => {
    const { beatmaps, loading, error, refetch, configured } =
        useContributedBeatmaps();
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedBadge, setSelectedBadge] = useState("ALL");

    useEffect(() => {
        document.title = "Beatmaps & osu!mania — Antipole (ant1po1e)";
        window.scrollTo(0, 0);
    }, []);

    const availableBadges = useMemo(() => {
        const unique = new Set<string>();
        beatmaps.forEach((b) =>
            b.badges?.forEach((badge) => unique.add(badge)),
        );
        return ["ALL", ...Array.from(unique)];
    }, [beatmaps]);

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedBadge]);

    const filteredBeatmaps =
        selectedBadge === "ALL"
            ? beatmaps
            : beatmaps.filter((b) => b.badges?.includes(selectedBadge));

    const totalPages = Math.ceil(filteredBeatmaps.length / ITEMS_PER_PAGE);
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentBeatmaps = filteredBeatmaps.slice(
        start,
        start + ITEMS_PER_PAGE,
    );

    return (
        <main
            id="beatmaps-page-view"
            className="relative h-screen w-full bg-transparent text-[#F5F5F5] overflow-hidden pt-16 sm:pt-20 pb-3 sm:pb-4 px-3 sm:px-6 md:px-8 flex flex-col items-center selection:bg-white selection:text-black">
            {/* Ambient background glow */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-175 h-175 rounded-full bg-radial from-[#C95767]/10 via-[#3B1119]/5 to-transparent blur-3xl" />
                <div className="absolute inset-0 noise-overlay opacity-30" />
            </div>

            {/* Main Framed Container with Inner Scroll */}
            <div className="relative z-10 w-full max-w-6xl flex-1 min-h-0 bg-[#0A0A0A]/90 border border-white/10 rounded-lg backdrop-blur-xl flex flex-col overflow-hidden shadow-2xl">
                {/* Container Top Header Bar */}
                <header className="shrink-0 flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3 border-b border-white/10 bg-black/40">
                    <div className="flex items-center gap-3">
                        <Link
                            to="/?p=beatmaps"
                            className="group flex items-center gap-1.5 text-xs font-mono tracking-[0.2em] text-white/50 hover:text-white transition-colors">
                            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
                        </Link>
                        <span className="text-white/20 hidden sm:inline">
                            |
                        </span>
                        <span className="text-[12px] font-japanese tracking-[0.3em] text-white/40 uppercase hidden sm:inline">
                            CONTRIBUTED BEATMAPS
                        </span>
                    </div>

                    {/* Badge Filter Tabs (dynamic — derived from the fetched feed) */}
                    {configured && availableBadges.length > 1 && !error && (
                        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                            {availableBadges.map((b) => (
                                <button
                                    key={b}
                                    onClick={() => setSelectedBadge(b)}
                                    className={`px-2.5 py-0.5 rounded text-[12px] font-mono uppercase tracking-wider whitespace-nowrap transition-colors ${
                                        selectedBadge === b
                                            ? "bg-white text-black font-semibold"
                                            : "bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10"
                                    }`}>
                                    {b}
                                </button>
                            ))}
                        </div>
                    )}
                </header>

                {/* Inner Scrollable Body */}
                <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-5 sm:p-6 md:p-8">
                    {/* Section Hero Banner */}
                    <div className="text-center max-w-2xl mx-auto pt-2 pb-6">
                        <h1 className="text-2xl sm:text-4xl font-display font-light uppercase tracking-[0.25em] text-white mb-2">
                            Contributed Beatmaps
                        </h1>
                    </div>

                    {/* Not Configured State */}
                    {!configured ? (
                        <div className="max-w-md mx-auto p-6 rounded-lg border border-white/10 bg-white/2 text-center space-y-2">
                            <Settings2 className="w-5 h-5 text-white/30 mx-auto" />
                            <p className="font-mono text-xs text-white/60">
                                Beatmap feed isn't configured yet.
                            </p>
                            <p className="font-mono text-[12px] text-white/30 leading-relaxed">
                                Set{" "}
                                <code className="text-white/50">
                                    VITE_BEATMAP_FEED_URL
                                </code>{" "}
                                in <code className="text-white/50">.env</code>{" "}
                                (see{" "}
                                <code className="text-white/50">
                                    .env.example
                                </code>
                                ) and restart the dev server.
                            </p>
                        </div>
                    ) : error ? (
                        /* Error State */
                        <div className="max-w-md mx-auto p-6 rounded-lg border border-white/10 bg-white/2 text-center space-y-3">
                            <p className="font-mono text-xs text-red-400">
                                {error}
                            </p>
                            <button
                                onClick={refetch}
                                className="inline-flex items-center gap-1.5 font-mono text-[12px] uppercase tracking-wide px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 text-white transition-colors">
                                <RefreshCw className="w-3 h-3" />
                                <span>Retry</span>
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* Beatmaps Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {loading ? (
                                    [...Array(6)].map((_, i) => (
                                        <div
                                            key={i}
                                            className="relative w-full h-37.5 overflow-hidden rounded-lg border border-white/10 bg-white/3">
                                            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-linear-to-r from-transparent via-white/10 to-transparent" />
                                        </div>
                                    ))
                                ) : filteredBeatmaps.length === 0 ? (
                                    <div className="col-span-full font-mono text-xs text-white/40 py-10 text-center">
                                        No beatmaps found for this badge.
                                    </div>
                                ) : (
                                    currentBeatmaps.map((set, index) => {
                                        const beatmapId = extractBeatmapsetId(
                                            set.link,
                                        );
                                        return (
                                            <a
                                                key={`${set.link}-${index}`}
                                                href={set.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="group relative h-37.5 rounded-lg border border-black overflow-hidden transition-all duration-300 hover:border-[#C95767]"
                                                style={{
                                                    backgroundImage: `url(https://assets.ppy.sh/beatmaps/${beatmapId}/covers/card.jpg)`,
                                                    backgroundSize: "cover",
                                                    backgroundPosition:
                                                        "center",
                                                }}
                                                aria-label={`Beatmap ${set.title} by ${set.artist}`}>
                                                <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-black/10 p-4 flex flex-col justify-end transition-colors duration-300 group-hover:from-black/90">
                                                    <TruncTooltip className="font-display italic text-base text-white mb-0.5">
                                                        {set.title}
                                                    </TruncTooltip>
                                                    <TruncTooltip className="font-mono text-[12px] text-white/70 mb-1.5">
                                                        {set.artist}
                                                    </TruncTooltip>

                                                    {set.badges &&
                                                        set.badges.length >
                                                            0 && (
                                                            <div className="flex flex-wrap gap-1">
                                                                {set.badges.map(
                                                                    (
                                                                        badge,
                                                                        i,
                                                                    ) => (
                                                                        <span
                                                                            key={
                                                                                i
                                                                            }
                                                                            className={`px-1.5 py-px font-mono text-[9px] uppercase font-medium rounded-sm ${
                                                                                BADGE_STYLE[
                                                                                    badge.toLowerCase()
                                                                                ] ||
                                                                                "bg-white/10 text-white/70 border border-white/15"
                                                                            }`}>
                                                                            {
                                                                                badge
                                                                            }
                                                                        </span>
                                                                    ),
                                                                )}
                                                            </div>
                                                        )}
                                                </div>
                                            </a>
                                        );
                                    })
                                )}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && !loading && (
                                <div className="flex justify-center items-center gap-4 font-mono mt-6">
                                    <button
                                        disabled={currentPage === 1}
                                        onClick={() =>
                                            setCurrentPage((prev) =>
                                                Math.max(1, prev - 1),
                                            )
                                        }
                                        aria-label="Previous page"
                                        className="px-3 py-1.5 text-[12px] uppercase tracking-wide rounded bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                                        Prev
                                    </button>

                                    <span className="text-white/40 text-[12px] uppercase tracking-wide">
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
                                        className="px-3 py-1.5 text-[12px] uppercase tracking-wide rounded bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                                        Next
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Container Bottom Status Footer */}
                <footer className="shrink-0 flex items-center justify-between px-4 sm:px-6 py-2.5 border-t border-white/10 bg-black/40 text-[12px] sm:text-[11px] font-mono text-white/40">
                    <div className="flex items-center gap-3">
                        <span>
                            {configured
                                ? `SHOWING ${filteredBeatmaps.length} OF ${beatmaps.length} CHARTS`
                                : "FEED NOT CONFIGURED"}
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link
                            to="/staffing"
                            className="flex items-center gap-1.5 text-white hover:text-[#C95767] font-medium transition-colors">
                            <span>STAFFING</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                </footer>
            </div>
        </main>
    );
};
