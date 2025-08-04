import { Footer } from "../components/Footer";
import { BBCodeSection } from "../components/BBCodeSection";
import { useEffect } from "react";

export const BBCodeGenerator = () => {
	useEffect(() => {
		document.title = "Antipole | Tools - BBCode Generator";
	}, []);

	return (
		<main className="relative z-10 max-w-[1200px] mx-auto px-6 pt-10 pb-6 min-h-[calc(100vh-72px)]">
			<BBCodeSection />
			<Footer />
		</main>
	);
};
