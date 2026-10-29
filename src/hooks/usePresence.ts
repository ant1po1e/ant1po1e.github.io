import { useLayoutEffect, useRef, useState, type RefObject } from "react";
import { gsap } from "../lib/motionUtils";

export interface PresenceOptions {
    /** Starting state when the element appears. */
    from: gsap.TweenVars;
    /** Resting state while open (include duration/ease). */
    to: gsap.TweenVars;
    /** State to animate to before the element is removed (include duration/ease). */
    exit: gsap.TweenVars;
}

/**
 * GSAP equivalent of `<AnimatePresence>` around a conditionally rendered
 * element. Render the element only while `present` is true and attach `ref`
 * to it:
 *
 *   const { present, ref } = usePresence<HTMLDivElement>(open, opts);
 *   return present && <div ref={ref}>…</div>;
 *
 * When `open` becomes true the element mounts and tweens `from → to`. When it
 * becomes false the element stays mounted, tweens to `exit`, and only then is
 * `present` flipped to false so React unmounts it.
 */
export function usePresence<T extends HTMLElement = HTMLDivElement>(
    open: boolean,
    opts: PresenceOptions,
): { present: boolean; ref: RefObject<T | null> } {
    const ref = useRef<T | null>(null);
    const [present, setPresent] = useState(open);
    const optsRef = useRef(opts);
    optsRef.current = opts;
    // True while the element is on screen (entering, resting or exiting).
    const liveRef = useRef(false);

    // Opening: make sure the element is rendered this very pass.
    if (open && !present) setPresent(true);

    useLayoutEffect(() => {
        const el = ref.current;
        let tween: gsap.core.Tween | undefined;

        if (open) {
            if (!el) return;
            const { from, to } = optsRef.current;
            tween = liveRef.current
                ? // Re-opened mid-exit: head back to the resting state.
                  gsap.to(el, { ...to, overwrite: "auto" })
                : gsap.fromTo(el, from, { ...to, overwrite: "auto" });
            liveRef.current = true;
        } else if (liveRef.current && el) {
            tween = gsap.to(el, {
                ...optsRef.current.exit,
                overwrite: "auto",
                onComplete: () => {
                    liveRef.current = false;
                    setPresent(false);
                },
            });
        }

        return () => {
            tween?.kill();
        };
    }, [open]);

    return { present: present || open, ref };
}
