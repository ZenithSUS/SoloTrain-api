import {
  Exercise,
  StaticExercise,
  Workout,
  WorkoutCustomization,
} from "../types/workout.js";
import { exercisesByGoal } from "../data/exercises.js";
import { REST_DAY_ACTIVITIES } from "../data/rest-day.js";
import { MISSION_NAMES } from "../data/mission-name.js";
import { WORKOUT_TYPES } from "../data/workout-type.js";
import { initializeDatabase } from "../mongodb.js";
import { InsertManyResult } from "mongoose";

export class WorkoutPlanGenerator {
  private static collectionName = "workout";

  private static async collection() {
    const connection = await initializeDatabase();
    if (!connection) {
      throw new Error("Database connection not initialized");
    }
    return connection.collection(this.collectionName);
  }

  private static async storeWorkout(workout: Workout[]) {
    const collection = await this.collection();
    const workoutsToInsert = workout.map((workout) => ({
      userId: workout.userId,
      date: new Date(workout.date),
      type: workout.type,
      exercises: workout.exercises,
      difficulty: workout.difficulty,
      missionName: workout.missionName,
      dayNumber: workout.dayNumber,
      isRestDay: workout.isRestDay,
      restDayActivity: workout.restDayActivity,
      completed: false,
      exp: workout.exp,
    }));

    const result = await collection.insertMany(workoutsToInsert, {
      ordered: false,
    });
    return result;
  }

  // Get difficulty multipliers
  private static getDifficultyMultipliers(
    difficulty: WorkoutCustomization["difficulty"]
  ) {
    switch (difficulty) {
      case "beginner":
        return { sets: 1, reps: 0.7, rest: 1.5, duration: 0.8, exp: 1 };
      case "intermediate":
        return { sets: 1.2, reps: 1, rest: 1, duration: 1, exp: 1.5 };
      case "advanced":
        return { sets: 1.5, reps: 1.3, rest: 0.7, duration: 1.2, exp: 2 };
      default:
        return { sets: 1, reps: 1, rest: 1, duration: 1, exp: 1 };
    }
  }

  // Get base difficulty params
  private static getBaseDifficultyParams(
    difficulty: WorkoutCustomization["difficulty"],
    goal?: WorkoutCustomization["goal"]
  ) {
    let baseParams;

    switch (difficulty) {
      case "beginner":
        baseParams = {
          baseSets: 2,
          baseReps: 8,
          baseRest: 90,
          baseDurationMin: 4,
        };
        break;
      case "intermediate":
        baseParams = {
          baseSets: 3,
          baseReps: 12,
          baseRest: 60,
          baseDurationMin: 5,
        };
        break;
      case "advanced":
        baseParams = {
          baseSets: 4,
          baseReps: 15,
          baseRest: 45,
          baseDurationMin: 7,
        };
        break;
      default:
        baseParams = {
          baseSets: 3,
          baseReps: 12,
          baseRest: 60,
          baseDurationMin: 5,
        };
    }

    // Adjust based on goal
    if (goal === "Build Strength") {
      // Strength: Higher sets, lower reps, longer rest
      baseParams.baseSets += 1;
      baseParams.baseReps = Math.floor(baseParams.baseReps * 0.7);
      baseParams.baseRest += 30;
    } else if (goal === "Lose Fat") {
      // Fat loss: More reps, shorter rest, longer duration
      baseParams.baseReps = Math.floor(baseParams.baseReps * 1.3);
      baseParams.baseRest -= 15;
      baseParams.baseDurationMin += 10;
    } else if (goal === "Gain Muscle") {
      // Muscle gain: Moderate adjustments for hypertrophy
      baseParams.baseReps = Math.floor(baseParams.baseReps * 1.1);
      baseParams.baseRest += 10;
    }
    // Maintain uses default values

    return baseParams;
  }

