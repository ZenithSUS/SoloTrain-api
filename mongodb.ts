import { Db, MongoClient } from "mongodb";
import dotenv from "dotenv";

// Load environment variables from .env and quiet mode
dotenv.config({ quiet: true });

// Get the MongoDB connection URL
const url = process.env.MONGODB_URL || "mongodb://localhost:27017";
const client: MongoClient = new MongoClient(url);

// Function to connect to the MongoDB database
async function initializeDatabase(): Promise<Db | undefined> {
  try {
    // Connect to the MongoDB database
    await client.connect();
    const connection = client.db(process.env.MONGO_DB_NAME);
    console.log("Connected to MongoDB");
    return connection;
  } catch (error) {
    // Handle connection errors
    console.error("Error connecting to MongoDB:", error);
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
