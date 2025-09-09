import { Db, MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";

// Load environment variables from .env and quiet mode
dotenv.config({ quiet: true });

// Get the MongoDB connection URL

const uri_dev = process.env.MONGODB_URL || "mongodb://localhost:27017";
const uri =
  process.env.NODE_ENV === "production"
    ? `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@solotrain.f7ifsle.mongodb.net/?retryWrites=true&w=majority&appName=SoloTrain`
    : uri_dev;

const client: MongoClient = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Function to connect to the MongoDB database
async function initializeDatabase(): Promise<Db | undefined> {
  try {
    // Connect to the MongoDB database
    await client.connect();
    const connection = await client
      .db(process.env.MONGO_DB_NAME)
      .command({ ping: 1 });

    // Check if connection is successful
    if (connection.ok) {
      console.log("Connected to MongoDB");
      return client.db(process.env.MONGO_DB_NAME);
    }

    return undefined;
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
