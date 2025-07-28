// JWT Load Interface
export interface JwtLoad {
  _id: string;
  status: "active" | "inactive" | "deleted";
}
