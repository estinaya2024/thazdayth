# 📚 File: server/src/routes/notifications.js

### 🌟 GLOBAL OVERVIEW
The `notifications` route handles the **In-App Alert System**. It allows the logged-in customer to view their personal alerts (like "Order Shipped") and mark them as read, clearing the unread bubble in the frontend navbar.

---

### 1. Role in the Project
It drives the frontend `NotificationDrawer.tsx` component. It guarantees that customers only see their own alerts and never the alerts belonging to other clients or administrators.

### 2. Connection with Other Files
- **To `Notification.ts` (Model)**: Queries the database for user-specific alert data.
- **To `auth.ts` (Middleware)**: Every single endpoint in this file uses `authenticate`, because guests do not have notifications.

### 3. Code Breakdown & Step-by-Step Logic

#### A) Fetching My Notifications
```javascript
router.get('/', auth_1.authenticate, async (req, res) => {
    const notifications = await Notification_1.Notification.find({ user_id: req.user.id })
        .sort({ created_at: -1 });
    res.json(notifications);
});
```
- **WHAT?** A secure `GET` request. 
- **WHY?** The `user_id: req.user.id` filter is the most important part. It forcibly filters the database to *only* return notifications belonging to the parsed JWT token.

#### B) Bulk Mark as Read
```javascript
router.patch('/read-all', auth_1.authenticate, async (req, res) => {
    await Notification_1.Notification.updateMany(
        { user_id: req.user.id, is_read: false }, 
        { is_read: true }
    );
    res.json({ message: 'All notifications marked as read' });
});
```
- **WHAT?** A `PATCH` request for bulk updating. The user clicks "Mark all as read" in the UI.
- **`updateMany`**: Instead of looping over 20 individual notifications and making 20 database calls, we make exactly 1 database call. "Find every unread notification belonging to me, and instantly set them all to read."

#### C) Live Polling (Unread Count)
```javascript
router.get('/unread-count', auth_1.authenticate, async (req, res) => {
    const count = await Notification_1.Notification.countDocuments({ 
        user_id: req.user.id, 
        is_read: false 
    });
    res.json({ count });
});
```
- **WHAT?** A hyper-optimized `GET` request.
- **WHY?** If the frontend just wants to know "Do I display a red '2' on the bell icon?", downloading the full text payload of all the notifications is a waste of bandwidth. `countDocuments` asks MongoDB to literally just return a single integer (e.g., `2`), making this endpoint lightning fast. This allows the frontend to ping it regularly without lagging the server.

### 4. Syntax & Keywords Explained
- **`updateMany`**: A Mongoose database operation that affects multiple documents simultaneously based on a filter criteria.
- **`countDocuments`**: A Mongoose operation that avoids loading documents into memory, simply counting the number of matching records directly at the database engine level.

---

### 🎓 Teacher's Q&A Section
1. **How do notifications actually get created?**
   - **Answer**: You'll notice there is no `router.post()` in this file! Customers cannot create notifications. Notifications are created automatically in the backend by the `orders.js` and `pressing.js` controllers whenever an admin approves an action.
2. **If a user deletes their account, what happens to their notifications?**
   - **Answer**: By default, they become orphans. If we implement an account deletion feature in the future, we would need to run `Notification.deleteMany({ user_id: deletedId })` to clean them up.

---

### 🎙️ Presentation Script
"Our Notification API is heavily optimized for frontend performance. Recognizing that the client UI occasionally polls the server to update unread badges, we implemented a dedicated `unread-count` endpoint that utilizes MongoDB's highly efficient memoryless `countDocuments` query. This yields a massive reduction in bandwidth and memory overhead compared to fetching full JSON payloads for simple UI state updates."
