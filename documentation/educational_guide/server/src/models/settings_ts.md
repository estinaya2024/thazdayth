# 📚 File: server/src/models/Settings.ts

### 🌟 GLOBAL OVERVIEW
The `Settings.ts` file acts as the **Global Variables Dashboard** for the business. Instead of hardcoding critical business numbers (like the percentage the mill keeps as payment) directly into the formulas, we store them in this single database document so the owner can change them at any time.

---

### 1. Role in the Project
It provides **Dynamic Configuration**. If the olive season is tough and the owner needs to raise the "percentage taken" from 30% to 35%, they use the Admin Dashboard, which updates this model.

### 2. Connection with Other Files
- **To `routes/settings.ts`**: The API routes allow the Admin to read and update this single document.
- **To `routes/pressing.ts`**: When calculating a new pressing request, the backend fetches this model to know exactly what percentage to charge the customer.

### 3. Code Breakdown & Step-by-Step Logic

#### A) The Single Setting
```typescript
export interface ISettings extends Document {
    pressing_percentage_taken: number;
    updated_at: Date;
}
```
- **WHAT?** Currently, this model only tracks one major setting: the `pressing_percentage_taken`.
- **WHY?** It's built this way so it can be easily expanded. If tomorrow the owner wants to add a `global_discount_percentage` or a `maintenance_mode` toggle, we just add it to this file.

#### B) The Default Value
```typescript
    pressing_percentage_taken: { type: Number, required: true, default: 30 },
```
- **WHAT?** If the database is completely empty and the app starts for the first time, it assumes the mill takes 30% of the oil produced as payment.

### 4. Syntax & Keywords Explained
- **Singleton Pattern**: Although not strictly enforced in this tiny file, the *logic* used in the routes (which we'll see later) treats this as a "Singleton." This means the database will only ever have exactly ONE document in the `settings` collection. Instead of creating new settings, the admin simply updates the single existing one.

---

### 🎓 Teacher's Q&A Section
1. **Why don't we just write `const percentage = 30;` in the code?**
   - **Answer**: Because if we hardcode it, the mill owner would have to call a programmer every time they want to change their prices! By storing it in the database, the owner can change it via a user-friendly web interface.
2. **Where is `created_at`?**
   - **Answer**: We only care about `updated_at`. Since there is only ever one Settings document that is constantly modified, knowing when it was originally created years ago isn't useful for business logic.

---

### 🎙️ Presentation Script
"The Settings model implements a dynamic configuration architecture. By extracting hardcoded business variables into a MongoDB document, we grant the administrator complete control over global parameters like the barter percentage fee, entirely removing the need for developer intervention during seasonal pricing adjustments."
