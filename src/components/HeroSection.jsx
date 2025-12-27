import { Typewriter } from "react-simple-typewriter";

export const HeroSection = () => {
    return (
        <section
            className="w-full px-4 md:px-24"
            aria-label="Hero Section with introduction and social links"
        >
            {/* Title */}
            <div className="mx-auto text-center md:text-start">
                <h1 className="font-bold text-white text-5xl md:text-[100px] mb-5 neon font-merienda relative inline-block cursor-pointer group">
                    Antipole
                    {/* underline */}
                    <span
                        aria-hidden="true"
                        className="absolute left-0 -bottom-2 w-0 h-[5px] bg-white transition-all duration-500 md:group-hover:w-1/2 neon-underline"
                    />
                </h1>
            </div>

            {/* Typewriter */}
            <div className="flex flex-wrap justify-center md:justify-start mx-auto mt-1 md:mt-3 text-xl md:text-3xl neon">
                <div className="font-mono font-bold" aria-label="Roles I do">
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
            </div>

            {/* Description */}
            <div className="flex flex-wrap justify-start mt-10 md:mt-20 bg-white/50 backdrop-blur-md rounded-lg shadow-lg max-w-[450px]">
                <p className="font-normal text-black text-base mb-5 font-sans m-5">
                    Hello! I'm Antipole, a web developer and game developer. I
                    create websites and games that are not only functional but
                    also visually appealing. My passion for coding and design
                    drives me to constantly learn and improve my skills,
                    delivering creative and efficient solutions for every
                    project I undertake.
                </p>
            </div>

            {/* Mobile social links */}
            <div className="flex flex-wrap md:hidden justify-center gap-2 mt-4">
                {/* GitHub dengan teks di kiri dalam kotak */}
                <a
                    href="https://github.com/ant1po1e"
                    aria-label="GitHub"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 h-10 rounded-lg bg-white flex flex-row items-center gap-2 shadow-md md:hover:bg-blue-400 focus:ring-2 focus:ring-blue-400 transition duration-300 group"
                >
                    <span className="text-sm font-medium text-black md:group-hover:text-white transition-colors duration-300">
                        GitHub
                    </span>
                    <i
                        className="bi bi-github text-lg md:group-hover:text-2xl md:group-hover:text-white transition-all duration-300"
                        aria-hidden="true"
                    />
                </a>

                {/* YouTube dengan teks di kanan dalam kotak */}
                <a
                    href="https://www.youtube.com/@ant1po1e"
                    aria-label="YouTube"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 h-10 rounded-lg bg-white flex flex-row-reverse items-center gap-2 shadow-md md:hover:bg-blue-400 focus:ring-2 focus:ring-blue-400 transition duration-300 group"
                >
                    <span className="text-sm font-medium text-black md:group-hover:text-white transition-colors duration-300">
                        YouTube
                    </span>
                    <i
                        className="bi bi-youtube text-lg md:group-hover:text-2xl md:group-hover:text-white transition-all duration-300"
                        aria-hidden="true"
                    />
                </a>
            </div>

            {/* Background artwork */}
            <div className="relative w-full px-4 md:px-24">
                <img
                    src="/amamiya.webp"
                    alt="" // kalau purely dekoratif, alt kosong
                    className="fixed right-0 top-1/2 -translate-y-1/2 drop-shadow-2xl translate-x-1/4 w-0 md:w-[90%] md:h-screen object-cover pointer-events-none max-w-none z-[-1]"
                    aria-hidden="true"
                />

                {/* Artwork credit */}
                <div className="fixed right-48 top-1/2 translate-y-1/2 flex">
                    <a
                        href="https://x.com/amairoka"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative hidden md:inline-flex items-center p-3 text-sm font-medium text-center text-white bg-blue-400 rounded-md shadow-lg md:hover:scale-110 md:hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 transition-all duration-300 group"
                    >
                        <span>Artwork Credit</span>
                        {/* Badge with tooltip */}
                        <div
                            className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -end-2 md:group-hover:scale-0 transition duration-300"
                            aria-hidden="true"
                        >
                            !
                        </div>
                    </a>
                </div>
            </div>
        </section>
    );
};
