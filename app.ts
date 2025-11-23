import "./utils/node-cron.js";
import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import helmet from "helmet";
import authRoutes from "./routes/auth-routes.js";
import accountRoutes from "./routes/account-routes.js";
import userRoutes from "./routes/user-routes.js";
import workoutRoutes from "./routes/workout-routes.js";
import progressRoutes from "./routes/progress-routes.js";
import recentRoutes from "./routes/recent-routes.js";
import missionRoutes from "./routes/mission-routes.js";
import statRoutes from "./routes/stat-routes.js";
import mistralRoutes from "./routes/mistral-routes.js";
import groqRoutes from "./routes/groq-routes.js";
import { fileURLToPath } from "url";
import { logger } from "./middleware/logger.js";
import { notFound } from "./middleware/not-found.js";
import { verifyApiKey } from "./middleware/verify-api-key.js";
import { verifyJwtKey } from "./middleware/verify-jwt-key.js";
import { headerConfig } from "./middleware/header-config.js";

// Load environment variables
dotenv.config({ quiet: true });

// Allowed origins
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [];

// Create Express app
const app: Application = express();

// Get current file path
const __filename: string = fileURLToPath(import.meta.url);
const __dirname: string = path.dirname(__filename);

// Middlewares
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);
app.use(logger);
app.use(headerConfig);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/assets", express.static(path.join(__dirname, "assets")));
app.use("/", express.static(path.join(__dirname, "public")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/account", verifyJwtKey, accountRoutes);
app.use("/api/user", verifyJwtKey, userRoutes);
app.use("/api/progress", verifyJwtKey, progressRoutes);
app.use("/api/mission", verifyJwtKey, missionRoutes);
app.use("/api/recent", verifyJwtKey, recentRoutes);
app.use("/api/workout", verifyJwtKey, workoutRoutes);
app.use("/api/stat", verifyJwtKey, statRoutes);
app.use("/api/mistral", verifyJwtKey, mistralRoutes);
app.use("/api/groq", verifyJwtKey, groqRoutes);

// Health Checker
app.get("/api/health", verifyApiKey, (req, res) => {
  res.status(200).json({ message: "Healthy" });
});

// Error handler
app.use(notFound);

export default app;
