import { allLessons, unit1Lessons, unit2Lessons } from '../../../data/lessonsData';
import { unitReviewData } from '../../../data/unitReviewData';
import { unit2ReviewData } from '../../../data/unit2ReviewData';
import { CANONICAL_UNIT_1, CANONICAL_UNIT_2, LessonSpec, ConceptSpec, SkillSpec } from '../CurriculumModel';
import { expandedQuestionBank, questionBankSummary, TraceableQuestion } from '../../../data/expandedQuestionBank';
import { unit3CoreBank } from '../../../data/unit3CoreBank';
import { unit4CoreBank } from '../../../data/unit4CoreBank';
import type { LessonContent } from '../../../types';

/**
 * Adapter to bridge legacy static content (LessonContent, Review data, Question Bank)
 * into the Canonical Architecture without deleting the old files.
 */
export class LegacyContentAdapter {
  
  /**
   * Returns all lessons content across Unit 1 and Unit 2.
   */
  static getAllLessonsContent(): LessonContent[] {
    return allLessons;
  }

  /**
   * Fetches the legacy lesson content object for a given canonical lesson ID.
   */
  static getLegacyLessonContent(unitId: string, lessonId: string): LessonContent | undefined {
    // legacy U1 lessons use 'lesson-X', U2 lessons use 'u2-lesson-X', U3 lessons use 'lesson-3-X'
    let legacyId = lessonId;
    if (unitId === 'unit-2' && !lessonId.startsWith('u2-')) {
      legacyId = `u2-${lessonId}`;
    } else if (unitId === 'unit-3' && !lessonId.startsWith('lesson-3-')) {
      legacyId = `lesson-3-${lessonId.replace('lesson-', '')}`;
    } else if (unitId === 'unit-4' && !lessonId.startsWith('lesson-4-')) {
      legacyId = `lesson-4-${lessonId.replace('lesson-', '')}`;
    }
    const lesson = allLessons.find(l => l.id === legacyId || l.id === lessonId);
    if (!lesson) return undefined;
    return {
      ...lesson,
      unitId: (lesson.unitId || (unitId as import('../../../types').UnitId))
    };
  }

  /**
   * Returns question IDs belonging to a specific lesson, or all questions in unit if lessonId is omitted.
   * Handles both canonical lessonId ('lesson-1') and legacy names ('u2-lesson-1').
   */
  static getQuestionIds(unitId: string, lessonId?: string): string[] {
    if (lessonId) {
      return this.getQuestionIdsForLesson(unitId, lessonId);
    }
    const allLessonIds = ['lesson-1', 'lesson-2', 'lesson-3', 'lesson-4', 'lesson-5', 'lesson-6'];
    const result: string[] = [];
    for (const lid of allLessonIds) {
      const qIds = this.getQuestionIdsForLesson(unitId, lid);
      for (const q of qIds) {
        if (!result.includes(q)) result.push(q);
      }
    }
    return result;
  }

  /**
   * Returns question IDs belonging to a specific lesson.
   * Handles both canonical lessonId ('lesson-1') and legacy names ('u2-lesson-1').
   */
  static getQuestionIdsForLesson(unitId: string, lessonId: string): string[] {
    if (unitId === 'unit-3') {
      const num = lessonId.replace('lesson-3-', '').replace('lesson-', '');
      const targetLid = `lesson-3-${num}`;
      return unit3CoreBank
        .filter(q => q.lessonId === targetLid || q.lessonId === lessonId)
        .map(q => q.id);
    }
    if (unitId === 'unit-4') {
      const num = lessonId.replace('lesson-4-', '').replace('lesson-', '');
      const targetLid = `lesson-4-${num}`;
      return unit4CoreBank
        .filter(q => q.lessonId === targetLid || q.lessonId === lessonId)
        .map(q => q.id);
    }
    const targetLessonId = (unitId === 'unit-2' && !lessonId.startsWith('u2-'))
      ? `u2-${lessonId}`
      : lessonId;
    return expandedQuestionBank
      .filter(q => q.lessonId === targetLessonId)
      .map(q => q.id);
  }

  /**
   * Returns stable, traceable review item IDs for a unit from unitReviewData / unit2ReviewData.
   */
  static getReviewItemIds(unitId: string): string[] {
    return this.getReviewItemIdsForUnit(unitId);
  }

  /**
   * Returns stable, traceable review item IDs for a unit from unitReviewData / unit2ReviewData.
   */
  static getReviewItemIdsForUnit(unitId: string): string[] {
    if (unitId === 'unit-1') {
      return [
        ...unitReviewData.unitOutcomes.map((_, i) => `u1-outcome-${i + 1}`),
        ...unitReviewData.theBigPicture.diagramSteps.map(s => `u1-step-${s.step}`),
        ...unitReviewData.maryamComprehensiveCase.steps.map(s => `maryam-step-${s.step}`),
        ...unitReviewData.commonErrors.map(e => e.id),
        ...unitReviewData.jreScaffoldedSuite.map(j => j.id),
      ];
    }
    if (unitId === 'unit-2') {
      return [
        ...unit2ReviewData.unitOutcomes.map((_, i) => `u2-outcome-${i + 1}`),
        ...unit2ReviewData.theBigPicture.diagramSteps.map(s => `u2-step-${s.step}`),
        ...unit2ReviewData.maryamComprehensiveCase.steps.map(s => `u2-maryam-step-${s.step}`),
        ...unit2ReviewData.commonErrors.map(e => e.id),
        ...unit2ReviewData.jreScaffoldedSuite.map(j => j.id),
      ];
    }
    return [];
  }

