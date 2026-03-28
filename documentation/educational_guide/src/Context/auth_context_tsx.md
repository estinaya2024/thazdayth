# 📚 File: src/Context/AuthContext.tsx

### 🌟 GLOBAL OVERVIEW
The `AuthContext.tsx` file is the **Frontend Security Vault**. It uses React's Context API to manage the user's login state globally. Instead of passing "isLoggedIn" variables through 50 different components manually, this file makes the user's data available instantly to any component across the entire app.

---

### 1. Role in the Project
It completely controls the **Authentication Lifecycle** in the browser. It handles logging in, registering, parsing the backend's JWT tokens, and saving those tokens into the browser's `localStorage` so the user doesn't get logged out if they refresh the page.

### 2. Connection with Other Files
- **To All Protected Pages**: Every private page (like `Dashboard.tsx` or `Suivi.tsx`) imports `useAuth()` to check if the user is allowed to be there.
- **To `Navbar.tsx`**: Uses `useAuth()` to decide whether to show the "Connexion" button or the "Deconnexion" button.
- **To `server/src/routes/auth.ts`**: The JavaScript `fetch()` calls in this file talk directly to our backend auth API.

### 3. Code Breakdown & Step-by-Step Logic

#### A) Creating the Context
```typescript
const AuthContext = createContext<AuthContextType | undefined>(undefined);
```
- **WHAT?** This is the foundation. We create an empty "bubble" (Context). Any component placed inside this bubble will have access to the authentication data.

#### B) The Provider Component (`AuthProvider`)
```typescript
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [token, setToken] = useState<string | null>(null);
    // ...
```
- **WHAT?** This is the actual React component that manages the bubble. We will wrap our `<App />` inside this `<AuthProvider>` so the whole app is inside the bubble.
- It uses standard React `useState` to remember who the user is and what their token is.

#### C) Session Restoration (The `useEffect`)
```typescript
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);
```
- **WHAT?** The empty array `[]` means "Run this once exactly when the website finishes loading."
- **WHY?** HTTP is stateless. If the user hits F5 (refresh), React forgets all its `useState` variables! This code rushes to the browser's permanent memory (`localStorage`), searches for the saved token, and forcefully pushes it back into React's memory so the user stays logged in seamlessly.

#### D) The Login Function
```typescript
    const login = useCallback(async (email: string, password: string) => {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        // ...
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('token', data.token); // Save locally!
    }, []);
```
- **WHAT?** This is the bridge to the backend. It takes the email/password from the Login form, sends them to the Node.js API, waits for the reply, and if successful, saves the resulting JWT token to the browser.
- **`useCallback`**: An advanced React hook. It prevents React from recreating this function perfectly from scratch every time the page updates, saving CPU cycles.

### 4. Syntax & Keywords Explained
- **`JSON.parse()` / `JSON.stringify()`**: The browser's `localStorage` can ONLY save raw text (Strings). Since our `user` is a complex object `{ first_name: "Ali", role: "customer" }`, we must `stringify` it into text to save it, and `parse` it back into an Object when we read it.

---

### 🎓 Teacher's Q&A Section
1. **Why does `useAuth` throw an Error if `!ctx`?**
   - **Answer**: Security and Developer Experience. If a developer forgets to wrap a component inside the `<AuthProvider>`, the `ctx` will be undefined. Throwing an explicit error loudly warns the programmer that they are using the hook wrong.
2. **Is storing a JWT in `localStorage` completely secure?**
   - **Answer**: It is standard for Single Page Applications, but it is vulnerable to XSS (Cross-Site Scripting) attacks where a malicious script could read the memory. For ultra-high security apps (like banking), we would use "HttpOnly Cookies" instead.

---

### 🎙️ Presentation Script
"Our frontend authentication relies on the React Context API to manage global state. The AuthProvider seamlessly handles session restoration via browser localStorage, and abstracts away the complex asynchronous `fetch` logic required to interact with our backend Express server. This allows any UI component to simply call `useAuth()` to instantly access user privileges and login methods."
