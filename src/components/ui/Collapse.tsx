import React from "react";
import { usePresence } from "../../hooks/usePresence";
import { useIsMobile } from "../../hooks/useIsMobile";
import { EASE, withMotion } from "../../lib/motionUtils";

interface CollapseProps extends React.HTMLAttributes<HTMLDivElement> {
    open: boolean;
    duration?: number;
}

/**
 * Accordion panel: grows from 0 → auto height (fading in) when `open` turns
 * true, and shrinks back to 0 *before* unmounting when it turns false. GSAP
 * replacement for `<AnimatePresence>` + `motion.div` animating `height`.
 */
export const Collapse: React.FC<CollapseProps> = ({
    open,
    duration = 0.3,
    children,
    ...rest
}) => {
    const isMobile = useIsMobile();
    const { present, ref } = usePresence<HTMLDivElement>(open, {
        from: { height: 0, opacity: 0 },
        to: withMotion(isMobile, { height: "auto", opacity: 1, duration, ease: EASE.out }),
        exit: withMotion(isMobile, { height: 0, opacity: 0, duration, ease: EASE.out }),
    });

    if (!present) return null;

    return (
        <div ref={ref} {...rest}>
            {children}
        </div>
    );
};
