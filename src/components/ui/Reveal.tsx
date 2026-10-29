import React, { useRef } from "react";
import { gsap, useGSAP, withMotion, EASE } from "../../lib/motionUtils";
import { useIsMobile } from "../../hooks/useIsMobile";

interface RevealProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Start this many px below (positive) / above (negative) the final spot. */
    y?: number;
    /** Start at this scale (e.g. 0.95) and settle to 1. */
    scale?: number;
    duration?: number;
    delay?: number;
    ease?: string;
}

/**
 * Animates its wrapper in once, when it mounts (opacity 0 → 1, plus optional
 * y / scale). Because it only runs on mount, giving it a `key` makes it
 * re-animate when the key changes, and siblings that keep their key stay put —
 * exactly how `motion.div initial/animate` behaved in lists.
 *
 * On mobile the animation is skipped (duration 0), matching the rest of the
 * site's "no heavy motion on phones" rule.
 */
export const Reveal: React.FC<RevealProps> = ({
    y,
    scale,
    duration = 0.3,
    delay = 0,
    ease = EASE.out,
    children,
    ...rest
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const isMobile = useIsMobile();

    useGSAP(
        () => {
            const from: gsap.TweenVars = { opacity: 0 };
            if (y !== undefined) from.y = y;
            if (scale !== undefined) from.scale = scale;

            gsap.from(ref.current, {
                ...from,
                ...withMotion(isMobile, { duration, delay, ease }),
            });
        },
        { scope: ref },
    );

    return (
        <div ref={ref} {...rest}>
            {children}
        </div>
    );
};
