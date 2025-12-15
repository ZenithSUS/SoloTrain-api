import { Request, Response } from "express";
import { SkillService } from "../services/skill-service.js";

export class SkillController {
  constructor(private skillService: SkillService) {}

  getSkills = (req: Request, res: Response) => {
    const skills = this.skillService.getSkills();
    return res.status(200).json(skills);
  };

  getSkillById = (req: Request, res: Response) => {
    const { id } = req.params;
    const skill = this.skillService.getSkillById(Number(id));
    return res.status(200).json(skill);
  };

  getSkillByName = (req: Request, res: Response) => {
    const { name } = req.params;
    const skill = this.skillService.getSkillByName(name);
    return res.status(200).json(skill);
  };
}
