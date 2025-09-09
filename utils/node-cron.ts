import cron from "node-cron";
import { MissionService } from "../services/mission-service.js";
import { MissionRepository } from "../repositories/mongoDb/mission-repository.js";
import { Mission } from "../types/mission.js";

// Create Instance of classes
const repo = new MissionRepository();
const missionService = new MissionService(repo);

// Philippine Timezone
const timezone = "Asia/Manila";

console.log(
  `Current Philippine time: ${new Date().toLocaleString("en-US", {
    timeZone: timezone,
  })}`
);

// Run the cron job every day at 00:00 (midnight) Philippine time
cron.schedule(
  "0 0 * * *",
  async () => {
    try {
      const currentPhTime = new Date().toLocaleString("en-US", {
        timeZone: timezone,
      });
      console.log("Creating new special mission...");

      const result: (Mission[] | undefined)[] | undefined =
        await missionService.createNewSpecialMission();

      if (result && result.length > 0) {
        console.log("Special mission created successfully");
      } else {
        console.log("No special mission created");
      }

      console.log(
        `Completed special mission task creation at Philippine time: ${currentPhTime}`
      );
      console.log();
    } catch (error) {
      console.error("Error creating special mission:", error);
    }
  },
  {
    timezone: timezone,
  }
);
