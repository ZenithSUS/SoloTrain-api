import { SkillRepository } from "../repositories/static/skill-repository.js";
import { ArenaSkill } from "../types/arena.js";

export class SkillService {
  constructor(private skillRepo: SkillRepository) {}

  getSkills(): ArenaSkill[] {
    return this.skillRepo.getSkills();
  }

  getSkillById(id: number): ArenaSkill | undefined {
    return this.skillRepo.getSkillById(id);
  }

  getSkillByName(name: string): ArenaSkill | undefined {
    return this.skillRepo.getSkillByName(name);
  }
}
