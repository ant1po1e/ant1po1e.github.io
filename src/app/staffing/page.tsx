import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { StaffingSection } from "@/components/StaffingSection";

export const metadata: Metadata = {
    title: "Tournaments Staffing",
};

export default function StaffingPage() {
    return (
        <main className="relative z-10 max-w-[1200px] mx-auto px-6 pt-10 pb-6 min-h-[calc(100vh-72px)]">
            <StaffingSection />
            <Footer />
        </main>
    );
}
