import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { NAV_PAGES } from "../../data/pagesData";

interface LoadingScreenProps {
    onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);
    const [isDone, setIsDone] = useState(false);

    useEffect(() => {
        let loadedCount = 0;
        const imagesToPreload = NAV_PAGES.map((p) => p.cover);
        const total = Math.max(imagesToPreload.length, 1);

        const checkComplete = () => {
            loadedCount++;
            const currentProgress = Math.min(
                100,
                Math.round((loadedCount / total) * 100),
            );
            setProgress(currentProgress);
            if (loadedCount >= total) {
                setTimeout(() => {
                    setIsDone(true);
                    setTimeout(onComplete, 600);
                }, 300);
            }
        };

        imagesToPreload.forEach((src) => {
            const img = new Image();
            img.src = src;
            img.onload = checkComplete;
            img.onerror = checkComplete;
        });

        // Fallback safety timer so user is never stuck
        const safetyTimer = setTimeout(() => {
            setProgress(100);
            setIsDone(true);
            setTimeout(onComplete, 400);
        }, 1800);

        return () => clearTimeout(safetyTimer);
    }, [onComplete]);

    return (
        <AnimatePresence>
            {!isDone && (
                <motion.div
                    id="loading-screen"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="fixed inset-0 z-10000 bg-[#050505] flex flex-col items-center justify-center cursor-wait">
                    {/* Subtle background ambient pulse */}
                    <div className="absolute inset-0 bg-radial from-white/3 to-transparent pointer-events-none" />

                    <div className="relative flex flex-col items-center">
                        <motion.span
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 0.5, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            className="text-[12px] font-japanese tracking-[0.6em] text-white/50 mb-3"></motion.span>

                        {/* Central Brand */}
                        <motion.h1
                            initial={{
                                opacity: 0,
                                letterSpacing: "0.2em",
                                scale: 0.95,
                            }}
                            animate={{
                                opacity: 1,
                                letterSpacing: "0.4em",
                                scale: 1,
                            }}
                            transition={{
                                duration: 1.2,
                                ease: [0.16, 1, 0.3, 1],
                            }}
                            className="text-2xl md:text-4xl font-display font-light text-[#F5F5F5] uppercase text-center pl-2">
                            a n t i p o l e
                        </motion.h1>

                        {/* Minimalist Progress Line */}
                        <div className="w-28 md:w-36 h-px bg-white/10 mt-6 relative overflow-hidden">
                            <motion.div
                                className="absolute inset-y-0 left-0 bg-white/80"
                                initial={{ width: "0%" }}
                                animate={{ width: `${progress}%` }}
                                transition={{ ease: "easeOut", duration: 0.3 }}
                            />
                        </div>

                        {/* Small status indicator */}
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.4 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="text-[9px] uppercase tracking-[0.3em] text-white/50 mt-3 font-mono">
                            CALIBRATING SYSTEM // {progress}%
                        </motion.span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
