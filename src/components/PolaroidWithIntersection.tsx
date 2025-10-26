import React from 'react';
import { Polaroid, PolaroidProps } from './Polaroid';
import { usePolaroidIntersection } from '~/hooks/useIntersectionObserver';

interface PolaroidWithIntersectionProps extends PolaroidProps {
  visibilityThreshold?: number;
  triggerOnce?: boolean;
  onVisible?: () => void;
}

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
          <Polaroid.Root
            ref={combinedRef}
            className={className}
            {...polaroidProps}
          />
        );
    }
);

PolaroidWithIntersection.displayName = 'PolaroidWithIntersection';
