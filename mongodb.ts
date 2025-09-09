import { Db, MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";

// Load environment variables from .env and quiet mode
dotenv.config({ quiet: true });

// Get the MongoDB connection URL

const uri_dev = process.env.MONGODB_URL_DEV || "mongodb://localhost:27017";
const uri =
  process.env.NODE_ENV === "production"
    ? `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@solotrain.f7ifsle.mongodb.net/?retryWrites=true&w=majority&appName=SoloTrain`
    : uri_dev;

const devConfig = new MongoClient(uri_dev);
const prodConfig = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
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
    // Connect to the MongoDB database
    await client.connect();
    const connection = await client.db("fitness").command({ ping: 1 });

    // Check if connection is successful
    if (connection.ok) {
      console.log("Connected to MongoDB");
      return client.db(DB_NAME);
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
