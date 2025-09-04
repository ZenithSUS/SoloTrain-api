// Stats Interface
export type Stat = {
  userId: string;
  level: number;
  exp: number;
  currentMaxExp: number;
  strength: number;
  agility: number;
  stamina: number;
  intelligence: number;
  missionsCompleted: number;
  missionsFailed: number;
  totalXP: number;
  questsCompleted: number;
  createdAt: Date;
  updatedAt: Date;
};
