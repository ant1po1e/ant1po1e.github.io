import staffingData from "../data/staffing.json";

const ROLE_STYLES = {
    organizer: "bg-blue-100 text-blue-700 border-blue-300",
    advisor: "bg-green-100 text-green-700 border-green-300",
    mappooler: "bg-purple-100 text-purple-700 border-purple-300",
    mapper: "bg-pink-100 text-pink-700 border-pink-300",
    programmer: "bg-orange-100 text-orange-700 border-orange-300",
    commentator: "bg-red-100 text-red-800 border-red-300",
    default: "bg-gray-100 text-gray-700 border-gray-300",
};

const StaffingItem = ({ link, date, title, roles }) => {
    return (
        <div className="py-2">
            <span className="md:hidden text-xs md:text-sm tracking-widest uppercase text-gray-500">
                {date}
            </span>

            {/* Title */}
            <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-baseline gap-2"
            >
                <h3 className="mt-1 text-lg md:text-2xl py-1 font-bold text-black rounded-lg transition-all duration-300 md:hover:text-blue-400 md:hover:bg-white md:hover:px-5 md:hover:shadow-md">
                    {title}
                </h3>

                <span className="text-xs md:text-sm tracking-widest uppercase text-black hidden md:block">
                    {date}
                </span>
            </a>

            {/* Roles */}
            <div className="mt-2 flex flex-wrap gap-2">
                {roles.map((role, idx) => {
                    const key = role.toLowerCase();
                    const style = ROLE_STYLES[key] || ROLE_STYLES.default;

                    return (
                        <span
                            key={idx}
                            className={`text-xs md:text-sm px-2.5 py-0.5 rounded-md border font-medium ${style} md:hover:px-5 transition-all duration-300`}
                        >
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
        <section className="w-full px-4 md:px-24 flex justify-center items-center">
            <div className="w-full md:w-7/8 px-5 py-5 bg-white/50 backdrop-blur-md rounded-lg shadow-lg">
                <div className="w-full px-4">
                    <div className="mx-auto text-center">
                        <h1 className="font-bold text-black text-xl md:text-3xl">
                            Staffing History
                        </h1>
                    </div>
                </div>

                <div className="mt-5 w-full px-4 py-4 border-t-2 border-t-black overflow-y-auto max-h-[50vh]">
                    <div className="mt-4 divide-y divide-gray-300">
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
