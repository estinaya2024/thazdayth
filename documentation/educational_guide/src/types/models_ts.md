# 📚 File: src/types/models.ts (DEEP DIVE)

### 🌟 GLOBAL OVERVIEW
The `models.ts` file forms the fundamental TypeScript structural skeleton mapping directly to the MongoDB backend architecture. It establishes aggressive, type-safe definitions across User structures, Products, and Business flows.

---

### 1. Role in the Project
Used universally across Contexts, Forms, and API fetch calls ensuring the frontend never accidentally sends invalid JSON structures to the backend servers.

---

### 2. Exhaustive Code Breakdown & Step-by-Step Logic

#### A) MongoDB Inheritance Interface (`BaseEntity`)
```ts
export interface BaseEntity {
    _id?: string;
    created_at?: Date;
}
```
- MongoDB inherently attaches an explicit hexadecimal unique identifier (`_id`) to every Document. 
- Instead of manually copy-pasting `_id: string` natively into 30 different Typescript interfaces, `BaseEntity` utilizes object-oriented inheritance techniques. Every other model extends this single contract perfectly.

#### B) Strict Literals (Union Enums)
```ts
export type UserRole = 'customer' | 'owner';
export type ShippingMethod = 'delivery' | 'pickup';
export type OrderStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
```
- Rather than typing `role: string` (which violently allows `role: "hacker"` or `role: "random"`), the codebase implements "String Literal Unions". TypeScript throws compile-time errors definitively blocking developers from typing anything other than the mathematically explicitly allowed phrases.

#### C) Complex Embedded Document Structures (`PressingRequest`)
```ts
export interface PressingRequest extends BaseEntity {
    user_id: string; // Ref: Users
    olive_quantity_kg: number;
    oil_quality: OilQualityEnum;
    yield: {
        liters_per_kg: number; // Snapshot
        produced_oil_liters: number;
    };
    payment: {
        type: PaymentMethod;
        pressing_price_per_kg?: number; // Snapshot
        percentage_taken?: number; // Snapshot
    };
    status: PressingStatus;
}
```
- **Snapshots vs References**: Notice the comments clearly labeling `Snapshot`. In NoSQL database theory, volatile prices (like exactly how much a kg of olives costs today) MUST be mathematically saved exactly as they were on the specific date of the transaction. If the price changes dynamically next year, this historic receipt should remain unmutated!
- **Yield Logic**: Maps exactly how many raw olives an Algerian farmer brought in natively (`olive_quantity_kg`), and specifically records the mathematical generated outcome (`produced_oil_liters`).
