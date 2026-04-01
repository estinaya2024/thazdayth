# 🚀 TAZDAYTH Production Launch Checklist

Follow these steps to prepare your website for the real market.

## 1. 🔐 Security First
- [ ] **Change Admin Password**: Use the initial password `adminthazdayth` to log in, then change it immediately in your profile or directly in the database.
- [ ] **Environment Variables**: Ensure your `.env` file is NOT committed to Git (it is already in `.gitignore`).

## 2. 🔑 API Keys & Credentials
### Google Login (OAuth 2.0)
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new Project.
3. Navigate to **APIs & Services > Credentials**.
4. Create an **OAuth 2.0 Client ID** (Web Application).
5. Add your production domain to **Authorized JavaScript origins**.
6. Copy the **Client ID** to `VITE_GOOGLE_CLIENT_ID` in your `.env`.

### Database (MongoDB Atlas)
1. Create a cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a Database User with read/write access.
3. Whitelist your server's IP address (or allow Access from Anywhere `0.0.0.0/0` if using Vercel/Render).
4. Copy the connection string to `MONGODB_URI` in your `.env`.

### Email (SMTP for Password Reset)
1. If using Gmail, create an **App Password**.
2. Or use a service like SendGrid, Mailchimp, or AWS SES.
3. Fill in `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, and `SMTP_PASS` in your `.env`.

## 3. 🌐 Deployment
1. **Frontend**: Build the site using `npm run build`. Deploy the `dist/` folder to Vercel, Netlify, or a similar static host.
2. **Backend**: Deploy the `server/` directory to a platform like Render, Railway, or Heroku.
3. **URL Sync**:
   - Ensure the frontend `.env` has the correct `VITE_API_URL` (your backend URL).
   - Ensure the backend `.env` has the correct `FRONTEND_URL` for CORS.

## 4. 📦 Final Verification
- [ ] Test the **Notification System**: Create a test order and check if the bell icon lights up.
- [ ] Test **Google Login**: Ensure the popup appears and logs you in.
- [ ] Test **Password Reset**: Request a reset and check your email inbox.
