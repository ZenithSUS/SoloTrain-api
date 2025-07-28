import bcrypt from "bcrypt";

const saltRRound = 10;

export const hashPassword = async (password: string): Promise<string> =>
  bcrypt.hash(password, saltRRound);

export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => bcrypt.compare(password, hash);

export default { hashPassword, comparePassword };
