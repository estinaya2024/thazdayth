# 📚 File: src/Context/LanguageContext.tsx

### 🌟 GLOBAL OVERVIEW
The `LanguageContext.tsx` file provides **Internationalization (i18n)**. It stores the entire dictionary of translations for the website (French, English, Kabyle) and allows the user to switch between them instantly without having to load a new webpage.

---

### 1. Role in the Project
It makes the application **Accessible globally** while respecting local Algerian heritage. It manages the active language state and provides a simple translation function `t()` to all components.

### 2. Connection with Other Files
- **To `Navbar.tsx`**: The language switcher dropdown calls `setLang()` from this file to change the site's language instantly.
- **To ALL text-heavy pages (`Home.tsx`, `Apropos.tsx`, etc.)**: Instead of typing `<h1>Accueil</h1>`, they type `<h1>{t.nav.home}</h1>`. The context magically handles the rest.

### 3. Code Breakdown & Step-by-Step Logic

#### A) The Hardcoded Dictionary
```typescript
export type Lang = "fr" | "en" | "kab";

const translations = {
  fr: {
    nav: { home: "Accueil", story: "Notre Histoire", ... },
    hero: { title: "every drop tells the story of the land", ... }
  },
  en: { ... },
  kab: {
    nav: { home: "Asebter", story: "Tamacahut-nneɣ", ... },
    // ...
  }
};
```
- **WHAT?** We define the languages explicitly. The core is just one massive JavaScript Object called `translations`. It's a huge tree of words, categorized logically (nav words, hero words, footer words).

#### B) Providing the Context
```typescript
export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>("fr");
  const t = translations[lang];

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
```
- **WHAT?** Just like authentication, we create a bubble (`LanguageProvider`) that wraps the whole site. 
- **The Magic Link**: `const t = translations[lang]`. If `lang` is set to `"fr"`, `t` automatically becomes the French dictionary. We pass `t` down through the provider so every component can effortlessly use it.

### 4. Syntax & Keywords Explained
- **`typeof translations.fr`**: A brilliant piece of TypeScript automation. Instead of manually writing out an Interface describing every single word in our massive dictionary, we tell TypeScript: "Just look at the French object, and dynamically create an Interface that perfectly matches whatever is inside it."

---

### 🎓 Teacher's Q&A Section
1. **Why not use a professional library like `react-i18next`?**
   - **Answer**: `react-i18next` is incredibly powerful but heavy. For a boutique ecommerce site with only three static languages and no dynamic user-generated content translations, a lightweight, custom Context hook is much faster and reduces the final size of the application bundle.
2. **If I switch to English and refresh the page, does it stay in English?**
   - **Answer**: No! Because unlike `AuthContext`, this file does not use `localStorage`. It defaults back to `"fr"` on every refresh. To fix this, we would simply add a `useEffect` that reads/writes `lang` to localStorage, exactly like we did for authentication!

---

### 🎙️ Presentation Script
"To support French, English, and our native Kabyle heritage, I built a custom Internationalization engine using React Context. By centralizing the translation dictionaries and leveraging TypeScript's `typeof` utility for strict typing, our components simply consume a `t` object, resulting in a seamlessly multilingual UI with near-zero performance overhead."
