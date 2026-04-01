# 📚 File: server/src/routes/comments.js

### 🌟 GLOBAL OVERVIEW
The `comments` route handles the **Public Testimonials**. It safely connects the MongoDB Comment database to the frontend `Testimonials.tsx` component, allowing users to leave reviews while ensuring admins can moderate them.

---

### 1. Role in the Project
It drives the "Social Proof" section of the website. It provides the APIs to read all approved comments and allows authenticated users to submit new ones.

### 2. Connection with Other Files
- **To `Comment.ts` (Model)**: Reads and writes the text and star ratings.
- **To `auth.ts` (Middleware)**: Uses `authenticate` to ensure only logged-in users can leave a review, preventing spam from anonymous bots.

### 3. Code Breakdown & Step-by-Step Logic

#### A) Fetching the Testimonials
```javascript
router.get('/', async (req, res) => {
    const comments = await Comment_1.Comment.find()
        .populate('user_id', 'first_name last_name')
        .sort({ created_at: -1 });
    res.json(comments);
});
```
- **WHAT?** A public `GET` request. 
- **`.populate(...)`**: This is a powerful MongoDB command. The comment database only stores `user_id: 12345`. When we run `.populate(...)`, Mongoose automatically jumps to the `User` table, grabs the `first_name` and `last_name` of user 12345, and attaches it right to the comment before sending it to the frontend.
- **`.sort(...)`**: Sorts by `created_at: -1`, meaning newest comments appear first.

#### B) Creating a Comment
```javascript
router.post('/', auth_1.authenticate, [
    body('content').notEmpty(),
    body('rating').isInt({ min: 1, max: 5 }),
], async (req, res) => {
    // ... validate errors ...
    const comment = await Comment_1.Comment.create({
        user_id: req.user.id,
        content: req.body.content,
        rating: req.body.rating || 5, // Default to 5 stars
    });
    // ...
});
```
- **WHAT?** An authenticated user submits a review.
- **WHY `req.user.id`?** We completely ignore any `user_id` the frontend might try to send us. We pull the ID securely directly from the decrypted JWT Token (`req.user.id`). This prevents a hacker from forging a review under someone else's name!

#### C) Deleting a Comment (Advanced Authorization)
```javascript
router.delete('/:id', auth_1.authenticate, async (req, res) => {
    const comment = await Comment_1.Comment.findById(req.params.id);
    
    // Check ownership: only the author or an owner can delete
    if (comment.user_id.toString() !== req.user.id && req.user.role !== 'owner') {
        return res.status(403).json({ message: 'Opération non autorisée.' });
    }
    
    await comment.deleteOne();
    res.json({ message: 'Commentaire supprimé.' });
});
```
- **WHAT?** This is a beautiful example of Custom Authorization. We don't use `ownerOnly` here because we want regular customers to be able to delete *their own* comments.
- **THE LOGIC**: "If the person sending this request is NOT the person who wrote the comment AND they are NOT an admin owner... block them."

### 4. Syntax & Keywords Explained
- **`toString()`**: MongoDB `ObjectId`s look like strings, but they are technically complex Objects. When comparing an ID from the database with an ID from a token (`req.user.id`), we must use `.toString()` to ensure the comparison (`!==`) works correctly.

---

### 🎓 Teacher's Q&A Section
1. **Can an admin edit a customer's comment?**
   - **Answer**: No! In this API, there is no `router.put()`. A testimonial must be authentic. If an admin doesn't like it, they can delete it, but they physically cannot alter the customer's words through this API.
2. **Why does `.populate` only ask for the first and last name?**
   - **Answer**: Security. If we just ran `.populate('user_id')`, it would send the user's email, phone number, and address to the public frontend for everyone to see. Explicitly listing the safe fields is mandatory.

---

### 🎙️ Presentation Script
"Our Comments API balances user engagement with strict security and data privacy. By relying entirely on the authenticated session token for user identification, we absolutely eliminate identity spoofing. Furthermore, we employ highly targeted Mongoose population queries to ensure that public-facing testimonials only expose the author's first and last name, rigorously protecting their PII (Personally Identifiable Information)."
