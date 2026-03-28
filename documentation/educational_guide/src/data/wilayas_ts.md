# 📚 File: src/data/wilayas.ts (DEEP DIVE)

### 🌟 GLOBAL OVERVIEW
The `wilayas.ts` file acts as the primary local Database Seed for Geographic and Commodity Business Logic. Because Wilayas (Algerian provinces) and Oil Qualities rarely arbitrarily mutate in real life, hardcoding them gracefully saves hundreds of backend API network calls.

---

### 1. Role in the Project
Injects dropdown options violently into the Shipping Checkout forms, strictly calculating shipping cost logic natively on the frontend without server latency.

---

### 2. Exhaustive Code Breakdown & Step-by-Step Logic

#### A) The Geographic Array (`wilayas`)
```ts
export interface Wilaya {
  code: number;
  name: string;
  shipping: number;
}

export const wilayas: Wilaya[] = [
  { code: 1, name: "Adrar", shipping: 1200 },
  { code: 10, name: "Bouira", shipping: 400 },
  { code: 11, name: "Tamanrasset", shipping: 1500 },
  { code: 15, name: "Tizi Ouzou", shipping: 300 },
  // ... 58 Provinces ...
];
```
- **The Routing Matrix**: It defines exactly 58 objects mimicking the official Algerian provincial numeric codes natively. 
- **The Shipping Math**: The `shipping` variable directly dynamically influences cart totals. "Adrar" (1200 DA) mathematically costs aggressively more to deliver to than "Tizi Ouzou" (300 DA) due to geographic proximity to the primary Kabyle production hub.

#### B) The Commodity Matrix (`oilTypes`)
```ts
export const oilTypes: OilType[] = [
  {
    id: "extra-vierge",
    name: "Extra Vierge",
    quality_name: "extra_virgin",
    pricePerLiter: 2500,
    conversionRate: 5,
    processingPricePerKg: 40,
  },
  //...
];
```
- **The Core Business Rules**: This array dictates exactly the operational math formulas for the business. 
- The `conversionRate: 5` mathematically means it natively takes exactly 5 Kilograms of raw olives to successfully produce 1 Liter of Extra Virgin Olive oil! 
- **Database Abstraction (`quality_name`)**: While `id="extra-vierge"` handles frontend React routing beautifully, `quality_name="extra_virgin"` is the strict string literal aggressively matched to the MongoDB enum structure defined natively in `models.ts`!
