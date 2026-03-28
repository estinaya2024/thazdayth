# 🏗️ Project Architecture: The "Why" of our Folders

### 🌟 GLOBAL OVERVIEW
A professional React project isn't just a pile of files. It’s organized like a library. Each folder has a specific "responsibility." This makes the code easier to read, test, and maintain as it grows.

---

### 📁 1. `src/components/`
- **Role**: Small, reusable parts of the UI.
- **Analogy**: The "Bricks" of the house.
- **Why here?** If you have a button or a Navbar that appears on 10 different pages, you write it once here. If you need to change the color, you change it in **one** file, and all 10 pages update automatically.
- **Sub-folder: `ui/`**: We use a library called **shadcn/ui**. It provides basic components like Buttons, Inputs, and Dropdown menus. They are separated because they are "low-level" primitives.

### 📁 2. `src/pages/`
- **Role**: The "Screens" or "Views" of the app.
- **Analogy**: The "Rooms" of the house.
- **Why here?** These are complex components that represent a full URL route (like `/boutique`). They combine multiple `components` to create a complete user experience.

### 📁 3. `src/Context/`
- **Role**: Global data management.
- **Analogy**: The "Electrical Wiring" of the house.
- **Why here?** Data like "Who is logged in?" needs to be accessible from ANY room (page). By putting it in a Context folder, we signify that this data "flows" through the entire app.

### 📁 4. `src/hooks/`
- **Role**: Custom logic shortcuts.
- **Analogy**: The "Smart Home Shortcuts."
- **Why here?** If you have complex logic (like "how to handle a form") that you use in multiple places, you extract it into a "Hook" to keep your components short and clean.

### 📁 5. `src/assets/` & `src/data/`
- **`assets/`**: Static files like images, logos, and fonts.
- **`data/`**: Static JS/TS data like lists of Wilayas (provinces) or categories. We keep them separate because they aren't "code logic," they are "information."

---

### 🎓 Teacher's Q&A Section
1. **Why don't we just put everything in one `src` folder?**
   - **Answer**: "Separation of Concerns." As a project grows to hundreds of files, finding a specific bug becomes impossible without a strict structure.
2. **What is the difference between a Component and a Page?**
   - **Answer**: A Page is associated with a **URL route**. A Component is a **building block** used inside pages.
3. **Where should I put a reusable button I created?**
   - **Answer**: In `src/components/` or `src/components/ui/`.

---

### 🎙️ Presentation Script
"Our project follows a modern React architectural pattern. We separate our building blocks into 'components' for reusability and our full views into 'pages' for routing. We use the Context pattern for global state like authentication, and separate our static data and assets to maintain a clean, professional codebase."
