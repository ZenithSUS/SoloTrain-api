import { Mistral } from "@mistralai/mistralai";
import dotenv from "dotenv";

// Load environment variables from .env and quiet mode
dotenv.config({ quiet: true });

const apiKey: string = process.env.MISTRAL_API_KEY!;

export const client: Mistral = new Mistral({ apiKey: apiKey });
