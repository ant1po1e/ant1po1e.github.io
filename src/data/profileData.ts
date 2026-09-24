import { PortfolioProfile } from "../types";

export const PROFILE_DATA: PortfolioProfile = {
    handle: "Antipole",
    displayName: "About",
    role: "Web & Game Developer • osu!mania Beatmapper & Tournament Staff",
    location: "Indonesia / Global Remote",
    avatar: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=600&auto=format&fit=crop",
    statement:
        "Passionate about coding, game design, and rhythm games. Crafting games from the ground up, writing tools for developers & mappers, and organizing community tournaments.",
    bioParagraphs: [
        "Hello! I'm Antipole, a desktop developer and game developer (sometimes I do web also). I create desktop apps and games that are not only functional but also visually appealing. My passion for coding and design drives me to constantly learn and improve my skills, delivering creative and efficient solutions for every project I undertake.",
    ],
    skills: [
        {
            category: "Game Development",
            items: [
                "C#",
                "Unity Engine",
                "Godot Engine",
                "2D Puzzle Design",
                "Game Physics",
                "Audio Implementation",
                "Itch.io Deployment",
            ],
        },
        {
            category: "Web & Frontend",
            items: [
                "TypeScript",
                "JavaScript",
                "React",
                "Tailwind CSS",
                "HTML5 / Canvas",
                "Vite",
                "Responsive Design",
                "REST APIs",
            ],
        },
        {
            category: "Rhythm Games & Mapping",
            items: [
                "osu!mania 4K & 7K Mapping",
                "Scroll Velocity (SV) Scripting",
                "Pattern Engineering (Chordjack, Streams, LN)",
                "Tournament Map Pooling",
                "Hitsounding & Timing",
                "Community Staffing",
            ],
        },
        {
            category: "Tools & Scripting",
            items: [
                "Python",
                "Git & GitHub",
                "Discord Bot Development",
                "SV Calculation Algorithms",
                "Pomodoro & Workflow Optimization",
            ],
        },
    ],
    experience: [
        {
            period: "2023 — PRESENT",
            role: "Indie Game & Web Developer",
            company: "Antipole Studio (antipole.my.id / itch.io)",
            description:
                "Developed and published the Wave Walker puzzle series, Dodge the Thing, Apolz Pomodoro, and various open-source web utilities.",
        },
        {
            period: "2021 — PRESENT",
            role: "osu!mania Beatmap Creator & Custom Mapper",
            company: "osu! Community & Tournaments",
            description:
                "Created acclaimed 4K/7K beatmaps (HANIPAGANDA, FLAMEWALL, Digital Kecak No.5), custom tournament charts, and educational mapping guides.",
        },
        {
            period: "2022 — PRESENT",
            role: "Tournament Staff & Head Referee / Pooler",
            company: "osu! Tournament Community",
            description:
                "Staffed high-profile competitive tournaments as Head Referee, Map Pooler, Streamer, and Commentator.",
        },
    ],
    socials: {
        github: "https://github.com/ant1po1e",
        x: "https://x.com/apolantipole",
        youtube: "https://youtube.com/@ant1po1e",
        itchio: "https://ant1po1e.itch.io",
        osu: "https://osu.ppy.sh/users/ant1po1e",
        twitch: "https://twitch.tv/ant1po1e",
        discord: "https://discord.gg",
        email: "bundayudha82@gmail.com",
    },
};
