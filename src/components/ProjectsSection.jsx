import { Carousel } from "flowbite-react";

const projects = [
    {
        title: "Gulanova Website",
        image: "/projects/gulanova-site.webp",
        alt: "Gulanova Website",
        link: "https://gulanova.top",
        stack: "react,tailwind,css",
        icon: "bi bi-link",
        linkText: "Site",
    },
    {
        title: "Wave Walker",
        image: "/projects/wave-walker.webp",
        alt: "Wave Walker",
        link: "https://ant1po1e.itch.io/wave-walker",
        stack: "unity,cs",
        icon: "bi bi-shop-window",
        linkText: "Itch.io",
    },
    {
        title: "Wave Walker 2",
        image: "/projects/wave-walker-2.webp",
        alt: "Wave Walker 2",
        link: "https://ant1po1e.itch.io/wave-walker-2",
        stack: "unity,cs",
        icon: "bi bi-shop-window",
        linkText: "Itch.io",
    },
    {
        title: "Wave Walker 3",
        image: "/projects/wave-walker-3.webp",
        alt: "Wave Walker 3",
        link: "https://ant1po1e.itch.io/wave-walker-3-the-box",
        stack: "unity,cs",
        icon: "bi bi-shop-window",
        linkText: "Itch.io",
    },
    {
        title: "Dodge the Thing",
        image: "/projects/dodge-the-thing.webp",
        alt: "Dodge the Thing",
        link: "https://ant1po1e.itch.io/dodge-the-thing",
        stack: "unity,cs",
        icon: "bi bi-shop-window",
        linkText: "Itch.io",
    },
    {
        title: "Apolz Pomodoro",
        image: "/projects/apolz-pomodoro.webp",
        alt: "Apolz Pomodoro",
        link: "https://ant1po1e.itch.io/apolz-pomodoro",
        stack: "unity,cs",
        icon: "bi bi-shop-window",
        linkText: "Itch.io",
    },
    {
        title: "Zombie Shooter",
        image: "/projects/zombie-shooter.webp",
        alt: "Zombie Shooter",
        link: "https://github.com/ant1po1e/zombie-shooter-course",
        stack: "unity,cs",
        icon: "bi bi-file-earmark-code",
        linkText: "Source Code",
    },
    {
        title: "Gothicvania",
        image: "/projects/gothicvania.webp",
        alt: "Find The Key",
        link: "https://github.com/ant1po1e/Gothicvania",
        stack: "unity,cs",
        icon: "bi bi-file-earmark-code",
        linkText: "Source Code",
    },
    {
        title: "Find The Key",
        image: "/projects/find-the-key.webp",
        alt: "Find The Key",
        link: "https://github.com/ant1po1e/Find-The-Key",
        stack: "html",
        icon: "bi bi-file-earmark-code",
        linkText: "Source Code",
    },
];

// Small outline arrow button used for the desktop carousel controls
const CarouselArrow = ({ direction }) => (
    <span className="inline-flex items-center justify-center w-10 h-10 rounded-sm border border-rule bg-paper/90 backdrop-blur-sm text-ink transition-colors duration-300 md:hover:border-accent md:hover:text-accent">
        <svg
            className={`w-3.5 h-3.5 ${direction === "right" ? "rotate-180" : ""}`}
            viewBox="0 0 6 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
                d="M5 1 1 5l4 4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    </span>
);

export const ProjectsSection = () => {
    return (
        <section
            className="w-full flex items-center text-ink px-6 md:px-24 mt-16 md:mt-24"
            aria-label="Projects Section">
            <div className="mx-auto w-full max-w-xl p-8 md:p-8 rounded-xl shadow-xl bg-paper mb-20 md:mb-0">
                {/* Heading */}
                <div className="mb-6 text-center">
                    <h2 className="font-display italic font-medium text-ink text-2xl md:text-4xl">
                        Projects
                    </h2>
                </div>

                {/* --- Mobile Card View --- */}
                <div className="mt-6 pt-6 border-t border-rule block md:hidden space-y-4 max-h-[55vh] overflow-auto pr-1">
                    {projects.map((project, idx) => (
                        <div
                            key={idx}
                            className="border border-rule rounded-sm overflow-hidden bg-paper">
                            <img
                                src={project.image}
                                alt={project.alt}
                                className="w-full h-full object-cover"
                            />
                            <div className="p-4">
                                <h3 className="font-display italic text-lg text-ink">
                                    {project.title}
                                </h3>
                                <div className="mt-2">
                                    <img
                                        src={`https://skillicons.dev/icons?i=${project.stack}`}
                                        alt="Stack"
                                        className="h-5"
                                    />
                                </div>
                                <a
                                    href={project.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group inline-flex items-center gap-2 mt-4 font-mono text-xs uppercase tracking-wide text-ink/80 md:hover:text-accent transition-colors duration-300">
                                    <i
                                        className={project.icon}
                                        aria-hidden="true"
                                    />
                                    <span className="border-b border-transparent md:group-hover:border-accent transition-all duration-300">
                                        {project.linkText}
                                    </span>
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

                {/* --- Desktop Carousel --- */}
                <div className="pt-6 border-t border-rule hidden md:block">
                    <div className="h-70 w-full rounded-xl overflow-hidden border border-rule">
                        <Carousel
                            className="overflow-hidden relative"
                            indicators={false}
                            slideInterval={5000}
                            pauseOnHover
                            loop
                            leftControl={<CarouselArrow direction="left" />}
                            rightControl={<CarouselArrow direction="right" />}>
                            {projects.map((project, idx) => (
                                <div
                                    key={idx}
                                    className="relative w-full h-full group">
                                    <img
                                        src={project.image}
                                        alt={project.alt}
                                        className="absolute block max-w-full max-h-full w-full h-full rounded-xl object-cover -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
                                    />

                                    {/* Overlay (desktop only) */}
                                    <div className="absolute w-full h-full py-8 px-8 sm:px-20 -translate-x-1/2 z-50 rounded-xl -translate-y-1/2 top-1/2 left-1/2 flex flex-col items-center justify-center text-center bg-paper/90 backdrop-blur-sm text-ink opacity-0 md:group-hover:opacity-100 transition duration-300">
                                        <h3 className="font-display italic text-xl md:text-3xl text-ink">
                                            {project.title}
                                        </h3>
                                        <div className="mt-4 flex justify-center">
                                            <img
                                                src={`https://skillicons.dev/icons?i=${project.stack}`}
                                                alt="Stack"
                                            />
                                        </div>
                                        <a
                                            href={project.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group/link inline-flex items-center gap-2 mt-8 font-mono text-sm uppercase tracking-wide text-ink/80 md:hover:text-accent transition-colors duration-300">
                                            <i
                                                className={`text-lg ${project.icon}`}
                                                aria-hidden="true"
                                            />
                                            <span className="border-b border-transparent group-hover/link:border-accent transition-all duration-300">
                                                {project.linkText}
                                            </span>
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </Carousel>
                    </div>
                </div>
            </div>
        </section>
    );
};
