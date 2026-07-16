import { useLocation, Link } from "react-router-dom";

export const Navbar = () => {
    const location = useLocation();
    const path = location.pathname;
    const isOnRoot = path === "/";

    const isInToolsSubpage =
        path === "/tools/bbcode-generator" ||
        path === "/tools/snap-calculator" ||
        path === "/tools/skill-card";

    const backUrl = isInToolsSubpage ? "/tools" : "/";

    return (
        <>
            <Link
                to={isOnRoot ? "/" : backUrl}
                aria-label={isOnRoot ? "Go to homepage" : "Go back"}
                className="fixed top-6 left-6 md:top-8 md:left-8 z-30 shadow-xl font-display italic text-ink text-xl md:text-3xl bg-paper/90 backdrop-blur-sm border border-rule rounded-sm px-8 py-2 transition-colors duration-300 md:hover:text-accent md:hover:border-accent focus:ring-2 focus:ring-accent">
                {isOnRoot ? (
                    "Antipole"
                ) : (
                    <span>
                        <i className="bi bi-arrow-left" aria-hidden="true" />
                        Back
                    </span>
                )}
            </Link>

            {/* External Profile — its own floating tag, top-right, unrelated to the logo */}
            <a
                href="https://osu.ppy.sh/users/Antipole"
                aria-label="Visit Antipole's osu! profile"
                target="_blank"
                rel="noopener noreferrer"
                className="fixed top-6 right-6 md:top-8 md:right-8 shadow-xl z-30 group flex items-center font-mono text-xs uppercase tracking-wide text-muted bg-paper/90 backdrop-blur-sm border border-rule rounded-full p-1 transition-colors duration-300 md:hover:text-accent md:hover:border-accent">
                <img
                    src="https://a.ppy.sh/17258072"
                    alt="Antipole's osu! avatar"
                    className="w-12 h-12 rounded-full object-cover"
                    width="32"
                    height="32"
                    loading="lazy"
                />
            </a>
        </>
    );
};
