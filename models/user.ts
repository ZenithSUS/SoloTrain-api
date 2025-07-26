import mongoose from "mongoose";
import { User } from "../types/user";

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
    age: {
      type: Number,
      required: true,
    },
    goals: {
      loseWeight: {
        type: Boolean,
        required: false,
      },
      gainWeight: {
        type: Boolean,
        required: false,
      },
      maintainWeight: {
        type: Boolean,
        required: false,
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
