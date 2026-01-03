import Groq from "groq-sdk";
import { Workout, WorkoutCustomization } from "../../types/workout.js";
import { workoutPlanGenerator } from "../../utils/workoutplan.js";
import { initializeDatabase } from "../../mongodb.js";
import { generate28DayWorkoutPlan } from "../../utils/workout-generator.js";
import dotenv from "dotenv";
import config from "../../config.js";

dotenv.config({ quiet: true });

export class GroqRepository {
  private groq = new Groq({
    apiKey: config.groqApiKey,
    timeout: 3 * 60 * 1000, // 3 minutes
  });

  private SYSTEM_PROMPT = `
You are a workout plan generator that MUST return ONLY valid JSON.

CRITICAL RULES:
1. Return a JSON object with a "workouts" array: {"workouts": [...]}
2. NO markdown code blocks, NO backticks, NO explanations
3. All property names must use double quotes
4. All string values must use double quotes
5. No trailing commas in objects or arrays
6. No comments in the JSON
7. Ensure all brackets and braces are properly closed
8. Numbers should be plain numbers (not strings unless specifically required)
9. Boolean values should be true/false (not strings)
10. Dates should be in ISO 8601 format: "YYYY-MM-DD"

CRITICAL: imageKey objects must end with a closing brace }, NOT a bracket ]

Example of correct format:
{
  "workouts": [
    {
      "workoutId": "w1",
      "userId": "user123",
      "date": "2025-01-01",
      "dayNumber": 1,
      "type": "Strength Training",
      "difficulty": "beginner",
      "missionName": "Shadow Extraction Protocol",
      "exercises": [
        {
          "name": "Push-ups",
          "shadowName": "Iron Protocol",
          "sets": 3,
          "reps": 10,
          "rest": 60,
          "duration_min": 5,
          "instructions": ["Step 1", "Step 2"],
          "targetMuscles": ["Chest", "Triceps"],
          "formTips": ["Tip 1"],
          "modifications": ["Mod 1"],
          "execution": "/path/to/video.mp4",
          "imageKey": {
            "image1": "/path/image1.webp",
            "image2": "/path/image2.webp"
          },
          "exp": 100,
          "rank": "D"
        }
      ],
      "isRestDay": false,
      "restDayActivity": null,
      "completed": false,
      "rank": "D",
      "exp": 100
    }
  ]
}

Return the JSON object directly with no other text.
`;

