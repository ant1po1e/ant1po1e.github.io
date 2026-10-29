import React, { useEffect, useRef, useState } from "react";
import { NAV_PAGES } from "../../data/pagesData";
import { useIsMobile } from "../../hooks/useIsMobile";
import { gsap, useGSAP, withMotion, EASE } from "../../lib/motionUtils";

interface LoadingScreenProps {
    onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);
    const [isDone, setIsDone] = useState(false);
    const isMobile = useIsMobile();
    const rootRef = useRef<HTMLDivElement>(null);
    const eyebrowRef = useRef<HTMLSpanElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const barRef = useRef<HTMLDivElement>(null);
    const statusRef = useRef<HTMLSpanElement>(null);

    // Intro: eyebrow, brand title and status line fade/settle in once.
    useGSAP(
        () => {
            gsap.fromTo(
                eyebrowRef.current,
                { opacity: 0, y: -8 },
                { opacity: 0.5, y: 0, ...withMotion(isMobile, { duration: 0.8, delay: 0.1 }) },
            );
            gsap.fromTo(
                titleRef.current,
                { opacity: 0, letterSpacing: "0.2em", scale: 0.95 },
                {
                    opacity: 1,
                    letterSpacing: "0.4em",
                    scale: 1,
                    ...withMotion(isMobile, { duration: 1.2, ease: EASE.expo }),
                },
            );
            gsap.fromTo(
                statusRef.current,
                { opacity: 0 },
                { opacity: 0.4, ...withMotion(isMobile, { duration: 0.5, delay: 0.3 }) },
            );
        },
        { scope: rootRef },
    );

    // Progress line follows the preload percentage.
    useGSAP(
        () => {
            gsap.to(barRef.current, {
                width: `${progress}%`,
                overwrite: "auto",
                ...withMotion(isMobile, { duration: 0.3, ease: EASE.out }),
            });
        },
        { scope: rootRef, dependencies: [progress] },
    );

    // Exit: fade the whole screen out once loading is done.
    useGSAP(
        () => {
            if (!isDone) return;
            gsap.to(rootRef.current, {
                opacity: 0,
                ...withMotion(isMobile, { duration: 0.8, ease: EASE.soft }),
            });
        },
        { scope: rootRef, dependencies: [isDone] },
    );

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
        <div
            ref={rootRef}
            id="loading-screen"
            className="fixed inset-0 z-10000 bg-[#050505] flex flex-col items-center justify-center cursor-wait">
            {/* Subtle background ambient pulse */}
            <div className="absolute inset-0 bg-radial from-white/3 to-transparent pointer-events-none" />

            <div className="relative flex flex-col items-center">
                <span
                    ref={eyebrowRef}
                    className="text-[12px] font-japanese tracking-[0.6em] text-white/50 mb-3"></span>

                {/* Central Brand */}
                <h1
                    ref={titleRef}
                    className="text-2xl md:text-4xl font-display font-light text-[#F5F5F5] uppercase text-center pl-2">
                    a n t i p o l e
                </h1>

                {/* Minimalist Progress Line */}
                <div className="w-28 md:w-36 h-px bg-white/10 mt-6 relative overflow-hidden">
                    <div
                        ref={barRef}
                        className="absolute inset-y-0 left-0 bg-white/80"
                        style={{ width: "0%" }}
                    />
                </div>

                {/* Small status indicator */}
                <span
                    ref={statusRef}
                    className="text-[9px] uppercase tracking-[0.3em] text-white/50 mt-3 font-mono">
                    CALIBRATING SYSTEM // {progress}%
                </span>
            </div>
        </div>
    );
};
