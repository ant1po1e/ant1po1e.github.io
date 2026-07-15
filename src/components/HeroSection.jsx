import { Typewriter } from "react-simple-typewriter";

const SOCIALS = [
    { label: "GitHub", href: "https://github.com/ant1po1e", icon: "bi-github" },
    {
        label: "YouTube",
        href: "https://www.youtube.com/@ant1po1e",
        icon: "bi-youtube",
    },
];

export const HeroSection = () => {
    return (
        <section
            className="w-full flex items-center text-ink md:px-24 mt-16 md:mt-24"
            aria-label="Hero Section with introduction and social links">
            <div className="mx-auto w-full max-w-6xl grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-14 md:gap-10 items-center p-12 rounded-xl shadow-xl bg-paper">
                <div className="flex flex-col items-start text-left">
                    {/* Name */}
                    <h1 className="font-display italic font-medium text-ink text-6xl md:text-[110px] leading-[0.95] mb-4">
                        Antipole
                    </h1>

                    {/* Status / typewriter row */}
                    <div className="flex items-center gap-2 font-mono text-sm md:text-base text-ink/80 mb-8">
                        <span
                            className="inline-block w-2 h-2 rounded-full bg-accent animate-pulse"
                            aria-hidden="true"
                        />
                        <Typewriter
                            words={[
                                "Game Developer",
                                "Desktop Developer",
                                "Photographer",
                                "Rhythm Gamer",
                            ]}
                            cursor
                            delaySpeed={2000}
                            loop
                        />
                    </div>

                    {/* Bio */}
                    <p className="font-sans text-base md:text-lg leading-relaxed text-ink/85 max-w-md border-l-2 border-rule pl-5">
                        Hello! I'm Antipole, a web developer and game developer.
                        I build things that are functional and visually
                        considered — code and design treated as one craft.
                        Currently chasing high scores and better commits.
                    </p>

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-10 font-mono text-sm md:hidden">
                        {SOCIALS.map((social) => (
                            <a
                                key={social.label}
                                href={social.href}
                                aria-label={social.label}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group inline-flex items-center gap-2 text-ink/80 hover:text-accent transition-colors duration-300">
                                <i
                                    className={`bi ${social.icon} text-base`}
                                    aria-hidden="true"
                                />
                                <span className="border-b border-transparent group-hover:border-accent transition-all duration-300">
                                    {social.label}
                                </span>
                            </a>
                        ))}
                    </div>
                </div>

                {/* ============ RIGHT: ARTWORK, MAGAZINE-PINNED ============ */}
                <div className="relative md:flex justify-center md:justify-end hidden group">
                    <figure className="relative group-hover:rotate-0 -rotate-5 w-[78%] sm:w-[65%] md:w-full max-w-[380px] transition-all duration-300">
                        <div className="bg-white shadow-[0_20px_45px_-15px_rgba(27,27,31,0.35)] rounded-sm">
                            <img
                                src="/hero.webp"
                                alt="Illustrated character artwork representing Antipole"
                                className="w-full h-auto object-cover rounded-[2px]"
                            />
                        </div>
                        <figcaption className="absolute -bottom-8 left-3 font-mono italic text-xs text-muted">
                            Art —{" "}
                            <a
                                href="https://x.com/rytoua318"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline decoration-rule hover:text-accent hover:decoration-accent transition-colors">
                                シン・りょうた
                            </a>
                        </figcaption>
                    </figure>
                </div>
            </div>
        </section>
    );
};
