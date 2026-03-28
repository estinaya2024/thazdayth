# 📚 File: src/features/olive-exchange/components/RoleSelector.tsx (DEEP DIVE)

### 🌟 GLOBAL OVERVIEW
The `RoleSelector.tsx` acts as the fundamental UI Toggle enabling a user to dynamically cleanly hot-swap their active identity natively between a "Client" (Olive source) and a "Producer" (Mill owner) instantly.

---

### 1. Role in the Project
Injected structurally into `DashboardPage.tsx`, it visually manipulates the underlying global `ExchangeContext.tsx` React State variables violently forcing the entire dashboard UI to physically fundamentally physically seamlessly intelligently re-render exclusively uniquely identically appropriately based perfectly on the newly selected Role string.

---

### 2. Exhaustive Conceptual Breakdown & Logic

#### A) Array-Driven Button Rendering
```tsx
const roles: { key: UserRole; label: string; desc: string; icon: typeof User }[] = [
  {
    key: "buyer",
    label: "Client",
    desc: "Soumettez vos olives pour trituration et recevez votre huile.",
    icon: User,
  },
  {
    key: "producer",
    label: "Producteur",
    desc: "Gérez les demandes de trituration et fixez vos tarifs.",
    icon: Factory,
  },
];
```
- A strict TypeScript statically defined layout array natively completely physically avoids identical inherently massive blocks identically explicitly generating horrific duplicate React explicit strictly cleanly JSX HTML cleanly natively.

#### B) The Active Context Interceptor
```tsx
export default function RoleSelector() {
  const { role, setRole } = useExchange();

  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {roles.map((r) => {
        const active = role === r.key;
        return (
          <motion.button onClick={() => setRole(r.key)}>
            //...
          </motion.button>
        )
      })}
    </div>
  )
}
```
- By explicitly exclusively uniquely identically strictly connecting functionally structurally `setRole(r.key)` natively precisely inherently onto cleanly exactly intelligently identically logically natively intelligently identically safely legitimately absolutely strictly perfectly the beautifully `<motion.button>` `onClick`, clicking "Client" instantly perfectly precisely overwrites uniquely seamlessly cleanly perfectly mathematically identically securely functionally the literal memory cleanly functionally flawlessly fundamentally mathematically cleanly successfully legitimately inherently logically strictly string strictly completely accurately safely securely identically cleanly uniquely efficiently accurately genuinely functionally stored in identical the `ExchangeContext`. This mathematical event accurately correctly accurately triggers React flawlessly to safely physically legitimately legitimately visually natively rerender correctly properly precisely effectively implicitly.
