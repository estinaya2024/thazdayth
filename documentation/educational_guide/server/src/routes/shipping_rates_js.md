# 📚 File: server/src/routes/shippingRates.js

### 🌟 GLOBAL OVERVIEW
The `shippingRates` route manages the **Delivery Network Prices**. It provides the APIs to read how much it costs to ship olive oil to Oran versus Tizi Ouzou, and enables the admin to update those prices based on current logistical costs.

---

### 1. Role in the Project
It is heavily used during the Checkout process (`Boutique.tsx`). When a user selects a wilaya from the dropdown, the frontend checks the data provided by this route to instantly calculate the total shipping cost.

### 2. Connection with Other Files
- **To `ShippingRate.ts` (Model)**: Executes queries against the shipping rates table.

### 3. Code Breakdown & Step-by-Step Logic

#### A) Getting the Rates
```javascript
router.get('/', async (req, res) => {
    const rates = await ShippingRate_1.ShippingRate.find().sort({ wilaya_code: 1 });
    res.json(rates);
});
```
- **WHAT?** A public `GET` request. 
- **WHY?** We add `.sort({ wilaya_code: 1 })`. This tells the database to sort the list ascending (from 1 to 58) based on the wilaya code (1 for Adrar, 16 for Algiers, etc.). This ensures the dropdown list on the frontend is always in perfect numerical/alphabetical order, creating a predictable user experience.

#### B) Updating a Single Rate
```javascript
router.put('/:wilaya', auth_1.authenticate, auth_1.ownerOnly, async (req, res) => {
    const rate = await ShippingRate_1.ShippingRate.findOneAndUpdate(
        { wilaya: req.params.wilaya }, 
        { price: req.body.price }, 
        { new: true }
    );
    if (!rate) return res.status(404).json({ message: 'Wilaya introuvable.' });
    res.json(rate);
});
```
- **WHAT?** An admin-only `PUT` request targeting a specific location, like `/api/shipping-rates/Alger`.
- **WHY?** 
    - It finds the specific wilaya using the URL param.
    - It updates ONLY the `price` field based on what the admin sent.
    - `{ new: true }` guarantees that the server responds with the freshly updated data, not the old outdated data.

### 4. Syntax & Keywords Explained
- **`sort({ wilaya_code: 1 })`**: In MongoDB sorting, `1` means ascending (A-Z, 0-9), and `-1` means descending (Z-A, 9-0).
- **`{ new: true }`**: By default, Mongoose's `findOneAndUpdate` command returns the document *before* it was updated. Adding this flag tells it to return the document *after* the update, which is what the frontend usually wants to display.

---

### 🎓 Teacher's Q&A Section
1. **Can the admin add new Wilayas through this route?**
   - **Answer**: Based on this specific code, no. We only have a `PUT` request for *existing* wilayas. If we wanted to add missing wilayas, we would need to construct a `POST` route. (Currently, Wilayas are likely pre-seeded into the database using a `seed.ts` script since there are exactly 58 of them).
2. **Why don't we block public access to the shipping rates?**
   - **Answer**: Because any customer attempting checkout needs to know the price! Delivery costs are public information, so securing it behind an `authenticate` middleware would break the cart for guests.

---

### 🎙️ Presentation Script
"The Shipping Rates API endpoints provide an optimized, numerically-sorted catalog of logistical costs. By strategically exposing the read endpoints to the public while locking the modification endpoints behind our owner-only middleware, we securely decouple static frontend rendering from dynamic backend pricing models."