  // Get collection
  private async collection(collectionName: string) {
    const connection = await initializeDatabase();
    if (!connection) throw new Error("Database connection not initialized");
    return connection.collection(collectionName);
  }
  private cleanJsonResponse(content: string): string {
    // Remove markdown code blocks
    let cleaned = content.replace(/```json\s*/gi, "").replace(/```\s*/g, "");

    // Trim whitespace
    cleaned = cleaned.trim();

    // Find the outermost valid JSON structure
    const firstBrace = cleaned.indexOf("{");
    const firstBracket = cleaned.indexOf("[");

    // Determine if we're looking for an object or array
    let isObject = false;
    let startIndex = -1;

    if (
      firstBrace !== -1 &&
      (firstBracket === -1 || firstBrace < firstBracket)
    ) {
      isObject = true;
      startIndex = firstBrace;
    } else if (firstBracket !== -1) {
      isObject = false;
      startIndex = firstBracket;
    }

    if (startIndex === -1) {
      return cleaned; // No JSON structure found, return as-is
    }

    // Find the matching closing bracket/brace
    let depth = 0;
    let endIndex = -1;
    const openChar = isObject ? "{" : "[";
    const closeChar = isObject ? "}" : "]";

    for (let i = startIndex; i < cleaned.length; i++) {
      const char = cleaned[i];

      // Skip strings to avoid counting brackets/braces inside them
      if (char === '"' || char === "'") {
        const quote = char;
        i++; // Move past opening quote
        while (i < cleaned.length) {
          if (cleaned[i] === quote && cleaned[i - 1] !== "\\") {
            break; // Found closing quote
          }
          i++;
        }
        continue;
      }

      if (char === openChar) {
        depth++;
      } else if (char === closeChar) {
        depth--;
        if (depth === 0) {
          endIndex = i;
          break;
        }
      }
    }

    if (endIndex !== -1) {
      cleaned = cleaned.substring(startIndex, endIndex + 1);
    } else {
      // If we couldn't find a proper end, try the old method as fallback
      const lastBrace = cleaned.lastIndexOf("}");
      const lastBracket = cleaned.lastIndexOf("]");

      if (isObject && lastBrace !== -1) {
        cleaned = cleaned.substring(startIndex, lastBrace + 1);
      } else if (!isObject && lastBracket !== -1) {
        cleaned = cleaned.substring(startIndex, lastBracket + 1);
      }
    }

    // Remove trailing commas before closing brackets/braces
    cleaned = cleaned.replace(/,(\s*[}\]])/g, "$1");

    return cleaned;
  }

  /**
   * Attempts to parse JSON with detailed error reporting
   */
  private parseWorkoutJson(content: string): Workout[] {
    try {
      const parsed = JSON.parse(content);

      // Handle both formats: direct array or wrapped in "workouts"
      const workoutsArray = Array.isArray(parsed) ? parsed : parsed.workouts;

      if (!Array.isArray(workoutsArray)) {
        throw new Error("Response does not contain a valid workouts array");
      }

      if (workoutsArray.length === 0) {
        throw new Error("Workout array is empty");
      }

      // Basic validation of first workout
      const firstWorkout = workoutsArray[0];
      const requiredFields = [
        "workoutId",
        "date",
        "dayNumber",
        "type",
        "exercises",
      ];

      const missingFields = requiredFields.filter(
        (field) => !(field in firstWorkout)
      );

      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
      }

      // Validate exercises is an array
      if (!Array.isArray(firstWorkout.exercises)) {
        throw new Error("exercises field must be an array");
      }

      console.log(`✅ Parsed ${workoutsArray.length} workouts successfully`);

      return workoutsArray;
    } catch (error) {
      if (error instanceof SyntaxError) {
        const errorMatch = error.message.match(/position (\d+)/);
        if (errorMatch) {
          const position = parseInt(errorMatch[1]);
          const start = Math.max(0, position - 100);
          const end = Math.min(content.length, position + 100);
          const context = content.substring(start, end);

          console.error("JSON Parse Error Context:");
          console.error("...", context, "...");
          console.error(" ".repeat(position - start + 3) + "^");
        }
      }
      throw error;
    }
  }

  async chatResponse(prompt: string, temperature: number = 0.1) {
    try {
      return await this.groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: this.SYSTEM_PROMPT,
          },
          { role: "user", content: prompt },
        ],
        model: "llama-3.3-70b-versatile",
        temperature,
        stream: false,
        response_format: { type: "json_object" },
      });
    } catch (err) {
      const error = err as Error;
      console.error(`AI Response Error: ${error.message}`);
      return null;
    }
  }

  async useGenerateWorkOutPlan(data: WorkoutCustomization) {
    try {
      const prompt = workoutPlanGenerator(
        data.goal,
        data.userId,
        data.difficulty,
        data.workoutsPerWeek
      );

      // Generate the workout plan
      const response = await this.chatResponse(prompt, 0.1);

      // If no response from AI, proceed to static plan
      if (!response || response.choices.length === 0) {
        throw new Error("No response from AI - Proceed to Static Plan");
      }

      // Get the content
      const content = response.choices[0].message.content;
      if (typeof content !== "string") {
        throw new Error(
          "Invalid response type from AI - Proceed to Static Plan"
        );
      }

      // Clean the JSON response
      const cleanedContent = this.cleanJsonResponse(content);

      // Parse with enhanced error handling
      const workoutPlan = this.parseWorkoutJson(cleanedContent);

      // Validate the parsed data
      if (!Array.isArray(workoutPlan) || workoutPlan.length === 0) {
        throw new Error("Invalid workout plan structure");
      }

      const collection = await this.collection("workout");

      const workoutsToInsert = workoutPlan.map((workout) => ({
        userId: data.userId,
        workoutId: workout.workoutId,
        date: new Date(workout.date),
        dayNumber: workout.dayNumber,
        type: workout.type,
        exercises: workout.exercises,
        difficulty: workout.difficulty,
        missionName: workout.missionName,
        isRestDay: workout.isRestDay ?? false,
        restDayActivity: workout.restDayActivity ?? null,
        completed: false,
        exp: workout.exp,
        rank: workout.rank,
      }));

      // Update the current workoutId in the user document
      const userCollection = await this.collection("users");

      await Promise.all([
        collection.insertMany(workoutsToInsert, {
          ordered: false,
        }),
        userCollection.updateOne(
          { accountId: data.userId },
          {
            $set: {
              currentWorkoutPlan: workoutPlan[0].workoutId,
              currentWorkoutDay: 1,
              goal: data.goal,
            },
          }
        ),
      ]);

      console.log(`⚡ ${workoutPlan.length} workouts generated via Groq`);
      return {
        userId: data.userId,
        workoutId: workoutPlan[0].workoutId,
      };
    } catch (error) {
      console.error("❌ Groq generation error - proceeding to Static Plan");
      console.error(
        "Error details:",
        error instanceof Error ? error.message : error
      );

      // Log the raw content for debugging if available
      if (error instanceof SyntaxError) {
        console.error(
          "💡 Tip: Check the logged raw AI response above for issues"
        );
      }

      const workoutPlan = await generate28DayWorkoutPlan(data);
      console.log(
        `⚡ ${workoutPlan.workouts.length} workouts generated via Static Plan`
      );
      return workoutPlan;
    }
  }
}
