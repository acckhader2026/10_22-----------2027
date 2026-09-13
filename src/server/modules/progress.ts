import { Response } from 'express';
import { db } from '../db/database';
import { studentMasteryEngine } from '../../domain/analytics/StudentMasteryEngine';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { z } from 'zod';

const attemptSchema = z.object({
  questionId: z.string().min(1, 'معرف السؤال مطلوب'),
  lessonId: z.string().optional(),
  userAnswer: z.any(),
  timeSpentSeconds: z.number().optional(),
  difficulty: z.string().optional()
});

export function handleRecordQuestionAttempt(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'المصادقة مطلوبة لتسجيل محاولات الأسئلة.' }
    });
  }

  const parseResult = attemptSchema.safeParse(req.body);
  if (!parseResult.success) {
    const msg = parseResult.error.issues?.[0]?.message || 'بيانات المحاولة غير صالحة';
    return res.status(400).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: msg }
    });
  }

  // Security: Extract userId strictly from authenticated JWT session
  const effectiveUserId = req.user.userId;
  const { questionId, lessonId, userAnswer, timeSpentSeconds, difficulty } = parseResult.data;

  // Security P0 Fix: Verify question exists in database
  const question = db.questions.find(q => q.id === questionId);
  if (!question) {
    return res.status(400).json({
      success: false,
      error: { code: 'INVALID_QUESTION', message: 'السؤال غير موجود في قاعدة البيانات' }
    });
  }

  // Authoritative server-side evaluation against DB correct answer
  const options = db.questionOptions.filter(o => o.question_id === questionId);
  const correctOption = options.find(o => o.is_correct);

  let isCorrect = false;
  if (correctOption) {
    const normUserAns = String(userAnswer ?? '').trim().toLowerCase();
    const normOptContent = correctOption.content.trim().toLowerCase();
    const normOptId = correctOption.id.trim().toLowerCase();
    isCorrect = (normUserAns === normOptId || normUserAns === normOptContent);
  } else {
    const normUserAns = String(userAnswer ?? '').trim().toLowerCase();
    const normConcept = (question.concept || '').trim().toLowerCase();
    isCorrect = normUserAns.length > 0 && (normUserAns === normConcept);
  }

  const awardedScore = isCorrect ? 2 : 0;
  const maxScore = 2;

  const attempt = db.recordQuestionAttempt({
    user_id: effectiveUserId,
    question_id: questionId,
    lesson_id: lessonId || question.lesson_id || 'lesson-1',
    user_answer: String(userAnswer ?? ''),
    is_correct: isCorrect,
    score: awardedScore,
    max_score: maxScore,
    time_spent_seconds: Number(timeSpentSeconds) || 15,
    attempt_number: 1,
    difficulty: difficulty || question.difficulty || 'basic'
  });

  return res.json({
    success: true,
    isCorrect,
    score: awardedScore,
    maxScore,
    correctOptionId: correctOption?.id,
    explanation: question.explanation,
    attempt
  });
}

export function handleGetStudentProgress(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'المصادقة مطلوبة للوصول إلى بيانات التقدم والإتقان.' }
    });
  }

  // Security: Students can ONLY access their own records
  let targetUserId = req.user.userId;
  if (req.user.role === 'ADMIN' || req.user.role === 'TEACHER' || req.user.role === 'CONTENT_MANAGER') {
    if (req.query.userId && typeof req.query.userId === 'string') {
      targetUserId = req.query.userId;
    }
  }

  const user = db.findUserById(targetUserId);

  const lessonProgress = db.lessonProgress.filter(lp => lp.user_id === targetUserId);
  const attempts = db.questionAttempts.filter(a => a.user_id === targetUserId);
  const examAttempts = db.examAttempts.filter(e => e.user_id === targetUserId);
  const recommendations = db.recommendations.filter(r => r.user_id === targetUserId);

  // Canonical Single-Source Mastery Calculation via StudentMasteryEngine
  const masteryEval = studentMasteryEngine.calculateStudentMastery({
    userId: targetUserId,
    questionAttempts: attempts,
    examAttempts: examAttempts
  });

  return res.json({
    success: true,
    userId: targetUserId,
    userFullName: user?.full_name || 'طالب EB',
    status: masteryEval.status,
    confidence: masteryEval.confidence,
    compositeMastery: masteryEval.compositeMastery,
    masteryBand: masteryEval.masteryBand,
    totalAttempts: masteryEval.totalQuestionsAttempted,
    accuracyRate: Math.round(masteryEval.accuracyComponent.rawRate),
    averageExamScore: masteryEval.averageExamScore,
    completedLessonsCount: lessonProgress.filter(l => l.completed).length,
    totalLessons: db.lessons.length,
    algorithmVersion: 'mastery-v1.0',
    masteryComponents: {
      accuracy: masteryEval.accuracyComponent,
      difficulty: masteryEval.difficultyComponent,
      trend: masteryEval.trendComponent,
      breadth: masteryEval.breadthComponent
    },
    strongestConcepts: masteryEval.strongestConcepts,
    weakestConcepts: masteryEval.weakestConcepts,
    actionableInsights: masteryEval.actionableInsights,
    lessonProgress,
    examAttempts,
    conceptMasteries: masteryEval.conceptMasteryList,
    recommendations: recommendations.filter(r => !r.resolved)
  });
}
