# 📚 File: src/pages/MotDePasseOublie.tsx

### 🌟 GLOBAL OVERVIEW
The `MotDePasseOublie.tsx` file handles the **Password Recovery Flow**. It is a brilliantly designed, self-contained interactive state machine that guides a user through the notoriously frustrating two-step process of proving their identity via a 6-digit email code and establishing a new password.

---

### 1. Role in the Project
It is the **Security Recovery Agent**. Unlike Login or Registration which hit normal endpoints, this component interacts with the backend's highly strict cryptographic recovery endpoints (`/forgot-password` and `/reset-password`).

### 2. Connection with Other Files
- **To `AnimatePresence`**: It relies entirely on Framer Motion's unmount-animator to smoothly slide the Step 1 form out of the screen and slide the Step 2 form into the screen.
- **To `API_URL`**: It makes direct unauthenticated `POST` requests to the Thazdayth server. (It does not use `AuthContext` because the user is fundamentally not logged in yet!).

### 3. Code Breakdown & Step-by-Step Logic

#### A) The Two-Step State Machine
```tsx
const [step, setStep] = useState<"email" | "reset">("email");
```
- **WHAT?** This tiny line of code dictates the entire architecture of the file. It is a strict TypeScript union type. The page can *only* exist in two physical realities: the user is either defining their `"email"`, or they are typing the `"reset"` code.

#### B) Form Swapping via AnimatePresence
```tsx
<AnimatePresence mode="wait">
  {step === "email" ? (
      <motion.form key="email-form" exit={{ opacity: 0, x: 20 }}>
  ) : (
      <motion.form key="reset-form" initial={{ opacity: 0, x: -20 }}>
  )}
</AnimatePresence>
```
- **WHAT?** Normally in React, when `step` changes from `"email"` to `"reset"`, the first form instantly vanishes and the second form instantly violently pops in.
- **`AnimatePresence mode="wait"`**: This Framer Motion wrapper intercepts React's deletion process. It tells React: *"WAIT! Before you delete the Email form, let it run its `exit` animation (fading out and sliding 20px to the right)."* Once the exit animation fully finishes, it *then* allows the Reset form to mount and run its `initial` entrance animation.

#### C) Step 1: Requesting the Code
```tsx
const res = await fetch(`${API_URL}/auth/forgot-password`, {
    method: "POST",
    body: JSON.stringify({ email }),
});
```
- **WHAT?** The user types `ayaka@gmail.com` and clicks submit. We send this to the server. The server generates a random 6-digit code (e.g., `489112`), saves it to Ayaka's database file, and sends the literal email via Brevo/Nodemailer. If the server says "OK", we flip `setStep("reset")`.

#### D) Step 2: The Cryptographic Reset
```tsx
const res = await fetch(`${API_URL}/auth/reset-password`, {
    method: "POST",
    body: JSON.stringify({ email, code, newPassword }),
});
if (res.ok) navigate("/connexion");
```
- **WHAT?** The user now has their phone in hand, reading the email. They type `489112` and their new password. We bundle all three puzzle pieces (`email`, `code`, `newPassword`) and send it to the server. If the server verifies the code matches the database precisely, it encrypts the new password, saves it, and the frontend instantly kicks the user over to the `Connexion` (Login) page!

### 4. Syntax & Keywords Explained
- **`maxLength={6}`**: Used on the Code input box. A native HTML attribute that physically prevents the user's keyboard from typing a 7th character, perfectly enforcing the 6-digit requirement of our security code system.

---

### 🎓 Teacher's Q&A Section
1. **Why do we need to send the `email` again in Step 2? We already sent it in Step 1!**
   - **Answer**: The HTTP protocol is "Stateless". When you make the first `fetch` to ask for the code, the Express server instantly forgets who you are the millisecond the request finishes. When you make the second `fetch` with the 6-digit code, the server has no idea whose code you are trying to verify unless you explicitly provide the email again!
2. **If the user types the wrong code 10 times, what happens?**
   - **Answer**: The frontend `fetch` will return `!res.ok`. The `try/catch` block will intercept the backend's security error ("Code invalide"), spawn a red Toast notification, and safely abort the function, leaving `step` exactly as it is so the user can try again.

---

### 🎙️ Presentation Script
"For the Password Recovery module, I architected a strict, dual-stage localized state machine. Instead of building two separate URLs for requesting the code versus entering the code, I utilized Framer Motion's `AnimatePresence` with `mode='wait'` to seamlessly unmount and remount disparate form components within the exact same view. This provides a highly fluid app-like experience while coordinating complex cryptographic verification with our stateless backend."
