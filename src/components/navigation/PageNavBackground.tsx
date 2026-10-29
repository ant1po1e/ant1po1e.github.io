import React, { useRef } from "react";
import { PageItem } from "../../types";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useSwap } from "../../hooks/useSwap";
import {
    EASE,
    gsap,
    hexToRgb,
    mixRgb,
    rgba,
    useGSAP,
    withMotion,
    type RGB,
} from "../../lib/motionUtils";

interface PageNavBackgroundProps {
    currentPage: PageItem;
}

// Same stops as the original framer-motion gradient: accent at 25/255 alpha,
// secondary at 15/255 alpha (the old `${hex}25` / `${hex}15` suffixes).
const ACCENT_ALPHA = 0x25 / 255;
const SECONDARY_ALPHA = 0x15 / 255;

const buildGradient = (accent: RGB, secondary: RGB) =>
    `radial-gradient(circle at 50% 45%, ${rgba(accent, ACCENT_ALPHA)} 0%, ${rgba(secondary, SECONDARY_ALPHA)} 45%, #050505 85%)`;

const colorsFor = (page: PageItem): { accent: RGB; secondary: RGB } => ({
    accent: hexToRgb(page.accentColor),
    secondary: hexToRgb(page.secondaryAccent || "#0a0a0a"),
});

export const PageNavBackground: React.FC<PageNavBackgroundProps> = ({
    currentPage,
}) => {
    const isMobile = useIsMobile();
    const glowRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);

    // Colors currently on screen (mid-tween values included), so an
    // interrupted transition continues from where it visually is.
    const shownColors = useRef(colorsFor(currentPage));

    // Ambient glow: tween a 0→1 progress value and rebuild the gradient from
    // interpolated RGB each frame (GSAP can't interpolate multi-stop gradient
    // strings directly).
    useGSAP(
        () => {
            const el = glowRef.current;
            if (!el) return;
            const from = shownColors.current;
            const to = colorsFor(currentPage);
            const progress = { t: 0 };

            gsap.to(progress, {
                t: 1,
                overwrite: true,
                ...withMotion(isMobile, { duration: 1.2, ease: EASE.inOut }),
                onUpdate: () => {
                    const accent = mixRgb(from.accent, to.accent, progress.t);
                    const secondary = mixRgb(from.secondary, to.secondary, progress.t);
                    shownColors.current = { accent, secondary };
                    el.style.background = buildGradient(accent, secondary);
                },
                onComplete: () => {
                    shownColors.current = to;
                    el.style.background = buildGradient(to.accent, to.secondary);
                },
            });
        },
        { dependencies: [currentPage.id] },
    );

    // Blurred backdrop image: fade/scale the old one out, swap, then fade the
    // new one in (the GSAP version of AnimatePresence mode="wait").
    const shownPage = useSwap(currentPage, currentPage.id, imageRef, {
        exit: withMotion(isMobile, { opacity: 0, scale: 0.98, duration: 1.0, ease: EASE.soft }),
        enterFrom: { opacity: 0, scale: 1.05 },
        enterTo: withMotion(isMobile, { opacity: 0.18, scale: 1, duration: 1.0, ease: EASE.soft }),
    });

    return (
        <div
            id="page-nav-background"
            className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden z-0"
            aria-hidden="true">
            {/* Dynamic Colored Ambient Glow Blobs */}
            <div
                ref={glowRef}
                className="absolute inset-0 w-full h-full"
                style={{
                    background: buildGradient(
                        shownColors.current.accent,
                        shownColors.current.secondary,
                    ),
                }}
            />

            {/* Blurred Hero Backdrop Image */}
            <div ref={imageRef} className="absolute inset-0 w-full h-full">
                <img
                    src={shownPage.heroImage || shownPage.cover}
                    alt=""
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover filter blur-3xl saturate-150 transform scale-110"
                />
            </div>

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
