import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { ArticleSection } from "@/components/ArticleSection";

export const metadata: Metadata = {
    title: "How to Map",
};

export default function HowToMapPage() {
    return (
        <main className="relative z-10 max-w-[1200px] mx-auto px-6 pt-10 pb-6 min-h-[calc(100vh-72px)]">
            <ArticleSection />
            <Footer />
        </main>
    );
}
