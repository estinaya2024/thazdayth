# 🚀 TAZDAYTH - Market Launch & Production Guide

This guide provides the exact steps to transition your platform from a development/testing state to a professional, market-ready production environment.

## 1. Google Authentication (OAuth 2.0)
To allow **any user** with a Google account (Gmail, Workspace, or custom domain linked to Google) to sign in, you must configure your Google Cloud Project correctly.

### Steps in Google Cloud Console:
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Select your project.
3. Navigate to **APIs & Services > OAuth consent screen**.
4. Set **User Type** to **External**.
5. Fill in the App Information (Name, Logo, Support Email).
6. **IMPORTANT**: Under **Publishing status**, click **PUBLISH APP**. This moves your app from "Testing" (where only added users can login) to "Production" (where ANYONE can login).
7. Go to **Credentials** and ensure your **Authorized JavaScript origins** and **Authorized redirect URIs** match your production domain (e.g., `https://tazdayth.com`).

---

## 2. Environment Variables (.env)
Your production `.env` file must be populated with real secrets. Never share this file or commit it to GitHub.

| Variable | Description |
| :--- | :--- |
| `JWT_SECRET` | A long, random string used for secure session tokens. |
| `MONGODB_URI` | Your production MongoDB Atlas connection string. |
| `GOOGLE_CLIENT_ID` | From Google Cloud Console > Credentials. |
| `GOOGLE_CLIENT_SECRET`| From Google Cloud Console > Credentials. |
| `EMAIL_USER` | Your business email (e.g., `contact@tazdayth.com`). |
| `EMAIL_PASS` | Your App Password (if using Gmail/Outlook). |

---

## 3. Creating the Admin Account
Once your database is connected, you need to create the initial admin account to access the Dashboard.

1. Open a terminal in the `server` folder.
2. Run: `npx ts-node src/create-admin.ts`
3. This will create an account with:
   - **Email**: `admin@tazdayth.com`
   - **Password**: `adminthazdayth`
4. Log in at `/connexion` and change your password immediately in the Dashboard settings.

---

## 4. Deployment Checklist
> [!TIP]
> Use a provider like **Vercel** or **Netlify** for the frontend, and **Render**, **Railway**, or a **VPS (DigitalOcean/Linode)** for the backend.

- [ ] **HTTPS**: Ensure your site is served over SSL (https://). Google Login will NOT work on `http://` (except localhost).
- [ ] **Build**: Run `npm run build` locally to verify there are no compilation errors before deploying.
- [ ] **CORS**: Update `ALLOWED_ORIGIN` in your backend `.env` to match your frontend URL.
- [ ] **Notifications**: Ensure the backend is running 24/7 so the notification polling (`/api/notifications/unread-count`) doesn't fail.

---

## 5. Need Help?
If you encounter any issues during the Google Cloud setup or deployment, please provide the specific error message, and I will guide you through the fix.
