# Custom Hooks

## useIntersectionObserver

A flexible hook that uses the Intersection Observer API to detect when an element is visible in the viewport.

### Basic Usage

```tsx
import { useIntersectionObserver } from "~/hooks/useIntersectionObserver";

function MyComponent() {
  const { ref, isIntersecting, intersectionRatio } = useIntersectionObserver({
    threshold: 0.5,
    triggerOnce: true,
  });

  return (
    <div ref={ref}>
      {isIntersecting ? "Element is visible!" : "Element is hidden"}
      <p>Intersection ratio: {intersectionRatio}</p>
    </div>
  );
}
```

### Advanced Usage

```tsx
import { useIntersectionObserver } from "~/hooks/useIntersectionObserver";

function AdvancedComponent() {
  const { ref, isIntersecting, entry } = useIntersectionObserver({
    threshold: [0, 0.25, 0.5, 0.75, 1],
    rootMargin: "-10% 0px -10% 0px",
    triggerOnce: false,
  });

  useEffect(() => {
    if (isIntersecting && entry) {
      console.log("Element entered viewport:", entry.boundingClientRect);
    }
  }, [isIntersecting, entry]);

  return <div ref={ref}>Advanced intersection detection</div>;
}
```

## usePolaroidIntersection

A specialized hook for polaroid components that provides optimized settings for photo reveal animations.

### Usage

```tsx
import { usePolaroidIntersection } from "~/hooks/useIntersectionObserver";

function PolaroidComponent() {
  const { ref, isVisible } = usePolaroidIntersection(0.3, true);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <img src="photo.jpg" alt="Memory" />
    </div>
  );
}
```

### Parameters

- `threshold` (number, default: 0.3): The threshold at which to trigger (0-1)
- `triggerOnce` (boolean, default: true): Whether to trigger only once

## PolaroidWithIntersection Component

A ready-to-use component that combines the Polaroid component with intersection observer functionality.

### Usage

```tsx
import { PolaroidWithIntersection } from "~/components/PolaroidWithIntersection";

function MemoryLane() {
  return (
    <PolaroidWithIntersection
      src="memory.jpg"
      alt="Memory"
      caption="A beautiful memory"
      visibilityThreshold={0.2}
      triggerOnce={true}
      onVisible={() => {
        console.log("Polaroid is now visible!");
        // Add your custom logic here
      }}
      rotate={15}
    />
  );
}
```

### Props

- All `PolaroidProps` are supported
- `visibilityThreshold` (number, default: 0.3): Threshold for visibility detection
- `triggerOnce` (boolean, default: true): Whether to trigger the handler only once
- `onVisible` (function): Handler called when the polaroid becomes visible
