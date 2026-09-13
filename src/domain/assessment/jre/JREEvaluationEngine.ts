import { CANONICAL_JRE_RUBRIC, JREEvaluationResult, JRECriterionEvaluation, getPerformanceBand } from './JRERubric';
import { UNIT2_JRE_RUBRIC } from '../rubrics/Unit2JRERubric';
import { UNIT3_JRE_RUBRIC } from '../rubrics/Unit3JRERubric';
import { GoogleGenAI } from '@google/genai';

export interface JREEvaluationInput {
  essay: string;
  claim?: string;
  reasoning?: string;
  evidence?: string;
  counterArg?: string;
  rebuttal?: string;
  conclusion?: string;
  scenarioContext?: string;
  targetConcept?: string;
  unitId?: string;
  questionId?: string;
  maxScore?: number;
}

let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

/**
 * Robust, Psychometrically Sound JRE 20-Mark Evaluation Engine
 */
export async function evaluateJREArgument(input: JREEvaluationInput): Promise<JREEvaluationResult> {
  const rawText = (input.essay || '').trim();
  
  // Synthesize text if components were submitted individually
  const fullText = rawText || [
    input.claim,
    input.reasoning,
    input.evidence,
    input.counterArg,
    input.rebuttal,
    input.conclusion
  ].filter(Boolean).join(' \n');

  const qId = (input.questionId || '').toLowerCase();
  const uId = (input.unitId || '').toLowerCase();
  const scenario = (input.scenarioContext || '').toLowerCase();
  const concept = (input.targetConcept || '').toLowerCase();

  const isExplicitUnit2 = uId === 'unit-2' || uId === 'u2' || uId === '2';
  const isUnit2QuestionPattern = 
    qId.startsWith('unified-u2-q') || 
    qId.startsWith('u2-') || 
    qId.startsWith('eb2-jre') ||
    scenario.includes('unified-u2-q') ||
    concept.includes('unified-u2-q') ||
    concept.includes('u2-q') ||
    scenario.includes('u2-q');

  const isUnit2 = isExplicitUnit2 || isUnit2QuestionPattern;

  const isExplicitUnit3 = uId === 'unit-3' || uId === 'u3' || uId === '3';
  const isUnit3QuestionPattern = 
    qId.startsWith('unified-u3-q') || 
    qId.startsWith('u3-') || 
    qId.startsWith('eb3-jre') ||
    scenario.includes('unified-u3-q') ||
    concept.includes('unified-u3-q') ||
    concept.includes('u3-q') ||
    scenario.includes('u3-q');

  const isUnit3 = isExplicitUnit3 || isUnit3QuestionPattern;

  const isUnit2LevelB = isUnit2 && (
    input.maxScore === 10 ||
    qId === 'unified-u2-q34' ||
    qId === 'unified-u2-q35' ||
    qId === 'unified-u2-q33' ||
    qId === 'u2-q34' ||
    qId === 'u2-q35' ||
    qId === 'u2-q33' ||
    scenario.includes('unified-u2-q34') ||
    scenario.includes('unified-u2-q35') ||
    scenario.includes('unified-u2-q33') ||
    concept.includes('unified-u2-q34') ||
    concept.includes('unified-u2-q35') ||
    concept.includes('unified-u2-q33') ||
    concept.includes('المستوى b') ||
    scenario.includes('المستوى b') ||
    concept.includes('10 درجات') ||
    scenario.includes('10 درجات')
  );

  const isUnit2LevelC = isUnit2 && !isUnit2LevelB;

  if (fullText.length < 15) {
    return createInsufficientResult(
      'النص المقدم قصير للغاية ولا يحتوي على أدلة أو تحليل كافٍ للتقييم المحاسبي.',
      isUnit2LevelB,
      isUnit2LevelC,
      isUnit3
    );
  }

  const textLower = fullText.toLowerCase();

  // 1. Component Extraction & Argument Structure Detection
  const hasExplicitClaim = Boolean(
    input.claim?.trim() ||
    /(أرى أن|أرفض ادعاء|أؤيد|غير سليم|مخالف للمبادئ|صحيح محاسبياً|لا يجوز|يضمن الاتساق|يعد دليلاً قاطعاً|حكم مهني|موقفي هو)/i.test(fullText)
  );

  const hasCausalReasoning = Boolean(
    input.reasoning?.trim() ||
    /(لأن|نظراً لأن|حيث أن|السبب في ذلك|يؤدي إلى|يترتب عليه|تطبيقاً لمبدأ|وفق أساس|مبدأ المقابلة|مبدأ الحيطة|مبدأ الاستحقاق|التكلفة التاريخية|الوحدة المحاسبية)/i.test(fullText)
  );

  const hasAccountingPrinciples = /(مبدأ المقابلة|أساس الاستحقاق|الحيطة والحذر|التكلفة التاريخية|الثبات|الأهمية النسبية|الإفصاح التام|الوحدة المحاسبية)/i.test(fullText);

  const hasNumericalOrScenarioEvidence = Boolean(
    input.evidence?.trim() ||
    /(\d+[\d,.]*|\bجنيه\b|\bألف\b|خطأ السهو|خطأ التوجيه|المعدات كمصروف|إيجار مقدم|حساب معلق|مخصص|ميزان المراجعة|قيد اليومية|أصل رأسمالي)/i.test(fullText)
  );

  const hasCounterArgument = Boolean(
    input.counterArg?.trim() ||
    /(قد يرى البعض|وجهة النظر الأخرى|الرأي المعارض|يدعي البعض|يظن البعض|قد يعترض البعض)/i.test(fullText)
  );

  const hasRebuttal = Boolean(
    input.rebuttal?.trim() ||
    /(والرد على هذا الرأي|لكن هذا الرأي يتجاهل|وتفنيد ذلك هو|إلا أن هذا القول قاصر|والحقيقة المحاسبية هي)/i.test(fullText)
  );

  const hasStructuredConclusion = Boolean(
    input.conclusion?.trim() ||
    /(ختاماً|في الختام|وخلاصة القول|لذلك نخلص إلى|نوصي بـ|الرأي المهني النهائي|التمثيل الصادق والعدالة)/i.test(fullText)
  );

  // 2. Score Calculation per Criterion (0.0 to 4.0)

  // Criterion 1: Intellectual Framework (0-4)
  let score1 = 1.0;
  const evidence1: string[] = [];
  const missing1: string[] = [];
  if (hasExplicitClaim) {
    if (fullText.length > 50 && (textLower.includes('أرفض') || textLower.includes('غير سليم') || textLower.includes('أرى') || textLower.includes('الاتساق'))) {
      score1 = 4.0;
      evidence1.push('تم تحديد موقف مهني قاطع وصريح تجاه القضية المحاسبية.');
    } else {
      score1 = 3.0;
      evidence1.push('تم صياغة حكم مبدئي يحتاج إلى مزيد من الدقة الاصطلاحية.');
    }
  } else {
    score1 = 1.5;
    missing1.push('لم يتم صياغة حكم صريح ومباشر في بداية الإجابة.');
  }

  // Criterion 2: Deep Accounting Analysis (0-4)
  let score2 = 1.0;
  const evidence2: string[] = [];
  const missing2: string[] = [];
  if (hasAccountingPrinciples && hasCausalReasoning) {
    score2 = 4.0;
    evidence2.push('ربط سببي رصين بالمبادئ المحاسبية الحاكمة (مثل المقابلة أو الاستحقاق أو الحيطة).');
    evidence2.push('توضيح منطقي لأثر المعاملة على عدالة القوائم المالية.');
  } else if (hasCausalReasoning) {
    score2 = 2.5;
    evidence2.push('تفسير سببي منطقي عام.');
    missing2.push('الاستناد الصريح والمباشر للمبادئ والفروض المحاسبية المعتمدة بنصها الأكاديمي.');
  } else if (hasAccountingPrinciples) {
    score2 = 2.5;
    evidence2.push('ذكر المبادئ المحاسبية دون تعميق كافٍ للعلاقة السببية.');
    missing2.push('شرح سببي يوضح كيف يؤثر الإجراء على القوائم المالية.');
  } else {
    score2 = 1.0;
    missing2.push('غياب التحليل المحاسبي السببي والاستناد للمبادئ.');
  }

  // Criterion 3: Evidence & Accounting Data (0-4)
  let score3 = 1.0;
  const evidence3: string[] = [];
  const missing3: string[] = [];
  const numericalMatches = fullText.match(/\d+[\d,.]*/g);
  if (hasNumericalOrScenarioEvidence) {
    if (numericalMatches && numericalMatches.length >= 1) {
      score3 = 4.0;
      evidence3.push('تقديم أدلة محاسبية تطبيقية معززة بأرقام وأمثلة مالية ملموسة.');
    } else if (/خطأ السهو|خطأ التوجيه|المعدات|إيجار مقدم/i.test(fullText)) {
      score3 = 3.5;
      evidence3.push('الاستشهاد بحالات محاسبية عملية دقيقة (مثل أخطاء التوجيه والسهو).');
      missing3.push('يُفضل تدعيم الحالات بأمثلة رقمية صريحة (مثل: شراء أصل بـ 50 ألف).');
    } else {
      score3 = 2.5;
      evidence3.push('تقديم شواهد عامة.');
      missing3.push('أمثلة محاسبية رقمية أو قيود يومية توضيحية.');
    }
  } else {
    score3 = 1.0;
    missing3.push('لم يتم إدراج أدلة محاسبية أو حالات عملية تدعم وجهة النظر.');
  }

  // Criterion 4: Structure, Counter-Argument & Rebuttal (0-4)
  let score4 = 1.0;
  const evidence4: string[] = [];
  const missing4: string[] = [];
  if (hasCounterArgument && hasRebuttal) {
    score4 = 4.0;
    evidence4.push('عرض الحجة المضادة باحترام وتفنيدها برد محاسبي رصين.');
    evidence4.push('بناء هيكلي سداسي متكامل ومترابط منطقياً.');
  } else if (hasCounterArgument || hasRebuttal) {
    score4 = 2.5;
    evidence4.push('إشارة جزئية للرأي المخالف أو الرد عليه.');
    missing4.push('اكتمال ثنائية (عرض الحجة المضادة + الرد والتفنيد المحاسبي).');
  } else if (fullText.length > 120) {
    score4 = 2.0;
    evidence4.push('تسلسل إنشائي جيد ولكن يفتقر للجدلية والنقد.');
    missing4.push('تضمين الحجة المعارضة وتفنيدها لإظهار التفكير النقدي المتزن.');
  } else {
    score4 = 1.0;
    missing4.push('بناء المقال يفتقر إلى الهيكل المحاسبي السليم.');
  }

  // Criterion 5: Justified Conclusion & Recommendation (0-4)
  let score5 = 1.0;
  const evidence5: string[] = [];
  const missing5: string[] = [];
  if (hasStructuredConclusion && (textLower.includes('مصداقية') || textLower.includes('شفافية') || textLower.includes('تدقيق') || textLower.includes('عدالة') || textLower.includes('تمثيل صادق'))) {
    score5 = 4.0;
    evidence5.push('خاتمة تركيبية رصينة تربط النتائج بضرورة المراجعة والتمثيل الصادق للقوائم.');
  } else if (hasStructuredConclusion) {
    score5 = 3.0;
    evidence5.push('خاتمة تلخص الفكرة العامة.');
    missing5.push('إضافة توصية مهنية تبرز البعد الرقابي والتمثيل الصادق للتقارير.');
  } else if (fullText.length > 150) {
    score5 = 2.0;
    missing5.push('صياغة فقرة ختامية مستقلة تلخص الحجة المحاسبية.');
  } else {
    score5 = 1.0;
    missing5.push('المقال بدون خاتمة واضحة.');
  }

  let totalScore = Number((score1 + score2 + score3 + score4 + score5).toFixed(1));
  let maxTotalScore = 20;
  let rubricVersion = '2.0.0-canonical-20m';
  let criteria: Record<string, JRECriterionEvaluation>;

  if (isUnit2LevelB) {
    maxTotalScore = 10;
    rubricVersion = 'U02-JRE-RUBRIC-10M';
    const bScore1 = hasExplicitClaim ? (score1 >= 3.5 ? 2.0 : 1.5) : 0.5;
    const bScore2 = (hasAccountingPrinciples && hasCausalReasoning) ? 3.0 : (hasCausalReasoning || hasAccountingPrinciples) ? 2.0 : 1.0;
    const bScore3 = (hasNumericalOrScenarioEvidence && numericalMatches && numericalMatches.length >= 1) ? 3.0 : hasNumericalOrScenarioEvidence ? 2.5 : 1.0;
    const bScore4 = hasStructuredConclusion ? (score5 >= 3.5 ? 2.0 : 1.5) : 0.5;
    totalScore = Number((bScore1 + bScore2 + bScore3 + bScore4).toFixed(1));

    criteria = {
      intellectual_framework: {
        criterionId: 'intellectual_framework',
        nameAr: 'الحكم وتحديد الموقف المحاسبي الصريح',
        score: bScore1,
        maxScore: 2,
        evidenceFound: evidence1,
        missingElements: missing1,
        reasoning: bScore1 >= 2.0 ? 'حكم صريح ومباشر يفند الادعاء بدقة.' : 'يحتاج الحكم إلى وضوح أكبر واتخاذ موقف لا يحتمل اللبس.',
        improvementTip: missing1[0] || 'حافظ على قوة الصياغة المباشرة للحكم المحاسبي.'
      },
      deep_analysis: {
        criterionId: 'deep_analysis',
        nameAr: 'التحليل السببي وتفكيك أثر المعاملة',
        score: bScore2,
        maxScore: 3,
        evidenceFound: evidence2,
        missingElements: missing2,
        reasoning: bScore2 >= 2.5 ? 'تفسير سببي ممتاز يستند إلى المبادئ والفروض المحاسبية.' : 'التعليل يحتاج للاستناد الصريح لمبادئ كالمقابلة أو الحيطة والحذر.',
        improvementTip: missing2[0] || 'تعميق شرح الأثر المالي على بنود قائمة المركز المالي وقائمة الدخل.'
      },
      evidence_usage: {
        criterionId: 'evidence_usage',
        nameAr: 'الأدلة المستندية والتطبيقية من واقع الحالة',
        score: bScore3,
        maxScore: 3,
        evidenceFound: evidence3,
        missingElements: missing3,
        reasoning: bScore3 >= 2.5 ? 'استدلال ملموس مدعوم بأمثلة وحالات عملية.' : 'ينقص التدليل بأرقام وحالات محاسبية نوعية كأخطاء التوجيه والسهو.',
        improvementTip: missing3[0] || 'تضمين أرقام أو حالات عملية محددة يمنح الحجة وزناً مهنياً.'
      },
      justified_conclusion: {
        criterionId: 'justified_conclusion',
        nameAr: 'الخاتمة المقنعة والتوصية الرقابية',
        score: bScore4,
        maxScore: 2,
        evidenceFound: evidence5,
        missingElements: missing5,
        reasoning: bScore4 >= 2.0 ? 'خاتمة مقنعة تؤكد على أهمية الرقابة المستندية والتمثيل الصادق.' : 'احرص على إنهاء المقال بخلاصة تبرز أهمية الرقابة المستندية.',
        improvementTip: missing5[0] || 'الخاتمة الممتازة تلخص الموقف وتؤكد على الشفافية.'
      }
    };
  } else if (isUnit2LevelC) {
    maxTotalScore = 20;
    rubricVersion = UNIT2_JRE_RUBRIC.id;
    criteria = {
      framework: {
        criterionId: 'framework',
        nameAr: UNIT2_JRE_RUBRIC.dimensions[0].nameAr,
        score: score1,
        maxScore: 4,
        evidenceFound: evidence1,
        missingElements: missing1,
        reasoning: score1 >= 3.5 ? 'تحديد دقيق للفرق بين التوازن الشكلي والصدق في التعبير مع صياغة أطروحة استقصائية محكمة.' : 'طرح عام يحتاج لمزيد من الدقة والتمييز بين التوازن الحسابي والجوهر الاقتصادي.',
        improvementTip: missing1[0] || 'حافظ على قوة الصياغة المباشرة وتفريق التوازن الحسابي عن الصدق الاقتصادي.'
      },
      deep_analysis: {
        criterionId: 'deep_analysis',
        nameAr: UNIT2_JRE_RUBRIC.dimensions[1].nameAr,
        score: score2,
        maxScore: 4,
        evidenceFound: evidence2,
        missingElements: missing2,
        reasoning: score2 >= 3.5 ? 'تحليل سببي متعمق يفصل أثر رسملة المصروفات والسهو على القوائم مع بقاء الميزان متوازناً.' : 'تحليل عام يحتاج لبيان الآلية الدقيقة لبقاء الميزان متوازناً رغم وجود التضليل.',
        improvementTip: missing2[0] || 'تفكيك آليات الأخطاء المتكافئة وأثرها على صافي الربح والمركز المالي.'
      },
      evidence: {
        criterionId: 'evidence',
        nameAr: UNIT2_JRE_RUBRIC.dimensions[2].nameAr,
        score: score3,
        maxScore: 4,
        evidenceFound: evidence3,
        missingElements: missing3,
        reasoning: score3 >= 3.5 ? 'توظيف دقيق للأرقام المحاسبية المحددة للحالة لتأكيد كل حجة استقصائية.' : 'إشارة مجملة لوقائع الحالة دون ذكر الأرقام بدقة أو تعزيز التحليل بالحسابات الكمية.',
        improvementTip: missing3[0] || 'الاستشهاد الدقيق بأرقام المعاملات (مثل رسملة المصروفات والفارق الكمي بالأرباح).'
      },
      organization: {
        criterionId: 'organization',
        nameAr: UNIT2_JRE_RUBRIC.dimensions[3].nameAr,
        score: score4,
        maxScore: 4,
        evidenceFound: evidence4,
        missingElements: missing4,
        reasoning: score4 >= 3.5 ? 'هيكل مقال استقصائي متكامل الأركان مع تسلسل برهاني منطقي ولغة محاسبية رصينة.' : 'بناء هيكلي يحتاج لمزيد من الترابط بين تفنيد حجة التوازن وعرض القرائن والأدلة.',
        improvementTip: missing4[0] || 'بناء مقال متكامل: مقدمة استقصائية، تفنيد حجة التوازن، عرض القرائن، والخاتمة.'
      },
      judgment: {
        criterionId: 'judgment',
        nameAr: UNIT2_JRE_RUBRIC.dimensions[4].nameAr,
        score: score5,
        maxScore: 4,
        evidenceFound: evidence5,
        missingElements: missing5,
        reasoning: score5 >= 3.5 ? 'استنتاج مهني رفيع وتوصيات عملية وقائية تفند الخدعة الإعلانية وتضع معايير الرقابة المستندية.' : 'استنتاج عام يحتاج لتقديم توصيات محاسبية أو رقابية ملموسة لمراجعة جودة الأرباح.',
        improvementTip: missing5[0] || 'صياغة حكم مهني قاطع وتوصيات استقصائية تركز على المراجعة المستندية المستقلة.'
      }
    };
  } else if (isUnit3) {
    maxTotalScore = 20;
    rubricVersion = UNIT3_JRE_RUBRIC.id;
    criteria = {
      framework: {
        criterionId: 'framework',
        nameAr: UNIT3_JRE_RUBRIC.dimensions[0].nameAr,
        score: score1,
        maxScore: 4,
        evidenceFound: evidence1,
        missingElements: missing1,
        reasoning: score1 >= 3.5 ? 'تحديد دقيق لمفهوم الدفاتر المساعدة والرقابة المزدوجة مع طرح أطروحة محاسبية متوازنة.' : 'طرح عام لمفهوم الدفاتر المساعدة دون ربط متين بإشكالية الرقابة.',
        improvementTip: missing1[0] || 'حافظ على قوة الصياغة المباشرة وربط الدفاتر المساعدة بمفهوم الرقابة المزدوجة.'
      },
      deep_analysis: {
        criterionId: 'deep_analysis',
        nameAr: UNIT3_JRE_RUBRIC.dimensions[1].nameAr,
        score: score2,
        maxScore: 4,
        evidenceFound: evidence2,
        missingElements: missing2,
        reasoning: score2 >= 3.5 ? 'تحليل سببي متعمق يوازن بين مزايا التخصص في الحد من أخطاء الازدحام وأعباء التنسيق.' : 'تحليل وصفي يحتاج لتفكيك التوازن بين التخصص وأعباء المطابقة الدورية.',
        improvementTip: missing2[0] || 'تفكيك العلاقة بين التخصص في الدفاتر وتحديات المطابقة بين الدفاتر المساعدة والعامة.'
      },
      evidence: {
        criterionId: 'evidence',
        nameAr: UNIT3_JRE_RUBRIC.dimensions[2].nameAr,
        score: score3,
        maxScore: 4,
        evidenceFound: evidence3,
        missingElements: missing3,
        reasoning: score3 >= 3.5 ? 'توظيف دقيق لأرقام محلات بلال لتدعيم كل حجة تحليلية.' : 'إشارة عامة للحالة دون استغلال أمثلة رقمية محددة مثل أرصدة العملاء.',
        improvementTip: missing3[0] || 'الاستشهاد الدقيق بأرقام المعاملات (مثل أرصدة محلات منصور وجبريل).'
      },
      organization: {
        criterionId: 'organization',
        nameAr: UNIT3_JRE_RUBRIC.dimensions[3].nameAr,
        score: score4,
        maxScore: 4,
        evidenceFound: evidence4,
        missingElements: missing4,
        reasoning: score4 >= 3.5 ? 'بناء هيكلي محكم يتبع الأقسام الخمسة المعتمدة مع أدوات ربط منطقية.' : 'بناء الهيكل يحتاج للمزيد من الترابط وخاصة في الرد على المعارض.',
        improvementTip: missing4[0] || 'بناء مقال متكامل يشمل الرد على وجهة النظر المعارضة.'
      },
      judgment: {
        criterionId: 'judgment',
        nameAr: UNIT3_JRE_RUBRIC.dimensions[4].nameAr,
        score: score5,
        maxScore: 4,
        evidenceFound: evidence5,
        missingElements: missing5,
        reasoning: score5 >= 3.5 ? 'خاتمة حاسمة تثبت أن تعزيز الرقابة مشروط بالانضباط في المطابقة المزدوجة.' : 'استنتاج مقتضب يحتاج توضيح شروط نجاح الرقابة عملياً.',
        improvementTip: missing5[0] || 'صياغة توصية تربط فعالية الرقابة بالالتزام المهني بالمطابقة.'
      }
    };
  } else {
    maxTotalScore = 20;
    rubricVersion = '2.0.0-canonical-20m';
    criteria = {
      intellectual_framework: {
        criterionId: 'intellectual_framework',
        nameAr: CANONICAL_JRE_RUBRIC[0].nameAr,
        score: score1,
        maxScore: 4,
        evidenceFound: evidence1,
        missingElements: missing1,
        reasoning: score1 >= 3.5 ? 'حكم صريح ومباشر يحدد الموقف المهني بدقة.' : 'يحتاج الحكم إلى وضوح أكبر واتخاذ موقف لا يحتمل اللبس.',
        improvementTip: missing1[0] || 'حافظ على قوة الصياغة المباشرة للحكم المحاسبي.'
      },
      deep_analysis: {
        criterionId: 'deep_analysis',
        nameAr: CANONICAL_JRE_RUBRIC[1].nameAr,
        score: score2,
        maxScore: 4,
        evidenceFound: evidence2,
        missingElements: missing2,
        reasoning: score2 >= 3.5 ? 'تفسير سببي ممتاز يستند إلى المبادئ والفروض المحاسبية.' : 'التعليل يحتاج للاستناد الصريح لمبادئ كالمقابلة أو الحيطة والحذر.',
        improvementTip: missing2[0] || 'تعميق شرح الأثر المالي على بنود قائمة المركز المالي وقائمة الدخل.'
      },
      evidence_usage: {
        criterionId: 'evidence_usage',
        nameAr: CANONICAL_JRE_RUBRIC[2].nameAr,
        score: score3,
        maxScore: 4,
        evidenceFound: evidence3,
        missingElements: missing3,
        reasoning: score3 >= 3.5 ? 'استدلال ملموس مدعوم بأمثلة محاسبية وحالات وأرقام عملية.' : 'ينقص التدليل بأرقام وحالات محاسبية نوعية كأخطاء التوجيه.',
        improvementTip: missing3[0] || 'تضمين أرقام وقيود يومية محددة يعطي الحجة وزناً مهنياً مضاعفاً.'
      },
      structure_coherence: {
        criterionId: 'structure_coherence',
        nameAr: CANONICAL_JRE_RUBRIC[3].nameAr,
        score: score4,
        maxScore: 4,
        evidenceFound: evidence4,
        missingElements: missing4,
        reasoning: score4 >= 3.5 ? 'بناء جدلي ناضج يعرض الحجة المضادة ويفندها برصانة.' : 'يجب تضمين الرأي الآخر وتفنيده لإثبات التفكير النقدي المتزن.',
        improvementTip: missing4[0] || 'استخدم عبارات ربط استدلالية رصينة مثل (والرد على ذلك هو أن...).'
      },
      justified_conclusion: {
        criterionId: 'justified_conclusion',
        nameAr: CANONICAL_JRE_RUBRIC[4].nameAr,
        score: score5,
        maxScore: 4,
        evidenceFound: evidence5,
        missingElements: missing5,
        reasoning: score5 >= 3.5 ? 'خاتمة تركيبية جامعة تقدم توصية مهنية واضحة.' : 'احرص على إنهاء المقال بخلاصة تبرز أهمية التدقيق والتمثيل الصادق.',
        improvementTip: missing5[0] || 'الخاتمة الممتازة تلخص الموقف وتؤكد على الشفافية وحماية حقوق المتعاملين.'
      }
    };
  }

  const performanceBand = getPerformanceBand((totalScore / maxTotalScore) * 20);

  const strengths = Object.values(criteria).flatMap(c => c.evidenceFound);
  const weaknesses = Object.values(criteria).flatMap(c => c.missingElements);
  const actionableRecommendations = Object.values(criteria).map(c => c.improvementTip).filter(Boolean);

  let evaluatorNotes = totalScore >= (maxTotalScore * 0.8)
    ? 'إجابة محاسبية نموذجية متقنة تتبع أعلى معايير التفكير المالي الرفيع ومواصفات مقال الـ JRE المعتمدة.'
    : totalScore >= (maxTotalScore * 0.6)
    ? 'إجابة جيدة جداً تستوفي الهيكل العام، مع الحاجة لتدعيم الاستناد للأدلة الرقمية وتفنيد الرأي المعارض.'
    : 'تحتاج الإجابة إلى إعادة بناء وفق سلم الـ JRE المعتمد (الحكم، التفسير، الأدلة، الحجة المضادة، الخاتمة).';

  // Optional Gemini AI contextual feedback enrichment
  try {
    const ai = getAiClient();
    if (ai && fullText.length >= 30) {
      const prompt = `أنت كبير مقيّمي امتحانات البكالوريا المصرية (EB) لمادة المحاسبة المالية.
قم بمراجعة إجابة الطالب التالية على سؤال JRE (Justified Reasoning with Evidence):
السياق المحاسبي: ${input.scenarioContext || 'قضية مصداقية ميزان المراجعة والمبادئ المحاسبية'}
المفهوم المستهدف: ${input.targetConcept || 'القيد المزدوج، ميزان المراجعة، ومبدأ المقابلة والحيطة'}
إجابة الطالب: "${fullText}"

وفق سلم التقييم الرسمي (${maxTotalScore} درجة مقسمة بالتساوي على ${Object.keys(criteria).length} معايير):
${Object.values(criteria).map((c, i) => `${i + 1}. ${c.nameAr} (${c.maxScore} درجات)`).join('\n')}

أعطني ملاحظة مهنية واحدة موجزة باللغة العربية تشجع الطالب وتوضح له بدقة الخطوة القادمة للوصول إلى الدرجة ${maxTotalScore}/${maxTotalScore}.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });
      if (response.text) {
        evaluatorNotes = response.text.trim();
      }
    }
  } catch (err) {
    // Graceful fallback to deterministic notes
  }

  return {
    totalScore,
    maxTotalScore,
    percentage: Math.round((totalScore / maxTotalScore) * 100),
    performanceBand,
    status: 'EVALUATED',
    confidence: 0.95,
    claimIdentified: hasExplicitClaim ? (input.claim || 'تم استخلاص الحكم من متن المقال') : null,
    reasoningIdentified: hasCausalReasoning ? (input.reasoning || 'تم استخلاص التعليل من متن المقال') : null,
    evidenceIdentified: evidence3,
    counterArgumentIdentified: hasCounterArgument ? (input.counterArg || 'تم رصد الحجة المضادة') : null,
    rebuttalIdentified: hasRebuttal ? (input.rebuttal || 'تم رصد الرد والتفنيد') : null,
    conclusionIdentified: hasStructuredConclusion ? (input.conclusion || 'تم رصد الخاتمة التركيبية') : null,
    criteria,
    strengths: strengths.length > 0 ? strengths : ['محاولة جيدة للإجابة'],
    weaknesses,
    actionableRecommendations,
    evaluatorNotes,
    rubricVersion
  };
}

function createInsufficientResult(
  reason: string,
  isUnit2LevelB: boolean = false,
  isUnit2LevelC: boolean = false,
  isUnit3: boolean = false
): JREEvaluationResult {
  const emptyCriterion = (id: any, name: string, maxScore: number = 4): JRECriterionEvaluation => ({
    criterionId: id,
    nameAr: name,
    score: 0,
    maxScore,
    evidenceFound: [],
    missingElements: ['النص غير كافٍ لتقييم هذا المعيار.'],
    reasoning: 'لم يتم تقديم محتوى كافٍ.',
    improvementTip: 'يرجى كتابة إجابة تفصيلية تتناول القضية المحاسبية بالأدلة والتحليل.'
  });

  if (isUnit2LevelB) {
    return {
      totalScore: 0,
      maxTotalScore: 10,
      percentage: 0,
      performanceBand: 'NOVICE',
      status: 'INSUFFICIENT_INPUT',
      confidence: 1.0,
      claimIdentified: null,
      reasoningIdentified: null,
      evidenceIdentified: [],
      counterArgumentIdentified: null,
      rebuttalIdentified: null,
      conclusionIdentified: null,
      criteria: {
        intellectual_framework: emptyCriterion('intellectual_framework', 'الحكم وتحديد الموقف المحاسبي الصريح', 2),
        deep_analysis: emptyCriterion('deep_analysis', 'التحليل السببي وتفكيك أثر المعاملة', 3),
        evidence_usage: emptyCriterion('evidence_usage', 'الأدلة المستندية والتطبيقية من واقع الحالة', 3),
        justified_conclusion: emptyCriterion('justified_conclusion', 'الخاتمة المقنعة والتوصية الرقابية', 2)
      },
      strengths: [],
      weaknesses: [reason],
      actionableRecommendations: ['اكتب إجابة كاملة تغطي المعايير الأربعة لسؤال الـ JRE من 10 درجات.'],
      evaluatorNotes: reason,
      rubricVersion: 'U02-JRE-RUBRIC-10M'
    };
  }

  if (isUnit2LevelC) {
    return {
      totalScore: 0,
      maxTotalScore: 20,
      percentage: 0,
      performanceBand: 'NOVICE',
      status: 'INSUFFICIENT_INPUT',
      confidence: 1.0,
      claimIdentified: null,
      reasoningIdentified: null,
      evidenceIdentified: [],
      counterArgumentIdentified: null,
      rebuttalIdentified: null,
      conclusionIdentified: null,
      criteria: {
        framework: emptyCriterion('framework', UNIT2_JRE_RUBRIC.dimensions[0].nameAr, 4),
        deep_analysis: emptyCriterion('deep_analysis', UNIT2_JRE_RUBRIC.dimensions[1].nameAr, 4),
        evidence: emptyCriterion('evidence', UNIT2_JRE_RUBRIC.dimensions[2].nameAr, 4),
        organization: emptyCriterion('organization', UNIT2_JRE_RUBRIC.dimensions[3].nameAr, 4),
        judgment: emptyCriterion('judgment', UNIT2_JRE_RUBRIC.dimensions[4].nameAr, 4)
      },
      strengths: [],
      weaknesses: [reason],
      actionableRecommendations: ['اكتب إجابة كاملة تغطي أبعاد سلم الوحدة الثانية الخمسة لتحصل على التقييم من 20 درجة.'],
      evaluatorNotes: reason,
      rubricVersion: UNIT2_JRE_RUBRIC.id
    };
  }

  if (isUnit3) {
    return {
      totalScore: 0,
      maxTotalScore: 20,
      percentage: 0,
      performanceBand: 'NOVICE',
      status: 'INSUFFICIENT_INPUT',
      confidence: 1.0,
      claimIdentified: null,
      reasoningIdentified: null,
      evidenceIdentified: [],
      counterArgumentIdentified: null,
      rebuttalIdentified: null,
      conclusionIdentified: null,
      criteria: {
        framework: emptyCriterion('framework', UNIT3_JRE_RUBRIC.dimensions[0].nameAr, 4),
        deep_analysis: emptyCriterion('deep_analysis', UNIT3_JRE_RUBRIC.dimensions[1].nameAr, 4),
        evidence: emptyCriterion('evidence', UNIT3_JRE_RUBRIC.dimensions[2].nameAr, 4),
        organization: emptyCriterion('organization', UNIT3_JRE_RUBRIC.dimensions[3].nameAr, 4),
        judgment: emptyCriterion('judgment', UNIT3_JRE_RUBRIC.dimensions[4].nameAr, 4)
      },
      strengths: [],
      weaknesses: [reason],
      actionableRecommendations: ['اكتب إجابة كاملة تغطي أبعاد سلم الوحدة الثالثة الخمسة لتحصل على التقييم من 20 درجة.'],
      evaluatorNotes: reason,
      rubricVersion: UNIT3_JRE_RUBRIC.id
    };
  }

  return {
    totalScore: 0,
    maxTotalScore: 20,
    percentage: 0,
    performanceBand: 'NOVICE',
    status: 'INSUFFICIENT_INPUT',
    confidence: 1.0,
    claimIdentified: null,
    reasoningIdentified: null,
    evidenceIdentified: [],
    counterArgumentIdentified: null,
    rebuttalIdentified: null,
    conclusionIdentified: null,
    criteria: {
      intellectual_framework: emptyCriterion('intellectual_framework', CANONICAL_JRE_RUBRIC[0].nameAr, 4),
      deep_analysis: emptyCriterion('deep_analysis', CANONICAL_JRE_RUBRIC[1].nameAr, 4),
      evidence_usage: emptyCriterion('evidence_usage', CANONICAL_JRE_RUBRIC[2].nameAr, 4),
      structure_coherence: emptyCriterion('structure_coherence', CANONICAL_JRE_RUBRIC[3].nameAr, 4),
      justified_conclusion: emptyCriterion('justified_conclusion', CANONICAL_JRE_RUBRIC[4].nameAr, 4)
    },
    strengths: [],
    weaknesses: [reason],
    actionableRecommendations: ['اكتب إجابة كاملة تغطي أركان الـ JRE الخمسة لتحصل على التقييم من 20 درجة.'],
    evaluatorNotes: reason,
    rubricVersion: '2.0.0-canonical-20m'
  };
}
