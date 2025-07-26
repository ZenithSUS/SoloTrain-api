// Workout Interfaces
export type Exercise = {
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  rest: number;
  notes?: string;
  completed: boolean;
};

export type Workout = {
  _id: string;
  userId: string;
  date: Date;
  type: string;
  exercises: Exercise;
  duration_min: number;
};

export type WorkoutForm = Omit<Workout, "_id" | "userId">;
