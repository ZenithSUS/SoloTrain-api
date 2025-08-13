export type Exercise = {
  name: string;
  shadowName: string;
  sets: number;
  reps: number;
  rest: number;
  completed: boolean;
  duration_min: number;
  instructions: string[];
  targetMuscles: string[];
  formTips: string[];
  modifications?: string[];
  imageKey: string;
};

export type StaticExercise = Omit<
  Exercise,
  "sets" | "reps" | "rest" | "duration_min"
>;

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

export type WorkoutCustomization = {
  goal: "Build Strength" | "Gain Muscle" | "Lose Fat" | "Maintain";
  userId: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  workoutsPerWeek: number;
};
