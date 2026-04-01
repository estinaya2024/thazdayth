# 📚 File: server/src/routes/prices.js

### 🌟 GLOBAL OVERVIEW
The `prices` endpoint manages two distinct lists: **Olive Categories (Bulk Tanks)** and **Pressing Services (Mill Operations)**. It provides public reading access for the calculator and shopping pages, whilst maintaining strict admin controls for modifying prices.

---

### 1. Role in the Project
It is the central nervous system for **Cost Calculations**. Whenever the frontend needs to render the cost of pure milling, or the retail price of 50 Liters of bulk Virgin Oil, it calls this file.

### 2. Connection with Other Files
- **To `OliveCategory.ts` & `PressingService.ts`**: Modifies two different database models from one unified route file.
- **To `express-validator`**: Pre-cleans incoming pricing updates.

### 3. Code Breakdown & Step-by-Step Logic

#### A) Route Grouping
```javascript
// --- Olive Categories ---
router.get('/olives', ...);
router.post('/olives', ...);
router.patch('/olives/:id', ...);

// --- Pressing Services ---
router.get('/pressing', ...);
router.post('/pressing', ...);
```
- **WHAT?** Because `OliveCategory` and `PressingService` are conceptually very similar (they are both lists of prices the mill offers), they are grouped into the same API file (`/api/prices/...`). This makes the codebase cleaner than having 50 different route files. 

#### B) Error Handling for Unique Constraints
```javascript
    catch (error) {
        if (error.code === 11000) {
            res.status(400).json({ message: 'Cette catégorie existe déjà.' });
            return;
        }
        res.status(500).json({ message: 'Erreur serveur.' });
    }
```
- **WHAT?** A very specific error catcher trap!
- **WHY?** In our Mongoose Models, we used `unique: true` for the name of the service. If the Admin tries to create a duplicate "Cold Press", Mongoose will crash and throw an error with the code `11000`. By explicitly catching `error.code === 11000`, we can send a custom, polite French error message to the Dashboard instead of a scary "Internal Server Error".

#### C) PATCH Partial Updates
```javascript
router.patch('/olives/:id', auth_1.authenticate, auth_1.ownerOnly, [
    body('name').optional().notEmpty(),
    body('price_per_liter').optional().isNumeric(),
], async (req, res) => { ... });
```
- **WHAT?** Notice the use of `.optional()`. 
- **WHY?** Since this is a `PATCH` request, the Admin might only want to change the price, leaving the name out of the request completely. `.optional()` tells the validator: "If this data is provided, verify it. If it's missing entirely, that's perfectly fine."

### 4. Syntax & Keywords Explained
- **Error Code `11000`**: This is MongoDB's global error code for "Duplicate Key Violation." If you see this, you broke a `unique` rule.
- **`.optional()`**: A chainable command in `express-validator` used specifically for partial updates.

---

### 🎓 Teacher's Q&A Section
1. **Why do we group `/olives` and `/pressing` here instead of having `oliveRoutes.ts` and `pressingRoutes.ts`?**
   - **Answer**: It’s subjective, but grouping them under `prices.ts` logically centralizes the administration of "Costs" for the mill owner. The dashboard likely has a "Manage Pricing" tab that hits both of these endpoints.
2. **What if the admin sets `active: false` on a Pressing Service?**
   - **Answer**: The public `router.get('/pressing')` explicitly queries `PressingService.find({ active: true })`. Therefore, an inactive service immediately vanishes from the frontend service list and cannot be selected by new customers.

---

### 🎙️ Presentation Script
"Our Prices API consolidates two structurally similar entity types—Bulk Olive Categories and Service Fees—into a single modular router. Not only does this utilize advanced partial validation via optional validator chaining for 'PATCH' requests, but it also demonstrates precise MongoDB error interception by cleanly handling the '11000' duplicate key violation to provide superior User Experience on the admin dashboard."
