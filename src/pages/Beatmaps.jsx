import { Footer } from "../components/Footer";
import { useEffect } from "react";
import { OsuBeatmapFeed } from "../components/OsuBeatmapFeed";

export const Beatmaps = () => {
	useEffect(() => {
		document.title = "Antipole | Contributed Beatmaps";
	}, []);

	return (
		<main className="relative z-10 max-w-[1200px] mx-auto px-6 pt-10 pb-6 min-h-[calc(100vh-72px)]">
			<OsuBeatmapFeed />
			<Footer />
		</main>
	);
};
