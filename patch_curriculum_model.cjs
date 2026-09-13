const fs = require('fs');

let content = fs.readFileSync('src/domain/curriculum/CurriculumModel.ts', 'utf8');

// 1. Insert new interfaces
const interfacesToAdd = `
export interface ConceptSpec {
  id: string;
  titleAr: string;
  relatedObjectiveIds: string[];
}

export interface SkillSpec {
  id: string;
  titleAr: string;
  taxonomy: string;
  relatedObjectiveIds: string[];
}
`;

content = content.replace(
  "export interface LearningObjectiveSpec {",
  interfacesToAdd + "\nexport interface LearningObjectiveSpec {"
);

// 2. Update LearningObjectiveSpec
content = content.replace(
  "  keyAccountingConcepts: string[];",
  "  conceptIds: string[];"
);

// 3. Update LessonSpec
content = content.replace(
  "  objectives: LearningObjectiveSpec[];\n}",
  "  objectives: LearningObjectiveSpec[];\n  concepts?: ConceptSpec[];\n  skills?: SkillSpec[];\n}"
);

// 4. Update the actual data by extracting concepts into the lesson's concepts array.
// For Unit 1 and Unit 2, we need to transform the objects.
// Wait, regex might be tricky. Let's do it by evaluating the file, modifying the objects, and writing it back.
// But evaluating TS is hard. I'll use a simpler text replace.

// Replace "keyAccountingConcepts: [" with "conceptIds: ["
content = content.replace(/keyAccountingConcepts:/g, "conceptIds:");

fs.writeFileSync('src/domain/curriculum/CurriculumModel.ts', content);
console.log('Interfaces added, keys renamed.');
