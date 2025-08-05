import { ProjectsSection } from "../components/ProjectsSection";
import { Footer } from "../components/Footer";
import { useEffect } from "react";
import { OsuBeatmapFeed } from "../components/OsuBeatmapFeed";

export const Projects = () => {
	useEffect(() => {
		document.title = "Antipole | Projects";
	}, []);

	return (
		<main className="relative z-10 max-w-[1200px] mx-auto px-6 pt-10 pb-6 min-h-[calc(100vh-72px)]">
			<OsuBeatmapFeed userId="17258072" type="favourite" limit={6} />
			<Footer />
		</main>
	);
};
