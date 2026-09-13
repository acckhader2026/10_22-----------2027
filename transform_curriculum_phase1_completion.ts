import fs from 'fs';
import { CANONICAL_UNIT_1, CANONICAL_UNIT_2, ConceptSpec, SkillSpec } from './src/domain/curriculum/CurriculumModel';
import { unit1Lessons, unit2Lessons } from './src/data/lessonsData';
import { LessonContent } from './src/types';

// Function to generate ID safe strings
function generateId(prefix: string, unitId: string, idx: number) {
  return `${prefix}-${unitId}-${idx}`;
}

// 1. Populate Skills for Unit 1 from lessonsData
let u1SkillCounter = 1;
CANONICAL_UNIT_1.lessons.forEach(canonLesson => {
  const legacyLesson = unit1Lessons.find(l => l.id === canonLesson.id);
  if (!legacyLesson) return;
  
  canonLesson.skills = canonLesson.skills || [];
  
  // Extract skills from 'howToApply' inside sections
  legacyLesson.sections.forEach(section => {
    section.howToApply.forEach(howTo => {
      // Find objective matching this lesson
      // We just assign all skills to the first objective of the lesson for simplicity,
      // or to all objectives.
      const objIds = canonLesson.objectives.map(o => o.id);
      
      const skill: SkillSpec = {
        id: generateId('skill', 'unit-1', u1SkillCounter++),
        titleAr: howTo,
        taxonomy: 'Apply',
        relatedObjectiveIds: objIds
      };
      canonLesson.skills!.push(skill);
    });
  });
});

// 2. Populate Unit 2 Concepts, Misconceptions, and Skills
let u2ConceptCounter = 1;
let u2SkillCounter = 1;

let populatedObjectives = 0;
let totalObjectives = CANONICAL_UNIT_2.lessons.reduce((acc, l) => acc + l.objectives.length, 0);

CANONICAL_UNIT_2.lessons.forEach(canonLesson => {
  const legacyId = `u2-${canonLesson.id}`;
  const legacyLesson = unit2Lessons.find((l: any) => l.id === legacyId);
  
  canonLesson.concepts = canonLesson.concepts || [];
  canonLesson.skills = canonLesson.skills || [];
  
  if (legacyLesson) {
    const objIds = canonLesson.objectives.map(o => o.id);

    // Extract concepts from whatYouWillLearn
    if (legacyLesson.whatYouWillLearn) {
      legacyLesson.whatYouWillLearn.forEach(learn => {
        const concept: ConceptSpec = {
          id: generateId('concept', 'unit-2', u2ConceptCounter++),
          titleAr: learn,
          relatedObjectiveIds: objIds
        };
        canonLesson.concepts!.push(concept);
        // Link concepts to objectives
        canonLesson.objectives.forEach(obj => {
          if(!obj.conceptIds) obj.conceptIds = [];
          if (!obj.conceptIds.includes(concept.id)) {
             obj.conceptIds.push(concept.id);
          }
        });
      });
    }

    // Extract skills from howToApply
    legacyLesson.sections.forEach(section => {
      if (section.howToApply) {
        section.howToApply.forEach(howTo => {
          const skill: SkillSpec = {
            id: generateId('skill', 'unit-2', u2SkillCounter++),
            titleAr: howTo,
            taxonomy: 'Apply',
            relatedObjectiveIds: objIds
          };
          canonLesson.skills!.push(skill);
        });
      }
    });

    // Populate misconceptions directly onto objectives
    if (legacyLesson.misconceptions && legacyLesson.misconceptions.length > 0) {
      canonLesson.objectives.forEach(obj => {
         // assign misconceptions based on subLo matching or simply give all to all
         legacyLesson.misconceptions!.forEach(misc => {
           if (!obj.primaryMisconceptions.includes(misc.error)) {
             obj.primaryMisconceptions.push(misc.error);
           }
         });
      });
      // We consider the objectives of this lesson 'populated' if we extracted concepts/misconceptions
      populatedObjectives += canonLesson.objectives.length;
    }
  }
});

console.log(`Unit 2 Populated Objectives: ${populatedObjectives} / ${totalObjectives}`);

// We need to rewrite CurriculumModel.ts preserving the new data.
// Since CurriculumModel.ts contains types and constants, we can recreate it.
let currentContent = fs.readFileSync('src/domain/curriculum/CurriculumModel.ts', 'utf8');

// Replace the CANONICAL_UNIT_1 definition
// It starts at 'export const CANONICAL_UNIT_1: UnitSpec = {'
const newU1Json = JSON.stringify(CANONICAL_UNIT_1, null, 2);
const newU2Json = JSON.stringify(CANONICAL_UNIT_2, null, 2);

const startU1 = currentContent.indexOf('export const CANONICAL_UNIT_1: UnitSpec =');
const u1Prefix = currentContent.substring(0, startU1);

const newContent = `${u1Prefix}
export const CANONICAL_UNIT_1: UnitSpec = ${newU1Json};

export const CANONICAL_UNIT_2: UnitSpec = ${newU2Json};
`;

fs.writeFileSync('src/domain/curriculum/CurriculumModel.ts', newContent);
console.log('Successfully updated CurriculumModel.ts with Skills and Unit 2 data.');
