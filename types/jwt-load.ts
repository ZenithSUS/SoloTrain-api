export interface JwtLoad {
  _id?: string;
  id?: string;
  status: "active" | "inactive" | "deleted";
  iat?: number;
  exp?: number;
}
