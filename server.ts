import app from "./app.js";
import dotenv from "dotenv";
import colors from "./utils/log-colors.js";
import config from "./config.js";

// Load environment variables from .env and quiet mode
dotenv.config({ quiet: true });

// Get the server port
const PORT = config.port;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${colors.green}${PORT}${colors.reset}`);
  console.log(colors.reset + "─".repeat(50) + colors.reset);
});
