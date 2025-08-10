// Ranking interface
export type Ranking = {
  userId: string;
  xp: number;
  level: number;
  rankPosition?: number; // Updated periodically
};
