import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SnapCalculator } from "../components/tools/SnapCalculator";
import { BBCodeColorizer } from "../components/tools/BBCodeColorizer";
import { SkillRadarCard } from "../components/tools/SkillRadarCard";
import { Reveal } from "../components/ui/Reveal";
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
            className="relative h-dvh w-full bg-transparent text-ink overflow-hidden pt-16 sm:pt-20 pb-3 sm:pb-4 px-3 sm:px-6 md:px-8 flex flex-col items-center selection:bg-ink selection:text-paper">
            {/* Background Ambient Glow */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-175 h-175 rounded-full bg-radial from-olive/10 via-olive/15 to-transparent blur-3xl" />
                <div className="absolute inset-0 noise-overlay opacity-30" />
            </div>

            {/* Main Framed Container with Inner Scroll */}
            <div className="relative z-10 w-full max-w-5xl flex-1 min-h-0 bg-paper/85 border border-ink/10 rounded-lg backdrop-blur-xl flex flex-col overflow-hidden shadow-2xl">
                {/* Container Top Header Bar */}
                <header className="shrink-0 flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3 border-b border-ink/10 bg-wash/60">
                    <div className="flex items-center gap-3">
                        <Link
                            to="/?p=tools"
                            className="group flex items-center gap-1.5 text-xs font-mono tracking-[0.2em] text-ink/60 hover:text-ink transition-colors">
                            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
                        </Link>
                        <span className="text-ink/35 hidden sm:inline">
                            |
                        </span>
                        <span className="text-[12px] font-japanese tracking-[0.3em] text-ink/55 uppercase hidden sm:inline">
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
                                            ? "bg-ink text-paper font-bold shadow-sm"
                                            : "bg-ink/5 hover:bg-ink/10 text-ink/75 hover:text-ink border border-ink/5"
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
                        <h1 className="text-2xl sm:text-4xl font-display font-light uppercase tracking-[0.25em] text-ink mb-2">
                            TOOLS
                        </h1>
                    </div>

                    {/* Active Tool Panel */}
                    <Reveal key={activeTool} scale={0.98} duration={0.3}>
                        {activeTool === "snap" && <SnapCalculator />}
                        {activeTool === "bbcode" && <BBCodeColorizer />}
                        {activeTool === "skillcard" && <SkillRadarCard />}
                    </Reveal>

                    {/* External Tool — Barline Scope */}
                    <a
                        href="https://barline-scope.vercel.app/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between p-5 rounded-lg border border-ink/10 bg-ink/2 hover:bg-ink/5 hover:border-olive/40 backdrop-blur-md transition-all duration-300">
                        <div>
                            <span className="text-[12px] font-mono uppercase tracking-widest text-olive-deep block mb-1">
                                EXTERNAL TOOL
                            </span>
                            <h3 className="text-base font-display uppercase tracking-wider text-ink group-hover:text-olive-deep transition-colors">
                                Barline Scope
                            </h3>
                        </div>
                        <ArrowUpRight className="w-5 h-5 text-ink/55 group-hover:text-olive-deep group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </a>
                </div>

                {/* Container Bottom Status Footer */}
                <footer className="shrink-0 flex items-center justify-between px-4 sm:px-6 py-2.5 border-t border-ink/10 bg-wash/60 text-[12px] sm:text-[11px] font-mono text-ink/55">
                    <div className="flex items-center gap-3">
                        <span>
                            ACTIVE UTILITY:{" "}
                            {TOOL_TABS.find((t) => t.key === activeTool)?.label}
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link
                            to="/contact"
                            className="flex items-center gap-1.5 text-ink hover:text-olive-deep font-medium transition-colors">
                            <span>CONTACT</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                </footer>
            </div>
        </main>
    );
};
