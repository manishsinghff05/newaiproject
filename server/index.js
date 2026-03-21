import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();
import connectDb from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/user.routes.js";
import websiteRouter from "./routes/website.routes.js";
import billingRouter from "./routes/billing.routes.js";
import { stripeWebhook } from "./controllers/stripeWebhook.controller.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// CORS: Same-origin in production (server serves client). Allow localhost for local dev.
const allowedOrigins = process.env.NODE_ENV === "production"
  ? [(process.env.RENDER_EXTERNAL_URL || "").replace(/\/$/, "")].filter(Boolean)
  : ["http://localhost:5173", "http://localhost:5000"];
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) cb(null, true);
      else cb(null, false);
    },
    credentials: true,
  })
);

app.post(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook,
);
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(cookieParser());

// API routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/website", websiteRouter);
app.use("/api/billing", billingRouter);

// Serve client static files (React build)
const clientPath = path.join(__dirname, "../client/dist");
const indexPath = path.join(clientPath, "index.html");
app.use(express.static(clientPath));

// SPA fallback - serve index.html for non-API routes
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api")) return next();
  res.sendFile(indexPath, (err) => {
    if (err) res.status(500).send("Client build not found. Run: npm run build");
  });
});

const startServer = async () => {
  try {
    await connectDb();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
