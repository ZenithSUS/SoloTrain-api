import { Db, MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";

// Load environment variables from .env and quiet mode
dotenv.config({ quiet: true });

// Get the MongoDB connection URL
const uri_dev = process.env.MONGODB_URL_DEV || "mongodb://localhost:27017";
const uri =
  process.env.NODE_ENV === "production"
    ? `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@solotrain.f7ifsle.mongodb.net/?retryWrites=true&w=majority&appName=SoloTrain&tls=true&tlsAllowInvalidCertificates=true`
    : uri_dev;

const devConfig = new MongoClient(uri_dev);

const prodConfig = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
  tls: true,
  tlsAllowInvalidCertificates: true,
  tlsAllowInvalidHostnames: true,
  family: 4, // Force IPv4
});

const DB_NAME =
  process.env.NODE_ENV === "production"
    ? process.env.MONGO_DB_NAME_PROD
    : process.env.MONGO_DB_NAME_DEV;

const client: MongoClient =
  process.env.NODE_ENV === "production" ? prodConfig : devConfig;

// Function to connect to the MongoDB database
async function initializeDatabase(): Promise<Db | undefined> {
  try {
    console.log(
      `Attempting to connect to MongoDB in ${process.env.NODE_ENV} mode...`
    );

    // Connect to the MongoDB database
    await client.connect();

    // Use the correct database name for ping command
    const connection = await client.db(DB_NAME).command({ ping: 1 });

    // Check if connection is successful
    if (connection.ok) {
      console.log("Connected to MongoDB successfully");
      return client.db(DB_NAME);
    }

    return undefined;
  } catch (error) {
    // Handle connection errors with more detailed logging
    console.error("Error connecting to MongoDB:", error);
    console.error(
      "Connection URI (sanitized):",
      uri.replace(/\/\/.*@/, "//***:***@")
    );
    throw error; // Re-throw to handle upstream
  }
}

// Function to close the MongoDB connection
async function closeDatabase(): Promise<void> {
  try {
    // Close the MongoDB connection
    await client.close();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    // Handle disconnection errors
    console.error("Error disconnecting from MongoDB:", error);
  }
}

export { initializeDatabase, closeDatabase };
