# 📚 File: server/src/models/OliveCategory.ts

### 🌟 GLOBAL OVERVIEW
The `OliveCategory.ts` file acts as the **Raw Material Catalog**. It defines the types of bulk olive oil available for sale directly from the mill's massive holding tanks.

---

### 1. Role in the Project
It powers the **Bulk Purchases**. While `Products` are for specific, branded bottles (like a 500ml gift bottle), `OliveCategory` is for people who bring their own plastic jerricans to the mill and say "I want 50 liters of Virgin Oil from the tank."

### 2. Connection with Other Files
- **To `routes/prices.ts`**: The API routes allow the dashboard to adjust the bulk pricing.
- **To `Order.ts`**: The `OrderItemSchema` uses `refPath` to link directly to this category if a customer buys bulk tank oil instead of a bottled product.

### 3. Code Breakdown & Step-by-Step Logic

#### A) The Catalog Entry
```typescript
export interface IOliveCategory extends Document {
    name: string;
    price_per_liter: number;
    stock_liters: number;
    active: boolean;
}
```
- **WHAT?** A very simple listing. We need a string `name` (e.g., "Vrac - Extra Vierge"), the bulk `price_per_liter`, and a tracker of how many `stock_liters` are currently in that bulk tank.

#### B) The Active Toggle
```typescript
    active: { type: Boolean, default: true },
```
- **WHY?** If Tank A is empty or being cleaned, the owner switches `active` to `false`. The website immediately stops allowing customers to add this bulk oil to their cart, preventing them from selling oil they don't have.

### 4. Syntax & Keywords Explained
- **`timestamps`**: Added to the bottom of the schema, allowing the admin to see exactly when someone last updated the bulk price or tank stock.

---

### 🎓 Teacher's Q&A Section
1. **Why do we have `OliveCategory`, `OilQualitySetting`, AND `Product`? Isn't that redundant?**
   - **Answer**: Great architectural question! They serve three distinct business logic flows:
      - `Product`: The retail shop (Bottles, Jars, Packaging).
      - `OilQualitySetting`: The agricultural calculator (Yield physics, Barter rules).
      - `OliveCategory`: The wholesale tanks (Bulk buying in liters).
     Separating them keeps the code clean and prevents "Frankenstein" models that try to do too many things at once.
2. **If stock hits 0, does `active` become false automatically?**
   - **Answer**: In the database schema, no. If we wanted that to happen automatically, we would write that logic into the API Route when completing an order.

---

### 🎙️ Presentation Script
"The OliveCategory model manages our wholesale and bulk tank inventory. By intentionally segregating this data from the retail Product model and agricultural OilQuality parameters, we've established a highly normalized database architecture that accurately reflects the distinct revenue streams of a modern olive mill."
