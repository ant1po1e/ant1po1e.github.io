export const Sidebar = () => {
    const links = [
        {
            href: "https://github.com/ant1po1e",
            label: "GitHub",
            icon: "bi-github",
        },
        {
            href: "https://www.youtube.com/@ant1po1e",
            label: "YouTube",
            icon: "bi-youtube",
        },
        {
            href: "https://ant1po1e.itch.io/",
            label: "Itch.io",
            icon: "bi-shop-window",
        },
    ];

    return (
        <nav
            className="hidden md:flex flex-col gap-3 fixed top-32 left-8 z-30"
            aria-label="Social links sidebar">
            {links.map((link) => (
                <div key={link.label} className="relative group">
                    <a
                        href={link.href}
                        aria-label={link.label}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-16 h-16 flex items-center justify-center rounded-sm shadow-xl border border-rule bg-paper/80 backdrop-blur-sm text-ink text-3xl transition-colors duration-300 hover:border-accent hover:text-accent">
                        <i className={`bi ${link.icon}`} aria-hidden="true" />
                    </a>

                    {/* Tooltip */}
                    <span
                        role="tooltip"
                        className="absolute left-full ml-3 top-1/2 -translate-y-1/2 font-mono text-md shadow-lg uppercase tracking-wide px-3 py-1.5 border border-rule bg-paper text-ink opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
                        {link.label}
                    </span>
                </div>
            ))}
        </nav>
    );
};
