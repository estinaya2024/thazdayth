# 📚 File: src/pages/Plats.tsx

### 🌟 GLOBAL OVERVIEW
The `Plats.tsx` file is the **Culinary Showcase**. It transforms static recipes into an interactive experience. By mapping custom Kabyle recipes translated by `react-i18next`, it provides an interactive modal where users can check off ingredients as they cook.

---

### 1. Role in the Project
It is the **Engagement Driver**. It keeps users on the platform by offering tangible, everyday utility (recipes) directly connected to the core product (olive oil).

### 2. Connection with Other Files
- **To `react-i18next`**: It fetches massive translation matrices containing arrays of ingredients and preparation steps.
- **To `AnimatePresence`**: It relies on this Framer Motion wrapper to perfectly animate the opening and closing of the recipe pop-up Modal.

### 3. Code Breakdown & Step-by-Step Logic

#### A) Interactive Ingredient Checklist State
```tsx
const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});

const toggleIngredient = (ing: string) => {
  setCheckedIngredients(prev => ({
    ...prev,
    [ing]: !prev[ing]
  }));
};
```
- **WHAT?** We want the user to be able to click on "2 cloves of garlic" and have it cross itself out.
- **`Record<string, boolean>`**: We initialize an empty Dictionary object. 
- **The Toggle Logic**: When the user clicks "garlic", the `toggleIngredient` function copies the current dictionary (`...prev`), looks for the specific key `[ing]` (which evaluates to `"garlic"`), and sets it to the opposite of whatever it currently is (`!prev[ing]`). 
- **Resulting State**: Internally, React now holds: `{ "Garlic": true, "Olive Oil": false }`.

#### B) Dynamic CSS Reactivity
```tsx
<li className={`${
    checkedIngredients[ing] 
      ? "text-muted-foreground/40 line-through scale-[0.98]" 
      : "text-muted-foreground hover:text-foreground"
}`}>
```
- **WHAT?** We inject our JavaScript state directly into Tailwind CSS!
- If the ingredient is marked `true` in our dictionary, React injects `.line-through` (crossing out the text) and `.scale-[0.98]` (physically shrinking it slightly to feel "completed"). 
- If it's `false`, it receives normal hover effects.

#### C) Anti-Scroll Propagation (Modal Safety)
```tsx
<motion.div
  onClick={(e) => e.stopPropagation()}
  className="bg-background rounded-3xl w-full..."
>
```
- **WHAT?** A critical UX fix for Pop-ups. The translucent black background behind the modal has an `onClick={() => setSelectedDish(null)}` which closes the entire modal when you click outside of it.
- **The Bug**: HTML events "bubble up". If you click *inside* the white modal card, the browser passes that click up to the black background, accidentally closing the modal while you're trying to read!
- **The Fix**: `e.stopPropagation()`. This tells the browser: *"If they click inside the white card, STOP the click event dead in its tracks. Do not let the black background know a click happened."*

### 4. Syntax & Keywords Explained
- **`padStart(2, "0")`**: On the recipe preparation steps, we want numbers to look elegant (`01`, `02`, `10`). The `padStart` Javascript function literally translates to: *"Make sure this string is at least 2 characters long by stuffing 0s at the front until it is."*

---

### 🎓 Teacher's Q&A Section
1. **Why do we use `useEffect` to clear the `checkedIngredients`?**
   - **Answer**: If `useEffect` was missing, a user could check off "Garlic" on the Couscous recipe, close it, open the Tagine recipe, and if Tagine also required "Garlic", it would strangely already be crossed out! The `useEffect` watches the `selectedDish`; the instant the user changes dishes, it forcefully wipes the `checkedIngredients` dictionary completely clean (`{}`).

---

### 🎙️ Presentation Script
"The `Plats` recipe portal introduces local state interaction to otherwise static content. To manage the ingredient checklist, I designed a localized `Record<string, boolean>` dictionary state that inherently prevents O(N) lookup times compared to an array-based approach. Furthermore, to guarantee robust Modal UX, I strategically deployed `e.stopPropagation()` on the dialog boundaries, averting the classic event-bubbling click-through anomaly inherent in DOM architecture."
