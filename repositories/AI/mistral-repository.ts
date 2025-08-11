import { Mistral } from "@mistralai/mistralai";
import { workoutPlanGenerator } from "../../utils/prompts/workoutplan.js";
import { initializeDatabase } from "../../mongodb.js";
import { Workout, WorkoutCustomization } from "../../types/workout.js";

export class MistralRepository {
  private mistral = new Mistral({
    apiKey: process.env.MISTRAL_API_KEY!,
  });

  // Function to generate a chat response
  async chatResponse(prompt: string, temperature: number) {
    return await this.mistral.chat.complete({
      model: "mistral-large-latest",
      temperature,
      topP: 0.9,
      stream: false,
      messages: [{ role: "user", content: prompt }],
    });
  }

  // Get collection
  private async collection(collectionName: string) {
    const connection = await initializeDatabase();
    if (!connection) {
      throw new Error("Database connection not initialized");
    }
    return connection.collection(collectionName);
  }

  // Generate and store workout plan
  async useGenerateWorkOutPlan(data: WorkoutCustomization) {
    try {
      // Step 1: Ask Mistral to generate a workout plan with userId embedded
      const prompt = workoutPlanGenerator(
        data.goal,
        data.userId,
        data.hasEquipment,
        data.difficulty,
        data.workoutsPerWeek
      );

      const response = await this.chatResponse(prompt, 0.1);

      if (!response) {
        throw new Error("No response from AI");
      }

      const content = response.choices[0].message.content;

      if (typeof content !== "string") {
        throw new Error("Invalid response content from AI");
      }

      // Step 2: Parse the workout plan JSON
      let workoutPlan: Workout[];
      try {
        workoutPlan = JSON.parse(content);
      } catch (err) {
        const cleaned = content
          .trim()
          .replace(/^```json\s*/, "")
          .replace(/\s*```$/, "")
          .replace(/^```\s*/, "")
          .replace(/\s*```$/, "");

        try {
          workoutPlan = JSON.parse(cleaned);
        } catch (secondErr) {
          console.error("Raw AI response:", content);
          throw new Error(`Failed to parse AI JSON: ${secondErr}`);
        }
      }

      if (!Array.isArray(workoutPlan) || workoutPlan.length === 0) {
        throw new Error("Workout plan is empty or not an array");
      }

      // Step 3: Insert all workouts in one go
      const collection = await this.collection("workout");

      // Convert the date strings to Date objects
      const workoutsToInsert = workoutPlan.map((workout) => {
        return {
          userId: data.userId,
          date: new Date(workout.date),
          type: workout.type,
          exercises: workout.exercises,
          difficulty: workout.difficulty,
          missionName: workout.missionName,
          isRestDay: workout.isRestDay,
          restDayActivity: workout.restDayActivity,
        };
      });

      const result = await collection.insertMany(workoutsToInsert, {
        ordered: false,
      });

      if (!result.acknowledged) {
        throw new Error("Failed to insert workouts");
      }

      console.log(
        `✅ ${workoutPlan.length} workouts saved for user ${data.userId}`
      );

      // Step 4: Return the result
      return result.acknowledged;
    } catch (error) {
      console.error("❌ Error generating workout plan:", error);
      throw error;
    }
  }
}
