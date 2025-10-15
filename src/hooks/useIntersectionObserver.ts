import { useEffect, useRef, useState, RefObject } from "react";

interface UseIntersectionObserverOptions {
  /**
   * The threshold at which the callback is invoked
   * Can be a number (0-1) or an array of numbers
   * @default 0.1
   */
  threshold?: number | number[];
  /**
   * The root element for intersection observation
   * @default null (viewport)
   */
  root?: Element | null;
  /**
   * Margin around the root element
   * @default "0px"
   */
  rootMargin?: string;
  /**
   * Whether to trigger the callback only once
   * @default false
   */
  triggerOnce?: boolean;
}

interface UseIntersectionObserverReturn {
  /**
   * Ref to attach to the element you want to observe
   */
  ref: RefObject<HTMLElement>;
  /**
   * Whether the element is currently intersecting
   */
  isIntersecting: boolean;
  /**
   * The intersection ratio (0-1)
   */
  intersectionRatio: number;
  /**
   * The intersection observer entry
   */
  entry: IntersectionObserverEntry | null;
}

/**
 * Custom hook that uses Intersection Observer API to detect when an element
 * is above a specific threshold of the viewport
 *
 * @param options - Configuration options for the intersection observer
 * @returns Object containing ref, isIntersecting state, intersectionRatio, and entry
 *
 * @example
 * ```tsx
 * const { ref, isIntersecting } = useIntersectionObserver({
 *   threshold: 0.5,
 *   triggerOnce: true
 * });
 *
 * return (
 *   <div ref={ref}>
 *     {isIntersecting ? 'Element is visible!' : 'Element is hidden'}
 *   </div>
 * );
 * ```
 */
export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {}
): UseIntersectionObserverReturn {
  const {
    threshold = 0.1,
    root = null,
    rootMargin = "0px",
    triggerOnce = false,
  } = options;

  const ref = useRef<HTMLElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [intersectionRatio, setIntersectionRatio] = useState(0);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isCurrentlyIntersecting = entry.isIntersecting;
        const ratio = entry.intersectionRatio;

        setEntry(entry);
        setIntersectionRatio(ratio);

        if (triggerOnce && hasTriggered) {
          return;
        }

        if (isCurrentlyIntersecting && triggerOnce) {
          setHasTriggered(true);
        }

        setIsIntersecting(isCurrentlyIntersecting);
      },
      {
        threshold,
        root,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, root, rootMargin, triggerOnce, hasTriggered]);

  return {
    ref,
    isIntersecting,
    intersectionRatio,
    entry,
  };
}

/**
 * Specialized hook for polaroid components that triggers when the element
 * is above a specific threshold (useful for animations, reveals, etc.)
 *
 * @param threshold - The threshold at which to trigger (0-1)
 * @param triggerOnce - Whether to trigger only once
 * @returns Object containing ref and isVisible state
 */
export function usePolaroidIntersection(
  threshold: number = 0.3,
  triggerOnce: boolean = true
) {
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold,
    triggerOnce,
    rootMargin: "-10% 0px -10% 0px", // Only trigger when element is well into viewport
  });

  return {
    ref,
    isVisible: isIntersecting,
  };
}
