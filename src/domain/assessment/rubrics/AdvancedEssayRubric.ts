/**
 * Advanced Essay Rubric (Suggested Pedagogical)
 * روبرك تربوي مقترح لتصحيح المقالات المحاسبية المتقدمة والتحليلية
 * 
 * Distinct from the 20-mark Canonical JRE Rubric.
 * Evaluates 5 weighted dimensions for complex analytical essays (Total Weight: 100%).
 */

export interface EssayDimension {
  id: 'accounting_understanding' | 'analysis' | 'evaluation' | 'evidence_procedures' | 'structure_language';
  nameAr: string;
  nameEn: string;
  weight: number; // e.g. 0.20
  percentage: number; // e.g. 20
  descriptionAr: string;
  rubricLevels: {
    level: 'excellent' | 'proficient' | 'developing' | 'novice';
    labelAr: string;
    pointsMultiplier: number; // 1.0, 0.75, 0.5, 0.25
    criteriaAr: string;
  }[];
}

export const ADVANCED_ESSAY_RUBRIC: {
  titleAr: string;
  titleEn: string;
  type: 'suggested_pedagogical';
  dimensions: EssayDimension[];
} = {
  titleAr: 'روبرك عام لتصحيح المقالات المتقدمة (تربوي مقترح داخل البنك)',
  titleEn: 'Advanced Essay Rubric (Suggested Pedagogical)',
  type: 'suggested_pedagogical',
  dimensions: [
    {
      id: 'accounting_understanding',
      nameAr: 'الفهم المحاسبي',
      nameEn: 'Accounting Understanding',
      weight: 0.20,
      percentage: 20,
      descriptionAr: 'توظيف المفاهيم والقواعد الصحيحة دون خلط بين الربح والسيولة أو الأصل والمصروف أو التوازن والصحة.',
      rubricLevels: [
        { level: 'excellent', labelAr: 'متميز', pointsMultiplier: 1.0, criteriaAr: 'استيعاب تام وتطبيق دقيق للمفاهيم دون أي خلط مفاهيمي.' },
        { level: 'proficient', labelAr: 'متقن', pointsMultiplier: 0.75, criteriaAr: 'فهم سليم مع أخطاء طفيفة غير مخلة بالمنطق الأساسي.' },
        { level: 'developing', labelAr: 'نامٍ', pointsMultiplier: 0.50, criteriaAr: 'فهم جزئي مع ظهور خلط بين بعض المفاهيم المتقاربة.' },
        { level: 'novice', labelAr: 'مبتدئ', pointsMultiplier: 0.25, criteriaAr: 'خلط جوهري بين المفاهيم المحاسبية الأساسية.' }
      ]
    },
    {
      id: 'analysis',
      nameAr: 'التحليل',
      nameEn: 'Analysis',
      weight: 0.25,
      percentage: 25,
      descriptionAr: 'تفكيك المعاملة أو الموقف وربط السبب بالأثر على الحسابات والقوائم المالية.',
      rubricLevels: [
        { level: 'excellent', labelAr: 'متميز', pointsMultiplier: 1.0, criteriaAr: 'تفكيك شامل ودقيق وتتبع كامل للأثر المالي المتبادل.' },
        { level: 'proficient', labelAr: 'متقن', pointsMultiplier: 0.75, criteriaAr: 'تحليل جيد يغطي الأطراف الرئيسية مع تفكيك سليم.' },
        { level: 'developing', labelAr: 'نامٍ', pointsMultiplier: 0.50, criteriaAr: 'تحليل سطحي يكتفي بذكر بعض الآثار دون ربطها بالأسباب.' },
        { level: 'novice', labelAr: 'مبتدئ', pointsMultiplier: 0.25, criteriaAr: 'عجز عن تفكيك الموقف أو تقديم تحليل سببي منطقي.' }
      ]
    },
    {
      id: 'evaluation',
      nameAr: 'التقييم وإصدار الحكم',
      nameEn: 'Evaluation & Judgment',
      weight: 0.25,
      percentage: 25,
      descriptionAr: 'إصدار حكم واضح ومبرر، مع الاعتراف بحدود الدليل أو وجود بدائل محاسبية مشروعة.',
      rubricLevels: [
        { level: 'excellent', labelAr: 'متميز', pointsMultiplier: 1.0, criteriaAr: 'حكم مهني متوازن ومبرر مع إدراك عميق لحدود الدليل المحاسبي.' },
        { level: 'proficient', labelAr: 'متقن', pointsMultiplier: 0.75, criteriaAr: 'حكم واضح ومدعوم بمبررات منطقية كافية.' },
        { level: 'developing', labelAr: 'نامٍ', pointsMultiplier: 0.50, criteriaAr: 'حكم غير متوازن أو مبررات غير كافية لدعم النتيجة.' },
        { level: 'novice', labelAr: 'مبتدئ', pointsMultiplier: 0.25, criteriaAr: 'حكم عشوائي أو مطلق دون تبرير محاسبي.' }
      ]
    },
    {
      id: 'evidence_procedures',
      nameAr: 'الأدلة والإجراءات',
      nameEn: 'Evidence & Procedures',
      weight: 0.20,
      percentage: 20,
      descriptionAr: 'الاستناد إلى أرقام أو مستندات أو اختبارات ومراجعات مناسبة.',
      rubricLevels: [
        { level: 'excellent', labelAr: 'متميز', pointsMultiplier: 1.0, criteriaAr: 'توظيف دقيق لأرقام الحالة والمستندات واقتراح إجراءات تحقق متقدمة.' },
        { level: 'proficient', labelAr: 'متقن', pointsMultiplier: 0.75, criteriaAr: 'استخدام جيد للأدلة الرقمية والمستندية لدعم الطرح.' },
        { level: 'developing', labelAr: 'نامٍ', pointsMultiplier: 0.50, criteriaAr: 'استخدام محدود أو غير دقيق للأدلة والأرقام المعطاة.' },
        { level: 'novice', labelAr: 'مبتدئ', pointsMultiplier: 0.25, criteriaAr: 'غياب كامل للأدلة الملموسة أو اعتماد بيانات متخيلة.' }
      ]
    },
    {
      id: 'structure_language',
      nameAr: 'التنظيم واللغة',
      nameEn: 'Structure & Language',
      weight: 0.10,
      percentage: 10,
      descriptionAr: 'مقدمة أو حكم، تحليل منظم، خاتمة، ومصطلحات محاسبية دقيقة.',
      rubricLevels: [
        { level: 'excellent', labelAr: 'متميز', pointsMultiplier: 1.0, criteriaAr: 'بناء مقالي محكم ولغة مهنية راقية مع تسلسل منطقي جذاب.' },
        { level: 'proficient', labelAr: 'متقن', pointsMultiplier: 0.75, criteriaAr: 'هيكل منظم وواضح مع استخدام سليم للمصطلحات المحاسبية.' },
        { level: 'developing', labelAr: 'نامٍ', pointsMultiplier: 0.50, criteriaAr: 'تنظيم مقبول لكن يعاني من بعض القفزات اللغوية أو الفكرية.' },
        { level: 'novice', labelAr: 'مبتدئ', pointsMultiplier: 0.25, criteriaAr: 'صياغة غير مترابطة تفتقر للمصطلحات المهنية الدقيقة.' }
      ]
    }
  ]
};

export function scoreAdvancedEssay(
  maxMarks: number,
  dimensionScores: Record<string, number> // 0.0 to 1.0 for each dimension
): { totalScore: number; percentage: number; dimensionBreakdown: Record<string, number> } {
  let totalWeightedMultiplier = 0;
  const dimensionBreakdown: Record<string, number> = {};

  for (const dim of ADVANCED_ESSAY_RUBRIC.dimensions) {
    const rawMultiplier = Math.max(0, Math.min(1, dimensionScores[dim.id] ?? 0));
    const dimMaxPoints = maxMarks * dim.weight;
    const dimScore = dimMaxPoints * rawMultiplier;
    dimensionBreakdown[dim.id] = parseFloat(dimScore.toFixed(2));
    totalWeightedMultiplier += dim.weight * rawMultiplier;
  }

  const totalScore = parseFloat((maxMarks * totalWeightedMultiplier).toFixed(2));
  const percentage = Math.round((totalScore / maxMarks) * 100);

  return { totalScore, percentage, dimensionBreakdown };
}
