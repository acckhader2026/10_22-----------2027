/**
 * Canonical Egyptian Baccalaureate (EB) JRE (Justified Reasoning with Evidence) Rubric Specification
 * Single Source of Truth for JRE Assessment across Student UI, Backend Evaluator, Exam Simulator, and Analytics.
 *
 * Total Marks: 20
 * Criteria: 5 dimensions × 4 marks each.
 */

export interface JRECriterionDefinition {
  id: 'intellectual_framework' | 'deep_analysis' | 'evidence_usage' | 'structure_coherence' | 'justified_conclusion';
  nameAr: string;
  nameEn: string;
  maxMarks: 4;
  weight: 0.20; // 20%
  descriptionAr: string;
  descriptors: {
    score: number; // 0 to 4
    label: string;
    description: string;
  }[];
}

export interface JRECriterionEvaluation {
  criterionId: 'intellectual_framework' | 'deep_analysis' | 'evidence_usage' | 'structure_coherence' | 'justified_conclusion' | 'framework' | 'evidence' | 'organization' | 'judgment' | string;
  nameAr: string;
  score: number; // 0.0 - 4.0
  maxScore: number;
  evidenceFound: string[];
  missingElements: string[];
  reasoning: string;
  improvementTip: string;
}

export interface JREEvaluationResult {
  totalScore: number; // 0.0 - 20.0
  maxTotalScore: number;
  percentage: number; // 0 - 100
  performanceBand: 'EXEMPLARY' | 'PROFICIENT' | 'DEVELOPING' | 'NOVICE';
  status: 'EVALUATED' | 'INSUFFICIENT_INPUT' | 'FLAGGED_FOR_TEACHER_REVIEW';
  confidence: number; // 0.0 - 1.0
  claimIdentified: string | null;
  reasoningIdentified: string | null;
  evidenceIdentified: string[];
  counterArgumentIdentified: string | null;
  rebuttalIdentified: string | null;
  conclusionIdentified: string | null;
  criteria: Record<string, JRECriterionEvaluation>;
  strengths: string[];
  weaknesses: string[];
  actionableRecommendations: string[];
  evaluatorNotes: string;
  rubricVersion: string;
}

