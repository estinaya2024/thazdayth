# 📚 File: src/components/ui/context-menu.tsx (DEEP DIVE)

### 🌟 GLOBAL OVERVIEW
The `context-menu.tsx` file provides exactly duplicated functionality to `dropdown-menu.tsx`, but replaces the trigger mechanism entirely. Instead of opening when Left-Clicked, a Context Menu opens strictly when the user Right-Clicks (or Long-Presses on Mobile), hijacking the native Operating System menu perfectly.

---

### 1. Role in the Project
Used extensively on Dashboard Data Grids. For example, Right-Clicking on an "Order Row" pops open a specialized menu (`Approve`, `Reject`, `Delete`) directly at the exact X/Y coordinate of the mouse pointer.

---

### 2. Exhaustive Code Breakdown & Step-by-Step Logic

#### A) Overriding the Native OS Context Window
```tsx
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu"

const ContextMenu = ContextMenuPrimitive.Root
```
- Every browser has a native Right-Click Menu ("Back", "Forward", "Reload", "Inspect"). 
- The `<ContextMenuPrimitive.Root>` wrapper physically attaches a global `document.onContextMenu` Javascript listener to the wrapped area. 
- When triggered natively, it mathematically fires `event.preventDefault()`, legally blocking the Chrome/Safari native Right-Click menu from spawning, and subsequently calculates the exact `clientX` and `clientY` coordinates of the user's cursor to spawn the absolute-positioned custom React DOM node instead!

#### B) Absolute Design Standardization (CVA)
```tsx
const ContextMenuItem = React.forwardRef<...>(({ className, inset, ...props }, ref) => (
  <ContextMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-accent focus:text-accent-foreground",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
```
- The code for `ContextMenuItem`, `ContextMenuRadioItem`, `ContextMenuCheckboxItem`, and `ContextMenuSeparator` is physically copied almost byte-for-byte from `dropdown-menu.tsx`.
- Shadcn purposely enforces strict geometric parity across all `*Menu` components. This ensures that regardless of whether a user Right-Clicks a table (Context Menu), Left-Clicks a button (Dropdown Menu), or clicks the top Bar (Menubar), the typography (`text-sm`), padding (`px-2 py-1.5`), and exact hover physics (`focus:bg-accent`) universally provide an indistinguishable, polished cohesive software experience natively.
