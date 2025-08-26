import { WorkoutRepository } from "../repositories/mongoDb/workout-repository.js";

export class WorkoutService {
  // Dependency Injection
  constructor(private workoutRepo: WorkoutRepository) {}

  // Get all workouts by user id
  async getAllByUserId(id: string, dayNumber: number) {
    return await this.workoutRepo.getAllByUserId(id, dayNumber);
  }

  // Update workout by id
  async update(data: any, id: string, dayNumber: number) {
    return await this.workoutRepo.update(data, id, dayNumber);
  }
}
