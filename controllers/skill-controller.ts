import { Request, Response } from "express";
import { SkillService } from "../services/skill-service.js";

export class SkillController {
  constructor(private skillService: SkillService) {}

  getSkills = (req: Request, res: Response) => {
    try {
      // Check if the user is authenticated
      if (!req.user) {
        return res
          .status(401)
          .json({ error: "Unauthorized Access to the server" });
      }

      const skills = this.skillService.getSkills();
      return res.status(200).json(skills);
    } catch (error) {
      console.error("Error getting skills:", error);
      return res.status(500).json({ error: "Error getting skills" });
    }
  };

  getSkillById = (req: Request, res: Response) => {
    try {
      // Check if the user is authenticated
      if (!req.user) {
        return res
          .status(401)
          .json({ error: "Unauthorized Access to the server" });
      }
      const { id } = req.params;
      const skill = this.skillService.getSkillById(Number(id));
      return res.status(200).json(skill);
    } catch (error) {
      console.error("Error getting skill:", error);
      return res.status(500).json({ error: "Error getting skill" });
    }
  };

  getSkillByName = (req: Request, res: Response) => {
    try {
      // Check if the user is authenticated
      if (!req.user) {
        return res
          .status(401)
          .json({ error: "Unauthorized Access to the server" });
      }
      const { name } = req.params;
      const skill = this.skillService.getSkillByName(name);
      return res.status(200).json(skill);
    } catch (error) {
      console.error("Error getting skill:", error);
      return res.status(500).json({ error: "Error getting skill" });
    }
  };
}
