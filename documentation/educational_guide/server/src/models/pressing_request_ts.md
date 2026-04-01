# 📚 File: server/src/models/PressingRequest.ts

### 🌟 GLOBAL OVERVIEW
The `PressingRequest.ts` file acts as the **Service Agreement**. When a farmer or local citizen brings their own olives to the mill to be pressed, they don't buy a bottle; they buy a *service*. This model tracks that entire process, from drop-off to the final payment and collection of their oil.

---

### 1. Role in the Project
It defines the business logic of the olive mill. Unlike a standard E-commerce order, a pressing request involves physical raw materials (olives), a manufacturing process (pressing), a yield calculation (how much oil came out), and flexible payment methods.

### 2. Connection with Other Files
- **To `User.ts`**: It links to the customer who owns the olives.
- **To `routes/pressing.ts`**: The API routes use this model to track the life cycle of the pressing request (Pending -> In Progress -> Completed).
- **To `Suivi.tsx` (Frontend)**: The tracking dashboard reads this model to show the customer exactly where their olives are in the pressing queue.

### 3. Code Breakdown & Step-by-Step Logic

#### A) The Yield Object
```typescript
    yield: {
        liters_per_kg: { type: Number, required: true },
        produced_oil_liters: { type: Number, required: true },
    },
```
- **WHAT?** This tracks the "Math" of the pressing. 
- **WHY?** If a customer brings 100kg of olives, we don't know exactly how much oil they will get until after the pressing. `liters_per_kg` (the yield rate) and `produced_oil_liters` (the final result) are stored here for extreme transparency.

#### B) The Flexible Payment System (Barter System)
```typescript
    payment: {
        type: { type: String, enum: ['money', 'olives'], required: true },
        pressing_price_per_kg: { type: Number },
        percentage_taken: { type: Number },
    },
```
- **WHAT?** This is a unique cultural feature of olive mills. Customers can pay with cash (`money`), OR they can pay the mill by giving them part of the oil they just produced (`olives`).
- **WHY?** 
    - If `type = 'money'`, we track the `pressing_price_per_kg` (e.g., 20 DA per kg of olives).
    - If `type = 'olives'`, we track the `percentage_taken` (e.g., the mill keeps 10% of the produced oil as a fee).

#### C) Lifecycle Dates
```typescript
    bring_olives_date: { type: Date },
    collect_oil_date: { type: Date },
```
- **WHAT?** These dates track the physical movement of goods. `bring_olives_date` is when the customer is scheduled to drop them off. `collect_oil_date` is when the final product is ready for pickup.

### 4. Syntax & Keywords Explained
- **`mongoose.Types.ObjectId`**: The standard 24-character hexadecimal string used by MongoDB to uniquely identify records.
- **Nested Objects**: Instead of having a flat list of properties, we group related data together using nested blocks like `yield: { ... }` and `payment: { ... }`. This makes the code much easier to read and structure in the frontend.

---

### 🎓 Teacher's Q&A Section
1. **Why are `pressing_price_per_kg` and `percentage_taken` not marked as `required: true`?**
   - **Answer**: Because they are mutually exclusive. If the user pays with money, `percentage_taken` will naturally be empty. If they pay with olives, `pressing_price_per_kg` will be empty. Mongoose allows them to be optional so we don't force fake data into the database.
2. **What does `sparse: true` mean on `tracking_code`?**
   - **Answer**: It means "I want this field to be unique for every document, BUT it's okay if multiple documents don't have this field yet." If we didn't use `sparse`, MongoDB would crash if two users had a blank tracking code.
3. **Can an admin delete a pressing request?**
   - **Answer**: No. Just like Orders, we enforce the `is_archived: false` pattern. We hide them from view rather than deleting them, preserving the mill's historical records.

---

### 🎙️ Presentation Script
"The PressingRequest model is perhaps the most business-specific piece of logic in our backend. It digitizes the traditional olive milling workflow by accommodating both monetary and barter-based payment systems. By nesting yield statistics and scheduling dates within the schema, we've created a data structure that mirrors physical reality with absolute precision."
