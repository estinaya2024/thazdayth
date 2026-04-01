# 📚 File: server/src/models/OilQualitySetting.ts

### 🌟 GLOBAL OVERVIEW
The `OilQualitySetting.ts` file acts as the **Grading Rubric**. Not all olive oil is created equal. The mill separates oil into three qualities (Extra Virgin, Virgin, Third Quality). This file stores the specific physical and financial rules for each of those grades.

---

### 1. Role in the Project
It drives the **Calculator**. On the frontend homepage, there is a calculator tool where users type in their olive weight to see how much oil they will get. This model provides the exact numbers needed to make that mathematical estimation accurate.

### 2. Connection with Other Files
- **To `routes/oilQuality.ts`**: The API routes allow the dashboard to modify the yields (e.g., if this year's harvest is particularly dry).
- **To `Calculator.tsx` (Frontend)**: Reads these numbers to provide real-time estimates to visitors.

### 3. Code Breakdown & Step-by-Step Logic

#### A) The Quality Categories
```typescript
    quality_name: {
        type: String,
        enum: ['extra_virgin', 'virgin', 'third_quality'],
        required: true,
        unique: true,
    },
```
- **WHAT?** We strictly define three grades of oil. We enforce `unique: true` so the admin cannot accidentally create two different sets of rules for "Extra Virgin." There can only be ONE set of rules for each grade.

#### B) The Core Metrics
```typescript
    liters_per_kg: { type: Number, required: true },
    price_per_liter: { type: Number, required: true },
    processing_price_per_kg: { type: Number, required: true },
```
- **WHAT?** These three numbers define everything about this specific grade of oil:
    - `liters_per_kg`: Expected yield (e.g., 0.20 for Extra Virgin, but maybe 0.15 for Third Quality).
    - `price_per_liter`: Market value if the mill sells it.
    - `processing_price_per_kg`: Labor cost to press it.

### 4. Syntax & Keywords Explained
- **`unique: true`**: A database-level index that guarantees no duplicates exist across the entire collection for that specific field.

---

### 🎓 Teacher's Q&A Section
1. **How is this different from `PressingService.ts`?**
   - **Answer**: `PressingService` lists the specific *tasks* the mill sells (e.g., "Premium Cold Press Service"). `OilQualitySetting` defines the physical *properties* and baseline values of the oil itself, which drives the public Calculator tool.
2. **Why do we need to store the `price_per_liter` here if it's also in the `Product.ts` model?**
   - **Answer**: `Product` represents a specific *bottled item* (e.g., "1L Glass Bottle of Extra Virgin"). `OilQualitySetting` represents the raw bulk market value, often used when calculating the "Barter" payment method where the mill keeps a percentage of the raw oil.

---

### 🎙️ Presentation Script
"The OilQualitySetting model serves as the mathematical foundation for our platform's transparency tools. By formalizing the yield rates and processing costs for distinct oil grades, we can feed accurate, dynamic data to the frontend Calculator, ensuring customers receive trustworthy estimates based on the current season's harvest conditions."
