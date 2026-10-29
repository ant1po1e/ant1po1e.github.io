import { useLayoutEffect, useRef, useState, type RefObject } from "react";
import { gsap } from "../lib/motionUtils";

export interface SwapOptions {
    /** Vars to tween to when the old content leaves (include duration/ease). */
    exit: gsap.TweenVars;
    /** Starting state for the new content. */
    enterFrom: gsap.TweenVars;
    /** Final state for the new content (include duration/ease). */
    enterTo: gsap.TweenVars;
}

/**
 * GSAP equivalent of `<AnimatePresence mode="wait">` around a single keyed
 * element: when `key` changes, the element animates out FIRST, only then is
 * the displayed value swapped, and the new content animates in.
 *
 * The element itself is never remounted — GSAP animates the same node and
 * React just re-renders its contents with the returned value once the exit
 * finishes. Because of that, render the *returned* value inside the element
 * (not the live prop), so the leaving content stays frozen during its exit.
 *
 * `opts` is read fresh at the moment each animation starts, so it can depend
 * on live state (e.g. slide direction) without re-creating anything.
 */
export function useSwap<T>(
    value: T,
    key: string | number,
    ref: RefObject<HTMLElement | null>,
    opts: SwapOptions,
): T {
    const [shown, setShown] = useState({ key, value });
    const optsRef = useRef(opts);
    optsRef.current = opts;
    const mountedRef = useRef(false);

    // Key changed → animate the current content out, then swap it.
    useLayoutEffect(() => {
        if (!mountedRef.current) return;
        const el = ref.current;
        if (!el) return;

        if (key === shown.key) {
            // Switched back to what's already displayed while an exit was in
            // flight: bring it back instead of leaving it half-faded.
            const tween = gsap.to(el, { ...optsRef.current.enterTo, overwrite: "auto" });
            return () => {
                tween.kill();
            };
        }

        const tween = gsap.to(el, {
            ...optsRef.current.exit,
            overwrite: "auto",
            onComplete: () => setShown({ key, value }),
        });
        return () => {
            tween.kill();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key]);

    // Displayed content changed (and on first mount) → animate it in.
    useLayoutEffect(() => {
        const el = ref.current;
        if (!el) return;
        const { enterFrom, enterTo } = optsRef.current;
        const tween = gsap.fromTo(el, enterFrom, { ...enterTo, overwrite: "auto" });
        mountedRef.current = true;
        return () => {
            tween.kill();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shown.key]);

    // While the key hasn't changed, always show the latest value (so e.g. a
    // router location that only changed its search params isn't frozen).
    return shown.key === key ? value : shown.value;
}
