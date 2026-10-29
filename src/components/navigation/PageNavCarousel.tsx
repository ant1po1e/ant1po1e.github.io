import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageItem } from '../../types';
import { PageNavCard } from './PageNavCard';
import { PageNavDots } from './PageNavDots';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useIsMobile } from '../../hooks/useIsMobile';
import { useSwap } from '../../hooks/useSwap';
import { Draggable, EASE, gsap, useGSAP, withMotion } from '../../lib/motionUtils';

interface PageNavCarouselProps {
  pages: PageItem[];
  initialSlug?: string;
  onIndexChange?: (index: number) => void;
}

export const PageNavCarousel: React.FC<PageNavCarouselProps> = ({
  pages,
  initialSlug,
  onIndexChange,
}) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const initialIndex = initialSlug
    ? Math.max(0, pages.findIndex(p => p.slug === initialSlug))
    : 0;

  const [currentIndex, setCurrentIndex] = useState<number>(initialIndex >= 0 ? initialIndex : 0);
  const wheelTimeoutRef = useRef<number | null>(null);
  const accumulatedDeltaRef = useRef<number>(0);
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  // True while a pointer gesture has actually dragged the stage, so the click
  // that follows the release can be swallowed instead of selecting a card.
  const didDragRef = useRef(false);

  const currentPage = pages[currentIndex] || pages[0];

  // Page title: old title leaves, then the new one settles in (the GSAP
  // version of <AnimatePresence mode="wait"> keyed on the page id).
  const shownPage = useSwap(currentPage, currentPage.id, titleRef, {
    exit: withMotion(isMobile, { opacity: 0, y: -6, duration: 0.4, ease: EASE.soft }),
    enterFrom: { opacity: 0, y: 6, letterSpacing: '0.2em' },
    enterTo: withMotion(isMobile, {
      opacity: 1,
      y: 0,
      letterSpacing: '0.3em',
      duration: 0.4,
      ease: EASE.soft,
    }),
  });

  const goToIndex = useCallback(
    (index: number) => {
      const targetIndex = Math.max(0, Math.min(pages.length - 1, index));
      if (targetIndex !== currentIndex) {
        setCurrentIndex(targetIndex);
        if (onIndexChange) {
          onIndexChange(targetIndex);
        }
      }
    },
    [currentIndex, pages.length, onIndexChange]
  );

  const handleNext = useCallback(() => {
    if (currentIndex < pages.length - 1) {
      goToIndex(currentIndex + 1);
    }
  }, [currentIndex, pages.length, goToIndex]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      goToIndex(currentIndex - 1);
    }
  }, [currentIndex, goToIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'Home') {
        e.preventDefault();
        goToIndex(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        goToIndex(pages.length - 1);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (currentPage) {
          navigate(currentPage.path);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, goToIndex, pages, currentIndex, currentPage, navigate]);

  // Wheel listener for smooth scroll transition
  const handleWheel = (e: React.WheelEvent) => {
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    accumulatedDeltaRef.current += delta;

    if (wheelTimeoutRef.current) {
      window.clearTimeout(wheelTimeoutRef.current);
    }

    if (Math.abs(accumulatedDeltaRef.current) > 50) {
      if (accumulatedDeltaRef.current > 0) {
        handleNext();
      } else {
        handlePrev();
      }
      accumulatedDeltaRef.current = 0;
    }

    wheelTimeoutRef.current = window.setTimeout(() => {
      accumulatedDeltaRef.current = 0;
    }, 150);
  };

  // Drag (swipe) gesture — GSAP Draggable on the card stage. The stage can be
  // pulled sideways with heavy resistance, then springs back; a long enough
  // pull or a fast enough flick changes page. Handlers are read through a ref
  // so the single Draggable instance always calls the latest ones.
  const swipeHandlersRef = useRef({ next: handleNext, prev: handlePrev });
  swipeHandlersRef.current = { next: handleNext, prev: handlePrev };
  const isMobileRef = useRef(isMobile);
  isMobileRef.current = isMobile;

  useGSAP(
    () => {
      const stage = stageRef.current;
      if (!stage) return;

      const swipeThreshold = 35;
      const velocityThreshold = 180; // px per second
      const track = { pressX: 0, lastX: 0, lastT: 0, velocity: 0 };

      const [draggable] = Draggable.create(stage, {
        type: 'x',
        bounds: { minX: 0, maxX: 0 },
        edgeResistance: 0.8,
        onPress(this: Draggable) {
          track.pressX = this.pointerX;
          track.lastX = this.pointerX;
          track.lastT = performance.now();
          track.velocity = 0;
          didDragRef.current = false;
        },
        onDrag(this: Draggable) {
          const now = performance.now();
          const dt = now - track.lastT;
          if (dt > 0) track.velocity = ((this.pointerX - track.lastX) / dt) * 1000;
          track.lastX = this.pointerX;
          track.lastT = now;
          if (Math.abs(this.pointerX - track.pressX) > 4) didDragRef.current = true;
        },
        onDragEnd(this: Draggable) {
          const offset = this.pointerX - track.pressX;

          if (offset < -swipeThreshold || track.velocity < -velocityThreshold) {
            swipeHandlersRef.current.next();
          } else if (offset > swipeThreshold || track.velocity > velocityThreshold) {
            swipeHandlersRef.current.prev();
          }

          gsap.to(stage, {
            x: 0,
            overwrite: true,
            ...withMotion(isMobileRef.current, { duration: 0.5, ease: EASE.soft }),
          });
          // The click that follows a drag fires before this timeout runs.
          window.setTimeout(() => {
            didDragRef.current = false;
          }, 0);
        },
      });

      return () => draggable.kill();
    },
    { scope: rootRef },
  );

  const handleOpenPage = (path: string) => {
    navigate(path);
  };

  return (
      <main
          ref={rootRef}
          id="page-navigation-carousel"
          onWheel={handleWheel}
          className="relative w-full h-dvh flex flex-col justify-between items-center overflow-hidden select-none pt-16 sm:pt-20 pb-4 px-4 touch-pan-y">
          {/* Top Header Index & Section Heading */}
          <div className="shrink-0 z-20 flex flex-col items-center text-center pointer-events-none mt-1 sm:mt-2">
              <div className="flex items-center gap-2 sm:gap-2.5 text-[12px] sm:text-[11px] font-mono tracking-[0.25em] uppercase text-white/60 mb-1">
                  <span className="w-1 h-1 rounded-full bg-white/30" />
                  <span className="text-white/40">
                      PAGE 0{currentIndex + 1}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-white/30" />
              </div>

              <h1
                  ref={titleRef}
                  className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-display font-light uppercase pl-2 text-center text-[#F5F5F5] drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
                  {shownPage.title}
              </h1>
          </div>

          {/* Main 3D Card Stage Area */}
          <div className="flex-1 min-h-0 w-full max-w-6xl flex items-center justify-center relative my-auto">
              <div
                  ref={stageRef}
                  id="carousel-touch-stage"
                  onClickCapture={(e) => {
                      if (didDragRef.current) {
                          e.stopPropagation();
                          e.preventDefault();
                      }
                  }}
                  className="relative w-full h-full flex items-center justify-center z-10"
                  style={{ perspective: 1200 }}>
                  {pages.map((page, index) => (
                      <PageNavCard
                          key={page.id}
                          page={page}
                          index={index}
                          currentIndex={currentIndex}
                          totalCount={pages.length}
                          onSelect={goToIndex}
                          onOpenPage={handleOpenPage}
                      />
                  ))}
              </div>

              {/* Left / Right Floating Arrow Controls */}
              {currentIndex > 0 && (
                  <button
                      id="prev-page-arrow-btn"
                      onClick={handlePrev}

                      aria-label="Previous Page"
                      className="hidden md:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-40 w-10 h-10 rounded-full border border-white/20 bg-black/50 hover:bg-white/10 hover:border-white/80 backdrop-blur-md items-center justify-center text-white/70 hover:text-white transition-all duration-300 shadow-lg">
                      <ChevronLeft className="w-5 h-5" />
                  </button>
              )}

              {currentIndex < pages.length - 1 && (
                  <button
                      id="next-page-arrow-btn"
                      onClick={handleNext}

                      aria-label="Next Page"
                      className="hidden md:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-40 w-10 h-10 rounded-full border border-white/20 bg-black/50 hover:bg-white/10 hover:border-white/80 backdrop-blur-md items-center justify-center text-white/70 hover:text-white transition-all duration-300 shadow-lg">
                      <ChevronRight className="w-5 h-5" />
                  </button>
              )}
          </div>

          {/* Bottom Action, Tag Highlights, & Dots Controls */}
          <div className="shrink-0 z-30 flex flex-col items-center gap-2.5 pb-1 sm:pb-2">
              {/* Bottom Pagination Dots */}
              <PageNavDots
                  pages={pages}
                  currentIndex={currentIndex}
                  onSelect={goToIndex}
              />
          </div>
      </main>
  );
};

