import { Footer } from "../components/Footer";
import { useEffect } from "react";
import { ArticleSection } from "./../components/ArticleSection";

export const Article = () => {
    useEffect(() => {
        document.title = "Antipole | How to Map";
    }, []);

    return (
        <main className="relative z-10 max-w-[1200px] mx-auto px-6 pt-10 pb-6 min-h-[calc(100vh-72px)]">
            <ArticleSection />
            <Footer />
        </main>
    );
};
