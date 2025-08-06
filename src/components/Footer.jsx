import { Link } from "react-router-dom";

export const Footer = () => {
	return (
		<footer className="fixed bottom-0 md:bottom-8 left-1/2 transform -translate-x-1/2 flex flex-wrap items-center justify-center gap-6">
			<div className="w-full bg-white/50 backdrop-blur-md rounded-lg p-6 shadow-lg flex gap-5 md:gap-12">
				<p className="font-merienda">
					<Link
						to="/projects"
						className="text-black text-base md:text-2xl relative md:hover:text-blue-400 rounded-md p-0 md:hover:py-1 md:hover:px-2 md:hover:bg-white transition-all duration-300"
						aria-label="Projects">
						PROJECTS
					</Link>
				</p>
				<p className="font-merienda">
					<Link
						to="/contributed-beatmaps"
						className="text-black text-base md:text-2xl relative md:hover:text-blue-400 rounded-md p-0 md:hover:py-1 md:hover:px-2 md:hover:bg-white transition-all duration-300"
						aria-label="Beatmaps">
						Beatpams
					</Link>
				</p>
				<p className="font-merienda">
					<Link
						to="/tools"
						className="text-black text-base md:text-2xl relative md:hover:text-blue-400 rounded-md p-0 md:hover:py-1 md:hover:px-2 md:hover:bg-white transition-all duration-300">
						TOOLS
					</Link>
				</p>
				<p className="font-merienda">
					<Link
						to="/contact"
						className="text-black text-base md:text-2xl relative md:hover:text-blue-400 rounded-md p-0 md:hover:py-1 md:hover:px-2 md:hover:bg-white transition-all duration-300">
						CONTACT
					</Link>
				</p>
				<p className="font-merienda">
					<a
						href="https://ant1po1e.itch.io"
						className="text-black text-base md:text-2xl relative md:hover:text-blue-400 rounded-md p-0 md:hover:py-1 md:hover:px-2 md:hover:bg-white transition-all duration-300">
						ITCH.IO
					</a>
				</p>
			</div>
		</footer>
	);
};
