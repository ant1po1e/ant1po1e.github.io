import { useState } from "react";
import { Link } from "react-router-dom";

export const Footer = () => {
	const [isOpen, setIsOpen] = useState(false);

	const toggleFooter = () => {
		setIsOpen((prev) => !prev);
	};

	const links = [
		{ to: "/projects", label: "PROJECTS" },
		{ to: "/contributed-beatmaps", label: "BEATMAPS" },
		{ to: "/tools", label: "TOOLS" },
		{ to: "/contact", label: "CONTACT" },
	];

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
					<ul className="flex flex-col items-center gap-3 text-black font-merienda">
						{links.map((link) => (
							<li key={link.label}>
								<Link
									to={link.to}
									onClick={() => setIsOpen(false)}
									className="text-base font-semibold hover:text-blue-500 transition duration-200">
									{link.label}
								</Link>
							</li>
						))}
						<li>
							<a
								href="https://ant1po1e.itch.io"
								target="_blank"
								rel="noopener noreferrer"
								className="text-base font-semibold hover:text-blue-500 transition duration-200">
								ITCH.IO
							</a>
						</li>
					</ul>
				</div>
			</div>

			{/* Desktop Footer */}
			<div className="hidden md:flex items-center justify-center mb-8">
				<div className="bg-white/50 backdrop-blur-md rounded-lg p-6 shadow-lg flex gap-12">
					{links.map((link) => (
						<p key={link.label} className="font-merienda">
							<Link
								to={link.to}
								className="text-black text-2xl hover:text-blue-400 hover:bg-white px-2 py-1 rounded-md transition-all duration-300">
								{link.label}
							</Link>
						</p>
					))}
					<p className="font-merienda">
						<a
							href="https://ant1po1e.itch.io"
							className="text-black text-2xl hover:text-blue-400 hover:bg-white px-2 py-1 rounded-md transition-all duration-300"
							target="_blank"
							rel="noopener noreferrer">
							ITCH.IO
						</a>
					</p>
				</div>
			</div>
		</footer>
	);
};
