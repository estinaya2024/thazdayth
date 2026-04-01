# 📚 File: server/src/routes/users.ts

### 🌟 GLOBAL OVERVIEW
The `users.ts` route file is the **Admin Intercom**. It provides the endpoints needed for the mill owner (the Admin) to view their customer list and manage user access (like blocking bad actors).

---

### 1. Role in the Project
It securely delivers user data to the frontend Dashboard's "Clients" tab. It ensures that standard customers cannot access the personal information of other customers.

### 2. Connection with Other Files
- **To `User.ts` (Model)**: Queries the database to find users (`User.find()`).
- **To `auth.ts` (Middleware)**: Uses `authenticate` and `ownerOnly` to build an impenetrable wall around these endpoints.

### 3. Code Breakdown & Step-by-Step Logic

#### A) Fetching the Customer List
```typescript
router.get('/', authenticate, ownerOnly, async (req, res) => {
    const users = await User.find({ role: 'customer' })
        .select('first_name last_name email phone address is_blacklisted created_at')
        .sort({ created_at: -1 });
    res.json(users);
});
```
- **WHAT?** This is a `GET` request. Notice the two bodyguards: `authenticate` (you must be logged in) and `ownerOnly` (you must be the admin). 
- **`User.find({ role: 'customer' })`**: We explicitly exclude other admins from this list, so the owner only sees their clients.
- **`select(...)`**: This is a massive security feature! Even though the User model has a `password`, we use `.select()` to tell Mongoose: "Only fetch these specific safe fields from the database. Do NOT fetch the password."
- **`sort({ created_at: -1 })`**: Returns the list with the newest customers at the top.

#### B) Toggling the Blacklist
```typescript
router.patch('/:id/blacklist', authenticate, ownerOnly, async (req, res) => {
    const user = await User.findById(req.params.id);
    user.is_blacklisted = !user.is_blacklisted;
    await user.save();
    res.json({ message: ... });
});
```
- **WHAT?** This is a `PATCH` request (used for updating small parts of data). 
- **WHY?** If a customer repeatedly makes fake orders, the admin clicks a button on the Dashboard. This route finds that specific user by their ID (`req.params.id`) and flips their blacklist status. `!user.is_blacklisted` means "If it's true, make it false. If it's false, make it true."

### 4. Syntax & Keywords Explained
- **`req.params.id`**: When a URL looks like `/api/users/12345/blacklist`, Express automatically takes the `12345` part and puts it into the `req.params.id` variable.

---

### 🎓 Teacher's Q&A Section
1. **Why is password exclusion (`.select`) so important here?**
   - **Answer**: If we accidentally sent the hashed passwords to the frontend, a malicious admin (or someone who hacked the admin account) could download all the hashes and attempt to crack them offline. It's a fundamental principle of "Least Privilege Data Exposure."
2. **What happens if a standard user tries to send a `PATCH` request to the blacklist URL using Postman?**
   - **Answer**: The request will hit the `ownerOnly` middleware function first. The function will see their token says `role: 'customer'`, and it will instantly reject the request with a `403 Forbidden` error without ever running the Blacklist code.

---

### 🎙️ Presentation Script
"The 'users' route demonstrates strict Role-Based Access Control and data sanitization. By chaining our 'ownerOnly' middleware directly onto the endpoints and utilizing Mongoose projection (`.select`) to forcefully strip out sensitive fields like passwords, we guarantee that the administrative dashboard remains both powerful and highly secure."
