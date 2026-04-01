# 📚 File: server/src/middleware/auth.ts

### 🌟 GLOBAL OVERVIEW
The `auth.ts` middleware is the **Security Checkpoint** for our API routes. After a user logs in and receives their JWT (ticket), they must attach that ticket to every future request they make. This file is the code that checks the ticket at the door to see if it's real, and if they have VIP access (Owner role).

---

### 1. Role in the Project
It protects private API endpoints. By placing this middleware in front of a route (e.g., deleting a comment, viewing order history), we guarantee that anonymous or fake users cannot access the data.

### 2. Connection with Other Files
- **To `jsonwebtoken`**: Uses this library to mathematically verify the token against our secret key.
- **To All Routes**: This is imported into almost every file in the `routes/` folder (Orders, Settings, Pressing, etc.) to enforce security.

### 3. Code Breakdown & Step-by-Step Logic

#### A) Extending the Request Interface
```typescript
export interface AuthRequest extends Request {
    user?: {
        id: string;
        role: 'customer' | 'owner';
    };
}
```
- **WHAT?** We extend the standard Express `Request` object. 
- **WHY?** Normally, an Express Request doesn't know what a `user` is. By telling TypeScript we are adding a `user` property, we can attach the user's ID to the request safely, allowing the next function to know *who* is making the request.

#### B) The `authenticate` Checkpoint
```typescript
export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) { ... return 401 }
...
```
- **WHAT?** It looks inside the `Headers` of the incoming HTTP request. Standard convention dictates that tokens are sent in a header called `Authorization` and the value starts with the word `Bearer `.
- **WHY?** If it's missing, it immediately replies with a `401 Unauthorized` and stops the request dead in its tracks.

#### C) Verifying and Attaching
```typescript
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as ...;
        req.user = decoded;
        next();
    } catch (err) { ... return 401 }
```
- **WHAT?** We extract the actual token (removing the "Bearer " part). We use `jwt.verify` to check the signature against our `JWT_SECRET`. 
- If it's real, we take the decoded payload (their ID and Role) and attach it to `req.user`.
- Then we call `next()`, which tells Express: "This user is legitimate. You may proceed to the actual route logic."

#### D) The `ownerOnly` VIP Check
```typescript
export const ownerOnly = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user?.role !== 'owner') {
        res.status(403).json({ message: 'Accès réservé au propriétaire.' });
        return;
    }
    next();
};
```
- **WHAT?** This is a *second* checkpoint. First, the user must pass `authenticate`. If they pass, they might hit this checkpoint (e.g., trying to change the price of olive oil). 
- If their role is 'customer', it sends a `403 Forbidden` error. They are logged in, but not authorized for this specific action.

### 4. Syntax & Keywords Explained
- **`NextFunction` / `next()`**: In Express middleware, `next()` is like a green light. If you don't call it, the request gets stuck forever. You either call `next()` to move forward, or you send a `res.status(...)` to stop it.
- **`401` vs `403`**: 
    - `401 Unauthorized` means "I don't know who you are (No Token or Bad Token)."
    - `403 Forbidden` means "I know who you are, but you don't have permission to do this (Customer trying to act like an Owner)."

---

### 🎓 Teacher's Q&A Section
1. **Why is it called 'Bearer' token?**
   - **Answer**: It means "Give access to the bearer (holder) of this token." It's an internet standard (RFC 6750) for passing OAuth & JWT tokens.
2. **Why do we use a `try...catch` block in `jwt.verify`?**
   - **Answer**: Because if the token is fake, has been tampered with, or has expired, `jwt.verify` literally "throws" an error and crashes the script. The `try/catch` elegantly catches the crash and sends a polite error message back to the user instead of breaking the server.
3. **How does the Route know the ID of the user creating an order?**
   - **Answer**: Because this middleware successfully ran! It decrypted the token and attached `req.user = { id: ... }`. By the time the code reaches the Order route, the Order route just reads `req.user.id` to save the order to the correct account, preventing users from forging orders for other people.

#### 🔥 The Tricky Question:
*   "If someone steals a user's JWT token, can they pretend to be them?"
    - **Answer**: Yes. A JWT is like a digital hotel keycard. If someone steals it, the door will open for them. This is why we use HTTPS (to prevent stealing the token during transit) and set token expiration dates (so if it's stolen, it becomes useless quickly).

---

### 🎙️ Presentation Script
"Our backend authorization utilizes a robust middleware architecture. By extracting the JWT verification into a reusable 'authenticate' middleware function, we ensure consistent and centralized security across all private API endpoints. Furthermore, we implement Role-Based Access Control (RBAC) via the 'ownerOnly' middleware, strictly separating standard customer privileges from administrative dashboard capabilities."
