import React, { useRef, useState } from "react";
import { PageItem } from "../../types";
import { Sparkles } from "lucide-react";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useFirstRun } from "../../hooks/useFirstRun";
import {
    EASE,
    gsap,
    hexToRgb,
    rgba,
    useGSAP,
    withMotion,
} from "../../lib/motionUtils";

interface PageNavCardProps {
    page: PageItem;
    index: number;
    currentIndex: number;
    totalCount: number;
    onSelect: (index: number) => void;
    onOpenPage: (path: string) => void;
}

export const PageNavCard: React.FC<PageNavCardProps> = ({
    page,
    index,
    currentIndex,
    onSelect,
    onOpenPage,
}) => {
    const [imageError, setImageError] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const isMobile = useIsMobile();
    const cardRef = useRef<HTMLDivElement>(null);
    const artworkRef = useRef<HTMLDivElement>(null);

    const diff = index - currentIndex;
    const isActive = diff === 0;

    const getCardStyle = () => {
        if (isActive) {
            return {
                x: 0,
                scale: 1,
                opacity: 1,
                zIndex: 30,
                filter: "brightness(1) blur(0px)",
                rotateY: 0,
            };
        }

        const spacing =
            typeof window !== "undefined" && window.innerWidth < 768
                ? 220
                : 360;
        const xPos = diff * spacing;
        const clampedDiff = Math.abs(diff);

        return {
            x: xPos,
            scale: Math.max(0.7, 1 - clampedDiff * 0.15),
            opacity: Math.max(0.2, 0.45 - clampedDiff * 0.1),
            zIndex: 20 - clampedDiff,
            filter: `brightness(0.6) blur(${Math.min(3, clampedDiff * 1.2)}px)`,
            rotateY: diff > 0 ? -12 : 12,
        };
    };

    const style = getCardStyle();

    // Slide / scale / fade / blur / tilt the card to its slot in the stack.
    // The first run snaps into place (the old `initial={false}`); later runs
    // tween. zIndex isn't tweened: it must be an integer, so it's applied
    // immediately, which also puts the incoming card on top from the start.
    const isFirstPlacement = useFirstRun();
    useGSAP(
        () => {
            const el = cardRef.current;
            if (!el) return;
            const target = {
                x: style.x,
                scale: style.scale,
                opacity: style.opacity,
                filter: style.filter,
                rotationY: style.rotateY,
            };
            gsap.set(el, { zIndex: style.zIndex });

            if (isFirstPlacement()) {
                gsap.set(el, target);
                return;
            }
            gsap.to(el, {
                ...target,
                overwrite: "auto",
                ...withMotion(isMobile, { duration: 0.6, ease: EASE.soft }),
            });
        },
        { dependencies: [currentIndex] },
    );

    // Artwork frame: glow + border react to active / hover state. Both
    // shadows are always present (the inactive one is just fully transparent
    // on the second layer) so GSAP can interpolate them smoothly.
    const isFirstArtworkStyle = useFirstRun();
    useGSAP(
        () => {
            const el = artworkRef.current;
            if (!el) return;
            const accent = hexToRgb(page.accentColor);
            const target = {
                boxShadow: isActive
                    ? `0 20px 50px -10px ${rgba(accent, 0.3137)}, 0 10px 25px rgba(0, 0, 0, 0.9)`
                    : `0 8px 18px rgba(0, 0, 0, 0.7), 0 0px 0px rgba(0, 0, 0, 0)`,
                borderColor: isActive
                    ? isHovered
                        ? "rgba(255, 255, 255, 0.85)"
                        : "rgba(255, 255, 255, 0.3)"
                    : "rgba(255, 255, 255, 0.1)",
            };

            if (isFirstArtworkStyle()) {
                gsap.set(el, target);
                return;
            }
            gsap.to(el, {
                ...target,
                overwrite: "auto",
                ...withMotion(isMobile, { duration: 0.35 }),
            });
        },
        { dependencies: [isActive, isHovered, page.accentColor] },
    );

    const handleCardClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isActive) {
            onOpenPage(page.path);
        } else {
            onSelect(index);
        }
    };

    return (
        <div
            ref={cardRef}
            id={`page-nav-card-${page.slug}`}
            onClick={handleCardClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="absolute cursor-pointer select-none perspective-1000 origin-center flex flex-col items-center justify-center">
            {/* Artwork Container */}
            <div className="relative group">
                <div
                    ref={artworkRef}
                    className="relative w-52.5 h-52.5 sm:w-62.5 sm:h-62.5 md:w-72.5 md:h-72.5 lg:w-[320px] lg:h-80 max-h-[38vh] aspect-square border overflow-hidden rounded-xs bg-[#0a0a0a]">
                    {!imageError ? (
                        <img
                            src={page.cover}
                            alt={`visual artwork`}
                            referrerPolicy="no-referrer"
                            onError={() => setImageError(true)}
                            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-120"
                        />
                    ) : (
                        <div
                            className="w-full h-full flex flex-col items-center justify-center p-6 text-center"
                            style={{
                                background: `linear-gradient(135deg, ${page.secondaryAccent || "#111111"} 0%, #050505 100%)`,
                            }}>
                            <div
                                className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center mb-3"
                                style={{ borderColor: page.accentColor }}>
                                <Sparkles className="w-6 h-6 text-white/60" />
                            </div>
                        </div>
                    )}

                    {/* Subtle Corner Accents */}
                    <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-white/40 pointer-events-none" />
                    <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-white/40 pointer-events-none" />
                    <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-white/40 pointer-events-none" />
                    <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-white/40 pointer-events-none" />
                </div>
                <a
                    href={page.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-white/80 text-center font-light line-clamp-2 mt-4 hover:text-white transition-all duration-300">
                    Artwork Credit
                </a>
            </div>
        </div>
    );
};
