# 📚 File: server/src/routes/pressing.js

### 🌟 GLOBAL OVERVIEW
The `pressing.js` route file is the **Digital Mill Schedule**. It mirrors the `orders.js` architecture but handles the unique physical reality of customers bringing raw olives to be pressed, estimating yields, and managing appointments.

---

### 1. Role in the Project
It powers the "Presser Mes Olives" form and the tracking dashboard. It validates the user's harvest input, records their preferred payment technique (cash vs. barter), and facilitates scheduling the drop-off dates with the mill owner.

### 2. Connection with Other Files
- **To `PressingRequest.ts`**: Writes the service contracts to the database.
- **To `Notification.ts` & `sendEmail.ts`**: Provides real-time updates to users as their olives are processed.

### 3. Code Breakdown & Step-by-Step Logic

#### A) Submission Validation (Public Facing)
```javascript
router.post('/', auth_1.authenticate, [
    body('olive_quantity_kg').isNumeric().withMessage('Quantité invalide'),
    // ...
], async (req, res) => {
    // Business Rule
    if (olive_quantity_kg < 50) {
        return res.status(400).json({ message: 'La quantité minimale est de 50 kg.' });
    }
```
- **WHAT?** We execute standard `express-validator` checks, but then we execute a custom Business Rule check block. 
- **WHY?** Olive mills require heavy machinery. Turning on the machines for 5kg of olives wastes electricity and water. We enforce a strict backend 50kg limit. Even if a hacker bypasses the frontend form limits, the server will firmly reject the request.

#### B) Processing the Data Object
```javascript
    const request = await PressingRequest_1.PressingRequest.create({
        user_id: req.user.id,
        olive_quantity_kg,
        oil_quality,
        yield: {
            liters_per_kg: yieldData.liters_per_kg,
            produced_oil_liters: yieldData.produced_oil_liters,
        },
        payment: { type: payment.type, ... }
        // ...
    });
```
- **WHAT?** We construct the complex, nested Mongoose document based on what the frontend Calculator generated (e.g., embedding the `yield` and `payment` choices).

#### C) Setting Appointments
```javascript
router.patch('/:id/appointment', auth_1.authenticate, auth_1.ownerOnly, [ ... ], async (req, res) => {
    const updateFields = {};
    if (req.body.bring_olives_date)
        updateFields.bring_olives_date = new Date(req.body.bring_olives_date);
    // ...
    const request = await PressingRequest_1.PressingRequest.findByIdAndUpdate(req.params.id, updateFields, { new: true });
});
```
- **WHAT?** This is an advanced `PATCH` endpoint that strictly handles dates.
- **WHY?** The owner uses a calendar interface on their dashboard to select when the customer should come. We conditionally build the `updateFields` object so that if the owner only wants to set the `collect_oil_date`, they don't accidentally erase the `bring_olives_date`.

### 4. Syntax & Keywords Explained
- **`Dates` in APIs**: The frontend usually sends dates as "ISO Strings" (e.g., `"2025-11-20T10:00:00.000Z"`). The backend uses `new Date(req.body.bring_olives_date)` to parse that text string back into a real JavaScript Date Object before handing it to MongoDB.

---

### 🎓 Teacher's Q&A Section
1. **Can customers cancel a pressing request like they can an order?**
   - **Answer**: Based on this API implementation, the customer cannot *self-cancel* via a route. Because pressing involves physical scheduling and machinery preparation, cancellations usually require a manual phone call, after which the Admin uses the dashboard to mark it as `rejected` or `archived`.
2. **Why is the 50kg limit hardcoded instead of being in the `Settings.ts` database?**
   - **Answer**: Purely for architectural simplicity in this MVP version. In a V2 release, moving that "50" into `Settings.ts` would be perfect so the owner could dynamically lower it to 30kg during a poor harvest season!

---

### 🎙️ Presentation Script
"The Pressing API endpoint translates physical agricultural workflows into digital logic. A key highlight is the strict enforcement of backend Business Logic over UI logic—by enforcing minimum weight limits explicitly on the server, we protect the business from unprofitable edge-cases regardless of how the API is consumed."
