# 📚 File: src/components/ui/tooltip.tsx (DEEP DIVE)

### 🌟 GLOBAL OVERVIEW
The `tooltip.tsx` primitive handles extremely brief, delayed micro-text overlays. Unlike a Popover or HoverCard, a Tooltip only houses a raw formatting string (e.g., hovering an icon that says `Delete`).

---

### 1. Role in the Project
Used primarily on icon buttons (like a tiny Trash Can icon or Pencil icon) to guarantee screen readers have an explicit text label, and to provide visual hints to sighted users wondering what the icon does.

---

### 2. Exhaustive Code Breakdown & Step-by-Step Logic

#### A) The Global Delay Engine (`TooltipProvider`)
```tsx
const TooltipProvider = TooltipPrimitive.Provider;

// Deployed somewhere high in the layout:
// <TooltipProvider delayDuration={300}>
```
- **The Delay Physics**: If Tooltips opened instantly (`0ms`), rolling your mouse lazily across a navigation bar would look like a machine gun of flickering black boxes spawning and exploding instantly.
- The `Provider` tracks mouse movement globally. It intercepts the hover event, sets an internal Javascript `setTimeout()`, and legally forbids the popup from opening unless the user's cursor physically remains completely stationary over the target for exactly `300` milliseconds.

#### B) Micro-Animation Configuration (`TooltipContent`)
```tsx
const TooltipContent = React.forwardRef<...>(
  ({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2",
      className,
    )}
    {...props}
  />
));
```
- **Z-Index Layering (`z-50`)**: Because Tooltips are so tiny and transient, they must absolutely trump every single other element on the DOM. `z-[50]` ensures they can hover directly over complex Floating Headers or Sticky Sidebars unharmed.
- **Micro-Scale Animation (`zoom-in-95`)**: When the 300ms delay elapses, the Tooltip Box begins its life physically scaled to `95%` size and `0` Opacity. Over roughly `150ms`, the CSS keyframes scale it powerfully up to `100%` and `1.0` Opacity simultaneously. This subtle visual expansion directs the human eye exactly to the new text element without being jarring.
