import React, { useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useIsMobile } from '../../hooks/useIsMobile';
import { usePresence } from '../../hooks/usePresence';
import { gsap, useGSAP, withMotion } from '../../lib/motionUtils';

export const TopRightNav: React.FC = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const navItems = [
      { label: "HOME", path: "/"},
      { label: "ABOUT", path: "/about"},
      { label: "PROJECTS", path: "/projects"},
      { label: "BEATMAPS", path: "/beatmaps"},
      { label: "STAFFING", path: "/staffing"},
      // { label: "HOW TO MAP", path: "/how-to-map"},
      { label: "TOOLS", path: "/tools"},
      { label: "CONTACT", path: "/contact"},
  ];

  const isItemActive = (path: string) =>
    path === '/'
      ? location.pathname === '/' || location.pathname === '/navigate'
      : location.pathname === path;
  const activePath = navItems.find((item) => isItemActive(item.path))?.path ?? null;

  // --- Active-link underline -------------------------------------------------
  // One underline element that glides to whichever link is active (the GSAP
  // replacement for framer-motion's shared `layoutId` animation).
  const navRef = useRef<HTMLElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const indicatorShownRef = useRef(false);
  const activePathRef = useRef(activePath);
  activePathRef.current = activePath;
  const isMobileRef = useRef(isMobile);
  isMobileRef.current = isMobile;

  const placeIndicator = (animate: boolean) => {
    const nav = navRef.current;
    const indicator = indicatorRef.current;
    if (!nav || !indicator) return;

    const path = activePathRef.current;
    const link = path ? linkRefs.current[path] : null;

    // No active link, or the desktop nav is hidden (display: none → width 0).
    if (!link || nav.offsetWidth === 0) {
      gsap.set(indicator, { autoAlpha: 0 });
      indicatorShownRef.current = false;
      return;
    }

    // Same geometry as the old `absolute bottom-0 left-2 right-2 h-[1.5px]`.
    const target = {
      x: link.offsetLeft + 8,
      y: link.offsetTop + link.offsetHeight - 1.5,
      width: link.offsetWidth - 16,
    };

    if (!animate || !indicatorShownRef.current) {
      gsap.set(indicator, { ...target, autoAlpha: 1 });
    } else {
      gsap.to(indicator, {
        ...target,
        overwrite: 'auto',
        ...withMotion(isMobileRef.current, { duration: 0.45, ease: 'back.out(1.2)' }),
      });
    }
    indicatorShownRef.current = true;
  };

  // Glide to the new link whenever the route changes.
  useGSAP(
    () => {
      placeIndicator(true);
    },
    { dependencies: [activePath] },
  );

  // Re-measure (without animating) when the nav's size changes: window
  // resize, breakpoint switch, web fonts finishing loading.
  useGSAP(() => {
    const nav = navRef.current;
    if (!nav) return;
    const observer = new ResizeObserver(() => placeIndicator(false));
    observer.observe(nav);
    return () => {
      observer.disconnect();
      // Forget the on-screen state so a remount (React StrictMode, or GSAP
      // reverting the inline styles) snaps into place instead of sliding in.
      indicatorShownRef.current = false;
    };
  });

  // --- Mobile drawer ---------------------------------------------------------
  const drawer = usePresence<HTMLDivElement>(mobileMenuOpen, {
    from: { opacity: 0, y: -20 },
    to: withMotion(isMobile, { opacity: 1, y: 0, duration: 0.3 }),
    exit: withMotion(isMobile, { opacity: 0, y: -20, duration: 0.3 }),
  });

  return (
    <header
      id="top-right-nav"
      aria-label="Main Navigation"
      className="fixed top-4 right-5 md:top-5 md:right-8 z-50 flex items-center gap-3 md:gap-5"
    >
      {/* Desktop Navigation Links */}
      <nav
        ref={navRef}
        className="relative hidden lg:flex items-center gap-4 bg-black/50 border border-white/10 px-4 py-1.5 rounded-full backdrop-blur-md">
        {navItems.map((item) => {
          const isActive = isItemActive(item.path);

          return (
            <NavLink
              key={item.path}
              to={item.path}
              ref={(el) => {
                linkRefs.current[item.path] = el;
              }}

              className={`relative py-1 px-2 text-[11px] font-mono uppercase tracking-[0.2em] transition-colors duration-300 ${
                isActive ? 'text-white font-medium' : 'text-white/50 hover:text-white'
              }`}
            >
              {item.label}
            </NavLink>
          );
        })}

        {/* Sliding active-link underline (positioned by GSAP) */}
        <div
          ref={indicatorRef}
          aria-hidden="true"
          className="absolute top-0 left-0 h-[1.5px] bg-white rounded-full pointer-events-none"
          style={{ opacity: 0, visibility: 'hidden' }}
        />
      </nav>

      {/* Mobile Menu Trigger */}
      <button
        id="mobile-nav-toggle"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle navigation menu"
        className="lg:hidden p-2 rounded-full border border-white/10 bg-black/50 backdrop-blur-md text-white/70 hover:text-white transition-colors"
      >
        {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
      </button>

      {/* Mobile Drawer Overlay */}
      {drawer.present && (
          <div
            ref={drawer.ref}
            className="fixed inset-x-4 top-20 z-50 p-6 rounded-lg bg-[#0A0A0A]/95 border border-white/15 backdrop-blur-xl shadow-2xl lg:hidden flex flex-col gap-4"
          >
            <div className="text-[12px] font-mono tracking-widest text-white/40 uppercase mb-2">
              INDEX // ANTIPOLE
            </div>
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between text-sm font-mono tracking-widest uppercase py-2 border-b border-white/5 ${
                    isActive ? 'text-white font-bold' : 'text-white/60'
                  }`
                }
              >
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
      )}
    </header>
  );
};
