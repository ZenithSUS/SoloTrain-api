// JWT Load Interface
export interface JwtLoad {
  id: string;
  status: "active" | "inactive" | "deleted";
}
