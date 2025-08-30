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
		{ to: "/tools", label: "TOOLS" },
		{ to: "/contact", label: "CONTACT" },
	];

	const iMap = {
		HOME: <i className="bi bi-house" />,
		PROJECTS: <i className="bi bi-kanban" />,
		BEATMAPS: <i className="bi bi-music-note-beamed" />,
		TOOLS: <i className="bi bi-wrench" />,
		CONTACT: <i className="bi bi-envelope" />,
	};

	return (
		<footer className="fixed bottom-0 left-0 w-full z-50">
			{/* Mobile Footer */}
			<div className="md:hidden flex flex-col items-center justify-end">
				{/* Hamburger button */}
				<button
					onClick={toggleFooter}
					className="bg-white/50 backdrop-blur-md text-black shadow-lg p-3 w-1/2 rounded-lg mb-2">
					<i className="bi bi-list text-2xl" />
				</button>

				{/* Expandable menu */}
				<div
					className={`transition-all duration-300 w-full bg-white/50 backdrop-blur-md rounded-t-xl overflow-hidden shadow-lg ${
						isOpen ? "max-h-[300px] py-4" : "max-h-0 py-0"
					}`}>
					<ul className="flex flex-col items-center gap-3 text-black font-medium">
						{links.map((link) => (
							<li key={link.label}>
								<Link
									to={link.to}
									onClick={() => setIsOpen(false)}
									className="text-base font-medium">
									{link.label}
								</Link>
							</li>
						))}
						<li>
							<a
								href="https://ant1po1e.itch.io"
								target="_blank"
								rel="noopener noreferrer"
								className="text-base font-medium">
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
								className="text-black text-2xl relative rounded-md p-2 transition-all duration-300 hover:text-blue-400 hover:bg-white hover:px-5 hover:shadow-md">
								{/* Icon */}
								{iMap[link.label]}
							</Link>
							{/* Tooltip */}
							<span className="absolute -top-13 left-1/2 -translate-x-1/2 bg-white text-black text-sm px-5 py-2 rounded-md opacity-0 shadow-md group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-300 whitespace-nowrap pointer-events-none">
								{link.label}
							</span>
						</div>
					))}
					<div className="relative group font-medium">
						<a
							href="https://ant1po1e.itch.io"
							target="_blank"
							rel="noopener noreferrer"
							className="text-black text-2xl relative rounded-md p-2 transition-all duration-300 hover:text-blue-400 hover:bg-white hover:px-5 hover:shadow-md">
							<i className="bi bi-controller" />
						</a>
						<span className="absolute -top-13 left-1/2 -translate-x-1/2 bg-white text-black text-sm px-5 py-2 rounded-md opacity-0 shadow-md group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-300 whitespace-nowrap pointer-events-none">
							ITCH.IO
						</span>
					</div>
				</div>
			</div>
		</footer>
	);
};
