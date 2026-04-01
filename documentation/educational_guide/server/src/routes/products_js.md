# 📚 File: server/src/routes/products.js

### 🌟 GLOBAL OVERVIEW
The `products` endpoint manages the **Retail Storefront**. It connects the MongoDB `Product` model to the frontend `Boutique`, ensuring the site only shows available stock, while giving the Admin full CRUD (Create, Read, Update, Delete) control.

---

### 1. Role in the Project
It securely delivers product data to customers shopping online. Simultaneously, it prevents customers from magically adding new products to the database by heavily restricting the creation and deletion tools to the mill owner.

### 2. Connection with Other Files
- **To `Product.ts` (Model)**: Reads and writes the inventory data.
- **To `auth.ts` (Middleware)**: Uses `authenticate` and `ownerOnly` to protect the admin endpoints.
- **To `express-validator`**: Pre-cleans incoming data to prevent database errors.

### 3. Code Breakdown & Step-by-Step Logic

#### A) Getting the Products (Public)
```javascript
router.get('/', async (req, res) => {
    const products = await Product_1.Product.find({ is_available: true });
    res.json(products);
});
```
- **WHAT?** Anyone can view the products. 
- **WHY `is_available: true`?** We specifically filter the database. If the admin marked a special bottle of oil as "unavailable", this endpoint will completely hide it from the public JSON response so it never renders on the screen.

#### B) Creating a New Product (Admin Guarded)
```javascript
router.post('/', auth_1.authenticate, auth_1.ownerOnly, [
    body('name').notEmpty().withMessage('Le nom est requis'),
    body('category').isIn(['extra_virgin', 'virgin', ...]),
    body('price_per_liter').isNumeric(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const product = await Product_1.Product.create(req.body);
    res.status(201).json(product);
});
```
- **WHAT?** This is the ultimate "Triple Check" architecture.
    1. **Checkpoint 1 (Authentication)**: Are you logged in? (`authenticate`)
    2. **Checkpoint 2 (Authorization)**: Are you the boss? (`ownerOnly`)
    3. **Checkpoint 3 (Validation)**: Is the data structurally valid? (`express-validator`). It checks if the price is an actual number, and if the category matches one of the three allowed types.
- **WHY?** If we didn't have Checkpoint 3, a typo in the admin dashboard could crash the database or show "NaN DA" (Not a Number) to public customers.

#### C) Updating and Deleting (Admin Guarded)
```javascript
router.put('/:id', ... Product_1.Product.findByIdAndUpdate(req.params.id, req.body, { new: true }) );
router.delete('/:id', ... Product_1.Product.findByIdAndDelete(req.params.id) );
```
- **WHAT?** Standard Mongoose operations targeting a specific URL ID (e.g., `/api/products/12345`).

### 4. Syntax & Keywords Explained
- **CRUD Operations**: This file is a perfect example of CRUD:
    - **C**reate: `router.post()`
    - **R**ead: `router.get()`
    - **U**pdate: `router.put()`
    - **D**elete: `router.delete()`
- **`201` Status Code**: Used heavily after `Product.create()`. It specifically means "Created successfully," whereas `200` just means "OK."

---

### 🎓 Teacher's Q&A Section
1. **Can I use `PATCH` instead of `PUT` for updating a product?**
   - **Answer**: Yes! `PUT` implies replacing the whole object, while `PATCH` implies updating a small section. In Express/Mongoose, `findByIdAndUpdate` works fine for both, but `PATCH` would technically be more accurate if the admin only changed the price.
2. **If an admin deletes a product, what happens to old orders containing that product?**
   - **Answer**: Because of the `refPath` magic in our `Order.ts` schema, the text of the old order will survive, but Mongoose won't be able to ".populate()" the full product details anymore. This is why hiding (`is_available: false`) is generally preferred over standard CRUD deletion.

---

### 🎙️ Presentation Script
"The Products API embodies traditional RESTful design principles while enforcing strict validation pipelines. By combining Express-Validator logic with our core authentication middleware, we've created a bulletproof inventory administration system where the integrity of public catalog data is guaranteed before it ever reaches the MongoDB engine."
