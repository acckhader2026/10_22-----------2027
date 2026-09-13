import { UnitSpec } from './CurriculumModel';

export const CANONICAL_UNIT_3: UnitSpec = {
  id: "unit-3",
  unitNumber: 3,
  subjectCode: "ACC.U3",
  titleAr: "الوحدة الثالثة: دفاتر اليومية المساعدة",
  descriptionAr: "منظومة الدفاتر المتخصصة • المبيعات والمشتريات الآجلة • المردودات والخصومات • دفتر النقدية والمصروفات النثرية • حالة فريدة التدريبية • حالة بلال ومقال التفسير JRE",
  totalNominalMarks: 100,
  lessons: [
    {
      id: "lesson-1",
      lessonNumber: 1,
      unitId: "unit-3",
      titleAr: "مقدمة إلى دفاتر اليومية المساعدة",
      subtitleAr: "لماذا يصبح دفتر اليومية العام غير كافٍ مع نمو الأعمال، ودور المستندات الأصلية",
      textbookPages: [59, 62],
      nominalWeight: 16,
      objectives: [
        {
          id: "obj-3-1-1",
          code: "LO-U3.1",
          lessonId: "lesson-1",
          titleAr: "يفسر لماذا يصبح دفتر اليومية العام غير كافٍ مع نمو الأعمال ومخاطر السهو والازدحام.",
          taxonomy: "Understand",
          cognitiveDomain: "KNOWLEDGE",
          targetDifficulty: "basic",
          weightPercentage: 5,
          bookPageRef: 59,
          primaryMisconceptions: [
            "الاعتقاد بأن الدفاتر المساعدة تلغي مبدأ القيد المزدوج أو تحل محله تماماً."
          ],
          conceptIds: ["concept-u3-specialized-journals"],
          isJRERequired: false,
          questionIds: ["U3-Q01", "U3-Q02"]
        },
        {
          id: "obj-3-1-2",
          code: "LO-U3.2",
          lessonId: "lesson-1",
          titleAr: "يعرف دفاتر اليومية المساعدة ودورها التنظيمي والرقابي في تجميع المعاملات المتشابهة.",
          taxonomy: "Understand",
          cognitiveDomain: "KNOWLEDGE",
          targetDifficulty: "intermediate",
          weightPercentage: 5,
          bookPageRef: 60,
          primaryMisconceptions: [
            "الظن بأن المحاسبة تبدأ بالقيد في الدفاتر وليس بوجود المستند الثبوتي الأصلي."
          ],
          conceptIds: ["concept-u3-internal-control"],
          isJRERequired: false,
          questionIds: ["U3-Q03", "U3-Q04"]
        },
        {
          id: "obj-3-1-3",
          code: "LO-U3.3",
          lessonId: "lesson-1",
          titleAr: "يميز بين المعاملات التي تُسجل في الدفاتر المساعدة المختلفة والدفتر اليومية العام.",
          taxonomy: "Apply",
          cognitiveDomain: "APPLICATION",
          targetDifficulty: "intermediate",
          weightPercentage: 6,
          bookPageRef: 61,
          primaryMisconceptions: [
            "تسجيل المبيعات النقدية في دفتر يومية المبيعات الآجلة بدلاً من دفتر النقدية."
          ],
          conceptIds: ["concept-u3-transaction-classification"],
          isJRERequired: false,
          questionIds: ["U3-Q05", "U3-Q06"]
        }
      ],
      concepts: [
        { id: "concept-u3-specialized-journals", titleAr: "الدفاتر المساعدة المتخصصة", relatedObjectiveIds: ["obj-3-1-1"] },
        { id: "concept-u3-internal-control", titleAr: "الرقابة الداخلية ومنع الازدحام", relatedObjectiveIds: ["obj-3-1-2"] },
        { id: "concept-u3-transaction-classification", titleAr: "تصنيف المعاملات المحاسبية", relatedObjectiveIds: ["obj-3-1-3"] }
      ],
      skills: [
        { id: "skill-3-1-1", titleAr: "تحديد الدفتر المناسب للعملية التجارية", taxonomy: "Apply", relatedObjectiveIds: ["obj-3-1-3"] },
        { id: "skill-3-1-2", titleAr: "تحليل مخاطر الازدحام الدفتري", taxonomy: "Understand", relatedObjectiveIds: ["obj-3-1-1", "obj-3-1-2"] }
      ],
      questionIds: ["U3-Q01", "U3-Q02", "U3-Q03", "U3-Q04", "U3-Q05", "U3-Q06"]
    },
    {
      id: "lesson-2",
      lessonNumber: 2,
      unitId: "unit-3",
      titleAr: "دفاتر المبيعات والمشتريات الآجلة",
      subtitleAr: "تسجيل فواتير البيع والشراء الآجل، وقواعد الترحيل الفردي والإجمالي لحسابات الأستاذ",
      textbookPages: [63, 67],
      nominalWeight: 18,
      objectives: [
        {
          id: "obj-3-2-1",
          code: "LO-U3.4",
          lessonId: "lesson-2",
          titleAr: "يسجل المعاملات في دفتر يومية المبيعات الآجلة ويرحلها فردياً لحسابات العملاء وإجمالياً للمبيعات.",
          taxonomy: "Apply",
          cognitiveDomain: "APPLICATION",
          targetDifficulty: "intermediate",
          weightPercentage: 9,
          bookPageRef: 63,
          primaryMisconceptions: [
            "ترحيل إجمالي المبيعات إلى الطرف المدين بدلاً من الدائن، أو إدراج مبيعات الأصول الثابتة فيه."
          ],
          conceptIds: ["concept-u3-sales-daybook"],
          isJRERequired: false,
          questionIds: ["U3-Q07", "U3-Q08", "U3-Q09"]
        },
        {
          id: "obj-3-2-2",
          code: "LO-U3.5",
          lessonId: "lesson-2",
          titleAr: "يسجل المعاملات في دفتر يومية المشتريات الآجلة ويرحلها فردياً للموردين وإجمالياً لحساب المشتريات.",
          taxonomy: "Apply",
          cognitiveDomain: "APPLICATION",
          targetDifficulty: "intermediate",
          weightPercentage: 9,
          bookPageRef: 65,
          primaryMisconceptions: [
            "تسجيل المشتريات النقدية للبضاعة ضمن دفتر المشتريات الآجلة."
          ],
          conceptIds: ["concept-u3-purchases-daybook"],
          isJRERequired: false,
          questionIds: ["U3-Q10", "U3-Q11", "U3-Q12"]
        }
      ],
      concepts: [
        { id: "concept-u3-sales-daybook", titleAr: "دفتر يومية المبيعات الآجلة", relatedObjectiveIds: ["obj-3-2-1"] },
        { id: "concept-u3-purchases-daybook", titleAr: "دفتر يومية المشتريات الآجلة", relatedObjectiveIds: ["obj-3-2-2"] }
      ],
      skills: [
        { id: "skill-3-2-1", titleAr: "الترحيل الفردي والإجمالي لدفاتر المبيعات والمشتريات", taxonomy: "Apply", relatedObjectiveIds: ["obj-3-2-1", "obj-3-2-2"] }
      ],
      questionIds: ["U3-Q07", "U3-Q08", "U3-Q09", "U3-Q10", "U3-Q11", "U3-Q12"]
    },
    {
      id: "lesson-3",
      lessonNumber: 3,
      unitId: "unit-3",
      titleAr: "دفاتر المردودات والخصم التجاري والنقدي",
      subtitleAr: "إشعارات الخصم والإضافة، مردودات المبيعات والمشتريات، والتمييز المحاسبي بين أنواع الخصم",
      textbookPages: [68, 72],
      nominalWeight: 18,
      objectives: [
        {
          id: "obj-3-3-1",
          code: "LO-U3.6",
          lessonId: "lesson-3",
          titleAr: "يسجل المعاملات في دفتري مردودات المبيعات والمشتريات استناداً لإشعارات الخصم والإضافة.",
          taxonomy: "Apply",
          cognitiveDomain: "APPLICATION",
          targetDifficulty: "intermediate",
          weightPercentage: 9,
          bookPageRef: 68,
          primaryMisconceptions: [
            "الخلط بين طبيعة حساب مردودات المبيعات (مدين) ومردودات المشتريات (دائن)."
          ],
          conceptIds: ["concept-u3-returns-daybooks"],
          isJRERequired: false,
          questionIds: ["U3-Q13", "U3-Q14", "U3-Q15"]
        },
        {
          id: "obj-3-3-2",
          code: "LO-U3.7",
          lessonId: "lesson-3",
          titleAr: "يميز بين الخصم التجاري والخصم النقدي (تعجيل الدفع) ويثبت كلاً منهما محاسبياً.",
          taxonomy: "Analyze",
          cognitiveDomain: "HIGHER_ORDER_ANALYSIS",
          targetDifficulty: "advanced",
          weightPercentage: 9,
          bookPageRef: 70,
          primaryMisconceptions: [
            "إثبات الخصم التجاري كحساب مستقل في الدفاتر بدلاً من تسجيل المعاملة بالصافي مباشرة."
          ],
          conceptIds: ["concept-u3-discounts"],
          isJRERequired: false,
          questionIds: ["U3-Q16", "U3-Q17", "U3-Q18"]
        }
      ],
      concepts: [
        { id: "concept-u3-returns-daybooks", titleAr: "دفاتر المردودات (مبيعات ومشتريات)", relatedObjectiveIds: ["obj-3-3-1"] },
        { id: "concept-u3-discounts", titleAr: "الخصم التجاري والنقدي", relatedObjectiveIds: ["obj-3-3-2"] }
      ],
      skills: [
        { id: "skill-3-3-1", titleAr: "المعالجة المحاسبية لإشعارات الخصم والإضافة", taxonomy: "Apply", relatedObjectiveIds: ["obj-3-3-1"] },
        { id: "skill-3-3-2", titleAr: "التمييز بين أنواع الخصومات وتأثيرها", taxonomy: "Analyze", relatedObjectiveIds: ["obj-3-3-2"] }
      ],
      questionIds: ["U3-Q13", "U3-Q14", "U3-Q15", "U3-Q16", "U3-Q17", "U3-Q18"]
    },
    {
      id: "lesson-4",
      lessonNumber: 4,
      unitId: "unit-3",
      titleAr: "دفتر النقدية ودفتر المصروفات النثرية",
      subtitleAr: "دفتر النقدية ذو الأعمدة الثلاثة، السلفة المستديمة للمصروفات النثرية وقواعد استعاضتها",
      textbookPages: [73, 76],
      nominalWeight: 16,
      objectives: [
        {
          id: "obj-3-4-1",
          code: "LO-U3.8",
          lessonId: "lesson-4",
          titleAr: "يسجل المعاملات النقدية والبنكية والخصم النقدي في دفتر النقدية ذي الثلاثة أعمدة ويرحلها.",
          taxonomy: "Apply",
          cognitiveDomain: "APPLICATION",
          targetDifficulty: "intermediate",
          weightPercentage: 8,
          bookPageRef: 73,
          primaryMisconceptions: [
            "الاعتقاد بأن خانات الخصم في دفتر النقدية ترصد كما ترصد خانات الخزينة والبنك."
          ],
          conceptIds: ["concept-u3-three-column-cashbook"],
          isJRERequired: false,
          questionIds: ["U3-Q19", "U3-Q20", "U3-Q21"]
        },
        {
          id: "obj-3-4-2",
          code: "LO-U3.9",
          lessonId: "lesson-4",
          titleAr: "يسجل المصروفات النثرية وفق نظام السلفة المستديمة وقيد استعاضة المنصرف منها.",
          taxonomy: "Apply",
          cognitiveDomain: "APPLICATION",
          targetDifficulty: "intermediate",
          weightPercentage: 8,
          bookPageRef: 75,
          primaryMisconceptions: [
            "جعل حساب المصروفات النثرية مديناً عند كل عملية صرف صغيرة بدلاً من تسجيل المصروف النوعي عند الاستعاضة."
          ],
          conceptIds: ["concept-u3-petty-cash-imprest"],
          isJRERequired: false,
          questionIds: ["U3-Q22", "U3-Q23", "U3-Q24"]
        }
      ],
      concepts: [
        { id: "concept-u3-three-column-cashbook", titleAr: "دفتر النقدية ذو الأعمدة الثلاثة", relatedObjectiveIds: ["obj-3-4-1"] },
        { id: "concept-u3-petty-cash-imprest", titleAr: "نظام السلفة المستديمة للمصروفات النثرية", relatedObjectiveIds: ["obj-3-4-2"] }
      ],
      skills: [
        { id: "skill-3-4-1", titleAr: "إعداد وترصيد دفتر النقدية وتوزيع الخصومات", taxonomy: "Apply", relatedObjectiveIds: ["obj-3-4-1"] },
        { id: "skill-3-4-2", titleAr: "إدارة المصروفات النثرية واستعاضتها", taxonomy: "Apply", relatedObjectiveIds: ["obj-3-4-2"] }
      ],
      questionIds: ["U3-Q19", "U3-Q20", "U3-Q21", "U3-Q22", "U3-Q23", "U3-Q24"]
    },
    {
      id: "lesson-5",
      lessonNumber: 5,
      unitId: "unit-3",
      titleAr: "تطبيق عملي متكامل — دراسة حالة فريدة للتجارة",
      subtitleAr: "دورة محاسبية شاملة عبر الدفاتر المساعدة والترحيل لحسابات الأستاذ وميزان المراجعة (تدريب غير محلول)",
      textbookPages: [77, 81],
      nominalWeight: 16,
      objectives: [
        {
          id: "obj-3-5-1",
          code: "LO-U3.10",
          lessonId: "lesson-5",
          titleAr: "يطبق الدورة المحاسبية المتكاملة عبر منظومة الدفاتر المساعدة من واقع فواتير ومستندات مؤسسة فريدة.",
          taxonomy: "Apply",
          cognitiveDomain: "APPLICATION",
          targetDifficulty: "advanced",
          weightPercentage: 16,
          bookPageRef: 77,
          primaryMisconceptions: [
            "الاعتقاد بوجود حل رسمي جاهز للحالة في الكتاب بينما هي مصممة كتدريب استقصائي للطلاب."
          ],
          conceptIds: ["concept-u3-farida-comprehensive-case"],
          isJRERequired: false,
          questionIds: ["U3-Q25", "U3-Q26", "U3-Q27", "U3-Q28", "U3-Q29", "U3-Q30"]
        }
      ],
      concepts: [
        { id: "concept-u3-farida-comprehensive-case", titleAr: "دورة محاسبية متكاملة بالدفاتر المساعدة", relatedObjectiveIds: ["obj-3-5-1"] }
      ],
      skills: [
        { id: "skill-3-5-1", titleAr: "الربط التكاملي بين مختلف الدفاتر المساعدة والأستاذ العام", taxonomy: "Apply", relatedObjectiveIds: ["obj-3-5-1"] }
      ],
      questionIds: ["U3-Q25", "U3-Q26", "U3-Q27", "U3-Q28", "U3-Q29", "U3-Q30"]
    },
    {
      id: "lesson-6",
      lessonNumber: 6,
      unitId: "unit-3",
      titleAr: "التفسير المدعوم بالأدلة JRE — دراسة حالة محلات بلال",
      subtitleAr: "تحليل كفاءة الرقابة الداخلية وإعادة بناء السجلات المحاسبية وصياغة الحكم المهني (20 درجة)",
      textbookPages: [82, 88],
      nominalWeight: 16,
      objectives: [
        {
          id: "obj-3-6-1",
          code: "LO-U3.11",
          lessonId: "lesson-6",
          titleAr: "يحلل أثر تخصص الدفاتر المساعدة على الرقابة الداخلية، وإعادة بناء الحسابات وصياغة حكم مهني مدعوم بالأدلة.",
          taxonomy: "Evaluate",
          cognitiveDomain: "HIGHER_ORDER_ANALYSIS",
          targetDifficulty: "challenge",
          weightPercentage: 16,
          bookPageRef: 82,
          primaryMisconceptions: [
            "افتراض أن زيادة عدد الدفاتر المساعدة تضمن تلقائياً منع الاحتيال دون الحاجة لإجراءات مطابقة دورية وفصل للمهام."
          ],
          conceptIds: ["concept-u3-bilal-jre-case", "concept-u3-internal-control-evidence"],
          isJRERequired: true,
          questionIds: ["U3-Q31", "U3-Q32", "U3-Q33", "U3-Q34", "U3-Q35", "U3-Q36"]
        }
      ],
      concepts: [
        { id: "concept-u3-bilal-jre-case", titleAr: "دراسة حالة استقصائية (محلات بلال)", relatedObjectiveIds: ["obj-3-6-1"] },
        { id: "concept-u3-internal-control-evidence", titleAr: "أدلة الرقابة الداخلية وحماية الأصول", relatedObjectiveIds: ["obj-3-6-1"] }
      ],
      skills: [
        { id: "skill-3-6-1", titleAr: "بناء مقال التفسير المحاسبي (JRE) وفق الأدلة", taxonomy: "Evaluate", relatedObjectiveIds: ["obj-3-6-1"] }
      ],
      questionIds: ["U3-Q31", "U3-Q32", "U3-Q33", "U3-Q34", "U3-Q35", "U3-Q36"]
    }
  ],
  questionIds: [
    "U3-Q01", "U3-Q02", "U3-Q03", "U3-Q04", "U3-Q05", "U3-Q06",
    "U3-Q07", "U3-Q08", "U3-Q09", "U3-Q10", "U3-Q11", "U3-Q12",
    "U3-Q13", "U3-Q14", "U3-Q15", "U3-Q16", "U3-Q17", "U3-Q18",
    "U3-Q19", "U3-Q20", "U3-Q21", "U3-Q22", "U3-Q23", "U3-Q24",
    "U3-Q25", "U3-Q26", "U3-Q27", "U3-Q28", "U3-Q29", "U3-Q30",
    "U3-Q31", "U3-Q32", "U3-Q33", "U3-Q34", "U3-Q35", "U3-Q36"
  ]
};
