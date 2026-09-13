import fs from 'fs';

let content = fs.readFileSync('src/domain/curriculum/CurriculumRegistry.ts', 'utf8');

// Update the imports to include ConceptSpec and SkillSpec
content = content.replace(
  "import { UnitSpec, LessonSpec, LearningObjectiveSpec } from './CurriculumModel';",
  "import { UnitSpec, LessonSpec, LearningObjectiveSpec, ConceptSpec, SkillSpec } from './CurriculumModel';"
);

const newMethods = `
  public getConcepts(unitId: string, lessonId?: string): ConceptSpec[] {
    const unit = this.getUnitById(unitId);
    if (!unit) return [];
    if (lessonId) {
      const lesson = unit.lessons.find(l => l.id === lessonId);
      return lesson?.concepts || [];
    }
    return unit.lessons.flatMap(l => l.concepts || []);
  }

  public getSkills(unitId: string, lessonId?: string): SkillSpec[] {
    const unit = this.getUnitById(unitId);
    if (!unit) return [];
    if (lessonId) {
      const lesson = unit.lessons.find(l => l.id === lessonId);
      return lesson?.skills || [];
    }
    return unit.lessons.flatMap(l => l.skills || []);
  }
`;

content = content.replace(
  "  public getObjectiveById(objectiveId: string): LearningObjectiveSpec | undefined {",
  newMethods + "\n  public getObjectiveById(objectiveId: string): LearningObjectiveSpec | undefined {"
);

fs.writeFileSync('src/domain/curriculum/CurriculumRegistry.ts', content);
console.log('CurriculumRegistry patched');
