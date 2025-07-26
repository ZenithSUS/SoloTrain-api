import { UpdateAccount, CreateAccount } from "../types/account.js";
import { AccountRepository } from "../repositories/mongoDb/account-repository.js";
import { DeleteResult } from "mongoose";

export class AccountService {
  constructor(private accountRepo: AccountRepository) {}

  // Create a new account
  async createAccount(data: CreateAccount) {
    return this.accountRepo.create(data);
  }

  // Delete an account
  async deleteAccount(id: string): Promise<DeleteResult | undefined> {
    return this.accountRepo.delete(id);
  }

  // Update a user
  async updateAccount(data: UpdateAccount, id: string) {
    return this.accountRepo.update(data, id);
  }

  // Get all accounts
  async getAllAccounts() {
    return this.accountRepo.getAll();
  }

  // Get a single account
  async getAccount(id: string) {
    return this.accountRepo.getOne(id);
  }
}
