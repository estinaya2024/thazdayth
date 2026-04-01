# 📚 File: server/src/models/Comment.ts

### 🌟 GLOBAL OVERVIEW
The `Comment.ts` file acts as the **Guestbook**. It handles the testimonials left by users. It ensures that every review on the website is tied to a real, registered user and includes a valid star rating.

---

### 1. Role in the Project
It provides the structure for **Social Proof**. The "Testimonials" section on the frontend reads directly from this collection. By requiring a `user_id`, we prevent anonymous spam and ensure authenticity.

### 2. Connection with Other Files
- **To `User.ts` (Model)**: Every comment links back to the user who wrote it.
- **To `routes/comments.ts`**: The API routes allow logged-in users to create comments and admins to delete them.
- **To `Testimonials.tsx` (Frontend)**: This React component displays the data stored by this model.

### 3. Code Breakdown & Step-by-Step Logic

#### A) The User Link
```typescript
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
```
- **WHAT?** Instead of storing the user's name directly in the comment, we store their unique `_id`.
- **WHY?** If the user later changes their name in their profile, their old comments will instantly display their new name, because the frontend will "populate" the user data using this ID connection.

#### B) Star Rating Bounds
```typescript
    rating: { type: Number, required: true, min: 1, max: 5, default: 5 },
```
- **WHAT?** A standard number field, but with strict `min` and `max` constraints.
- **WHY?** If a malicious user tries to bypass the frontend and send a rating of `1000` or `-5`, the database will throw a validation error and refuse to save the comment.

### 4. Syntax & Keywords Explained
- **`ref: 'User'`**: Tells Mongoose that the `ObjectId` stored in `user_id` belongs specifically to the `User` collection. This allows us to use the `.populate('user_id')` command later to automatically fetch the user's details.

---

### 🎓 Teacher's Q&A Section
1. **Can a user leave multiple comments?**
   - **Answer**: Based on this schema alone, yes. There is no `unique` constraint on the `user_id`. The logic to prevent multiple comments (if desired) must be written in the route (`routes/comments.ts`), not here in the schema.
2. **Why is there no `updated_at` field like in other models?**
   - **Answer**: Because in our current business logic, users cannot *edit* their comments after posting them; they can only delete them. Therefore, tracking an update time is unnecessary.

---

### 🎙️ Presentation Script
"The Comment model is a straightforward implementation of a relational database structure in MongoDB. By requiring a foreign-key style reference to the User collection, we guarantee authenticity for all testimonials. We also utilize Mongoose's built-in min/max validators to strictly bound the rating system between 1 and 5 stars, preventing data corruption at the schema level."
