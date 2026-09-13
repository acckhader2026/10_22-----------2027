import { db } from '../database';
import { DbExam, DbStudentExamAttempt } from '../schema';

export class ExamRepository {
  async getAll(): Promise<DbExam[]> {
    return db.getExams();
  }

  async getById(id: string): Promise<DbExam | null> {
    const exam = db.getExamById(id);
    return exam || null;
  }

  async createAttempt(data: {
    userId: string;
    examId: string;
    totalScore: number;
    maxMarks: number;
    percentage: number;
    timeTakenSeconds: number;
    answers: Record<string, any>;
    rubricEvaluations?: Record<string, any>;
  }): Promise<DbStudentExamAttempt> {
    return db.recordExamAttempt({
      user_id: data.userId,
      exam_id: data.examId,
      total_score: data.totalScore,
      max_marks: data.maxMarks,
      percentage: data.percentage,
      time_taken_seconds: data.timeTakenSeconds,
      answers: data.answers,
      rubric_evaluations: data.rubricEvaluations
    });
  }

  async getAttemptsByUser(userId: string): Promise<DbStudentExamAttempt[]> {
    return db.examAttempts
      .filter(e => e.user_id === userId)
      .sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime());
  }

  async countAttempts(): Promise<number> {
    return db.examAttempts.length;
  }
}

export const examRepository = new ExamRepository();