  private static createExerciseFromStatic(
    staticExercise: StaticExercise,
    difficulty: WorkoutCustomization["difficulty"],
    goal?: WorkoutCustomization["goal"]
  ): Exercise {
    const baseParams = this.getBaseDifficultyParams(difficulty, goal);
    const multipliers = this.getDifficultyMultipliers(difficulty);

    return {
      ...staticExercise,
      sets: Math.max(1, Math.round(baseParams.baseSets * multipliers.sets)),
      reps: Math.max(1, Math.round(baseParams.baseReps * multipliers.reps)),
      rest: Math.max(30, Math.round(baseParams.baseRest * multipliers.rest)),
      exp: staticExercise.exp * multipliers.exp,
      duration_min: Math.max(
        10,
        Math.round(baseParams.baseDurationMin * multipliers.duration)
      ),
    };
  }

  private static shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  private static selectExercisesForWorkout(
    goal: WorkoutCustomization["goal"],
    difficulty: WorkoutCustomization["difficulty"],
    dayNumber: number
  ): Exercise[] {
    // Get exercises for the specific goal
    const goalExercises = exercisesByGoal[goal as keyof typeof exercisesByGoal];

    // Determine exercise count based on difficulty and goal
    let exerciseCount: number;

    if (goal === "Lose Fat") {
      // Fat loss workouts tend to have more exercises for higher volume
      exerciseCount =
        difficulty === "beginner" ? 4 : difficulty === "intermediate" ? 6 : 7;
    } else if (goal === "Build Strength") {
      // Strength workouts focus on fewer, more intense exercises
      exerciseCount =
        difficulty === "beginner" ? 3 : difficulty === "intermediate" ? 4 : 5;
    } else {
      // Muscle gain and maintain have moderate exercise counts
      exerciseCount =
        difficulty === "beginner" ? 4 : difficulty === "intermediate" ? 5 : 6;
    }

    // Ensure we don't exceed available exercises
    exerciseCount = Math.min(exerciseCount, goalExercises.length);

    // Shuffle exercises to create variety between workouts
    const shuffledExercises = this.shuffleArray([...goalExercises]);

    // Select exercises with some variety based on day number
    const startIndex =
      (dayNumber - 1) % Math.max(1, goalExercises.length - exerciseCount);
    const selectedStatic = shuffledExercises.slice(
      startIndex,
      startIndex + exerciseCount
    );

    // If we don't have enough, fill from the beginning
    while (selectedStatic.length < exerciseCount) {
      selectedStatic.push(
        shuffledExercises[selectedStatic.length % shuffledExercises.length]
      );
    }

    return selectedStatic.map((staticEx) =>
      this.createExerciseFromStatic(staticEx, difficulty, goal)
    );
  }

  // Create a rest day
  private static createRestDay(
    userId: string,
    date: string,
    dayNumber: number
  ): Workout {
    return {
      userId,
      date,
      dayNumber,
      type: "Rest Day",
      difficulty: "beginner" as const,
      missionName: `Recovery and Preparation`,
      exercises: [],
      isRestDay: true,
      restDayActivity:
        REST_DAY_ACTIVITIES[
          Math.floor(Math.random() * REST_DAY_ACTIVITIES.length)
        ],
      exp: 50,
      completed: false,
    };
  }

