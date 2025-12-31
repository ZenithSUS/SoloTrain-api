import { Mistral } from "@mistralai/mistralai";
import { workoutPlanGenerator } from "../../utils/prompts/workoutplan.js";
import { initializeDatabase } from "../../mongodb.js";
import { Workout, WorkoutCustomization } from "../../types/workout.js";
import { generate28DayWorkoutPlan } from "../../utils/workout-generator.js";
import dotenv from "dotenv";
import config from "../../config.js";

dotenv.config({ quiet: true });

export class MistralRepository {
  private mistral = new Mistral({
    apiKey: config.mistralApiKey,
    timeoutMs: 100000,
  });

  private SYSTEM_PROMPT = `
You are a workout plan generator that MUST return ONLY valid JSON.

CRITICAL RULES:
1. Return ONLY a JSON array starting with '[' and ending with ']'
2. NO markdown code blocks, NO backticks, NO explanations
3. All property names must use double quotes
4. All string values must use double quotes
5. No trailing commas in objects or arrays
6. No comments in the JSON
7. Ensure all brackets and braces are properly closed
8. Numbers should be plain numbers (not strings unless specifically required)
9. Boolean values should be true/false (not strings)
10. Dates should be in ISO 8601 format: "YYYY-MM-DD"

Example of correct format:
[
  {
    "workoutId": "w1",
    "date": "2025-01-01",
    "dayNumber": 1,
    "type": "strength",
    "exercises": [],
    "difficulty": "beginner",
    "missionName": "Day 1",
    "isRestDay": false,
    "restDayActivity": null,
    "exp": 100,
    "rank": "private"
  }
]

Return the JSON array directly with no other text.
`;

  private async collection(collectionName: string) {
    const connection = await initializeDatabase();
    if (!connection) {
      throw new Error("Database connection not initialized");
    }
    return connection.collection(collectionName);
  }

  private cleanChatResponse(content: string): string {
    // Remove markdown code blocks
    let cleaned = content.replace(/```json\s*/gi, "").replace(/```\s*/g, "");

    // Trim whitespace
    cleaned = cleaned.trim();

    // Find the first '[' and last ']' to extract just the JSON array
    const firstBracket = cleaned.indexOf("[");
    const lastBracket = cleaned.lastIndexOf("]");

    if (
      firstBracket !== -1 &&
      lastBracket !== -1 &&
      lastBracket > firstBracket
    ) {
      cleaned = cleaned.substring(firstBracket, lastBracket + 1);
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

      if (!Array.isArray(parsed)) {
        throw new Error("Response is not an array");
      }

      // Validate structure of each workout
      if (parsed.length === 0) {
        throw new Error("Workout array is empty");
      }

      // Basic validation of first workout
      const firstWorkout = parsed[0];
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

      return parsed;
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

  // Function to generate a chat response
  async chatResponse(prompt: string, temperature: number) {
    try {
      return await this.mistral.chat.complete({
        messages: [
          {
            role: "system",
            content: this.SYSTEM_PROMPT,
          },
          { role: "user", content: prompt },
        ],
        model: "mistral-large-latest",
        temperature,
        stream: false,
        responseFormat: { type: "json_object" },
      });
    } catch (err) {
      const error = err as Error;
      console.error(`AI Response Error: ${error.message}`);
      return null;
    }
  }

  // Generate and store workout plan
  async useGenerateWorkOutPlan(data: WorkoutCustomization) {
    try {
      const prompt = workoutPlanGenerator(
        data.goal,
        data.userId,
        data.difficulty,
        data.workoutsPerWeek
      );

      const response = await this.chatResponse(prompt, 0.1);

      if (!response || response.choices.length === 0) {
        throw new Error("No response from AI - Proceed to Static Plan");
      }

      const content = response.choices[0].message.content;

      if (typeof content !== "string") {
        throw new Error(
          "Invalid response type from AI - Proceed to Static Plan"
        );
      }

      // Clean the JSON response
      const cleanedContent = this.cleanChatResponse(content);
      const workoutPlan = this.parseWorkoutJson(cleanedContent);

      // Validate the parsed data
      if (!Array.isArray(workoutPlan) || workoutPlan.length === 0) {
        throw new Error("Workout plan is empty or not an array");
      }
      // Insert all workouts in one go
      const collection = await this.collection("workout");

      // Convert the date strings to Date objects
      const workoutsToInsert = workoutPlan.map((workout) => {
        return {
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
        };
      });

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

      console.log(`⚡ ${workoutPlan.length} workouts generated via Mistral`);

      // Step 4: Return the result
      return {
        userId: data.userId,
        workoutId: workoutPlan[0].workoutId,
      };
    } catch (error) {
      console.error("❌ Mistral generation error - proceeding to Static Plan");
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
