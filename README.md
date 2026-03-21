# Genweb.ai

MERN stack application for AI-powered website generation. Deployed as a single service on Render.

## Project Structure

```
├── client/          # React + Vite frontend
├── server/          # Express.js API backend
├── package.json     # Root scripts for build & start
├── render.yaml      # Render Blueprint (Infrastructure as Code)
└── README.md
```

## Deploy on Render (Step by Step)

### Prerequisites

- [Render](https://render.com) account
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) database
- [OpenRouter](https://openrouter.ai) API key (for AI)
- [Stripe](https://stripe.com) account (for payments)
- [Firebase](https://firebase.google.com) project (for Google auth)

---

### Step 1: Push Code to GitHub

1. Create a new GitHub repository (if you haven't already).
2. Push your code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

---

### Step 2: Create MongoDB Database

1. Go to [MongoDB Atlas](https://cloud.mongodb.com) and create a free cluster.
2. Create a database user (note the username and password).
3. Add your IP (or `0.0.0.0/0` for all IPs during development).
4. Get your connection string: **Database → Connect → Connect your application**.
5. Copy the URI (e.g. `mongodb+srv://user:pass@cluster.mongodb.net/dbname`).

---

### Step 3: Get API Keys

| Service | What to Get |
|---------|-------------|
| **OpenRouter** | API key from [openrouter.ai/keys](https://openrouter.ai/keys) |
| **Stripe** | Secret key (`sk_test_...` or `sk_live_...`) from [Dashboard → Developers → API keys](https://dashboard.stripe.com/apikeys) |
| **Stripe Webhook** | See Step 6 below |
| **Firebase** | Web API key from Firebase Console → Project Settings → General |
| **JWT** | Generate a random string (e.g. `openssl rand -base64 32`) |

---

### Step 4: Create Web Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com).
2. Click **New +** → **Web Service**.
3. Connect your GitHub repository.
4. Render will auto-detect `render.yaml` if present. If not, use these settings:
   - **Name:** `genweb-ai` (or any name)
   - **Region:** Oregon (or nearest to you)
   **Root Directory:** Leave empty (repo root)
   - **Runtime:** Node
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`

---

### Step 5: Add Environment Variables

In your Render service, go to **Environment** and add:

| Key | Value | Required |
|-----|-------|----------|
| `NODE_ENV` | `production` | Yes |
| `MONGODB_URL` | Your MongoDB Atlas connection string | Yes |
| `JWT_SECRET` | Random secret string (min 32 chars) | Yes |
| `OPENROUTER_API_KEY` | Your OpenRouter API key | Yes |
| `STRIPE_SECRET_KEY` | Your Stripe secret key | Yes |
| `STRIPE_WEBHOOK_SECRET` | From Stripe webhook (Step 6) | Yes |
| `VITE_FIREBASE_API_KEY` | Firebase web API key | Yes |
| `FRONTEND_URL` | Your Render URL, e.g. `https://genweb-ai.onrender.com` | Optional* |

\* If not set, `RENDER_EXTERNAL_URL` (auto-set by Render) is used as fallback.

---

### Step 6: Configure Stripe Webhook

1. After first deploy, copy your service URL (e.g. `https://genweb-ai-xxxx.onrender.com`).
2. Go to [Stripe Webhooks](https://dashboard.stripe.com/webhooks) → **Add endpoint**.
3. **Endpoint URL:** `https://YOUR-APP-NAME.onrender.com/api/stripe/webhook`
4. **Events to send:** Select `checkout.session.completed`
5. Click **Add endpoint**.
6. Open the webhook → **Reveal** signing secret.
7. Copy the value (starts with `whsec_`).
8. Add it to Render as `STRIPE_WEBHOOK_SECRET`.
9. Redeploy the service so the new env var is applied.

---

### Step 7: Deploy

1. Click **Manual Deploy** → **Deploy latest commit** (or push to GitHub for auto-deploy).
2. Wait for the build to finish (client build + server install).
3. Once deployed, visit your service URL (e.g. `https://genweb-ai-xxxx.onrender.com`).

---

### Step 8: Update Firebase Allowed Domains

1. Go to [Firebase Console](https://console.firebase.google.com) → your project.
2. **Authentication → Settings → Authorized domains**.
3. Add your Render domain (e.g. `genweb-ai-xxxx.onrender.com`).

---

## Local Development

### Client (separate dev server)

```bash
cd client
npm install
npm run dev
```

Runs at `http://localhost:5173`. Set `VITE_API_URL=http://localhost:5000` in `client/.env` for API calls.

### Server

```bash
cd server
npm install
# Create server/.env with required variables
npm run dev
```

Runs at `http://localhost:5000`.

### Full production build (test before deploy)

```bash
npm run build
npm start
```

Serves both API and frontend from the server.

---

## Environment Variables Reference

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (Render sets automatically) |
| `NODE_ENV` | `production` on Render |
| `MONGODB_URL` | MongoDB connection string |
| `JWT_SECRET` | Secret for signing JWT tokens |
| `OPENROUTER_API_KEY` | OpenRouter API key for AI |
| `STRIPE_SECRET_KEY` | Stripe API secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `VITE_FIREBASE_API_KEY` | Firebase web API key (baked into client at build) |
| `FRONTEND_URL` | App URL for Stripe callbacks (optional, uses Render URL if unset) |
| `RENDER_EXTERNAL_URL` | Auto-set by Render (used as fallback for FRONTEND_URL) |

---

## Troubleshooting

- **Build fails:** Ensure `npm run build` completes in client (check for missing `VITE_FIREBASE_API_KEY`).
- **Blank page:** Check browser console; ensure `client/dist` exists and SPA fallback is working.
- **API 404:** Verify API routes are under `/api/*` and not overridden by static middleware.
- **CORS errors:** On Render, client and API are same-origin; CORS should not apply. If testing API from Postman, requests may be blocked.
- **Stripe webhook fails:** Confirm webhook URL and `STRIPE_WEBHOOK_SECRET` match your Stripe dashboard.
