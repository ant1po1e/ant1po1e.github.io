import { Link } from "react-router-dom";

export const ToolsSection = () => {
	return (
		<section className="w-full px-4 md:px-24 flex justify-center items-center">
			<div className="w-full md:w-1/2 px-5 py-5 bg-white/50 backdrop-blur-md rounded-lg shadow-lg mb-20 sm:mb-0">
				<div className="w-full px-4">
					<div className="mx-auto text-center">
						<h1 className="font-bold text-black text-xl md:text-3xl">Tools</h1>
					</div>
				</div>

				<div className="text-center mt-5 w-full px-4 py-4 border-t-2 text-base md:text-xl border-t-black text-white">
					<ul className="space-y-3" role="list">
						{/* Snap Calculator */}
						<li role="listitem" className="flex justify-center">
							<Link
								to="/tools/snap-calculator"
								aria-label="Go to Snap Calculator tool"
								className="relative flex items-center justify-center mt-2 py-2 px-4 md:px-8 
                  overflow-hidden font-semibold text-black rounded-lg 
                  transition-all duration-300 ease-in-out 
                  md:hover:bg-white md:hover:text-blue-400 md:hover:scale-110 group">
								Snap Calculator
								{/* Hover arrows */}
								<span className="absolute left-0 -translate-x-12 md:group-hover:translate-x-0 ease-out duration-200">
									<i className="bi bi-arrow-right" />
								</span>
								<span className="absolute right-0 translate-x-12 md:group-hover:translate-x-0 ease-out duration-200">
									<i className="bi bi-arrow-left" />
								</span>
							</Link>
						</li>

						{/* BBCode Generator */}
						<li role="listitem" className="flex justify-center">
							<Link
								to="/tools/bbcode-generator"
								aria-label="Go to BBCode Text Colorizer tool"
								className="relative flex items-center justify-center mt-2 py-2 px-4 md:px-8 
                  overflow-hidden font-semibold text-black rounded-lg 
                  transition-all duration-300 ease-in-out 
                  md:hover:bg-white md:hover:text-blue-400 md:hover:scale-110 group">
								BBCode Text Colorizer
								{/* Hover arrows */}
								<span className="absolute left-0 -translate-x-12 md:group-hover:translate-x-0 ease-out duration-200">
									<i className="bi bi-arrow-right" />
								</span>
								<span className="absolute right-0 translate-x-12 md:group-hover:translate-x-0 ease-out duration-200">
									<i className="bi bi-arrow-left" />
								</span>
							</Link>
						</li>
					</ul>
				</div>
			</div>
		</section>
	);
};
