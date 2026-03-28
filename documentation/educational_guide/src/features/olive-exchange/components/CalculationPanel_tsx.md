# 📚 File: src/features/olive-exchange/components/CalculationPanel.tsx (DEEP DIVE)

### 🌟 GLOBAL OVERVIEW
The `CalculationPanel.tsx` acts as the real-time financial mathematics display natively for the Olive Exchange. Driven strictly by Framer Motion, it beautifully animates mathematical projections showing a farmer exactly how many liters of oil they will passively earn based on their live form inputs.

---

### 1. Role in the Project
Injected dynamically at the bottom of the `OliveRequestForm.tsx`, it intercepts the mathematical `CalculationResult` object and elegantly renders the final costs (either in Algerian Dinars or deducted Liters) using buttery smooth `<AnimatePresence>` transitions.

---

### 2. Exhaustive Code Breakdown & Step-by-Step Logic

#### A) The Framer Motion Lifecycle Wrapper (`AnimatePresence`)
```tsx
import { motion, AnimatePresence } from "framer-motion";

export default function CalculationPanel({ result, paymentMethod }) {
  if (!result) { return <div> Remplissez le formulaire... </div>; }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={JSON.stringify(result)}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="rounded-lg border..."
      >
        //...
      </motion.div>
    </AnimatePresence>
  );
}
```
- **The React Unmount Problem**: Normally, when a React variable inherently abruptly changes, React violently deletes the old HTML div and instantly physically replaces it with the new one. This fundamentally prevents CSS exit animations from ever firing.
- **The `AnimatePresence` Engine**: Framer Motion technically intercepts the React unmount command! When the user fundamentally types `500kg` instead of `400kg`, the `result` prop uniquely changes.
- **The `key` Re-Render Hack (`key={JSON.stringify(result)}`)**: By aggressively forcing a completely brand new `key` identifier onto the `motion.div` every time the math fundamentally changes, React genuinely believes it is an entirely new DOM element. `AnimatePresence` detects this, fades the old math out gracefully (`exit={{ opacity: 0 }}`), completely waits for the animation to cleanly finish (`mode="wait"`), and flawlessly slides the new math calculations down from the top (`initial={{ y: 8 }}`).

#### B) Dimensional Mathematical Rendering
```tsx
{paymentMethod === "oil_percentage" && (
  <div className="flex items-center justify-between">
    <span className="text-sm text-muted-foreground">Part producteur</span>
    <span className="font-semibold text-accent-foreground">
      − {result.producerShare.toFixed(1)} L
    </span>
  </div>
)}
```
- **Dynamic Unit Displays**: The panel dynamically pivots the physical UI units based globally on the user's `paymentMethod`. 
- If the user selects absolute "Percentage", the panel explicitly displays the Producer's literal deduction identically formatted to one decimal place (`toFixed(1) L`). If they choose "Money", it natively calculates strictly in Algerian Dinars (`toLocaleString() DA`), generating a completely contextual mathematical receipt dynamically!
