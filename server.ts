import app from "./app.js";
import dotenv from "dotenv";

// Load environment variables from .env and quiet mode
dotenv.config({ quiet: true });

// Get the server port
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
