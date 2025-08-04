import { Typewriter } from "react-simple-typewriter";

export const HeroSection = () => {
	return (
		<section className="w-full px-4 md:px-24">
			<div className="mx-auto text-center md:text-start">
				<h1 className="font-bold text-white text-5xl md:text-[100px] mb-5 neon font-merienda relative inline-block cursor-pointer group">
					Antipole
					<span className="absolute left-0 -bottom-2 w-0 h-[5px] bg-white transition-all duration-500 md:group-hover:w-1/2 neon-underline" />
				</h1>
			</div>

			<div className="flex flex-wrap justify-center md:justify-start mx-auto mt-7 md:mt-3 text-xl md:text-3xl neon">
				<div className="font-mono font-bold">
					<Typewriter
						words={[
							"Game Developer",
							"Desktop Developer",
							"Photographer",
							"Rhythm Gamer",
						]}
						cursor="true"
						delaySpeed={2000}
						loop
					/>
				</div>
			</div>

			<div className="flex flex-wrap justify-start mt-20 bg-white/50 backdrop-blur-md rounded-lg shadow-lg max-w-[450px]">
				<h1 className="font-normal text-black text-base mb-5 font-sans m-5">
					Hello! I'm Antipole, a web developer and game developer. I create
					websites and games that are not only functional but also visually
					appealing. My passion for coding and design drives me to constantly
					learn and improve my skills, delivering creative and efficient
					solutions for every project I undertake.
				</h1>
			</div>

			<div className="flex flex-wrap md:hidden justify-center gap-2 mt-4">
				<a
					href="https://github.com/ant1po1e"
					aria-label="GitHub"
					className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-lg shadow-md md:hover:bg-blue-400 transition duration-300 group">
					<i className="bi bi-github md:group-hover:text-2xl md:group-hover:text-white transition-all duration-300" />
				</a>
				<a
					href="https://www.youtube.com/@ant1po1e"
					aria-label="Youtube"
					className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-lg shadow-md md:hover:bg-blue-400 transition duration-300 group">
					<i className="bi bi-youtube md:group-hover:text-2xl md:group-hover:text-white transition-all duration-300" />
				</a>
			</div>

			<div className="relative w-full px-4 md:px-24">
				<img
					src="/amamiya.webp"
					alt="Amamiya"
					className="fixed right-0 top-1/2 -translate-y-1/2 drop-shadow-2xl translate-x-1/4 w-0 md:w-[90%] md:h-screen object-cover pointer-events-none max-w-none z-[-1]"
				/>
				<div className="fixed right-48 top-1/2 translate-y-1/2 flex">
					<a
						href="https://x.com/amairoka"
						blank
						className="relative hidden md:inline-flex items-center p-3 text-sm font-medium text-center text-white bg-blue-400 rounded-md shadow-lg md:hover:scale-110 md:hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 transition-all duration-300 group">
						<span>Artwork Credit</span>
						<div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -end-2 md:group-hover:scale-0 transition duration-300">
							!
						</div>
					</a>
				</div>
			</div>
		</section>
	);
};
