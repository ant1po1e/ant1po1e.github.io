import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { CustomEase } from "gsap/CustomEase";
import { Draggable } from "gsap/Draggable";

// Register once, at module load. Every component that animates imports from
// this file, so the plugins are guaranteed to be registered before first use.
gsap.registerPlugin(useGSAP, CustomEase, Draggable);

/**
 * Named easings. These are the exact cubic-béziers the site used with
 * framer-motion, registered as GSAP eases so the motion feels identical.
 *
 *   soft  → [0.22, 1, 0.36, 1]   (page/card/title transitions)
 *   expo  → [0.16, 1, 0.3, 1]    (loading-screen title)
 *   inOut → framer's "easeInOut"
 *   out   → framer's "easeOut"
 */
CustomEase.create("antipoleSoft", "0.22, 1, 0.36, 1");
CustomEase.create("antipoleExpo", "0.16, 1, 0.3, 1");
CustomEase.create("antipoleInOut", "0.42, 0, 0.58, 1");
CustomEase.create("antipoleOut", "0, 0, 0.58, 1");

export const EASE = {
    soft: "antipoleSoft",
    expo: "antipoleExpo",
    inOut: "antipoleInOut",
    out: "antipoleOut",
} as const;

/**
 * Returns the given tween vars unchanged on tablet/desktop, or with
 * `duration` and `delay` forced to 0 on mobile, so values jump straight to
 * their target without spending any work animating frames:
 *
 *   gsap.to(el, { opacity: 1, ...withMotion(isMobile, { duration: 0.6, ease: EASE.soft }) })
 *
 * (Same contract as the old framer-motion helper, now for GSAP tween vars.)
 */
export function withMotion<T extends gsap.TweenVars>(
    isMobile: boolean,
    vars: T,
): T {
    return isMobile ? { ...vars, duration: 0, delay: 0, stagger: 0 } : vars;
}

/* ---------------------------------------------------------------------------
 * Color helpers
 *
 * GSAP can't reliably interpolate multi-stop gradient strings, so the nav
 * background tweens a plain 0→1 progress value and rebuilds the gradient from
 * interpolated RGB each frame. These are the small helpers it needs.
 * ------------------------------------------------------------------------- */

export type RGB = [number, number, number];

/** Parses "#RRGGBB" (the only format used in the site's page data). */
export function hexToRgb(hex: string): RGB {
    const clean = hex.replace("#", "");
    return [
        parseInt(clean.slice(0, 2), 16),
        parseInt(clean.slice(2, 4), 16),
        parseInt(clean.slice(4, 6), 16),
    ];
}

export function mixRgb(a: RGB, b: RGB, t: number): RGB {
    return [
        Math.round(a[0] + (b[0] - a[0]) * t),
        Math.round(a[1] + (b[1] - a[1]) * t),
        Math.round(a[2] + (b[2] - a[2]) * t),
    ];
}

export function rgba([r, g, b]: RGB, alpha: number): string {
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export { gsap, useGSAP, Draggable };
