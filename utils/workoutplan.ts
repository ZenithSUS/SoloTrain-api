import { exercisesByGoal } from "../data/exercises.js";
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
- beginner: sets=3, reps=8-10, rest=90 seconds, duration_min=2 (per set timer)
- intermediate: sets=4, reps=10-12, rest=60 seconds, duration_min=1.5 (per set timer)
- advanced: sets=5, reps=12-15, rest=45 seconds, duration_min=1 (per set timer)

DURATION CALCULATION:
duration_min is the TIME PER SET (not total exercise time).
Calculate as: (reps × 3 seconds + rest period) / 60, round to 1 decimal
- Beginner: (10 reps × 3s + 90s rest) / 60 = 2 minutes per set
- Intermediate: (12 reps × 3s + 60s rest) / 60 = 1.6 minutes per set (use 1.5)
- Advanced: (15 reps × 3s + 45s rest) / 60 = 1.3 minutes per set (use 1)

Total exercise time = sets × duration_min
- Beginner: 3 sets × 2 min = 6 minutes total
- Intermediate: 4 sets × 1.5 min = 6 minutes total  
- Advanced: 5 sets × 1 min = 5 minutes total

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
- Workout days: MINIMUM 3 exercises, MAXIMUM 5 exercises per session
- CRITICAL: Each workout day MUST have at least 3 exercises and no more than 5 exercises
- Never create workout days with only 1 or 2 exercises
- isRestDay=false, restDayActivity=null for workout days
- Avoid repeating same exercise more than 3 times across all 28 days
- Dates start from ${today}, increment by 1 day
- dayNumber starts at 1, increments to 28

EXERCISE DISTRIBUTION PER WORKOUT:
- Beginner difficulty: 3-4 exercises per workout (to avoid overwhelming)
- Intermediate difficulty: 4-5 exercises per workout (balanced workload)
- Advanced difficulty: 4-5 exercises per workout (optimal volume)
- Ensure variety: target different muscle groups within each workout
- Follow proper workout structure: compound movements first, isolation movements last

MISSION NAMES (Solo Leveling themed):
Must be unique for each day. Choose from these themes:

WORKOUT MISSIONS:
- "Shadow Extraction Protocol"
- "Beast King's Trial" 
- "Monarch's Ascension"
- "Iron Body Manifestation"
- "Hunter's Gauntlet"
- "Mana Circuit Overload"
- "Dimensional Rift Training"
- "Shadow Soldier Summoning"
- "System Quest: Power Surge"
- "Dungeon Boss Preparation"
- "Guild Advancement Trial"
- "Double Dungeon Challenge"
- "Arise Protocol Initiation"
- "Sovereign's Domain"
- "Shadow Monarch Training"
- "System Penalty Workout"
- "Daily Quest: Strength"
- "Bloodlust Activation"
- "Hunter Rank Examination"
- "Barrier Break Session"

REST DAY MISSIONS:
- "System Recovery Mode"
- "Mana Regeneration Phase"
- "Shadow Restoration"
- "Hunter's Respite"
- "System Maintenance"
- "Stat Recovery Protocol"
- "Healing Dungeon Rest"
- "MP Recovery Circuit"

REST DAY ACTIVITIES:
Choose from: "Light walking (15-20 min)", "Gentle stretching routine", "Active recovery yoga", "Foam rolling session", "Complete rest and recovery", "Light mobility work", "Breathing exercises"

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