  // Create a workout day
  private static createWorkoutDay(
    customization: WorkoutCustomization,
    date: string,
    dayNumber: number
  ): Workout {
    const exercises = this.selectExercisesForWorkout(
      customization.goal,
      customization.difficulty,
      dayNumber
    );

    // Set exp based on exercises
    const exp = exercises.reduce((acc, exercise) => acc + exercise.exp, 0);

    // Select workout type based on goal
    let workoutType: string;
    switch (customization.goal) {
      case "Build Strength":
        workoutType = WORKOUT_TYPES[Math.floor(Math.random() * 4)]; // First 4 types
        break;
      case "Gain Muscle":
        workoutType = WORKOUT_TYPES[5 + Math.floor(Math.random() * 3)]; // Types 5-8
        break;
      case "Lose Fat":
        workoutType = WORKOUT_TYPES[9 + Math.floor(Math.random() * 2)]; // Types 9-10
        break;
      case "Maintain":
        workoutType =
          WORKOUT_TYPES[Math.floor(Math.random() * WORKOUT_TYPES.length)]; // Any type
        break;
      default:
        workoutType =
          WORKOUT_TYPES[Math.floor(Math.random() * WORKOUT_TYPES.length)];
    }

    const missionName = MISSION_NAMES[dayNumber - 1] || `Shadow Hunter Mission`;

    return {
      userId: customization.userId,
      date,
      dayNumber,
      type: workoutType,
      difficulty: customization.difficulty,
      missionName,
      exercises,
      isRestDay: false,
      exp: exp,
      completed: false,
    };
  }

  private static calculateRestDays(workoutsPerWeek: number): number[] {
    const restDaysPerWeek = 7 - workoutsPerWeek;
    const restDays: number[] = [];

    // Distribute rest days evenly across 28 days
    for (let week = 0; week < 4; week++) {
      const weekStart = week * 7;
      const restDaysThisWeek = restDaysPerWeek;

      // Common rest day patterns
      if (workoutsPerWeek === 3) {
        // 3 workouts per week: Rest on days 3, 6, 7 of each week
        restDays.push(weekStart + 3, weekStart + 6, weekStart + 7);
      } else if (workoutsPerWeek === 4) {
        // 4 workouts per week: Rest on days 4, 6, 7 of each week
        restDays.push(weekStart + 4, weekStart + 6, weekStart + 7);
      } else if (workoutsPerWeek === 5) {
        // 5 workouts per week: Rest on days 6, 7 of each week
        restDays.push(weekStart + 6, weekStart + 7);
      } else if (workoutsPerWeek === 6) {
        // 6 workouts per week: Rest on day 7 of each week
        restDays.push(weekStart + 7);
      } else {
        // Default distribution for other cases
        for (let i = 0; i < restDaysThisWeek; i++) {
          restDays.push(weekStart + 7 - restDaysThisWeek + i);
        }
      }
    }

    return restDays.map((day) => day + 1); // Convert to 1-based indexing
  }

  public static async generate28DayWorkoutPlan(
    customization: WorkoutCustomization
  ): Promise<InsertManyResult<Workout[]>> {
    const workoutPlan: Workout[] = [];
    const restDayNumbers = this.calculateRestDays(
      customization.workoutsPerWeek
    );

    // Generate 28 days of workouts
    for (let day = 1; day <= 28; day++) {
      // Calculate date (you might want to use a proper date library)
      const date = new Date();
      date.setDate(date.getDate() + day - 1);
      const dateString = date.toISOString().split("T")[0];

      if (restDayNumbers.includes(day)) {
        // Create rest day
        workoutPlan.push(
          this.createRestDay(customization.userId, dateString, day)
        );
      } else {
        // Create workout day
        workoutPlan.push(this.createWorkoutDay(customization, dateString, day));
      }
    }

    return await this.storeWorkout(workoutPlan);
  }

  // Helper method to preview the workout schedule structure
  public static previewSchedule(workoutsPerWeek: number): string {
    const restDays = this.calculateRestDays(workoutsPerWeek);
    let schedule = "";

    for (let week = 1; week <= 4; week++) {
      schedule += `Week ${week}:\n`;
      for (let day = 1; day <= 7; day++) {
        const dayNumber = (week - 1) * 7 + day;
        const isRestDay = restDays.includes(dayNumber);
        schedule += `  Day ${dayNumber}: ${
          isRestDay ? "🛌 Rest" : "💪 Workout"
        }\n`;
      }
      schedule += "\n";
    }

    return schedule;
  }
}

export function generate28DayWorkoutPlan(customization: WorkoutCustomization) {
  return WorkoutPlanGenerator.generate28DayWorkoutPlan(customization);
}
