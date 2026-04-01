# 📚 File: server/src/models/Product.ts

### 🌟 GLOBAL OVERVIEW
The `Product.ts` file acts as the **Store Inventory**. While earlier parts of the site deal with people bringing their own olives to be pressed, this specific file handles the actual bottles of ready-made olive oil that the mill sells directly to the public through the "Boutique."

---

### 1. Role in the Project
It defines what a "Product" is in our system. It requires a name, limits the types of oil to specific categories, and—most importantly—tracks how much of that oil is currently sitting in the mill's physical storage tanks (`stock_liters`).

### 2. Connection with Other Files
- **To `routes/products.ts`**: The API uses this blueprint to Add, Edit, or Delete inventory items.
- **To `Order.ts`**: When a customer buys a bottle, the Order links back to this Product to know what was sold.

### 3. Code Breakdown & Step-by-Step Logic

#### A) The TypeScript Interface
```typescript
export interface IProduct extends Document {
    name: string;
    category: 'extra_virgin' | 'virgin' | 'third_quality';
    price_per_liter: number;
    stock_liters: number;
    is_available: boolean;
    ...
}
```
- **WHAT?** This acts as the rigorous set of rules for writing code. 
- **WHY?** If we try to create a product coded as `category: 'fake_oil'`, TypeScript will sound the alarm and refuse to compile the backend, enforcing strict data quality.

#### B) The Mongoose Schema
```typescript
const ProductSchema = new Schema<IProduct>({
    name: { type: String, required: true },
    category: {
        type: String,
        enum: ['extra_virgin', 'virgin', 'third_quality'],
        required: true,
    },
    ...
```
- **WHAT?** This translates the TypeScript safety net into the actual MongoDB safety net. The `enum` ensures that even if someone manages to bypass TypeScript, the database itself will reject any category that isn't one of those three exact strings.

#### C) Stock and Availability Tracking
```typescript
    price_per_liter: { type: Number, required: true },
    stock_liters: { type: Number, default: 0 },
    is_available: { type: Boolean, default: true },
```
- **WHAT?** The price is strictly required (you can't sell an item without a price!). 
- The `stock_liters` defaults to 0, representing how much oil is physically in the mill.
- `is_available` allows the owner to manually hide an item from the web store (e.g., if a tank is being cleaned or reserved), even if the stock isn't zero.

### 4. Syntax & Keywords Explained
- **`default: 0`**: A Mongoose feature that automatically fills in a value if the programmer forgets to provide one. You don't have to write `stock_liters: 0` every time; the database does it for you.
- **`default: true`**: When a new product is created, we assume the mill wants to sell it immediately, so it defaults to visible on the storefront.

---

### 🎓 Teacher's Q&A Section
1. **Why is `price_per_liter` a Number instead of a String like "$15.00"?**
   - **Answer**: Because you can't do math on strings! If we want to calculate `price * quantity`, the database needs it to be a pure number. The "DA" or "$" symbol is added purely on the Frontend (`Boutique.tsx`).
2. **What is the difference between `stock_liters: 0` and `is_available: false`?**
   - **Answer**: A product might have 100 liters in stock but be marked `is_available: false` because the owner is reserving it for a special client. Alternatively, a product might have 0 stock but be marked `is_available: true` so customers can view it and join a waiting list.
3. **If a customer buys 5 liters, does this file change?**
   - **Answer**: This file defines the *rules*, so it never changes. However, the *data* in the database created from this file will change. Our Product Route will deduct 5 from the `stock_liters`.

#### 🔥 The Tricky Question:
*   "Why don't we see an image URL in this schema?"
    - **Answer**: By design! In professional, highly-branded sites like this one, product images are tightly controlled and hardcoded in the frontend (`assets/images`) to guarantee perfect aesthetics and animations. Allowing dynamic image uploads often breaks frontend layouts.

---

### 🎙️ Presentation Script
"The Product model handles our retail inventory management. It utilizes strict enumerations to enforce category integrity (Extra Virgin vs Virgin). It also decouples physical inventory (`stock_liters`) from storefront visibility (`is_available`), allowing administrative users to pause sales without deleting historical product data."
