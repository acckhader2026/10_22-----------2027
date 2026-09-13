import { db } from '../database';
import { DbLesson, DbLearningObjective, DbStudentLessonProgress } from '../schema';

export class LessonRepository {
  async getAll(): Promise<(DbLesson & { learningObjectives: DbLearningObjective[] })[]> {
    return db.lessons.map(lesson => ({
      ...lesson,
      learningObjectives: db.learningObjectives.filter(lo => lo.lesson_id === lesson.id)
    })).sort((a, b) => a.order_index - b.order_index);
  }

  async getById(id: string): Promise<(DbLesson & { learningObjectives: DbLearningObjective[] }) | null> {
    const lesson = db.lessons.find(l => l.id === id);
    if (!lesson) return null;
    return {
      ...lesson,
      learningObjectives: db.learningObjectives.filter(lo => lo.lesson_id === lesson.id)
    };
  }

  async getLearningObjectives(lessonId?: string): Promise<DbLearningObjective[]> {
    if (lessonId) {
      return db.learningObjectives.filter(lo => lo.lesson_id === lessonId);
    }
    return db.learningObjectives;
  }

  async getProgressByUser(userId: string): Promise<DbStudentLessonProgress[]> {
    return db.lessonProgress
      .filter(lp => lp.user_id === userId)
      .sort((a, b) => new Date(b.last_accessed_at).getTime() - new Date(a.last_accessed_at).getTime());
  }

  async upsertLessonProgress(data: {
    userId: string;
    lessonId: string;
    completed: boolean;
    score: number;
    timeSpentSeconds: number;
  }): Promise<DbStudentLessonProgress> {
    return db.updateLessonProgress(
      data.userId,
      data.lessonId,
      data.completed,
      data.score,
      data.timeSpentSeconds
    );
  }
}

export const lessonRepository = new LessonRepository();
