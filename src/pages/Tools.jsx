import { ToolsSection } from "../components/ToolsSection";
import { Footer } from "../components/Footer";
import { useEffect } from "react";

export const Tools = () => {
	useEffect(() => {
		document.title = "Antipole | Tools";
	}, []);

	return (
		<main className="relative z-10 max-w-[1200px] mx-auto px-6 pt-10 pb-6 min-h-[calc(100vh-72px)]">
			<ToolsSection />
			<Footer />
		</main>
	);
};
