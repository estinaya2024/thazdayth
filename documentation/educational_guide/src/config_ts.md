# 📚 File: src/config.ts (DEEP DIVE)

### 🌟 GLOBAL OVERVIEW
The `config.ts` file acts as the absolute single source of truth for global network routing across the entire React frontend.

---

### 1. Role in the Project
It exports exclusively the `API_URL` variable, standardizing whether the frontend connects to the local development server (localhost:8080) or the production MongoDB backend without developers ever having to hardcode URLs manually.

---

### 2. Exhaustive Code Breakdown & Step-by-Step Logic

```ts
const API_URL = import.meta.env.VITE_API_URL || "/api";

export default API_URL;
```
- **The Vite Environment Variable Engine (`import.meta.env`)**: Unlike Webpack or Create-React-App which use `process.env`, Vite fundamentally blocks environment variables for security reasons unless they are explicitly prefixed with `VITE_`. 
- **The Fallback Architecture (`|| "/api"`)**:
  - If a `.env` file exists natively and provides `VITE_API_URL=http://localhost:8080/api`, the React application dynamically targets the separate Express.js server natively.
  - If the variable is aggressively missing, the code gracefully falls back to a relative `"/api"` path. This implies that in Production deployments (like Vercel or Node), the frontend implicitly expects that the backend is hosted on the exact same fully-qualified domain name (FQDN) as the frontend itself!
