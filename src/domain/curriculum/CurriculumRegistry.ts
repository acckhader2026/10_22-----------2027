import { UnitSpec, LessonSpec, LearningObjectiveSpec, ConceptSpec, SkillSpec } from './CurriculumModel';
import { CANONICAL_UNIT_1, CANONICAL_UNIT_2, CANONICAL_UNIT_3, CANONICAL_UNIT_4 } from './CurriculumModel';
import { LegacyContentAdapter } from './adapters/LegacyContentAdapter';
import type { LessonContent } from '../../types';
import type { TraceableQuestion } from '../../data/expandedQuestionBank';
import { UNIFIED_ALL_QUESTIONS, unit1CoreBank, unit2Bank, unit3Bank, unit4Bank } from '../../data/unifiedQuestionBank';
import { UNIFIED_SKILLS, UnifiedSkill } from './SkillTaxonomy';

export class CurriculumRegistry {
  private units: UnitSpec[] = [CANONICAL_UNIT_1, CANONICAL_UNIT_2, CANONICAL_UNIT_3, CANONICAL_UNIT_4];

  public getUnits(): UnitSpec[] {
    return this.units;
  }

  public getUnitById(unitId: string): UnitSpec | undefined {
    const found = this.units.find(u => u.id === unitId);
    if (found) return found;
    return undefined;
  }

  public getUnit(id: string): UnitSpec | undefined {
    return this.getUnitById(id);
  }

  public registerUnit(unit: UnitSpec): void {
    const idx = this.units.findIndex(u => u.id === unit.id);
    if (idx >= 0) {
      this.units[idx] = unit;
    } else {
      this.units.push(unit);
    }
  }

  public unregisterUnit(unitId: string): void {
    this.units = this.units.filter(u => u.id !== unitId);
  }

  public resetUnits(): void {
    this.units = [CANONICAL_UNIT_1, CANONICAL_UNIT_2, CANONICAL_UNIT_3, CANONICAL_UNIT_4];
  }

  public getUnitBySlug(slug: string): UnitSpec | undefined {
    // For now slug is mapped to unit-01, unit-02, but actual ID is unit-1, unit-2
    // Let's implement slug matching
    const mappedId = slug.replace('unit-0', 'unit-');
    const found = this.units.find(u => u.id === mappedId || u.id === slug);
    if (found) return found;
    return undefined;
  }

  public getLessons(unitId: string): LessonSpec[] {
    const unit = this.getUnitById(unitId);
    return unit ? unit.lessons : [];
  }

  public getLessonById(unitId: string, lessonId: string): LessonSpec | undefined {
    const unit = this.getUnitById(unitId);
    return unit?.lessons.find(l => l.id === lessonId);
  }

  public getLesson(unitId: string, lessonId: string): LessonSpec | undefined {
    return this.getLessonById(unitId, lessonId);
  }

  public getLessonBySlug(unitSlug: string, lessonSlug: string): LessonSpec | undefined {
    const unit = this.getUnitBySlug(unitSlug);
    // lessonSlug e.g. lesson-01 -> lesson-1
    const mappedLessonId = lessonSlug.replace('lesson-0', 'lesson-');
    return unit?.lessons.find(l => l.id === mappedLessonId || l.id === lessonSlug);
  }

  /**
   * Returns question IDs for a lesson, or all question IDs for the entire unit if lessonId is omitted.
   * Preserves historical order without duplicates.
   */
  public getQuestionIds(unitId: string, lessonId?: string): string[] {
    const unit = this.getUnitById(unitId);
    if (!unit) return [];
    if (lessonId) {
      const lesson = unit.lessons.find(l => l.id === lessonId);
      if (lesson?.questionIds && lesson.questionIds.length > 0) {
        return lesson.questionIds;
      }
      return LegacyContentAdapter.getQuestionIdsForLesson(unitId, lessonId);
    }
    const unitQuestionIds: string[] = [];
    for (const lesson of unit.lessons) {
      const qIds = (lesson.questionIds && lesson.questionIds.length > 0)
        ? lesson.questionIds
        : LegacyContentAdapter.getQuestionIdsForLesson(unitId, lesson.id);
      for (const qId of qIds) {
        if (!unitQuestionIds.includes(qId)) {
          unitQuestionIds.push(qId);
        }
      }
    }
    return unitQuestionIds;
  }

