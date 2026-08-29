import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { SnapCalculator } from "../components/tools/SnapCalculator";
import { BBCodeColorizer } from "../components/tools/BBCodeColorizer";
import { SkillRadarCard } from "../components/tools/SkillRadarCard";
import {
    ArrowLeft,
    ArrowRight,
    Calculator,
    Palette,
    UserSquare2,
    ArrowUpRight,
} from "lucide-react";

type ToolKey = "snap" | "bbcode" | "skillcard";

const TOOL_TABS: { key: ToolKey; label: string; icon: React.ElementType }[] = [
    { key: "snap", label: "SNAP CALC", icon: Calculator },
    { key: "bbcode", label: "BBCODE", icon: Palette },
    { key: "skillcard", label: "SKILL CARD", icon: UserSquare2 },
];

export const ToolsPage: React.FC = () => {
    const [activeTool, setActiveTool] = useState<ToolKey>("snap");

    useEffect(() => {
        document.title = "Tools & Calculators — Antipole";
    }, []);

    return (
        <main
            id="tools-page-view"
            className="relative h-screen w-full bg-transparent text-[#F5F5F5] overflow-hidden pt-16 sm:pt-20 pb-3 sm:pb-4 px-3 sm:px-6 md:px-8 flex flex-col items-center selection:bg-white selection:text-black">
            {/* Background Ambient Glow */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-175 h-175 rounded-full bg-radial from-[#4E82B8]/10 via-[#0D223A]/5 to-transparent blur-3xl" />
                <div className="absolute inset-0 noise-overlay opacity-30" />
            </div>

            {/* Main Framed Container with Inner Scroll */}
            <div className="relative z-10 w-full max-w-5xl flex-1 min-h-0 bg-[#0A0A0A]/90 border border-white/10 rounded-lg backdrop-blur-xl flex flex-col overflow-hidden shadow-2xl">
                {/* Container Top Header Bar */}
                <header className="shrink-0 flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3 border-b border-white/10 bg-black/40">
                    <div className="flex items-center gap-3">
                        <Link
                            to="/?p=tools"
                            className="group flex items-center gap-1.5 text-xs font-mono tracking-[0.2em] text-white/50 hover:text-white transition-colors">
                            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
                        </Link>
                        <span className="text-white/20 hidden sm:inline">
                            |
                        </span>
                        <span className="text-[12px] font-japanese tracking-[0.3em] text-white/40 uppercase hidden sm:inline">
                            TOOLS
                        </span>
                    </div>

                    {/* Tool Switcher Tabs in Header */}
                    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                        {TOOL_TABS.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTool(tab.key)}
                                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-[12px] font-mono tracking-wider uppercase whitespace-nowrap transition-all duration-200 ${
                                        activeTool === tab.key
                                            ? "bg-white text-black font-bold shadow-sm"
                                            : "bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/5"
                                    }`}>
                                    <Icon className="w-3 h-3" />
                                    <span>{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </header>

                {/* Inner Scrollable Body */}
                <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-5 sm:p-6 md:p-8 space-y-6">
                    {/* Section Hero Banner */}
                    <div className="text-center max-w-2xl mx-auto pt-2 pb-2">
                        <h1 className="text-2xl sm:text-4xl font-display font-light uppercase tracking-[0.25em] text-white mb-2">
                            TOOLS
                        </h1>
                    </div>

                    {/* Active Tool Panel */}
                    <motion.div
                        key={activeTool}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}>
                        {activeTool === "snap" && <SnapCalculator />}
                        {activeTool === "bbcode" && <BBCodeColorizer />}
                        {activeTool === "skillcard" && <SkillRadarCard />}
                    </motion.div>

                    {/* External Tool — Barline Scope */}
                    <a
                        href="https://barline-scope.vercel.app/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between p-5 rounded-lg border border-white/10 bg-white/2 hover:bg-white/5 hover:border-[#4E82B8]/40 backdrop-blur-md transition-all duration-300">
                        <div>
                            <span className="text-[12px] font-mono uppercase tracking-widest text-[#4E82B8] block mb-1">
                                EXTERNAL TOOL
                            </span>
                            <h3 className="text-base font-display uppercase tracking-wider text-white group-hover:text-[#4E82B8] transition-colors">
                                Barline Scope
                            </h3>
                        </div>
                        <ArrowUpRight className="w-5 h-5 text-white/40 group-hover:text-[#4E82B8] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </a>
                </div>

                {/* Container Bottom Status Footer */}
                <footer className="shrink-0 flex items-center justify-between px-4 sm:px-6 py-2.5 border-t border-white/10 bg-black/40 text-[12px] sm:text-[11px] font-mono text-white/40">
                    <div className="flex items-center gap-3">
                        <span>
                            ACTIVE UTILITY:{" "}
                            {TOOL_TABS.find((t) => t.key === activeTool)?.label}
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link
                            to="/contact"
                            className="flex items-center gap-1.5 text-white hover:text-[#4E82B8] font-medium transition-colors">
                            <span>CONTACT</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                </footer>
            </div>
        </main>
    );
};
