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
  "dayNumber": number,         // 1-28
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
      "duration_min": number,
      "instructions": string[],
      "targetMuscles": string[],
      "formTips": string[],
      "modifications"?: string[],
      "imageKey": string,
      "exp": number
    }
  ],
  "isRestDay"?: boolean,
  "restDayActivity"?: string,
  "completed": boolean,
  "exp": number
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
  - exp (apply difficulty multiplier to base exp value)
- Do NOT include "weight" since the user has no equipment.
- Set "completed" to false for all exercises.

DIFFICULTY SETTINGS:
- beginner: sets=3, reps=8-12, rest=60-90, duration_min=4-6
- intermediate: sets=4, reps=10-15, rest=45-75, duration_min=5-7
- advanced: sets=5, reps=6-20 (vary per exercise), rest=30-60, duration_min=6-8

EXP MULTIPLIERS BY DIFFICULTY:
- beginner: 1.0x (base exp value)
- intermediate: 1.5x (multiply base exp by 1.5, round to nearest integer)
- advanced: 2.0x (multiply base exp by 2.0)

Apply the exp multiplier to each exercise's base exp value based on the difficulty level "${difficulty}".
For example: if base exp is 150 and difficulty is "intermediate", final exp = 150 * 1.5 = 225.

WORKOUT SCHEDULE:
- Exactly ${totalDays} days (28 days)
- ${totalWorkouts} workout days and ${restDays} rest days
- Rest days: type="Rest Day", exercises=[], isRestDay=true, restDayActivity="Light walking", "Gentle stretching", or "Complete rest"
- Workout days: 3-6 exercises per day, chosen from the provided pool
- Avoid repeating the same exercise more than 3 times in 4 weeks
- Distribute rest days evenly (every 2-3 workout days)
- Use unique Solo Leveling themed mission names for each day
- Dates start from ${today}, in "YYYY-MM-DD" format
- "dayNumber" must start at 1 and increment sequentially by 1 up to 28 (i.e., dayNumber: 1 for the first day, 2 for the second, and so on through 28)

TOTAL WORKOUT EXP CALCULATION:
- For workout days: sum all exercise exp values (after applying difficulty multiplier)
- For rest days: exp = 50 (base rest day exp, no multiplier applied)

SOLO LEVELING MISSION THEMES:
- Motivating, immersive names inspired by Solo Leveling manhwa/anime
- Examples (workout): "Shadow Extraction Protocol", "Iron Body Manifestation", "Mana Recovery Circuit", "Beast King's Trial"
- Examples (rest): "Shadow Monarch's Meditation", "System Recovery Mode", "Mana Restoration Chamber"
- Use terms like: Shadow, System, Mana, Beast, Monarch, Protocol, Trial, Manifestation, Extraction, Circuit, Dungeon, Guild, Hunter

OUTPUT FORMAT:
- Strict JSON array, no markdown, no code blocks, no extra text
- Numeric values as numbers, booleans lowercase true/false
- String arrays properly formatted

EXERCISE EXAMPLE (from provided data with intermediate difficulty applied):
{
  "name": "Bodyweight Squats",
  "shadowName": "Shadow Stability Drill",
  "sets": 4,
  "reps": 12,
  "rest": 60,
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
  "imageKey": "bodyweight_squat_01",
  "exp": 173
}

Note: In the example above, base exp was 115, multiplied by 1.5 for intermediate difficulty = 172.5, rounded to 173.

RESPOND WITH ONLY THE RAW JSON ARRAY - NO MARKDOWN, NO CODE BLOCKS, NO OTHER TEXT.
`;
};
