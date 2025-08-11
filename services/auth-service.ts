import { AuthRepository } from "../repositories/mongoDb/auth-repository.js";
import { CreateAccount } from "../types/account.js";

export class AuthService {
  // Dependency injection
  constructor(private authRepo: AuthRepository) {}

  // Login function
  loginUser(email: string, password: string) {
    return this.authRepo.login(email, password);
  }

  // Register function
  registerUser(data: CreateAccount) {
    return this.authRepo.register(data);
  }
}
