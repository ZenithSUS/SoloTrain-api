import mongoose from "mongoose";
import { Exercise, Workout } from "../types/workout.js";

const exerciseSchema = new mongoose.Schema<Exercise>(
  {
    name: {
      type: String,
      required: true,
    },
    sets: {
      type: Number,
      required: true,
    },
    reps: {
      type: Number,
      required: true,
    },
    rest: {
      type: Number,
      required: true,
    },
    execution: {
      type: String,
      required: true,
    },
    imageKey: {
      type: Object,
      required: true,
    },
    modifications: {
      type: [String],
      required: false,
    },
    duration_min: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const workoutSchema = new mongoose.Schema<Workout>({
  userId: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  dayNumber: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ["beginner", "intermediate", "advanced"],
    required: true,
  },
  missionName: {
    type: String,
    required: true,
  },
  isRestDay: {
    type: Boolean,
    required: false,
  },
  restDayActivity: {
    type: String,
    required: false,
  },
  completed: {
    type: Boolean,
    required: false,
  },
  exp: {
    type: Number,
    required: true,
  },
  exercises: [exerciseSchema],
});

export default mongoose.model("Workout", workoutSchema);
