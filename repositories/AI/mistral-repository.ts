import { Mistral } from "@mistralai/mistralai";
import { workoutPlanGenerator } from "../../utils/prompts/workoutplan.js";
import { initializeDatabase } from "../../mongodb.js";
import { Workout, WorkoutCustomization } from "../../types/workout.js";
import { generate28DayWorkoutPlan } from "../../utils/workout-generator.js";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

export class MistralRepository {
  private mistral = new Mistral({
    apiKey: process.env.MISTRAL_API_KEY!,
    timeoutMs: 100000,
  });

  private SYSTEM_PROMPT = `
You MUST return ONLY valid JSON.
No comments, no trailing commas, no explanations, no markdown.

Rules:
- JSON must start with '[' and end with ']'.
- All keys must be inside quotes.
- No extra text outside JSON.
- All strings must use double quotes.
- Do not include units like "10 reps" unless inside quotes.
- Arrays and objects must be properly closed.
- Never include line breaks outside JSON.
- DO NOT wrap the JSON in markdown code blocks or backticks.
`;

  // Get collection
  private async collection(collectionName: string) {
    const connection = await initializeDatabase();
    if (!connection) {
      throw new Error("Database connection not initialized");
    }
    return connection.collection(collectionName);
  }

  private cleanChatResponse(content: string) {
    // Remove markdown code if present
    let cleaned = content.replace(/```json\s*/g, "").replace(/```\s*/g, "");

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

    return cleaned;
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
      // Step 1: Ask Mistral to generate a workout plan with userId embedded
      const prompt = workoutPlanGenerator(
        data.goal,
        data.userId,
        data.difficulty,
        data.workoutsPerWeek
      );

      const response = await this.chatResponse(prompt, 0.1);

      if (!response || response.choices.length === 0) {
        throw new Error("No response from AI Proceed to Static Plan");
      }

      const content = response.choices[0].message.content;

      if (typeof content !== "string") {
        throw new Error("Invalid response from AI Proceed to Static Plan");
      }

      const cleanedContent = this.cleanChatResponse(content);

      const workoutPlan: Workout[] = JSON.parse(cleanedContent);

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
          isRestDay: workout.isRestDay,
          restDayActivity: workout.restDayActivity,
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

      console.log(`⚡ workouts generated via Mistral`);

      // Step 4: Return the result
      return {
        userId: data.userId,
        workoutId: workoutPlan[0].workoutId,
      };
    } catch (error) {
      console.error("❌ Mistral generation error proceeding to Static Plan");
      console.error("Cause:", error);

      // Log the raw content for debugging if available
      if (error instanceof SyntaxError) {
        console.error("Tip: Check if AI returned markdown or extra text");
      }

      const workoutPlan = await generate28DayWorkoutPlan(data);
      console.log(`⚡ workouts generated via Static Plan`);
      return workoutPlan;
    }
  }
}
