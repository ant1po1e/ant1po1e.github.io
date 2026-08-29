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
            className="relative h-screen w-full bg-transparent text-[#F5F5F5] overflow-hidden pt-16 sm:pt-20 pb-3 sm:pb-4 px-3 sm:px-6 md:px-8 flex flex-col items-center selection:bg-white selection:text-black">
            {/* Background Ambient Glows */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-162.5 h-162.5 rounded-full bg-radial from-[#7B68EE]/10 via-[#1A153B]/5 to-transparent blur-3xl" />
                <div className="absolute inset-0 noise-overlay opacity-30" />
            </div>

            {/* Main Framed Container with Inner Scroll */}
            <div className="relative z-10 w-full max-w-5xl flex-1 min-h-0 bg-[#0A0A0A]/90 border border-white/10 rounded-lg backdrop-blur-xl flex flex-col overflow-hidden shadow-2xl">
                {/* Container Top Header Bar */}
                <header className="shrink-0 flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3 border-b border-white/10 bg-black/40">
                    <div className="flex items-center gap-3">
                        <Link
                            to="/?p=projects"
                            className="group flex items-center gap-1.5 text-xs font-mono tracking-[0.2em] text-white/50 hover:text-white transition-colors">
                            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
                        </Link>
                        <span className="text-white/20 hidden sm:inline">
                            |
                        </span>
                        <span className="text-[12px] font-japanese tracking-[0.3em] text-white/40 uppercase hidden sm:inline">
                            About
                        </span>
                    </div>
                </header>

                {/* Inner Scrollable Body */}
                <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-5 sm:p-6 md:p-8 space-y-6">
                    {/* Section Hero Banner */}
                    <div className="text-center max-w-2xl mx-auto pt-2 pb-2">
                        <h1 className="text-2xl sm:text-4xl font-display font-light uppercase tracking-[0.25em] text-white mb-2">
                            {PROFILE_DATA.displayName.toUpperCase()}
                        </h1>
                    </div>

                    {/* Bio Block */}
                    <div className="w-full p-6 sm:p-7 rounded-lg border border-white/10 bg-white/2 backdrop-blur-md text-left space-y-4">
                        {PROFILE_DATA.bioParagraphs.map((para, i) => (
                            <p
                                key={i}
                                className="text-xs sm:text-sm font-light text-white/80 leading-relaxed">
                                {para}
                            </p>
                        ))}

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-4 border-t border-white/10">
                            <Link
                                to="/projects"
                                className="p-3.5 rounded bg-black/40 border border-white/5 justify-center items-center flex gap-2 group hover:bg-[#7B68EE] transition duration-300">
                                <Gamepad2 className="w-6 h-6 text-[#7B68EE] mb-1.5 group-hover:text-white transition duration-300" />
                                <h4 className="text-md font-mono font-bold text-white uppercase mb-1">
                                    Projects
                                </h4>
                            </Link>

                            <Link
                                to="/staffing"
                                className="p-3.5 rounded bg-black/40 border border-white/5 justify-center items-center flex gap-2 group hover:bg-[#C95767] transition duration-300">
                                <Users className="w-6 h-6 text-[#C95767] mb-1.5 group-hover:text-white transition duration-300" />
                                <h4 className="text-md font-mono font-bold text-white uppercase mb-1">
                                    Staffing History
                                </h4>
                            </Link>

                            <Link
                                to="/tools"
                                className="p-3.5 rounded bg-black/40 border border-white/5 justify-center items-center flex gap-2 group hover:bg-[#52B788] transition duration-300">
                                <Code2 className="w-6 h-6 text-[#52B788] mb-1.5 group-hover:text-white transition duration-300" />
                                <h4 className="text-md font-mono font-bold text-white uppercase mb-1">
                                    Tools
                                </h4>
                            </Link>
                        </div>
                    </div>

                    {/* Current Snapshot: Occupation, Beatmaps, Projects */}
                    <div className="w-full text-left">
                        <h3 className="text-xs font-mono uppercase tracking-widest text-white/40 mb-4">
                            CURRENT SNAPSHOT
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                            {/* Current Occupation */}
                            <div className="p-4 rounded border border-white/10 bg-white/2 flex flex-col">
                                <div className="flex items-center gap-1.5 mb-3">
                                    <Users className="w-3.5 h-3.5 text-[#E0A96D]" />
                                    <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                                        Current Occupation
                                    </span>
                                </div>
                                <div className="flex flex-col gap-2">
                                    {currentOccupations.length === 0 ? (
                                        <span className="text-[12px] font-mono text-white/30">
                                            No active roles right now.
                                        </span>
                                    ) : (
                                        currentOccupations.map((record) => (
                                            <a
                                                key={record.id}
                                                href={record.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="group flex flex-col gap-0.5 p-2 rounded bg-black/40 border border-white/5 hover:border-[#E0A96D]/40 transition-colors">
                                                <span className="text-[11px] font-medium text-white/90 group-hover:text-[#E0A96D] transition-colors">
                                                    {record.title}
                                                </span>
                                                <span className="text-[12px] font-mono text-white/40">
                                                    {record.roles.join(" · ")}
                                                </span>
                                            </a>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Recent Beatmaps */}
                            <div className="p-4 rounded border border-white/10 bg-white/2 flex flex-col">
                                <div className="flex items-center gap-1.5 mb-3">
                                    <Music2 className="w-3.5 h-3.5 text-[#C95767]" />
                                    <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                                        Recent Beatmaps
                                    </span>
                                </div>
                                <div className="flex flex-col gap-2">
                                    {!beatmapsConfigured ? (
                                        <span className="text-[12px] font-mono text-white/30">
                                            Beatmap feed not configured.
                                        </span>
                                    ) : beatmapsLoading ? (
                                        <span className="text-[12px] font-mono text-white/30">
                                            Loading…
                                        </span>
                                    ) : recentBeatmaps.length === 0 ? (
                                        <span className="text-[12px] font-mono text-white/30">
                                            No beatmaps found.
                                        </span>
                                    ) : (
                                        recentBeatmaps.map((set) => (
                                            <a
                                                key={set.link}
                                                href={set.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="group flex flex-col gap-0.5 p-2 rounded bg-black/40 border border-white/5 hover:border-[#C95767]/40 transition-colors">
                                                <span className="text-[11px] font-medium text-white/90 group-hover:text-[#C95767] transition-colors truncate">
                                                    {set.title}
                                                </span>
                                                <span className="text-[12px] font-mono text-white/40 truncate">
                                                    {set.artist}
                                                </span>
                                            </a>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Recent Projects */}
                            <div className="p-4 rounded border border-white/10 bg-white/2 flex flex-col">
                                <div className="flex items-center gap-1.5 mb-3">
                                    <Boxes className="w-3.5 h-3.5 text-[#7B68EE]" />
                                    <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                                        Recent Projects
                                    </span>
                                </div>
                                <div className="flex flex-col gap-2">
                                    {recentProjects.map((project) => (
                                        <Link
                                            key={project.id}
                                            to="/projects"
                                            className="group flex flex-col gap-0.5 p-2 rounded bg-black/40 border border-white/5 hover:border-[#7B68EE]/40 transition-colors">
                                            <span className="text-[11px] font-medium text-white/90 group-hover:text-[#7B68EE] transition-colors">
                                                {project.title}
                                            </span>
                                            <span className="text-[12px] font-mono text-white/40 uppercase">
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
                <footer className="shrink-0 flex items-center justify-between px-4 sm:px-6 py-2.5 border-t border-white/10 bg-black/40 text-[12px] sm:text-[11px] font-mono text-white/40">
                    <div className="flex items-center gap-3">
                        <span>ABOUT // ANTIPOIE ARCHIVE</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link
                            to="/projects"
                            className="flex items-center gap-1.5 text-white hover:text-[#7B68EE] font-medium transition-colors">
                            <span>PROJECTS</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                </footer>
            </div>
        </main>
    );
};
