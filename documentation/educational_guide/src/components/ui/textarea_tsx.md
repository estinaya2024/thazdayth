# 📚 File: src/components/ui/textarea.tsx (DEEP DIVE)

### 🌟 GLOBAL OVERVIEW
The `textarea.tsx` primitive is the multi-line input cousin of `input.tsx`. It provides a rigorous, standardized baseline for long-form user entry fields (like Contact Form messages or Testimonials).

---

### 1. Role in the Project
Deployed on the Testimonials page where users manually type physical reviews, and on backend administrative forms where extended descriptions (like Olive Oil pressing cycle details) are cataloged.

---

### 2. Exhaustive Code Breakdown & Step-by-Step Logic

#### A) Height and Border Architecture
```tsx
export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";
```
- **The Minimum Geometry (`min-h-[80px]`)**: Unlike single-line inputs (`h-10` = 40px), a standard textarea must look expansive. By defining an arbitrary `min-h-[80px]`, the box begins naturally capable of displaying roughly 4 physical lines of text without scrolling.
- **Native User Resizing**: Standard HTML `<textarea>` elements natively inject a tiny triangle graphic into the bottom-right corner, allowing the user to click and physically drag the box to make it larger. Because we define `min-h` (Minimum Height) instead of a rigid `h-20` (Fixed Height), we mathematically permit the browser's native resizing engine to function flawlessly without CSS geometry constraints snapping the box back algorithmically.
- **Focus Rings**: Like `input.tsx`, the `focus-visible:ring-2` mechanically binds to the Keyboard Navigation APIs. If a user presses `TAB` on their keyboard to jump into the Textarea, an intense 2-pixel glowing ring materializes to provide absolute spatial context to sight-impaired users navigating without a mouse.
