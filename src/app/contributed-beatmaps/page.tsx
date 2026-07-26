import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { OsuBeatmapFeed } from "@/components/OsuBeatmapFeed";

export const metadata: Metadata = {
    title: "Contributed Beatmaps",
};

export default function BeatmapsPage() {
    return (
        <main className="relative z-10 max-w-[1200px] mx-auto px-6 pt-10 pb-6 min-h-[calc(100vh-72px)]">
            <OsuBeatmapFeed />
            <Footer />
        </main>
    );
}
