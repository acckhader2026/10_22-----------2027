import { DbUser, DbStudentQuestionAttempt, DbStudentExamAttempt, DbStudentLessonProgress, DbQuestion } from '../../server/db/schema';

export interface CohortMetrics {
  totalStudents: number;
  activeToday: number;
  avgAccuracyRate: number | null;
  avgExamScore: number | null;
  unitCompletionPercentage: number;
  atRiskStudentsCount: number;
  totalAttemptsRecorded: number;
  status: 'EVALUATED' | 'INSUFFICIENT_DATA';
}

export interface StudentRiskProfile {
  studentId: string;
  studentName: string;
  accuracyRate: number;
  attemptsCount: number;
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  primaryIssue: string;
}

export interface ConceptCohortPerformance {
  concept: string;
  lessonId: string;
  attempts: number;
  successRate: number;
  facilityIndex: number; // 0.0 - 1.0 (proportion correct)
  status: 'EXCELLENT' | 'STABLE' | 'NEEDS_REINFORCEMENT' | 'CRITICAL_GAP';
}

export interface ItemAnalysisRecord {
  questionId: string;
  concept: string;
  difficulty: string;
  totalAttempts: number;
  correctCount: number;
  facilityIndex: number; // p-value (0.0 to 1.0)
  discriminationWarning: boolean;
  recommendationAr: string;
}

export interface TeacherAnalyticsReport {
  metrics: CohortMetrics;
  atRiskStudents: StudentRiskProfile[];
  conceptPerformance: ConceptCohortPerformance[];
  itemAnalysis: ItemAnalysisRecord[];
  generatedAt: string;
}

