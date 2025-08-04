import { useEffect } from "react";
import { Footer } from "../components/Footer";
import { SnapCalcSection } from "./../components/SnapCalcSection";

export const SnapCalculator = () => {
	useEffect(() => {
		document.title = "Antipole | Tools - Snap Calculator ";
	}, []);

	return (
		<main className="relative z-10 max-w-[1200px] mx-auto px-6 pt-10 pb-6 min-h-[calc(100vh-72px)]">
			<SnapCalcSection />
			<Footer />
		</main>
	);
};