export const CANONICAL_JRE_RUBRIC: JRECriterionDefinition[] = [
  {
    id: 'intellectual_framework',
    nameAr: 'الإطار الفكري وتحديد الموقف المحاسبي (Intellectual Framework)',
    nameEn: 'Intellectual Framework & Claim',
    maxMarks: 4,
    weight: 0.20,
    descriptionAr: 'صياغة حكم محاسبي صريح ومباشر يحدد الموقف المهني دون مواربة أو غموض، وتحديد القضية المحاسبية محل الجدل بدقة.',
    descriptors: [
      { score: 4, label: 'متقن (Exemplary)', description: 'حكم مهني صريح وحاسم ودقيق محاسبياً، يحدد بدقة جوهر القضية وموقف الطالب المستند للمعايير.' },
      { score: 3, label: 'كفء (Proficient)', description: 'حكم واضح وسليم محاسبياً ولكن صياغته عامة أو تفتقر إلى التحديد الدقيق للمفهوم.' },
      { score: 2, label: 'نامٍ (Developing)', description: 'حكم ضمني أو متردد أو يخلط جزئياً بين الموقف المحاسبي السليم والرأي الشائع.' },
      { score: 1, label: 'مبتدئ (Novice)', description: 'حكم خاطئ أو غير محدد، أو مجرد تكرار لنص السؤال دون اتخاذ موقف مهني.' },
      { score: 0, label: 'منعدم (Zero)', description: 'غياب كامل للحكم أو إجابة خارج نطاق القضية.' }
    ]
  },
  {
    id: 'deep_analysis',
    nameAr: 'التحليل المحاسبي العميق والعلية (Deep Analysis & Causality)',
    nameEn: 'Deep Accounting Analysis',
    maxMarks: 4,
    weight: 0.20,
    descriptionAr: 'تفسير منطقي سببي يربط الموقف بالمبادئ والفروض المحاسبية (المقابلة، الاستحقاق، الحيطة والحذر، الوحدة المحاسبية، الثبات).',
    descriptors: [
      { score: 4, label: 'متقن (Exemplary)', description: 'شرح سببي عميق يربط بدقة بين الإجراء المحاسبي والأثر على القوائم المالية مع الاستناد للمبادئ المحاسبية الحاكمة.' },
      { score: 3, label: 'كفء (Proficient)', description: 'تفسير سببي سليم مع ذكر المبادئ المحاسبية دون تعميق كافٍ للأثر المالي المترتب.' },
      { score: 2, label: 'نامٍ (Developing)', description: 'تفسير سطحي يعتمد على المنطق العام دون استناد صريح للمبادئ المحاسبية.' },
      { score: 1, label: 'مبتدئ (Novice)', description: 'تفسير ضعيف أو خاطئ يحتوي على مغالطات مفاهيمية.' },
      { score: 0, label: 'منعدم (Zero)', description: 'انعدام التحليل والعلية المحاسبية.' }
    ]
  },
  {
    id: 'evidence_usage',
    nameAr: 'استخدام الأدلة المحاسبية والرقمية (Evidence & Data)',
    nameEn: 'Evidence & Accounting Data',
    maxMarks: 4,
    weight: 0.20,
    descriptionAr: 'تقديم أدلة ملموسة، سيناريوهات محددة، قيود يومية، أو أمثلة رقمية تثبت صحة الحجة وتوضح الأثر المالي.',
    descriptors: [
      { score: 4, label: 'متقن (Exemplary)', description: 'تدعيم كامل بأدلة محاسبية دقيقة وأمثلة رقمية توضح الأثر المزدوج على القوائم المالية.' },
      { score: 3, label: 'كفء (Proficient)', description: 'تقديم أدلة وصفية وسيناريوهات محاسبية ملائمة مع غياب التمثيل الرقمي المحدد.' },
      { score: 2, label: 'نامٍ (Developing)', description: 'أدلة عامة أو غير كافية لتدعيم الرأي.' },
      { score: 1, label: 'مبتدئ (Novice)', description: 'أدلة غير مرتبطة بالقضية أو أرقام غير منطقية.' },
      { score: 0, label: 'منعدم (Zero)', description: 'غياب الأدلة المحاسبية تماماً.' }
    ]
  },
  {
    id: 'structure_coherence',
    nameAr: 'البنية والتماسك والحجة المضادة (Structure, Counter-Argument & Rebuttal)',
    nameEn: 'Structure, Counter-Argument & Rebuttal',
    maxMarks: 4,
    weight: 0.20,
    descriptionAr: 'بناء مقال منطقي متسلسل، يتضمن عرض الرأي المخالف (Counter-Argument) وتفنيده والرد عليه بحجة موضوعية (Rebuttal).',
    descriptors: [
      { score: 4, label: 'متقن (Exemplary)', description: 'تسلسل منطقي متماسك، وعرض متزن للحجة المضادة وتفنيدها بحجة محاسبية دامغة وروابط استدلالية رصينة.' },
      { score: 3, label: 'كفء (Proficient)', description: 'بناء منظم مع الإشارة للحجة المضادة والرد عليها ولكن بشكل مقتضب.' },
      { score: 2, label: 'نامٍ (Developing)', description: 'بناء مقال تقليدي دون معالجة الرأي المخالف أو تفنيده.' },
      { score: 1, label: 'مبتدئ (Novice)', description: 'أفكار مبعثرة تفتقر للتسلسل والروابط المنطقية.' },
      { score: 0, label: 'منعدم (Zero)', description: 'نص غير مترابط أو مجرد عبارات عشوائية.' }
    ]
  },
  {
    id: 'justified_conclusion',
    nameAr: 'الخاتمة المعللة والرأي المهني (Justified Conclusion & Professional Take)',
    nameEn: 'Justified Conclusion & Synthesis',
    maxMarks: 4,
    weight: 0.20,
    descriptionAr: 'صياغة خلاصة تركيبية ناضجة تلخص الموقف المهني وتقدم توصية محاسبية تحمي مصداقية وعدالة التقارير المالية.',
    descriptors: [
      { score: 4, label: 'متقن (Exemplary)', description: 'خاتمة تركيبية جامعة تلخص الحجة بدقة، وتقدم توصية مهنية رصينة لحماية مصداقية القوائم المالية.' },
      { score: 3, label: 'كفء (Proficient)', description: 'خاتمة واضحة تلخص الموقف دون إضافة بعد تركيبي أو توصية مهنية.' },
      { score: 2, label: 'نامٍ (Developing)', description: 'خاتمة مقتضبة جداً أو تكرار حرفي للمقدمة.' },
      { score: 1, label: 'مبتدئ (Novice)', description: 'خاتمة غير منسجمة مع متن المقال أو مبتورة.' },
      { score: 0, label: 'منعدم (Zero)', description: 'انعدام الخاتمة.' }
    ]
  }
];

export function getPerformanceBand(totalScore: number): 'EXEMPLARY' | 'PROFICIENT' | 'DEVELOPING' | 'NOVICE' {
  if (totalScore >= 18) return 'EXEMPLARY';
  if (totalScore >= 14) return 'PROFICIENT';
  if (totalScore >= 10) return 'DEVELOPING';
  return 'NOVICE';
}
