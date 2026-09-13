import { CANONICAL_UNIT_1, LessonSpec, LearningObjectiveSpec, TaxonomyLevel, QuestionDifficulty } from './CurriculumModel';

export interface CoverageItemStats {
  objectiveId: string;
  code: string;
  lessonId: string;
  lessonTitle: string;
  objectiveTitle: string;
  taxonomy: TaxonomyLevel;
  targetWeight: number;
  questionCount: number;
  mcqCount: number;
  appliedCount: number;
  jreCount: number;
  coverageStatus: 'RED' | 'YELLOW' | 'GREEN' | 'BLUE'; // RED=0, YELLOW=1-2, GREEN=3-8, BLUE=>8
  coverageMessage: string;
}

export interface BlueprintAuditReport {
  totalObjectives: number;
  coveredObjectives: number;
  uncoveredObjectives: number;
  coveragePercentage: number;
  totalQuestionsAnalyzed: number;
  
  taxonomyDistribution: Record<TaxonomyLevel, { count: number; percentage: number; targetPercentage: number }>;
  difficultyDistribution: Record<QuestionDifficulty, { count: number; percentage: number; targetPercentage: number }>;
  
  objectiveStats: CoverageItemStats[];
  
  gaps: {
    uncoveredObjectives: string[];
    missingTaxonomyLevels: TaxonomyLevel[];
    insufficientApplicationLessons: string[];
    missingJRERequirements: string[];
  };
  
  healthScore: number; // 0 - 100
  isBalanced: boolean;
  summaryAr: string;
}

export class BlueprintEngine {
  private unitSpec = CANONICAL_UNIT_1;

