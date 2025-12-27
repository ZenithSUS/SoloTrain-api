import { AccountRepository } from "../repositories/mongoDb/account-repository.js";
import { AdventureRepository } from "../repositories/mongoDb/adventure-repository.js";
import { TrialRepository } from "../repositories/mongoDb/trials-repository.js";
import colors from "./log-colors.js";

const createIndexes = (async () => {
  await new AccountRepository().createIndexes();
  await new AdventureRepository().createIndexes();
  await new TrialRepository().createIndexes();
  console.log(
    `MongoDB: ${colors.green}Indexes created successfully ${colors.reset}`
  );
  console.log(colors.reset + "─".repeat(50) + colors.reset);
})();

export default createIndexes;
