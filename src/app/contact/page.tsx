import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { ContactSection } from "@/components/ContactSection";

export const metadata: Metadata = {
    title: "Contact",
};

export default function ContactPage() {
    return (
        <main className="relative z-10 max-w-[1200px] mx-auto px-6 pt-10 pb-6 min-h-[calc(100vh-72px)]">
            <ContactSection />
            <Footer />
        </main>
    );
}
