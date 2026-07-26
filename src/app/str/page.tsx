import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { VaultSection } from "@/components/VaultSection";

export const metadata: Metadata = {
    title: "Vault",
};

export default function VaultPage() {
    return (
        <main className="relative z-10 max-w-[1200px] mx-auto px-6 pt-10 pb-6 min-h-[calc(100vh-72px)]">
            <VaultSection />
            <Footer />
        </main>
    );
}
