import { Carousel } from "flowbite-react";

const projects = [
	{
		title: "Gulanova Website",
		image: "/projects/gulanova-site.webp",
		alt: "Gulanova Website",
		link: "https://gulanova.top",
		stack: "html,css,js,tailwind,jquery,figma",
		icon: "bi bi-link",
		linkText: "Site",
	},
	{
		title: "Wave Walker",
		image: "/projects/wave-walker.webp",
		alt: "Wave Walker",
		link: "https://ant1po1e.itch.io/wave-walker",
		stack: "unity,cs",
		icon: "bi bi-shop-window",
		linkText: "Itch.io",
	},
	{
		title: "Wave Walker 2",
		image: "/projects/wave-walker-2.webp",
		alt: "Wave Walker 2",
		link: "https://ant1po1e.itch.io/wave-walker-2",
		stack: "unity,cs",
		icon: "bi bi-shop-window",
		linkText: "Itch.io",
	},
	{
		title: "Wave Walker 3",
		image: "/projects/wave-walker-3.webp",
		alt: "Wave Walker 3",
		link: "https://ant1po1e.itch.io/wave-walker-3-the-box",
		stack: "unity,cs",
		icon: "bi bi-shop-window",
		linkText: "Itch.io",
	},
	{
		title: "Dodge the Thing",
		image: "/projects/dodge-the-thing.webp",
		alt: "Dodge the Thing",
		link: "https://ant1po1e.itch.io/dodge-the-thing",
		stack: "unity,cs",
		icon: "bi bi-shop-window",
		linkText: "Itch.io",
	},
	{
		title: "Apolz Pomodoro",
		image: "/projects/apolz-pomodoro.webp",
		alt: "Apolz Pomodoro",
		link: "https://ant1po1e.itch.io/apolz-pomodoro",
		stack: "unity,cs",
		icon: "bi bi-shop-window",
		linkText: "Itch.io",
	},
	{
		title: "Zombie Shooter",
		image: "/projects/zombie-shooter.webp",
		alt: "Zombie Shooter",
		link: "https://github.com/ant1po1e/zombie-shooter-course",
		stack: "unity,cs",
		icon: "bi bi-file-earmark-code",
		linkText: "Source Code",
	},
	{
		title: "Gothicvania",
		image: "/projects/gothicvania.webp",
		alt: "Find The Key",
		link: "https://github.com/ant1po1e/Gothicvania",
		stack: "unity,cs",
		icon: "bi bi-file-earmark-code",
		linkText: "Source Code",
	},
	{
		title: "Find The Key",
		image: "/projects/find-the-key.webp",
		alt: "Find The Key",
		link: "https://github.com/ant1po1e/Find-The-Key",
		stack: "html",
		icon: "bi bi-file-earmark-code",
		linkText: "Source Code",
	},
];

export const ProjectsSection = () => {
	return (
		<section className="w-full px-4 md:px-24 flex justify-center items-center overflow-x-hidden">
			<div className="w-full md:w-[62%] px-5 py-5 bg-white/50 backdrop-blur-md rounded-lg shadow-lg">
				<div className="w-full px-4">
					<div className="mx-auto text-center">
						<h1 className="font-bold text-black font-merienda text-xl md:text-3xl">
							Projects
						</h1>
					</div>
				</div>

				<div className="text-center mt-5 w-full px-4 py-4 border-t-2 border-t-black text-white">
					<div className="h-[7.2rem] md:h-72 w-full rounded-lg overflow-x-hidden">
						<Carousel
							className="overflow-x-hidden relative"
							leftControl={
								<span className="inline-flex items-center justify-center w-10 h-10 sm:w-10 sm:h-10 rounded-lg bg-black/50 hover:bg-white/50 ring-4 ring-white outline-none hover:scale-110 transition duration-300">
									<svg
										className="w-4 h-4 text-white rtl:rotate-180"
										aria-hidden="true"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 6 10">
										<path
											stroke="currentColor"
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M5 1 1 5l4 4"
										/>
									</svg>
								</span>
							}
							rightControl={
								<span className="inline-flex items-center justify-center w-10 h-10 sm:w-10 sm:h-10 rounded-lg bg-black/50 hover:bg-white/50 ring-4 ring-white outline-none hover:scale-110 transition duration-300">
									<svg
										className="w-4 h-4 text-white"
										aria-hidden="true"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 6 10">
										<path
											stroke="currentColor"
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="m1 1 4 4-4 4"
										/>
									</svg>
								</span>
							}
							indicators={false}
							slideInterval={5000}
							pauseOnHover>
							{projects.map((project, idx) => (
								<div key={idx} className="relative w-full h-full group">
									<img
										src={project.image}
										alt={project.title}
										className="absolute block max-w-full max-h-full w-full h-full object-contain md:object-cover -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 rounded-lg"
									/>
									<div className="absolute block w-full h-full py-6 px-6 sm:py-10 sm:px-20 -translate-x-1/2 z-50 -translate-y-1/2 top-1/2 left-1/2 rounded-lg bg-white/70 backdrop-blur-md text-black opacity-0 md:group-hover:opacity-100 transition duration-300">
										<h2 className="hidden md:inline font-bold text-lg md:text-2xl">
											{project.title}
										</h2>
										<a
											href={project.link}
											className="inline md:hidden font-bold text-lg md:text-2xl">
											{project.title}
										</a>
										<div className="mt-2 flex justify-center">
											<img
												src={`https://skillicons.dev/icons?i=${project.stack}`}
												alt="Stack"
											/>
										</div>
										<div className="mt-12 md:hover:scale-110 transition duration-300">
											<a
												href={project.link}
												className="text-lg md:text-xl hidden md:inline bg-white rounded-lg p-2 md:hover:bg-blue-400 md:hover:text-white md:hover:scale-110 transition duration-300">
												<i className={`text-2xl ${project.icon}`}></i>{" "}
												{project.label}
											</a>
										</div>
									</div>
								</div>
							))}
						</Carousel>
					</div>
				</div>
			</div>
		</section>
	);
};
