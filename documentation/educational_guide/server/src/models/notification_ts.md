# 📚 File: server/src/models/Notification.ts

### 🌟 GLOBAL OVERVIEW
The `Notification.ts` file acts as the **Alert System**. Instead of just sending emails, the application also sends in-app notifications (the little bell icon in the dashboard) to keep the user updated on exactly what is happening with their purchases.

---

### 1. Role in the Project
It drives the **Drawer Sidebar**. Whenever the Admin approves a pressing request or ships an order, a notification is silently created in the background. When the user logs in, they see a red badge if `is_read` is false.

### 2. Connection with Other Files
- **To `User.ts` (Model)**: A notification belongs exclusively to one user.
- **To `Order.ts` & `PressingRequest.ts` (Models)**: It can optionally link deep into a specific transaction.
- **To `NotificationDrawer.tsx` (Frontend)**: The UI component that visually displays these alerts.

### 3. Code Breakdown & Step-by-Step Logic

#### A) Dual References
```typescript
    order_id: { type: Schema.Types.ObjectId, ref: 'Order' },
    pressing_id: { type: Schema.Types.ObjectId, ref: 'PressingRequest' },
```
- **WHAT?** A notification might be about a Boutique "Order," OR it might be about a "Pressing Request." Both fields are optional (there is no `required: true`).
- **WHY?** This powers the "Deep Linking" feature. If the user clicks a notification that has an `order_id`, the frontend knows to scroll exactly to that specific order in their tracking history.

#### B) Unread Status
```typescript
    is_read: { type: Boolean, default: false },
```
- **WHAT?** A simple flag.
- **WHY?** When a notification is first created, it is "unread" (`false`). When the user opens the notification drawer, an API call flips this to `true`, and the red notification bubble disappears from the UI.

### 4. Syntax & Keywords Explained
- **Optional Properties (`?`)**: Notice that `order_id` and `pressing_id` are not required by Mongoose, nor are they required by TypeScript (as seen by the `?` in the interface). A notification could theoretically just be a general system alert ("Welcome to Kabyle Gold!").

---

### 🎓 Teacher's Q&A Section
1. **Why not just add an array of 'notifications' inside the User model?**
   - **Answer**: If a user uses the app for 10 years and gets 5,000 notifications, embedding them inside the User object would make the User document massive and slow down every single login attempt. Keeping them strictly separate is better for database performance (Scaleability).
2. **If an Order is deleted, does the notification crash because the `order_id` points to nothing?**
   - **Answer**: The ID would point to a non-existent document. However, since we use `is_archived` instead of actually deleting Orders, this edge-case never happens in our system!

---

### 🎙️ Presentation Script
"Our Notification schema exemplifies decoupled architecture. Rather than bloating the User model with an array of alerts, notifications exist as independent entities. By including optional relational hooks (`order_id`, `pressing_id`), we enable intelligent frontend routing while maintaining a flexible data structure capable of handling diverse notification types."
