import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence, PanInfo } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { PageItem } from '../../types';
import { PageNavCard } from './PageNavCard';
import { PageNavDots } from './PageNavDots';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
  const initialIndex = initialSlug
    ? Math.max(0, pages.findIndex(p => p.slug === initialSlug))
    : 0;

  const [currentIndex, setCurrentIndex] = useState<number>(initialIndex >= 0 ? initialIndex : 0);
  const wheelTimeoutRef = useRef<number | null>(null);
  const accumulatedDeltaRef = useRef<number>(0);

  const currentPage = pages[currentIndex] || pages[0];

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

  // Drag Gesture Handlers
  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const swipeThreshold = 35;
    const velocityThreshold = 180;

    if (info.offset.x < -swipeThreshold || info.velocity.x < -velocityThreshold) {
      handleNext();
    } else if (info.offset.x > swipeThreshold || info.velocity.x > velocityThreshold) {
      handlePrev();
    }
  };

  const handleOpenPage = (path: string) => {
    navigate(path);
  };

  return (
      <main
          id="page-navigation-carousel"
          onWheel={handleWheel}
          className="relative w-full h-screen flex flex-col justify-between items-center overflow-hidden select-none pt-16 sm:pt-20 pb-4 px-4 touch-pan-y">
          {/* Top Header Index & Section Heading */}
          <div className="shrink-0 z-20 flex flex-col items-center text-center pointer-events-none mt-1 sm:mt-2">
              <div className="flex items-center gap-2 sm:gap-2.5 text-[12px] sm:text-[11px] font-mono tracking-[0.25em] uppercase text-white/60 mb-1">
                  <span className="w-1 h-1 rounded-full bg-white/30" />
                  <span className="text-white/40">
                      PAGE 0{currentIndex + 1}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-white/30" />
              </div>

              <AnimatePresence mode="wait">
                  <motion.h1
                      key={currentPage.id}
                      initial={{ opacity: 0, y: 6, letterSpacing: "0.2em" }}
                      animate={{ opacity: 1, y: 0, letterSpacing: "0.3em" }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-display font-light uppercase pl-2 text-center text-[#F5F5F5] drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
                      {currentPage.title}
                  </motion.h1>
              </AnimatePresence>
          </div>

          {/* Main 3D Card Stage Area */}
          <div className="flex-1 min-h-0 w-full max-w-6xl flex items-center justify-center relative my-auto">
              <motion.div
                  id="carousel-touch-stage"
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={handleDragEnd}
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
              </motion.div>

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

