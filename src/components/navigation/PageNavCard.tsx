import React, { useState } from "react";
import { motion } from "motion/react";
import { PageItem } from "../../types";
import { Sparkles } from "lucide-react";

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

    const handleCardClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isActive) {
            onOpenPage(page.path);
        } else {
            onSelect(index);
        }
    };

    return (
        <motion.div
            id={`page-nav-card-${page.slug}`}
            initial={false}
            animate={{
                x: style.x,
                scale: style.scale,
                opacity: style.opacity,
                zIndex: style.zIndex,
                filter: style.filter,
                rotateY: style.rotateY,
            }}
            transition={{
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
            }}
            onClick={handleCardClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="absolute cursor-pointer select-none perspective-1000 origin-center flex flex-col items-center justify-center">
            {/* Artwork Container */}
            <div className="relative group">
                <motion.div
                    animate={{
                        boxShadow: isActive
                            ? `0 20px 50px -10px ${page.accentColor}50, 0 10px 25px rgba(0,0,0,0.9)`
                            : "0 8px 18px rgba(0,0,0,0.7)",
                        borderColor: isActive
                            ? isHovered
                                ? "rgba(255,255,255,0.85)"
                                : "rgba(255,255,255,0.3)"
                            : "rgba(255,255,255,0.1)",
                    }}
                    transition={{ duration: 0.35 }}
                    className="relative w-52.5 h-52.5 sm:w-62.5 sm:h-62.5 md:w-72.5 md:h-72.5 lg:w-[320px] lg:h-80 max-h-[38vh] aspect-square border overflow-hidden rounded-xs bg-[#0a0a0a]">
                    {!imageError ? (
                        <img
                            src={page.cover}
                            alt={`visual artwork`}
                            referrerPolicy="no-referrer"
                            onError={() => setImageError(true)}
                            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
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
                </motion.div>
                <a
                    href={page.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-white/80 text-center font-light line-clamp-2 mt-4 hover:text-white transition-all duration-300">
                    Artwork Credit
                </a>
            </div>
        </motion.div>
    );
};
