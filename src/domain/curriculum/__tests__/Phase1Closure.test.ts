import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import { curriculumRegistry } from '../CurriculumRegistry';
import { LegacyContentAdapter } from '../adapters/LegacyContentAdapter';
import { CANONICAL_UNIT_1, CANONICAL_UNIT_2 } from '../CurriculumModel';
import { expandedQuestionBank } from '../../../data/expandedQuestionBank';
import { comprehensiveExams } from '../../../data/examsData';
import { allLessons as legacyAllLessons } from '../../../data/lessonsData';

describe('Phase 1 True Full Closure Suite', () => {
  // 1. Two canonical units exist
  it('Phase 1 Cloture: exactly two canonical units exist', () => {
    const units = curriculumRegistry.getUnits();
    expect(units.length).toBe(2);
    expect(units.map(u => u.id)).toEqual(['unit-1', 'unit-2']);
  });

  // 2. Exactly 6 lessons in each unit, totaling 12 lessons
  it('Phase 1 Cloture: exactly 6 lessons in each unit (12 lessons total)', () => {
    const u1Lessons = curriculumRegistry.getLessons('unit-1');
    const u2Lessons = curriculumRegistry.getLessons('unit-2');
    expect(u1Lessons.length).toBe(6);
    expect(u2Lessons.length).toBe(6);
    expect(u1Lessons.length + u2Lessons.length).toBe(12);
  });

  // 3. Four reference fields exist on all 12 lessons
  it('Phase 1 Cloture: all 12 lessons contain the 4 required reference fields', () => {
    const allLessons = [...CANONICAL_UNIT_1.lessons, ...CANONICAL_UNIT_2.lessons];
    expect(allLessons.length).toBe(12);

    for (const lesson of allLessons) {
      // questionIds
      expect(Array.isArray(lesson.questionIds)).toBe(true);
      expect(lesson.questionIds!.length).toBeGreaterThan(0);

      // reviewItemIds
      expect(Array.isArray(lesson.reviewItemIds)).toBe(true);
      expect(lesson.reviewItemIds!.length).toBeGreaterThan(0);

      // hasExercises
      expect(typeof lesson.hasExercises).toBe('boolean');
      expect(lesson.hasExercises).toBe(true);

      // legacyContentRef
      expect(typeof lesson.legacyContentRef).toBe('string');
      expect(lesson.legacyContentRef!.length).toBeGreaterThan(0);
    }
  });

  // 4. Match lesson.questionIds with LegacyContentAdapter.getQuestionIdsForLesson
  it('Phase 1 Cloture: lesson.questionIds matches LegacyContentAdapter.getQuestionIdsForLesson exactly', () => {
    for (const unitId of ['unit-1', 'unit-2']) {
      const lessons = curriculumRegistry.getLessons(unitId);
      for (const lesson of lessons) {
        const adapterQIds = LegacyContentAdapter.getQuestionIdsForLesson(unitId, lesson.id);
        expect(lesson.questionIds).toEqual(adapterQIds);
      }
    }
  });

  // 5. Execution of curriculumRegistry.getQuestionIds(unitId, lessonId)
  it('Phase 1 Cloture: curriculumRegistry.getQuestionIds(unitId, lessonId) works accurately for every lesson', () => {
    for (const unitId of ['unit-1', 'unit-2']) {
      const lessons = curriculumRegistry.getLessons(unitId);
      for (const lesson of lessons) {
        const qIds = curriculumRegistry.getQuestionIds(unitId, lesson.id);
        expect(Array.isArray(qIds)).toBe(true);
        expect(qIds.length).toBeGreaterThan(0);
        expect(qIds).toEqual(lesson.questionIds);
      }
    }
  });

  // 6. Execution of curriculumRegistry.getQuestionIds(unitId) at unit level
  it('Phase 1 Cloture: curriculumRegistry.getQuestionIds(unitId) works at unit level without duplicates or omission', () => {
    const u1QIds = curriculumRegistry.getQuestionIds('unit-1');
    const u2QIds = curriculumRegistry.getQuestionIds('unit-2');

    expect(u1QIds.length).toBe(112);
    expect(u2QIds.length).toBe(18);
    expect(u1QIds.length + u2QIds.length).toBe(130);

    // No duplicates in unit level arrays
    expect(new Set(u1QIds).size).toBe(u1QIds.length);
    expect(new Set(u2QIds).size).toBe(u2QIds.length);

    // Historical order preserved: matches sequential concat of lesson questions
    const u1Expected = CANONICAL_UNIT_1.lessons.flatMap(l => l.questionIds || []);
    const u2Expected = CANONICAL_UNIT_2.lessons.flatMap(l => l.questionIds || []);
    expect(u1QIds).toEqual(u1Expected);
    expect(u2QIds).toEqual(u2Expected);
  });

  // 7. Execution of curriculumRegistry.getReviewItemIds(unitId)
  it('Phase 1 Cloture: curriculumRegistry.getReviewItemIds(unitId) returns stable review references', () => {
    const u1Review = curriculumRegistry.getReviewItemIds('unit-1');
    const u2Review = curriculumRegistry.getReviewItemIds('unit-2');

    expect(u1Review.length).toBe(26);
    expect(u2Review.length).toBe(26);
    expect(new Set(u1Review).size).toBe(26);
    expect(new Set(u2Review).size).toBe(26);

    // Unknown unit returns empty array
    expect(curriculumRegistry.getReviewItemIds('unit-99')).toEqual([]);
  });

  // 8. Matching between Registry and Adapter results
  it('Phase 1 Cloture: Registry results match Adapter results 100%', () => {
    expect(curriculumRegistry.getReviewItemIds('unit-1')).toEqual(LegacyContentAdapter.getReviewItemIds('unit-1'));
    expect(curriculumRegistry.getReviewItemIds('unit-2')).toEqual(LegacyContentAdapter.getReviewItemIds('unit-2'));
    expect(curriculumRegistry.getReviewItemIdsForUnit('unit-1')).toEqual(curriculumRegistry.getReviewItemIds('unit-1'));
    expect(curriculumRegistry.getReviewItemIdsForUnit('unit-2')).toEqual(curriculumRegistry.getReviewItemIds('unit-2'));

    expect(curriculumRegistry.getQuestionIds('unit-1')).toEqual(LegacyContentAdapter.getQuestionIds('unit-1'));
    expect(curriculumRegistry.getQuestionIds('unit-2')).toEqual(LegacyContentAdapter.getQuestionIds('unit-2'));

    for (const unitId of ['unit-1', 'unit-2']) {
      for (let i = 1; i <= 6; i++) {
        const lessonId = `lesson-${i}`;
        expect(curriculumRegistry.getQuestionIds(unitId, lessonId)).toEqual(LegacyContentAdapter.getQuestionIds(unitId, lessonId));
        expect(curriculumRegistry.getQuestionIdsForLesson(unitId, lessonId)).toEqual(curriculumRegistry.getQuestionIds(unitId, lessonId));
      }
    }
  });

  // 9. Zero unknown question IDs
  it('Phase 1 Cloture: zero unknown question IDs in canonical models', () => {
    const validQuestionIdSet = new Set(expandedQuestionBank.map(q => q.id));
    const allLessonQuestionIds = [
      ...CANONICAL_UNIT_1.lessons.flatMap(l => l.questionIds || []),
      ...CANONICAL_UNIT_2.lessons.flatMap(l => l.questionIds || [])
    ];

    expect(allLessonQuestionIds.length).toBe(130);
    for (const qId of allLessonQuestionIds) {
      expect(validQuestionIdSet.has(qId)).toBe(true);
    }
  });

  // 10. No loss or duplication of question references across lessons
  it('Phase 1 Cloture: zero loss and zero cross-lesson duplication of question references', () => {
    const allLessonQuestionIds = [
      ...CANONICAL_UNIT_1.lessons.flatMap(l => l.questionIds || []),
      ...CANONICAL_UNIT_2.lessons.flatMap(l => l.questionIds || [])
    ];
    const uniqueIds = new Set(allLessonQuestionIds);
    expect(uniqueIds.size).toBe(130);
    expect(allLessonQuestionIds.length).toBe(130);
  });

  // 11. Verification of hasExercises against real legacy lesson content
  it('Phase 1 Cloture: hasExercises verified against real legacy lesson content', () => {
    for (const unitId of ['unit-1', 'unit-2']) {
      for (let i = 1; i <= 6; i++) {
        const lessonId = `lesson-${i}`;
        const hasEx = curriculumRegistry.hasExercisesForLesson(unitId, lessonId);
        expect(hasEx).toBe(true);
        expect(LegacyContentAdapter.hasLegacyExercises(unitId, lessonId)).toBe(true);
      }
    }
    expect(curriculumRegistry.hasExercisesForLesson('unit-1', 'non-existent')).toBe(false);
  });

  // 12. LessonViewer data parity for all 12 lessons
  it('Phase 1 Cloture: LessonViewer data parity for all 12 lessons', () => {
    for (let i = 0; i < 12; i++) {
      const before = legacyAllLessons[i];
      const after = curriculumRegistry.getLessonContentByIndex(i);

      expect(after.id).toBe(before.id);
      expect(after.title).toBe(before.title);
      expect(after.unitId).toBe(before.unitId);
      expect(after.sections.length).toBe(before.sections.length);
      expect(after.solvedExamples?.length).toBe(before.solvedExamples?.length);
      expect(after.quickChecks?.length).toBe(before.quickChecks?.length);
      expect(after.lessonQuiz?.totalMarks).toBe(before.lessonQuiz?.totalMarks);
      expect(after.lessonQuiz?.mcqs?.length).toBe(before.lessonQuiz?.mcqs?.length);
      expect(after.lessonQuiz?.trueFalse?.length).toBe(before.lessonQuiz?.trueFalse?.length);
    }
  });

  // 13. Retention of question IDs and answer keys
  it('Phase 1 Cloture: question IDs and answer keys intact in question bank', () => {
    expect(expandedQuestionBank.length).toBe(130);
    for (const q of expandedQuestionBank) {
      expect(q.id).toBeDefined();
      expect(q.id.length).toBeGreaterThan(0);
      expect(q.correctAnswer).toBeDefined();
      expect(String(q.correctAnswer).length).toBeGreaterThan(0);
      if (q.options) {
        expect(Array.isArray(q.options)).toBe(true);
        expect(q.options.length).toBeGreaterThan(0);
      }
      expect(q.lessonId).toBeDefined();
      expect(q.unitId).toBeDefined();
    }
  });

  // 14. Legacy files exist and are non-empty
  it('Phase 1 Cloture: legacy files retained and not deleted', () => {
    const legacyPaths = [
      'src/data/lessonsData.ts',
      'src/data/unitReviewData.ts',
      'src/data/unit2ReviewData.ts',
      'src/data/expandedQuestionBank.ts',
      'src/data/unit2Analysis.ts',
      'src/data/examsData.ts'
    ];

    for (const relPath of legacyPaths) {
      expect(fs.existsSync(relPath)).toBe(true);
      const stat = fs.statSync(relPath);
      expect(stat.size).toBeGreaterThan(1000);
    }
  });

  // 15. No direct runtime import of legacy data in components
  it('Phase 1 Cloture: no direct runtime data imports in LessonViewer or QuestionBankViewer', () => {
    const lessonViewerCode = fs.readFileSync('src/components/LessonViewer.tsx', 'utf-8');
    const qbankViewerCode = fs.readFileSync('src/components/QuestionBankViewer.tsx', 'utf-8');

    // LessonViewer should not import raw lessonsData array
    expect(lessonViewerCode).not.toMatch(/from\s+['"][^'"]*lessonsData['"]/);
    expect(lessonViewerCode).toContain("from '../domain/curriculum/CurriculumRegistry'");

    // QuestionBankViewer should not have runtime import of expandedQuestionBank
    expect(qbankViewerCode).not.toMatch(/import\s+\{\s*expandedQuestionBank\s*\}\s+from/);
    expect(qbankViewerCode).toContain("import type { TraceableQuestion } from '../data/expandedQuestionBank'");
    expect(qbankViewerCode).toContain('curriculumRegistry.getQuestionBank()');
  });

  // 16. Unit 2 24 objectives with concepts, skills, and misconceptions
  it('Phase 1 Cloture: Unit 2 contains 24 distinct objectives with concepts, skills, and misconceptions', () => {
    const u2 = curriculumRegistry.getUnitById('unit-2');
    expect(u2).toBeDefined();
    expect(u2!.lessons.length).toBe(6);

    let totalObjectives = 0;
    const allSkills = curriculumRegistry.getSkills('unit-2');
    expect(allSkills.length).toBe(59);

    for (const lesson of u2!.lessons) {
      expect(lesson.objectives.length).toBe(4);
      for (const obj of lesson.objectives) {
        totalObjectives++;
        expect(obj.id).toBeDefined();
        expect(obj.titleAr.length).toBeGreaterThan(10);
        expect(obj.conceptIds.length).toBeGreaterThan(0);
        expect(obj.primaryMisconceptions.length).toBeGreaterThan(0);

        // Verify skills map back to this objective
        const mappedSkills = lesson.skills?.filter(s => s.relatedObjectiveIds?.includes(obj.id)) || [];
        expect(mappedSkills.length).toBeGreaterThan(0);
      }
    }
    expect(totalObjectives).toBe(24);
  });

  // 17. Integrity of examsData.ts
  it('Phase 1 Cloture: examsData.ts is integral and contains expected exams and questions', () => {
    expect(comprehensiveExams.length).toBe(2);
    expect(comprehensiveExams[0].id).toBe('exam-1');
    expect(comprehensiveExams[1].id).toBe('exam-simulation-eb');
    expect(comprehensiveExams[0].totalMarks).toBe(50);
    expect(comprehensiveExams[1].totalMarks).toBe(60);
    expect(comprehensiveExams[0].sections.length).toBeGreaterThan(0);
    expect(comprehensiveExams[1].sections.length).toBeGreaterThan(0);
  });
});
