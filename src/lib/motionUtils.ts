import type { Transition } from 'motion/react';

// Instant, no-op transition used to neutralize an explicit `transition` prop
// on mobile — the animated values still jump straight to their target, just
// without any easing/duration, so layout stays correct but no work is spent
// animating frames.
export const INSTANT_TRANSITION: Transition = { duration: 0 };

/**
 * Returns the given transition unchanged on tablet/desktop, or an instant
 * (duration: 0) transition on mobile. Use this to wrap any explicit
 * `transition={{...}}` prop on a `motion.*` component:
 *
 *   transition={withMotion(isMobile, { duration: 0.6, ease: [0.22,1,0.36,1] })}
 */
export function withMotion(isMobile: boolean, transition: Transition): Transition {
  return isMobile ? INSTANT_TRANSITION : transition;
}
