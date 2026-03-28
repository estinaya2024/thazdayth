# 📚 File: src/pages/Processus.tsx

### 🌟 GLOBAL OVERVIEW
The `Processus.tsx` file is the **Cinematic Factory Tour**. It represents the absolute pinnacle of Frontend Animation engineering within this application. It commandeers the browser's scrollbar to orchestrate a massive, synchronized 8-video sequence explaining the exact procedure of turning raw olives into Extra Virgin Olive Oil.

---

### 1. Role in the Project
It is the **Educational Marvel**. Rather than forcing users to click through 8 boring paragraphs, it forces them to physically scroll down an 800-viewport-height invisible column. As they scroll, Framer Motion calculates their exact pixel depth and dynamically swaps out videos and fading text exactly when needed.

### 2. Connection with Other Files
- **To `framer-motion`**: It pushes Framer Motion to its absolute limits, utilizing advanced architectural hooks (`useScroll`, `useTransform`, `useSpring`) rather than standard `<motion.div>` tags.
- **To `/public` assets**: Because video files are so large, they are not stored in `/src/assets` (which gets bundled by Vite). They are served directly from the public folder (e.g., `/VID-20260306.mp4`).

### 3. Code Breakdown & Step-by-Step Logic

#### A) The 800vh Sticky Scroll Architecture
```tsx
<section ref={containerRef} className="relative h-[800vh]">
  <div className="sticky top-0 h-screen flex items-center overflow-hidden">
     {/* Videos and Text go here */}
  </div>
</section>
```
- **WHAT?** This is the core CSS illusion of modern web design (Apple.com uses this heavily).
- **`h-[800vh]`**: We deliberately build a massive invisible box that is 8 times the height of the user's screen (Viewport Heights).
- **`sticky top-0 h-screen`**: We place our Videos inside this box. As the user scrolls down through the giant 800vh box, the Video container physically "sticks" to the top of their screen, appearing completely frozen in place. The user *feels* like the page stopped scrolling entirely.

#### B) Real-Time Scroll Math (useScroll)
```tsx
const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
});

const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
```
- **WHAT?** While the user thinks the page is frozen, they are actually scrolling down our 800-screen-tall box. 
- **`useScroll`**: Framer Motion perfectly tracks what percentage of the giant box they have scrolled through, yielding a number from `0.00` (top) to `1.00` (bottom).
- **`useSpring`**: Because users scroll erratically (swiping fast, then slow), we pipe the raw `0.00 -> 1.00` number through a physics engine. This forces the number to "smooth out" gracefully like a rubber band before we use it.

#### C) Synchronizing Video to Scroll Percentage
```tsx
useEffect(() => {
    const unsubscribe = scaleX.on("change", (v) => {
        const index = Math.min(
            Math.floor(v * steps.length),
            steps.length - 1
        );
        setActiveStep(index);
    });
    return () => unsubscribe();
}, [scaleX, steps.length]);
```
- **WHAT?** The core Brain of the animation. 
- If the user scrolls exactly halfway down the giant box, the spring tracker `v` equals `0.50`.
- We have 8 video steps. `0.50 * 8 = 4.0`.
- `Math.floor(4.0)` = `4`.
- The code instantly says: *"The user is scrolling at 50%. Force the active video to be array index 4!"* 
- The `AnimatePresence` wrapper then automatically fades out Video 3 and gracefully fades in Video 4. It does this flawlessly dynamically forwards *and* backwards depending entirely on the user's mouse wheel!

### 4. Syntax & Keywords Explained
- **`playsInline`**: On the `<video>` tag, this attribute is required for iOS safari. If missing, iOS will maximize the 8 videos one-by-one into full screen, completely destroying the cinematic layout.

---

### 🎓 Teacher's Q&A Section
1. **Why use a `Math.min` limit on the video index calculation?**
   - **Answer**: If the user scrolls with extreme velocity past the very bottom of our 800vh container, the physics engine bounce might momentarily calculate `v` as `1.01`. `1.01 * 8 = 8.08`. Floor that, we get `8`. But our array only goes from `0` to `7`! The app would crash instantly because `steps[8]` is undefined. The `Math.min(calculated, 7)` acts as an impenetrable safety harness.

---

### 🎙️ Presentation Script
"The `Processus` factory tour utilizes a hyper-advanced `Sticky Scroll` architecture heavily inspired by flagship hardware landing pages. By defining an 800 viewport-height container and binding a Framer Motion `useScroll` listener to it, we intercept the browser's native scroll events. We then pipe that normalized interpolation value—0 to 1—into a `useSpring` physics simulator. This smooth, mathematical curve dictates our reactive React State, cleanly mounting and unmounting successive HTML5 Video nodes while the viewport remains beautifully locked in place."
