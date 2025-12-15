import { arenaSkills } from "../../data/arena-skills.js";

export class SkillRepository {
  private skills = arenaSkills;

  getSkills() {
    return this.skills;
  }

  getSkillById(id: number) {
    return this.skills.find((skill) => skill.id === id);
  }

  getSkillByName(name: string) {
    return this.skills.find((skill) => skill.name === name);
  }
}
