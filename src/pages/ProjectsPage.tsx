import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { PROJECTS_LIST } from "../data/projectsData";
import { useIsMobile } from "../hooks/useIsMobile";
import { useSwap } from "../hooks/useSwap";
import { Draggable, EASE, gsap, useGSAP, withMotion } from "../lib/motionUtils";
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
    const isMobile = useIsMobile();
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

    // Slide animation: the old card leaves in the direction of travel, then
    // the new one enters from the opposite side (the GSAP version of
    // AnimatePresence mode="wait" with `custom={direction}`). Options are read
    // when each animation starts, so they always use the latest direction.
    const slideRef = useRef<HTMLDivElement>(null);
    const shownProject = useSwap(currentProject, currentProject.id, slideRef, {
        exit: withMotion(isMobile, {
            x: direction > 0 ? -60 : 60,
            opacity: 0,
            duration: 0.35,
            ease: EASE.soft,
        }),
        enterFrom: { x: direction > 0 ? 60 : -60, opacity: 0 },
        enterTo: withMotion(isMobile, {
            x: 0,
            opacity: 1,
            duration: 0.35,
            ease: EASE.soft,
        }),
    });

    // Swipe: GSAP Draggable on a wrapper around the card (a separate element
    // from the one the slide animation moves, so the two never fight over the
    // same transform). Pulling past the threshold changes project; the card
    // always springs back to rest.
    const dragRef = useRef<HTMLDivElement>(null);
    const swipeHandlersRef = useRef({ next: handleNext, prev: handlePrev });
    swipeHandlersRef.current = { next: handleNext, prev: handlePrev };
    const isMobileRef = useRef(isMobile);
    isMobileRef.current = isMobile;

    useGSAP(
        () => {
            const el = dragRef.current;
            if (!el) return;

            const threshold = 60;
            let pressX = 0;

            const [draggable] = Draggable.create(el, {
                type: "x",
                bounds: { minX: 0, maxX: 0 },
                edgeResistance: 0.85,
                zIndexBoost: false,
                onPress(this: Draggable) {
                    pressX = this.pointerX;
                },
                onDragEnd(this: Draggable) {
                    const offset = this.pointerX - pressX;
                    if (offset < -threshold) {
                        swipeHandlersRef.current.next();
                    } else if (offset > threshold) {
                        swipeHandlersRef.current.prev();
                    }
                    gsap.to(el, {
                        x: 0,
                        overwrite: true,
                        ...withMotion(isMobileRef.current, {
                            duration: 0.45,
                            ease: EASE.soft,
                        }),
                    });
                },
            });

            return () => draggable.kill();
        },
        { scope: dragRef },
    );

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") handleNext();
            if (e.key === "ArrowLeft") handlePrev();
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [handleNext, handlePrev]);

    const CurrentIcon = ICON_MAP[shownProject.icon] || LinkIcon;

    return (
        <main
            id="projects-page-view"
            className="relative h-dvh w-full bg-transparent text-ink overflow-hidden pt-16 sm:pt-20 pb-3 sm:pb-4 px-3 sm:px-6 md:px-8 flex flex-col items-center selection:bg-ink selection:text-paper">
            {/* Background Ambient Glow */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-175 h-175 rounded-full bg-radial from-rose/10 via-rose/15 to-transparent blur-3xl" />
                <div className="absolute inset-0 noise-overlay opacity-30" />
            </div>

            {/* Main Framed Container */}
            <div className="relative z-10 w-full max-w-6xl flex-1 min-h-0 bg-paper/85 border border-ink/10 rounded-lg backdrop-blur-xl flex flex-col overflow-hidden shadow-2xl">
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
                            PROJECTS
                        </span>
                    </div>
                </header>

                {/* Inner Fixed Body — No Scroll, Carousel Instead */}
                <div className="flex-1 min-h-0 flex flex-col p-4 sm:p-6 md:p-8 gap-4 overflow-hidden">
                    {/* Section Hero Banner */}
                    <div className="text-center max-w-2xl mx-auto shrink-0">
                        <h1 className="text-xl sm:text-3xl font-display font-light uppercase tracking-[0.25em] text-ink mb-1">
                            PROJECTS
                        </h1>
                    </div>

                    {/* Carousel Stage */}
                    <div className="relative flex-1 min-h-0 flex items-center justify-center gap-2 sm:gap-4">
                        {/* Prev Arrow */}
                        <button
                            onClick={handlePrev}
                            aria-label="Previous project"
                            className="shrink-0 z-10 p-2 sm:p-2.5 rounded-full border border-ink/10 bg-ink/10 hover:bg-ink/20 text-ink/68 hover:text-ink backdrop-blur-md transition-colors cursor-pointer">
                            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>

                        {/* Card Viewport */}
                        <div className="relative flex-1 h-full max-w-2xl overflow-hidden">
                            <div
                                ref={dragRef}
                                className="h-full w-full cursor-grab active:cursor-grabbing">
                                <div
                                    ref={slideRef}
                                    className="group relative h-full w-full rounded-lg border border-ink/10 bg-ink/2 hover:bg-ink/4 backdrop-blur-md overflow-hidden transition-colors duration-300 hover:border-ink/25 flex flex-col">
                                    {/* Project Image */}
                                    <div className="relative w-full flex-1 min-h-0 overflow-hidden bg-wash/60">
                                        <img
                                            src={shownProject.image}
                                            alt={shownProject.alt}
                                            referrerPolicy="no-referrer"
                                            draggable={false}
                                            className="w-full h-full object-cover pointer-events-none select-none"
                                        />

                                        <div className="absolute inset-0 bg-linear-to-t from-paper via-paper/75 to-transparent opacity-100 hover:from-paper hover:via-paper/85 hover:to-paper/30 transition-colors duration-300">
                                            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                                                <div className="flex items-center gap-2 text-[12px] font-mono text-ink/82 mb-2">
                                                    <span>
                                                        {PROJECTS_LIST.indexOf(
                                                            shownProject,
                                                        ) + 1}{" "}
                                                        / {PROJECTS_LIST.length}
                                                    </span>
                                                </div>

                                                <h3 className="text-lg sm:text-2xl font-display uppercase tracking-wider text-ink group-hover:text-rose-deep transition-colors mb-2">
                                                    {shownProject.title}
                                                </h3>

                                                <div className="flex flex-wrap gap-1.5 mb-4">
                                                    {shownProject.stack.map(
                                                        (s) => (
                                                            <span
                                                                key={s}
                                                                className="px-2 py-0.5 rounded bg-ink/10 text-[12px] font-mono uppercase text-ink/75 border border-ink/10">
                                                                {s}
                                                            </span>
                                                        ),
                                                    )}
                                                </div>

                                                {shownProject.link ? (
                                                    <a
                                                        href={shownProject.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2 px-4 py-2 rounded bg-ink hover:bg-ink/90 text-paper text-xs font-mono font-semibold tracking-wider transition-colors">
                                                        <CurrentIcon className="w-3.5 h-3.5" />
                                                        <span>
                                                            {
                                                                shownProject.linkText
                                                            }
                                                        </span>
                                                    </a>
                                                ) : (
                                                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded bg-ink/10 text-ink/60 text-xs font-mono font-semibold tracking-wider border border-ink/10">
                                                        <CurrentIcon className="w-3.5 h-3.5" />
                                                        <span>
                                                            {
                                                                shownProject.linkText
                                                            }
                                                        </span>
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Next Arrow */}
                        <button
                            onClick={handleNext}
                            aria-label="Next project"
                            className="shrink-0 z-10 p-2 sm:p-2.5 rounded-full border border-ink/10 bg-ink/10 hover:bg-ink/20 text-ink/68 hover:text-ink backdrop-blur-md transition-colors cursor-pointer">
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
                                        ? "w-6 bg-ink"
                                        : "w-1.5 bg-ink/25 hover:bg-ink/50"
                                }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Container Bottom Status Footer */}
                <footer className="shrink-0 flex items-center justify-between px-4 sm:px-6 py-2.5 border-t border-ink/10 bg-wash/60 text-[12px] sm:text-[11px] font-mono text-ink/55">
                    <div className="flex items-center gap-3">
                        <span>
                            VIEWING {activeIndex + 1} OF {PROJECTS_LIST.length}{" "}
                            ENTRIES
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link
                            to="/beatmaps"
                            className="flex items-center gap-1.5 text-ink hover:text-rose-deep font-medium transition-colors">
                            <span>BEATMAPS</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                </footer>
            </div>
        </main>
    );
};
