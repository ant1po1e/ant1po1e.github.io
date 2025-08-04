export const Sidebar = () => {
	return (
		<nav className="flex-col space-y-4 fixed top-28 left-6 z-30 hidden md:flex">
			<a
				href="https://github.com/ant1po1e"
				aria-label="GitHub"
				className="w-16 h-16 rounded-lg bg-white flex items-center justify-center text-3xl shadow-md md:hover:bg-blue-400 transition duration-300 group">
				<i className="bi bi-github md:group-hover:text-5xl md:group-hover:text-white transition-all duration-300"></i>
			</a>
			<a
				href="https://www.youtube.com/@ant1po1e"
				aria-label="Youtube"
				className="w-16 h-16 rounded-lg bg-white flex items-center justify-center text-3xl shadow-md md:hover:bg-blue-400 transition duration-300 group">
				<i className="bi bi-youtube md:group-hover:text-5xl md:group-hover:text-white transition-all duration-300"></i>
			</a>
		</nav>
	);
};
