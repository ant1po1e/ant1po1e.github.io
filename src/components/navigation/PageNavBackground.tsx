import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { PageItem } from "../../types";

interface PageNavBackgroundProps {
    currentPage: PageItem;
}

export const PageNavBackground: React.FC<PageNavBackgroundProps> = ({
    currentPage,
}) => {
    return (
        <div
            id="page-nav-background"
            className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden z-0"
            aria-hidden="true">
            {/* Dynamic Colored Ambient Glow Blobs */}
            <motion.div
                animate={{
                    background: `radial-gradient(circle at 50% 45%, ${currentPage.accentColor}25 0%, ${currentPage.secondaryAccent || "#0a0a0a"}15 45%, #050505 85%)`,
                }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full"
            />

            {/* Blurred Hero Backdrop Image */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentPage.id}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 0.18, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0 w-full h-full">
                    <img
                        src={currentPage.heroImage || currentPage.cover}
                        alt=""
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover filter blur-3xl saturate-150 transform scale-110"
                    />
                </motion.div>
            </AnimatePresence>

            <div className="absolute inset-0 flex items-center justify-center px-8 md:px-16 pointer-events-none opacity-[0.03] select-none">
                <span className="font-mono text-8xl md:text-[14rem] font-bold text-white tracking-tighter">
                    Antipole
                </span>
            </div>

            {/* Noise Texture Overlay */}
            <div className="absolute inset-0 noise-overlay opacity-35" />

            {/* Vignette Overlay */}
            <div className="absolute inset-0 bg-radial from-transparent via-black/40 to-black/90 pointer-events-none" />
        </div>
    );
};
