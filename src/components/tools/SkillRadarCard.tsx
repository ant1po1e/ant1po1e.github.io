import React, { useEffect, useMemo, useRef, useState } from "react";
import { toPng } from "html-to-image";
import {
    SkillRadarChart,
    type SkillValues,
    type ThemeColors,
} from "./SkillRadarChart";
import { Download, UserSquare2 } from "lucide-react";

type Rank =
    | "Grandmaster Player"
    | "Master Player"
    | "Advanced Player"
    | "Intermediate Player"
    | "Beginner Player";

const RANK_STYLES: Record<Rank, string> = {
    "Grandmaster Player": "bg-pink-500/20 border-pink-500/40 text-pink-300",
    "Master Player": "bg-yellow-500/20 border-yellow-500/40 text-yellow-300",
    "Advanced Player": "bg-blue-500/20 border-blue-500/40 text-blue-300",
    "Intermediate Player": "bg-green-500/20 border-green-500/40 text-green-300",
    "Beginner Player": "bg-gray-500/20 border-gray-500/40 text-gray-300",
};

const THEMES: Record<string, ThemeColors> = {
    default: {
        name: "Default",
        primary: "#ec4899",
        secondary: "#8b5cf6",
        accent: "#3b82f6",
    },
    aqua: {
        name: "Aqua",
        primary: "#22d3ee",
        secondary: "#0ea5e9",
        accent: "#a855f7",
    },
    emerald: {
        name: "Emerald",
        primary: "#22c55e",
        secondary: "#14b8a6",
        accent: "#facc15",
    },
    sunset: {
        name: "Sunset",
        primary: "#fb7185",
        secondary: "#f97316",
        accent: "#8b5cf6",
    },
    lavender: {
        name: "Lavender",
        primary: "#c084fc",
        secondary: "#a78bfa",
        accent: "#f472b6",
    },
};

const DEFAULT_SKILLS: SkillValues = {
    accuracy: 80,
    speed: 75,
    jack: 70,
    stamina: 85,
    tech: 65,
    release: 90,
    reading: 72,
};

const STORAGE_AVATAR_KEY = "antipole-skillcard-avatar";
const STORAGE_THEME_KEY = "antipole-skillcard-theme";

