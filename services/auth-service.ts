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

  // Logout function
  logoutUser(id: string) {
    return this.authRepo.logout(id);
  }

  // Get email function
  getUserEmail(email: string) {
    return this.authRepo.getUserEmail(email);
  }

  // Refresh token function
  refreshToken(id: string) {
    return this.authRepo.refreshToken(id);
  }

  // Reset password function
  resetPassword(email: string, token: string, password: string) {
    return this.authRepo.resetPassword(email, token, password);
  }

  // Initiate password reset function
  initiatePasswordReset(email: string, baseUrl: string) {
    return this.authRepo.initiatePasswordReset(email, baseUrl);
  }

  // Change password function
  changePassword(id: string, password: string) {
    return this.authRepo.changePassword(id, password);
  }
}
