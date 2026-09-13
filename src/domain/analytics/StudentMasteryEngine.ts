export interface ConceptMasteryRecord {
  conceptId: string;
  conceptNameAr: string;
  lessonId: string;
  totalAttempts: number;
  correctAttempts: number;
  accuracyRate: number;
  masteryScore: number; // 0 - 100
  status: 'INSUFFICIENT_DATA' | 'NEEDS_REMEDIATION' | 'DEVELOPING' | 'PROFICIENT' | 'MASTERED';
  lastAttemptAt?: string;
  misconceptionsDetected: string[];
}

export interface StudentMasteryEvaluation {
  userId: string;
  status: 'INSUFFICIENT_DATA' | 'EVALUATED';
  confidence: number; // 0.0 to 1.0 based on sample size
  compositeMastery: number; // 0 - 100
  masteryBand: 'NOVICE' | 'DEVELOPING' | 'PROFICIENT' | 'MASTERED' | 'NO_DATA';
  
  accuracyComponent: { rawRate: number; weight: 0.40; weightedScore: number };
  difficultyComponent: { rawRate: number; weight: 0.30; weightedScore: number };
  trendComponent: { rawRate: number; weight: 0.20; weightedScore: number };
  breadthComponent: { rawRate: number; weight: 0.10; weightedScore: number };

  totalQuestionsAttempted: number;
  totalCorrect: number;
  examAttemptsCount: number;
  averageExamScore: number | null;
  
  conceptMasteryList: ConceptMasteryRecord[];
  strongestConcepts: string[];
  weakestConcepts: string[];
  actionableInsights: string[];
}

