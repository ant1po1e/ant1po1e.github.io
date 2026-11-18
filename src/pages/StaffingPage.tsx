import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { STAFFING_RECORDS } from "../data/staffingData";
import { Reveal } from "../components/ui/Reveal";
import {
    ArrowLeft,
    ArrowRight,
    Trophy,
    ExternalLink,
} from "lucide-react";

export const StaffingPage: React.FC = () => {
    const [selectedRole, setSelectedRole] = useState<string>("ALL");

    useEffect(() => {
        document.title = "Staffing History — Antipole (ant1po1e)";
    }, []);

    const roles = useMemo(() => {
        const unique = new Set<string>();
        STAFFING_RECORDS.forEach((r) =>
            r.roles.forEach((role) => unique.add(role)),
        );
        return ["ALL", ...Array.from(unique)];
    }, []);

    const filteredRecords =
        selectedRole === "ALL"
            ? STAFFING_RECORDS
            : STAFFING_RECORDS.filter((r) =>
                  r.roles.some(
                      (role) =>
                          role.toLowerCase() === selectedRole.toLowerCase(),
                  ),
              );

    return (
        <main
            id="staffing-page-view"
            className="relative h-dvh w-full bg-transparent text-ink overflow-hidden pt-16 sm:pt-20 pb-3 sm:pb-4 px-3 sm:px-6 md:px-8 flex flex-col items-center selection:bg-ink selection:text-paper">
            {/* Background Ambient Glow */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-175 h-175 rounded-full bg-radial from-peach/10 via-peach/15 to-transparent blur-3xl" />
                <div className="absolute inset-0 noise-overlay opacity-30" />
            </div>

            {/* Main Framed Container with Inner Scroll */}
            <div className="relative z-10 w-full max-w-5xl flex-1 min-h-0 bg-paper/85 border border-ink/10 rounded-lg backdrop-blur-xl flex flex-col overflow-hidden shadow-2xl">
                {/* Container Top Header Bar */}
                <header className="shrink-0 flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3 border-b border-ink/10 bg-wash/60">
                    <div className="flex items-center gap-3">
                        <Link
                            to="/?p=staffing"
                            className="group flex items-center gap-1.5 text-xs font-mono tracking-[0.2em] text-ink/60 hover:text-ink transition-colors">
                            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
                        </Link>
                        <span className="text-ink/35 hidden sm:inline">
                            |
                        </span>
                        <span className="text-[12px] font-japanese tracking-[0.3em] text-ink/55 uppercase hidden sm:inline">
                            STAFFING HISTORY
                        </span>
                    </div>

                    {/* Role Filter Tabs */}
                    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                        {roles.map((r) => (
                            <button
                                key={r}
                                onClick={() => setSelectedRole(r)}
                                className={`px-3 py-1 rounded-full text-[12px] font-mono tracking-wider uppercase transition-all duration-200 whitespace-nowrap ${
                                    selectedRole === r
                                        ? "bg-ink text-paper font-semibold shadow-sm"
                                        : "bg-ink/5 hover:bg-ink/10 text-ink/68 hover:text-ink border border-ink/5"
                                }`}>
                                {r}
                            </button>
                        ))}
                    </div>
                </header>

                {/* Inner Scrollable Body */}
                <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-5 sm:p-6 md:p-8 space-y-6">
                    {/* Section Hero Banner */}
                    <div className="text-center max-w-2xl mx-auto pt-2 pb-2">
                        <h1 className="text-2xl sm:text-4xl font-display font-light uppercase tracking-[0.25em] text-ink mb-2">
                            STAFFING HISTORY
                        </h1>
                    </div>

                    {/* Staffing Timeline Cards */}
                    <div className="space-y-3">
                        {filteredRecords.map((record, idx) => (
                            <Reveal
                                key={record.id}
                                y={15}
                                duration={0.4}
                                delay={idx * 0.05}
                                className="p-5 sm:p-6 rounded-lg border border-ink/10 bg-ink/2 hover:bg-ink/4 backdrop-blur-md transition-colors duration-300 hover:border-ink/20 text-left">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-3 border-b border-ink/10">
                                    <div>
                                        <div className="flex items-center gap-1.5 text-[12px] font-mono text-peach-deep uppercase tracking-wider mb-0.5">
                                            <Trophy className="w-3 h-3" />
                                            <span>{record.date}</span>
                                        </div>
                                        <h3 className="text-lg sm:text-xl font-display uppercase tracking-wide text-ink">
                                            {record.title}
                                        </h3>
                                    </div>

                                    {record.link && (
                                        <a
                                            href={record.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1.5 self-start sm:self-auto px-2.5 py-1 rounded bg-white/70 border border-ink/15 text-[13px] font-mono text-ink/75 hover:text-ink hover:border-ink/30 transition-colors">
                                            <span>DETAILS</span>
                                            <ExternalLink className="w-3 h-3" />
                                        </a>
                                    )}
                                </div>

                                {/* Roles Badges */}
                                <div className="flex flex-wrap gap-1.5">
                                    {record.roles.map((r) => (
                                        <span
                                            key={r}
                                            className="px-2.5 py-0.5 rounded-md bg-ink/5 border border-ink/10 text-[12px] font-mono text-ink/90">
                                            {r}
                                        </span>
                                    ))}
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>

                {/* Container Bottom Status Footer */}
                <footer className="shrink-0 flex items-center justify-between px-4 sm:px-6 py-2.5 border-t border-ink/10 bg-wash/60 text-[12px] sm:text-[11px] font-mono text-ink/55">
                    <div className="flex items-center gap-3">
                        <span>
                            SHOWING {filteredRecords.length} OF{" "}
                            {STAFFING_RECORDS.length} TOURNAMENT RECORDS
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link
                            to="/tools"
                            className="flex items-center gap-1.5 text-ink hover:text-peach-deep font-medium transition-colors">
                            <span>TOOLS</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                </footer>
            </div>
        </main>
    );
};
