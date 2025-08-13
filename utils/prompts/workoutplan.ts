import { exercisesByGoal } from "../../data/exercises.js";

export const workoutPlanGenerator = (
  goal: "Build Strength" | "Gain Muscle" | "Lose Fat" | "Maintain",
  userId: string,
  difficulty: "beginner" | "intermediate" | "advanced" = "intermediate",
  workoutsPerWeek: number = 4
) => {
  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Manila",
  });

  const totalDays = 28;
  const totalWorkouts = workoutsPerWeek * 4;
  const restDays = totalDays - totalWorkouts;

  // Get only the exercises for the specified goal
  const goalExercises = exercisesByGoal[goal as keyof typeof exercisesByGoal];
  const exercisesJSON = JSON.stringify(goalExercises, null, 2);

  return `
You are a fitness AI. Generate a **4-week structured workout plan** in JSON format for a user whose goal is "${goal}".

Use ONLY these exercises (do NOT invent others). The available exercises for "${goal}" are:

${exercisesJSON}

The plan must strictly follow this TypeScript interface:

Workout = {
  "_id"?: string,              // Optional
  "userId": string,            // Always "${userId}"
  "date": string,              // In "YYYY-MM-DD" format
  "type": string,              // e.g., "Strength Training", "Hypertrophy", "Cardio", "Mobility", "Rest Day"
  "difficulty": string,        // "${difficulty}"
  "missionName": string,       // Solo Leveling themed mission name
  "exercises": [
    {
      "name": string,
      "shadowName": string,
      "sets": number,
      "reps": number,
      "rest": number,           // Rest time in seconds
      "completed": boolean,     // Always false initially
      "duration_min": number,
      "instructions": string[],
      "targetMuscles": string[],
      "formTips": string[],
      "modifications"?: string[],
      "imageKey": string
    }
  ],
  "isRestDay"?: boolean,
  "restDayActivity"?: string
}

IMPORTANT:
- Use ONLY the exercises provided above for the goal "${goal}".
- DO NOT generate or invent new exercises.
- For each exercise, preserve all static fields exactly as provided:
  name, shadowName, instructions, targetMuscles, formTips, modifications, imageKey.
- Generate these fields dynamically based on difficulty:
  - sets
  - reps
  - rest (seconds)
  - duration_min (minutes)
- Do NOT include "weight" since the user has no equipment.
- Set "completed" to false for all exercises.

DIFFICULTY SETTINGS:
- beginner: sets=3, reps=8-12, rest=60-90, duration_min=4-6
- intermediate: sets=4, reps=10-15, rest=45-75, duration_min=5-7
- advanced: sets=5, reps=6-20 (vary per exercise), rest=30-60, duration_min=6-8

WORKOUT SCHEDULE:
- Exactly ${totalDays} days (28 days)
- ${totalWorkouts} workout days and ${restDays} rest days
- Rest days: type="Rest Day", exercises=[], isRestDay=true, restDayActivity="Light walking", "Gentle stretching", or "Complete rest"
- Workout days: 3-6 exercises per day, chosen from the provided pool
- Avoid repeating the same exercise more than 3 times in 4 weeks
- Distribute rest days evenly (every 2-3 workout days)
- Use unique Solo Leveling themed mission names for each day
- Dates start from ${today}, in "YYYY-MM-DD" format

SOLO LEVELING MISSION THEMES:
- Motivating, immersive names inspired by Solo Leveling manhwa/anime
- Examples (workout): "Shadow Extraction Protocol", "Iron Body Manifestation", "Mana Recovery Circuit", "Beast King's Trial"
- Examples (rest): "Shadow Monarch's Meditation", "System Recovery Mode", "Mana Restoration Chamber"
- Use terms like: Shadow, System, Mana, Beast, Monarch, Protocol, Trial, Manifestation, Extraction, Circuit, Dungeon, Guild, Hunter

OUTPUT FORMAT:
- Strict JSON array, no markdown, no code blocks, no extra text
- Numeric values as numbers, booleans lowercase true/false
- String arrays properly formatted

EXERCISE EXAMPLE (from provided data):
{
  "name": "Bodyweight Squats",
  "shadowName": "Shadow Stability Drill",
  "sets": 4,
  "reps": 12,
  "rest": 60,
  "completed": false,
  "duration_min": 5,
  "instructions": [
    "Stand with feet shoulder-width apart",
    "Lower hips back and down as if sitting on a chair",
    "Keep chest up and knees tracking over toes",
    "Rise back to standing position"
  ],
  "targetMuscles": ["Quads", "Glutes", "Hamstrings"],
  "formTips": [
    "Avoid knees collapsing inward",
    "Keep weight on heels",
    "Maintain a neutral spine"
  ],
  "modifications": [
    "Use a chair for support if needed",
    "Add jump squats for advanced"
  ],
  "imageKey": "bodyweight_squat_01"
}

RESPOND WITH ONLY THE RAW JSON ARRAY - NO MARKDOWN, NO CODE BLOCKS, NO OTHER TEXT.
`;
};
