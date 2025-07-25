// User interface
export type User = {
  accountId: string;
  fullName: string;
  age: number;
  height_cm: number;
  weight_kg: number;
  goals: {
    loseWeight: boolean;
    gainWeight: boolean;
    maintainWeight: boolean;
  };
};

export type ShowUser = Omit<User, "accountId">;

export type UpdateUser = Partial<User>;
