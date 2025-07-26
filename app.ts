import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import helmet from "helmet";
import accountRoutes from "./routes/account-routes.js";
import userRoutes from "./routes/user-routes.js";
import progressRoutes from "./routes/progress-routes.js";
import { fileURLToPath } from "url";
import { logger } from "./middleware/logger.js";
import { notFound } from "./middleware/not-found.js";
import { verifyApiKey } from "./middleware/verify-api-key.js";

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
app.use(helmet());
app.use(logger);
app.use(verifyApiKey);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/api/account", accountRoutes);
app.use("/api/user", userRoutes);
app.use("/api/progress", progressRoutes);

// Error handler
app.use(notFound);

export default app;
