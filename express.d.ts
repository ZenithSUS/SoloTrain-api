import { JwtLoad } from "./types/jwt-load.ts";

declare global {
  namespace Express {
    // Augment the User interface
    interface User extends JwtLoad {}
  }
}

export {};
