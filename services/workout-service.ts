import { WorkoutRepository } from "../repositories/mongoDb/workout-repository.js";

export class WorkoutService {
  // Dependency Injection
  constructor(private workoutRepo: WorkoutRepository) {}

  // Get all workouts by user id
  async getAllByUserId(id: string, workoutId: string, dayNumber: number) {
    return await this.workoutRepo.getAllByUserId(id, workoutId, dayNumber);
  }

  // Get a single workout by id
  async getOne(id: string) {
    return await this.workoutRepo.getOne(id);
  }

  // Get all current workouts by user id
  async getAllCurrentWorkout(id: string, workoutId: string) {
    return await this.workoutRepo.getAllCurrentWorkout(id, workoutId);
  }

  // Get total workouts by user id and workout id
  async getTotalWorkoutsByUserId(id: string, workoutId: string) {
    return await this.workoutRepo.getTotalWorkoutsByUserId(id, workoutId);
  }

  // Update workout by id
  async update(data: any, id: string, dayNumber: number) {
    return await this.workoutRepo.update(data, id, dayNumber);
  }

  // Delete a set workout by workout id
  async deleteSet(id: string, workoutId: string) {
    return await this.workoutRepo.deleteSet(id, workoutId);
  }
}
