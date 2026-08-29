import React from "react";
import { motion } from "motion/react";
import {
    Github,
    Twitter,
    Youtube,
    Gamepad2,
} from "lucide-react";
import { PROFILE_DATA } from "../../data/profileData";

export const TopLeftSocials: React.FC = () => {
    const socialLinks = [
        {
            id: "github",
            name: "GitHub",
            url: PROFILE_DATA.socials.github,
            icon: <Github className="w-4 h-4" strokeWidth={1.5} />,
            ariaLabel: "ant1po1e on GitHub (github.com/ant1po1e)",
        },
        {
            id: "itchio",
            name: "Itch.io",
            url: PROFILE_DATA.socials.itchio,
            icon: <Gamepad2 className="w-4 h-4" strokeWidth={1.5} />,
            ariaLabel: "ant1po1e Games on Itch.io",
        },
        {
            id: "youtube",
            name: "YouTube",
            url: PROFILE_DATA.socials.youtube,
            icon: <Youtube className="w-4 h-4" strokeWidth={1.5} />,
            ariaLabel: "ant1po1e on YouTube",
        },
        {
            id: "twitter",
            name: "X (Twitter)",
            url: PROFILE_DATA.socials.x,
            icon: <Twitter className="w-4 h-4" strokeWidth={1.5} />,
            ariaLabel: "ant1po1e on X",
        },
    ];

    return (
        <div
            id="top-left-brand-socials"
            className="fixed top-2 left-5 md:top-3 md:left-8 z-50 flex items-center gap-3 md:gap-4">
            <motion.a
                id="brand-logo-ant1po1e"
                href="https://osu.ppy.sh/users/Antipole"
                aria-label="Visit Antipole's osu! profile"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}

                className="flex items-center gap-2 group py-1 pr-2">
                <div className="w-10 h-10 rounded-sm border border-white/20 bg-white/5 flex items-center justify-center text-white/80 group-hover:border-white/80 group-hover:text-white transition-all duration-300">
                    <img
                        src="https://a.ppy.sh/17258072"
                        alt="Antipole's osu! avatar"
                        className="object-cover"
                        width={32}
                        height={32}
                        loading="lazy"
                    />
                </div>
                <div className="flex flex-col text-left">
                    <span className="text-xs font-display tracking-[0.25em] font-medium text-white/90 group-hover:text-white transition-colors uppercase">
                        {PROFILE_DATA.handle}
                    </span>
                </div>
            </motion.a>

            <div className="hidden sm:block h-4 w-px bg-white/10" />

            <div className="hidden sm:flex items-center gap-2">
                {socialLinks.map((link) => (
                    <motion.a
                        key={link.id}
                        id={`social-link-${link.id}`}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={link.ariaLabel}
                        title={link.name}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}

                        className="p-1.5 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-all duration-300">
                        {link.icon}
                    </motion.a>
                ))}
            </div>
        </div>
    );
};
