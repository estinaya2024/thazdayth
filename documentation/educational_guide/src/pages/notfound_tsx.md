# 📚 File: src/pages/NotFound.tsx

### 🌟 GLOBAL OVERVIEW
The `NotFound.tsx` file is the **404 Safety Net**. If a user tries to visit a URL that does not exist in our application (like `thazdayth.com/admin/secret/database`), the React Router will catch them and cleanly render this page instead of crashing.

---

### 1. Role in the Project
It is the **Error Boundary for Routing**. It informs the user they made a mistake and provides a safe link back to the Homepage.

### 2. Connection with Other Files
- **To `App.tsx`**: In the master routing file, this component is attached to the route `path="*"`. The asterisk is a wildcard meaning "literally anything else that didn't match the routes above me".

### 3. Code Breakdown & Step-by-Step Logic

#### A) Silent Logging (useLocation)
```tsx
const location = useLocation();

useEffect(() => {
  console.error("404 Error: User attempted to access non-existent route:", location.pathname);
}, [location.pathname]);
```
- **WHAT?** When the user hits this page, we don't just show them the error; we secretly log *which* broken URL they tried to visit into the browser's developer console.
- **Why?**: In a production environment, this `console.error` could be replaced with an API call to a service like Sentry to notify the developers: *"Hey! 50 users today tried to visit `/boutiqe`! You should probably set up an automatic redirect to `/boutique`!"*

### 4. Syntax & Keywords Explained
- **`path="*"` (in App.tsx)**: The universal catch-all route.

---

### 🎓 Teacher's Q&A Section
1. **Why not just use a standard HTML <a> tag to redirect to the homepage?**
   - **Answer**: We actually do use an `<a>` tag here instead of a React Router `<Link>`! When a user hits a 404, it's often safer to force a true hard-refresh of the application state by using `href="/"` rather than a soft React state transition, ensuring any corrupted local state is completely wiped out when they return to the Home page.

---

### 🎙️ Presentation Script
"While `NotFound` is structurally simplistic, it plays a vital role in application resilience. By binding to the wildcard `*` route in our primary router, it acts as a silent error boundary. Furthermore, I implemented `useLocation` telemetry to intercept the precise malformed URI string, logging it for potential future analytics aggregation to identify and patch common typographical errors in user navigation."
