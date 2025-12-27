export type Trials = {
  userId: string;
  trialId: number;
  completedAt: Date;
  xpGained: number;
  statsGained: {
    strength: number;
    agility: number;
    stamina: number;
    intelligence: number;
  };
};
