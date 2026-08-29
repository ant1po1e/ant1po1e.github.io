import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, PanInfo } from "motion/react";
import { Link } from "react-router-dom";
import { PROJECTS_LIST } from "../data/projectsData";
import {
    ArrowLeft,
    ArrowRight,
    ChevronLeft,
    ChevronRight,
    Link as LinkIcon,
    Lock,
    Store,
    Code,
} from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
    link: LinkIcon,
    lock: Lock,
    store: Store,
    code: Code,
};

export const ProjectsPage: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [direction, setDirection] = useState<number>(1);

    useEffect(() => {
        document.title = "Projects & Games — Antipole (ant1po1e)";
    }, []);

    const currentProject = PROJECTS_LIST[activeIndex] || PROJECTS_LIST[0];

    const goToIndex = useCallback(
        (index: number) => {
            if (PROJECTS_LIST.length === 0) return;
            const wrapped =
                (index + PROJECTS_LIST.length) % PROJECTS_LIST.length;
            setDirection(wrapped > activeIndex ? 1 : -1);
            setActiveIndex(wrapped);
        },
        [activeIndex],
    );

    const handleNext = useCallback(() => {
        setDirection(1);
        goToIndex(activeIndex + 1);
    }, [activeIndex, goToIndex]);

    const handlePrev = useCallback(() => {
        setDirection(-1);
        goToIndex(activeIndex - 1);
    }, [activeIndex, goToIndex]);

    const handleDragEnd = (_e: unknown, info: PanInfo) => {
        const threshold = 60;
        if (info.offset.x < -threshold) {
            handleNext();
        } else if (info.offset.x > threshold) {
            handlePrev();
        }
    };

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") handleNext();
            if (e.key === "ArrowLeft") handlePrev();
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [handleNext, handlePrev]);

    const slideVariants = {
        enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
    };

    const CurrentIcon = ICON_MAP[currentProject.icon] || LinkIcon;

    return (
        <main
            id="projects-page-view"
            className="relative h-screen w-full bg-transparent text-[#F5F5F5] overflow-hidden pt-16 sm:pt-20 pb-3 sm:pb-4 px-3 sm:px-6 md:px-8 flex flex-col items-center selection:bg-white selection:text-black">
            {/* Background Ambient Glow */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-175 h-175 rounded-full bg-radial from-[#7B68EE]/10 via-[#1A153B]/5 to-transparent blur-3xl" />
                <div className="absolute inset-0 noise-overlay opacity-30" />
            </div>

            {/* Main Framed Container */}
            <div className="relative z-10 w-full max-w-6xl flex-1 min-h-0 bg-[#0A0A0A]/90 border border-white/10 rounded-lg backdrop-blur-xl flex flex-col overflow-hidden shadow-2xl">
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
                            PROJECTS
                        </span>
                    </div>
                </header>

                {/* Inner Fixed Body — No Scroll, Carousel Instead */}
                <div className="flex-1 min-h-0 flex flex-col p-4 sm:p-6 md:p-8 gap-4 overflow-hidden">
                    {/* Section Hero Banner */}
                    <div className="text-center max-w-2xl mx-auto shrink-0">
                        <h1 className="text-xl sm:text-3xl font-display font-light uppercase tracking-[0.25em] text-white mb-1">
                            PROJECTS
                        </h1>
                    </div>

                    {/* Carousel Stage */}
                    <div className="relative flex-1 min-h-0 flex items-center justify-center gap-2 sm:gap-4">
                        {/* Prev Arrow */}
                        <button
                            onClick={handlePrev}
                            aria-label="Previous project"
                            className="shrink-0 z-10 p-2 sm:p-2.5 rounded-full border border-white/10 bg-white/10 hover:bg-white/20 text-white/60 hover:text-white backdrop-blur-md transition-colors cursor-pointer">
                            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>

                        {/* Card Viewport */}
                        <div className="relative flex-1 h-full max-w-2xl overflow-hidden">
                            <AnimatePresence mode="wait" custom={direction}>
                                <motion.div
                                    key={currentProject.id}
                                    custom={direction}
                                    variants={slideVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{
                                        duration: 0.35,
                                        ease: [0.22, 1, 0.36, 1],
                                    }}
                                    drag="x"
                                    dragConstraints={{ left: 0, right: 0 }}
                                    dragElastic={0.15}
                                    onDragEnd={handleDragEnd}
                                    className="group relative h-full w-full rounded-lg border border-white/10 bg-white/2 hover:bg-white/4 backdrop-blur-md overflow-hidden transition-colors duration-300 hover:border-white/25 flex flex-col cursor-grab active:cursor-grabbing">
                                    {/* Project Image */}
                                    <div className="relative w-full flex-1 min-h-0 overflow-hidden bg-black/40">
                                        <img
                                            src={currentProject.image}
                                            alt={currentProject.alt}
                                            referrerPolicy="no-referrer"
                                            draggable={false}
                                            className="w-full h-full object-cover pointer-events-none select-none"
                                        />

                                        <div className="absolute inset-0 bg-linear-to-t from-black via-black/25 to-transparent opacity-100 hover:from-black hover:via-black/50 hover:to-black/25 transition-colors duration-300">
                                            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                                                <div className="flex items-center gap-2 text-[12px] font-mono text-white/80 mb-2">
                                                    <span>
                                                        {activeIndex + 1} /{" "}
                                                        {PROJECTS_LIST.length}
                                                    </span>
                                                </div>

                                                <h3 className="text-lg sm:text-2xl font-display uppercase tracking-wider text-white group-hover:text-[#7B68EE] transition-colors mb-2">
                                                    {currentProject.title}
                                                </h3>

                                                <div className="flex flex-wrap gap-1.5 mb-4">
                                                    {currentProject.stack.map(
                                                        (s) => (
                                                            <span
                                                                key={s}
                                                                className="px-2 py-0.5 rounded bg-white/10 text-[12px] font-mono uppercase text-white/70 border border-white/10">
                                                                {s}
                                                            </span>
                                                        ),
                                                    )}
                                                </div>

                                                {currentProject.link ? (
                                                    <a
                                                        href={
                                                            currentProject.link
                                                        }
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2 px-4 py-2 rounded bg-white hover:bg-white/90 text-black text-xs font-mono font-semibold tracking-wider transition-colors">
                                                        <CurrentIcon className="w-3.5 h-3.5" />
                                                        <span>
                                                            {
                                                                currentProject.linkText
                                                            }
                                                        </span>
                                                    </a>
                                                ) : (
                                                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded bg-white/10 text-white/50 text-xs font-mono font-semibold tracking-wider border border-white/10">
                                                        <CurrentIcon className="w-3.5 h-3.5" />
                                                        <span>
                                                            {
                                                                currentProject.linkText
                                                            }
                                                        </span>
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Next Arrow */}
                        <button
                            onClick={handleNext}
                            aria-label="Next project"
                            className="shrink-0 z-10 p-2 sm:p-2.5 rounded-full border border-white/10 bg-white/10 hover:bg-white/20 text-white/60 hover:text-white backdrop-blur-md transition-colors cursor-pointer">
                            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                    </div>

                    {/* Dot Indicators */}
                    <div className="flex items-center justify-center gap-1.5 shrink-0 flex-wrap max-w-full">
                        {PROJECTS_LIST.map((p, idx) => (
                            <button
                                key={p.id}
                                onClick={() => goToIndex(idx)}
                                aria-label={`Go to ${p.title}`}
                                className={`h-1.5 rounded-full transition-all duration-300 ${
                                    idx === activeIndex
                                        ? "w-6 bg-white"
                                        : "w-1.5 bg-white/25 hover:bg-white/50"
                                }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Container Bottom Status Footer */}
                <footer className="shrink-0 flex items-center justify-between px-4 sm:px-6 py-2.5 border-t border-white/10 bg-black/40 text-[12px] sm:text-[11px] font-mono text-white/40">
                    <div className="flex items-center gap-3">
                        <span>
                            VIEWING {activeIndex + 1} OF {PROJECTS_LIST.length}{" "}
                            ENTRIES
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link
                            to="/beatmaps"
                            className="flex items-center gap-1.5 text-white hover:text-[#7B68EE] font-medium transition-colors">
                            <span>BEATMAPS</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                </footer>
            </div>
        </main>
    );
};
