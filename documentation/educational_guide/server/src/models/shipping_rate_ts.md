# 📚 File: server/src/models/ShippingRate.ts

### 🌟 GLOBAL OVERVIEW
The `ShippingRate.ts` file is a **Lookup Table**. When a customer places an order, the website needs to know how much to charge for delivery. Instead of hardcoding prices in the frontend, they are stored here so the Admin can change them anytime.

---

### 1. Role in the Project
It manages the **Delivery Pricing Logic**. It pairs a specific Algerian Wilaya (province) with a specific cost.

### 2. Connection with Other Files
- **To `routes/shippingRates.ts`**: The API file that allows the Admin Dashboard to Add, Edit, or Delete these prices, and allows the checkout page to quickly read them.

### 3. Code Breakdown & Step-by-Step Logic

#### A) The Interface
```typescript
export interface IShippingRate extends Document {
    wilaya: string;
    wilaya_code: number;
    price: number;
}
```
- **WHAT?** Every shipping rate object requires three things: the name of the region, its official code (like 16 for Algiers), and the price to ship there.

#### B) The Rules (Schema)
```typescript
const ShippingRateSchema = new Schema<IShippingRate>({
    wilaya: { type: String, required: true, unique: true },
    wilaya_code: { type: Number, required: true, unique: true },
    price: { type: Number, required: true },
});
```
- **WHAT?** We apply `unique: true` to both the `wilaya` name and the `wilaya_code`. 
- **WHY?** To prevent the Admin from accidentally creating two different shipping prices for the exact same region (e.g., adding "Tizi Ouzou" twice with two different costs). The database will strictly reject duplicates.

### 4. Syntax & Keywords Explained
- **`unique`**: A Mongoose validator. Before saving, Mongoose checks the entire collection to make sure no other document shares this exact value. If one does, it throws an `E11000 Duplicate Key Error`.

---

### 🎓 Teacher's Q&A Section
1. **Why do we store both the Wilaya String and the Code?**
   - **Answer**: For UX and safety. The users like to see the string ("Béjaïa"), but the code ("06") guarantees a unique, standard identifier that won't break if someone miss-spells the name.
2. **Why isn't there a `timestamps` option here?**
   - **Answer**: Because a shipping rate isn't an "event" like an Order or a Notification. It's a static piece of reference data. We don't really care *when* the 500 DA rate was created, we only care that it currently exists.

---

### 🎙️ Presentation Script
"ShippingRate is a streamlined reference model designed to prevent business logic errors. By enforcing a double `unique` constraint on both the region name and code, the database inherently protects the checkout flow from ambiguous or conflicting delivery charges."
