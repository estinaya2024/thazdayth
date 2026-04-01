# 📚 File: server/src/models/User.ts

### 🌟 GLOBAL OVERVIEW
The `User.ts` file defines the **Blueprint** for our users in the database. Every customer, visitor, or administrator who signs up is shaped by the rules written in this file. It uses **Mongoose**, which is a translator between our Node.js server and the MongoDB database.

---

### 1. Role in the Project
It acts as the **Data Enforcer**. If someone tries to create an account without an email, or with a role that doesn't exist, Mongoose will look at this file, see that it breaks the rules, and block it.

### 2. Connection with Other Files
- **To the Database (MongoDB)**: This directly converts into a "Collection" (like a table) called `users` in MongoDB.
- **To `routes/auth.ts`**: When a user registers, the auth route imports this `User` model to save the new person to the database.

### 3. Code Breakdown & Step-by-Step Logic

#### A) The TypeScript Interface
```typescript
export interface IUser extends Document {
    first_name: string;
    last_name: string;
    ...
    role: 'customer' | 'owner';
}
```
- **WHAT?** This tells TypeScript (our coding assistant): "Whenever I talk about a User in the server code, they MUST have a `first_name` which is a `string` (text), and a `role` which can *only* be the word 'customer' or 'owner'."
- **WHY?** For developer safety. If a developer accidentally types `user.rolee = 'admin'`, TypeScript will show a red error before the code even runs because it breaks this interface.

#### B) The Mongoose Schema
```typescript
const UserSchema = new Schema<IUser>({
    first_name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['customer', 'owner'], default: 'customer' },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }});
```
- **WHAT?** While the *Interface* protects the *Code*, the *Schema* protects the *Database*. 
- **`required: true`**: The database will reject the save if this field is missing.
- **`unique: true`**: Ensures two people cannot sign up with the exact same email address.
- **`trim: true`**: Automatically removes accidental spaces at the beginning or end of what the user typed (e.g., `" john@email.com "` becomes `"john@email.com"`).
- **`lowercase: true`**: Automatically forces the email to be lowercase so "JOHN@email.com" and "john@email.com" are treated as the same person.
- **`timestamps`**: Automatically adds the exact date and time the account was created and last updated.

#### C) Exporting the Model
```typescript
export const User = mongoose.model<IUser>('User', UserSchema);
```
- **WHAT?** We combine the Interface (`<IUser>`) and the Rules (`UserSchema`) to create the final `User` tool. We export this so other files can use commands like `User.find()` or `User.create()`.

### 4. Syntax & Keywords Explained
- **`Document`**: An import from Mongoose. It gives our `IUser` interface all the magical database powers (like `.save()`, `._id`, etc.).
- **`enum`**: Short for "Enumeration." It means: "This field can ONLY be one of the specific words inside this list."

---

### 🎓 Teacher's Q&A Section
1. **What is the difference between the `IUser` Interface and the `UserSchema`?**
   - **Answer**: The `IUser` Interface is for **TypeScript** (compile-time, helps developers write bug-free code). The `UserSchema` is for **Mongoose/MongoDB** (runtime, protects the actual database from bad data).
2. **Why don't we see `_id` defined in the Schema?**
   - **Answer**: Mongoose automatically generates a unique `_id` for every document inserted into MongoDB. We don't need to write it manually!
3. **Why is the `password` field a simple `String`? Isn't that dangerous?**
   - **Answer**: In the database schema, it is just text. The actual "Hashing" (encryption) is done in the `auth.ts` route *before* it is handed to this schema to be saved. We never save raw passwords.

#### 🔥 The Tricky Question:
*   "If I add a new property `age: Number` to my database using MongoDB Compass, will my Node.js app see it?"
    - **Answer**: No! Because Mongoose acts as a strict filter. If `age` is not defined in this `UserSchema`, Mongoose will completely ignore it when loading data from the database.

---

### 🎙️ Presentation Script
"The User model is the foundational data blueprint of our application. We strictly enforce data integrity at two layers: compile-time using TypeScript interfaces, and runtime using Mongoose schemas. Features like automatic trimming, lowercase coercion for emails, and tight enumeration for roles ensure that our database remains clean, secure, and immune to simple data-entry errors."
