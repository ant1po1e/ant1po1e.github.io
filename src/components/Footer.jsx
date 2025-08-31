import { useState } from "react";
import { Link } from "react-router-dom";

export const Footer = () => {
	const [isOpen, setIsOpen] = useState(false);

	const toggleFooter = () => {
		setIsOpen((prev) => !prev);
	};

	const links = [
		{ to: "/", label: "HOME" },
		{ to: "/projects", label: "PROJECTS" },
		{ to: "/contributed-beatmaps", label: "BEATMAPS" },
		{ to: "/how-to-map", label: "HOW TO MAP" },
		{ to: "/tools", label: "TOOLS" },
		{ to: "/contact", label: "CONTACT" },
	];

	const iMap = {
		HOME: <i className="bi bi-house-door-fill" aria-hidden="true" />,
		PROJECTS: <i className="bi bi-kanban-fill" aria-hidden="true" />,
		BEATMAPS: <i className="bi bi-music-note-list" aria-hidden="true" />,
		TOOLS: <i className="bi bi-tools" aria-hidden="true" />,
		CONTACT: <i className="bi bi-envelope-fill" aria-hidden="true" />,
		"HOW TO MAP": <i class="bi bi-map-fill"></i>,
	};

	return (
		<footer
			className="fixed bottom-0 left-0 w-full z-50"
			role="contentinfo"
			aria-label="Website Footer">
			{/* Mobile Footer */}
			<div className="md:hidden flex flex-col items-center justify-end">
				{/* Hamburger button */}
				<button
					onClick={toggleFooter}
					className="bg-white/50 backdrop-blur-md text-black shadow-lg p-3 w-1/2 rounded-lg mb-2"
					aria-expanded={isOpen}
					aria-controls="mobile-footer-menu"
					aria-label="Toggle footer menu">
					<i className="bi bi-list text-2xl" aria-hidden="true" />
				</button>

				{/* Expandable menu */}
				<div
					id="mobile-footer-menu"
					className={`transition-all duration-300 w-full bg-white/50 backdrop-blur-md rounded-t-xl overflow-hidden shadow-lg ${
						isOpen ? "max-h-[300px] py-4" : "max-h-0 py-0"
					}`}>
					<ul className="flex flex-col items-center text-black font-medium divide-y-1 divide-gray-300 px-10">
						{links.map((link) => (
							<li key={link.label} className="w-full">
								<Link
									to={link.to}
									onClick={() => setIsOpen(false)}
									className="block w-full py-2 text-center text-base font-medium md:hover:bg-black/10 transition"
									aria-label={`Navigate to ${link.label}`}>
									{link.label}
								</Link>
							</li>
						))}
						<li className="w-full">
							<a
								href="https://ant1po1e.itch.io"
								target="_blank"
								rel="noopener noreferrer"
								className="block w-full py-2 text-center text-base font-medium md:hover:bg-black/10 transition"
								aria-label="Visit ITCH.IO (opens in a new tab)">
								ITCH.IO
							</a>
						</li>
					</ul>
				</div>
			</div>

			{/* Desktop Footer */}
			<div className="hidden md:flex items-center justify-center mb-8">
				<div className="bg-white/50 backdrop-blur-md rounded-lg p-6 shadow-lg flex gap-6">
					{links.map((link) => (
						<div key={link.label} className="relative group font-medium">
							<Link
								to={link.to}
								className="text-black text-2xl relative rounded-md p-2 transition-all duration-300 md:hover:text-blue-400 md:hover:bg-white md:hover:px-5 md:hover:shadow-md"
								aria-label={`Navigate to ${link.label}`}>
								{iMap[link.label]}
							</Link>
							{/* Tooltip */}
							<span
								role="tooltip"
								className="absolute -top-13 left-1/2 -translate-x-1/2 bg-white text-black text-sm px-5 py-2 rounded-md opacity-0 shadow-md md:group-hover:opacity-100 md:group-hover:-translate-y-1 transition-all duration-300 whitespace-nowrap pointer-events-none">
								{link.label}
							</span>
						</div>
					))}
					<div className="relative group font-medium">
						<a
							href="https://ant1po1e.itch.io"
							target="_blank"
							rel="noopener noreferrer"
							className="text-black text-2xl relative rounded-md p-2 transition-all duration-300 md:hover:text-blue-400 md:hover:bg-white md:hover:px-5 md:hover:shadow-md"
							aria-label="Visit ITCH.IO (opens in a new tab)">
							<i className="bi bi-shop-window" aria-hidden="true" />
						</a>
						<span
							role="tooltip"
							className="absolute -top-13 left-1/2 -translate-x-1/2 bg-white text-black text-sm px-5 py-2 rounded-md opacity-0 shadow-md md:group-hover:opacity-100 md:group-hover:-translate-y-1 transition-all duration-300 whitespace-nowrap pointer-events-none">
							ITCH.IO
						</span>
					</div>
				</div>
			</div>
		</footer>
	);
};
