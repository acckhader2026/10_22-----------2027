import fs from 'fs';
import { CANONICAL_UNIT_1, CANONICAL_UNIT_2 } from './src/domain/curriculum/CurriculumModel';

function transformUnit(unit: any) {
  let globalConceptIdCounter = 1;
  for (const lesson of unit.lessons) {
    lesson.concepts = [];
    lesson.skills = []; // empty skills array as per prompt (or maybe extract from somewhere if they existed, but they didn't)
    
    for (const obj of lesson.objectives) {
      const newConceptIds: string[] = [];
      const rawConcepts = obj.conceptIds || []; // The ones that were strings
      
      for (const conceptName of rawConcepts) {
        // find if concept already exists in this lesson
        let existing = lesson.concepts.find((c: any) => c.titleAr === conceptName);
        if (!existing) {
          existing = {
            id: `concept-${unit.id}-${globalConceptIdCounter++}`,
            titleAr: conceptName,
            relatedObjectiveIds: []
          };
          lesson.concepts.push(existing);
        }
        if (!existing.relatedObjectiveIds.includes(obj.id)) {
          existing.relatedObjectiveIds.push(obj.id);
        }
        newConceptIds.push(existing.id);
      }
      obj.conceptIds = newConceptIds;
    }
  }
}

transformUnit(CANONICAL_UNIT_1);
transformUnit(CANONICAL_UNIT_2);

let newContent = `
/**
 * Canonical Egyptian Baccalaureate (EB) Curriculum & Blueprint Architecture
 * Single Source of Truth for Unit 1 Financial Accounting
 */

export type TaxonomyLevel = 'Remember' | 'Understand' | 'Apply' | 'Analyze' | 'Evaluate' | 'Create';
export type CognitiveDomain = 'KNOWLEDGE' | 'APPLICATION' | 'HIGHER_ORDER_ANALYSIS';
export type QuestionDifficulty = 'basic' | 'intermediate' | 'advanced' | 'challenge';
export type CanonicalQuestionType = 
  | 'mcq'
  | 'true_false'
  | 'fill_blank'
  | 'concept'
  | 'applied'
  | 'case'
  | 'analytical'
  | 'jre'
  | 't_account';

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

export interface LearningObjectiveSpec {
  id: string;
  code: string;
  lessonId: string;
  titleAr: string;
  taxonomy: TaxonomyLevel;
  cognitiveDomain: CognitiveDomain;
  targetDifficulty: QuestionDifficulty;
  weightPercentage: number;
  bookPageRef: number;
  primaryMisconceptions: string[];
  conceptIds: string[];
  isJRERequired: boolean;
}

export interface LessonSpec {
  id: string;
  lessonNumber: number;
  unitId: string;
  titleAr: string;
  subtitleAr: string;
  textbookPages: [number, number];
  nominalWeight: number;
  objectives: LearningObjectiveSpec[];
  concepts?: ConceptSpec[];
  skills?: SkillSpec[];
}

export interface UnitSpec {
  id: string;
  titleAr: string;
  descriptionAr: string;
  lessons: LessonSpec[];
}

export const CANONICAL_UNIT_1: UnitSpec = ${JSON.stringify(CANONICAL_UNIT_1, null, 2)};

export const CANONICAL_UNIT_2: UnitSpec = ${JSON.stringify(CANONICAL_UNIT_2, null, 2)};
`;

fs.writeFileSync('src/domain/curriculum/CurriculumModel.ts', newContent);
console.log('Successfully transformed CurriculumModel.ts');
