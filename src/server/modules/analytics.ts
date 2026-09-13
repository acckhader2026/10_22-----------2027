import { Request, Response } from 'express';
import { db } from '../db/database';
import { teacherAnalyticsEngine } from '../../domain/analytics/TeacherAnalyticsEngine';
import { contentAnalyticsEngine } from '../../domain/analytics/ContentAnalyticsEngine';

export function handleGetTeacherAnalytics(req: Request, res: Response) {
  const students = db.users.filter(u => u.role === 'STUDENT');
  
  const report = teacherAnalyticsEngine.aggregateCohortData({
    students,
    questions: db.questions,
    questionAttempts: db.questionAttempts,
    examAttempts: db.examAttempts,
    lessonProgress: db.lessonProgress
  });

  return res.json(report);
}

export function handleGetContentAnalytics(req: Request, res: Response) {
  const report = contentAnalyticsEngine.generateContentReport({
    questions: db.questions,
    exams: db.exams,
    lessons: db.lessons
  });

  return res.json(report);
}
