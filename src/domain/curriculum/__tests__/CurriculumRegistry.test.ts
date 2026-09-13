import { describe, it, expect } from 'vitest';
import { curriculumRegistry } from '../CurriculumRegistry';
import { LegacyContentAdapter } from '../adapters/LegacyContentAdapter';

describe('CurriculumRegistry APIs', () => {
  it('getConcepts returns concepts for unit-1', () => {
    const concepts = curriculumRegistry.getConcepts('unit-1');
    expect(concepts.length).toBeGreaterThan(0);
  });

  it('getConcepts returns concepts for a specific lesson in unit-1', () => {
    const concepts = curriculumRegistry.getConcepts('unit-1', 'lesson-1');
    expect(concepts.length).toBeGreaterThan(0);
  });

  it('getSkills returns skills for unit-1', () => {
    const skills = curriculumRegistry.getSkills('unit-1');
    expect(skills.length).toBeGreaterThan(0);
  });

  it('getConcepts for unit-2 reflects current completion', () => {
    const concepts = curriculumRegistry.getConcepts('unit-2');
    expect(Array.isArray(concepts)).toBe(true);
    expect(concepts.length).toBeGreaterThan(0);
  });

  it('handles unknown units', () => {
    expect(curriculumRegistry.getUnitById('unit-99')).toBeUndefined();
    expect(curriculumRegistry.getConcepts('unit-99')).toEqual([]);
    expect(curriculumRegistry.getSkills('unit-99')).toEqual([]);
  });

  it('Adapter usage: validateConcepts works without breaking', () => {
    const result = LegacyContentAdapter.validateConcepts('unit-1', 'lesson-1');
    expect(result.canonicalConceptsCount).toBeGreaterThan(0);
    expect(result.legacyLearningOutcomesCount).toBeGreaterThan(0);
  });

  it('Question Bank Mapping: provides 100% of questions (130 questions) through Registry', () => {
    const bank = curriculumRegistry.getQuestionBank();
    expect(bank.length).toBe(130);

    const summary = curriculumRegistry.getQuestionBankSummary();
    expect(summary.totalQuestions).toBe(130);

    const q1 = curriculumRegistry.getQuestionById('eb-mcq-001');
    expect(q1).toBeDefined();
    expect(q1?.id).toBe('eb-mcq-001');

    const u1Questions = curriculumRegistry.getQuestionsByUnit('unit-1');
    expect(u1Questions.length).toBe(112);

    const u2Questions = curriculumRegistry.getQuestionsByUnit('unit-2');
    expect(u2Questions.length).toBe(18);

    const l1Questions = curriculumRegistry.getQuestionsByLesson('lesson-1');
    expect(l1Questions.length).toBe(25);
  });

  it('Lesson Content Delivery: provides all 12 lessons for UI consumption', () => {
    const allLessons = curriculumRegistry.getAllLessonsContent();
    expect(allLessons.length).toBeGreaterThanOrEqual(12);

    const l1 = curriculumRegistry.getLessonContentById('lesson-1');
    expect(l1).toBeDefined();
    expect(l1?.title).toContain('المحاسبة');

    const u2l1 = curriculumRegistry.getLessonContentById('u2-lesson-1');
    expect(u2l1).toBeDefined();
    expect(u2l1?.title).toContain('القيد المزدوج');
  });

  it('Unit 2 Granular Objectives: objectives have distinct, granular concepts and misconceptions', () => {
    const u2 = curriculumRegistry.getUnitById('unit-2');
    expect(u2).toBeDefined();
    expect(u2?.lessons.length).toBe(6);

    const l1 = u2!.lessons[0];
    const obj1 = l1.objectives[0];
    const obj2 = l1.objectives[1];

    // Verify distinct concepts and misconceptions (no bulk assignment)
    expect(obj1.conceptIds).not.toEqual(obj2.conceptIds);
    expect(obj1.primaryMisconceptions).not.toEqual(obj2.primaryMisconceptions);
    expect(obj1.conceptIds).toContain('concept-unit-2-1');
    expect(obj2.conceptIds).toContain('concept-unit-2-2');
  });

  it('Phase 1 Cloture: Question ID linkage matches adapter queries exactly across all 12 lessons', () => {
    const bank = curriculumRegistry.getQuestionBank();
    expect(bank.length).toBe(130);

    let totalMappedQuestions = 0;
    for (const unitId of ['unit-1', 'unit-2']) {
      const lessons = curriculumRegistry.getLessons(unitId);
      expect(lessons.length).toBe(6);

      for (const lesson of lessons) {
        const canonicalQIds = lesson.questionIds || [];
        const adapterQIds = LegacyContentAdapter.getQuestionIdsForLesson(unitId, lesson.id);
        const registryQIds = curriculumRegistry.getQuestionIds(unitId, lesson.id);
        const registryAliasQIds = curriculumRegistry.getQuestionIdsForLesson(unitId, lesson.id);

        expect(canonicalQIds).toEqual(adapterQIds);
        expect(registryQIds).toEqual(adapterQIds);
        expect(registryAliasQIds).toEqual(adapterQIds);
        totalMappedQuestions += canonicalQIds.length;
      }
    }
    expect(totalMappedQuestions).toBe(130);
  });

  it('Phase 1 Cloture: Registry and Adapter integrity for reviewItemIds and hasExercises', () => {
    const u1ReviewIds = curriculumRegistry.getReviewItemIds('unit-1');
    const u2ReviewIds = curriculumRegistry.getReviewItemIds('unit-2');

    expect(u1ReviewIds.length).toBe(26);
    expect(u2ReviewIds.length).toBe(26);
    expect(u1ReviewIds).toEqual(LegacyContentAdapter.getReviewItemIds('unit-1'));
    expect(u2ReviewIds).toEqual(LegacyContentAdapter.getReviewItemIds('unit-2'));
    expect(curriculumRegistry.getReviewItemIdsForUnit('unit-1')).toEqual(u1ReviewIds);
    expect(curriculumRegistry.getReviewItemIdsForUnit('unit-2')).toEqual(u2ReviewIds);

    for (const unitId of ['unit-1', 'unit-2']) {
      for (let i = 1; i <= 6; i++) {
        const lessonId = `lesson-${i}`;
        expect(curriculumRegistry.hasExercisesForLesson(unitId, lessonId)).toBe(true);
        expect(LegacyContentAdapter.hasLegacyExercises(unitId, lessonId)).toBe(true);
      }
    }
    expect(curriculumRegistry.hasExercisesForLesson('unit-1', 'unknown-lesson')).toBe(false);
  });

  it('Phase 1 Cloture: getLegacyLessonContent and getLessonContentByIndex match legacy content 100%', () => {
    const allLegacy = LegacyContentAdapter.getAllLessonsContent();
    expect(allLegacy.length).toBeGreaterThanOrEqual(12);

    for (let i = 0; i < 12; i++) {
      const legacyLesson = allLegacy[i];
      const registryIndexed = curriculumRegistry.getLessonContentByIndex(i);
      
      let unitId: 'unit-1' | 'unit-2' | 'unit-3' | 'unit-4';
      let lessonId: string;
      if (i < 6) {
        unitId = 'unit-1';
        lessonId = `lesson-${(i % 6) + 1}`;
      }
      else {
        unitId = 'unit-2';
        lessonId = `u2-lesson-${(i % 6) + 1}`;
      }

      const registryByLesson = curriculumRegistry.getLegacyLessonContent(unitId, lessonId);

      expect(registryIndexed.id).toBe(legacyLesson.id);
      expect(registryIndexed.title).toBe(legacyLesson.title);
      expect(registryIndexed.unitId).toBe(legacyLesson.unitId);
      expect(registryIndexed.sections.length).toBe(legacyLesson.sections.length);
      expect(registryIndexed.solvedExamples?.length).toBe(legacyLesson.solvedExamples?.length);
      expect(registryIndexed.quickChecks?.length).toBe(legacyLesson.quickChecks?.length);

      expect(registryByLesson?.id).toBe(legacyLesson.id);
    }
  });

  it('Phase 1 Cloture: All 24 Unit 2 learning objectives have granular definitions and mapped skills', () => {
    const u2 = curriculumRegistry.getUnitById('unit-2');
    expect(u2).toBeDefined();

    let objectiveCount = 0;
    const seenCodes = new Set<string>();

    for (const lesson of u2!.lessons) {
      expect(lesson.objectives.length).toBe(4);
      for (const obj of lesson.objectives) {
        objectiveCount++;
        expect(seenCodes.has(obj.code)).toBe(false);
        seenCodes.add(obj.code);

        expect(obj.titleAr.length).toBeGreaterThan(10);
        expect(obj.conceptIds.length).toBeGreaterThan(0);
        expect(obj.primaryMisconceptions.length).toBeGreaterThan(0);

        // Verify skills map back to this objective
        const mappedSkills = lesson.skills?.filter(s => s.relatedObjectiveIds?.includes(obj.id)) || [];
        expect(mappedSkills.length).toBeGreaterThan(0);
      }
    }
    expect(objectiveCount).toBe(24);
  });

  it('Phase 1 Cloture: Non-deletion verification of all legacy source data files', async () => {
    const fs = await import('fs');
    const legacyFiles = [
      './src/data/lessonsData.ts',
      './src/data/unitReviewData.ts',
      './src/data/unit2ReviewData.ts',
      './src/data/expandedQuestionBank.ts',
      './src/data/unit2Analysis.ts'
    ];

    for (const file of legacyFiles) {
      expect(fs.existsSync(file)).toBe(true);
      const stats = fs.statSync(file);
      expect(stats.size).toBeGreaterThan(1000);
    }
  });

  it('Unit 2 Training Bank: registers all 36 questions with clean separation', () => {
    const u2Training = curriculumRegistry.getUnit2TrainingQuestions();
    expect(u2Training.length).toBe(36);

    // Verify each question is valid and mapped to unit-2
    u2Training.forEach(q => {
      expect(q.unitId).toBe('unit-2');
      expect(q.id).toBeDefined();
      expect(q.question).toBeDefined();
    });

    // Test lesson filtering
    const l1Questions = curriculumRegistry.getUnit2TrainingQuestionsByLesson('lesson-1');
    expect(l1Questions.length).toBeGreaterThan(0);
  });
});
