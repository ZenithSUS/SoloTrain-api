import { AccountRepository } from "../repositories/mongoDb/account-repository.js";
import { AdventureRepository } from "../repositories/mongoDb/adventure-repository.js";
import { MissionRepository } from "../repositories/mongoDb/mission-repository.js";
import { RecentRepository } from "../repositories/mongoDb/recent-repository.js";
import { StatRepository } from "../repositories/mongoDb/stat-repository.js";
import { TrialRepository } from "../repositories/mongoDb/trials-repository.js";
import { UserRepository } from "../repositories/mongoDb/user-repository.js";
import { WorkoutRepository } from "../repositories/mongoDb/workout-repository.js";
import colors from "./log-colors.js";

const createIndexes = (async () => {
  await Promise.all([
    new UserRepository().createIndexes(),
    new AccountRepository().createIndexes(),
    new StatRepository().createIndexes(),
    new WorkoutRepository().createIndexes(),
    new MissionRepository().createIndexes(),
    new AdventureRepository().createIndexes(),
    new TrialRepository().createIndexes(),
    new RecentRepository().createIndexes(),
  ]);

  console.log(
    `MongoDB: ${colors.green}Indexes created successfully ${colors.reset}`
  );
  console.log(colors.reset + "─".repeat(50) + colors.reset);
})();

export default createIndexes;
