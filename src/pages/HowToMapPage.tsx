import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import { MAPPING_GUIDE_SECTIONS } from "../data/howToMapData";
import {
    ArrowLeft,
    ArrowRight,
    CheckCircle2,
    ChevronDown,
    ChevronUp,
    Clock,
    Sparkles,
    Compass,
} from "lucide-react";

export const HowToMapPage: React.FC = () => {
    const [expandedId, setExpandedId] = useState<string>(
        MAPPING_GUIDE_SECTIONS[0].id,
    );
    const [activeTab, setActiveTab] = useState<string>("ALL");

    useEffect(() => {
        document.title = "How To Map: Rhythm Game Guide — Antipole";
    }, []);

    const categories = [
        "ALL",
        "Fundamentals",
        "Pattern Theory",
        "Long Notes (LN)",
        "Scroll Velocity (SV)",
        "Hitsounding & Modding",
    ];

    const filteredSections =
        activeTab === "ALL"
            ? MAPPING_GUIDE_SECTIONS
            : MAPPING_GUIDE_SECTIONS.filter(
                  (s) => s.category.toLowerCase() === activeTab.toLowerCase(),
              );

    const toggleExpand = (id: string) => {
        if (expandedId === id) {
            setExpandedId("");
        } else {
            setExpandedId(id);
        }
    };

    return (
        <main
            id="how-to-map-view"
            className="relative h-screen w-full bg-transparent text-[#F5F5F5] overflow-hidden pt-16 sm:pt-20 pb-3 sm:pb-4 px-3 sm:px-6 md:px-8 flex flex-col items-center selection:bg-white selection:text-black">
            {/* Background Ambient Glow */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-175 h-175 rounded-full bg-radial from-[#52B788]/10 via-[#0E2B1E]/5 to-transparent blur-3xl" />
                <div className="absolute inset-0 noise-overlay opacity-30" />
            </div>

            {/* Main Framed Container with Inner Scroll */}
            <div className="relative z-10 w-full max-w-5xl flex-1 min-h-0 bg-[#0A0A0A]/90 border border-white/10 rounded-lg backdrop-blur-xl flex flex-col overflow-hidden shadow-2xl">
                {/* Container Top Header Bar */}
                <header className="shrink-0 flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3 border-b border-white/10 bg-black/40">
                    <div className="flex items-center gap-3">
                        <Link
                            to="/?p=how-to-map"
                            className="group flex items-center gap-1.5 text-xs font-mono tracking-[0.2em] text-white/50 hover:text-white transition-colors">
                            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
                        </Link>
                        <span className="text-white/20 hidden sm:inline">
                            |
                        </span>
                        <span className="text-[12px] font-japanese tracking-[0.3em] text-white/40 uppercase hidden sm:inline">
                            HOW TO MAP
                        </span>
                    </div>

                    {/* Category Tabs in Header */}
                    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                        {categories.map((c) => (
                            <button
                                key={c}
                                onClick={() => setActiveTab(c)}
                                className={`px-3 py-1 rounded-full text-[12px] font-mono tracking-wider uppercase transition-all duration-200 ${
                                    activeTab === c
                                        ? "bg-white text-black font-semibold shadow-sm"
                                        : "bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/5"
                                }`}>
                                {c}
                            </button>
                        ))}
                    </div>
                </header>

                {/* Inner Scrollable Body */}
                <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-5 sm:p-6 md:p-8 space-y-6">
                    {/* Section Hero Banner */}
                    <div className="text-center max-w-2xl mx-auto pt-2 pb-2">
                        <span className="text-[12px] font-mono uppercase tracking-[0.3em] text-[#52B788] block mb-1">
                            THE DEFINITIVE OSU!MANIA MAPPING GUIDE
                        </span>
                        <h1 className="text-2xl sm:text-4xl font-display font-light uppercase tracking-[0.25em] text-white mb-2">
                            HOW TO MAP
                        </h1>
                        <p className="text-xs font-mono text-white/60 leading-relaxed">
                            Step-by-step guides covering audio timing, density
                            balancing, chordjack & stream structuring, Long Note
                            releases, and SV normalization.
                        </p>
                    </div>

                    {/* Accordion Guide Modules */}
                    <div className="space-y-4 text-left">
                        {filteredSections.map((section, idx) => {
                            const isExpanded = expandedId === section.id;
                            return (
                                <motion.div
                                    key={section.id}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.4,
                                        delay: idx * 0.05,
                                    }}
                                    className={`rounded-lg border transition-all duration-300 overflow-hidden ${
                                        isExpanded
                                            ? "border-[#52B788]/40 bg-[#0B1510]/80 shadow-xl"
                                            : "border-white/10 bg-white/2 hover:bg-white/4"
                                    }`}>
                                    {/* Header Button */}
                                    <button
                                        onClick={() => toggleExpand(section.id)}
                                        className="w-full p-4 sm:p-5 flex items-center justify-between text-left gap-4">
                                        <div>
                                            <div className="flex items-center gap-2.5 text-[12px] font-mono tracking-widest text-[#52B788] uppercase mb-1">
                                                <span>{section.category}</span>
                                                <span>•</span>
                                                <span className="flex items-center gap-1 text-white/40">
                                                    <Clock className="w-3 h-3" />
                                                    {section.readTime}
                                                </span>
                                            </div>

                                            <h3 className="text-base sm:text-lg font-display uppercase tracking-wide text-white">
                                                {section.title}
                                            </h3>
                                        </div>

                                        <div className="p-2 rounded-full bg-white/5 border border-white/10 text-white/70">
                                            {isExpanded ? (
                                                <ChevronUp className="w-4 h-4" />
                                            ) : (
                                                <ChevronDown className="w-4 h-4" />
                                            )}
                                        </div>
                                    </button>

                                    {/* Expanded Content Area */}
                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{
                                                    height: 0,
                                                    opacity: 0,
                                                }}
                                                animate={{
                                                    height: "auto",
                                                    opacity: 1,
                                                }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="px-5 pb-6 pt-2 border-t border-white/10 space-y-4">
                                                {/* Summary Banner */}
                                                <div className="p-3 rounded bg-[#52B788]/10 border border-[#52B788]/20 text-xs font-mono text-white/90">
                                                    <strong>SYNOPSIS:</strong>{" "}
                                                    {section.summary}
                                                </div>

                                                {/* Main Tutorial Body */}
                                                <div className="text-xs sm:text-sm font-light text-white/80 leading-relaxed space-y-3 whitespace-pre-line">
                                                    {section.contentMarkdown}
                                                </div>

                                                {/* Key Takeaways Box */}
                                                <div className="p-4 rounded-md bg-black/60 border border-white/10">
                                                    <span className="text-[12px] font-mono uppercase tracking-widest text-[#52B788] flex items-center gap-1.5 mb-2">
                                                        <Sparkles className="w-3.5 h-3.5" />
                                                        <span>
                                                            MAPPER CHECKLIST &
                                                            TAKEAWAYS
                                                        </span>
                                                    </span>
                                                    <ul className="space-y-1.5">
                                                        {section.keyTakeaways.map(
                                                            (takeaway, i) => (
                                                                <li
                                                                    key={i}
                                                                    className="flex items-start gap-2 text-xs font-mono text-white/70">
                                                                    <CheckCircle2 className="w-3.5 h-3.5 text-[#52B788] shrink-0 mt-0.5" />
                                                                    <span>
                                                                        {
                                                                            takeaway
                                                                        }
                                                                    </span>
                                                                </li>
                                                            ),
                                                        )}
                                                    </ul>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Container Bottom Status Footer */}
                <footer className="shrink-0 flex items-center justify-between px-4 sm:px-6 py-2.5 border-t border-white/10 bg-black/40 text-[12px] sm:text-[11px] font-mono text-white/40">
                    <div className="flex items-center gap-3">
                        <span>
                            SHOWING {filteredSections.length} OF{" "}
                            {MAPPING_GUIDE_SECTIONS.length} GUIDE MODULES
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link
                            to="/?p=how-to-map"
                            className="flex items-center gap-1.5 text-white/60 hover:text-white transition-colors">
                            <Compass className="w-3.5 h-3.5" />
                            <span>CAROUSEL</span>
                        </Link>

                        <Link
                            to="/tools"
                            className="flex items-center gap-1.5 text-white hover:text-[#52B788] font-medium transition-colors">
                            <span>NEXT: TOOLS</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                </footer>
            </div>
        </main>
    );
};
