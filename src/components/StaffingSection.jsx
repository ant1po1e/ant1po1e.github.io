import staffingData from "../data/staffing.json";

const ROLE_STYLES = {
    organizer: "bg-blue-100 text-blue-700 border-blue-300",
    advisor: "bg-green-100 text-green-700 border-green-300",
    mappooler: "bg-purple-100 text-purple-700 border-purple-300",
    mapper: "bg-pink-100 text-pink-700 border-pink-300",
    programmer: "bg-orange-100 text-orange-700 border-orange-300",
    commentator: "bg-red-100 text-red-800 border-red-300",
    default: "bg-paper text-ink border-rule",
};

const StaffingItem = ({ link, date, title, roles }) => {
    return (
        <div className="py-4">
            <span className="md:hidden font-mono text-xs tracking-widest uppercase text-muted">
                {date}
            </span>

            <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-baseline gap-3">
                <h3 className="mt-1 font-display italic text-lg md:text-2xl text-ink transition-colors duration-300 group-hover:text-accent">
                    {title}
                </h3>

                <span className="hidden md:block font-mono text-xs tracking-widest uppercase text-muted">
                    {date}
                </span>
            </a>

            <div className="mt-2 flex flex-wrap gap-2">
                {roles.map((role, idx) => {
                    const key = role.toLowerCase();
                    const style = ROLE_STYLES[key] || ROLE_STYLES.default;

                    return (
                        <span
                            key={idx}
                            className={`font-mono text-[11px] md:text-xs uppercase tracking-wide px-2.5 py-0.5 rounded-sm border font-medium ${style} transition-all duration-300`}>
                            {role}
                        </span>
                    );
                })}
            </div>
        </div>
    );
};

export const StaffingSection = () => {
    return (
        <section
            className="w-full flex items-center text-ink px-6 md:px-24 mt-10 md:mt-16"
            aria-label="Staffing History Section">
            <div className="mx-auto w-full max-w-3xl p-8 rounded-xl shadow-xl bg-paper mb-20 md:mb-0">
                {/* Heading */}
                <div className="text-center">
                    <h2 className="font-display italic font-medium text-ink text-2xl md:text-4xl">
                        Staffing History
                    </h2>
                </div>

                {/* List */}
                <div className="mt-6 pt-6 border-t border-rule overflow-y-auto max-h-[42vh] pr-1">
                    <div className="divide-y divide-rule">
                        {staffingData.map((item, idx) => (
                            <StaffingItem
                                key={idx}
                                link={item.link}
                                date={item.date}
                                title={item.title}
                                roles={item.roles}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
