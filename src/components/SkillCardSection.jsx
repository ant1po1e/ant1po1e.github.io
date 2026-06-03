import { useMemo, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { SkillRadarChart } from "./SkillRadarChart";

const STAT_CONFIG = [
    { key: "accuracy", label: "ACC" },
    { key: "speed", label: "SPD" },
    { key: "jack", label: "JCK" },
    { key: "stamina", label: "STA" },
    { key: "tech", label: "TEC" },
    { key: "release", label: "LN" },
    { key: "reading", label: "RDG" },
];

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
        if (!cardRef.current) return;
        const dataUrl = await toPng(cardRef.current, { pixelRatio: 3 });
        const link = document.createElement("a");
        link.download = `${username}-skill-card.png`;
        link.href = dataUrl;
        link.click();
    };

    return (
        <section className="w-full px-4 md:px-24 flex justify-center items-center">
            <div className="w-full md:w-2/3 scrollbar-none px-5 py-5 bg-white/50 backdrop-blur-md rounded-lg shadow-lg mb-20 sm:mb-0">
                <header className="text-center mb-5">
                    <h1 className="font-bold text-black text-xl md:text-3xl">
                        Tools |{" "}
                        <span className="text-base md:text-xl font-normal">
                            osu!mania Skill Card
                        </span>
                    </h1>
                </header>

                <div className="text-center mt-5 w-full px-4 py-4 border-t-2 border-t-black text-white overflow-y-auto max-h-[50vh]">
                    <div className="space-y-4 max-w-md mx-auto">
                        <div className="flex justify-center">
                            <select
                                value={theme}
                                onChange={(e) =>
                                    handleThemeChange(e.target.value)
                                }
                                className="
                                    w-full
                                    bg-slate-700/50
                                    shadow-lg
                                    text-white
                                    text-sm
                                    px-4
                                    py-2
                                    rounded-lg
                                    focus:outline-none
                                    focus:ring-2
                                    focus:ring-white
                                    md:hover:scale-105
                                    transition
                                    duration-300
                                ">
                                {Object.entries(THEMES).map(([key, value]) => (
                                    <option key={key} value={key}>
                                        {value.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="text-center flex justify-center">
                            <button
                                onClick={downloadCard}
                                type="button"
                                className="relative flex h-[50px] w-32 md:hover:w-40 items-center justify-center overflow-hidden rounded-lg bg-black text-white shadow-2xl transition-all before:absolute before:h-0 before:w-0 before:rounded-full before:bg-blue-400 before:duration-500 before:ease-out md:hover:shadow-blue-400 md:hover:before:h-56 md:hover:before:w-56 duration-300">
                                <span className="relative z-10">Download</span>
                            </button>
                        </div>

                        <div
                            ref={cardRef}
                            className="relative rounded-[32px] overflow-hidden px-6 py-8 border border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
                            <div
                                className="
                                        absolute
                                        top-0
                                        right-0
                                        w-40
                                        h-40
                                        blur-3xl
                                        rounded-full
                                        opacity-20
                                    "
                                style={{
                                    backgroundColor: themeColors.primary,
                                }}
                            />
                            <div
                                className="
                                    absolute
                                    bottom-0
                                    left-0
                                    w-40
                                    h-40
                                    blur-3xl
                                    rounded-full
                                    opacity-20
                                "
                                style={{
                                    backgroundColor: themeColors.secondary,
                                }}
                            />

                            <div className="relative z-10">
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
                                        onChange={(e) =>
                                            setUsername(e.target.value)
                                        }
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
                                <div className="mt-2">
                                    <h2
                                        className="
                                            text-6xl
                                            font-black
                                            bg-clip-text
                                            text-transparent
                                        "
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
                                <div className="mt-5">
                                    <div className="inline-block px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm">
                                        Top Skill •{" "}
                                        <span className="font-bold">
                                            {topSkill[0].toUpperCase()}
                                        </span>{" "}
                                        {topSkill[1]}
                                    </div>
                                </div>

                                <p className="text-xs text-gray-400 mt-6 tracking-wider">
                                    antipole.my.id/tools/skill-card
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
