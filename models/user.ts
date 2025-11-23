import mongoose from "mongoose";
import { User } from "../types/user.js";

const userSchema = new mongoose.Schema<User>(
  {
    accountId: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    height_cm: {
      type: Number,
      required: true,
    },
    weight_kg: {
      type: Number,
      required: true,
    },
    goal: {
      type: String,
      required: true,
    },
    isLevelUp: {
      type: Boolean,
      required: true,
    },
    points: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
