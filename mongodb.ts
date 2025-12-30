import { Db, MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";
import config from "./config.js";

// Load environment variables from .env and quiet mode
dotenv.config({ quiet: true });

// Get the MongoDB connection URL
const uri_dev = config.mongoUrldev;
const uri = config.mongoUrlprod;

// Create a new MongoClient with the connection URI
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

const DB_NAME = config.dbName;
const client: MongoClient =
  config.env === "development" ? devConfig : prodConfig;

// Function to connect to the MongoDB database
async function initializeDatabase(): Promise<Db | undefined> {
  try {
    // Connect to the MongoDB database
    await client.connect();

    // Use the correct database name for ping command
    const connection = await client.db(DB_NAME).command({ ping: 1 });

    // Check if connection is successful
    if (connection.ok) {
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
