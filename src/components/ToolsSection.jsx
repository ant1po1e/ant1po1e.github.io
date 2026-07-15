import { Link } from "react-router-dom";

const TOOLS = [
    { to: "/tools/snap-calculator", label: "Snap Calculator" },
    { to: "/tools/bbcode-generator", label: "BBCode Text Colorizer" },
    { to: "/tools/skill-card", label: "Skill Calculator" },
];

export const ToolsSection = () => {
    return (
        <section
            className="w-full flex items-center text-ink px-6 md:px-24 mt-10 md:mt-16"
            aria-label="Tools Section">
            <div className="mx-auto w-full max-w-xl p-8 rounded-xl shadow-xl bg-paper mb-20 md:mb-0">
                {/* Heading */}
                <div className="text-center">
                    <h2 className="font-display italic font-medium text-ink text-2xl md:text-4xl">
                        Tools
                    </h2>
                </div>

                {/* List */}
                <div className="mt-6 pt-6 border-t border-rule">
                    <ul className="divide-y divide-rule" role="list">
                        {TOOLS.map((tool) => (
                            <li key={tool.to} role="listitem">
                                <Link
                                    to={tool.to}
                                    aria-label={`Go to ${tool.label} tool`}
                                    className="group flex items-center justify-between py-4 font-mono text-sm md:text-base uppercase tracking-wide text-ink/80 transition-colors duration-300 hover:text-accent">
                                    <span className="border-b border-transparent group-hover:border-accent transition-all duration-300">
                                        {tool.label}
                                    </span>
                                    <i
                                        className="bi bi-arrow-up-right text-base transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                                        aria-hidden="true"
                                    />
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
};
