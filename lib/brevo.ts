import * as brevo from "@getbrevo/brevo";
import config from "../config.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ quiet: true });

const Brevo = new brevo.TransactionalEmailsApi();

Brevo.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey,
  config.brevoApiKey || ""
);

export default Brevo;
