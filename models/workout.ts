import mongoose from "mongoose";
import { Workout } from "../types/workout";

const exerciseSchema = new mongoose.Schema(
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
    weight: {
      type: Number,
      required: false, // Optional field
    },
    rest: {
      type: Number,
      required: true,
    },
    notes: {
      type: String,
      required: false, // Optional field
    },
    duration_min: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
); // Disable _id for subdocuments

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
