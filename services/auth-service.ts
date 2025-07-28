import { AuthRepository } from "../repositories/authentication/auth.js";

export class AuthService {
  // Dependency injection
  constructor(private authRepo: AuthRepository) {}

  // Login function
  loginUser(email: string, password: string) {
    return this.authRepo.login(email, password);
  }
}