  /**
   * Alias for getQuestionIds(unitId, lessonId) for backward compatibility.
   */
  public getQuestionIdsForLesson(unitId: string, lessonId: string): string[] {
    return this.getQuestionIds(unitId, lessonId);
  }

  /**
   * Returns review item IDs for a unit via canonical spec or adapter.
   */
  public getReviewItemIds(unitId: string): string[] {
    const unit = this.getUnitById(unitId);
    if (!unit) return [];
    if (unit.reviewItemIds && unit.reviewItemIds.length > 0) {
      return unit.reviewItemIds;
    }
    return LegacyContentAdapter.getReviewItemIdsForUnit(unitId);
  }

  /**
   * Alias for getReviewItemIds(unitId) for backward compatibility.
   */
  public getReviewItemIdsForUnit(unitId: string): string[] {
    return this.getReviewItemIds(unitId);
  }

  /**
   * Checks whether the lesson has exercises via canonical spec or adapter.
   */
  public hasExercisesForLesson(unitId: string, lessonId: string): boolean {
    const lesson = this.getLessonById(unitId, lessonId);
    if (lesson?.hasExercises !== undefined) {
      return lesson.hasExercises;
    }
    return LegacyContentAdapter.hasLegacyExercises(unitId, lessonId);
  }

  /**
   * Official runtime entry point to access the legacy lesson content for a specific lesson.
   * Follows the chain: Canonical UnitSpec -> CurriculumRegistry -> LegacyContentAdapter.
   */
  public getLegacyLessonContent(unitId: string, lessonId: string): LessonContent | undefined {
    const lesson = this.getLessonById(unitId, lessonId);
    const targetRef = lesson?.legacyContentRef || lessonId;
    return LegacyContentAdapter.getLegacyLessonContent(unitId, targetRef);
  }

  /**
   * Gets lesson content by index (0-23) through canonical specification.
   */
  public getLessonContentByIndex(index: number): LessonContent {
    const all = LegacyContentAdapter.getAllLessonsContent();
    if (all && all[index]) {
      return all[index];
    }
    const allCanonicalLessons = this.units.flatMap(u => u.lessons);
    const targetSpec = allCanonicalLessons[index] || allCanonicalLessons[0];
    if (!targetSpec) {
      return all[0];
    }
    const content = this.getLegacyLessonContent(targetSpec.unitId, targetSpec.id);
    return content || all[index] || all[0];
  }

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

  public getObjectiveById(objectiveId: string): LearningObjectiveSpec | undefined {
    for (const unit of this.units) {
      for (const lesson of unit.lessons) {
        const obj = lesson.objectives.find(o => o.id === objectiveId);
        if (obj) return obj;
      }
    }
    return undefined;
  }

  /**
   * Returns all lessons content for UI consumption (Proof Chain bridge)
   */
  public getAllLessonsContent(): LessonContent[] {
    return LegacyContentAdapter.getAllLessonsContent();
  }

  /**
   * Retrieves lesson content by its ID
   */
  public getLessonContentById(id: string): LessonContent | undefined {
    return LegacyContentAdapter.getAllLessonsContent().find(l => l.id === id);
  }

  /**
   * Returns the canonical question bank (130 questions from official textbook).
   * If options.includeTrainingBank is set to true, includes the 72 training bank questions.
   */
  public getQuestionBank(options?: { includeTrainingBank?: boolean }): TraceableQuestion[] {
    const textbookBank = LegacyContentAdapter.getQuestionBank();
    if (options?.includeTrainingBank) {
      return [...textbookBank, ...UNIFIED_ALL_QUESTIONS];
    }
    return textbookBank;
  }

