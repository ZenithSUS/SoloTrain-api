import Groq from "groq-sdk";
import { Workout, WorkoutCustomization } from "../../types/workout.js";
import { workoutPlanGenerator } from "../../utils/prompts/workoutplan.js";
import { initializeDatabase } from "../../mongodb.js";

export class GroqRepository {
  private groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
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
      max_tokens: 8000,
      stream: false,
    });
  }

  async useGenerateWorkOutPlan(data: WorkoutCustomization) {
    try {
      const prompt = workoutPlanGenerator(
        data.goal,
        data.userId,
        data.hasEquipment,
        data.difficulty,
        data.workoutsPerWeek
      );

      const response = await this.chatResponse(prompt, 0.1);
      console.log(response);
      const content = response.choices[0].message.content;

      if (!content) throw new Error("No response from AI");

      const workoutPlan: Workout[] = JSON.parse(content);

      if (!workoutPlan) throw new Error("Invalid response content from AI");

      // Save to database
      const collection = await this.collection("workout");
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
      console.error("❌ Groq generation error:", error);
      throw error;
    }
  }
}
