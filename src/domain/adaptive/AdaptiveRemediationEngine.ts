import { CANONICAL_UNIT_1, LessonSpec, LearningObjectiveSpec } from '../curriculum/CurriculumModel';

export interface RemedialPrescription {
  prescriptionId: string;
  lessonId: string;
  lessonTitleAr: string;
  objectiveId: string;
  objectiveCode: string;
  objectiveTitleAr: string;
  misconceptionDiagnosed: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  recommendedAction: string;
  textbookPageRef: number;
  microReviewNote: string;
  scaffoldedPracticeQuestionId?: string;
  verificationQuestionId?: string;
}

export interface StudentAdaptivePath {
  userId: string;
  overallHealth: 'HEALTHY' | 'NEEDS_TARGETED_REMEDIATION' | 'CRITICAL_INTERVENTION';
  totalWeaknessesIdentified: number;
  prescriptions: RemedialPrescription[];
  nextLearningStep: {
    titleAr: string;
    lessonId: string;
    actionType: 'LESSON_REVIEW' | 'INTERACTIVE_T_ACCOUNT' | 'JRE_WORKSHOP' | 'EXAM_DRILL';
    descriptionAr: string;
  };
  generatedAt: string;
}

export class AdaptiveRemediationEngine {
  public generatePrescription(params: {
    userId: string;
    attempts: Array<{
      question_id: string;
      lesson_id: string;
      is_correct: boolean;
      difficulty: string;
    }>;
    allQuestions: any[];
  }): StudentAdaptivePath {
    const { userId, attempts, allQuestions } = params;

    // Identify failed attempts
    const failedAttempts = attempts.filter(a => !a.is_correct);

    // Group failed attempts by lesson
    const failuresByLesson: Record<string, number> = {};
    const attemptsByLesson: Record<string, number> = {};

    attempts.forEach(a => {
      attemptsByLesson[a.lesson_id] = (attemptsByLesson[a.lesson_id] || 0) + 1;
      if (!a.is_correct) {
        failuresByLesson[a.lesson_id] = (failuresByLesson[a.lesson_id] || 0) + 1;
      }
    });

    const prescriptions: RemedialPrescription[] = [];

    // Map each lesson with weakness to specific curriculum specs
    CANONICAL_UNIT_1.lessons.forEach(lesson => {
      const total = attemptsByLesson[lesson.id] || 0;
      const failed = failuresByLesson[lesson.id] || 0;

      if (failed > 0 || (total > 0 && failed / total >= 0.4)) {
        const errorRate = total > 0 ? failed / total : 1.0;
        const targetObj = lesson.objectives[0]; // primary objective

        const lessonQuestions = allQuestions.filter(q => q.lessonId === lesson.id);
        const practiceQ = lessonQuestions.find(q => q.difficulty === 'basic');
        const verifyQ = lessonQuestions.find(q => q.difficulty === 'intermediate');

        prescriptions.push({
          prescriptionId: `rem-${lesson.id}-${Date.now()}`,
          lessonId: lesson.id,
          lessonTitleAr: lesson.titleAr,
          objectiveId: targetObj.id,
          objectiveCode: targetObj.code,
          objectiveTitleAr: targetObj.titleAr,
          misconceptionDiagnosed: targetObj.primaryMisconceptions[0] || 'صعوبة في استيعاب التوجيه المحاسبي الصحيح',
          severity: errorRate >= 0.6 ? 'HIGH' : errorRate >= 0.3 ? 'MEDIUM' : 'LOW',
          recommendedAction: `مراجعة صفحات كتاب الوزارة (${lesson.textbookPages[0]}-${lesson.textbookPages[1]}) والتدرب على حل التمارين التفاعلية`,
          textbookPageRef: targetObj.bookPageRef,
          microReviewNote: `ركز على مبادئ ${lesson.titleAr} وتطبيق القواعد المحاسبية السليمة قبل الانتقال للمستويات المتقدمة.`,
          scaffoldedPracticeQuestionId: practiceQ?.id,
          verificationQuestionId: verifyQ?.id
        });
      }
    });

    let overallHealth: 'HEALTHY' | 'NEEDS_TARGETED_REMEDIATION' | 'CRITICAL_INTERVENTION' = 'HEALTHY';
    if (prescriptions.some(p => p.severity === 'HIGH')) {
      overallHealth = 'CRITICAL_INTERVENTION';
    } else if (prescriptions.length > 0) {
      overallHealth = 'NEEDS_TARGETED_REMEDIATION';
    }

    let nextStep: {
      titleAr: string;
      lessonId: string;
      actionType: 'LESSON_REVIEW' | 'INTERACTIVE_T_ACCOUNT' | 'JRE_WORKSHOP' | 'EXAM_DRILL';
      descriptionAr: string;
    } = {
      titleAr: 'متابعة التدريب الشامل والمحاكاة النهائية',
      lessonId: 'lesson-6',
      actionType: 'JRE_WORKSHOP',
      descriptionAr: 'أداؤك متميز في كافة المفاهيم. واصل التدرب على مقال التفسير المحاسبي JRE للحصول على الدرجة الكاملة.'
    };

    if (prescriptions.length > 0) {
      const topPrescription = prescriptions.sort((a, b) => (a.severity === 'HIGH' ? -1 : 1))[0];
      nextStep = {
        titleAr: `خطة علاجية: ${topPrescription.lessonTitleAr}`,
        lessonId: topPrescription.lessonId,
        actionType: topPrescription.lessonId === 'lesson-3' || topPrescription.lessonId === 'lesson-4'
          ? 'INTERACTIVE_T_ACCOUNT'
          : 'LESSON_REVIEW',
        descriptionAr: `عالج سوء الفهم في (${topPrescription.misconceptionDiagnosed}) من خلال مراجعة الصفحة ${topPrescription.textbookPageRef} ثم حل أسئلة التثبيت.`
      };
    }

    return {
      userId,
      overallHealth,
      totalWeaknessesIdentified: prescriptions.length,
      prescriptions,
      nextLearningStep: nextStep,
      generatedAt: new Date().toISOString()
    };
  }

  public generateRemediationPlan(params: {
    weakConceptName: string;
    relatedLessonId?: string;
  }): {
    simplifiedRule: string;
    workedExample: string;
    drillQuestionIds: string[];
    targetLessonSlug: string;
  } {
    const { weakConceptName, relatedLessonId = 'lesson-1' } = params;
    return {
      simplifiedRule: `القاعدة المحاسبية الأساسية لـ (${weakConceptName}): كل معاملة تؤثر بتوازن على الأصول والخصوم وحقوق الملكية، مع التمييز الدقيق بين طبيعة الحسابات المدينة والدائنة.`,
      workedExample: `مثال توضيحي: عند شراء أصول ثابتة نقداً، يزيد أصل ويقل أصل آخر بنفس القيمة، مما يحافظ على التوازن التام لمعادلة الميزانية.`,
      drillQuestionIds: ['eb-mcq-001', 'eb-mcq-002'],
      targetLessonSlug: relatedLessonId
    };
  }
}

export const adaptiveRemediationEngine = new AdaptiveRemediationEngine();