  /**
   * Retrieves questions from the Unified Training Question Bank (72 items: 36 U1 + 36 U2).
   * Kept cleanly separated from official textbook questions.
   */
  public getTrainingBankQuestions(unitId?: string): TraceableQuestion[] {
    if (!unitId) return UNIFIED_ALL_QUESTIONS;
    if (unitId === 'unit-1') return unit1CoreBank;
    if (unitId === 'unit-2') return unit2Bank;
    if (unitId === 'unit-3') return unit3Bank;
    if (unitId === 'unit-4') return unit4Bank;
    return [];
  }

  /**
   * Retrieves the 36 verified training bank questions registered for Unit 2
   */
  public getUnit2TrainingQuestions(): TraceableQuestion[] {
    return unit2Bank;
  }

  /**
   * Retrieves Unit 2 training questions mapped to a specific lesson
   */
  public getUnit2TrainingQuestionsByLesson(lessonId: string): TraceableQuestion[] {
    const target = lessonId.startsWith('u2-') ? lessonId : `u2-${lessonId}`;
    return unit2Bank.filter(q => q.lessonId === target || q.lessonId === lessonId);
  }

  /**
   * Retrieves the 15 unified pedagogical skills (S1 - S15).
   */
  public getUnifiedSkills(): UnifiedSkill[] {
    return UNIFIED_SKILLS;
  }

  /**
   * Returns system statistics with explicit separation between textbook and training bank items.
   */
  public getStats() {
    const textbookBank = LegacyContentAdapter.getQuestionBank();
    const textbookU1 = LegacyContentAdapter.getQuestionsByUnit('unit-1');
    const textbookU2 = LegacyContentAdapter.getQuestionsByUnit('unit-2');
    const textbookU3 = LegacyContentAdapter.getQuestionsByUnit('unit-3');

    return {
      textbookQuestionsCount: textbookBank.length,
      textbookUnit1Count: textbookU1.length,
      textbookUnit2Count: textbookU2.length,
      textbookUnit3Count: textbookU3.length,
      trainingBankQuestionsCount: UNIFIED_ALL_QUESTIONS.length,
      trainingBankUnit1Count: unit1CoreBank.length,
      trainingBankUnit2Count: unit2Bank.length,
      trainingBankUnit3Count: unit3Bank.length,
      trainingBankUnit4Count: unit4Bank.length,
      totalAvailableQuestions: textbookBank.length + UNIFIED_ALL_QUESTIONS.length,
      totalUnits: this.units.length,
      totalLessons: this.units.reduce((acc, u) => acc + u.lessons.length, 0),
      totalObjectives: this.units.reduce(
        (acc, u) => acc + u.lessons.reduce((lAcc, l) => lAcc + l.objectives.length, 0),
        0
      )
    };
  }

  /**
   * Returns question bank summary statistics
   */
  public getQuestionBankSummary() {
    return LegacyContentAdapter.getQuestionBankSummary();
  }

  /**
   * Retrieves a question by its unique ID (searches textbook first, then training bank)
   */
  public getQuestionById(id: string): TraceableQuestion | undefined {
    const fromTextbook = LegacyContentAdapter.getQuestionById(id);
    if (fromTextbook) return fromTextbook;
    return UNIFIED_ALL_QUESTIONS.find(q => q.id === id || q.originalId === id);
  }

  /**
   * Retrieves all questions mapped to a lesson
   */
  public getQuestionsByLesson(lessonId: string): TraceableQuestion[] {
    return LegacyContentAdapter.getQuestionsByLesson(lessonId);
  }

  /**
   * Retrieves all questions mapped to a lesson (alias for getQuestionsByLesson)
   */
  public getQuestionsForLesson(lessonId: string): TraceableQuestion[] {
    return this.getQuestionsByLesson(lessonId);
  }

  /**
   * Retrieves all questions mapped to a learning objective
   */
  public getQuestionsByObjective(objectiveId: string): TraceableQuestion[] {
    return LegacyContentAdapter.getQuestionsByObjective(objectiveId);
  }

  /**
   * Retrieves all questions mapped to a unit
   */
  public getQuestionsByUnit(unitId: string): TraceableQuestion[] {
    return LegacyContentAdapter.getQuestionsByUnit(unitId);
  }
}

export const curriculumRegistry = new CurriculumRegistry();
