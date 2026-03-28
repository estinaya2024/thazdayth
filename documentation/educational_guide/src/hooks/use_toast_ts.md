# 📚 File: src/hooks/use-toast.ts

### 🌟 GLOBAL OVERVIEW
The `use-toast.ts` file acts as the **Notification Engine** for the frontend. Have you ever seen those small success messages pop up in the corner of a screen ("Item added to cart", "Login successful") and automatically disappear after a few seconds? This file is the complex brain behind them.

---

### 1. Role in the Project
It provides the **User Feedback Loop**. Instead of using ugly browser `alert()` popups, this custom hook allows any component to spawn sleek, modern, non-intrusive notifications.

### 2. Connection with Other Files
- **To `Toaster.tsx`**: While this file is the *brain* (handling the math/logic), `Toaster.tsx` is the *face* (rendering the HTML DOM elements to display them).
- **To All Pages**: When an API call successfully finishes (like adding to cart), the component calls `toast({ title: "Succès!" })`.

### 3. Code Breakdown & Step-by-Step Logic

#### A) The Reducer (State Machine)
```typescript
export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };
      // ...
```
- **WHAT?** This looks like Redux! It's a functional Reducer. It takes the current list of popups (`state`), takes an action (like `ADD_TOAST`), and calculates what the new list of popups should look like.
- **`slice(0, TOAST_LIMIT)`**: If `TOAST_LIMIT` is 1, and you rapidly click a button 5 times, it only ever shows 1 popup on screen to prevent the screen from being spammed. 

#### B) Memory Outside React
```typescript
const listeners: Array<(state: State) => void> = [];
let memoryState: State = { toasts: [] };

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => listener(memoryState));
}
```
- **WHAT?** This is incredibly advanced React! Notice this code is written *outside* of any React component or custom hook. 
- **WHY?** Normally, React state is trapped inside a component. By keeping `memoryState` completely outside, ANY regular JavaScript file can spawn a toast notification, not just React components! When `dispatch` fires, it updates the external memory and then yells at all the `listeners` (React components) to update themselves.

#### C) Auto-Removal Queue (The Timeout)
```typescript
const addToRemoveQueue = (toastId: string) => {
  const timeout = setTimeout(() => {
    dispatch({ type: "REMOVE_TOAST", toastId: toastId });
  }, TOAST_REMOVE_DELAY);
};
```
- **WHAT?** When a toast is dismissed, it doesn't delete instantly. It just gracefully fades out visually. This `setTimeout` waits for the fade animation to finish, and *then* fires `REMOVE_TOAST` to actually delete the data from memory to prevent memory leaks.

### 4. Syntax & Keywords Explained
- **`ReturnType<typeof setTimeout>`**: A TypeScript helper. Instead of guessing what data type `setTimeout` returns (it’s a Number in browsers but an Object in NodeJS), this dynamically grabs the exact right type.

---

### 🎓 Teacher's Q&A Section
1. **Why is this so complicated? Why not just use `useState`?**
   - **Answer**: If we used `useState` inside a component, we would only be able to trigger toasts from *inside* that specific component. This highly abstracted `reducer/listener` pattern creates a global event bus, allowing us to launch toasts from literally anywhere in the codebase.
2. **What is the `genId` function for?**
   - **Answer**: Every toast needs a unique ID so React knows which one to animate or delete. `count = (count + 1) % Number.MAX_SAFE_INTEGER` mathematically guarantees every new toast gets a unique string ID.

---

### 🎙️ Presentation Script
"The `use-toast` hook implements an advanced global state machine outside of the standard React component lifecycle. By utilizing a functional reducer and a subscriber model, it operates as an application-wide event bus. This architecture allows any file—even non-React utility functions—to cleanly dispatch real-time UI feedback to the user."
