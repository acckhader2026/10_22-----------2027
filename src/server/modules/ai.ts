import { Response } from 'express';
import { evaluateJREArgument } from '../../domain/assessment/jre/JREEvaluationEngine';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

const MAX_ESSAY_CHARS = 10000;

export async function handleEvaluateJreEssay(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'المصادقة مطلوبة لتقييم مقال الـ JRE عبر الذكاء الاصطناعي.' }
    });
  }

  const { essay, claim, reasoning, evidence, counterArg, rebuttal, conclusion, scenario, targetConcept } = req.body;

  if (!essay && !claim && !reasoning) {
    return res.status(400).json({
      success: false,
      error: { code: 'EMPTY_INPUT', message: 'يرجى كتابة نص المقال المحاسبي أو عناصر الـ JRE لتقييمه.' }
    });
  }

  // Bounds checking: prevent unbounded payloads
  const totalLength = String(essay || '').length +
    String(claim || '').length +
    String(reasoning || '').length +
    String(evidence || '').length +
    String(counterArg || '').length +
    String(rebuttal || '').length +
    String(conclusion || '').length;

  if (totalLength > MAX_ESSAY_CHARS) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'PAYLOAD_TOO_LARGE',
        message: `تم تجاوز الحد الأقصى لطول المقال (${MAX_ESSAY_CHARS} حرف).`
      }
    });
  }

  try {
    const evaluation = await evaluateJREArgument({
      essay: essay ? String(essay).slice(0, MAX_ESSAY_CHARS) : '',
      claim: claim ? String(claim).slice(0, 1000) : undefined,
      reasoning: reasoning ? String(reasoning).slice(0, 2000) : undefined,
      evidence: evidence ? String(evidence).slice(0, 2000) : undefined,
      counterArg: counterArg ? String(counterArg).slice(0, 1000) : undefined,
      rebuttal: rebuttal ? String(rebuttal).slice(0, 1000) : undefined,
      conclusion: conclusion ? String(conclusion).slice(0, 1000) : undefined,
      scenarioContext: scenario ? String(scenario).slice(0, 2000) : undefined,
      targetConcept: targetConcept ? String(targetConcept).slice(0, 200) : undefined
    });

    return res.json({
      success: true,
      ...evaluation
    });
  } catch (error: any) {
    console.error('Error evaluating JRE essay:', error);
    return res.status(500).json({
      success: false,
      error: { code: 'EVALUATION_ERROR', message: 'حدث خطأ أثناء تقييم مقال الـ JRE.' }
    });
  }
}


