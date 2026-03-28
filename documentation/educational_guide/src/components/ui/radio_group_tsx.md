# 📚 File: src/components/ui/radio-group.tsx (DEEP DIVE)

### 🌟 GLOBAL OVERVIEW
The `radio-group.tsx` primitive handles "Mutually Exclusive Choice" logic natively. Unlike checkboxes (where you can check 5 simultaneously), Radio Groups enforce that selecting Option B mathematically forces Option A to uncheck.

---

### 1. Role in the Project
Used in forms requiring strict boolean selections, such as choosing "Payment Method" or "Pickup vs Delivery" at checkout.

---

### 2. Exhaustive Code Breakdown & Step-by-Step Logic

#### A) Contextual Unchecking (`RadioGroupPrimitive.Root`)
```tsx
const RadioGroup = React.forwardRef<...>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-2", className)}
      {...props}
      ref={ref}
    />
  )
})
```
- The `Root` creates an invisible React Context bubble. It tracks exactly which child string value is currently active. If a user clicks `<RadioGroupItem value="card">`, the Root silently broadcasts an instruction to `<RadioGroupItem value="cash">` forcing it to mathematically self-destruct its checked state simultaneously. 

#### B) SVG Indicator Injection
```tsx
const RadioGroupItem = React.forwardRef<...>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 ...",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Circle className="h-2.5 w-2.5 fill-current text-current" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
})
```
- **The Empty Circle**: The `Item` creates the physical outer boundary (a perfectly round ring via `aspect-square h-4 w-4 rounded-full`).
- **The Filling Dot**: The `<Circle>` (imported from Lucide) acts as the dark dot in the center. The Radix `Indicator` component physically deletes the SVG from the DOM tree recursively unless the parent Root grants it explicit permission to exist (i.e., it is the selected item). The `fill-current` Tailwind class ensures the SVG natively dynamically inhales the primary color of the parent ring completely.
