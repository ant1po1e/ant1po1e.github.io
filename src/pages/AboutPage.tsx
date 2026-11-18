import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { PROFILE_DATA } from "../data/profileData";
import { STAFFING_RECORDS } from "../data/staffingData";
import { PROJECTS_LIST } from "../data/projectsData";
import { useContributedBeatmaps } from "../hooks/useContributedBeatmaps";
import {
    ArrowRight,
    Code2,
    Gamepad2,
    ArrowLeft,
    Users,
    Music2,
    Boxes,
} from "lucide-react";

export const AboutPage: React.FC = () => {
    useEffect(() => {
        document.title = "About Antipole (ant1po1e)";
    }, []);

    const currentOccupations = STAFFING_RECORDS.filter((r) =>
        r.date.toLowerCase().includes("present"),
    );

    const recentProjects = PROJECTS_LIST.slice(0, 3);

    const {
        beatmaps,
        loading: beatmapsLoading,
        configured: beatmapsConfigured,
    } = useContributedBeatmaps();
    const recentBeatmaps = beatmaps.slice(0, 3);

    return (
        <main
            id="about-page-view"
            className="relative h-dvh w-full bg-transparent text-ink overflow-hidden pt-16 sm:pt-20 pb-3 sm:pb-4 px-3 sm:px-6 md:px-8 flex flex-col items-center selection:bg-ink selection:text-paper">
            {/* Background Ambient Glows */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-162.5 h-162.5 rounded-full bg-radial from-rose/10 via-rose/15 to-transparent blur-3xl" />
                <div className="absolute inset-0 noise-overlay opacity-30" />
            </div>

            {/* Main Framed Container with Inner Scroll */}
            <div className="relative z-10 w-full max-w-5xl flex-1 min-h-0 bg-paper/85 border border-ink/10 rounded-lg backdrop-blur-xl flex flex-col overflow-hidden shadow-2xl">
                {/* Container Top Header Bar */}
                <header className="shrink-0 flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3 border-b border-ink/10 bg-wash/60">
                    <div className="flex items-center gap-3">
                        <Link
                            to="/?p=projects"
                            className="group flex items-center gap-1.5 text-xs font-mono tracking-[0.2em] text-ink/60 hover:text-ink transition-colors">
                            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
                        </Link>
                        <span className="text-ink/35 hidden sm:inline">
                            |
                        </span>
                        <span className="text-[12px] font-japanese tracking-[0.3em] text-ink/55 uppercase hidden sm:inline">
                            About
                        </span>
                    </div>
                </header>

                {/* Inner Scrollable Body */}
                <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-5 sm:p-6 md:p-8 space-y-6">
                    {/* Section Hero Banner */}
                    <div className="text-center max-w-2xl mx-auto pt-2 pb-2">
                        <h1 className="text-2xl sm:text-4xl font-display font-light uppercase tracking-[0.25em] text-ink mb-2">
                            {PROFILE_DATA.displayName.toUpperCase()}
                        </h1>
                    </div>

                    {/* Bio Block */}
                    <div className="w-full p-6 sm:p-7 rounded-lg border border-ink/10 bg-ink/2 backdrop-blur-md text-left space-y-4">
                        {PROFILE_DATA.bioParagraphs.map((para, i) => (
                            <p
                                key={i}
                                className="text-xs sm:text-sm font-light text-ink/82 leading-relaxed">
                                {para}
                            </p>
                        ))}

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-4 border-t border-ink/10">
                            <Link
                                to="/projects"
                                className="p-3.5 rounded bg-wash/60 border border-ink/5 justify-center items-center flex gap-2 group hover:bg-rose transition duration-300">
                                <Gamepad2 className="w-6 h-6 text-rose-deep mb-1.5 group-hover:text-ink transition duration-300" />
                                <h4 className="text-md font-mono font-bold text-ink uppercase mb-1">
                                    Projects
                                </h4>
                            </Link>

                            <Link
                                to="/staffing"
                                className="p-3.5 rounded bg-wash/60 border border-ink/5 justify-center items-center flex gap-2 group hover:bg-teal transition duration-300">
                                <Users className="w-6 h-6 text-teal-deep mb-1.5 group-hover:text-ink transition duration-300" />
                                <h4 className="text-md font-mono font-bold text-ink uppercase mb-1">
                                    Staffing History
                                </h4>
                            </Link>

                            <Link
                                to="/tools"
                                className="p-3.5 rounded bg-wash/60 border border-ink/5 justify-center items-center flex gap-2 group hover:bg-sage transition duration-300">
                                <Code2 className="w-6 h-6 text-sage-deep mb-1.5 group-hover:text-ink transition duration-300" />
                                <h4 className="text-md font-mono font-bold text-ink uppercase mb-1">
                                    Tools
                                </h4>
                            </Link>
                        </div>
                    </div>

                    {/* Current Snapshot: Occupation, Beatmaps, Projects */}
                    <div className="w-full text-left">
                        <h3 className="text-xs font-mono uppercase tracking-widest text-ink/55 mb-4">
                            CURRENT SNAPSHOT
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                            {/* Current Occupation */}
                            <div className="p-4 rounded border border-ink/10 bg-ink/2 flex flex-col">
                                <div className="flex items-center gap-1.5 mb-3">
                                    <Users className="w-3.5 h-3.5 text-peach-deep" />
                                    <span className="text-xs font-mono font-bold text-ink uppercase tracking-wider">
                                        Current Occupation
                                    </span>
                                </div>
                                <div className="flex flex-col gap-2">
                                    {currentOccupations.length === 0 ? (
                                        <span className="text-[12px] font-mono text-ink/45">
                                            No active roles right now.
                                        </span>
                                    ) : (
                                        currentOccupations.map((record) => (
                                            <a
                                                key={record.id}
                                                href={record.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="group flex flex-col gap-0.5 p-2 rounded bg-wash/60 border border-ink/5 hover:border-peach/40 transition-colors">
                                                <span className="text-[11px] font-medium text-ink/90 group-hover:text-peach-deep transition-colors">
                                                    {record.title}
                                                </span>
                                                <span className="text-[12px] font-mono text-ink/55">
                                                    {record.roles.join(" · ")}
                                                </span>
                                            </a>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Recent Beatmaps */}
                            <div className="p-4 rounded border border-ink/10 bg-ink/2 flex flex-col">
                                <div className="flex items-center gap-1.5 mb-3">
                                    <Music2 className="w-3.5 h-3.5 text-teal-deep" />
                                    <span className="text-xs font-mono font-bold text-ink uppercase tracking-wider">
                                        Recent Beatmaps
                                    </span>
                                </div>
                                <div className="flex flex-col gap-2">
                                    {!beatmapsConfigured ? (
                                        <span className="text-[12px] font-mono text-ink/45">
                                            Beatmap feed not configured.
                                        </span>
                                    ) : beatmapsLoading ? (
                                        <span className="text-[12px] font-mono text-ink/45">
                                            Loading…
                                        </span>
                                    ) : recentBeatmaps.length === 0 ? (
                                        <span className="text-[12px] font-mono text-ink/45">
                                            No beatmaps found.
                                        </span>
                                    ) : (
                                        recentBeatmaps.map((set) => (
                                            <a
                                                key={set.link}
                                                href={set.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="group flex flex-col gap-0.5 p-2 rounded bg-wash/60 border border-ink/5 hover:border-teal/40 transition-colors">
                                                <span className="text-[11px] font-medium text-ink/90 group-hover:text-teal-deep transition-colors truncate">
                                                    {set.title}
                                                </span>
                                                <span className="text-[12px] font-mono text-ink/55 truncate">
                                                    {set.artist}
                                                </span>
                                            </a>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Recent Projects */}
                            <div className="p-4 rounded border border-ink/10 bg-ink/2 flex flex-col">
                                <div className="flex items-center gap-1.5 mb-3">
                                    <Boxes className="w-3.5 h-3.5 text-rose-deep" />
                                    <span className="text-xs font-mono font-bold text-ink uppercase tracking-wider">
                                        Recent Projects
                                    </span>
                                </div>
                                <div className="flex flex-col gap-2">
                                    {recentProjects.map((project) => (
                                        <Link
                                            key={project.id}
                                            to="/projects"
                                            className="group flex flex-col gap-0.5 p-2 rounded bg-wash/60 border border-ink/5 hover:border-rose/40 transition-colors">
                                            <span className="text-[11px] font-medium text-ink/90 group-hover:text-rose-deep transition-colors">
                                                {project.title}
                                            </span>
                                            <span className="text-[12px] font-mono text-ink/55 uppercase">
                                                {project.stack.join(" · ")}
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Container Bottom Status Footer */}
                <footer className="shrink-0 flex items-center justify-between px-4 sm:px-6 py-2.5 border-t border-ink/10 bg-wash/60 text-[12px] sm:text-[11px] font-mono text-ink/55">
                    <div className="flex items-center gap-3">
                        <span>ABOUT // ANTIPOIE ARCHIVE</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link
                            to="/projects"
                            className="flex items-center gap-1.5 text-ink hover:text-rose-deep font-medium transition-colors">
                            <span>PROJECTS</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                </footer>
            </div>
        </main>
    );
};
