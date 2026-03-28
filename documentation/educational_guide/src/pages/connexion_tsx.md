# 📚 File: src/pages/Connexion.tsx

### 🌟 GLOBAL OVERVIEW
The `Connexion.tsx` file handles the **Authentication Entryway**. It provides the user interface for logging into the application, securely wrapping two distinct flows: traditional Email/Password authentication, and third-party Google OAuth 2.0 integration.

---

### 1. Role in the Project
It is the **Gatekeeper Form**. It captures user credentials, runs simple frontend validation (empty field checking), and delegates the heavy lifting to our global `AuthContext`.

### 2. Connection with Other Files
- **To `AuthContext.tsx`**: It explicitly imports and calls the `login()` and `googleLogin()` functions defined in the global context.
- **To `react-router-dom`**: Uses URL queries to redirect the user back to where they came from after a successful login.

### 3. Code Breakdown & Step-by-Step Logic

#### A) URL Redirect Logic
```tsx
const [searchParams] = useSearchParams();
// ... inside success block:
const redirect = searchParams.get("redirect") || "/boutique";
navigate(redirect, { replace: true });
```
- **WHAT?** Imagine a user clicks "Suivi" but isn't logged in. The app redirects them to `/connexion?redirect=/suivi`.
- When the login successfully finishes, `searchParams.get("redirect")` remembers that the user originally wanted to go to `/suivi`, and flawlessly sends them there instead of lazily dumping them on the homepage.
- **`replace: true`**: Normally, `navigate()` adds a new page to the browser history. By using `replace`, we overwrite the current history state. If the user clicks the "Back" button on their browser after logging in, they won't accidentally be sent back to the Login screen!

#### B) Google Authentication Integration
```tsx
<GoogleLogin
  onSuccess={handleGoogleSuccess}
  onError={() => toast({ title: "Erreur", variant: "destructive" })}
  useOneTap
/>
```
- **WHAT?** Utilizing the `@react-oauth/google` library, this spawns the official "Sign in with Google" button.
- **`useOneTap`**: A massive UX upgrade. Instead of requiring the user to explicitly click the button, this instructs Google to slide a small, beautiful "Continue as Ayaka" popup into the top right corner of the browser automatically.

#### C) Floating UI Labels (Tailwind Magic)
```tsx
<input className="peer w-full pt-6 pb-2 ..." placeholder=" " />
<label className="absolute top-2 transition-all peer-placeholder-shown:top-4 peer-focus:top-2">
  Email
</label>
```
- **WHAT?** Look closely at the login inputs. When empty, the word "Email" sits perfectly in the center. The moment you click it, the word cleanly slides up and shrinks dynamically into the top corner.
- **How it works**: This is purely CSS (zero JavaScript!). We use Tailwind's `peer` system. The `<label>` physically watches the `<input>` sibling. If the input's placeholder is currently shown (meaning the input is empty), the label positions itself in the middle (`peer-placeholder-shown:top-4`). If the input is in focus, the label forces itself to the top (`peer-focus:top-2`). It's a hallmark of high-end design (Google Material Design).

### 4. Syntax & Keywords Explained
- **`import { Eye, EyeOff } from "lucide-react"`**: Standard SVG icon imports. We rapidly swap between the `Eye` and `EyeOff` icons based on the boolean `showPass` state variable to implement the "Show Password" button logic.

---

### 🎓 Teacher's Q&A Section
1. **Why is the `login()` function trapped in a `try/catch` block here?**
   - **Answer**: The global `login` function inside `AuthContext` makes the actual network request. If the user typing the wrong password causes the Express server to return a `401 Unauthorized` error, the `login` function deliberately `throw`s an Error. This `catch(err)` block specifically catches that thrown error, preventing the browser from red-screening, and instead translates it into a beautiful red Toast notification.
2. **What does the `credentialResponse.credential` from Google contain?**
   - **Answer**: It is a massively long JSON Web Token (JWT) perfectly cryptographically generated and signed by Google's servers. Our `googleLogin` function sends this exact token straight to our Express backend, where the Node server verifies Google's signature, securely bypassing the need for a password.

---

### 🎙️ Presentation Script
"The `Connexion` component acts as the unified orchestration layer for application access. It delegates the actual network authentication logic outwards to our global `AuthContext`, significantly simplifying testing of the UI shell. A critical UX feature implemented here is the automated URL-redirect engine, alongside the `useOneTap` Google OAuth integration, ensuring that unauthenticated users attempting to access protected routes experience near-zero friction when fulfilling their login requirement."