  /**
   * Evaluates actual presence of legacy exercise and practice elements in the lesson content:
   * solvedExamples, quickChecks, thinkLikeAnAccountantQuestions, realWorldCase, or lessonQuiz.
   */
  static hasLegacyExercises(unitId: string, lessonId: string): boolean {
    const lesson = this.getLegacyLessonContent(unitId, lessonId);
    if (!lesson) return false;
    const solvedCount = lesson.solvedExamples?.length || 0;
    const quickCount = lesson.quickChecks?.length || 0;
    const thinkCount = lesson.thinkLikeAnAccountantQuestions?.length || 0;
    const caseCount = lesson.realWorldCase ? 1 : 0;
    const quizCount = (lesson.lessonQuiz?.mcqs?.length || 0) + 
      (lesson.lessonQuiz?.trueFalse?.length || 0) + 
      (lesson.lessonQuiz?.appliedQuestions?.length || 0);
    return (solvedCount + quickCount + thinkCount + caseCount + quizCount) > 0;
  }

  /**
   * Fetches the legacy unit review data for a given canonical unit ID.
   */
  static getLegacyUnitReview(unitId: string) {
    if (unitId === 'unit-1') return unitReviewData;
    if (unitId === 'unit-2') return unit2ReviewData;
    return null;
  }

  /**
   * Returns the entire traceable question bank (130 questions).
   */
  static getQuestionBank(): TraceableQuestion[] {
    return expandedQuestionBank;
  }

  /**
   * Returns summary statistics for the question bank.
   */
  static getQuestionBankSummary() {
    return questionBankSummary;
  }

  /**
   * Fetches a question by its unique ID.
   */
  static getQuestionById(id: string): TraceableQuestion | undefined {
    return expandedQuestionBank.find(q => q.id === id) || unit3CoreBank.find(q => q.id === id) || unit4CoreBank.find(q => q.id === id);
  }

  /**
   * Fetches questions by lesson ID. Supports exact lessonId ('lesson-1', 'u2-lesson-1', etc.).
   */
  static getQuestionsByLesson(lessonId: string): TraceableQuestion[] {
    const legacy = expandedQuestionBank.filter(q => q.lessonId === lessonId);
    if (legacy.length > 0) return legacy;
    const u3 = unit3CoreBank.filter(q => q.lessonId === lessonId);
    if (u3.length > 0) return u3;
    return unit4CoreBank.filter(q => q.lessonId === lessonId);
  }

  /**
   * Fetches questions by learning objective ID.
   */
  static getQuestionsByObjective(objectiveId: string): TraceableQuestion[] {
    const legacy = expandedQuestionBank.filter(q => q.learningObjectiveId === objectiveId);
    if (legacy.length > 0) return legacy;
    const u3 = unit3CoreBank.filter(q => q.learningObjectiveId === objectiveId);
    if (u3.length > 0) return u3;
    return unit4CoreBank.filter(q => q.learningObjectiveId === objectiveId);
  }

  /**
   * Fetches questions by unit ID ('unit-1', 'unit-2', 'unit-3', 'unit-4').
   */
  static getQuestionsByUnit(unitId: string): TraceableQuestion[] {
    if (unitId === 'unit-3') {
      return unit3CoreBank;
    }
    if (unitId === 'unit-4') {
      return unit4CoreBank;
    }
    return expandedQuestionBank.filter(q => q.unitId === unitId);
  }

  /**
   * Attempts to extract ReviewItems (which are not yet in Canonical UnitSpec)
   * into a unified format for future mapping.
   */
  static extractCanonicalReviewItems(unitId: string) {
    const reviewData = this.getLegacyUnitReview(unitId);
    if (!reviewData) return [];
    
    const errors = (reviewData as any).commonErrors || [];
    return errors.map((item: any, index: number) => ({
      id: `review-${unitId}-${index + 1}`,
      titleAr: item.mistake || item.title || 'Review Item',
      legacyRef: item
    }));
  }

  /**
   * Synchronizes or validates Concepts between Legacy and Canonical.
   * Legacy has 'whatYouWillLearn', Canonical has 'concepts'.
   */
  static validateConcepts(unitId: string, lessonId: string) {
    const unit = unitId === 'unit-1' ? CANONICAL_UNIT_1 : CANONICAL_UNIT_2;
    const canonicalLesson = unit.lessons.find(l => l.id === lessonId);
    const legacyLesson = this.getLegacyLessonContent(unitId, lessonId);
    
    return {
      canonicalConceptsCount: canonicalLesson?.concepts?.length || 0,
      legacyLearningOutcomesCount: legacyLesson?.whatYouWillLearn?.length || 0,
    };
  }
}
