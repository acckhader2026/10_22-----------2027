import { db } from '../database';
import { 
  DbStudentQuestionAttempt, 
  DbStudentMasterySnapshot, 
  DbAdaptiveRecommendation 
} from '../schema';

export class AttemptRepository {
  async recordQuestionAttempt(data: {
    userId: string;
    questionId: string;
    lessonId: string;
    examAttemptId?: string;
    userAnswer: string;
    isCorrect: boolean;
    score: number;
    maxScore: number;
    timeSpentSeconds?: number;
    difficulty?: string;
    gradingMetadata?: Record<string, any>;
  }): Promise<DbStudentQuestionAttempt> {
    const userAttemptsCount = db.questionAttempts.filter(
      a => a.user_id === data.userId && a.question_id === data.questionId
    ).length;

    return db.recordQuestionAttempt({
      user_id: data.userId,
      question_id: data.questionId,
      lesson_id: data.lessonId,
      exam_attempt_id: data.examAttemptId,
      user_answer: data.userAnswer,
      is_correct: data.isCorrect,
      score: data.score,
      max_score: data.maxScore,
      time_spent_seconds: data.timeSpentSeconds || 0,
      attempt_number: userAttemptsCount + 1,
      difficulty: data.difficulty || 'basic',
      grading_metadata: data.gradingMetadata
    });
  }

  async getAttemptsByUser(userId: string): Promise<DbStudentQuestionAttempt[]> {
    return db.questionAttempts
      .filter(a => a.user_id === userId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  async countAttempts(): Promise<number> {
    return db.questionAttempts.length;
  }
}

export const attemptRepository = new AttemptRepository();

export class MasteryRepository {
  async saveSnapshot(userId: string): Promise<DbStudentMasterySnapshot> {
    return db.recalculateAndSaveMasterySnapshot(userId);
  }

  async getSnapshotsByUser(userId: string): Promise<DbStudentMasterySnapshot[]> {
    return db.masterySnapshots
      .filter(s => s.user_id === userId)
      .sort((a, b) => new Date(b.calculated_at).getTime() - new Date(a.calculated_at).getTime());
  }

  async getRecommendationsByUser(userId: string): Promise<DbAdaptiveRecommendation[]> {
    return db.recommendations
      .filter(r => r.user_id === userId && !r.resolved)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  async markRecommendationResolved(id: string): Promise<void> {
    const rec = db.recommendations.find(r => r.id === id);
    if (rec) {
      rec.resolved = true;
      db.persist();
    }
  }
}

export const masteryRepository = new MasteryRepository();
