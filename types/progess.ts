// Progress interface
export type Progress = {
  _id: string;
  userId: string;
  date: Date;
  type: string;
  weight_kg: number;
  notes?: string;
};

export type CreateProgress = Omit<Progress, "_id">;
