# 📚 File: src/components/ui/carousel.tsx (DEEP DIVE)

### 🌟 GLOBAL OVERVIEW
The `carousel.tsx` file is not built on Radix UI. It is a highly sophisticated wrapper entirely built around **Embla Carousel**. Instead of importing a heavy generic slider library, it integrates Embla's headless mathematical engine with Shadcn's React Context, providing flawless tactile swipe physics and hardware-accelerated inertia.

---

### 1. Role in the Project
Used extensively on the "A Propos" page to display sweeping, horizontally scrolling photo galleries of the Olive Harvest, providing native iOS/Android swipe mechanics.

---

### 2. Exhaustive Code Breakdown & Step-by-Step Logic

#### A) Headless Hook Integration (`useEmblaCarousel`)
```tsx
import useEmblaCarousel from "embla-carousel-react";

const Carousel = React.forwardRef<...>(
  ({ orientation = "horizontal", opts, setApi, plugins, className, children, ...props }, ref) => {
    
    // 1. Initialize the physics engine
    const [carouselRef, api] = useEmblaCarousel(
      { ...opts, axis: orientation === "horizontal" ? "x" : "y" },
      plugins
    );
    
    // 2. React Context Provider
    return (
      <CarouselContext.Provider value={{ carouselRef, api, scrollPrev, scrollNext, canScrollPrev, canScrollNext }}>
        <div ref={ref} onKeyDownCapture={handleKeyDown} ...>
          {children}
        </div>
      </CarouselContext.Provider>
    )
})
```
- **The Embla Architecture**: Notice that Embla does not render any HTML. It exclusively returns a `carouselRef` and an `api` object. The developer must physically attach `ref={carouselRef}` to a standard `<div>`. Embla then uses Javascript `MutationObserver` APIs to mathematically measure the width of the div and injects native standard `transform: translate3d()` inline CSS to create the sliding physics, completely bypassing React's sluggish virtual DOM rendering cycles!
- **The Context Sharing**: The `CarouselContext` broadcasts the raw Embla `api` downward. This allows a completely detached "Next" button sitting 5 DOM levels deep to simply call `api.scrollNext()` and instantly mathematically snap the viewport forward.

#### B) Keyboard Navigation Trapping (`onKeyDownCapture`)
```tsx
const handleKeyDown = React.useCallback(
  (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      scrollPrev();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      scrollNext();
    }
  },
  [scrollPrev, scrollNext],
);
```
- Web Accessibility (A11y) mandates that carousels must be browsable without a mouse.
- **`onKeyDownCapture`**: This is a powerful React event sequence. "Capture Phase" events fire *downwards* from the parent before reaching the children. If the Carousel detects the Left/Right arrow keys are pressed while the user's browser focus is actively inside it, it forcefully calls `event.preventDefault()` (stopping the entire browser window from scrolling sideways) and redirects that exact momentum into the Embla `scrollNext()` API math engine!
