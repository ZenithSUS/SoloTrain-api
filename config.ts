import dotenv from "dotenv";

dotenv.config({ quiet: true });

const config = {
  // Server
  env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 5000,
  apiKey: process.env.API_KEY,
  allowedOrigins: process.env.ALLOWED_ORIGINS || "localhost",
  jwtSecret: process.env.JWT_SECRET || "secret",

  // MongoDB
  mongoUrldev: process.env.MONGODB_URL_DEV || "mongodb://localhost:27017",
  mongoUrlprod: process.env.MONGODB_URL_PROD || "mongodb://localhost:27017",
  dbName:
    process.env.NODE_ENV === "production"
      ? process.env.MONGO_DB_NAME_PROD
      : process.env.MONGO_DB_NAME_DEV,

  // URLS
  backendUrl:
    process.env.NODE_ENV === "production"
      ? process.env.BACKEND_URL_PROD
      : process.env.BACKEND_URL_DEV,
  webRedirectUrl:
    process.env.NODE_ENV === "production"
      ? process.env.WEB_REDIRECT_URL
      : process.env.WEB_REDIRECT_URL_DEV,

  // Google
  googleWebClientId: process.env.GOOGLE_WEB_CLIENT_ID,
  googleSecretKey: process.env.GOOGLE_SECRET_KEY,

  // AI API Keys
  groqApiKey: process.env.GROQ_API_KEY,
  mistralApiKey: process.env.MISTRAL_API_KEY,

  // Email Service
  email: process.env.EMAIL,
  emailPassword: process.env.EMAIL_PASSWORD,
  sendGridApiKey: process.env.SENDGRID_API_KEY,
};

// Check if all required variables are set
if (
  !config.apiKey ||
  !config.allowedOrigins ||
  !config.jwtSecret ||
  !config.mongoUrldev ||
  !config.mongoUrlprod ||
  !config.dbName ||
  !config.backendUrl ||
  !config.webRedirectUrl ||
  !config.googleWebClientId ||
  !config.googleSecretKey ||
  !config.groqApiKey ||
  !config.mistralApiKey ||
  !config.email ||
  !config.emailPassword
) {
  throw new Error("Missing required environment variables");
}

export default config;
