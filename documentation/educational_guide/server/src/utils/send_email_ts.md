# 📚 File: server/src/utils/sendEmail.ts

### 🌟 GLOBAL OVERVIEW
The `sendEmail.ts` file is the **Automated Postman**. Whenever a user forgets their password, places an order, or requests a pressing service, this file is responsible for crafting a beautiful HTML email and securely delivering it to their inbox.

---

### 1. Role in the Project
It completely decoupled email logic from the API routes. Instead of cluttering `orders.js` with 100 lines of HTML code, `orders.js` simply calls `sendOrderConfirmationEmail(userEmail, data)`, keeping the codebase clean and modular.

### 2. Connection with Other Files
- **To `routes/auth.ts`**: Used to send the 6-digit password reset code.
- **To `routes/orders.ts` & `routes/pressing.ts`**: Used to send the final receipt and tracking code after checkout.

### 3. Code Breakdown & Step-by-Step Logic

#### A) The Magic "Ethereal" Test Mode
```typescript
async function getTransporter(): Promise<nodemailer.Transporter> {
    const hasRealCredentials = process.env.EMAIL_USER && process.env.EMAIL_PASS;

    if (hasRealCredentials) {
        // ... hook up to real Gmail/SMTP
    } else {
        // Auto-create an Ethereal test account
        const testAccount = await nodemailer.createTestAccount();
        // ...
        console.log('📬 EMAIL ENVOYÉ ! Voir ici: 👉 ' + previewUrl);
    }
}
```
- **WHAT?** Setting up real email servers (like Gmail or SendGrid) during early development is annoying. This code checks your `.env` file. If you haven't provided a real email, it automatically intercepts all outgoing emails and sends them to a fake, temporary inbox called **Ethereal Email**.
- **WHY?** It prints a clickable URL (the `previewUrl`) directly in your VS Code Terminal! You can click that link to see exactly what the email looks like in a real browser without ever sending a real email. This is incredibly professional developer experience (DX).

#### B) Crafting the Email Templates
```typescript
export const sendResetEmail = async (email: string, code: string) => {
    const mailOptions = {
        from: '"TAZDAYTH" <reset@tazdayth.com>',
        to: email,
        subject: 'Réinitialisation de votre mot de passe',
        html: `
            <div style="font-family: sans-serif; max-width: 600px; ...">
                <span style="font-size: 32px; font-weight: bold;">${code}</span>
...
```
- **WHAT?** We use "Inline CSS" to style the email. 
- **WHY?** Email clients like Gmail, Outlook, and Apple Mail are notoriously terrible at rendering modern websites. They strip out `<style>` tags and don't understand React or Tailwind. The only way to guarantee an email looks good everywhere is to write brutally simple HTML with raw `style="..."` attributes on every single element.

### 4. Syntax & Keywords Explained
- **`nodemailer`**: The industry-standard Node.js library for sending emails. It handles all the complex SMTP (Simple Mail Transfer Protocol) handshakes gracefully.
- **`(error: any)`**: In the `catch` block, we use `any` because network errors can take many shapes, and we just want to extract the `.message` string to log it to the console.

---

### 🎓 Teacher's Q&A Section
1. **If the email fails to send, does the user's order fail?**
   - **Answer**: No! If you look back at `orders.ts`, the `sendEmail` function is called asynchronously *without* the `await` keyword blocking the final `res.status(201).json()`. We intentionally decouple them so a temporary Gmail server outage doesn't block the mill from making money!
2. **Where do `process.env.EMAIL_USER` and `EMAIL_PASS` come from?**
   - **Answer**: They come from the `.env` file at the root of the server folder. This file is ignored by Git, ensuring hackers cannot find your email passwords by looking at your GitHub repository.

---

### 🎙️ Presentation Script
"Our email utility utilizes Nodemailer, a robust Node.js transport module. A key professional feature I implemented is the fallback to Ethereal Email; if SMTP credentials are not present in the environment variables during localized development, the system automatically provisions a temporary ethereal inbox and logs a URL to the terminal, allowing developers to visually QA HTML templates without needing a real mail server."
