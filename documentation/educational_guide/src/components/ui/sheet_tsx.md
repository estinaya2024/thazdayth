# 📚 File: src/components/ui/sheet.tsx (DEEP DIVE)

### 🌟 GLOBAL OVERVIEW
The `sheet.tsx` file executes "Slide-Over" or "Drawer" modal systems. It utilizes the exact identical internal engine as `dialog.tsx` (`@radix-ui/react-dialog`), but mathematically intercepts the CSS animation logic to force the window to physically slide into the screen from an edge (Left, Right, Top, Bottom) rather than fading in at the exact center.

---

### 1. Role in the Project
Serves as the foundational backbone for the Mobile Navigation overlay. When a user on an iPhone clicks the "Hamburger" icon, the Navbar slides out from the right side of the screen as a `Sheet`.

---

### 2. Exhaustive Code Breakdown & Step-by-Step Logic

#### A) Inheriting Dialog Architecture
```tsx
import * as SheetPrimitive from "@radix-ui/react-dialog";

const Sheet = SheetPrimitive.Root;
const SheetTrigger = SheetPrimitive.Trigger;
const SheetClose = SheetPrimitive.Close;
const SheetPortal = SheetPrimitive.Portal;
```
- Radix UI does not have a "Sheet" primitive! The developers of Shadcn realized that a "Sheet" is mechanically absolutely identical to a "Dialog Modal" (It traps focus, it disables the background, it provides a "click outside to close" wrapper). Therefore, `<Sheet>` is literally just a `<Dialog>` that has had its physical CSS coordinates re-written!

#### B) CVA Directional Geometry Injection (`sheetVariants`)
```tsx
const sheetVariants = cva(
  "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right: "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
      },
    },
    defaultVariants: { side: "right" },
  },
);
```
- **The Geometry Overrides**: If the developer declares `<Sheet side="right">`, the CVA engine injects `inset-y-0 right-0 h-full w-3/4`.
  - `inset-y-0`: Mathematical shorthand for `top: 0; bottom: 0;`. This stretches the sheet to be 100% of the screen's height.
  - `right-0`: Pins it to the exact far-right pixel limit of the monitor.
  - `w-3/4`: Constrains the width to exactly 75% of the mobile screen.
- **The Tailwind Animation Overrides**: Instead of `zoom-in-95` (which Dialog uses to scale up from the center), the `Sheet` injects `slide-in-from-right`. This Tailwind instruction physically translates the DOM node entirely off the screen (`translateX(100%)`), and when triggered, smoothly animates it backward to (`translateX(0)`), creating the beautiful slide-over drawer illusion automatically.
