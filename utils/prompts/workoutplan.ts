export const workoutPlanGenerator = (
  goal: string,
  userId: string,
  hasEquipment: boolean,
  difficulty: "beginner" | "intermediate" | "advanced" = "intermediate",
  workoutsPerWeek: number = 4
) => {
  // Get current date in Philippines timezone
  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Manila",
  });

  // Calculate total days needed (4 weeks = 28 days)
  const totalDays = 28;
  const totalWorkouts = workoutsPerWeek * 4; // 4 weeks
  const restDays = totalDays - totalWorkouts;

  return `
You are a fitness AI. Generate a **4-week structured workout plan** in JSON format for a user whose goal is "${goal}".

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
      "sets": number,
      "reps": number,
      "weight"?: number,       // Optional, only for weighted exercises
      "rest": number,          // Rest time in seconds
      "notes"?: string,        // Optional exercise notes
      "completed": boolean,    // Always false initially
      "duration_min": number,  // Exercise duration in minutes
      "instructions": string[], // Step-by-step how-to instructions
      "targetMuscles": string[], // Primary muscles worked
      "formTips": string[],    // Important form and safety tips
      "modifications"?: string[] // Optional easier/harder variations
    }
  ],
  "isRestDay"?: boolean,       // Optional, true only for rest days
  "restDayActivity"?: string   // Optional, activity for rest days
}

WORKOUT SCHEDULE REQUIREMENTS:
- Generate exactly ${totalDays} days (4 weeks)
- Include ${totalWorkouts} workout days and ${restDays} rest days per 4-week period
- Distribute rest days strategically (e.g., every 2-3 workout days)
- Rest days should have type: "Rest Day", empty exercises array [], isRestDay: true
- Rest days should include restDayActivity: "Light walking", "Gentle stretching", "Complete rest", etc.
- Active workout days should NOT include isRestDay or restDayActivity fields

DIFFICULTY LEVEL - ${difficulty.toUpperCase()}:
${
  difficulty === "beginner"
    ? `- 3-4 exercises per workout
- Lower rep ranges (8-12 reps)
- Longer rest periods (60-90 seconds)
- Focus on form and basic movements
- 20-30 minute workouts
- Include beginner-friendly modifications`
    : difficulty === "intermediate"
    ? `- 4-5 exercises per workout
- Moderate rep ranges (8-15 reps)
- Moderate rest periods (45-75 seconds)
- Mix of compound and isolation exercises
- 30-45 minute workouts
- Include progression variations`
    : `- 5-6 exercises per workout
- Varied rep ranges (6-20 reps depending on exercise)
- Shorter rest periods (30-60 seconds)
- Complex movements and supersets
- 45-60 minute workouts
- Include advanced variations and challenges`
}

Equipment Availability:
- The user ${
    hasEquipment
      ? "HAS access to gym equipment"
      : "does NOT have equipment and must use only bodyweight or household items"
  }.
- If no equipment: focus on bodyweight movements, resistance bands, or household object alternatives.
- If equipment is available: include barbells, dumbbells, machines, kettlebells, and weighted exercises.

INSTRUCTION REQUIREMENTS FOR EACH EXERCISE:
- "instructions": Provide 3-6 clear, numbered steps explaining exactly how to perform the exercise
- "targetMuscles": List 2-4 primary muscle groups worked (e.g., ["Chest", "Triceps", "Shoulders"])
- "formTips": Include 2-4 crucial form cues and safety tips (e.g., ["Keep core tight", "Don't let knees cave inward"])
- "modifications": Provide 1-3 variations for different skill levels (easier/harder versions)

WORKOUT TYPE DISTRIBUTION (for active workout days only):
- Strength Training: 30-40%
- Hypertrophy: 25-35% 
- Cardio: 20-25%
- Mobility/Recovery: 10-15%
- Mix types based on the user's goal: "${goal}"

CRITICAL JSON OUTPUT REQUIREMENTS - MUST FOLLOW EXACTLY:
- Your response MUST start with [ and end with ]
- ABSOLUTELY NO markdown code blocks - DO NOT use \`\`\`json or \`\`\` anywhere
- ABSOLUTELY NO text before the opening [ bracket
- ABSOLUTELY NO text after the closing ] bracket
- ABSOLUTELY NO explanations, comments, or any other text outside the JSON
- The FIRST character of your entire response must be [
- The LAST character of your entire response must be ]
- Must be valid JSON that passes JSON.parse() without any preprocessing
- FORBIDDEN: Any response that looks like \`\`\`json[...]\`\`\` will FAIL
- REQUIRED: Response format must be [...] with no other characters

Every workout object must have:
  - "userId" = "${userId}"
  - "date" = unique ISO date (YYYY-MM-DD) starting from ${today}
  - "difficulty" = "${difficulty}"
  - "type" = workout type or "Rest Day"
  - "missionName" = Solo Leveling themed mission name (creative and motivating)
  - "exercises" = array (empty for rest days, 3-6 exercises for workout days)
- For rest days: include "isRestDay": true, "restDayActivity": string, and empty exercises array
- For workout days: do NOT include isRestDay or restDayActivity fields
- Dates must be in chronological order for 28 consecutive days
- Each exercise must include ALL required fields: name, sets, reps, rest, completed, duration_min, instructions, targetMuscles, formTips
- Optional exercise fields: weight, notes, modifications
- Numeric values must be numbers (no quotes)
- Boolean values must be lowercase true/false
- String arrays must use proper JSON array format

SOLO LEVELING MISSION THEMES:
- Create epic mission names inspired by Solo Leveling manhwa/anime
- Examples for workout days: "Shadow Extraction Protocol", "Iron Body Manifestation", "Mana Recovery Circuit", "Beast King's Trial"
- Examples for rest days: "Shadow Monarch's Meditation", "System Recovery Mode", "Mana Restoration Chamber"
- Make each mission name unique and thematically appropriate to the workout type
- Use terminology like: Shadow, System, Mana, Beast, Monarch, Protocol, Trial, Manifestation, Extraction, Circuit, Dungeon, Guild, Hunter
- Mission names should be motivating and immersive

EXERCISE VARIETY:
- Use different exercises throughout the 4 weeks
- Avoid repeating the same exercise name more than 3 times total
- Progress difficulty/intensity over the 4 weeks
- Ensure workouts target all major muscle groups across the week
- Include compound movements for efficiency
- Balance push/pull movements and upper/lower body

EXAMPLE EXERCISE WITH INSTRUCTIONS:
{
  "name": "Push-Ups",
  "sets": 3,
  "reps": 12,
  "rest": 60,
  "completed": false,
  "duration_min": 3,
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
}

RESPOND WITH ONLY THE RAW JSON ARRAY - NO MARKDOWN, NO CODE BLOCKS, NO OTHER TEXT.
EXAMPLE OF FORBIDDEN OUTPUT: \`\`\`json[...]\`\`\`
EXAMPLE OF REQUIRED OUTPUT: [...]
`;
};
