# 📚 Folder: src/locales/ (DEEP DIVE)

### 🌟 GLOBAL OVERVIEW
The `src/locales/` directory holds the monolithic TypeScript string translation maps that power exactly every single word in the application’s UI. These JSON-style arrays bypass database storage to deliver millisecond-level language switching instantly on the frontend.

---

### 1. Role in the Project
Acts as the central translation intelligence bridging standard French (`fr.ts`) to Global English (`en.ts`) and the native Algerian local dialect (`kab.ts`).

---

### 2. Exhaustive Conceptual Breakdown & Logic

#### A) The TypeScript Dictionary (`en.ts` vs `kab.ts`)
```ts
// Example Locale Structure mapping identical concepts
export const kab = {
  nav: {
    home: "Asebter amenzu",
    about: "Awal fella-neɣ",
    shop: "Tahanut",
  },
  auth: {
    loginTitle: "Kcem ɣer umiḍan-ik",
    signupTitle: "Rzem amiḍan",
  }
}
```
- **Strict Key Alignment Architecture**: The frontend application does not hardcode words like "Home". Instead, the `Navbar.tsx` specifically codes `<Link>{t('nav.home')}</Link>`. 
- The React translation hook mechanically queries the memory address `nav.home`. If the user has selected Kabyle, it instantly identically traverses into the `kab.ts` object, grabs "Asebter amenzu", and natively replaces the React text node physically on the DOM.
- **Performance Tradeoff**: The files are large (~30 KB each). Storing them in local `.ts` variables instead of remote Backend Database tables dramatically inflates the initial initial Javascript bundle size, but guarantees exact 0ms network latency when flipping between languages, generating a stunningly fluid local application experience natively!
