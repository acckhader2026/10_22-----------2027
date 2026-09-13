/**
 * Explicit Mapping Table between Unified Question Bank LO codes (LO-01..LO-12)
 * and Canonical Learning Objective IDs in CANONICAL_UNIT_1 and CANONICAL_UNIT_2.
 */

export interface LOMappingEntry {
  sourceUnit: 'unit-1' | 'unit-2' | 'unit-3';
  sourceLO: string; // e.g., 'LO-01'
  sourceTitleAr: string;
  canonicalLessonId: string;
  canonicalObjectiveId: string;
  secondaryObjectiveIds?: string[];
}

export const UNIFIED_LO_MAPPING: LOMappingEntry[] = [
  // --- UNIT 1 MAPPINGS ---
  {
    sourceUnit: 'unit-1',
    sourceLO: 'LO-01',
    sourceTitleAr: 'تفسير ماهية المحاسبة ووظيفتها ومستخدميها',
    canonicalLessonId: 'lesson-1',
    canonicalObjectiveId: 'obj-1-1',
    secondaryObjectiveIds: ['obj-1-2']
  },
  {
    sourceUnit: 'unit-1',
    sourceLO: 'LO-02',
    sourceTitleAr: 'التمييز بين النشاط المالي والربحية',
    canonicalLessonId: 'lesson-1',
    canonicalObjectiveId: 'obj-1-4',
    secondaryObjectiveIds: ['obj-1-2']
  },
  {
    sourceUnit: 'unit-1',
    sourceLO: 'LO-03',
    sourceTitleAr: 'تطبيق الحيطة والمقابلة والثبات والنقدي/الاستحقاق',
    canonicalLessonId: 'lesson-1',
    canonicalObjectiveId: 'obj-1-3',
    secondaryObjectiveIds: ['obj-1-4']
  },
  {
    sourceUnit: 'unit-1',
    sourceLO: 'LO-04',
    sourceTitleAr: 'استخدام الأصول = الخصوم + حقوق الملكية',
    canonicalLessonId: 'lesson-2',
    canonicalObjectiveId: 'obj-2-1'
  },
  {
    sourceUnit: 'unit-1',
    sourceLO: 'LO-05',
    sourceTitleAr: 'تحليل أنماط أثر العمليات والتغيرات المتتابعة',
    canonicalLessonId: 'lesson-2',
    canonicalObjectiveId: 'obj-2-2',
    secondaryObjectiveIds: ['obj-2-3']
  },
  {
    sourceUnit: 'unit-1',
    sourceLO: 'LO-06',
    sourceTitleAr: 'تطبيق القيد المزدوج وقواعد المدين والدائن',
    canonicalLessonId: 'lesson-3',
    canonicalObjectiveId: 'obj-3-1',
    secondaryObjectiveIds: ['obj-3-2']
  },
  {
    sourceUnit: 'unit-1',
    sourceLO: 'LO-07',
    sourceTitleAr: 'الترحيل والترصيد وحسابات T',
    canonicalLessonId: 'lesson-3',
    canonicalObjectiveId: 'obj-3-3'
  },
  {
    sourceUnit: 'unit-1',
    sourceLO: 'LO-08',
    sourceTitleAr: 'إعداد ميزان المراجعة وفهم حدوده',
    canonicalLessonId: 'lesson-4',
    canonicalObjectiveId: 'obj-4-1'
  },
  {
    sourceUnit: 'unit-1',
    sourceLO: 'LO-09',
    sourceTitleAr: 'اكتشاف وتصنيف وتصحيح الأخطاء',
    canonicalLessonId: 'lesson-4',
    canonicalObjectiveId: 'obj-4-2',
    secondaryObjectiveIds: ['obj-4-3']
  },
  {
    sourceUnit: 'unit-1',
    sourceLO: 'LO-10',
    sourceTitleAr: 'إعداد الحسابات الختامية والمنشأة الفردية',
    canonicalLessonId: 'lesson-5',
    canonicalObjectiveId: 'obj-5-1',
    secondaryObjectiveIds: ['obj-5-2', 'obj-5-3']
  },
  {
    sourceUnit: 'unit-1',
    sourceLO: 'LO-11',
    sourceTitleAr: 'تفسير النتائج بأدلة مترابطة',
    canonicalLessonId: 'lesson-6',
    canonicalObjectiveId: 'obj-6-1'
  },
  {
    sourceUnit: 'unit-1',
    sourceLO: 'LO-12',
    sourceTitleAr: 'بناء إجابة JRE منظمة',
    canonicalLessonId: 'lesson-6',
    canonicalObjectiveId: 'obj-6-2'
  },

  // --- UNIT 2 MAPPINGS ---
  {
    sourceUnit: 'unit-2',
    sourceLO: 'LO-01',
    sourceTitleAr: 'تعريف قاعدة القيد المزدوج وشرح أساسها المنطقي',
    canonicalLessonId: 'u2-lesson-1',
    canonicalObjectiveId: 'obj-2-1'
  },
  {
    sourceUnit: 'unit-2',
    sourceLO: 'LO-02',
    sourceTitleAr: 'تفسير تأثير المعاملة على حسابين على الأقل',
    canonicalLessonId: 'u2-lesson-1',
    canonicalObjectiveId: 'obj-2-2',
    secondaryObjectiveIds: ['obj-2-3']
  },
  {
    sourceUnit: 'unit-2',
    sourceLO: 'LO-03',
    sourceTitleAr: 'التمييز بين المدين والدائن كطرفي حساب',
    canonicalLessonId: 'u2-lesson-2',
    canonicalObjectiveId: 'obj-2-1'
  },
  {
    sourceUnit: 'unit-2',
    sourceLO: 'LO-04',
    sourceTitleAr: 'تصنيف الحسابات إلى الفئات الخمس',
    canonicalLessonId: 'u2-lesson-2',
    canonicalObjectiveId: 'obj-2-2'
  },
  {
    sourceUnit: 'unit-2',
    sourceLO: 'LO-05',
    sourceTitleAr: 'تطبيق قاعدة الزيادة والنقص',
    canonicalLessonId: 'u2-lesson-2',
    canonicalObjectiveId: 'obj-2-3',
    secondaryObjectiveIds: ['obj-2-4']
  },
  {
    sourceUnit: 'unit-2',
    sourceLO: 'LO-06',
    sourceTitleAr: 'تسجيل اليومية البسيطة والمركبة',
    canonicalLessonId: 'u2-lesson-3',
    canonicalObjectiveId: 'obj-3-1',
    secondaryObjectiveIds: ['obj-3-2']
  },
  {
    sourceUnit: 'unit-2',
    sourceLO: 'LO-07',
    sourceTitleAr: 'الترحيل إلى الأستاذ وحساب الرصيد',
    canonicalLessonId: 'u2-lesson-3',
    canonicalObjectiveId: 'obj-3-3',
    secondaryObjectiveIds: ['obj-3-4']
  },
  {
    sourceUnit: 'unit-2',
    sourceLO: 'LO-08',
    sourceTitleAr: 'إعداد ميزان المراجعة والتحقق من توازنه',
    canonicalLessonId: 'u2-lesson-4',
    canonicalObjectiveId: 'obj-4-1'
  },
  {
    sourceUnit: 'unit-2',
    sourceLO: 'LO-09',
    sourceTitleAr: 'اكتشاف وتصحيح الأخطاء المؤثرة وغير المؤثرة',
    canonicalLessonId: 'u2-lesson-4',
    canonicalObjectiveId: 'obj-4-2',
    secondaryObjectiveIds: ['obj-4-3', 'obj-4-4']
  },
  {
    sourceUnit: 'unit-2',
    sourceLO: 'LO-10',
    sourceTitleAr: 'دمج الدورة المحاسبية كاملة',
    canonicalLessonId: 'u2-lesson-5',
    canonicalObjectiveId: 'obj-5-1',
    secondaryObjectiveIds: ['obj-5-2', 'obj-5-4']
  },
  {
    sourceUnit: 'unit-2',
    sourceLO: 'LO-11',
    sourceTitleAr: 'تقييم حدود التوازن المحاسبي',
    canonicalLessonId: 'u2-lesson-6',
    canonicalObjectiveId: 'obj-6-1'
  },
  {
    sourceUnit: 'unit-2',
    sourceLO: 'LO-12',
    sourceTitleAr: 'بناء إجابة JRE منظمة ومدعومة',
    canonicalLessonId: 'u2-lesson-6',
    canonicalObjectiveId: 'obj-6-2'
  },
  // --- UNIT 3 MAPPINGS ---
  {
    sourceUnit: 'unit-3',
    sourceLO: 'LO-01',
    sourceTitleAr: 'تفسير لماذا يصبح دفتر اليومية العام غير كافٍ',
    canonicalLessonId: 'lesson-3-1',
    canonicalObjectiveId: 'obj-1-1'
  },
  {
    sourceUnit: 'unit-3',
    sourceLO: 'LO-02',
    sourceTitleAr: 'تسجيل المبيعات والمشتريات الآجلة',
    canonicalLessonId: 'lesson-3-2',
    canonicalObjectiveId: 'obj-2-1'
  },
  {
    sourceUnit: 'unit-3',
    sourceLO: 'LO-03',
    sourceTitleAr: 'تسجيل مردودات المبيعات والمشتريات',
    canonicalLessonId: 'lesson-3-3',
    canonicalObjectiveId: 'obj-3-1'
  },
  {
    sourceUnit: 'unit-3',
    sourceLO: 'LO-04',
    sourceTitleAr: 'إعداد دفتر النقدية',
    canonicalLessonId: 'lesson-3-4',
    canonicalObjectiveId: 'obj-4-1'
  },
  {
    sourceUnit: 'unit-3',
    sourceLO: 'LO-05',
    sourceTitleAr: 'تطبيق الدورة المحاسبية',
    canonicalLessonId: 'lesson-3-5',
    canonicalObjectiveId: 'obj-5-1'
  },
  {
    sourceUnit: 'unit-3',
    sourceLO: 'LO-06',
    sourceTitleAr: 'تحليل أثر تخصص الدفاتر المساعدة',
    canonicalLessonId: 'lesson-3-6',
    canonicalObjectiveId: 'obj-6-1'
  }
];

export function mapSourceLOToCanonical(
  unitOrLO: 'unit-1' | 'unit-2' | 'unit-3' | string,
  maybeSourceLO?: string
): { lessonId: string; objectiveId: string; canonicalLessonId: string; canonicalObjectiveId: string } | undefined {
  let unitId: 'unit-1' | 'unit-2' | 'unit-3' | undefined;
  let sourceLO: string;

  if (unitOrLO === 'unit-1' || unitOrLO === 'unit-2' || unitOrLO === 'unit-3') {
    unitId = unitOrLO as any;
    sourceLO = maybeSourceLO || '';
  } else {
    sourceLO = unitOrLO;
  }

  const match = UNIFIED_LO_MAPPING.find(m => 
    (!unitId || m.sourceUnit === unitId) && m.sourceLO === sourceLO
  );

  if (match) {
    return { 
      lessonId: match.canonicalLessonId, 
      objectiveId: match.canonicalObjectiveId,
      canonicalLessonId: match.canonicalLessonId,
      canonicalObjectiveId: match.canonicalObjectiveId
    };
  }

  return undefined;
}
