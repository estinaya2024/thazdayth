# 📚 File: src/components/ui/toast.tsx (DEEP DIVE)

### 🌟 GLOBAL OVERVIEW
The `toast.tsx` file provides the lowest-level visual building blocks for system notifications. It wraps the `@radix-ui/react-toast` primitives, applying Tailwind CSS animations and layout mathematical rules to govern how notifications enter and exit the screen.

---

### 1. Role in the Project
This file merely defines the *aesthetic shape* of a Toast (background color, animations, close button position). It does not hold state; it is meant to be consumed by the parent `toaster.tsx` component.

---

### 2. Exhaustive Code Breakdown & Step-by-Step Logic

#### A) The Viewport (Global Container)
```tsx
const ToastViewport = React.forwardRef<...>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className
    )}
    {...props}
  />
))
```
- **The Teleportation Node**: The `<Viewport>` component sits invisibly globally fixed (`fixed z-[100]`) across the entire screen. 
- **Responsive Stacking Logic (`flex-col-reverse` vs `sm:flex-col`)**: 
  - On Mobile, Toasts often appear at the *top* of the screen (`top-0`), so `flex-col-reverse` ensures new toasts push old toasts downwards.
  - On Desktop (`sm:`), the viewport violently relocates to the **bottom-right** of the screen (`sm:bottom-0 sm:right-0 sm:top-auto`). Because they spawn from the bottom, `sm:flex-col` ensures new toasts stack naturally upwards.

#### B) Swipe-to-Dismiss Physics
```tsx
const toastVariants = cva(
  "data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] ..."
)
```
- **The Drag Engine**: Radix Toast natively supports absolute touch-swiping. When a user drags the toast with their finger, Radix dynamically calculates the Delta X (movement distance) and writes it into the `--radix-toast-swipe-move-x` CSS variable inline!
- The Tailwind `data-[swipe=move]` modifier immediately applies this exact variable to the CSS `transform: translateX` property in real-time. If the user lets go without swiping far enough, `data-[swipe=cancel]` triggers a hyper-fast transition physically snapping it back to `0`!