export const SkillRadarCard: React.FC = () => {
    const exportRef = useRef<HTMLDivElement>(null);

    // Read persisted values only after mount so SSR/first-render markup can't
    // mismatch — this project is a client-only SPA, but the guard is harmless
    // and keeps the component portable.
    const [avatar, setAvatar] = useState("");
    const [theme, setTheme] = useState("default");

    useEffect(() => {
        try {
            setAvatar(window.localStorage.getItem(STORAGE_AVATAR_KEY) || "");
            setTheme(
                window.localStorage.getItem(STORAGE_THEME_KEY) || "default",
            );
        } catch {
            // localStorage may be unavailable (private mode); ignore
        }
    }, []);

    const [username, setUsername] = useState("Player");
    const [skills, setSkills] = useState<SkillValues>(DEFAULT_SKILLS);

    const themeColors = THEMES[theme] ?? THEMES.default;

    const handleThemeChange = (value: string) => {
        setTheme(value);
        try {
            window.localStorage.setItem(STORAGE_THEME_KEY, value);
        } catch {
            // ignore storage errors
        }
    };

    const overallScore = useMemo(() => {
        const values = Object.values(skills);
        return (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);
    }, [skills]);

    const topSkill = useMemo(
        () =>
            Object.entries(skills).sort((a, b) => b[1] - a[1])[0] as [
                string,
                number,
            ],
        [skills],
    );

    const rank = useMemo<Rank>(() => {
        const avg = Number(overallScore);
        if (avg >= 90) return "Grandmaster Player";
        if (avg >= 80) return "Master Player";
        if (avg >= 70) return "Advanced Player";
        if (avg >= 60) return "Intermediate Player";
        return "Beginner Player";
    }, [overallScore]);

    const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result as string;
            try {
                window.localStorage.setItem(STORAGE_AVATAR_KEY, result);
            } catch {
                // ignore storage errors
            }
            setAvatar(result);
        };
        reader.readAsDataURL(file);
    };

    const downloadCard = async () => {
        if (!exportRef.current) return;
        const dataUrl = await toPng(exportRef.current, {
            cacheBust: true,
            pixelRatio: 1,
        });
        const link = document.createElement("a");
        link.download = `${username}-skill-card.png`;
        link.href = dataUrl;
        link.click();
    };

    const CardContent = useMemo(
        () => (
            <>
                <div
                    className="absolute top-0 right-0 w-40 h-40 blur-3xl rounded-full opacity-20"
                    style={{ backgroundColor: themeColors.primary }}
                />
                <div
                    className="absolute bottom-0 left-0 w-40 h-40 blur-3xl rounded-full opacity-20"
                    style={{ backgroundColor: themeColors.secondary }}
                />

                <div className="relative z-10 text-center">
                    <div className="flex justify-center">
                        <label
                            htmlFor="skillcard-avatar-upload"
                            className="cursor-pointer">
                            {avatar ? (
                                <div
                                    className="w-24 h-24 rounded-3xl p-[2px]"
                                    style={{
                                        background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})`,
                                    }}>
                                    <img
                                        src={avatar}
                                        alt="avatar"
                                        className="w-full h-full rounded-[22px] object-cover"
                                        referrerPolicy="no-referrer"
                                    />
                                </div>
                            ) : (
                                <div className="w-24 h-24 rounded-3xl border border-white/20 bg-white/10 flex items-center justify-center text-xs text-white/70">
                                    Upload
                                </div>
                            )}
                        </label>
                        <input
                            id="skillcard-avatar-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                            hidden
                        />
                    </div>

                    <div className="mt-4">
                        <input
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="bg-transparent text-center outline-none text-white text-3xl font-black w-full"
                        />
                    </div>

                    <div className="flex justify-center mt-4">
                        <span
                            className={`px-4 py-2 rounded-full border text-sm font-semibold ${RANK_STYLES[rank]}`}>
                            {rank}
                        </span>
                    </div>

                    <div className="mt-8">
                        <SkillRadarChart
                            skills={skills}
                            setSkills={setSkills}
                            themeColors={themeColors}
                        />
                    </div>

                    <div className="mt-2 flex flex-col items-center">
                        <h2
                            className="text-6xl font-black bg-clip-text text-transparent"
                            style={{
                                backgroundImage: `linear-gradient(90deg, ${themeColors.primary}, ${themeColors.secondary})`,
                            }}>
                            {overallScore}
                        </h2>
                        <p className="text-[12px] tracking-[5px] text-gray-500">
                            OVERALL
                        </p>
                    </div>

                    <div className="mt-5 flex justify-center">
                        <div className="inline-block px-4 py-2 rounded-full bg-white/5 border text-white border-white/10 text-sm">
                            Top Skill •{" "}
                            <span className="font-bold">
                                {topSkill[0].toUpperCase()}
                            </span>{" "}
                            {topSkill[1]}
                        </div>
                    </div>

                    <p className="text-xs text-gray-400 mt-6 tracking-wider text-center">
                        antipole.my.id/tools/skill-card
                    </p>
                </div>
            </>
        ),
        [avatar, username, rank, overallScore, topSkill, skills, themeColors],
    );

    return (
        <div className="p-6 sm:p-8 rounded-lg border border-white/15 bg-white/[0.02] backdrop-blur-md">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#4E82B8] mb-6 pb-4 border-b border-white/10">
                <UserSquare2 className="w-3.5 h-3.5" />
                <span>OSU!MANIA SKILL CARD GENERATOR</span>
            </div>

            <div className="max-w-md mx-auto space-y-4">
                {/* Theme picker */}
                <div className="flex justify-center">
                    <select
                        value={theme}
                        onChange={(e) => handleThemeChange(e.target.value)}
                        className="w-full bg-black/60 border border-white/15 text-white text-xs font-mono px-3 py-2 rounded focus:outline-none focus:border-[#4E82B8] transition-colors">
                        {Object.entries(THEMES).map(([key, value]) => (
                            <option key={key} value={key}>
                                {value.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Download button */}
                <div className="flex justify-center">
                    <button
                        onClick={downloadCard}
                        type="button"
                        className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded bg-white hover:bg-white/90 text-black text-xs font-mono font-semibold uppercase tracking-wider transition-colors">
                        <Download className="w-3.5 h-3.5" />
                        <span>Download PNG</span>
                    </button>
                </div>

                {/* The card itself — intentionally its own dark gradient regardless of site theme */}
                <div
                    ref={exportRef}
                    className="relative rounded-[32px] overflow-hidden px-6 py-8 border border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
                    {CardContent}
                </div>
            </div>
        </div>
    );
};
