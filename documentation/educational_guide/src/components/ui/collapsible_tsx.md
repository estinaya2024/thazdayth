# 📚 File: src/components/ui/collapsible.tsx (DEEP DIVE)

### 🌟 GLOBAL OVERVIEW
The `collapsible.tsx` file is one of the strictly spartan primitives in the Shadcn library. It provides raw, un-styled open/close visibility toggling built entirely on Radix UI, lacking the complex CSS Grid mathematics found in `accordion.tsx`.

---

### 1. Role in the Project
Used primarily inside the `Sidebar.tsx` to build nested menu trees (e.g., clicking "Settings" to reveal "Profile", "Billing", "Team" beneath it) without creating strict accordion grouping logic.

---

### 2. Exhaustive Code Breakdown & Step-by-Step Logic

#### A) Zero-Intervention Wrapper
```tsx
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";

const Collapsible = CollapsiblePrimitive.Root;
const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger;
const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent;

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
```
- **Why is there no CSS?**: Most Shadcn components inject massive `className={cn("text-sm transition-all...")}` blocks. The `collapsible` intentionally provides zero styling. 
- It acts purely as a **Logical State Machine**. It exists solely to manage the `open` boolean state and link the `aria-expanded` and `aria-controls` accessibility attributes dynamically between the Trigger Button and the Content Div mechanically. The developer is expected to provide all animations directly where it is implemented!
