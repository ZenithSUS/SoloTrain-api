export type Exercise = {
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  rest: number;
  notes?: string;
  completed: boolean;
  duration_min: number;
  instructions: string[];
  targetMuscles: string[];
  formTips: string[];
  modifications?: string[];
};

export type Workout = {
  _id?: string;
  userId: string;
  date: string;
  type: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  missionName: string;
  exercises: Exercise[];
  isRestDay?: boolean;
  restDayActivity?: string;
};

export type WorkoutForm = Omit<Workout, "_id" | "userId">;

export type WorkoutCustomization = {
  goal: string;
  userId: string;
  hasEquipment: boolean;
  difficulty: "beginner" | "intermediate" | "advanced";
  workoutsPerWeek: number;
};
