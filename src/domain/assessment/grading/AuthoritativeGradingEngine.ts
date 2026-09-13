import { verifiedAssessmentRegistry, VerifiedAssessmentItem } from '../registry/VerifiedAssessmentRegistry';
import { evaluateJREArgument } from '../jre/JREEvaluationEngine';
import { appliedGradingEngine, GradingStatus } from './AppliedGradingEngine';

export interface AuthoritativeSubmissionInput {
  assessmentId: string;
  studentAnswer: any;
  userId: string;
  timeSpentSeconds?: number;
  attemptNumber?: number;
}

export interface AuthoritativeGradingResult {
  assessmentId: string;
  isCorrect: boolean;
  awardedScore: number;
  maxScore: number;
  percentage: number;
  gradingMode: string;
  status: GradingStatus | 'PARTIAL' | 'MANUAL_REVIEW_PENDING';
  feedbackAr: string;
  rubricBreakdown?: Record<string, any>;
  stepBreakdown?: any[];
  errorsIdentified?: string[];
  gradedAt: string;
}

export class AuthoritativeGradingEngine {
  public async gradeSubmission(input: AuthoritativeSubmissionInput): Promise<AuthoritativeGradingResult> {
    const item = verifiedAssessmentRegistry.getAssessment(input.assessmentId);
    if (!item) {
      throw new Error(`Assessment item with ID '${input.assessmentId}' is not registered in Verified Assessment Registry.`);
    }

    const maxScore = item.max_score || 2;
    const mode = item.grading_mode;
    const studentAnswer = input.studentAnswer;

    // 1. AUTO_EXACT (MCQ, True/False)
    if (mode === 'AUTO_EXACT') {
      const correctStr = String(item.correct_answer ?? '').trim().toLowerCase();
      const studentStr = String(studentAnswer ?? '').trim().toLowerCase();
      const isCorrect = correctStr === studentStr;
      const awardedScore = isCorrect ? maxScore : 0;

      return {
        assessmentId: item.assessment_id,
        isCorrect,
        awardedScore,
        maxScore,
        percentage: isCorrect ? 100 : 0,
        gradingMode: mode,
        status: isCorrect ? 'CORRECT' : 'INCORRECT',
        feedbackAr: isCorrect ? 'إجابة صحيحة ومطابقة للنموذج الأكاديمي.' : 'إجابة غير صحيحة، يرجى مراجعة القاعدة المحاسبية ذات الصلة.',
        gradedAt: new Date().toISOString()
      };
    }

    // 2. AUTO_NUMERIC
    if (mode === 'AUTO_NUMERIC') {
      const parsedStudent = parseFloat(String(studentAnswer).replace(/[^\d.-]/g, ''));
      const parsedCorrect = parseFloat(String(item.correct_answer).replace(/[^\d.-]/g, ''));

      const isCorrect = !isNaN(parsedStudent) && !isNaN(parsedCorrect) && Math.abs(parsedStudent - parsedCorrect) < 0.01;
      const awardedScore = isCorrect ? maxScore : 0;

      return {
        assessmentId: item.assessment_id,
        isCorrect,
        awardedScore,
        maxScore,
        percentage: isCorrect ? 100 : 0,
        gradingMode: mode,
        status: isCorrect ? 'CORRECT' : 'INCORRECT',
        feedbackAr: isCorrect ? 'الحساب الرقمي سليم ومتطابق بدقة.' : `القيمة الرقمية غير دقيقة. القيمة الصحيحة هي ${item.correct_answer}.`,
        gradedAt: new Date().toISOString()
      };
    }

    // 3. RUBRIC (JRE 20-Point Essay)
    if (mode === 'RUBRIC') {
      const text = typeof studentAnswer === 'string' ? studentAnswer.trim() : '';
      if (text.length < 15) {
        return {
          assessmentId: item.assessment_id,
          isCorrect: false,
          awardedScore: 0,
          maxScore: 20,
          percentage: 0,
          gradingMode: mode,
          status: 'INCORRECT',
          feedbackAr: 'النص المقدم قصير للغاية ولا يحتوي على استدلال محاسبي كافٍ لتطبيق معايير سلم الـ 20 درجة.',
          gradedAt: new Date().toISOString()
        };
      }

      const jreEval = await evaluateJREArgument({
        essay: text,
        scenarioContext: item.prompt,
        targetConcept: item.concept_id
      });

      const awardedScore = Number(((jreEval.totalScore / 20) * maxScore).toFixed(1));
      const percentage = Math.round((awardedScore / maxScore) * 100);
      const isCorrect = percentage >= 60;

      return {
        assessmentId: item.assessment_id,
        isCorrect,
        awardedScore,
        maxScore,
        percentage,
        gradingMode: mode,
        status: percentage >= 85 ? 'CORRECT' : percentage >= 50 ? 'PARTIAL' : 'INCORRECT',
        feedbackAr: jreEval.evaluatorNotes || 'تم تصحيح المقال استناداً لسلم الـ 20 درجة الأكاديمي المعتمد.',
        rubricBreakdown: jreEval.criteria,
        gradedAt: new Date().toISOString()
      };
    }

    // 4. AUTO_STRUCTURED / Accounting Entry / T-Account / Applied Case
    if (mode === 'AUTO_STRUCTURED') {
      const result = appliedGradingEngine.gradeAppliedResponse({
        questionId: item.assessment_id,
        studentAnswer: studentAnswer,
        context: {
          questionId: item.assessment_id,
          prompt: item.prompt,
          type: item.question_type,
          marks: maxScore,
          modelAnswer: item.correct_answer
        }
      });

      return {
        assessmentId: item.assessment_id,
        isCorrect: result.status === 'CORRECT',
        awardedScore: result.awardedMarks,
        maxScore: result.maxMarks,
        percentage: result.percentage,
        gradingMode: mode,
        status: result.status,
        feedbackAr: result.feedback,
        stepBreakdown: result.stepBreakdown,
        errorsIdentified: result.errors,
        gradedAt: new Date().toISOString()
      };
    }

    // 5. MANUAL_REVIEW fallback
    return {
      assessmentId: item.assessment_id,
      isCorrect: false,
      awardedScore: 0,
      maxScore,
      percentage: 0,
      gradingMode: mode,
      status: 'MANUAL_REVIEW_PENDING',
      feedbackAr: 'تم توجيه الإجابة للمراجعة والتدقيق اليدوي من قبل المعلم المعتمد.',
      gradedAt: new Date().toISOString()
    };
  }
}

export const authoritativeGradingEngine = new AuthoritativeGradingEngine();
