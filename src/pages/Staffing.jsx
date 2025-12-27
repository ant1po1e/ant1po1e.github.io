import { Footer } from "../components/Footer";
import { useEffect } from "react";
import { StaffingSection } from "./../components/StaffingSection";

export const Staffing = () => {
    useEffect(() => {
        document.title = "Antipole | Tournaments Staffing";
    }, []);

    return (
        <main className="relative z-10 max-w-[1200px] mx-auto px-6 pt-10 pb-6 min-h-[calc(100vh-72px)]">
            <StaffingSection />
            <Footer />
        </main>
    );
};
