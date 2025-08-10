// Achievement interface
export type Achievement = {
  title: string;
  description: string;
  icon?: string;
  criteria: {
    type: string;
    value: number;
  };
  rewardXP: number;
};
