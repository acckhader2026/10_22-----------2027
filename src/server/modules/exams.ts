import { Response } from 'express';
import { db } from '../db/database';
import { evaluateJREArgument } from '../../domain/assessment/jre/JREEvaluationEngine';
import { appliedGradingEngine } from '../../domain/assessment/grading/AppliedGradingEngine';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export function sanitizeExamForStudent(exam: any) {
  if (!exam) return exam;
  return {
    ...exam,
    sections: (exam.sections || []).map((section: any) => ({
      ...section,
      questions: (section.questions || []).map((q: any) => {
        // Strip sensitive answer keys and explanation prior to completion
        const { correctAnswer, modelAnswer, explanation, rubricCriteria, ...sanitizedQ } = q;
        return sanitizedQ;
      })
    }))
  };
}

export function handleGetExams(req: AuthenticatedRequest, res: Response) {
  return res.json({
    success: true,
    exams: db.exams.map(e => ({
      id: e.id,
      title: e.title,
      subtitle: e.subtitle,
      time_allowed_minutes: e.time_allowed_minutes,
      total_marks: e.total_marks,
      instructions: e.instructions,
      sectionsCount: e.sections.length
    }))
  });
}

export function handleGetExamById(req: AuthenticatedRequest, res: Response) {
  const { id } = req.params;
  const exam = db.exams.find(e => e.id === id);
  if (!exam) {
    return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'الامتحان غير موجود' } });
  }

  // Security P0 Fix: Sanitize exam questions so answers and explanations are not leaked before submission
  const sanitizedExam = sanitizeExamForStudent(exam);
  return res.json({ success: true, exam: sanitizedExam });
}

export async function handleSubmitExam(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'يجب تسجيل الدخول لتقديم الامتحان وتوثيق الدرجات.' }
    });
  }

  const { examId, answers, timeSpentSeconds } = req.body;
  const exam = db.exams.find(e => e.id === examId);
  if (!exam) {
    return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'الامتحان غير موجود' } });
  }

  // Security: authenticated user context is strictly authoritative
  const effectiveUserId = req.user.userId;

  // Authoritative server-side grading
  let totalScore = 0;
  const evaluations: Record<string, any> = {};

  for (const section of exam.sections) {
    for (const q of section.questions) {
      const userAnswer = answers?.[q.id];
      let awardedMarks = 0;
      let isCorrect = false;

      if (q.type === 'mcq' || q.type === 'true_false') {
        isCorrect = userAnswer === q.correctAnswer;
        awardedMarks = isCorrect ? (q.marks || 2) : 0;
        totalScore += awardedMarks;
        evaluations[q.id] = { 
          isCorrect, 
          score: awardedMarks, 
          maxMarks: q.marks || 2, 
          type: q.type,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation 
        };
      } else if (q.type === 'jre_essay' || q.type === 'jre' || q.type === 'essay') {
        if (userAnswer && typeof userAnswer === 'string' && userAnswer.trim().length >= 10) {
          const jreEval = await evaluateJREArgument({
            essay: userAnswer,
            scenarioContext: q.prompt,
            targetConcept: 'تقييم شامل في مقال الـ JRE'
          });
          const targetMarks = q.marks || 20;
          awardedMarks = Number(((jreEval.totalScore / 20) * targetMarks).toFixed(1));
          isCorrect = jreEval.totalScore >= 12;
          totalScore += awardedMarks;
          evaluations[q.id] = {
            isCorrect,
            score: awardedMarks,
            maxMarks: targetMarks,
            rubricBreakdown: jreEval.criteria,
            feedback: jreEval.evaluatorNotes,
            type: 'jre'
          };
        } else {
          evaluations[q.id] = { 
            isCorrect: false, 
            score: 0, 
            maxMarks: q.marks || 20, 
            feedback: 'لم يتم تقديم إجابة مكتملة للمقال.', 
            type: 'jre' 
          };
        }
      } else if (q.type === 'applied' || q.type === 'case' || q.type === 'numerical' || q.type === 'accounting_entry') {
        const gradingResult = appliedGradingEngine.gradeAppliedResponse({
          questionId: q.id,
          studentAnswer: userAnswer,
          context: {
            questionId: q.id,
            prompt: q.prompt,
            type: q.type,
            marks: q.marks || 10,
            modelAnswer: q.modelAnswer
          }
        });
        awardedMarks = gradingResult.awardedMarks;
        isCorrect = gradingResult.status === 'CORRECT';
        totalScore += awardedMarks;
        evaluations[q.id] = {
          isCorrect,
          score: gradingResult.awardedMarks,
          maxMarks: gradingResult.maxMarks,
          percentage: gradingResult.percentage,
          status: gradingResult.status,
          gradingMethod: gradingResult.gradingMethod,
          stepBreakdown: gradingResult.stepBreakdown,
          errors: gradingResult.errors,
          feedback: gradingResult.feedback,
          type: q.type
        };
      }

      // Log granular question attempt learning event
      db.recordQuestionAttempt({
        user_id: effectiveUserId,
        question_id: q.id,
        lesson_id: 'lesson-1',
        user_answer: String(userAnswer || ''),
        is_correct: isCorrect,
        score: awardedMarks,
        max_score: q.marks || 2,
        time_spent_seconds: 60,
        attempt_number: 1,
        difficulty: 'intermediate'
      });
    }
  }

  const roundedTotal = Number(totalScore.toFixed(1));

  const attempt = db.recordExamAttempt({
    user_id: effectiveUserId,
    exam_id: examId,
    total_score: roundedTotal,
    max_marks: exam.total_marks,
    percentage: Math.round((roundedTotal / exam.total_marks) * 100),
    time_taken_seconds: timeSpentSeconds || 3600,
    answers: answers || {},
    rubric_evaluations: evaluations
  });

  return res.json({
    success: true,
    attemptId: attempt.id,
    score: roundedTotal,
    maxMarks: exam.total_marks,
    percentage: Math.round((roundedTotal / exam.total_marks) * 100),
    evaluations
  });
}
