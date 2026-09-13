import { DbQuestion, DbExam, DbLesson } from '../../server/db/schema';
import { coverageMatrixEngine, CoverageMatrixSummary } from '../assessment/coverage/CoverageMatrixEngine';
import { questionQualityEngine, BankQualitySummary } from '../assessment/quality/QuestionQualityEngine';
import { expandedQuestionBank } from '../../data/expandedQuestionBank';

export interface ContentManagerAnalyticsReport {
  totalQuestions: number;
  totalExams: number;
  totalLessons: number;
  questionsByType: Record<string, number>;
  questionsByDifficulty: Record<string, number>;
  coverageSummary: CoverageMatrixSummary;
  qualitySummary: BankQualitySummary;
  generatedAt: string;
}

export class ContentAnalyticsEngine {
  public generateContentReport(params: {
    questions: DbQuestion[];
    exams: DbExam[];
    lessons: DbLesson[];
  }): ContentManagerAnalyticsReport {
    const { questions, exams, lessons } = params;

    const questionsByType: Record<string, number> = {};
    const questionsByDifficulty: Record<string, number> = {};

    questions.forEach(q => {
      questionsByType[q.type] = (questionsByType[q.type] || 0) + 1;
      questionsByDifficulty[q.difficulty] = (questionsByDifficulty[q.difficulty] || 0) + 1;
    });

    const coverageSummary = coverageMatrixEngine.generateMatrix(expandedQuestionBank);
    const qualitySummary = questionQualityEngine.validateBank(expandedQuestionBank);

    return {
      totalQuestions: questions.length,
      totalExams: exams.length,
      totalLessons: lessons.length,
      questionsByType,
      questionsByDifficulty,
      coverageSummary,
      qualitySummary,
      generatedAt: new Date().toISOString()
    };
  }
}

export const contentAnalyticsEngine = new ContentAnalyticsEngine();
