import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';
export const TopRightNav: React.FC = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  return (
    <header
      id="top-right-nav"
      aria-label="Main Navigation"
      className="fixed top-4 right-5 md:top-5 md:right-8 z-50 flex items-center gap-3 md:gap-5"
    >
      {/* Desktop Navigation Links */}
      <nav className="hidden lg:flex items-center gap-4 bg-black/50 border border-white/10 px-4 py-1.5 rounded-full backdrop-blur-md">
        {navItems.map((item) => {
          const isActive =
            item.path === '/'
              ? location.pathname === '/' || location.pathname === '/navigate'
              : location.pathname === item.path;

          return (
            <NavLink
              key={item.path}
              to={item.path}

              className={`relative py-1 px-2 text-[11px] font-mono uppercase tracking-[0.2em] transition-colors duration-300 ${
                isActive ? 'text-white font-medium' : 'text-white/50 hover:text-white'
              }`}
            >
              {item.label}
              {isActive && (
                <motion.div
                  layoutId="activeNavIndicator"
                  className="absolute bottom-0 left-2 right-2 h-[1.5px] bg-white rounded-full"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </NavLink>
          );
        })}
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
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
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
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
