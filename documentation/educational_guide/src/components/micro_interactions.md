# 📚 Sub-Module: Micro-Interactions (DEEP DIVE)
*Combining: `MagneticButton.tsx`, `RotatingBadge.tsx`, `SectionReveal.tsx`*

### 🌟 GLOBAL OVERVIEW
Rather than being fully independent pages or massive layout structures, these three files are **Atmospheric Utilities**. They are microscopic, highly reusable wrappers designed to be wrapped around other elements to inject "premium, high-end" tactile feel into the Thazdayth application.

---

### 1. `MagneticButton.tsx` (Cursor Physics Engine)

#### A) The Math of Magnetism
```tsx
const handleMouse = (e: React.MouseEvent) => {
  const rect = ref.current?.getBoundingClientRect();
  if (!rect) return;
  x.set((e.clientX - rect.left - rect.width / 2) * 0.3);
  y.set((e.clientY - rect.top - rect.height / 2) * 0.3);
};
```
- **WHAT?** Have you ever hovered over a button on a luxury brand website, and the button physically "pulls" itself towards your mouse cursor? That's what this does.
- **The Core Calculation**:
  1. `e.clientX` is exactly where your mouse is on the screen (e.g., Pixel 500).
  2. `getBoundingClientRect()` figures out exactly where the physical button is on the screen.
  3. `rect.left + rect.width / 2` calculates the **exact, dead center pixel** of the button.
  4. By subtracting the Mouse Pixel from the Button Center Pixel, we discover exactly how far away the mouse is. 
  5. We multiply that distance by `0.3` (30%). This tells the button to move exactly 30% of the way towards the mouse! It creates an elastic "pull".

#### B) Return to Origin (The Spring)
```tsx
const springX = useSpring(x, { stiffness: 200, damping: 20 });
const reset = () => { x.set(0); y.set(0); };
```
- **WHAT?** When your mouse leaves the button (`onMouseLeave={reset}`), we don't just want the button to instantly snap back to the center (`0, 0`). That looks cheap. By piping the `x` value through `useSpring`, Framer Motion simulates physical rubber-band tension. When you let go, it smoothly bounces back to origin.

---

### 2. `RotatingBadge.tsx` (SVG Text Manipulation)

#### A) Text on a Curve
```tsx
<svg className="absolute inset-0 w-full h-full animate-spin-slow" viewBox="0 0 120 120">
  <defs>
    <path id="circlePath" d="M 60,60 m -45,0 a 45,45 0 1,1 90,0 a 45,45 0 1,1 -90,0" />
  </defs>
  <text className="fill-foreground text-[10px] uppercase tracking-[0.3em] font-medium">
    <textPath href="#circlePath">{displayText}</textPath>
  </text>
</svg>
```
- **WHAT?** This generates the circular "DECOUVREZ NOTRE BOUTIQUE" spinning badges seen on the homepage.
- **The `path` Math**: HTML/CSS fundamentally cannot curve text. It only renders straight lines. To curve text, we must build a raw SVG path. `d="M 60,60 m -45...` is raw SVG mathematical instruction to draw a mathematically perfect, invisible circle with a radius of 45.
- **The `<textPath>`**: This incredible SVG tag takes normal text and forcefully wraps it precisely upon the rim of the invisible circle we just mathematically plotted! We then use Tailwind's `animate-spin-slow` to rotate the SVG canvas infinitely.

---

### 3. `SectionReveal.tsx` (The Fade-In Orchestrator)

#### A) Viewport Intersection Observer
```tsx
const SectionReveal = ({ children, delay = 0 }: SectionRevealProps) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
  >
    {children}
  </motion.div>
);
```
- **WHAT?** As you scroll down the website, images and text fade-in and float upwards gently. This component is the engine for every single one of those animations.
- **`whileInView`**: Instead of triggering the animation immediately when the website loads, Framer Motion physically monitors the user's scrollbar. The animation *only* begins when the HTML element physically enters the monitor's screen bounds.
- **`viewport={{ once: true, margin: "-80px" }}`**:
  - `once: true`: If you scroll down, it fades in. If you scroll back up, and down again, it shouldn't fade in a second time. `once: true` permanently locks the element in its visible state after the first animation.
  - `margin: "-80px"`: If an element fades in the *exact millisecond* its top edge touches the bottom of the screen, the user might miss it! By adding a `-80px` margin, we trick the viewport into waiting until the element is physically 80 pixels *inside* the screen before triggering the fade-in, guaranteeing the user sees the beautiful animation.
- **`ease: [0.25, ...]`**: This is a custom Bezier Curve. It tells the animation to start fast and gracefully decelerate at the end, perfectly mimicking gravity.
