import { ShowUser, UpdateUser, User } from "../types/user.js";
import { UserRepository } from "../repositories/user-repository.js";

export class UserService {
  // Dependency Injection
  constructor(private userRepo: UserRepository) {}

  // Create an account
  async createUser(data: User) {
    return this.userRepo.create(data);
  }

  // Delete an account
  async deleteUser(id: string) {
    return this.userRepo.delete(id);
  }

  // Update an account
  async updateUser(data: UpdateUser, id: string) {
    return this.userRepo.update(data, id);
  }

  // Get all accounts
  async getAllUsers(): Promise<ShowUser[] | undefined> {
    return this.userRepo.getAll();
  }

  // Get a single account
  async getUser(id: string): Promise<ShowUser | null | undefined> {
    return this.userRepo.getOne(id);
  }
}
