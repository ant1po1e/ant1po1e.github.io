import { useMemo, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { SkillRadarChart } from "./SkillRadarChart";

const RANK_STYLES = {
    "Grandmaster Player": "bg-pink-500/20 border-pink-500/40 text-pink-300",
    "Master Player": "bg-yellow-500/20 border-yellow-500/40 text-yellow-300",
    "Advanced Player": "bg-blue-500/20 border-blue-500/40 text-blue-300",
    "Intermediate Player": "bg-green-500/20 border-green-500/40 text-green-300",
    "Beginner Player": "bg-gray-500/20 border-gray-500/40 text-gray-300",
};

const THEMES = {
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

export const SkillCardSection = () => {
    const cardRef = useRef(null);
    const exportRef = useRef(null);
    const [avatar, setAvatar] = useState(
        () => localStorage.getItem("mania-avatar") || "",
    );
    const [username, setUsername] = useState("Player");
    const [skills, setSkills] = useState({
        accuracy: 80,
        speed: 75,
        jack: 70,
        stamina: 85,
        tech: 65,
        release: 90,
        reading: 72,
    });

    const [theme, setTheme] = useState(
        () => localStorage.getItem("mania-theme") || "default",
    );

    const themeColors = THEMES[theme] ?? THEMES.default;

    const handleThemeChange = (value) => {
        setTheme(value);
        localStorage.setItem("mania-theme", value);
    };

    const overallScore = useMemo(() => {
        const values = Object.values(skills);
        return (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);
    }, [skills]);

    const topSkill = useMemo(
        () => Object.entries(skills).sort((a, b) => b[1] - a[1])[0],
        [skills],
    );

    const rank = useMemo(() => {
        const avg = Number(overallScore);
        if (avg >= 90) return "Grandmaster Player";
        if (avg >= 80) return "Master Player";
        if (avg >= 70) return "Advanced Player";
        if (avg >= 60) return "Intermediate Player";
        return "Beginner Player";
    }, [overallScore]);

    const handleAvatarUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            localStorage.setItem("mania-avatar", reader.result);
            setAvatar(reader.result);
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
                            htmlFor="avatar-upload"
                            className="cursor-pointer">
                            {avatar ? (
                                <div
                                    className="w-24 h-24 rounded-3xl p-[2px]"
                                    style={{
                                        background: `linear-gradient(
                                    135deg,
                                    ${themeColors.primary},
                                    ${themeColors.secondary}
                                )`,
                                    }}>
                                    <img
                                        src={avatar}
                                        alt="avatar"
                                        className="w-full h-full rounded-[22px] object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="w-24 h-24 rounded-3xl border border-white/20 bg-white/10 flex items-center justify-center text-xs">
                                    Upload
                                </div>
                            )}
                        </label>

                        <input
                            id="avatar-upload"
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
                            className="bg-transparent text-center outline-none text-3xl font-black w-full"
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
                                backgroundImage: `linear-gradient(
                            90deg,
                            ${themeColors.primary},
                            ${themeColors.secondary}
                        )`,
                            }}>
                            {overallScore}
                        </h2>

                        <p className="text-[10px] tracking-[5px] text-gray-500">
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
        <section
            className="w-full flex items-center text-ink px-6 md:px-24 mt-10 md:mt-16"
            aria-label="osu!mania Skill Card Tool">
            <div className="mx-auto w-full max-w-xl scrollbar-none p-8 rounded-xl shadow-xl bg-paper mb-20 md:mb-0">
                {/* Heading */}
                <header className="text-center">
                    <p className="font-mono text-xs tracking-widest uppercase text-muted mb-1">
                        Tools
                    </p>
                    <h1 className="font-display italic font-medium text-ink text-2xl md:text-4xl">
                        osu!mania Skill Card
                    </h1>
                </header>

                <div className="mt-6 pt-6 border-t border-rule overflow-y-auto max-h-[40vh] pr-1">
                    <div className="space-y-4 max-w-md mx-auto">
                        {/* Theme picker */}
                        <div className="flex justify-center">
                            <select
                                value={theme}
                                onChange={(e) =>
                                    handleThemeChange(e.target.value)
                                }
                                className="w-full bg-paper border border-rule text-ink text-sm px-4 py-2 rounded-sm focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors duration-300">
                                {Object.entries(THEMES).map(([key, value]) => (
                                    <option key={key} value={key}>
                                        {value.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Download button */}
                        <div className="text-center flex justify-center">
                            <button
                                onClick={downloadCard}
                                type="button"
                                className="font-mono text-xs uppercase tracking-wide px-6 py-2.5 rounded-sm bg-ink text-paper hover:bg-accent transition-colors duration-300">
                                Download
                            </button>
                        </div>

                        {/* --- The card itself: intentionally untouched dark theme --- */}
                        <div
                            ref={cardRef}
                            className="
                                relative
                                rounded-[32px]
                                overflow-hidden
                                px-6
                                py-8
                                border
                                border-white/10
                                bg-gradient-to-br
                                from-slate-950
                                via-slate-900
                                to-slate-800
                            ">
                            {CardContent}
                        </div>
                    </div>
                </div>
            </div>
            <div
                style={{
                    position: "fixed",
                    left: "-99999px",
                    top: 0,
                }}>
                <div
                    ref={exportRef}
                    style={{
                        width: "1342px",
                        height: "2278px",
                        overflow: "hidden",
                        position: "relative",
                        borderRadius: "32px",
                        background:
                            "linear-gradient(135deg,#020617,#0f172a,#1e293b)",
                        color: "white",
                    }}>
                    <div
                        style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "flex-start",
                            paddingTop: "40px",
                            boxSizing: "border-box",
                        }}>
                        <div
                            style={{
                                width: "420px",
                                transform: `scale(${1342 / 420})`,
                                transformOrigin: "top center",
                            }}>
                            {CardContent}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
