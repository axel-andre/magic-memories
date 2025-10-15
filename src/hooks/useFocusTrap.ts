import { useEffect, useRef, useCallback } from "react";

interface UseFocusTrapProps {
  isActive: boolean;
  containerRef: React.RefObject<HTMLElement | null>;
}

export const useFocusTrap = ({ isActive, containerRef }: UseFocusTrapProps) => {
  const previousActiveElement = useRef<HTMLElement | null>(null);

  const getFocusableElements = useCallback(() => {
    if (!containerRef.current) return [];

    const focusableSelectors = [
      "button:not([disabled])",
      "input:not([disabled])",
      "select:not([disabled])",
      "textarea:not([disabled])",
      "a[href]",
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]',
    ].join(", ");

    return Array.from(
      containerRef.current.querySelectorAll(focusableSelectors)
    ) as HTMLElement[];
  }, [containerRef]);

  const focusFirstElement = useCallback(() => {
    const focusableElements = getFocusableElements();
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }
  }, [getFocusableElements]);

  const focusLastElement = useCallback(() => {
    const focusableElements = getFocusableElements();
    if (focusableElements.length > 0) {
      focusableElements[focusableElements.length - 1].focus();
    }
  }, [getFocusableElements]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!isActive || !containerRef.current) return;

      if (event.key === "Tab") {
        const focusableElements = getFocusableElements();

        if (focusableElements.length === 0) {
          event.preventDefault();
          return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    },
    [isActive, containerRef, getFocusableElements]
  );

  useEffect(() => {
    if (isActive) {
      // Store the currently focused element
      previousActiveElement.current = document.activeElement as HTMLElement;

      // Focus the first focusable element in the dialog
      setTimeout(() => {
        focusFirstElement();
      }, 0);

      // Add event listener for focus trapping
      document.addEventListener("keydown", handleKeyDown);

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      // Restore focus to the previously focused element
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
        previousActiveElement.current = null;
      }
    }
  }, [isActive, handleKeyDown, focusFirstElement]);

  return {
    focusFirstElement,
    focusLastElement,
  };
};
