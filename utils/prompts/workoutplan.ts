import { exercisesByGoal } from "../../data/exercises.js";
import { v4 as uuidv4 } from "uuid";

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

  const workoutId = uuidv4();

  // Get only the exercises for the specified goal
  const goalExercises = exercisesByGoal[goal as keyof typeof exercisesByGoal];
  const exercisesJSON = JSON.stringify(goalExercises, null, 2);

  return `
You are a fitness AI. Generate a **4-week structured workout plan** in JSON format for a user whose goal is "${goal}".

Use ONLY these exercises (do NOT invent others). The available exercises for "${goal}" are:

${exercisesJSON}

CRITICAL OUTPUT FORMAT:
You MUST return a JSON object with a "workouts" key containing an array of 28 workout objects.

EXACT STRUCTURE:
{
  "workouts": [
    {
      "workoutId": "${workoutId}",
      "userId": "${userId}",
      "date": "YYYY-MM-DD",
      "dayNumber": 1,
      "type": "Strength Training",
      "difficulty": "${difficulty}",
      "missionName": "Shadow Extraction Protocol",
      "exercises": [...],
      "isRestDay": false,
      "restDayActivity": null,
      "completed": false,
      "rank": "D",
      "exp": 500
    },
    ... (27 more workouts)
  ]
}

WORKOUT OBJECT STRUCTURE:
Each workout in the "workouts" array must follow this TypeScript interface:

{
  "workoutId": string,         // MUST BE "${workoutId}" for ALL 28 workouts
  "userId": string,            // MUST BE "${userId}" for ALL 28 workouts
  "date": string,              // In "YYYY-MM-DD" format, starting from ${today}
  "dayNumber": number,         // 1 through 28 (sequential)
  "type": string,              // "Strength Training", "Hypertrophy", "Cardio", "Mobility", or "Rest Day"
  "difficulty": string,        // "${difficulty}"
  "missionName": string,       // Solo Leveling themed mission name (unique for each day)
  "exercises": [               // Array of exercise objects (empty array [] for rest days)
    {
      "name": string,
      "shadowName": string,
      "sets": number,
      "reps": number,
      "rest": number,
      "duration_min": number,
      "instructions": string[],
      "targetMuscles": string[],
      "formTips": string[],
      "modifications": string[],
      "execution": string,
      "imageKey": {
        "image1": string,
        "image2": string
      },
      "exp": number,
      "rank": "E" | "D" | "C" | "B" | "A" | "S"
    }
  ],
  "isRestDay": boolean,        // true for rest days, false for workout days
  "restDayActivity": string | null,  // "Light walking", "Gentle stretching", "Complete rest", or null
  "completed": boolean,        // ALWAYS false
  "rank": "E" | "D" | "C" | "B" | "A" | "S",
  "exp": number
}

EXERCISE REQUIREMENTS:
- Use ONLY the exercises provided above for "${goal}"
- DO NOT invent new exercises
- For each exercise, preserve ALL static fields EXACTLY as provided:
  * name
  * shadowName
  * instructions (complete array)
  * targetMuscles (complete array)
  * formTips (complete array)
  * modifications (complete array if present)
  * execution (exact path from exercise data)
  * imageKey (both image1 and image2)
  * rank (exact rank from exercise data)

DYNAMIC FIELDS (generate based on difficulty):
- sets, reps, rest, duration_min
- exp (base exp × difficulty multiplier)

DIFFICULTY SETTINGS:
- beginner: sets=3, reps=8-12, rest=60-90 seconds, duration_min=4-6
- intermediate: sets=4, reps=10-15, rest=45-75 seconds, duration_min=5-7
- advanced: sets=5, reps=12-20, rest=30-60 seconds, duration_min=6-8

EXP MULTIPLIERS:
- beginner: 1.0× (use base exp from exercise data)
- intermediate: 1.5× (multiply base exp by 1.5, round to integer)
- advanced: 2.0× (multiply base exp by 2.0)

WORKOUT RANKING:
Calculate based on average exercise rank:
- All E = E workout
- Mix E and D = D workout
- All D or mix D and C = C workout
- All C or mix C and B = B workout
- All B or mix B and A = A workout
- All A or mix A and S = S workout
- Rest days = E rank, exp = 50

WORKOUT SCHEDULE:
- Exactly ${totalDays} days (28 consecutive days)
- ${totalWorkouts} workout days and ${restDays} rest days
- Distribute rest days evenly (every 2-3 workout days)
- Rest days: type="Rest Day", exercises=[], isRestDay=true, restDayActivity="Light walking"/"Gentle stretching"/"Complete rest"
- Workout days: 3-6 exercises per session, isRestDay=false, restDayActivity=null
- Avoid repeating same exercise more than 3 times across all 28 days
- Dates start from ${today}, increment by 1 day
- dayNumber starts at 1, increments to 28

MISSION NAMES (Solo Leveling themed):
Must be unique for each day. Use terms like:
Shadow, System, Mana, Beast, Monarch, Protocol, Trial, Manifestation, Extraction, Circuit, Dungeon, Guild, Hunter
Examples: "Shadow Extraction Protocol", "Beast King's Trial", "Mana Recovery Circuit", "System Recovery Mode"

CRITICAL REMINDERS:
1. SAME workoutId for all 28 workouts: "${workoutId}"
2. SAME userId for all 28 workouts: "${userId}"
3. All workouts have completed: false
4. Exercise exp = base exp × difficulty multiplier (rounded)
5. Workout exp = sum of all exercise exp (or 50 for rest days)
6. ImageKey objects MUST use closing brace }, NOT closing bracket ]

RESPONSE FORMAT:
Return ONLY the JSON object below. NO markdown, NO code blocks, NO explanatory text.
Start your response with { and end with }

{
  "workouts": [
    // ... 28 workout objects here
  ]
}
`;
};
