export interface ArenaSkill {
  id: number;
  name: string;
  type: "Attack" | "Buff" | "Defense" | "Heal";
  statScaling: "strength" | "agility" | "stamina" | "intelligence";
  rarity: "E" | "D" | "C" | "B" | "A" | "S";
  description: string;

  // Exercise requirement
  exercise: {
    name: string; // e.g. "Pushups"
    amount: number; // reps or seconds
    unit: "reps" | "seconds";
  };

  // Combat values
  power: number; // base damage or effect power
  cooldown: number; // seconds before reuse
}
