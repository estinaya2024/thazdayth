# 📚 File: server/src/models/Order.ts

### 🌟 GLOBAL OVERVIEW
The `Order.ts` file is the **Receipt Book** of the application. It is the most complex data model because it has to track exactly what a customer bought, how it's being shipped, and how much they paid, all while ensuring that if prices change tomorrow, yesterday's receipts don't suddenly change too!

---

### 1. Role in the Project
It securely stores all purchase transactions. When a user checks out from their cart, a new "Order" document is created in the database based strictly on this blueprint.

### 2. Connection with Other Files
- **To `User.ts`**: Every order is linked to a specific user via `user_id`.
- **To `Product.ts` & `OliveCategory.ts`**: The items inside the order are linked back to what was sold.
- **To `routes/orders.ts`**: The API routes use this model to create, find, and update orders.

### 3. Code Breakdown & Step-by-Step Logic

#### A) The Sub-Schema (Items)
```typescript
const OrderItemSchema = new Schema<IOrderItem>({
    olive_category_id: {
        type: Schema.Types.ObjectId,
        required: true,
        refPath: 'items.model_type'
    },
    ...
```
- **WHAT?** An Order isn't just one thing; it's a list containing multiple items. We create a "Schema inside a Schema."
- **WHAT IS `refPath`?** This is advanced Mongoose! Usually, an ID points to exactly one table (e.g., "Users"). But here, a customer could be buying a *Service* (`OliveCategory`) OR a *Bottle* (`Product`). `refPath` allows the ID to dynamically point to *either* database table depending on what `model_type` says.

#### B) Price Snapshotting (Crucial Concept!)
```typescript
    olive_price_at_order: { type: Number, required: true },
    pressing_fee_at_order: { type: Number, required: true },
```
- **WHY?** Imagine you buy Olive Oil today for $10. Tomorrow, the owner changes the price to $15. If we just linked to the "Product Price," your receipt would suddenly say you paid $15! 
- By creating *Snapshot* fields (`_at_order`), we permanently freeze the price at the exact millisecond the user clicked "Buy," preserving historical accuracy.

#### C) The Main Order Schema
```typescript
const OrderSchema = new Schema<IOrder>({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [OrderItemSchema], // Array of the sub-schema above
    shipping: {
        type: { type: String, enum: ['delivery', 'pickup'] },
        ...
```
- **WHAT?** This ties everything together. We link the `user_id` to the `User` model (`ref: 'User'`). We embed an array `[]` of the items they bought. Finally, we embed a shipping object to track delivery vs. pickup.

#### D) Sparse Tracking Codes
```typescript
tracking_code: { type: String, unique: true, sparse: true },
```
- **WHY `sparse: true`?** We want `tracking_code` to be unique so no two orders have the same code. But when an order is first created, it doesn't have a code yet (it's empty). `sparse` tells the database: "Only enforce the `unique` rule if this field actually exists."

### 4. Syntax & Keywords Explained
- **`mongoose.Types.ObjectId`**: The specific data type MongoDB uses for its unique 24-character IDs. It's not just a string; it's a special database index.
- **`enum`**: Forces the database to only accept specific strings (e.g., order status can only be `pending`, `in-progress`, `completed`, `delivered`, or `cancelled`).

---

### 🎓 Teacher's Q&A Section
1. **Why is `_id: false` set on the `OrderItemSchema`?**
   - **Answer**: By default, Mongoose gives an `_id` to everything, even sub-items inside an array. We set it to `false` here because we don't need to search the database for an individual item *outside* of its parent order. It saves database space.
2. **What happens if an order is cancelled? Do we delete it?**
   - **Answer**: No! We change its `status` to `cancelled` and eventually set `is_archived: true`. Deleting financial data is a terrible accounting practice. You always want a paper trail.
3. **What is `owner_notes`?**
   - **Answer**: A private text field. The administrator can type secret notes ("This customer was rude," or "Include a free gift") that the customer will never see.

#### 🔥 The Tricky Question:
*   "Why are we storing `total_price` if we could just calculate it by adding up all the `subtotal`s of the items?"
    - **Answer**: Performance and Querying. If we want to find "All orders over $1000," doing math on millions of individual items takes too long. Storing the pre-calculated `total_price` makes searching the database extremely fast.

---

### 🎙️ Presentation Script
"Our Order model handles complex e-commerce logic, notably through the use of Mongoose's 'refPath' for polymorphic database references allowing mixed carts. More importantly, it demonstrates solid accounting principles by implementing 'Price Snapshots,' ensuring historical invoices remain completely immutable even if global product prices fluctuate in the future."
