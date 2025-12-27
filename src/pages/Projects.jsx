import { ProjectsSection } from "../components/ProjectsSection";
import { Footer } from "../components/Footer";
import { useEffect } from "react";

export const Projects = () => {
    useEffect(() => {
        document.title = "Antipole | Projects";
    }, []);

    return (
        <main className="relative z-10 max-w-[1200px] mx-auto px-6 pt-10 pb-6 min-h-[calc(100vh-72px)]">
            <ProjectsSection />
            <Footer />
        </main>
    );
};
