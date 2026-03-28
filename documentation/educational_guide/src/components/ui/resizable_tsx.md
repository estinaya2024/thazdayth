# 📚 File: src/components/ui/resizable.tsx (DEEP DIVE)

### 🌟 GLOBAL OVERVIEW
The `resizable.tsx` file provides desktop-grade drag-and-drop window splitting. It wraps the powerful **`react-resizable-panels`** library to allow users to click a 1px border and actively drag it left/right to resize two neighboring div containers (like resizing an IDE codebase vs the terminal window).

---

### 1. Role in the Project
Deployed within complex Administrative interface views allowing store owners to manually adjust the width of the main content column versus a dense analytics sidebar.

---

### 2. Exhaustive Code Breakdown & Step-by-Step Logic

#### A) Flexbox Flex-Grow Math Engine (`ResizablePanelGroup`)
```tsx
const ResizablePanelGroup = ({ className, ...props }: React.ComponentProps<typeof ResizablePrimitive.PanelGroup>) => (
  <ResizablePrimitive.PanelGroup
    className={cn("flex h-full w-full data-[panel-group-direction=vertical]:flex-col", className)}
    {...props}
  />
);
```
- **The Geometry**: `react-resizable-panels` does not use absolute coordinates (e.g. `width: 400px`). It utilizes Flexbox fractional growth!
- If the left panel is `defaultSize={20}` and the right is `defaultSize={80}`, the library assigns `flex: 20` and `flex: 80`. When the user drags the mouse, Javascript catches the mouse `clientX` vector and mathematically recalibrates those flex ratios 60 times a second, creating a seamless, perfectly responsive stretch!

#### B) The Hitbox Invisible Expansion (`ResizableHandle`)
```tsx
const ResizableHandle = ({ withHandle, className, ...props }) => (
  <ResizablePrimitive.PanelResizeHandle
    className={cn(
      "relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2...",
      className
    )}
  >
    {withHandle && (
      <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border">
        <GripVertical className="h-2.5 w-2.5" />
      </div>
    )}
  </ResizablePrimitive.PanelResizeHandle>
)
```
- **The Mouse Capture Problem**: The actual visual divider line is `w-px` (One exact pixel wide). A human being cannot easily click a 1-pixel wide target with a computer mouse without getting frustrated.
- **The `after:` Pseudo-Element**: `<div className="after:absolute after:w-1..."/>` creates an invisible optical illusion! Tailwind generates a physical bounding box slightly wider than the line itself sitting invisibly directly on top of it. This intercepts the mouse cursor early, making the "Grabbable Area" vastly significantly larger than the visual line itself.