export class TeacherAnalyticsEngine {
  public aggregateCohortData(params: {
    students: DbUser[];
    questions: DbQuestion[];
    questionAttempts: DbStudentQuestionAttempt[];
    examAttempts: DbStudentExamAttempt[];
    lessonProgress: DbStudentLessonProgress[];
  }): TeacherAnalyticsReport {
    const { students, questions, questionAttempts, examAttempts, lessonProgress } = params;

    const totalStudents = students.length;
    const totalAttempts = questionAttempts.length;

    // Check today's active students
    const today = new Date().toISOString().split('T')[0];
    const activeStudentIds = new Set(
      questionAttempts
        .filter(a => a.timestamp.startsWith(today))
        .map(a => a.user_id)
    );
    const activeToday = activeStudentIds.size;

    // Average accuracy across all attempts
    const totalCorrect = questionAttempts.filter(a => a.is_correct).length;
    const avgAccuracyRate = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : null;

    // Average exam score
    const avgExamScore = examAttempts.length > 0
      ? Math.round(examAttempts.reduce((acc, curr) => acc + ((curr.total_score / curr.max_marks) * 100), 0) / examAttempts.length)
      : null;

    // Unit completion rate
    const totalPossibleCompletions = totalStudents * 6; // 6 lessons in Unit 1
    const completedCount = lessonProgress.filter(lp => lp.completed).length;
    const unitCompletionPercentage = totalPossibleCompletions > 0
      ? Math.round((completedCount / totalPossibleCompletions) * 100)
      : 0;

    // Student-level risk analysis
    const studentStats: Record<string, { student: DbUser; attempts: number; correct: number }> = {};
    students.forEach(s => {
      studentStats[s.id] = { student: s, attempts: 0, correct: 0 };
    });

    questionAttempts.forEach(a => {
      if (studentStats[a.user_id]) {
        studentStats[a.user_id].attempts++;
        if (a.is_correct) studentStats[a.user_id].correct++;
      }
    });

    const atRiskStudents: StudentRiskProfile[] = Object.values(studentStats)
      .map(({ student, attempts, correct }) => {
        const rate = attempts > 0 ? Math.round((correct / attempts) * 100) : 0;
        let riskLevel: 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';
        let primaryIssue = 'أداء مستقر ومنتظم';

        if (attempts === 0) {
          riskLevel = 'MEDIUM';
          primaryIssue = 'لم يبدأ حل أي تدريبات بعد';
        } else if (rate < 50) {
          riskLevel = 'HIGH';
          primaryIssue = 'نسبة الدقة منخفضة جداً (أقل من 50%)';
        } else if (rate < 65) {
          riskLevel = 'MEDIUM';
          primaryIssue = 'يحتاج إلى مراجعة وتثبيت المفاهيم الأساسية';
        }

        return {
          studentId: student.id,
          studentName: student.full_name,
          accuracyRate: rate,
          attemptsCount: attempts,
          riskLevel,
          primaryIssue
        };
      })
      .filter(s => s.riskLevel === 'HIGH' || s.riskLevel === 'MEDIUM');

    // Concept cohort performance
    const conceptAgg: Record<string, { concept: string; lessonId: string; total: number; correct: number }> = {};
    questionAttempts.forEach(a => {
      const q = questions.find(item => item.id === a.question_id);
      const conceptName = q?.concept || a.lesson_id;
      if (!conceptAgg[conceptName]) {
        conceptAgg[conceptName] = { concept: conceptName, lessonId: a.lesson_id, total: 0, correct: 0 };
      }
      conceptAgg[conceptName].total++;
      if (a.is_correct) conceptAgg[conceptName].correct++;
    });

    const conceptPerformance: ConceptCohortPerformance[] = Object.values(conceptAgg).map(agg => {
      const rate = agg.total > 0 ? Math.round((agg.correct / agg.total) * 100) : 0;
      const facility = agg.total > 0 ? Number((agg.correct / agg.total).toFixed(2)) : 0;
      let status: ConceptCohortPerformance['status'] = 'NEEDS_REINFORCEMENT';

      if (rate >= 80) status = 'EXCELLENT';
      else if (rate >= 65) status = 'STABLE';
      else if (rate < 50) status = 'CRITICAL_GAP';

      return {
        concept: agg.concept,
        lessonId: agg.lessonId,
        attempts: agg.total,
        successRate: rate,
        facilityIndex: facility,
        status
      };
    });

    // Item analysis for top attempted questions
    const questionAgg: Record<string, { q: DbQuestion; attempts: number; correct: number }> = {};
    questionAttempts.forEach(a => {
      const q = questions.find(item => item.id === a.question_id);
      if (q) {
        if (!questionAgg[q.id]) {
          questionAgg[q.id] = { q, attempts: 0, correct: 0 };
        }
        questionAgg[q.id].attempts++;
        if (a.is_correct) questionAgg[q.id].correct++;
      }
    });

    const itemAnalysis: ItemAnalysisRecord[] = Object.values(questionAgg).map(({ q, attempts, correct }) => {
      const facility = Number((correct / attempts).toFixed(2));
      const isExtreme = facility < 0.25 || facility > 0.95;

      let rec = 'سؤال متزن سيكومترياً';
      if (facility < 0.25) rec = 'سؤال شديد الصعوبة - يرجى مراجعة وضوح الصياغة والمشتتات';
      if (facility > 0.95) rec = 'سؤال شديد السهولة - قد لا يميز بين مستويات الطلاب';

      return {
        questionId: q.id,
        concept: q.concept,
        difficulty: q.difficulty,
        totalAttempts: attempts,
        correctCount: correct,
        facilityIndex: facility,
        discriminationWarning: isExtreme,
        recommendationAr: rec
      };
    });

    return {
      metrics: {
        totalStudents,
        activeToday,
        avgAccuracyRate,
        avgExamScore,
        unitCompletionPercentage,
        atRiskStudentsCount: atRiskStudents.length,
        totalAttemptsRecorded: totalAttempts,
        status: totalAttempts > 0 ? 'EVALUATED' : 'INSUFFICIENT_DATA'
      },
      atRiskStudents,
      conceptPerformance,
      itemAnalysis,
      generatedAt: new Date().toISOString()
    };
  }
}

export const teacherAnalyticsEngine = new TeacherAnalyticsEngine();
