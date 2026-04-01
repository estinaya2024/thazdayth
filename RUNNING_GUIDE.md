# 🛠️ TAZDAYTH - Developer Running Guide

This guide explains how to start, manage, and test the TAZDAYTH platform on your local machine.

## 1. 🚀 Starting the Application

The project uses a "MERN" stack (MongoDB, Express, React, Node). Both the frontend and backend must be running simultaneously.

| Command | Meaning |
| :--- | :--- |
| `npm run dev:all` | **Recommended**. Starts both the Frontend (Vite) and Backend (Nodemon) in a single terminal. |
| `npm run dev` | Starts only the Frontend. |
| `npm run dev:server` | Starts only the Backend with automatic restart on code changes. |
| `npm run build` | Compiles the project for production. Always run this before deploying to check for errors. |

---

## 2. 📧 Testing Emails Locally
You don't need a real SMTP server to test registration or password resets! The app uses **Ethereal Email** for local development.

### How to see sent emails:
1. Trigger an action (e.g., Register or click "Forgot Password").
2. Check the **Terminal** where the backend is running.
3. Look for a big 📬 emoji.
4. Click the link provided (e.g., `https://ethereal.email/explorer/messages/...`).
5. You will see the beautiful HTML email exactly as your customers would!

---

## 3. 🔐 Managing the Admin Account
The dashboard is restricted to the `owner` role.

### Initial Setup:
1. Run `npx ts-node server/src/create-admin.ts` to ensure the default admin account exists.
2. **Accessing the Dashboard**: 
   - Click the **User (Connexion) Icon** in the top right.
   - Log in with `admin@tazdayth.com` / `adminthazdayth`.
   - Once logged in, click the User Icon again. You will see the **"Tableau de bord"** link.

---

## 4. 📁 Project Structure
- `src/`: The Frontend (React + Tailwind).
- `server/`: The Backend (Node + Express + Mongoose).
- `dist/`: Where the compiled code goes after `npm run build`.

---

## 5. Troubleshooting
- **Port 5000 Already in Use**: If you see an `EADDRINUSE` error, it means an old version of the server didn't close properly. 
  - **Windows**: Run `netstat -ano | findstr :5000` to find the PID, then `taskkill /PID <PID> /F`.
- **API Errors**: Ensure your `.env` file is present in the root folder with the correct `VITE_API_URL`.
