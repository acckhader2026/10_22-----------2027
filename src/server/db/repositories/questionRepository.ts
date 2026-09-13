import { db } from '../database';
import { DbQuestion, DbQuestionOption, DbLearningObjective } from '../schema';

export class QuestionRepository {
  async getAll(filters?: {
    lessonId?: string;
    learningObjectiveId?: string;
    difficulty?: string;
    status?: string;
    concept?: string;
  }): Promise<(DbQuestion & { options: DbQuestionOption[]; learningObjective?: DbLearningObjective })[]> {
    const questions = db.getQuestions(filters);
    return questions.map(q => ({
      ...q,
      options: db.getQuestionOptions(q.id),
      learningObjective: db.learningObjectives.find(lo => lo.id === q.learning_objective_id)
    }));
  }

  async getById(id: string): Promise<(DbQuestion & { options: DbQuestionOption[]; learningObjective?: DbLearningObjective }) | null> {
    const q = db.getQuestionById(id);
    if (!q) return null;
    return {
      ...q,
      options: db.getQuestionOptions(q.id),
      learningObjective: db.learningObjectives.find(lo => lo.id === q.learning_objective_id)
    };
  }

  async count(): Promise<number> {
    return db.questions.length;
  }

  async countByStatus(status: string): Promise<number> {
    return db.questions.filter(q => q.status === status).length;
  }

  async getUnmapped(): Promise<DbQuestion[]> {
    return db.questions.filter(q => q.status === 'UNMAPPED' || q.learning_objective_id === 'UNMAPPED');
  }

  async create(data: Omit<DbQuestion, 'created_at' | 'updated_at'> & { options?: string[]; correctAnswerIndex?: number }, actorId: string): Promise<DbQuestion> {
    return db.createQuestion(data, actorId);
  }
}

export const questionRepository = new QuestionRepository();