export class StudentMasteryEngine {
  public calculateStudentMastery(params: {
    userId: string;
    questionAttempts: Array<{
      question_id: string;
      lesson_id: string;
      is_correct: boolean;
      difficulty: string;
      timestamp: string;
    }>;
    examAttempts: Array<{
      total_score: number;
      max_marks: number;
      submitted_at: string;
    }>;
    allConceptDefinitions?: Array<{ conceptId: string; conceptNameAr: string; lessonId: string }>;
  }): StudentMasteryEvaluation {
    const { userId, questionAttempts, examAttempts } = params;

    if (questionAttempts.length === 0 && examAttempts.length === 0) {
      return {
        userId,
        status: 'INSUFFICIENT_DATA',
        confidence: 0.0,
        compositeMastery: 0,
        masteryBand: 'NO_DATA',
        accuracyComponent: { rawRate: 0, weight: 0.40, weightedScore: 0 },
        difficultyComponent: { rawRate: 0, weight: 0.30, weightedScore: 0 },
        trendComponent: { rawRate: 0, weight: 0.20, weightedScore: 0 },
        breadthComponent: { rawRate: 0, weight: 0.10, weightedScore: 0 },
        totalQuestionsAttempted: 0,
        totalCorrect: 0,
        examAttemptsCount: 0,
        averageExamScore: null,
        conceptMasteryList: [],
        strongestConcepts: [],
        weakestConcepts: [],
        actionableInsights: ['لا توجد محاولات سابقة للطالب حتى الآن. ابدأ بحل أسئلة الدروس لبناء مؤشر الإتقان.']
      };
    }

    const totalAttempts = questionAttempts.length;
    const totalCorrect = questionAttempts.filter(a => a.is_correct).length;
    const accuracyRate = totalAttempts > 0 ? (totalCorrect / totalAttempts) * 100 : 0;

    // Difficulty Weighting: weighted higher for advanced/challenge items
    const advancedAttempts = questionAttempts.filter(a => a.difficulty === 'advanced' || a.difficulty === 'challenge');
    const advancedCorrect = advancedAttempts.filter(a => a.is_correct).length;
    const difficultyRate = advancedAttempts.length > 0
      ? (advancedCorrect / advancedAttempts.length) * 100
      : accuracyRate * 0.85; // slightly penalized if student avoided advanced items

    // Recent Performance Trend (last 10 items)
    const recentAttempts = questionAttempts.slice(-10);
    const recentCorrect = recentAttempts.filter(a => a.is_correct).length;
    const trendRate = recentAttempts.length > 0 ? (recentCorrect / recentAttempts.length) * 100 : accuracyRate;

    // Breadth & Consistency (across unique lessons)
    const uniqueLessons = new Set(questionAttempts.map(a => a.lesson_id));
    const breadthRate = Math.min(100, (uniqueLessons.size / 6) * 100);

    const accuracyWeighted = accuracyRate * 0.40;
    const difficultyWeighted = difficultyRate * 0.30;
    const trendWeighted = trendRate * 0.20;
    const breadthWeighted = breadthRate * 0.10;

    const rawComposite = accuracyWeighted + difficultyWeighted + trendWeighted + breadthWeighted;
    const compositeMastery = Math.min(100, Math.max(0, Math.round(rawComposite)));

    // Confidence scales with sample size (N=30 gives full 1.0 confidence)
    const confidence = Math.min(1.0, Number((totalAttempts / 25).toFixed(2)));

    let masteryBand: 'NOVICE' | 'DEVELOPING' | 'PROFICIENT' | 'MASTERED' = 'NOVICE';
    if (compositeMastery >= 85) masteryBand = 'MASTERED';
    else if (compositeMastery >= 70) masteryBand = 'PROFICIENT';
    else if (compositeMastery >= 50) masteryBand = 'DEVELOPING';

    // Exam calculations
    const examAttemptsCount = examAttempts.length;
    const averageExamScore = examAttemptsCount > 0
      ? Math.round(examAttempts.reduce((acc, curr) => acc + ((curr.total_score / curr.max_marks) * 100), 0) / examAttemptsCount)
      : null;

    // Group by lesson for concept mastery breakdown
    const lessonGroups: Record<string, { attempts: number; correct: number; lessonId: string }> = {};
    questionAttempts.forEach(a => {
      if (!lessonGroups[a.lesson_id]) {
        lessonGroups[a.lesson_id] = { attempts: 0, correct: 0, lessonId: a.lesson_id };
      }
      lessonGroups[a.lesson_id].attempts++;
      if (a.is_correct) lessonGroups[a.lesson_id].correct++;
    });

    const conceptMasteryList: ConceptMasteryRecord[] = Object.values(lessonGroups).map(grp => {
      const acc = Math.round((grp.correct / grp.attempts) * 100);
      let status: ConceptMasteryRecord['status'] = 'NEEDS_REMEDIATION';
      if (acc >= 85) status = 'MASTERED';
      else if (acc >= 70) status = 'PROFICIENT';
      else if (acc >= 50) status = 'DEVELOPING';

      return {
        conceptId: grp.lessonId,
        conceptNameAr: `مفاهيم ${grp.lessonId}`,
        lessonId: grp.lessonId,
        totalAttempts: grp.attempts,
        correctAttempts: grp.correct,
        accuracyRate: acc,
        masteryScore: acc,
        status,
        misconceptionsDetected: acc < 60 ? ['تحتاج لتكثيف التدريب العملي على القيود والترصيد'] : []
      };
    });

    const strongestConcepts = conceptMasteryList.filter(c => c.accuracyRate >= 80).map(c => c.conceptNameAr);
    const weakestConcepts = conceptMasteryList.filter(c => c.accuracyRate < 65).map(c => c.conceptNameAr);

    const actionableInsights: string[] = [];
    if (weakestConcepts.length > 0) {
      actionableInsights.push(`يوصى بالتركيز على مراجعة: ${weakestConcepts.join('، ')} لرفع معدل الإتقان العام.`);
    }
    if (compositeMastery >= 80) {
      actionableInsights.push('أداء ممتاز! ننصحك بالتدرب على أسئلة التحدي ومقال الـ JRE لضمان التفوق النهائي.');
    } else {
      actionableInsights.push('احرص على حل الأسئلة التطبيقية بانتظام واستخدام دفتر الأستاذ والميزان التفاعلي.');
    }

    return {
      userId,
      status: 'EVALUATED',
      confidence,
      compositeMastery,
      masteryBand,
      accuracyComponent: { rawRate: accuracyRate, weight: 0.40, weightedScore: accuracyWeighted },
      difficultyComponent: { rawRate: difficultyRate, weight: 0.30, weightedScore: difficultyWeighted },
      trendComponent: { rawRate: trendRate, weight: 0.20, weightedScore: trendWeighted },
      breadthComponent: { rawRate: breadthRate, weight: 0.10, weightedScore: breadthWeighted },
      totalQuestionsAttempted: totalAttempts,
      totalCorrect,
      examAttemptsCount,
      averageExamScore,
      conceptMasteryList,
      strongestConcepts,
      weakestConcepts,
      actionableInsights
    };
  }
}

export const studentMasteryEngine = new StudentMasteryEngine();