  public auditQuestionBank(questions: Array<{
    id: string;
    learningObjectiveId?: string;
    lessonId?: string;
    taxonomy?: TaxonomyLevel;
    difficulty?: QuestionDifficulty;
    questionType?: string;
    type?: string;
    concept?: string;
  }>): BlueprintAuditReport {
    const allObjectives = this.unitSpec.lessons.flatMap(l => l.objectives.map(obj => ({ ...obj, lessonTitle: l.titleAr })));
    const totalObjectives = allObjectives.length;

    // Aggregations
    const objectiveCountMap: Record<string, { total: number; mcq: number; applied: number; jre: number }> = {};
    const taxonomyCounts: Record<TaxonomyLevel, number> = {
      Remember: 0,
      Understand: 0,
      Apply: 0,
      Analyze: 0,
      Evaluate: 0,
      Create: 0
    };
    const difficultyCounts: Record<QuestionDifficulty, number> = {
      basic: 0,
      intermediate: 0,
      advanced: 0,
      challenge: 0
    };

    allObjectives.forEach(obj => {
      objectiveCountMap[obj.id] = { total: 0, mcq: 0, applied: 0, jre: 0 };
    });

    questions.forEach(q => {
      // Map to objective
      let objId = q.learningObjectiveId;
      if (!objId && q.lessonId) {
        const matchingLesson = this.unitSpec.lessons.find(l => l.id === q.lessonId || l.id === `lesson-${q.lessonId}`);
        if (matchingLesson && matchingLesson.objectives.length > 0) {
          objId = matchingLesson.objectives[0].id;
        }
      }

      if (objId && objectiveCountMap[objId]) {
        objectiveCountMap[objId].total++;
        const type = (q.questionType || q.type || 'mcq').toLowerCase();
        if (type.includes('mcq') || type.includes('true_false')) {
          objectiveCountMap[objId].mcq++;
        } else if (type.includes('jre') || type.includes('essay')) {
          objectiveCountMap[objId].jre++;
        } else {
          objectiveCountMap[objId].applied++;
        }
      }

      // Taxonomy
      const tax = (q.taxonomy || 'Understand') as TaxonomyLevel;
      if (taxonomyCounts[tax] !== undefined) {
        taxonomyCounts[tax]++;
      } else {
        taxonomyCounts.Understand++;
      }

      // Difficulty
      const diff = (q.difficulty || 'intermediate') as QuestionDifficulty;
      if (difficultyCounts[diff] !== undefined) {
        difficultyCounts[diff]++;
      } else {
        difficultyCounts.intermediate++;
      }
    });

    const objectiveStats: CoverageItemStats[] = allObjectives.map(obj => {
      const counts = objectiveCountMap[obj.id] || { total: 0, mcq: 0, applied: 0, jre: 0 };
      let status: 'RED' | 'YELLOW' | 'GREEN' | 'BLUE' = 'RED';
      let message = 'لا يوجد أي سؤال يغطي هذا المؤشر';

      if (counts.total === 0) {
        status = 'RED';
        message = 'فجوة تغطية كاملة (مطلوب بنك أسئلة لهذا المؤشر)';
      } else if (counts.total <= 2) {
        status = 'YELLOW';
        message = 'تغطية ضعيفة (أقل من الحد الأدنى الموصى به)';
      } else if (counts.total <= 25) {
        status = 'GREEN';
        message = 'تغطية ممتازة ومتوازنة محاسبياً';
      } else {
        status = 'BLUE';
        message = 'تغطية مكثفة جداً (فوق الحد المستهدف)';
      }

      return {
        objectiveId: obj.id,
        code: obj.code,
        lessonId: obj.lessonId,
        lessonTitle: obj.lessonTitle,
        objectiveTitle: obj.titleAr,
        taxonomy: obj.taxonomy,
        targetWeight: obj.weightPercentage,
        questionCount: counts.total,
        mcqCount: counts.mcq,
        appliedCount: counts.applied,
        jreCount: counts.jre,
        coverageStatus: status,
        coverageMessage: message
      };
    });

    const coveredObjectives = objectiveStats.filter(s => s.questionCount > 0).length;
    const uncoveredObjectives = objectiveStats.filter(s => s.questionCount === 0).map(s => `${s.code} - ${s.objectiveTitle}`);
    const coveragePercentage = Math.round((coveredObjectives / totalObjectives) * 100);

    const totalQuestions = questions.length;
    const calcPct = (cnt: number) => totalQuestions > 0 ? Math.round((cnt / totalQuestions) * 100) : 0;

    const taxonomyDistribution: Record<TaxonomyLevel, { count: number; percentage: number; targetPercentage: number }> = {
      Remember: { count: taxonomyCounts.Remember, percentage: calcPct(taxonomyCounts.Remember), targetPercentage: 15 },
      Understand: { count: taxonomyCounts.Understand, percentage: calcPct(taxonomyCounts.Understand), targetPercentage: 20 },
      Apply: { count: taxonomyCounts.Apply, percentage: calcPct(taxonomyCounts.Apply), targetPercentage: 35 },
      Analyze: { count: taxonomyCounts.Analyze, percentage: calcPct(taxonomyCounts.Analyze), targetPercentage: 15 },
      Evaluate: { count: taxonomyCounts.Evaluate, percentage: calcPct(taxonomyCounts.Evaluate), targetPercentage: 10 },
      Create: { count: taxonomyCounts.Create, percentage: calcPct(taxonomyCounts.Create), targetPercentage: 5 }
    };

    const difficultyDistribution: Record<QuestionDifficulty, { count: number; percentage: number; targetPercentage: number }> = {
      basic: { count: difficultyCounts.basic, percentage: calcPct(difficultyCounts.basic), targetPercentage: 25 },
      intermediate: { count: difficultyCounts.intermediate, percentage: calcPct(difficultyCounts.intermediate), targetPercentage: 45 },
      advanced: { count: difficultyCounts.advanced, percentage: calcPct(difficultyCounts.advanced), targetPercentage: 20 },
      challenge: { count: difficultyCounts.challenge, percentage: calcPct(difficultyCounts.challenge), targetPercentage: 10 }
    };

    const missingTaxonomyLevels = (Object.keys(taxonomyDistribution) as TaxonomyLevel[]).filter(
      k => taxonomyDistribution[k].count === 0
    );

    const insufficientApplicationLessons = this.unitSpec.lessons.filter(l => {
      const lessonObjs = objectiveStats.filter(s => s.lessonId === l.id);
      const totalApplied = lessonObjs.reduce((acc, curr) => acc + curr.appliedCount, 0);
      return totalApplied < 2;
    }).map(l => l.titleAr);

    const missingJRERequirements = allObjectives.filter(obj => {
      if (!obj.isJRERequired) return false;
      const stats = objectiveStats.find(s => s.objectiveId === obj.id);
      return !stats || stats.jreCount === 0;
    }).map(obj => `${obj.code}: ${obj.titleAr}`);

    // Compute health score (0-100)
    let healthScore = coveragePercentage * 0.5; // 50% for coverage
    if (missingTaxonomyLevels.length === 0) healthScore += 15;
    if (insufficientApplicationLessons.length === 0) healthScore += 15;
    if (missingJRERequirements.length === 0) healthScore += 20;

    const finalHealth = Math.min(100, Math.round(healthScore));

    return {
      totalObjectives,
      coveredObjectives,
      uncoveredObjectives: objectiveStats.filter(s => s.questionCount === 0).length,
      coveragePercentage,
      totalQuestionsAnalyzed: totalQuestions,
      taxonomyDistribution,
      difficultyDistribution,
      objectiveStats,
      gaps: {
        uncoveredObjectives,
        missingTaxonomyLevels,
        insufficientApplicationLessons,
        missingJRERequirements
      },
      healthScore: finalHealth,
      isBalanced: finalHealth >= 80,
      summaryAr: `تم فحص ${totalQuestions} سؤال عبر ${totalObjectives} مؤشر تعليمي لوثيقة المحاسبة المالية EB. نسبة تغطية المؤشرات بلغت ${coveragePercentage}% مع درجة اتزان بلغت ${finalHealth}/100.`
    };
  }
}

export const blueprintEngine = new BlueprintEngine();
