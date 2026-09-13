import { UnitSpec } from './CurriculumModel';

export const CANONICAL_UNIT_4: UnitSpec = {
  id: "unit-4",
  unitNumber: 4,
  subjectCode: "ACC.U4",
  titleAr: "الوحدة الرابعة: ميزان المراجعة وتصحيح الأخطاء",
  descriptionAr: "إعداد ميزان المراجعة • الأخطاء المؤثرة وغير المؤثرة على التوازن • الحساب المعلق • قيود تصحيح الأخطاء • دراسة حالة زيد للتجارة • التفسير المدعوم بالأدلة JRE",
  totalNominalMarks: 100,
  lessons: [
    {
      id: "lesson-1",
      lessonNumber: 1,
      unitId: "unit-4",
      titleAr: "إعداد ميزان المراجعة",
      subtitleAr: "مفهوم ميزان المراجعة، أهدافه، وحدوده كأداة للتحقق من الدقة الحسابية",
      textbookPages: [89, 93],
      nominalWeight: 15,
      objectives: [
        {
          id: "obj-4-1-1",
          code: "LO-U4.1",
          lessonId: "lesson-1",
          titleAr: "يعرّف ميزان المراجعة ويحدد أهدافه الثلاثة الرئيسية.",
          taxonomy: "Remember",
          cognitiveDomain: "KNOWLEDGE",
          targetDifficulty: "basic",
          weightPercentage: 10,
          bookPageRef: 89,
          primaryMisconceptions: [
            "توازن ميزان المراجعة يعني بالضرورة صحة جميع الحسابات وخلوها من الأخطاء."
          ],
          conceptIds: ["concept-u4-trial-balance-purpose"],
          isJRERequired: false
        }
      ],
      concepts: [
        { id: "concept-u4-trial-balance-purpose", titleAr: "أهداف وحدود ميزان المراجعة", relatedObjectiveIds: ["obj-4-1-1"] }
      ],
      skills: [
        { id: "skill-4-1-1", titleAr: "إعداد ميزان المراجعة من أرصدة الأستاذ", taxonomy: "Apply", relatedObjectiveIds: ["obj-4-1-1"] }
      ]
    },
    {
      id: "lesson-2",
      lessonNumber: 2,
      unitId: "unit-4",
      titleAr: "الأخطاء المؤثرة على توازن ميزان المراجعة",
      subtitleAr: "التسجيل من جانب واحد، الترحيل غير المتساوي، وأخطاء النقل والجمع",
      textbookPages: [94, 97],
      nominalWeight: 15,
      objectives: [
        {
          id: "obj-4-2-1",
          code: "LO-U4.2",
          lessonId: "lesson-2",
          titleAr: "يميز الأخطاء المؤثرة على التوازن ويشرح سبب مضاعفة الخطأ عند النقل العكسي.",
          taxonomy: "Analyze",
          cognitiveDomain: "HIGHER_ORDER_ANALYSIS",
          targetDifficulty: "intermediate",
          weightPercentage: 10,
          bookPageRef: 94,
          primaryMisconceptions: [
            "جميع الأخطاء المحاسبية تؤدي لعدم توازن ميزان المراجعة."
          ],
          conceptIds: ["concept-u4-errors-affecting-balance"],
          isJRERequired: false
        }
      ],
      concepts: [
        { id: "concept-u4-errors-affecting-balance", titleAr: "الأخطاء المؤثرة على التوازن (ظاهرة)", relatedObjectiveIds: ["obj-4-2-1"] }
      ],
      skills: [
        { id: "skill-4-2-1", titleAr: "تحليل وتحديد الأخطاء التي تكسر توازن المعادلة", taxonomy: "Analyze", relatedObjectiveIds: ["obj-4-2-1"] }
      ]
    },
    {
      id: "lesson-3",
      lessonNumber: 3,
      unitId: "unit-4",
      titleAr: "الأخطاء غير المؤثرة على توازن ميزان المراجعة",
      subtitleAr: "السهو، أخطاء التوجيه المحاسبي، الأخطاء المتقابلة والمخاطر الخفية",
      textbookPages: [98, 102],
      nominalWeight: 20,
      objectives: [
        {
          id: "obj-4-3-1",
          code: "LO-U4.3",
          lessonId: "lesson-3",
          titleAr: "يفسر خطورة الأخطاء الخفية (غير المؤثرة) ولماذا تعطي إحساساً زائفاً بالدقة.",
          taxonomy: "Understand",
          cognitiveDomain: "KNOWLEDGE",
          targetDifficulty: "intermediate",
          weightPercentage: 10,
          bookPageRef: 98,
          primaryMisconceptions: [
            "توازن الميزان يعني عدم وجود خطأ توجيه محاسبي أو سهو."
          ],
          conceptIds: ["concept-u4-errors-not-affecting-balance", "concept-u4-omission-error"],
          isJRERequired: false
        }
      ],
      concepts: [
        { id: "concept-u4-errors-not-affecting-balance", titleAr: "الأخطاء غير المؤثرة (الخفية)", relatedObjectiveIds: ["obj-4-3-1"] },
        { id: "concept-u4-omission-error", titleAr: "خطأ السهو والتوجيه المحاسبي", relatedObjectiveIds: ["obj-4-3-1"] }
      ],
      skills: [
        { id: "skill-4-3-1", titleAr: "التمييز بين التساوي الحسابي والتمثيل الصادق", taxonomy: "Understand", relatedObjectiveIds: ["obj-4-3-1"] }
      ]
    },
    {
      id: "lesson-4",
      lessonNumber: 4,
      unitId: "unit-4",
      titleAr: "الحساب المعلق (Suspense Account)",
      subtitleAr: "كيفية سد الفجوة مؤقتاً عند عدم التوازن والجانب الصحيح لفتح الحساب",
      textbookPages: [103, 105],
      nominalWeight: 15,
      objectives: [
        {
          id: "obj-4-4-1",
          code: "LO-U4.4",
          lessonId: "lesson-4",
          titleAr: "يفتح حساباً معلقاً في الحالة الصحيحة لتسوية فرق الميزان مؤقتاً.",
          taxonomy: "Apply",
          cognitiveDomain: "APPLICATION",
          targetDifficulty: "intermediate",
          weightPercentage: 10,
          bookPageRef: 103,
          primaryMisconceptions: [
            "كل خطأ يُستخدم لتصحيحه الحساب المعلق (يُستخدم للمؤثرة فقط)."
          ],
          conceptIds: ["concept-u4-suspense-account"],
          isJRERequired: false
        }
      ],
      concepts: [
        { id: "concept-u4-suspense-account", titleAr: "الحساب المعلق (طبيعته المؤقتة)", relatedObjectiveIds: ["obj-4-4-1"] }
      ],
      skills: [
        { id: "skill-4-4-1", titleAr: "فتح حساب التسوية المعلق بقيمة الفرق", taxonomy: "Apply", relatedObjectiveIds: ["obj-4-4-1"] }
      ]
    },
    {
      id: "lesson-5",
      lessonNumber: 5,
      unitId: "unit-4",
      titleAr: "قيود تصحيح الأخطاء والتطبيق المتكامل",
      subtitleAr: "إجراء قيود اليومية التصحيحية، وإقفال الحساب المعلق، ودراسة حالة زيد للتجارة",
      textbookPages: [106, 110],
      nominalWeight: 20,
      objectives: [
        {
          id: "obj-4-5-1",
          code: "LO-U4.5",
          lessonId: "lesson-5",
          titleAr: "يسجل قيوداً تصحيحية بأنواع الأخطاء المختلفة ويعد ميزان مراجعة معدلاً.",
          taxonomy: "Apply",
          cognitiveDomain: "APPLICATION",
          targetDifficulty: "advanced",
          weightPercentage: 10,
          bookPageRef: 106,
          primaryMisconceptions: [
            "قيد التصحيح يعتمد على حفظ القاعدة وليس تحليل القيد الأصلي والقيد الفعلي."
          ],
          conceptIds: ["concept-u4-correcting-entries", "concept-u4-zaid-case"],
          isJRERequired: false
        }
      ],
      concepts: [
        { id: "concept-u4-correcting-entries", titleAr: "قيود التسوية والتصحيح المباشر وغير المباشر", relatedObjectiveIds: ["obj-4-5-1"] },
        { id: "concept-u4-zaid-case", titleAr: "تطبيق متكامل: شركة زيد", relatedObjectiveIds: ["obj-4-5-1"] }
      ],
      skills: [
        { id: "skill-4-5-1", titleAr: "معالجة الأخطاء المحاسبية بكافة أنواعها وإعداد ميزان معدل", taxonomy: "Apply", relatedObjectiveIds: ["obj-4-5-1"] }
      ]
    },
    {
      id: "lesson-6",
      lessonNumber: 6,
      unitId: "unit-4",
      titleAr: "التفسير المدعوم بالأدلة JRE",
      subtitleAr: "التوازن ≠ المصداقية: هل يعيد تصحيح الأخطاء المصداقية للقوائم المالية أم التوازن الحسابي فقط؟",
      textbookPages: [111, 115],
      nominalWeight: 15,
      objectives: [
        {
          id: "obj-4-6-1",
          code: "LO-U4.6",
          lessonId: "lesson-6",
          titleAr: "يقيّم نقديًا دور ميزان المراجعة وتصحيح الأخطاء في ضمان مصداقية القوائم المالية.",
          taxonomy: "Evaluate",
          cognitiveDomain: "HIGHER_ORDER_ANALYSIS",
          targetDifficulty: "challenge",
          weightPercentage: 10,
          bookPageRef: 111,
          primaryMisconceptions: [
            "تساوي طرفي ميزان المراجعة دليل قاطع على عدم وجود أخطاء في القوائم المالية."
          ],
          conceptIds: ["concept-u4-jre-balance-vs-credibility"],
          isJRERequired: true
        }
      ],
      concepts: [
        { id: "concept-u4-jre-balance-vs-credibility", titleAr: "المصداقية مقابل الدقة الحسابية", relatedObjectiveIds: ["obj-4-6-1"] }
      ],
      skills: [
        { id: "skill-4-6-1", titleAr: "بناء حجة JRE حول حدود نظام القيد المزدوج", taxonomy: "Evaluate", relatedObjectiveIds: ["obj-4-6-1"] }
      ]
    }
  ]
};
