import { useState, useEffect } from 'react';

// Matches Tailwind's `md` breakpoint: below this is treated as "mobile" and
// heavy animations are turned off; at or above it, animations stay on.
const MOBILE_QUERY = '(max-width: 767px)';

function getIsMobile(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia(MOBILE_QUERY).matches;
}

/**
 * Reactively reports whether the viewport is at/under the mobile breakpoint.
 * Used to disable heavy motion/animation work on phones while keeping full
 * animations on tablet and desktop.
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(getIsMobile);

  useEffect(() => {
    const mql = window.matchMedia(MOBILE_QUERY);
    const handleChange = () => setIsMobile(mql.matches);

    handleChange();
    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, []);

  return isMobile;
}
