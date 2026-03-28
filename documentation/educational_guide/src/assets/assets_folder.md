# 📚 Folder: src/assets

### 🌟 GLOBAL OVERVIEW
The `src/assets` folder is the **Media Library** of the frontend application. It contains all the static imagery and video files that give the Kabyle-Gold site its premium, immersive aesthetic.

---

### 1. Role in the Project
It securely stores media locally. By keeping these files within tracking of the React bundler (Vite), it ensures they are heavily optimized during the production build process. 

### 2. Connection with Other Files
- **To Frontend Pages (e.g., `Home.tsx`, `Histoire.tsx`)**: Elements like `<img src={backgroundImg} />` or `<video src={backgroundVideo} />` import these files directly at the top of their React scripts.

### 3. Folder Breakdown

| File Name | Purpose |
| :--- | :--- |
| **`backgroundVideo.mp4`** | The 17MB cinematic video that plays silently behind the hero text on the homepage. Crucial for the initial "wow" factor. |
| **`background-main-image.jpg`** | The fallback high-resolution background image, used in headers or when the video cannot load. |
| **`brothers.jpg`** | Key storytelling image used in the "Our Story" (Notre Histoire) section to establish the family heritage. |
| **`food-img-1/3.jpg`** | Lifestyle culinary photography used in the "Boutique" or informational sections to show the oil in use. |
| **`olive-img-2/5.jpg`** | Agricultural photography focusing on the olive harvest, used in the "Terroir" sections. |
| **`loading-olives.jpg`** | The background image used specifically for the initial preloader animation. |

---

### 🎓 Teacher's Q&A Section
1. **Why not just put these in the `/public` folder instead of `/src/assets`?**
   - **Answer**: Files in `/public` are served exactly as they are without any processing. By putting them in `/src/assets` and `importing` them in React (`import myImg from '../assets/img.jpg'`), Vite can analyze them, add cache-busting hashes to their filenames (e.g., `img-8x4da.jpg`), and ensure the browser never loads a stale version of an image after an update.
2. **Why is the video 17MB? Isn't that slow?**
   - **Answer**: It is quite large for the web! However, modern browsers can stream `.mp4` files in chunks. More importantly, we placed it behind a highly optimized Framer Motion loading screen. The user watches the cinematic "TAZDAYTH" loading animation for a few seconds, which perfectly masks the background buffer time!

---

### 🎙️ Presentation Script
"The `assets` directory houses our static media payloads. Rather than bypassing the build pipeline via the public directory, I intentionally placed these assets within the `src` module graph. This allows our Vite bundler to perform cache-busting via content hashing, ensuring that heavy hero assets like our 17 Megabyte background video are aggressively cached by the browser while remaining instantly upgradeable during future deployments."
