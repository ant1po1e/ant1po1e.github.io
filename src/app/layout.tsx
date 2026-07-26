import type { Metadata } from "next";
import { ThemeInit } from "../../.flowbite-react/init";
import { Navbar } from "@/components/Navbar";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./globals.css";

export const metadata: Metadata = {
    title: {
        default: "Antipole | Home",
        template: "Antipole | %s",
    },
    description: "Some osu! stuff and projects.",
    keywords: [
        "Antipole",
        "portfolio",
        "web developer",
        "game developer",
        "osu",
        "osu mania",
        "vsrg",
        "rhythm game",
        "projects",
        "tools",
        "programming",
        "software",
    ],
    authors: [{ name: "Antipole" }],
    openGraph: {
        title: "Antipole's Website",
        description: "Some osu! stuff and projects.",
        images: ["/og.png"],
        url: "https://ant1po1e.vercel.app",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Antipole's Website",
        description: "Some osu! stuff and projects.",
        images: ["/og.png"],
    },
    icons: {
        icon: "/favicon.ico",
    },
    other: {
        "google-adsense-account": "ca-pub-4499218414555492",
        "google-site-verification":
            "eJaPf7ohpQmqgraBzlok9eJg7SV9TPzDdf9vcRG1dY4",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="anonymous"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Merienda:wght@300..900&family=Quicksand:wght@300..700&display=swap"
                    rel="stylesheet"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;1,500&family=Inter:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body className="relative min-h-screen bg-paper overflow-x-hidden select-none font-quicksand">
                <ThemeInit />
                <div className="absolute inset-0 bg-paper/60 backdrop-blur-[10px]" />
                <Navbar />
                {children}
            </body>
        </html>
    );
}
