# 📚 File: server/src/routes/auth.ts

### 🌟 GLOBAL OVERVIEW
The `auth.ts` file acts as the **Identity Verification Center**. Its primary job is to handle Registration (creating new users), Login (checking passwords), Google OAuth, and Password Resetting.

---

### 1. Role in the Project
It validates user credentials and issues **Tickets** (called JWTs - JSON Web Tokens). When a user logs in successfully, the server gives them a JWT. The user uses this ticket to access private parts of the app later (like viewing their orders).

### 2. Connection with Other Files
- **To `User.ts` (Model)**: It uses the User model to search the database (`User.findOne`) or save new data (`User.create`).
- **To `index.ts`**: It gets imported there to be attached to the `/api/auth` URL path.
- **To `sendEmail.ts`**: Uses this utility to send the 6-digit password reset code.

### 3. Code Breakdown & Step-by-Step Logic

#### A) Route Validation Middleware
```typescript
router.post('/register', [
    body('email').isEmail().withMessage('Email invalide'),
    body('password').isLength({ min: 6 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
...
```
- **WHAT?** Before even looking at the database, we use `express-validator`. It checks the incoming JSON data. If the email is missing an `@`, it stops immediately and replies with status `400` (Bad Request).
- **WHY?** It saves server resources. We don't want to bother the database if the user forgot their password!

#### B) Password Hashing (Security)
```typescript
const hashed = await bcrypt.hash(password, 12);
const user = await User.create({ ..., password: hashed });
```
- **WHAT?** We NEVER save the real password (e.g., "admin123"). `bcrypt.hash` scrambles it into a complex string (e.g., `$2a$12$Dq...`). The `12` is the "Salt Rounds," meaning it scrambles it 12 times to make it extremely hard for hackers to crack.

#### C) Generating the JWT (The Ticket)
```typescript
const token = jwt.sign(
    { id: user._id, role: user.role, is_subscribed: user.is_subscribed },
    process.env.JWT_SECRET as string,
    { expiresIn: '7d' }
);
```
- **WHAT?** After a successful login or signup, we create a JSON Web Token. 
- We put the user's `id` and `role` inside the token (the "Payload"). 
- We sign it using a secret password (`JWT_SECRET`) so nobody can fake a token.
- It lasts for `7d` (7 days), after which the user will be forced to log in again.

#### D) Google Login Logic
```typescript
const ticket = await googleClient.verifyIdToken({ idToken: credential, ... });
const payload = ticket.getPayload();
let user = await User.findOne({ email: payload.email });
// If not found -> create user with a random password!
```
- **WHAT?** The frontend gives us a token from Google. Our server double-checks with Google (`verifyIdToken`) to make sure it's real. If the person has never logged in before, we automatically create a new account for them so they experience zero friction.

### 4. Syntax & Keywords Explained
- **`Router`**: An Express feature that lets us split our URLs into different files instead of putting everything in `index.ts`.
- **`async / await`**: Database operations take time (milliseconds). `await` tells the code: "Pause here until the database gives us the answer, then continue."
- **`res.status(401)`**: The server's reply code. `401` means "Unauthorized" (wrong password). `201` means "Created" (successful registration). `500` means "Server Error" (something broke on our end).

---

### 🎓 Teacher's Q&A Section
1. **Why do we use JWTs instead of "Sessions"?**
   - **Answer**: JWTs are "Stateless." The server doesn't have to remember who is logged in; it just mathematically verifies the signature on the token. This makes the server run much faster and scale to millions of users easily.
2. **How does `bcrypt.compare` work when the user logs in?**
   - **Answer**: Since the password is mathematically scrambled, you can't "unscramble" it to read it. `bcrypt.compare` takes the password the user typed, scrambles it the exact same way, and checks if the two scrambled versions match!
3. **If the JWT contains the user's ID and Role, can a hacker read it?**
   - **Answer**: Yes. A JWT is Base64 encoded, not encrypted. Anyone can decode and read the contents. **HOWEVER**, they cannot *modify* it. If they try to change their role to "owner", the mathematical signature will break, and our server will reject it because they don't have our Server's `JWT_SECRET`. We only store non-sensitive info (ID, Role) in the token, never passwords or credit cards.

#### 🔥 The Tricky Question:
*   "Why do we enforce `role: 'customer'` during registration, even if the user sends `role: 'owner'` in their JSON?"
    - **Answer**: Privilege Escalation Prevention! If we just took what the user sent us, a smart hacker could send `{"role": "owner"}` and instantly gain admin access. We ignore whatever they send and hardcode it to 'customer' upon public registration.

---

### 🎙️ Presentation Script
"Our authentication architecture is designed around security and stateless scalability. We utilize 'Bcrypt' for impenetrable password hashing and JSON Web Tokens (JWT) for secure session management. We've also integrated a robust middleware validation pipeline using 'express-validator' to sanitize requests before they ever reach our MongoDB instance, protecting the system from malformed data and injection attempts."
