# 📚 File: server/src/models/PressingService.ts

### 🌟 GLOBAL OVERVIEW
The `PressingService.ts` file acts as the **Price List** for the mill's services. Before a customer can submit a `PressingRequest`, the website needs to know exactly what services the mill offers and how much they cost.

---

### 1. Role in the Project
It provides the **Configurable Options** for the frontend form. Instead of hardcoding "Extra Virgin Pressing = 20 DA/kg" into the website HTML, we store it here. This allows the mill owner to change their prices or add new services anytime via the Admin Dashboard.

### 2. Connection with Other Files
- **To `PressingRequest.ts` (Model)**: A customer's request is based on the prices found in this table.
- **To `routes/pressing.ts`**: The API routes allow the dashboard to fetch this active list of services to display on the "Services" page of the site.

### 3. Code Breakdown & Step-by-Step Logic

#### A) The Service Core
```typescript
export interface IPressingService extends Document {
    name: string;
    category: 'extra_virgin' | 'virgin' | 'third_quality';
    fee: number;
    yield_per_kg: number;
    active: boolean;
}
```
- **WHAT?** This is the TypeScript interface protecting the data. A service needs a `name` ("Premium Cold Press"), a `category` (what kind of oil it makes), a `fee` (price per kg), and an estimated `yield_per_kg` (how much oil the customer can expect).

#### B) Enforcing Rules (Schema)
```typescript
const PressingServiceSchema = new Schema<IPressingService>({
    name: { type: String, required: true, unique: true, trim: true },
    category: { 
        type: String, 
        required: true, 
        enum: ['extra_virgin', 'virgin', 'third_quality'] 
    },
    fee: { type: Number, required: true },
    ...
```
- **TRIM**: We use `trim: true` on the `name` to prevent annoying styling bugs if the admin accidentally includes a space at the end of the service name (e.g., "Standard Press ").
- **UNIQUE**: `unique: true` guarantees the administrator cannot accidentally create two services with the exact same name.

#### C) Display Toggle
```typescript
    active: { type: Boolean, default: true },
```
- **WHY?** If the mill decides to stop offering "Cold Pressing" for a month, they shouldn't delete the service from the database (which might crash older receipts). Instead, they switch `active` to `false`, which simply hides it from the public website.

### 4. Syntax & Keywords Explained
- **`enum`**: We lock the `category` to three specific strings. The database will completely reject any attempt to save a service categorized as "super_virgin" or "bad_quality".
- **`default: 0.2`**: If the admin creates a new service and forgets to enter an estimated yield, the database automatically assumes the yield is 20% (0.2 liters per kg of olives).

---

### 🎓 Teacher's Q&A Section
1. **Why do we store the `yield_per_kg` estimation here instead of calculating it on the frontend?**
   - **Answer**: The frontend should be purely visual. Business logic (like estimations) belongs in the backend. This guarantees that whether a user is using an iPhone app or the web app, they see the exact same database-driven estimation.
2. **What happens if the Admin changes the `fee` from 20 to 30?**
   - **Answer**: Any *new* pressing requests will cost 30. Any *old* pressing requests will still cost 20, because the `PressingRequest` model captures a "Snapshot" of the price at the time of the transaction!
3. **Why do we use `trim: true`?**
   - **Answer**: Data sanitization. Extra spaces can break URL routing or cause search functions to fail. Mongoose's `trim` cleans the data automatically before it's saved.

---

### 🎙️ Presentation Script
"The PressingService model is an excellent example of robust business configuration. By combining strict uniqueness strings with boolean visibility toggles, we provide the mill administrator full control over their service offerings without risking the integrity of historical transactions. It demonstrates a clear separation of concerns, keeping business logic on the server and purely display logic on the client."
