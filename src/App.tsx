import React, { useRef, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { TopLeftSocials } from './components/layout/TopLeftSocials';
import { TopRightNav } from './components/layout/TopRightNav';
import { LoadingScreen } from './components/ui/LoadingScreen';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { BeatmapsPage } from './pages/BeatmapsPage';
import { StaffingPage } from './pages/StaffingPage';
import { HowToMapPage } from './pages/HowToMapPage';
import { ToolsPage } from './pages/ToolsPage';
import { ContactPage } from './pages/ContactPage';
import { VaultPage } from './pages/VaultPage';
import { useIsMobile } from './hooks/useIsMobile';
import { useSwap } from './hooks/useSwap';
import { EASE, withMotion } from './lib/motionUtils';

const AnimatedRoutes: React.FC<{ isMobile: boolean }> = ({ isMobile }) => {
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);

  // Fade the current page out, swap routes, fade the new page in (the GSAP
  // version of <AnimatePresence mode="wait"> keyed on the pathname). The old
  // page stays rendered through its exit because Routes receives the
  // *displayed* location, not the live one.
  const shownLocation = useSwap(location, location.pathname, containerRef, {
    exit: withMotion(isMobile, { opacity: 0, duration: 0.35, ease: EASE.soft }),
    enterFrom: { opacity: 0 },
    enterTo: withMotion(isMobile, { opacity: 1, duration: 0.35, ease: EASE.soft }),
  });

  return (
    <div ref={containerRef} className="w-full min-h-dvh">
      <Routes location={shownLocation}>
        <Route path="/" element={<HomePage />} />
        <Route path="/navigate" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/beatmaps" element={<BeatmapsPage />} />
        <Route path="/staffing" element={<StaffingPage />} />
        {/* <Route path="/how-to-map" element={<HowToMapPage />} /> */}
        <Route path="/tools" element={<ToolsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/str" element={<VaultPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();

  return (
    <BrowserRouter>
          <div className="relative min-h-dvh w-full text-[#F5F5F5] selection:bg-white selection:text-black">
              {/* Fixed dim overlay over the background image — stays constant through
            loading and page transitions so the image never flashes at full brightness */}
              <div className="fixed inset-0 z-0 bg-[#050505]/75 pointer-events-none" />

              {/* Cinematic Intro Loader */}
              {isLoading ? (
                  <LoadingScreen onComplete={() => setIsLoading(false)} />
              ) : (
                  <>
                      {/* Top-Left Brand Logo + Social Channels (GitHub @ant1po1e, etc.) */}
                      <TopLeftSocials />

                      {/* Top-Right Page Navigation */}
                      <TopRightNav />

                      {/* Main View Router with Fluid Transitions */}
                      <AnimatedRoutes isMobile={isMobile} />
                  </>
              )}
              <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-white/30" />
              <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-white/30" />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-white/30" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-white/30" />
          </div>
    </BrowserRouter>
  );
}
