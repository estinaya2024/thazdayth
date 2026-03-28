# 📚 Sub-Module: Routing & Navigation (DEEP DIVE)
*Combining: `AdminRoute.tsx`, `BackButton.tsx`, `NavLink.tsx`, `ScrollToTop.tsx`*

### 🌟 GLOBAL OVERVIEW
These four files are precision instruments designed to operate alongside the `react-router-dom` library. They handle URL security, historical backtracking, active-state CSS generation, and physical window scroll correction during Single Page Application (SPA) navigation.

---

### 1. `AdminRoute.tsx` (Role-Based Access Control)

#### A) The Hierarchy of Rejection
```tsx
const AdminRoute = ({ children }: Props) => {
    const { isAuthenticated, user, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) return null; // 1. Wait for LocalStorage

    if (!isAuthenticated) {     // 2. Reject Guests
        return <Navigate to={`/connexion?redirect=${location.pathname}`} replace />;
    }

    if (user?.role !== 'owner') { // 3. Reject Standard Users
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;       // 4. Grant Access
};
```
- **WHAT?** This is an evolution of `ProtectedRoute.tsx`. It acts as an impenetrable firewall around the `/dashboard` route.
- **The Three-Tier Security Layer**:
  1. It first yields to asynchronous loading to prevent "Flash" redirects.
  2. If the user is fundamentally a guest (no token), it securely stores their intended URL and bounces them to Login.
  3. **The Core Addition**: Even if the user *is* successfully logged in, it intercepts their MongoDB user profile. If their database `role` string does not identically match `"owner"`, they are silently and instantly deflected to the Homepage (`/`), permanently locking them out of the Admin panel.

---

### 2. `ScrollToTop.tsx` (SPA Scroll Correction)

#### A) The React Router Trap
```tsx
const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
    }, [pathname]);

    return null;
};
```
- **WHAT?** In a standard HTML website, clicking a link causes the browser to download a new HTML file, inherently starting you at the top of the monitor. React is a Single Page Application (SPA). If you scroll down 5000 pixels on the Homepage and click "Boutique", React simply violently swaps the HTML *in-place*. **Your browser stays at pixel 5000**, leaving you stranded at the bottom of the new Boutique page!
- **The Fix**: This invisible component is mounted inside `App.tsx`. Because `pathname` (the URL string) is inside the `useEffect` dependency array, the exact millisecond the URL changes (e.g., from `/` to `/boutique`), this component fires `window.scrollTo(0)`. The `behavior: "instant"` ensures the screen jumps to the top instantaneously, perfectly recreating the feel of a standard native webpage.

---

### 3. `BackButton.tsx` (History Stack Traversal)

#### A) Native Navigation Memory
```tsx
const navigate = useNavigate();

<button onClick={() => navigate(-1)}>
  <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
  Retour
</button>
```
- **WHAT?** This is not a `<Link to="/">`. This button dynamically hooks into the browser's hidden Array of history (the exact same array powered by the physical Back button on your browser toolbar).
- **`navigate(-1)`**: It commands the browser: *"Do not go home. Go to URL index `-1` (whatever the URL was exactly 1 click ago)."* If they came to the Shop from the Region page, it takes them to the Region page. If they came from the Homepage, it takes them to the Homepage.
- **Micro-Interaction**: The `group-hover:-translate-x-1` Tailwind class means that when you hover over the word "Retour", the Arrow physically nudges itself left by 4 pixels, subconsciously begging the user to click it.

---

### 4. `NavLink.tsx` (Dynamic Styling Engine)

#### A) CSS Class Injection via `react-router-dom`
```tsx
const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  ({ className, activeClassName, pendingClassName, to, ...props }, ref) => {
    return (
      <RouterNavLink
        to={to}
        className={({ isActive, isPending }) =>
          cn(className, isActive && activeClassName, isPending && pendingClassName)
        }
      />
    );
  },
);
```
- **WHAT?** Look at standard Navbars. When you are on the "Home" page, the word "Home" is usually bold or colored blue to show you where you are. Doing this manually with React State is horrible.
- **The Engine**: `RouterNavLink` is a deeply intelligent function provided by React Router. It mathematically compares its own `to` prop (e.g., `/boutique`) against the actual browser URL. If they match, `isActive` automatically becomes `true`!
- **The Tailwind Merge (`cn`)**: We pass standard custom props like `activeClassName="text-primary font-bold"`. If `isActive` is true, the `cn` utility elegantly merges `"text-primary font-bold"` directly into the link's standard CSS classes.
