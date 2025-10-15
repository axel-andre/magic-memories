import React from 'react';
import { Polaroid, PolaroidProps } from './Polaroid';
import { usePolaroidIntersection } from '~/hooks/useIntersectionObserver';

interface PolaroidWithIntersectionProps extends PolaroidProps {
    /**
     * The threshold at which the polaroid becomes visible (0-1)
     * @default 0.3
     */
    visibilityThreshold?: number;
    /**
     * Whether to trigger the visibility handler only once
     * @default true
     */
    triggerOnce?: boolean;
    /**
     * Handler function called when the polaroid becomes visible
     */
    onVisible?: () => void;

}

/**
 * A Polaroid component that uses intersection observer to trigger a handler
 * when it becomes visible in the viewport
 */
export const PolaroidWithIntersection = React.forwardRef<
    HTMLDivElement,
    PolaroidWithIntersectionProps
>(
    (
        {
            visibilityThreshold = 0.3,
            triggerOnce = true,
            onVisible,
            className,
            ...polaroidProps
        },
        ref
    ) => {
        const { ref: intersectionRef, isVisible } = usePolaroidIntersection(
            visibilityThreshold,
            triggerOnce
        );

        // Call the handler when the element becomes visible
        React.useEffect(() => {
            if (isVisible && onVisible) {
                onVisible();
            }
        }, [isVisible, onVisible]);

        // Combine the refs
        const combinedRef = React.useCallback(
            (node: HTMLDivElement) => {
                if (ref) {
                    if (typeof ref === 'function') {
                        ref(node);
                    } else {
                        ref.current = node;
                    }
                }
                if (intersectionRef) {
                    if (typeof intersectionRef === 'function') {
                        (intersectionRef as (instance: HTMLDivElement | null) => void)(node);
                    } else if ('current' in intersectionRef) {
                        (intersectionRef as React.RefObject<HTMLDivElement>).current = node;
                    }
                }
            },
            [ref, intersectionRef]
        );

        return (
            <Polaroid
                ref={combinedRef}
                className={className}
                {...polaroidProps}
            />
        );
    }
);

PolaroidWithIntersection.displayName = 'PolaroidWithIntersection';
