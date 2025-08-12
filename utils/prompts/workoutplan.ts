import { exercisesByGoal } from "../../data/exercises.js";

export const workoutPlanGenerator = (
  goal: string,
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

  const exercisesJSON = JSON.stringify(exercisesByGoal, null, 2);
  return `
You are a fitness AI. Generate a **4-week structured workout plan** in JSON format for a user whose goal is "${goal}".

Only use these exercises (do NOT invent others). The static exercise data for each goal is:

${exercisesJSON}

From the above data, use ONLY the exercises under the "${goal}" key for this user’s workout plan. Ignore all other goals' exercises.

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
      "weight"?: number,       // Optional, only for weighted exercises (do NOT use here)
      "rest": number,          // Rest time in seconds
      "completed": boolean,    // Always false initially
      "duration_min": number,
      "instructions": string[],
      "targetMuscles": string[],
      "formTips": string[],
      "modifications"?: string[]
      "imageKey": string
    }
  ],
  "isRestDay"?: boolean,
  "restDayActivity"?: string
}

IMPORTANT:
- Use ONLY exercises from a predefined static bodyweight exercise database for the goal "${goal}" (database provided separately).
- DO NOT generate or invent new exercises.
- For each exercise, preserve all static fields except generate these dynamically per difficulty:
  - sets
  - reps
  - rest (seconds)
  - duration_min (minutes)
- Do NOT include "weight" since user has no equipment.

DIFFICULTY SETTINGS:
- beginner: sets=3, reps=8-12, rest=60-90, duration_min=4-6
- intermediate: sets=4, reps=10-15, rest=45-75, duration_min=5-7
- advanced: sets=5, reps=6-20 (vary per exercise), rest=30-60, duration_min=6-8

WORKOUT SCHEDULE:
- Generate exactly ${totalDays} days (28 days)
- Include ${totalWorkouts} workout days and ${restDays} rest days
- Rest days: type="Rest Day", exercises=[], isRestDay=true, restDayActivity="Light walking", "Gentle stretching", or "Complete rest"
- Workout days: 3-6 exercises per day, chosen from static pool for the goal
- Avoid repeating the same exercise >3 times in 4 weeks
- Distribute rest days evenly (every 2-3 workout days)
- Use Solo Leveling themed mission names (unique per day)
- The date field must be in "YYYY-MM-DD" format and start from ${today}

SOLO LEVELING MISSION THEMES:
- Create epic mission names inspired by Solo Leveling manhwa/anime
- Examples for workout days: "Shadow Extraction Protocol", "Iron Body Manifestation", "Mana Recovery Circuit", "Beast King's Trial"
- Examples for rest days: "Shadow Monarch's Meditation", "System Recovery Mode", "Mana Restoration Chamber"
- Make each mission name unique and thematically appropriate to the workout type
- Use terminology like: Shadow, System, Mana, Beast, Monarch, Protocol, Trial, Manifestation, Extraction, Circuit, Dungeon, Guild, Hunter
- Mission names should be motivating and immersive, not too generic or unoriginal

OUTPUT FORMAT:
- Strict JSON array, no markdown or extra text
- Each workout includes all required fields matching the Workout type above
- Numeric values as numbers, booleans lowercase true/false
- String arrays properly formatted

EXERCISE EXAMPLE:
{
  "name": "Push-Ups",
  "shadowName": "Shadow Chest Manifestation",
  "sets": 3,
  "reps": 12,
  "rest": 60,
  "completed": false,
  "duration_min": 4,
  "instructions": [
    "Start in plank position with hands shoulder-width apart",
    "Lower your body until chest nearly touches the floor",
    "Push through palms to return to starting position",
    "Keep body in straight line throughout movement"
  ],
  "targetMuscles": ["Chest", "Triceps", "Shoulders", "Core"],
  "formTips": [
    "Keep core engaged throughout",
    "Don't let hips sag or pike up",
    "Full range of motion for maximum benefit"
  ],
  "modifications": [
    "Knee push-ups for beginners",
    "Incline push-ups using stairs or wall",
    "Diamond push-ups for advanced challenge"
  ]
  "imageKey": "pushup_01"
}

RESPOND WITH ONLY THE RAW JSON ARRAY - NO MARKDOWN, NO CODE BLOCKS, NO OTHER TEXT.
`;
};
