import { useState } from "react";
import { Link } from "react-router-dom";

export const Footer = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleFooter = () => {
        setIsOpen((prev) => !prev);
    };

    const links = [
        { to: "/", label: "HOME", icon: "bi-house-door" },
        { to: "/projects", label: "PROJECTS", icon: "bi-kanban" },
        {
            to: "/contributed-beatmaps",
            label: "BEATMAPS",
            icon: "bi-music-note-list",
        },
        {
            to: "/staffing",
            label: "STAFFING HISTORY",
            icon: "bi-person-lines-fill",
        },
        { to: "/how-to-map", label: "HOW TO MAP", icon: "bi-map" },
        { to: "/tools", label: "TOOLS", icon: "bi-tools" },
        { to: "/contact", label: "CONTACT", icon: "bi-envelope" },
    ];

    return (
        <footer
            className="fixed bottom-0 left-0 w-full z-50"
            role="contentinfo"
            aria-label="Website Footer">
            {/* Mobile Footer */}
            <div className="md:hidden flex flex-col items-center justify-end">
                <button
                    onClick={toggleFooter}
                    className="w-1/2 mb-2 flex items-center justify-center gap-2 bg-paper border border-rule text-ink shadow-sm p-3 rounded-sm font-mono text-xs uppercase tracking-wide"
                    aria-expanded={isOpen}
                    aria-controls="mobile-footer-menu"
                    aria-label="Toggle footer menu">
                    <i className="bi bi-list text-lg" aria-hidden="true" />
                    Menu
                </button>

                {/* Expandable menu */}
                <div
                    id="mobile-footer-menu"
                    className={`w-full paper-text border border-rule overflow-hidden transition-all duration-300 ${
                        isOpen ? "max-h-[320px] py-2" : "max-h-0 py-0"
                    }`}>
                    <ul className="flex flex-col items-stretch text-ink font-mono text-sm divide-y divide-rule px-6">
                        {links.map((link) => (
                            <li key={link.label}>
                                <Link
                                    to={link.to}
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 w-full py-3 tracking-wide transition-colors duration-300"
                                    aria-label={`Navigate to ${link.label}`}
                                    viewTransition>
                                    <i
                                        className={`bi ${link.icon}`}
                                        aria-hidden="true"
                                    />
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Desktop Footer */}
            <div className="hidden md:flex items-center justify-center mb-8">
                <div className="flex gap-1 bg-paper border border-rule shadow-xl rounded-sm px-2 py-2">
                    {links.map((link) => (
                        <div
                            key={link.label}
                            className="relative group font-medium">
                            <Link
                                to={link.to}
                                className="w-16 h-16 flex items-center justify-center text-ink text-2xl rounded-sm transition-colors duration-300 hover:text-accent hover:bg-rule/30"
                                aria-label={`Navigate to ${link.label}`}
                                viewTransition>
                                <i
                                    className={`bi ${link.icon}`}
                                    aria-hidden="true"
                                />
                            </Link>
                            {/* Tooltip */}
                            <span
                                role="tooltip"
                                className="absolute -top-12 left-1/2 -translate-x-1/2 font-mono text-md shadow-lg uppercase tracking-wide bg-paper border border-rule text-ink px-3 py-1.5 opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-300 whitespace-nowrap pointer-events-none">
                                {link.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </footer>
    );
};
