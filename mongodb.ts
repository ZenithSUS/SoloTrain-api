import { MongoClient } from "mongodb";
import dotenv from "dotenv";

// Load environment variables from .env and quiet mode
dotenv.config({ quiet: true });

// Get the MongoDB connection URL
const url = process.env.MONGODB_URL || "mongodb://localhost:27017";
const client = new MongoClient(url);

// Function to connect to the MongoDB database
async function initializeDatabase(): Promise<MongoClient | undefined> {
  try {
    // Connect to the MongoDB database
    const connection = await client.connect();
    console.log("Connected to MongoDB");
    return connection;
  } catch (error) {
    // Handle connection errors
    console.error("Error connecting to MongoDB:", error);
  }
}

export default initializeDatabase;
