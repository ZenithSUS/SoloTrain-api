export type Exercise = {
  name: string;
  shadowName: string;
  sets: number;
  reps: number;
  rest: number;
  duration_min: number;
  instructions: string[];
  targetMuscles: string[];
  formTips: string[];
  modifications?: string[];
  imageKey: string;
  exp: number;
  rank: "E" | "D" | "C" | "B" | "A" | "S";
};

export type StaticExercise = Omit<
  Exercise,
  "sets" | "reps" | "rest" | "duration_min"
>;

export type Workout = {
  _id?: string;
  workoutId: string;
  userId: string;
  date: string;
  dayNumber: number;
  type: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  missionName: string;
  exercises: Exercise[];
  isRestDay: boolean;
  restDayActivity?: string;
  completed: boolean;
  rank: "E" | "D" | "C" | "B" | "A" | "S";
  exp: number;
};

export type WorkoutCustomization = {
  goal: "Build Strength" | "Gain Muscle" | "Lose Fat" | "Maintain";
  userId: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  workoutsPerWeek: number;
};
