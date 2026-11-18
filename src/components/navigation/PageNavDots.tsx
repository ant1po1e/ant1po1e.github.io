import React, { useRef } from 'react';
import { PageItem } from '../../types';
import { useIsMobile } from '../../hooks/useIsMobile';
import { useFirstRun } from '../../hooks/useFirstRun';
import { EASE, gsap, useGSAP, withMotion } from '../../lib/motionUtils';

interface PageNavDotProps {
  isActive: boolean;
  isMobile: boolean;
}

// One pagination dot: the active dot stretches into a pill and turns solid
// ink, inactive dots shrink back to a faint 5px circle.
const NavDotShape: React.FC<PageNavDotProps> = ({ isActive, isMobile }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isFirstRun = useFirstRun();

  useGSAP(
    () => {
      const target = {
        width: isActive ? 22 : 5,
        backgroundColor: isActive ? '#4A3540' : 'rgba(74, 53, 64, 0.25)',
      };
      if (isFirstRun()) {
        gsap.set(ref.current, target);
        return;
      }
      gsap.to(ref.current, {
        ...target,
        overwrite: 'auto',
        ...withMotion(isMobile, { duration: 0.3, ease: EASE.soft }),
      });
    },
    { dependencies: [isActive] },
  );

  // No CSS `transition` class here on purpose: GSAP writes the width and
  // background every frame, and a CSS transition on the same properties
  // would lag behind it.
  return <div ref={ref} className="h-1.5 rounded-full group-hover:bg-ink/70" />;
};

interface PageNavDotsProps {
  pages: PageItem[];
  currentIndex: number;
  onSelect: (index: number) => void;
}

export const PageNavDots: React.FC<PageNavDotsProps> = ({
  pages,
  currentIndex,
  onSelect,
}) => {
  const isMobile = useIsMobile();
  return (
    <div
      id="page-nav-dots-container"
      aria-label="Carousel pagination"
      className="flex flex-col items-center gap-1.5"
    >
      <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-ink/10 bg-wash/60 backdrop-blur-md">
        {pages.map((page, index) => {
          const isActive = index === currentIndex;
          return (
            <button
              key={page.id}
              id={`nav-dot-${page.slug}`}
              onClick={() => onSelect(index)}

              aria-label={`Jump to page ${page.title}`}
              className="relative p-1 group flex items-center justify-center focus:outline-none"
            >
              {/* Dot Shape */}
              <NavDotShape isActive={isActive} isMobile={isMobile} />
              <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-[9px] font-mono tracking-widest uppercase bg-paper border border-ink/20 text-ink opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 whitespace-nowrap z-50">
                0{index + 1} • {page.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* Subtle Bottom Controls Hint */}
      <span className="text-[9px] font-mono tracking-[0.25em] text-ink/45 uppercase hidden md:inline-block">
        [ ARROWS / SWIPE / SCROLL TO BROWSE ]
      </span>
    </div>
  );
};

