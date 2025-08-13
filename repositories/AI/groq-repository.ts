import Groq from "groq-sdk";
import { Workout, WorkoutCustomization } from "../../types/workout.js";
import { workoutPlanGenerator } from "../../utils/prompts/workoutplan.js";
import { initializeDatabase } from "../../mongodb.js";
import { generate28DayWorkoutPlan } from "../../utils/workout-generator.js";

export class GroqRepository {
  private groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
    timeout: 2 * 60 * 1000, // 2 minutes
  });

  // Get collection
  private async collection(collectionName: string) {
    const connection = await initializeDatabase();
    if (!connection) {
      throw new Error("Database connection not initialized");
    }
    return connection.collection(collectionName);
  }

  async chatResponse(prompt: string, temperature: number = 0.1) {
    try {
      return await this.groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content:
              "Generate workout plans as pure JSON arrays. Use standard exercise names. No markdown.",
          },
          { role: "user", content: prompt },
        ],
        model: "llama-3.3-70b-versatile",
        temperature,
        stream: false,
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
        throw new Error("No response from AI Proceed to Static Plan");
      }

      // Parse the workout plan JSON
      const content = response.choices[0].message.content;
      if (typeof content !== "string") {
        throw new Error("Invalid response from AI Proceed to Static Plan");
      }

      const workoutPlan: Workout[] = JSON.parse(content);

      // If invalid response content from AI, proceed to static plan
      if (!workoutPlan) {
        throw new Error("Invalid response from AI Proceed to Static Plan");
      }

      // Connect to MongoDB
      const collection = await this.collection("workout");

      // Insert the workouts
      const workoutsToInsert = workoutPlan.map((workout) => ({
        userId: data.userId,
        date: new Date(workout.date),
        type: workout.type,
        exercises: workout.exercises,
        difficulty: workout.difficulty,
        missionName: workout.missionName,
        isRestDay: workout.isRestDay,
        restDayActivity: workout.restDayActivity,
      }));

      const result = await collection.insertMany(workoutsToInsert, {
        ordered: false,
      });
      console.log(`⚡ ${workoutPlan.length} workouts generated via Groq`);
      return result.acknowledged;
    } catch (error) {
      console.error("❌ Groq generation error proceeding to Static Plan");
      const workoutPlan = await generate28DayWorkoutPlan(data);
      console.log(`⚡ workouts generated via Static Plan`);
      return workoutPlan;
    }
  }
}
