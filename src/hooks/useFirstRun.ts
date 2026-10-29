import { useEffect, useRef } from "react";

/**
 * Returns a function that reports `true` the first time it's called after the
 * component (re)mounts, and `false` afterwards. Use it inside a GSAP effect to
 * "snap to the starting state on mount, tween on later updates".
 *
 * The flag resets on unmount on purpose: React StrictMode (and GSAP's context
 * revert) tear effects down and set them up again, and a plain ref would
 * wrongly remember that the first run already happened.
 */
export function useFirstRun(): () => boolean {
    const first = useRef(true);

    useEffect(
        () => () => {
            first.current = true;
        },
        [],
    );

    return () => {
        const wasFirst = first.current;
        first.current = false;
        return wasFirst;
    };
}
