import { describe, it, expect } from 'vitest';
import { 
  UNIFIED_ALL_QUESTIONS, 
  unit1CoreBank, 
  unit2Bank,
  getUnifiedQuestionsByUnit,
  getUnifiedQuestionsBySkill,
  getUnifiedQuestionsByBloom,
  getUnifiedQuestionsByType,
  UNIFIED_LO_MAPPING,
  mapSourceLOToCanonical
} from '../../../data/unifiedQuestionBank';
import { UNIFIED_SKILLS, SKILL_BY_CODE } from '../SkillTaxonomy';
import { ADVANCED_ESSAY_RUBRIC } from '../../assessment/rubrics/AdvancedEssayRubric';
import { curriculumRegistry } from '../CurriculumRegistry';

describe('Unified Question Bank & Pedagogical Taxonomy Suite', () => {
  describe('Bank Balance & Invariants', () => {
    it('contains exactly 108 unified training questions (36 per unit)', () => {
      expect(UNIFIED_ALL_QUESTIONS.length).toBe(144);
      expect(unit1CoreBank.length).toBe(36);
      expect(unit2Bank.length).toBe(36);
    });

    it('has unique IDs across all unified questions', () => {
      const ids = UNIFIED_ALL_QUESTIONS.map(q => q.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(144);
    });

    it('assigns all questions to valid units', () => {
      unit1CoreBank.forEach(q => expect(q.unitId).toBe('unit-1'));
      unit2Bank.forEach(q => expect(q.unitId).toBe('unit-2'));
    });
  });

  describe('Skill Taxonomy (S1 - S15)', () => {
    it('defines exactly 15 skills across 5 pedagogical categories', () => {
      expect(UNIFIED_SKILLS.length).toBe(15);
      const codes = UNIFIED_SKILLS.map(s => s.code);
      for (let i = 1; i <= 15; i++) {
        expect(codes).toContain(`S${i}`);
      }
    });

    it('every question in the unified bank has a valid registered skillCode', () => {
      UNIFIED_ALL_QUESTIONS.forEach(q => {
        expect(q.skillCode).toBeDefined();
        expect(SKILL_BY_CODE.has(q.skillCode!)).toBe(true);
      });
    });

    it('every question has a valid bloom level', () => {
      const validBloomLevels = ['knowledge', 'comprehension', 'application', 'analysis', 'evaluation', 'synthesis'];
      UNIFIED_ALL_QUESTIONS.forEach(q => {
        expect(q.bloomLevel).toBeDefined();
        expect(validBloomLevels).toContain(q.bloomLevel);
      });
    });
  });

  describe('Advanced Essay Rubric (20/25/25/20/10%)', () => {
    it('contains exactly 5 evaluation dimensions totaling 100%', () => {
      expect(ADVANCED_ESSAY_RUBRIC.dimensions.length).toBe(5);
      const totalPercentage = ADVANCED_ESSAY_RUBRIC.dimensions.reduce((sum, d) => sum + d.percentage, 0);
      expect(totalPercentage).toBe(100);
    });

    it('specifies the 5 prescribed accounting criteria', () => {
      const dimensionIds = ADVANCED_ESSAY_RUBRIC.dimensions.map(d => d.id);
      expect(dimensionIds).toContain('accounting_understanding');
      expect(dimensionIds).toContain('analysis');
      expect(dimensionIds).toContain('evaluation');
      expect(dimensionIds).toContain('evidence_procedures');
      expect(dimensionIds).toContain('structure_language');
    });

    it('each dimension has 4 defined achievement levels (Excellent, Proficient, Developing, Novice)', () => {
      ADVANCED_ESSAY_RUBRIC.dimensions.forEach(dim => {
        expect(dim.rubricLevels.length).toBe(4);
      });
    });
  });

  describe('CurriculumRegistry Integration', () => {
    it('preserves textbook question bank intact at 130 questions', () => {
      const textbookBank = curriculumRegistry.getQuestionBank();
      expect(textbookBank.length).toBe(130);
    });

    it('retrieves training bank questions separately via getTrainingBankQuestions()', () => {
      const trainingBank = curriculumRegistry.getTrainingBankQuestions();
      expect(trainingBank.length).toBe(144);

      const u1Training = curriculumRegistry.getTrainingBankQuestions('unit-1');
      expect(u1Training.length).toBe(36);

      const u2Training = curriculumRegistry.getTrainingBankQuestions('unit-2');
      expect(u2Training.length).toBe(36);

      const u3Training = curriculumRegistry.getTrainingBankQuestions('unit-3');
      expect(u3Training.length).toBe(36);

      const u4Training = curriculumRegistry.getTrainingBankQuestions('unit-4');
      expect(u4Training.length).toBe(36);
    });

    it('provides unified skills via registry', () => {
      const skills = curriculumRegistry.getUnifiedSkills();
      expect(skills.length).toBe(15);
    });

    it('returns complete stats distinguishing textbook questions from training questions', () => {
      const stats = curriculumRegistry.getStats();
      expect(stats.textbookQuestionsCount).toBe(130);
      expect(stats.textbookUnit1Count).toBe(112);
      expect(stats.trainingBankQuestionsCount).toBe(144);
      expect(stats.trainingBankUnit1Count).toBe(36);
      expect(stats.trainingBankUnit2Count).toBe(36);
      expect(stats.trainingBankUnit3Count).toBe(36);
      expect(stats.trainingBankUnit4Count).toBe(36);
      expect(stats.totalAvailableQuestions).toBe(274); // 130 + 144
    });

    it('retrieves questions by id from either textbook or training bank', () => {
      const textbookQ = curriculumRegistry.getQuestionById('eb-mcq-001');
      expect(textbookQ).toBeDefined();

      const trainingQ = curriculumRegistry.getQuestionById('unified-u1-q01');
      expect(trainingQ).toBeDefined();
      expect(trainingQ?.skillCode).toBe('S2');
    });
  });

  describe('Learning Objective Mapping', () => {
    it('maps unit 1 and unit 2 source LOs to canonical IDs', () => {
      const mapped1 = mapSourceLOToCanonical('unit-1', 'LO-01');
      expect(mapped1).toBeDefined();
      expect(mapped1?.canonicalObjectiveId).toBe('obj-1-1');

      const mapped2 = mapSourceLOToCanonical('unit-2', 'LO-01');
      expect(mapped2).toBeDefined();
      expect(mapped2?.canonicalObjectiveId).toBe('obj-2-1');

      expect(mapSourceLOToCanonical('non-existent')).toBeUndefined();
    });
  });
});
