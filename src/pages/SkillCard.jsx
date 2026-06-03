import { Footer } from "../components/Footer";
import { SkillCardSection } from "../components/SkillCardSection";
import { useEffect } from "react";

export const SkillCard = () => {
    useEffect(() => {
        document.title = "Antipole | Tools - Skill Card Generator";
    }, []);

    return (
        <main className="relative z-10 max-w-[1200px] mx-auto px-6 pt-10 pb-6 min-h-[calc(100vh-72px)]">
            <SkillCardSection />
            <Footer />
        </main>
    );
};
