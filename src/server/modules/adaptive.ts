import { Response } from 'express';
import { db } from '../db/database';
import { adaptiveRemediationEngine } from '../../domain/adaptive/AdaptiveRemediationEngine';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export function handleGetAdaptivePath(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'المصادقة مطلوبة للوصول إلى المسار العلاجي التكيفي.' }
    });
  }

  let targetUserId = req.user.userId;
  if (req.user.role === 'ADMIN' || req.user.role === 'TEACHER') {
    if (req.query.userId && typeof req.query.userId === 'string') {
      targetUserId = req.query.userId;
    }
  }

  const { concept } = req.query;
  const attempts = db.questionAttempts.filter(a => a.user_id === targetUserId);
  
  // Dynamic adaptive prescription based on actual student attempts
  const adaptivePath = adaptiveRemediationEngine.generatePrescription({
    userId: targetUserId,
    attempts,
    allQuestions: db.questions
  });

  // Micro-concept remediation repository
  const conceptRemediations: Record<string, any> = {
    'مبدأ المقابلة': {
      conceptName: 'مبدأ المقابلة (Matching Principle)',
      misconception: 'الخلط بين تاريخ سداد المصروف وتاريخ الاستفادة منه في توليد الإيراد.',
      simplifiedExplanation: 'مبدأ المقابلة يفرض تحميل الفترة المحاسبية بكافة المصروفات التي ساهمت في تحقيق إيرادات نفس الفترة، بغض النظر عن تاريخ الدفع النقدي.',
      microExample: 'إذا دفعنا إيجار سنتين مقدماً (24 ألف) في 2026، يخص عام 2026 فقط 12 ألف كمصروف، والباقي (12 ألف) أصل (إيجار مقدم).',
      drillQuestionIds: ['eb-mcq-004'],
      suggestedLesson: 'lesson-1',
      pageRef: 20
    },
    'مبدأ الحيطة والحذر': {
      conceptName: 'مبدأ الحيطة والحذر (التحفظ)',
      misconception: 'تسجيل الأرباح المتوقعة قبل بيع الأصل أو تحقق الواقعة فعلياً.',
      simplifiedExplanation: 'الحيطة والحذر تحتم الاعتراف الفوري بالخسائر المحتملة وتأجيل الأرباح حتى تتحقق بيعاً فعلياً.',
      microExample: 'ارتفاع سعر سهم في البورصة بمحفظتنا لا يُسجل كربح محقق حتى نبيعه فعلياً، بينما انخفاض قيمته يستوجب مخصص هبوط فوراً.',
      drillQuestionIds: ['eb-mcq-003'],
      suggestedLesson: 'lesson-1',
      pageRef: 16
    },
    'المعادلة المحاسبية الأساسية': {
      conceptName: 'المعادلة المحاسبية (الأصول = الخصوم + حقوق الملكية)',
      misconception: 'اعتبار مسحوبات المالك مصروفاً تشغيلياً يقلل الربح، أو نسيان توازن الطرفين.',
      simplifiedExplanation: 'أي معاملة مالية تؤثر على طرفي المعادلة بذات القيمة والاتجاه، أو تغير تركيبة جانب واحد دون الإخلال بالمجموع.',
      microExample: 'شراء سيارة بـ 100 ألف نقداً: يزيد أصل السيارات وينقص أصل النقدية دون تغيير إجمالي الأصول.',
      drillQuestionIds: ['eb-mcq-011', 'eb-mcq-013'],
      suggestedLesson: 'lesson-2',
      pageRef: 25
    },
    'طبيعة الحسابات وقواعد المدين والدائن': {
      conceptName: 'طبيعة الحسابات (المدين والدائن)',
      misconception: 'افتراض أن كلمة "دائن" تعني شيئاً إيجابياً دائماً و"مدين" سلبياً دائماً.',
      simplifiedExplanation: 'المدين هو الطرف الآخذ أو استخدام الأموال (الأصول والمصروفات). الدائن هو الطرف العاطي أو مصدر التمويل (الخصوم وحقوق الملكية والإيرادات).',
      microExample: 'زيادة النقدية = مدين. زيادة القرض = دائن. سداد القرض نقداً = القرض مدين (نقص) والخزينة دائن (نقص).',
      drillQuestionIds: ['eb-mcq-017', 'eb-mcq-018'],
      suggestedLesson: 'lesson-3',
      pageRef: 43
    },
    'ترصيد الحسابات وميزان المراجعة': {
      conceptName: 'ترصيد الحسابات وميزان المراجعة',
      misconception: 'الاعتقاد بأن توازن ميزان المراجعة يضمن خلو الدفاتر بنسبة 100% من كافة الأخطاء.',
      simplifiedExplanation: 'ميزان المراجعة يثبت التوازن الحسابي فقط، لكنه لا يكشف السهو الكامل أو تكرار القيد أو الأخطاء المتكافئة.',
      microExample: 'إغفال قيد شراء بضاعة بـ 10 آلاف نقداً يبقي الميزان متوازناً رغم وجود خطأ سهو كامل.',
      drillQuestionIds: ['eb-mcq-024', 'eb-mcq-025'],
      suggestedLesson: 'lesson-4',
      pageRef: 75
    }
  };

  const selectedKey = concept ? String(concept) : Object.keys(conceptRemediations)[0];
  const remediation = conceptRemediations[selectedKey] || conceptRemediations['مبدأ المقابلة'];

  return res.json({
    userId: targetUserId,
    concept: selectedKey,
    remediation,
    adaptivePath,
    availableConcepts: Object.keys(conceptRemediations)
  });
}

