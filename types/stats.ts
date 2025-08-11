import mongoose from "mongoose";

// Stats Interface
export type Stat = {
  userId: mongoose.Types.ObjectId;
  level: number;
  exp: number;
  strength: number;
  agility: number;
  stamina: number;
  intelligence: number;
  createdAt: Date;
  updatedAt: Date;
};
