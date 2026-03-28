# 📚 File: src/pages/Boutique.tsx

### 🌟 GLOBAL OVERVIEW
The `Boutique.tsx` file is the ultimate **E-Commerce Engine**. It handles two entirely distinct user flows: Purchasing bottled olive oil (Buy Mode), and booking the factory to crush your own harvested olives (Press Mode). This is the most complex React component in the entire frontend.

---

### 1. Role in the Project
It acts as a real-time POS (Point of Sale) system. It calculates totals, manages a virtual shopping cart, checks inventory limits, calculates complex barter equations (paying with oil percentages), and submits the final payload to the Express Backend.

### 2. Connection with Other Files
- **To `API_URL`**: It makes massive concurrent fetch requests to `/products`, `/prices`, `/settings`, and `/shipping-rates`.
- **To `AuthContext`**: It checks if a user is logged in to automatically pre-fill the order form (last name, phone number) and attach their JWT token to the final purchase request.

### 3. Code Breakdown & Step-by-Step Logic

#### A) The Master Fetch (Parallel API Calls)
```tsx
const [wilayasRes, oliveRes, pressingRes, settingsRes, productsRes] = await Promise.all([
  fetch(`${API_URL}/shipping-rates`),
  fetch(`${API_URL}/prices/olives`),
// ...
]);
```
- **WHAT?** When the user opens the shop, we need 5 different pieces of data from the database.
- **`Promise.all`**: If we ran these `fetch` requests one by one, the user would wait 5 seconds. By tossing them into `Promise.all`, JavaScript launches all 5 requests simultaneously in parallel, so the user only waits 1 second. It then cleverly destructures the massive array of responses into 5 cleanly named variables.

#### B) Shopping Cart Guard (Stock Verification)
```tsx
const addToCart = () => {
  if (liters > (selectedCategory.stock_liters || 0)) {
    toast({ title: "Stock insuffisant" });
    return;
  }
// ...
```
- **WHAT?** Before adding anything to the local `cart` array, the code vigorously checks the backend-supplied `stock_liters`. If the customer tries to buy 50L but we only have 10L left, the function instantly terminates (`return;`) and spawns an error toast.

#### C) The "Pressing" Barter Calculator (useMemo)
```tsx
const pressCalc = useMemo(() => {
  const expectedOil = oliveKgNum * yieldPerKg;
  if (paymentMethod === "olives") {
    const producerShare = expectedOil * (producerPercentage / 100);
    return { expectedOil, producerShare, clientOil: expectedOil - producerShare };
  }
  // ...
}, [oliveKgNum, pressOilType, paymentMethod, producerPercentage]);
```
- **WHAT?** If a farmer brings 500kg of olives and wants to pay the factory by giving them 30% of the oil, how much oil does the farmer keep?
- **`useMemo`**: This is a performance hook. It tells React: *"This is a heavy math equation. ONLY recalculate the answer if they change the Kg amount or the payment method. If they change their shipping address, do NOT recalculate this math!"* It caches the math result to save CPU power.

#### D) The Final Payload Submission
```tsx
body: JSON.stringify({
  items: cart.map(item => ({
    olive_category_id: item.product_id,
    quantity: item.liters,
    // ...
  })),
  shipping: { type: deliveryMethod, cost: shipping },
  total_price: buyTotal
}),
```
- **WHAT?** When the user clicks "Confirmer", we must translate our frontend `cart` array into the exact rigid schema expected by our `Order.ts` backend model. We transform our data into a clean JSON string, attach the JWT `Authorization` header, and POST it to the server.

### 4. Syntax & Keywords Explained
- **`type Mode = "buy" | "press"`**: This is a strict TypeScript Union Type. If a developer accidentally types `setMode("sell")`, the compiler immediately crashes, strictly enforcing that only two modes can ever exist in the application state.

---

### 🎓 Teacher's Q&A Section
1. **Why do we handle stock checking on the Frontend if the Backend already does it?**
   - **Answer**: User Experience (UX)! The backend *must* double-check the stock to prevent hackers. However, if we only checked the backend, the user would believe their cart was fine, fill out their entire name and address, click submit, and *then* get an error! By validating the stock instantaneously on the frontend via the `addToCart` function, we save the user immense frustration.
2. **What does the `.ok` property do on a fetch response?**
   - **Answer**: `if (!res.ok)` catches any HTTP error status codes (like `400 Bad Request` or `500 Server Error`). By explicitly checking `.ok` and throwing an Error, we smoothly divert the code into our `catch` block, where we can display the red Toast notification to the user instead of silently crashing the browser.

---

### 🎙️ Presentation Script
"The `Boutique.tsx` component is the transactional core of the application. The paramount architectural challenge here was fetching five highly disparate datasets concurrently. By orchestrating a `Promise.all` architecture, network latency is drastically minimized. For complex state derivation—specifically the barter math for the pressing service—I leveraged the `useMemo` hook to memoize the mathematical outputs, ensuring UI recalculations remain perfectly performant even during heavy interactions."
