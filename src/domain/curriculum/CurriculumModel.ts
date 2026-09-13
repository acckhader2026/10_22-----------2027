/**
 * Canonical Egyptian Baccalaureate (EB) Curriculum & Blueprint Architecture
 * Single Source of Truth for Financial Accounting (Units 1 & 2)
 */

export type TaxonomyLevel = 'Remember' | 'Understand' | 'Apply' | 'Analyze' | 'Evaluate' | 'Create';
export type CognitiveDomain = 'KNOWLEDGE' | 'APPLICATION' | 'HIGHER_ORDER_ANALYSIS';
export type QuestionDifficulty = 'basic' | 'intermediate' | 'advanced' | 'challenge';
export type CanonicalQuestionType = 
  | 'mcq'
  | 'true_false'
  | 'fill_blank'
  | 'concept'
  | 'applied'
  | 'case'
  | 'analytical'
  | 'jre'
  | 't_account';

export interface ConceptSpec {
  id: string;
  titleAr: string;
  relatedObjectiveIds: string[];
}

export interface SkillSpec {
  id: string;
  titleAr: string;
  taxonomy: string;
  relatedObjectiveIds: string[];
}

export interface LearningObjectiveSpec {
  id: string;
  code: string;
  lessonId: string;
  titleAr: string;
  taxonomy: TaxonomyLevel;
  cognitiveDomain: CognitiveDomain;
  targetDifficulty: QuestionDifficulty;
  weightPercentage: number;
  bookPageRef: number;
  primaryMisconceptions: string[];
  conceptIds: string[];
  isJRERequired: boolean;
  questionIds?: string[];
}

export interface LessonSpec {
  id: string;
  lessonNumber: number;
  unitId: string;
  titleAr: string;
  subtitleAr: string;
  textbookPages: [number, number];
  nominalWeight: number;
  objectives: LearningObjectiveSpec[];
  concepts?: ConceptSpec[];
  skills?: SkillSpec[];
  questionIds?: string[];
  reviewItemIds?: string[];
  hasExercises?: boolean;
  legacyContentRef?: string;
}

export interface UnitSpec {
  id: string;
  unitNumber?: number;
  subjectCode?: string;
  titleAr: string;
  descriptionAr: string;
  totalNominalMarks?: number;
  lessons: LessonSpec[];
  questionIds?: string[];
  reviewItemIds?: string[];
}

export const CANONICAL_UNIT_1: UnitSpec = {
  "id": "unit-1",
  "unitNumber": 1,
  "subjectCode": "ACC-EB-SEC3",
  "titleAr": "الوحدة الأولى: لماذا نتعلم المحاسبة؟",
  "descriptionAr": "الأسس والمفاهيم المحاسبية، المعادلة المالية، القيد المزدوج، دفتر الأستاذ وميزان المراجعة، الحسابات الختامية، ومقال التفسير JRE.",
  "totalNominalMarks": 100,
  "lessons": [
    {
      "id": "lesson-1",
      "lessonNumber": 1,
      "unitId": "unit-1",
      "titleAr": "طبيعة المحاسبة والمبادئ الأساسية",
      "subtitleAr": "ماهية المحاسبة، مستخدمو المعلومات، الفروض والمبادئ المحاسبية الحاكمة، وأساس الاستحقاق مقابل الأساس النقدي",
      "textbookPages": [
        8,
        24
      ],
      "nominalWeight": 18,
      "objectives": [
        {
          "id": "obj-1-1",
          "code": "ACC.1.1",
          "lessonId": "lesson-1",
          "titleAr": "تعريف المحاسبة المالية ونظام المعلومات وتحديد الأطراف المستفيدة داخلياً وخارجياً",
          "taxonomy": "Remember",
          "cognitiveDomain": "KNOWLEDGE",
          "targetDifficulty": "basic",
          "weightPercentage": 4,
          "bookPageRef": 8,
          "primaryMisconceptions": [
            "حصر دور المحاسبة في مجرد التسجيل الدفتري وإغفال دورها التفسيري والرقابي"
          ],
          "conceptIds": [
            "concept-unit-1-1",
            "concept-unit-1-2",
            "concept-unit-1-3"
          ],
          "isJRERequired": false,
          "questionIds": [
            "eb-mcq-001",
            "eb-tf-001",
            "eb-mcq-043"
          ]
        },
        {
          "id": "obj-1-2",
          "code": "ACC.1.2",
          "lessonId": "lesson-1",
          "titleAr": "شرح وتطبيق الفروض المحاسبية (الوحدة المحاسبية، الاستمرارية، الدورية، وحدة القياس النقدي)",
          "taxonomy": "Understand",
          "cognitiveDomain": "KNOWLEDGE",
          "targetDifficulty": "intermediate",
          "weightPercentage": 4,
          "bookPageRef": 12,
          "primaryMisconceptions": [
            "خلط الذمة المالية للمالك مع الذمة المالية المستقلة للمنشأة"
          ],
          "conceptIds": [
            "concept-unit-1-4",
            "concept-unit-1-5",
            "concept-unit-1-6"
          ],
          "isJRERequired": false,
          "questionIds": [
            "eb-mcq-002",
            "eb-mcq-031",
            "eb-tf-011"
          ]
        },
        {
          "id": "obj-1-3",
          "code": "ACC.1.3",
          "lessonId": "lesson-1",
          "titleAr": "تحليل المبادئ المحاسبية الأساسية (التكلفة التاريخية، الحيطة والحذر، الثبات، الإفصاح)",
          "taxonomy": "Analyze",
          "cognitiveDomain": "HIGHER_ORDER_ANALYSIS",
          "targetDifficulty": "advanced",
          "weightPercentage": 5,
          "bookPageRef": 16,
          "primaryMisconceptions": [
            "تسجيل الأرباح المتوقعة في الدفاتر قبل تحققها الفعلي"
          ],
          "conceptIds": [
            "concept-unit-1-7",
            "concept-unit-1-8",
            "concept-unit-1-9"
          ],
          "isJRERequired": true,
          "questionIds": [
            "eb-mcq-003",
            "eb-mcq-004",
            "eb-mcq-006",
            "eb-mcq-007",
            "eb-mcq-008",
            "eb-mcq-009",
            "eb-mcq-010",
            "eb-mcq-032",
            "eb-mcq-033",
            "eb-tf-009",
            "eb-fill-001",
            "eb-mcq-044",
            "eb-tf-012",
            "eb-case-001",
            "eb-applied-003"
          ]
        },
        {
          "id": "obj-1-4",
          "code": "ACC.1.4",
          "lessonId": "lesson-1",
          "titleAr": "المقارنة بين أساس الاستحقاق والأساس النقدي في قياس الأرباح وتطبيق مبدأ المقابلة",
          "taxonomy": "Analyze",
          "cognitiveDomain": "HIGHER_ORDER_ANALYSIS",
          "targetDifficulty": "advanced",
          "weightPercentage": 5,
          "bookPageRef": 20,
          "primaryMisconceptions": [
            "ربط تحقق الإيراد أو تحميل المصروف بلحظة القبض أو الدفع النقدي الفعلي"
          ],
          "conceptIds": [
            "concept-unit-1-10",
            "concept-unit-1-11",
            "concept-unit-1-12",
            "concept-unit-1-13"
          ],
          "isJRERequired": true,
          "questionIds": [
            "eb-mcq-005",
            "eb-tf-002",
            "eb-ana-001",
            "eb-applied-004"
          ]
        }
      ],
      "concepts": [
        {
          "id": "concept-unit-1-1",
          "titleAr": "نظام المعلومات المحاسبي",
          "relatedObjectiveIds": [
            "obj-1-1"
          ]
        },
        {
          "id": "concept-unit-1-2",
          "titleAr": "المستخدم الداخلي",
          "relatedObjectiveIds": [
            "obj-1-1"
          ]
        },
        {
          "id": "concept-unit-1-3",
          "titleAr": "المستخدم الخارجي",
          "relatedObjectiveIds": [
            "obj-1-1"
          ]
        },
        {
          "id": "concept-unit-1-4",
          "titleAr": "الشخصية المعنوية المستقلة",
          "relatedObjectiveIds": [
            "obj-1-2"
          ]
        },
        {
          "id": "concept-unit-1-5",
          "titleAr": "الاستمرارية",
          "relatedObjectiveIds": [
            "obj-1-2"
          ]
        },
        {
          "id": "concept-unit-1-6",
          "titleAr": "الدورية المحاسبية",
          "relatedObjectiveIds": [
            "obj-1-2"
          ]
        },
        {
          "id": "concept-unit-1-7",
          "titleAr": "مبدأ الحيطة والحذر (التحفظ)",
          "relatedObjectiveIds": [
            "obj-1-3"
          ]
        },
        {
          "id": "concept-unit-1-8",
          "titleAr": "التكلفة التاريخية",
          "relatedObjectiveIds": [
            "obj-1-3"
          ]
        },
        {
          "id": "concept-unit-1-9",
          "titleAr": "مبدأ الثبات",
          "relatedObjectiveIds": [
            "obj-1-3"
          ]
        },
        {
          "id": "concept-unit-1-10",
          "titleAr": "مبدأ المقابلة",
          "relatedObjectiveIds": [
            "obj-1-4"
          ]
        },
        {
          "id": "concept-unit-1-11",
          "titleAr": "أساس الاستحقاق",
          "relatedObjectiveIds": [
            "obj-1-4"
          ]
        },
        {
          "id": "concept-unit-1-12",
          "titleAr": "الأساس النقدي",
          "relatedObjectiveIds": [
            "obj-1-4"
          ]
        },
        {
          "id": "concept-unit-1-13",
          "titleAr": "المصروف المقدم والمستحق",
          "relatedObjectiveIds": [
            "obj-1-4"
          ]
        }
      ],
      "skills": [
        {
          "id": "skill-unit-1-1",
          "titleAr": "تحديد هل المعاملة مالية ولها أثر نقدي.",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-1-1",
            "obj-1-2",
            "obj-1-3",
            "obj-1-4"
          ]
        },
        {
          "id": "skill-unit-1-2",
          "titleAr": "تسجيل المعاملة بالمستند المؤيد لها.",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-1-1",
            "obj-1-2",
            "obj-1-3",
            "obj-1-4"
          ]
        },
        {
          "id": "skill-unit-1-3",
          "titleAr": "تلخيص المعاملات للإجابة عن الأسئلة الثلاثة.",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-1-1",
            "obj-1-2",
            "obj-1-3",
            "obj-1-4"
          ]
        },
        {
          "id": "skill-unit-1-4",
          "titleAr": "تحديد الطرف الطالب للمعلومة.",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-1-1",
            "obj-1-2",
            "obj-1-3",
            "obj-1-4"
          ]
        },
        {
          "id": "skill-unit-1-5",
          "titleAr": "معرفة القرار المستهدف (منح قرض، شراء أسهم، فرض ضريبة، تقدير مكافآت).",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-1-1",
            "obj-1-2",
            "obj-1-3",
            "obj-1-4"
          ]
        },
        {
          "id": "skill-unit-1-6",
          "titleAr": "تقديم القوائم المالية التي تلبي متطلبات التحليل المالي الخاص به.",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-1-1",
            "obj-1-2",
            "obj-1-3",
            "obj-1-4"
          ]
        },
        {
          "id": "skill-unit-1-7",
          "titleAr": "تطبيق مبدأ الحيطة والحذر: الاعتراف بالخسائر المتوقعة فوراً وعدم الاعتراف بالأرباح إلا بعد تحققها الفعلي.",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-1-1",
            "obj-1-2",
            "obj-1-3",
            "obj-1-4"
          ]
        },
        {
          "id": "skill-unit-1-8",
          "titleAr": "تطبيق مبدأ المقابلة: تحميل إيرادات الفترة بكافة المصروفات التي ساهمت في تحقيقها.",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-1-1",
            "obj-1-2",
            "obj-1-3",
            "obj-1-4"
          ]
        },
        {
          "id": "skill-unit-1-9",
          "titleAr": "تطبيق مبدأ الثبات: استخدام نفس الطرق المحاسبية (مثل طريقة الإهلاك أو تقييم المخزون) من سنة لأخرى.",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-1-1",
            "obj-1-2",
            "obj-1-3",
            "obj-1-4"
          ]
        },
        {
          "id": "skill-unit-1-10",
          "titleAr": "إذا بيعت بضاعة بالأجل في ديسمبر 2025 وتم التحصيل في يناير 2026: يسجل الإيراد في 2025 طبقاً للاستحقاق، بينما يسجل في 2026 طبقاً للنقدي.",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-1-1",
            "obj-1-2",
            "obj-1-3",
            "obj-1-4"
          ]
        },
        {
          "id": "skill-unit-1-11",
          "titleAr": "إذا دُفع إيجار 3 سنوات مقدماً: يوزع الإيجار على السنوات الثلاث طبقاً للاستحقاق، بينما يخصم كاملاً في سنة الدفع طبقاً للنقدي.",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-1-1",
            "obj-1-2",
            "obj-1-3",
            "obj-1-4"
          ]
        }
      ],
      "questionIds": [
        "eb-mcq-001",
        "eb-mcq-002",
        "eb-mcq-003",
        "eb-mcq-004",
        "eb-mcq-005",
        "eb-mcq-006",
        "eb-mcq-007",
        "eb-mcq-008",
        "eb-mcq-009",
        "eb-mcq-010",
        "eb-mcq-031",
        "eb-mcq-032",
        "eb-mcq-033",
        "eb-tf-001",
        "eb-tf-002",
        "eb-tf-009",
        "eb-fill-001",
        "eb-mcq-043",
        "eb-mcq-044",
        "eb-tf-011",
        "eb-tf-012",
        "eb-case-001",
        "eb-ana-001",
        "eb-applied-003",
        "eb-applied-004"
      ],
      "reviewItemIds": [
        
        "u1-outcome-1",
        
        "u1-step-1",
        
        "maryam-step-1",
        
        "err-1"

      ],
      "hasExercises": true,
      "legacyContentRef": "lesson-1"
    },
    {
      "id": "lesson-2",
      "lessonNumber": 2,
      "unitId": "unit-1",
      "titleAr": "المعادلة المحاسبية الأساسية وأثر العمليات المالية",
      "subtitleAr": "هيكل المركز المالي، الأصول والخصوم وحقوق الملكية، وتحليل أثر المعاملات على توازن المعادلة",
      "textbookPages": [
        25,
        42
      ],
      "nominalWeight": 18,
      "objectives": [
        {
          "id": "obj-2-1",
          "code": "ACC.2.1",
          "lessonId": "lesson-2",
          "titleAr": "صياغة المعادلة المحاسبية وتصنيف عناصر المركز المالي (أصول، التزامات، حقوق ملكية)",
          "taxonomy": "Understand",
          "cognitiveDomain": "KNOWLEDGE",
          "targetDifficulty": "basic",
          "weightPercentage": 4,
          "bookPageRef": 25,
          "primaryMisconceptions": [
            "تصنيف القروض كأصل نظراً لدخول النقدية إلى الخزينة"
          ],
          "conceptIds": [
            "concept-unit-1-14",
            "concept-unit-1-15",
            "concept-unit-1-16"
          ],
          "isJRERequired": false,
          "questionIds": [
            "eb-mcq-011",
            "eb-tf-003",
            "eb-fill-002",
            "eb-mcq-045",
            "eb-applied-005"
          ]
        },
        {
          "id": "obj-2-2",
          "code": "ACC.2.2",
          "lessonId": "lesson-2",
          "titleAr": "تحليل العمليات المالية على طرفي المعادلة (زيادة أصل ونقص آخر، زيادة أصل وزيادة التزام)",
          "taxonomy": "Apply",
          "cognitiveDomain": "APPLICATION",
          "targetDifficulty": "intermediate",
          "weightPercentage": 7,
          "bookPageRef": 30,
          "primaryMisconceptions": [
            "نسيان أن مسحوبات المالك تخفض حقوق الملكية ولا تعد مصروفاً تشغيلياً"
          ],
          "conceptIds": [
            "concept-unit-1-17",
            "concept-unit-1-18",
            "concept-unit-1-19"
          ],
          "isJRERequired": false,
          "questionIds": [
            "eb-mcq-012",
            "eb-mcq-034",
            "eb-mcq-035",
            "eb-mcq-046",
            "eb-tf-013",
            "eb-applied-007",
            "eb-case-002"
          ]
        },
        {
          "id": "obj-2-3",
          "code": "ACC.2.3",
          "lessonId": "lesson-2",
          "titleAr": "حساب رأس المال الختامي وصافي حقوق الملكية بالمعادلة الموسعة",
          "taxonomy": "Apply",
          "cognitiveDomain": "APPLICATION",
          "targetDifficulty": "advanced",
          "weightPercentage": 7,
          "bookPageRef": 38,
          "primaryMisconceptions": [
            "الخطأ في حساب رأس المال آخر المدة = أول المدة + الأرباح - المسحوبات + الاستثمارات الإضافية"
          ],
          "conceptIds": [
            "concept-unit-1-20",
            "concept-unit-1-21",
            "concept-unit-1-22"
          ],
          "isJRERequired": false,
          "questionIds": [
            "eb-mcq-013",
            "eb-mcq-014",
            "eb-mcq-015",
            "eb-mcq-036",
            "eb-tf-004",
            "eb-tf-010",
            "eb-applied-006"
          ]
        }
      ],
      "concepts": [
        {
          "id": "concept-unit-1-14",
          "titleAr": "الأصول المتداولة وغير المتداولة",
          "relatedObjectiveIds": [
            "obj-2-1"
          ]
        },
        {
          "id": "concept-unit-1-15",
          "titleAr": "الالتزامات",
          "relatedObjectiveIds": [
            "obj-2-1"
          ]
        },
        {
          "id": "concept-unit-1-16",
          "titleAr": "رأس المال",
          "relatedObjectiveIds": [
            "obj-2-1"
          ]
        },
        {
          "id": "concept-unit-1-17",
          "titleAr": "أثر العمليات المتزامنة",
          "relatedObjectiveIds": [
            "obj-2-2"
          ]
        },
        {
          "id": "concept-unit-1-18",
          "titleAr": "المسحوبات الشخصية",
          "relatedObjectiveIds": [
            "obj-2-2"
          ]
        },
        {
          "id": "concept-unit-1-19",
          "titleAr": "التوازن الرياضي",
          "relatedObjectiveIds": [
            "obj-2-2"
          ]
        },
        {
          "id": "concept-unit-1-20",
          "titleAr": "معادلة حقوق الملكية الموسعة",
          "relatedObjectiveIds": [
            "obj-2-3"
          ]
        },
        {
          "id": "concept-unit-1-21",
          "titleAr": "صافي الربح",
          "relatedObjectiveIds": [
            "obj-2-3"
          ]
        },
        {
          "id": "concept-unit-1-22",
          "titleAr": "التغير في حقوق الملكية",
          "relatedObjectiveIds": [
            "obj-2-3"
          ]
        }
      ],
      "skills": [
        {
          "id": "skill-unit-1-12",
          "titleAr": "تحديد ممتلكات المنشأة وتقييمها نقدياً كأصول.",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-2-1",
            "obj-2-2",
            "obj-2-3"
          ]
        },
        {
          "id": "skill-unit-1-13",
          "titleAr": "حصر التزامات المنشأة القانونية والتعاقدية كخصوم.",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-2-1",
            "obj-2-2",
            "obj-2-3"
          ]
        },
        {
          "id": "skill-unit-1-14",
          "titleAr": "استنتاج صافي حقوق المالك بالمعادلة: حقوق الملكية = الأصول - الخصوم.",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-2-1",
            "obj-2-2",
            "obj-2-3"
          ]
        },
        {
          "id": "skill-unit-1-15",
          "titleAr": "تحديد الحسابين المتأثرين بالمعاملة.",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-2-1",
            "obj-2-2",
            "obj-2-3"
          ]
        },
        {
          "id": "skill-unit-1-16",
          "titleAr": "تحديد نوع كل حساب (أصل، خصم، حق ملكية).",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-2-1",
            "obj-2-2",
            "obj-2-3"
          ]
        },
        {
          "id": "skill-unit-1-17",
          "titleAr": "تحديد اتجاه التغير (زيادة أو نقص) والتحقق من بقاء المجموعين متطابقين.",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-2-1",
            "obj-2-2",
            "obj-2-3"
          ]
        }
      ],
      "questionIds": [
        "eb-mcq-011",
        "eb-mcq-012",
        "eb-mcq-013",
        "eb-mcq-014",
        "eb-mcq-015",
        "eb-mcq-016",
        "eb-mcq-034",
        "eb-mcq-035",
        "eb-mcq-036",
        "eb-tf-003",
        "eb-tf-004",
        "eb-tf-010",
        "eb-fill-002",
        "eb-app-001",
        "eb-mcq-045",
        "eb-mcq-046",
        "eb-mcq-047",
        "eb-tf-013",
        "eb-applied-005",
        "eb-applied-006",
        "eb-applied-007",
        "eb-case-002",
        "eb-ana-002"
      ],
      "reviewItemIds": [
        
        "u1-outcome-2",
        
        "u1-step-2",
        
        "maryam-step-2",
        
        "err-2"

      ],
      "hasExercises": true,
      "legacyContentRef": "lesson-2"
    },
    {
      "id": "lesson-3",
      "lessonNumber": 3,
      "unitId": "unit-1",
      "titleAr": "نظرية القيد المزدوج وقواعد المدين والدائن",
      "subtitleAr": "قاعدة باتشولي، طبيعة الحسابات، قيود اليومية البسيطة والمركبة، والدورة المستندية",
      "textbookPages": [
        43,
        62
      ],
      "nominalWeight": 18,
      "objectives": [
        {
          "id": "obj-3-1",
          "code": "ACC.3.1",
          "lessonId": "lesson-3",
          "titleAr": "فهم نظرية القيد المزدوج وتحديد الطرف الآخذ والطرف العاطي",
          "taxonomy": "Understand",
          "cognitiveDomain": "KNOWLEDGE",
          "targetDifficulty": "basic",
          "weightPercentage": 4,
          "bookPageRef": 43,
          "primaryMisconceptions": [
            "افتراض أن المدين إيجابي والدائن سلبي دائماً"
          ],
          "conceptIds": [
            "concept-unit-1-23",
            "concept-unit-1-24",
            "concept-unit-1-25"
          ],
          "isJRERequired": false,
          "questionIds": [
            "eb-mcq-017",
            "eb-mcq-048",
            "eb-tf-014",
            "eb-ana-003"
          ]
        },
        {
          "id": "obj-3-2",
          "code": "ACC.3.2",
          "lessonId": "lesson-3",
          "titleAr": "إعداد قيود اليومية للعمليات الرأسمالية والتمويلية (تكوين رأس المال، القروض، شراء الأصول)",
          "taxonomy": "Apply",
          "cognitiveDomain": "APPLICATION",
          "targetDifficulty": "intermediate",
          "weightPercentage": 7,
          "bookPageRef": 48,
          "primaryMisconceptions": [
            "الخلط بين شراء أصل ثابت للاستخدام وتسجيله كمشتريات بضاعة"
          ],
          "conceptIds": [
            "concept-unit-1-26",
            "concept-unit-1-27",
            "concept-unit-1-28"
          ],
          "isJRERequired": false,
          "questionIds": [
            "eb-mcq-018",
            "eb-mcq-037",
            "eb-tf-005",
            "eb-fill-003",
            "eb-mcq-049",
            "eb-applied-009",
            "eb-jre-003"
          ]
        },
        {
          "id": "obj-3-3",
          "code": "ACC.3.3",
          "lessonId": "lesson-3",
          "titleAr": "إعداد قيود العمليات الإيرادية (المشتريات، المبيعات، مردوداتها، المصروفات، والإيرادات)",
          "taxonomy": "Apply",
          "cognitiveDomain": "APPLICATION",
          "targetDifficulty": "intermediate",
          "weightPercentage": 7,
          "bookPageRef": 54,
          "primaryMisconceptions": [
            "تسجيل المبيعات الآجلة كدائنين بدلاً من مدينين (عملاء)"
          ],
          "conceptIds": [
            "concept-unit-1-29",
            "concept-unit-1-30",
            "concept-unit-1-31",
            "concept-unit-1-32"
          ],
          "isJRERequired": false,
          "questionIds": [
            "eb-mcq-019",
            "eb-mcq-020",
            "eb-mcq-038",
            "eb-mcq-039",
            "eb-mcq-050",
            "eb-applied-008",
            "eb-case-003"
          ]
        }
      ],
      "concepts": [
        {
          "id": "concept-unit-1-23",
          "titleAr": "القيد المزدوج",
          "relatedObjectiveIds": [
            "obj-3-1"
          ]
        },
        {
          "id": "concept-unit-1-24",
          "titleAr": "الطرف المدين (من حـ/)",
          "relatedObjectiveIds": [
            "obj-3-1"
          ]
        },
        {
          "id": "concept-unit-1-25",
          "titleAr": "الطرف الدائن (إلى حـ/)",
          "relatedObjectiveIds": [
            "obj-3-1"
          ]
        },
        {
          "id": "concept-unit-1-26",
          "titleAr": "قيود التأسيس",
          "relatedObjectiveIds": [
            "obj-3-2"
          ]
        },
        {
          "id": "concept-unit-1-27",
          "titleAr": "الأصول الثابتة",
          "relatedObjectiveIds": [
            "obj-3-2"
          ]
        },
        {
          "id": "concept-unit-1-28",
          "titleAr": "القيود البسيطة والمركبة",
          "relatedObjectiveIds": [
            "obj-3-2"
          ]
        },
        {
          "id": "concept-unit-1-29",
          "titleAr": "حساب المبيعات",
          "relatedObjectiveIds": [
            "obj-3-3"
          ]
        },
        {
          "id": "concept-unit-1-30",
          "titleAr": "حساب المشتريات",
          "relatedObjectiveIds": [
            "obj-3-3"
          ]
        },
        {
          "id": "concept-unit-1-31",
          "titleAr": "المردودات",
          "relatedObjectiveIds": [
            "obj-3-3"
          ]
        },
        {
          "id": "concept-unit-1-32",
          "titleAr": "المصروفات",
          "relatedObjectiveIds": [
            "obj-3-3"
          ]
        }
      ],
      "skills": [
        {
          "id": "skill-unit-1-18",
          "titleAr": "تحليل المعاملة: ماذا استلمت المنشأة؟ ومن أين جاء التمويل؟",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-3-1",
            "obj-3-2",
            "obj-3-3"
          ]
        },
        {
          "id": "skill-unit-1-19",
          "titleAr": "تحديد الحساب الآخذ (المدين) والحساب العاطي أو مصدر التمويل (الدائن).",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-3-1",
            "obj-3-2",
            "obj-3-3"
          ]
        },
        {
          "id": "skill-unit-1-20",
          "titleAr": "التأكد من تساوي مجموع المبالغ المدينة مع مجموع المبالغ الدائنة.",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-3-1",
            "obj-3-2",
            "obj-3-3"
          ]
        },
        {
          "id": "skill-unit-1-21",
          "titleAr": "1. حدد نوع الحساب من بين الفئات الخمس (أصل، خصم، ملكية، إيراد، مصروف).",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-3-1",
            "obj-3-2",
            "obj-3-3"
          ]
        },
        {
          "id": "skill-unit-1-22",
          "titleAr": "2. حدد هل الحساب في هذه العملية زاد أم نقص؟",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-3-1",
            "obj-3-2",
            "obj-3-3"
          ]
        },
        {
          "id": "skill-unit-1-23",
          "titleAr": "3. طبق القاعدة: الزيادة مع الطبيعة، والنقصان عكس الطبيعة.",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-3-1",
            "obj-3-2",
            "obj-3-3"
          ]
        },
        {
          "id": "skill-unit-1-24",
          "titleAr": "رسم شكل T وكتابة اسم الحساب في الأعلى.",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-3-1",
            "obj-3-2",
            "obj-3-3"
          ]
        },
        {
          "id": "skill-unit-1-25",
          "titleAr": "تسجيل المبالغ المدينة في الجانب الأيمن، والمبالغ الدائنة في الجانب الأيسر مع الإشارة للطرف المقابل.",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-3-1",
            "obj-3-2",
            "obj-3-3"
          ]
        },
        {
          "id": "skill-unit-1-26",
          "titleAr": "جمع الجانبين في نهاية الفترة، ووضع المجموع الأكبر في خانة الإجمالي بكلا الجانبين.",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-3-1",
            "obj-3-2",
            "obj-3-3"
          ]
        },
        {
          "id": "skill-unit-1-27",
          "titleAr": "حساب الفرق ووضعه في الجانب الأصغر كـ \"رصيد مرحل\"، ثم نقله للجانب الطبيعي كـ \"رصيد منقول\".",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-3-1",
            "obj-3-2",
            "obj-3-3"
          ]
        }
      ],
      "questionIds": [
        "eb-mcq-017",
        "eb-mcq-018",
        "eb-mcq-019",
        "eb-mcq-020",
        "eb-mcq-021",
        "eb-mcq-037",
        "eb-mcq-038",
        "eb-mcq-039",
        "eb-tf-005",
        "eb-fill-003",
        "eb-mcq-048",
        "eb-mcq-049",
        "eb-mcq-050",
        "eb-tf-014",
        "eb-applied-008",
        "eb-applied-009",
        "eb-applied-010",
        "eb-case-003",
        "eb-ana-003",
        "eb-jre-003"
      ],
      "reviewItemIds": [
        
        "u1-outcome-3",
        
        "u1-step-3",
        
        "maryam-step-3",
        
        "err-3",
        
        "JRE-1-01"

      ],
      "hasExercises": true,
      "legacyContentRef": "lesson-3"
    },
    {
      "id": "lesson-4",
      "lessonNumber": 4,
      "unitId": "unit-1",
      "titleAr": "دفتر الأستاذ وترصيد الحسابات وميزان المراجعة",
      "subtitleAr": "الترحيل لحسابات T، استخراج الأرصدة المدينة والدائنة، إعداد ميزان المراجعة، واكتشاف الأخطاء ومعالجتها بالحساب المعلق",
      "textbookPages": [
        63,
        82
      ],
      "nominalWeight": 18,
      "objectives": [
        {
          "id": "obj-4-1",
          "code": "ACC.4.1",
          "lessonId": "lesson-4",
          "titleAr": "الترحيل إلى دفتر الأستاذ بحرف T واستخراج الرصيد المرحل والمنقول",
          "taxonomy": "Apply",
          "cognitiveDomain": "APPLICATION",
          "targetDifficulty": "intermediate",
          "weightPercentage": 5,
          "bookPageRef": 63,
          "primaryMisconceptions": [
            "كتابة الرصيد المرحل في الجانب الأكبر بدلاً من الجانب الأقل كمتمم حسابي"
          ],
          "conceptIds": [
            "concept-unit-1-33",
            "concept-unit-1-34",
            "concept-unit-1-35"
          ],
          "isJRERequired": false,
          "questionIds": [
            "eb-mcq-022",
            "eb-mcq-051",
            "eb-t_account-002",
            "eb-t_account-003"
          ]
        },
        {
          "id": "obj-4-2",
          "code": "ACC.4.2",
          "lessonId": "lesson-4",
          "titleAr": "إعداد ميزان المراجعة بالمجاميع وبالأرصدة والتحقق من التوازن الحسابي",
          "taxonomy": "Apply",
          "cognitiveDomain": "APPLICATION",
          "targetDifficulty": "intermediate",
          "weightPercentage": 5,
          "bookPageRef": 70,
          "primaryMisconceptions": [
            "وضع حساب رأس المال في عمود الأرصدة المدينة"
          ],
          "conceptIds": [
            "concept-unit-1-36",
            "concept-unit-1-37"
          ],
          "isJRERequired": false,
          "questionIds": [
            "eb-mcq-023",
            "eb-mcq-040",
            "eb-tac-001",
            "eb-tf-015"
          ]
        },
        {
          "id": "obj-4-3",
          "code": "ACC.4.3",
          "lessonId": "lesson-4",
          "titleAr": "تصنيف الأخطاء المحاسبية (أخطاء تخل بالتوازن وأخطاء لا تخل) ومعالجة الفروق بالحساب المعلق",
          "taxonomy": "Analyze",
          "cognitiveDomain": "HIGHER_ORDER_ANALYSIS",
          "targetDifficulty": "advanced",
          "weightPercentage": 8,
          "bookPageRef": 75,
          "primaryMisconceptions": [
            "افتراض أن ميزان المراجعة يكشف خطأ السهو أو خطأ التوجيه المحاسبي"
          ],
          "conceptIds": [
            "concept-unit-1-38",
            "concept-unit-1-39",
            "concept-unit-1-40",
            "concept-unit-1-41"
          ],
          "isJRERequired": true,
          "questionIds": [
            "eb-mcq-024",
            "eb-fill-004",
            "eb-mcq-052",
            "eb-ana-004"
          ]
        }
      ],
      "concepts": [
        {
          "id": "concept-unit-1-33",
          "titleAr": "حساب الأستاذ T",
          "relatedObjectiveIds": [
            "obj-4-1"
          ]
        },
        {
          "id": "concept-unit-1-34",
          "titleAr": "الرصيد المرحل",
          "relatedObjectiveIds": [
            "obj-4-1"
          ]
        },
        {
          "id": "concept-unit-1-35",
          "titleAr": "الرصيد المنقول",
          "relatedObjectiveIds": [
            "obj-4-1"
          ]
        },
        {
          "id": "concept-unit-1-36",
          "titleAr": "ميزان المراجعة بالأرصدة",
          "relatedObjectiveIds": [
            "obj-4-2"
          ]
        },
        {
          "id": "concept-unit-1-37",
          "titleAr": "التوازن الحسابي",
          "relatedObjectiveIds": [
            "obj-4-2"
          ]
        },
        {
          "id": "concept-unit-1-38",
          "titleAr": "خطأ السهو",
          "relatedObjectiveIds": [
            "obj-4-3"
          ]
        },
        {
          "id": "concept-unit-1-39",
          "titleAr": "خطأ التوجيه",
          "relatedObjectiveIds": [
            "obj-4-3"
          ]
        },
        {
          "id": "concept-unit-1-40",
          "titleAr": "الأخطاء المتكافئة",
          "relatedObjectiveIds": [
            "obj-4-3"
          ]
        },
        {
          "id": "concept-unit-1-41",
          "titleAr": "الحساب المعلق (Suspense)",
          "relatedObjectiveIds": [
            "obj-4-3"
          ]
        }
      ],
      "skills": [
        {
          "id": "skill-unit-1-28",
          "titleAr": "ترصيد كافة حسابات الأستاذ واستخراج صافي أرصدتها.",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-4-1",
            "obj-4-2",
            "obj-4-3"
          ]
        },
        {
          "id": "skill-unit-1-29",
          "titleAr": "نقل الأرصدة المدينة للعمود المدين، والأرصدة الدائنة للعمود الدائن.",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-4-1",
            "obj-4-2",
            "obj-4-3"
          ]
        },
        {
          "id": "skill-unit-1-30",
          "titleAr": "جمع العمودين ومقارنة الإجماليين.",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-4-1",
            "obj-4-2",
            "obj-4-3"
          ]
        },
        {
          "id": "skill-unit-1-31",
          "titleAr": "إذا لم يتوازن الميزان: احسب الفرق وقسمه على 2 للبحث عن مبالغ رُحلت بالجانب العكسي.",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-4-1",
            "obj-4-2",
            "obj-4-3"
          ]
        },
        {
          "id": "skill-unit-1-32",
          "titleAr": "إذا توازن الميزان وظهرت شكوك: راجع المستندات الأصلية ومطابقة الحسابات وفصل المصروفات الإيرادية عن الرأسمالية.",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-4-1",
            "obj-4-2",
            "obj-4-3"
          ]
        },
        {
          "id": "skill-unit-1-33",
          "titleAr": "1. حساب الفرق بين المدين والدائن في ميزان المراجعة.",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-4-1",
            "obj-4-2",
            "obj-4-3"
          ]
        },
        {
          "id": "skill-unit-1-34",
          "titleAr": "2. وضع الحساب المعلق في الجانب الأصغر ليصبح الميزان متوازناً حسابياً.",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-4-1",
            "obj-4-2",
            "obj-4-3"
          ]
        },
        {
          "id": "skill-unit-1-35",
          "titleAr": "3. عند اكتشاف كل خطأ: جعل الحساب المعلق في الجانب العكسي لإنهاء رصيده، وتعديل الحساب الأصلي.",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-4-1",
            "obj-4-2",
            "obj-4-3"
          ]
        },
        {
          "id": "skill-unit-1-36",
          "titleAr": "4. بعد تصحيح جميع الأخطاء: يصبح رصيد الحساب المعلق صفراً ويُعد ميزان المراجعة المعدل.",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-4-1",
            "obj-4-2",
            "obj-4-3"
          ]
        }
      ],
      "questionIds": [
        "eb-mcq-022",
        "eb-mcq-023",
        "eb-mcq-024",
        "eb-mcq-025",
        "eb-mcq-040",
        "eb-tf-006",
        "eb-fill-004",
        "eb-tac-001",
        "eb-mcq-051",
        "eb-mcq-052",
        "eb-tf-015",
        "eb-t_account-002",
        "eb-t_account-003",
        "eb-applied-011",
        "eb-ana-004",
        "eb-case-004"
      ],
      "reviewItemIds": [
        
        "u1-outcome-4",
        
        "u1-step-4",
        
        "maryam-step-4",
        
        "err-4",
        
        "JRE-1-02"

      ],
      "hasExercises": true,
      "legacyContentRef": "lesson-4"
    },
    {
      "id": "lesson-5",
      "lessonNumber": 5,
      "unitId": "unit-1",
      "titleAr": "الحسابات الختامية وقائمة المركز المالي",
      "subtitleAr": "حساب المتاجرة، حساب الأرباح والخسائر، إقفال الدفاتر، وقائمة المركز المالي والميزانية العمومية المتوازنة",
      "textbookPages": [
        83,
        104
      ],
      "nominalWeight": 18,
      "objectives": [
        {
          "id": "obj-5-1",
          "code": "ACC.5.1",
          "lessonId": "lesson-5",
          "titleAr": "إعداد حساب المتاجرة وحساب تكلفة البضاعة المباعة واستخراج مجمل الربح / الخسارة",
          "taxonomy": "Apply",
          "cognitiveDomain": "APPLICATION",
          "targetDifficulty": "intermediate",
          "weightPercentage": 6,
          "bookPageRef": 83,
          "primaryMisconceptions": [
            "إدراج مخزون آخر المدة في الطرف المدين لحساب المتاجرة"
          ],
          "conceptIds": [
            "concept-unit-1-42",
            "concept-unit-1-43",
            "concept-unit-1-44"
          ],
          "isJRERequired": false,
          "questionIds": [
            "eb-mcq-026",
            "eb-tf-007",
            "eb-fill-005",
            "eb-app-002",
            "eb-mcq-053",
            "eb-applied-012",
            "eb-applied-013",
            "eb-jre-004"
          ]
        },
        {
          "id": "obj-5-2",
          "code": "ACC.5.2",
          "lessonId": "lesson-5",
          "titleAr": "إعداد حساب الأرباح والخسائر واستخراج صافي الربح / الخسارة النهائي للنشاط",
          "taxonomy": "Apply",
          "cognitiveDomain": "APPLICATION",
          "targetDifficulty": "intermediate",
          "weightPercentage": 6,
          "bookPageRef": 90,
          "primaryMisconceptions": [
            "إدراج المسحوبات الشخصية كمصروف في حساب الأرباح والخسائر"
          ],
          "conceptIds": [
            "concept-unit-1-45",
            "concept-unit-1-46",
            "concept-unit-1-47"
          ],
          "isJRERequired": false,
          "questionIds": [
            "eb-mcq-027",
            "eb-mcq-041",
            "eb-mcq-054",
            "eb-tf-016",
            "eb-applied-014",
            "eb-ana-005"
          ]
        },
        {
          "id": "obj-5-3",
          "code": "ACC.5.3",
          "lessonId": "lesson-5",
          "titleAr": "إعداد قائمة المركز المالي (الميزانية العمومية) مبوبة ومنضبطة وتطبيق معادلة التوازن",
          "taxonomy": "Apply",
          "cognitiveDomain": "APPLICATION",
          "targetDifficulty": "advanced",
          "weightPercentage": 6,
          "bookPageRef": 96,
          "primaryMisconceptions": [
            "إغفال ترحيل صافي الربح والمسحوبات لحقوق الملكية في الميزانية"
          ],
          "conceptIds": [
            "concept-unit-1-48",
            "concept-unit-1-49",
            "concept-unit-1-50"
          ],
          "isJRERequired": false,
          "questionIds": [
            "eb-mcq-028",
            "eb-mcq-042",
            "eb-case-005"
          ]
        }
      ],
      "concepts": [
        {
          "id": "concept-unit-1-42",
          "titleAr": "تكلفة البضاعة المباعة",
          "relatedObjectiveIds": [
            "obj-5-1"
          ]
        },
        {
          "id": "concept-unit-1-43",
          "titleAr": "مجمل الربح",
          "relatedObjectiveIds": [
            "obj-5-1"
          ]
        },
        {
          "id": "concept-unit-1-44",
          "titleAr": "مخزون أول وآخر المدة",
          "relatedObjectiveIds": [
            "obj-5-1"
          ]
        },
        {
          "id": "concept-unit-1-45",
          "titleAr": "المصروفات التشغيلية",
          "relatedObjectiveIds": [
            "obj-5-2"
          ]
        },
        {
          "id": "concept-unit-1-46",
          "titleAr": "صافي الربح",
          "relatedObjectiveIds": [
            "obj-5-2"
          ]
        },
        {
          "id": "concept-unit-1-47",
          "titleAr": "إقفال الحسابات",
          "relatedObjectiveIds": [
            "obj-5-2"
          ]
        },
        {
          "id": "concept-unit-1-48",
          "titleAr": "قائمة المركز المالي",
          "relatedObjectiveIds": [
            "obj-5-3"
          ]
        },
        {
          "id": "concept-unit-1-49",
          "titleAr": "حقوق الملكية الختامية",
          "relatedObjectiveIds": [
            "obj-5-3"
          ]
        },
        {
          "id": "concept-unit-1-50",
          "titleAr": "المعادلة المتوازنة",
          "relatedObjectiveIds": [
            "obj-5-3"
          ]
        }
      ],
      "skills": [
        {
          "id": "skill-unit-1-37",
          "titleAr": "1. حساب تكلفة البضاعة المباعة = مخزون أول المدة + المشتريات - مخزون آخر المدة.",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-5-1",
            "obj-5-2",
            "obj-5-3"
          ]
        },
        {
          "id": "skill-unit-1-38",
          "titleAr": "2. حساب مجمل الربح = إيراد المبيعات - تكلفة البضاعة المباعة.",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-5-1",
            "obj-5-2",
            "obj-5-3"
          ]
        },
        {
          "id": "skill-unit-1-39",
          "titleAr": "3. إقفال مجمل الربح وترحيله إلى حساب الأرباح والخسائر.",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-5-1",
            "obj-5-2",
            "obj-5-3"
          ]
        },
        {
          "id": "skill-unit-1-40",
          "titleAr": "نقل مجمل الربح من حساب المتاجرة إلى الجانب الدائن لحساب الأرباح والخسائر.",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-5-1",
            "obj-5-2",
            "obj-5-3"
          ]
        },
        {
          "id": "skill-unit-1-41",
          "titleAr": "إدراج كافة المصروفات التشغيلية (إيجار، رواتب، تأمين، مرافق، إهلاك، ديون) في الجانب المدين.",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-5-1",
            "obj-5-2",
            "obj-5-3"
          ]
        },
        {
          "id": "skill-unit-1-42",
          "titleAr": "حساب الفرق: صافي الربح = مجمل الربح - إجمالي المصروفات التشغيلية.",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-5-1",
            "obj-5-2",
            "obj-5-3"
          ]
        },
        {
          "id": "skill-unit-1-43",
          "titleAr": "تعديل رأس المال: [رأس المال آخر المدة = رأس المال أول المدة + صافي الربح - المسحوبات الشخصية].",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-5-1",
            "obj-5-2",
            "obj-5-3"
          ]
        },
        {
          "id": "skill-unit-1-44",
          "titleAr": "تبويب الأصول: متداولة (نقدية، مدينون، مخزون آخر المدة) وغير متداولة (معدات، مبانٍ).",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-5-1",
            "obj-5-2",
            "obj-5-3"
          ]
        },
        {
          "id": "skill-unit-1-45",
          "titleAr": "تبويب الخصوم: متداولة (دائنون، قروض قصيرة) وغير متداولة (قروض طويلة الأجل).",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-5-1",
            "obj-5-2",
            "obj-5-3"
          ]
        },
        {
          "id": "skill-unit-1-46",
          "titleAr": "التحقق الإلزامي من توازن القائمة: [إجمالي الأصول = إجمالي الخصوم وحقوق الملكية].",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-5-1",
            "obj-5-2",
            "obj-5-3"
          ]
        }
      ],
      "questionIds": [
        "eb-mcq-026",
        "eb-mcq-027",
        "eb-mcq-028",
        "eb-mcq-041",
        "eb-mcq-042",
        "eb-tf-007",
        "eb-fill-005",
        "eb-app-002",
        "eb-mcq-053",
        "eb-mcq-054",
        "eb-tf-016",
        "eb-applied-012",
        "eb-applied-013",
        "eb-applied-014",
        "eb-case-005",
        "eb-ana-005",
        "eb-jre-004"
      ],
      "reviewItemIds": [
        
        "u1-outcome-5",
        
        "u1-step-5",
        
        "maryam-step-5",
        
        "err-5"

      ],
      "hasExercises": true,
      "legacyContentRef": "lesson-5"
    },
    {
      "id": "lesson-6",
      "lessonNumber": 6,
      "unitId": "unit-1",
      "titleAr": "ورشة مقال التفسير المحاسبي المدعوم بالأدلة (JRE Masterclass)",
      "subtitleAr": "بناء الحجة المحاسبية الرصينة، نقد الادعاءات المالية، الاستناد للمبادئ، وسلم الـ Rubric الرسمي (20 درجة)",
      "textbookPages": [
        105,
        120
      ],
      "nominalWeight": 10,
      "objectives": [
        {
          "id": "obj-6-1",
          "code": "ACC.6.1",
          "lessonId": "lesson-6",
          "titleAr": "صياغة الحكم المحاسبي الصريح وتحديد الموقف المهني (Intellectual Framework)",
          "taxonomy": "Evaluate",
          "cognitiveDomain": "HIGHER_ORDER_ANALYSIS",
          "targetDifficulty": "advanced",
          "weightPercentage": 2,
          "bookPageRef": 105,
          "primaryMisconceptions": [
            "كتابة سرد إنشائي دون اتخاذ حكم مهني صريح"
          ],
          "conceptIds": [
            "concept-unit-1-51",
            "concept-unit-1-52"
          ],
          "isJRERequired": true,
          "questionIds": [
            "eb-mcq-029",
            "eb-tf-008",
            "eb-jre-001",
            "eb-mcq-055",
            "eb-mcq-057",
            "eb-t_account-004"
          ]
        },
        {
          "id": "obj-6-2",
          "code": "ACC.6.2",
          "lessonId": "lesson-6",
          "titleAr": "التحليل السببي والاستناد للمبادئ وتفنيد الحجة المضادة بالأدلة (JRE Deep Analysis & Rebuttal)",
          "taxonomy": "Evaluate",
          "cognitiveDomain": "HIGHER_ORDER_ANALYSIS",
          "targetDifficulty": "challenge",
          "weightPercentage": 8,
          "bookPageRef": 110,
          "primaryMisconceptions": [
            "تجاهل الرأي المعارض أو عدم تفنيده بمبدأ محاسبي دقيق"
          ],
          "conceptIds": [
            "concept-unit-1-53",
            "concept-unit-1-54",
            "concept-unit-1-55"
          ],
          "isJRERequired": true,
          "questionIds": [
            "eb-mcq-030",
            "eb-jre-002",
            "eb-mcq-056",
            "eb-case-006",
            "eb-jre-005"
          ]
        }
      ],
      "concepts": [
        {
          "id": "concept-unit-1-51",
          "titleAr": "الحكم المهني",
          "relatedObjectiveIds": [
            "obj-6-1"
          ]
        },
        {
          "id": "concept-unit-1-52",
          "titleAr": "تحديد القضية",
          "relatedObjectiveIds": [
            "obj-6-1"
          ]
        },
        {
          "id": "concept-unit-1-53",
          "titleAr": "الاستدلال المحاسبي",
          "relatedObjectiveIds": [
            "obj-6-2"
          ]
        },
        {
          "id": "concept-unit-1-54",
          "titleAr": "تفنيد الحجة المضادة",
          "relatedObjectiveIds": [
            "obj-6-2"
          ]
        },
        {
          "id": "concept-unit-1-55",
          "titleAr": "سلم الـ 20 درجة",
          "relatedObjectiveIds": [
            "obj-6-2"
          ]
        }
      ],
      "skills": [
        {
          "id": "skill-unit-1-47",
          "titleAr": "الخطوة 1: اقرأ السؤال ببطء وحدد الكلمات المفتاحية (قيّم – برر – قارن – هل تضمن؟).",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-6-1",
            "obj-6-2"
          ]
        },
        {
          "id": "skill-unit-1-48",
          "titleAr": "الخطوة 2: كوّن حكماً واضحاً ومباشراً في جملة واحدة دون تردد أو عبارات رمادية ضعيفة.",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-6-1",
            "obj-6-2"
          ]
        },
        {
          "id": "skill-unit-1-49",
          "titleAr": "الخطوة 3: فسر استداللك باستخدام روابط السبب والنتيجة (ألن، لذلك، نتيجة لذلك، وهذا يؤدي إلى).",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-6-1",
            "obj-6-2"
          ]
        },
        {
          "id": "skill-unit-1-50",
          "titleAr": "الخطوة 4: ادعم بالأدلة من المنهج (مبادئ المحاسبة، ميزان المراجعة، أنواع الأخطاء).",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-6-1",
            "obj-6-2"
          ]
        },
        {
          "id": "skill-unit-1-51",
          "titleAr": "الخطوة 5: اعرض الحجة المضادة ورد عليها بموضوعية.",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-6-1",
            "obj-6-2"
          ]
        },
        {
          "id": "skill-unit-1-52",
          "titleAr": "الخطوة 6: اختم بخاتمة مبررة ومستنبطة من تحليلك السابق.",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-6-1",
            "obj-6-2"
          ]
        },
        {
          "id": "skill-unit-1-53",
          "titleAr": "إظهار قوة القيد المزدوج: يمنع التسجيل الناقص، ويحقق الرقابة الرياضية، ويكشف أخطاء الطرف الواحد.",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-6-1",
            "obj-6-2"
          ]
        },
        {
          "id": "skill-unit-1-54",
          "titleAr": "إظهار حدود القيد المزدوج: لا يكشف أخطاء السهو، ولا أخطاء التوجيه الفني، ولا التلاعب في التقديرات (كالإهلاك والمخصصات).",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-6-1",
            "obj-6-2"
          ]
        },
        {
          "id": "skill-unit-1-55",
          "titleAr": "التوفيق والتركيب: القيد المزدوج شرط ضروري لتحقيق التوازن، لكن مصداقية القوائم تتطلب الالتزام بالمبادئ المحاسبية (كالحيطة والاستحقاق) والرقابة الداخلية والأخلاق المهنية.",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-6-1",
            "obj-6-2"
          ]
        },
        {
          "id": "skill-unit-1-56",
          "titleAr": "معيار 1 (الإطار الفكري): استخدام المصطلحات المحاسبية بدقة متناهية.",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-6-1",
            "obj-6-2"
          ]
        },
        {
          "id": "skill-unit-1-57",
          "titleAr": "معيار 2 (التحليل العميق): التمييز الواضح بين الاتساق العددي والحقيقة الاقتصادية.",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-6-1",
            "obj-6-2"
          ]
        },
        {
          "id": "skill-unit-1-58",
          "titleAr": "معيار 3 (استخدام الأدلة): الاستشهاد بمبادئ الحيطة، المقابلة، وميزان المراجعة.",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-6-1",
            "obj-6-2"
          ]
        },
        {
          "id": "skill-unit-1-59",
          "titleAr": "معيار 4 (البنية والتماسك): التسلسل المنطقي ووجود حجة مضادة والرد عليها.",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-6-1",
            "obj-6-2"
          ]
        },
        {
          "id": "skill-unit-1-60",
          "titleAr": "معيار 5 (الرأي والخاتمة): تقديم حكم نهائي مستقل ومبرر.",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-6-1",
            "obj-6-2"
          ]
        }
      ],
      "questionIds": [
        "eb-mcq-029",
        "eb-mcq-030",
        "eb-tf-008",
        "eb-jre-001",
        "eb-jre-002",
        "eb-mcq-055",
        "eb-mcq-056",
        "eb-mcq-057",
        "eb-case-006",
        "eb-jre-005",
        "eb-t_account-004"
      ],
      "reviewItemIds": [
        
        "u1-outcome-6",
        
        "u1-step-6",
        
        "maryam-step-6",
        
        "JRE-1-03"

      ],
      "hasExercises": true,
      "legacyContentRef": "lesson-6"
    }
  ],
  "questionIds": [
    "eb-mcq-001",
    "eb-mcq-002",
    "eb-mcq-003",
    "eb-mcq-004",
    "eb-mcq-005",
    "eb-mcq-006",
    "eb-mcq-007",
    "eb-mcq-008",
    "eb-mcq-009",
    "eb-mcq-010",
    "eb-mcq-031",
    "eb-mcq-032",
    "eb-mcq-033",
    "eb-tf-001",
    "eb-tf-002",
    "eb-tf-009",
    "eb-fill-001",
    "eb-mcq-043",
    "eb-mcq-044",
    "eb-tf-011",
    "eb-tf-012",
    "eb-case-001",
    "eb-ana-001",
    "eb-applied-003",
    "eb-applied-004",
    "eb-mcq-011",
    "eb-mcq-012",
    "eb-mcq-013",
    "eb-mcq-014",
    "eb-mcq-015",
    "eb-mcq-016",
    "eb-mcq-034",
    "eb-mcq-035",
    "eb-mcq-036",
    "eb-tf-003",
    "eb-tf-004",
    "eb-tf-010",
    "eb-fill-002",
    "eb-app-001",
    "eb-mcq-045",
    "eb-mcq-046",
    "eb-mcq-047",
    "eb-tf-013",
    "eb-applied-005",
    "eb-applied-006",
    "eb-applied-007",
    "eb-case-002",
    "eb-ana-002",
    "eb-mcq-017",
    "eb-mcq-018",
    "eb-mcq-019",
    "eb-mcq-020",
    "eb-mcq-021",
    "eb-mcq-037",
    "eb-mcq-038",
    "eb-mcq-039",
    "eb-tf-005",
    "eb-fill-003",
    "eb-mcq-048",
    "eb-mcq-049",
    "eb-mcq-050",
    "eb-tf-014",
    "eb-applied-008",
    "eb-applied-009",
    "eb-applied-010",
    "eb-case-003",
    "eb-ana-003",
    "eb-jre-003",
    "eb-mcq-022",
    "eb-mcq-023",
    "eb-mcq-024",
    "eb-mcq-025",
    "eb-mcq-040",
    "eb-tf-006",
    "eb-fill-004",
    "eb-tac-001",
    "eb-mcq-051",
    "eb-mcq-052",
    "eb-tf-015",
    "eb-t_account-002",
    "eb-t_account-003",
    "eb-applied-011",
    "eb-ana-004",
    "eb-case-004",
    "eb-mcq-026",
    "eb-mcq-027",
    "eb-mcq-028",
    "eb-mcq-041",
    "eb-mcq-042",
    "eb-tf-007",
    "eb-fill-005",
    "eb-app-002",
    "eb-mcq-053",
    "eb-mcq-054",
    "eb-tf-016",
    "eb-applied-012",
    "eb-applied-013",
    "eb-applied-014",
    "eb-case-005",
    "eb-ana-005",
    "eb-jre-004",
    "eb-mcq-029",
    "eb-mcq-030",
    "eb-tf-008",
    "eb-jre-001",
    "eb-jre-002",
    "eb-mcq-055",
    "eb-mcq-056",
    "eb-mcq-057",
    "eb-case-006",
    "eb-jre-005",
    "eb-t_account-004"
  ],
  "reviewItemIds": [
    
    "u1-outcome-1",
    
    "u1-outcome-2",
    
    "u1-outcome-3",
    
    "u1-outcome-4",
    
    "u1-outcome-5",
    
    "u1-outcome-6",
    
    "u1-step-1",
    
    "u1-step-2",
    
    "u1-step-3",
    
    "u1-step-4",
    
    "u1-step-5",
    
    "u1-step-6",
    
    "maryam-step-1",
    
    "maryam-step-2",
    
    "maryam-step-3",
    
    "maryam-step-4",
    
    "maryam-step-5",
    
    "maryam-step-6",
    
    "err-1",
    
    "err-2",
    
    "err-3",
    
    "err-4",
    
    "err-5",
    
    "JRE-1-01",
    
    "JRE-1-02",
    
    "JRE-1-03"

  ]
};

export const CANONICAL_UNIT_2: UnitSpec = {
  "id": "unit-2",
  "unitNumber": 2,
  "subjectCode": "ACC.U2",
  "titleAr": "الوحدة الثانية: التسجيل المحاسبي (القيد المزدوج، اليومية، الأستاذ وميزان المراجعة)",
  "descriptionAr": "قاعدة القيد المزدوج • منطق المدين والدائن • اليومية والأستاذ T • ميزان المراجعة والتحقيق الاستقصائي",
  "totalNominalMarks": 100,
  "lessons": [
    {
      "id": "lesson-1",
      "lessonNumber": 1,
      "unitId": "unit-2",
      "titleAr": "قاعدة القيد المزدوج وأساسها في المعادلة المحاسبية",
      "subtitleAr": "لماذا لا تحدث أي معاملة مالية في عزلة، بل تُحرّك دائمًا حسابين على الأقل؟",
      "textbookPages": [
        35,
        41
      ],
      "nominalWeight": 16,
      "objectives": [
        {
          "id": "obj-1-1",
          "code": "ACC.U2.1.1",
          "lessonId": "lesson-1",
          "titleAr": "يحدد بدقة ما إذا كانت الواقعة تمثل معاملة مالية يجب إثباتها بالدفاتر أم حدثًا إداريًا غير مسجل.",
          "taxonomy": "Understand",
          "cognitiveDomain": "KNOWLEDGE",
          "targetDifficulty": "intermediate",
          "weightPercentage": 5,
          "bookPageRef": 35,
          "primaryMisconceptions": [
            "الاعتقاد بأن زيادة النقدية تعني بالضرورة تحقيق ربح."
          ],
          "conceptIds": [
            "concept-unit-2-1"
          ],
          "isJRERequired": false,
          "questionIds": [
            "eb2-mcq-001"
          ]
        },
        {
          "id": "obj-1-2",
          "code": "ACC.U2.1.2",
          "lessonId": "lesson-1",
          "titleAr": "يحلل المعاملات المالية إلى طرفيها المتكافئين أثرًا وقيمة.",
          "taxonomy": "Understand",
          "cognitiveDomain": "KNOWLEDGE",
          "targetDifficulty": "intermediate",
          "weightPercentage": 5,
          "bookPageRef": 35,
          "primaryMisconceptions": [
            "تسجيل جانب واحد فقط من المعاملة (نسيان الأثر المقابل)."
          ],
          "conceptIds": [
            "concept-unit-2-2"
          ],
          "isJRERequired": false,
          "questionIds": [
            "eb2-mcq-002"
          ]
        },
        {
          "id": "obj-1-3",
          "code": "ACC.U2.1.3",
          "lessonId": "lesson-1",
          "titleAr": "يحدد أثر كل عملية على بنود الأصول والخصوم وحقوق الملكية دون الإخلال بتوازن الميزانية.",
          "taxonomy": "Understand",
          "cognitiveDomain": "KNOWLEDGE",
          "targetDifficulty": "intermediate",
          "weightPercentage": 5,
          "bookPageRef": 35,
          "primaryMisconceptions": [
            "الخلط بين معاملتين منفصلتين زمنيًا واعتبارهما معاملة واحدة بأثر واحد."
          ],
          "conceptIds": [
            "concept-unit-2-3"
          ],
          "isJRERequired": false,
          "questionIds": [
            "eb2-mcq-003"
          ]
        },
        {
          "id": "obj-1-4",
          "code": "ACC.U2.1.4",
          "lessonId": "lesson-1",
          "titleAr": "يفسر سبب عدم تأثير العمليات التبادلية (شراء أصل نقداً أو سداد التزام نقداً) على صافي الثروة.",
          "taxonomy": "Understand",
          "cognitiveDomain": "KNOWLEDGE",
          "targetDifficulty": "intermediate",
          "weightPercentage": 5,
          "bookPageRef": 35,
          "primaryMisconceptions": [
            "الظن بأن استلام نقدية من قرض بنكي يعني تحقيق ربح للمنشأة."
          ],
          "conceptIds": [
            "concept-unit-2-4"
          ],
          "isJRERequired": false,
          "questionIds": [
            "eb2-tf-001"
          ]
        }
      ],
      "concepts": [
        {
          "id": "concept-unit-2-1",
          "titleAr": "الأساس المنطقي والعلمي لقاعدة القيد المزدوج في ضوء المعادلة المحاسبية.",
          "relatedObjectiveIds": [
            "obj-1-1"
          ]
        },
        {
          "id": "concept-unit-2-2",
          "titleAr": "الأنماط الخمسة الرئيسية لتأثير العمليات المالية على كفتي المعادلة.",
          "relatedObjectiveIds": [
            "obj-1-2"
          ]
        },
        {
          "id": "concept-unit-2-3",
          "titleAr": "الأسئلة الاسترشادية الثلاثة لتحليل أي معاملة مالية قبل تسجيلها.",
          "relatedObjectiveIds": [
            "obj-1-3"
          ]
        },
        {
          "id": "concept-unit-2-4",
          "titleAr": "كيفية التحقق من بقاء المعادلة المحاسبية متوازنة بعد كل عملية.",
          "relatedObjectiveIds": [
            "obj-1-4"
          ]
        }
      ],
      "skills": [
        {
          "id": "skill-unit-2-1",
          "titleAr": "تحديد ماذا استلم النشاط أو وعد به.",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-1-1"
          ]
        },
        {
          "id": "skill-unit-2-2",
          "titleAr": "تحديد ماذا أعطى النشاط أو وعد به في المقابل.",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-1-2"
          ]
        },
        {
          "id": "skill-unit-2-3",
          "titleAr": "تحديد الحسابين (أو أكثر) المتأثرين، والتحقق من بقاء المعادلة متوازنة.",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-1-3"
          ]
        },
        {
          "id": "skill-unit-2-4",
          "titleAr": "تحديد الحسابين المتأثرين بالمعاملة.",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-1-4"
          ]
        },
        {
          "id": "skill-unit-2-5",
          "titleAr": "تحديد نوع كل حساب (أصل، خصم، حق ملكية).",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-1-1"
          ]
        },
        {
          "id": "skill-unit-2-6",
          "titleAr": "تحديد اتجاه التغير (زيادة أو نقص) والتحقق من بقاء المجموعين متطابقين.",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-1-2"
          ]
        },
        {
          "id": "skill-unit-2-7",
          "titleAr": "السؤال 1: ماذا استلم النشاط أو وعد به؟",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-1-3"
          ]
        },
        {
          "id": "skill-unit-2-8",
          "titleAr": "السؤال 2: ماذا أعطى النشاط أو وعد به في المقابل؟",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-1-4"
          ]
        },
        {
          "id": "skill-unit-2-9",
          "titleAr": "السؤال 3: ما الحسابات التي تأثرت، وما اتجاه التغير في كل منها؟",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-1-1"
          ]
        }
      ],
      "questionIds": [
        "eb2-mcq-001",
        "eb2-mcq-002",
        "eb2-mcq-003",
        "eb2-tf-001"
      ],
      "reviewItemIds": [
        
        "u2-outcome-1",
        
        "u2-step-1",
        
        "u2-maryam-step-1",
        
        "u2-err-1"

      ],
      "hasExercises": true,
      "legacyContentRef": "u2-lesson-1"
    },
    {
      "id": "lesson-2",
      "lessonNumber": 2,
      "unitId": "unit-2",
      "titleAr": "منطق المدين والدائن وتصنيف الحسابات الخمس",
      "subtitleAr": "إذا كانت كل معاملة تحرك حسابين، فأي جانب يسجل الزيادة، وأيهما يسجل النقص؟",
      "textbookPages": [
        35,
        41
      ],
      "nominalWeight": 16,
      "objectives": [
        {
          "id": "obj-2-1",
          "code": "ACC.U2.2.1",
          "lessonId": "lesson-2",
          "titleAr": "يميز بين المعنى الحسابي العلمي للمدين والدائن والمعنى الدارج الشائع.",
          "taxonomy": "Understand",
          "cognitiveDomain": "KNOWLEDGE",
          "targetDifficulty": "intermediate",
          "weightPercentage": 5,
          "bookPageRef": 35,
          "primaryMisconceptions": [
            "حفظ \"مدين = زيادة\" و\"دائن = نقصان\" كقاعدة مطلقة دون ربطها بنوع الحساب."
          ],
          "conceptIds": [
            "concept-unit-2-5"
          ],
          "isJRERequired": false,
          "questionIds": [
            "eb2-mcq-004"
          ]
        },
        {
          "id": "obj-2-2",
          "code": "ACC.U2.2.2",
          "lessonId": "lesson-2",
          "titleAr": "يصنف أي حساب من حسابات المنشأة بدقة متناهية تحت إحدى الفئات الخمس.",
          "taxonomy": "Understand",
          "cognitiveDomain": "KNOWLEDGE",
          "targetDifficulty": "intermediate",
          "weightPercentage": 5,
          "bookPageRef": 35,
          "primaryMisconceptions": [
            "تصنيف حساب \"الدائنين\" خطأً على أنه أصل بدلًا من خصم."
          ],
          "conceptIds": [
            "concept-unit-2-6"
          ],
          "isJRERequired": false,
          "questionIds": [
            "eb2-mcq-005"
          ]
        },
        {
          "id": "obj-2-3",
          "code": "ACC.U2.2.3",
          "lessonId": "lesson-2",
          "titleAr": "يطبق قواعد الزيادة والنقص لتحديد أي الحسابات يُجعل مدينًا وأيها يُجعل دائنًا في أي عملية.",
          "taxonomy": "Understand",
          "cognitiveDomain": "KNOWLEDGE",
          "targetDifficulty": "intermediate",
          "weightPercentage": 5,
          "bookPageRef": 35,
          "primaryMisconceptions": [
            "الربط الأعمى بين المدين والزيادة واعتقاد أن سداد التزام دائن يجعله دائنًا."
          ],
          "conceptIds": [
            "concept-unit-2-7"
          ],
          "isJRERequired": false,
          "questionIds": [
            "eb2-mcq-006"
          ]
        },
        {
          "id": "obj-2-4",
          "code": "ACC.U2.2.4",
          "lessonId": "lesson-2",
          "titleAr": "يبرهن علميًا على سبب المعاملة المدينة للمصروفات والمسحوبات في دفتر الأستاذ.",
          "taxonomy": "Understand",
          "cognitiveDomain": "KNOWLEDGE",
          "targetDifficulty": "intermediate",
          "weightPercentage": 5,
          "bookPageRef": 35,
          "primaryMisconceptions": [
            "الظن بأن المصروفات \"سيئة\" فتُسجَّل دائنة لأنها تنقص الأرباح."
          ],
          "conceptIds": [
            "concept-unit-2-8"
          ],
          "isJRERequired": false,
          "questionIds": [
            "eb2-tf-002"
          ]
        }
      ],
      "concepts": [
        {
          "id": "concept-unit-2-5",
          "titleAr": "المعنى الدقيق لمصطلحي المدين والدائن كطرفي حساب في دفتر الأستاذ.",
          "relatedObjectiveIds": [
            "obj-2-1"
          ]
        },
        {
          "id": "concept-unit-2-6",
          "titleAr": "تصنيف كافة حسابات المنشأة إلى الفئات الخمس: أصول، خصوم، حقوق ملكية، إيرادات، مصروفات.",
          "relatedObjectiveIds": [
            "obj-2-2"
          ]
        },
        {
          "id": "concept-unit-2-7",
          "titleAr": "قاعدة الزيادة والنقصان الرياضية لكل فئة من الفئات الخمس.",
          "relatedObjectiveIds": [
            "obj-2-3"
          ]
        },
        {
          "id": "concept-unit-2-8",
          "titleAr": "المعادلة الموسعة لحقوق الملكية التي تفسر طبيعة الإيرادات والمصروفات والمسحوبات.",
          "relatedObjectiveIds": [
            "obj-2-4"
          ]
        }
      ],
      "skills": [
        {
          "id": "skill-unit-2-10",
          "titleAr": "لا تربط المدين والدائن مباشرة بيمين أو يسار المعادلة المحاسبية.",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-2-1"
          ]
        },
        {
          "id": "skill-unit-2-11",
          "titleAr": "صنّف الحساب أولاً (أصل، خصم، حق ملكية، إيراد، مصروف).",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-2-2"
          ]
        },
        {
          "id": "skill-unit-2-12",
          "titleAr": "استنتج جانب الزيادة من طبيعة الحساب لا من موقعه الشكلي.",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-2-3"
          ]
        },
        {
          "id": "skill-unit-2-13",
          "titleAr": "اسأل: هل هذا الحساب مما تملكه المنشأة (أصل)؟",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-2-4"
          ]
        },
        {
          "id": "skill-unit-2-14",
          "titleAr": "أم مما عليها للغير (خصم)؟ أم حق المالك الأصيل (حقوق ملكية)؟",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-2-1"
          ]
        },
        {
          "id": "skill-unit-2-15",
          "titleAr": "أم تدفق عائد من النشاط (إيراد)؟ أم تكلفة استُهلكت لتحقيقه (مصروف)؟",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-2-2"
          ]
        },
        {
          "id": "skill-unit-2-16",
          "titleAr": "حدد طبيعة الحساب (مدينة أم دائنة) بناءً على فئته.",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-2-3"
          ]
        },
        {
          "id": "skill-unit-2-17",
          "titleAr": "عند حدوث إيراد ⬅ يسجل دائنًا لأنه يزيد حقوق الملكية (طبيعتها دائنة).",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-2-4"
          ]
        },
        {
          "id": "skill-unit-2-18",
          "titleAr": "عند حدوث مصروف ⬅ يسجل مدينًا لأنه يخفض حقوق الملكية (معاكس للدائن).",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-2-1"
          ]
        },
        {
          "id": "skill-unit-2-19",
          "titleAr": "عند حدوث مسحوبات ⬅ تسجل مدينة لأنها تخفيض مباشر لحق المالك.",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-2-2"
          ]
        }
      ],
      "questionIds": [
        "eb2-mcq-004",
        "eb2-mcq-005",
        "eb2-mcq-006",
        "eb2-tf-002"
      ],
      "reviewItemIds": [
        
        "u2-outcome-2",
        
        "u2-step-2",
        
        "u2-maryam-step-2",
        
        "u2-err-2"

      ],
      "hasExercises": true,
      "legacyContentRef": "u2-lesson-2"
    },
    {
      "id": "lesson-3",
      "lessonNumber": 3,
      "unitId": "unit-2",
      "titleAr": "دفتر اليومية العامة وحسابات الأستاذ T والترحيل والترصيد",
      "subtitleAr": "كيف تُجمع حركات حساب واحد في مكان واحد بدل البحث عنها مبعثرة بين عشرات القيود؟",
      "textbookPages": [
        35,
        41
      ],
      "nominalWeight": 16,
      "objectives": [
        {
          "id": "obj-3-1",
          "code": "ACC.U2.3.1",
          "lessonId": "lesson-3",
          "titleAr": "يصيغ قيود اليومية البسيطة والمركبة وفق الأصول والقواعد الشكلية والقانونية.",
          "taxonomy": "Understand",
          "cognitiveDomain": "KNOWLEDGE",
          "targetDifficulty": "intermediate",
          "weightPercentage": 5,
          "bookPageRef": 35,
          "primaryMisconceptions": [
            "عدم توازن طرفي قيد اليومية المركب بين الجانب المدين والدائن."
          ],
          "conceptIds": [
            "concept-unit-2-9"
          ],
          "isJRERequired": false,
          "questionIds": [
            "eb2-mcq-007"
          ]
        },
        {
          "id": "obj-3-2",
          "code": "ACC.U2.3.2",
          "lessonId": "lesson-3",
          "titleAr": "يرحل القيود من دفتر اليومية إلى صفحات حسابات الأستاذ العام دون سهو أو تبديل.",
          "taxonomy": "Understand",
          "cognitiveDomain": "KNOWLEDGE",
          "targetDifficulty": "intermediate",
          "weightPercentage": 5,
          "bookPageRef": 35,
          "primaryMisconceptions": [
            "ترحيل طرفي القيد في نفس الجانب من حساب الأستاذ."
          ],
          "conceptIds": [
            "concept-unit-2-10",
            "concept-unit-2-11"
          ],
          "isJRERequired": false,
          "questionIds": [
            "eb2-mcq-008"
          ]
        },
        {
          "id": "obj-3-3",
          "code": "ACC.U2.3.3",
          "lessonId": "lesson-3",
          "titleAr": "يطبق خطوات الترصيد المنهجية الأربع ويحدد طبيعة ومقدار الرصيد الختامي لكل حساب بدقة 100%.",
          "taxonomy": "Understand",
          "cognitiveDomain": "KNOWLEDGE",
          "targetDifficulty": "intermediate",
          "weightPercentage": 5,
          "bookPageRef": 35,
          "primaryMisconceptions": [
            "نسيان ترحيل أحد طرفي القيد (السهو أو الحذف الجزئي)."
          ],
          "conceptIds": [
            "concept-unit-2-12"
          ],
          "isJRERequired": false,
          "questionIds": [
            "eb2-tf-003"
          ]
        },
        {
          "id": "obj-3-4",
          "code": "ACC.U2.3.4",
          "lessonId": "lesson-3",
          "titleAr": "يفسر دلالة الرصيد المنقول وموقعه بالنسبة لطبيعة الحساب.",
          "taxonomy": "Understand",
          "cognitiveDomain": "KNOWLEDGE",
          "targetDifficulty": "intermediate",
          "weightPercentage": 5,
          "bookPageRef": 35,
          "primaryMisconceptions": [
            "الظن بأن الترتيب الزمني للترحيل داخل حساب الأستاذ يغيّر الرصيد النهائي."
          ],
          "conceptIds": [
            "concept-unit-2-12"
          ],
          "isJRERequired": false,
          "questionIds": []
        }
      ],
      "concepts": [
        {
          "id": "concept-unit-2-9",
          "titleAr": "التركيب القياسي لدفتر اليومية العامة وصياغة قيود اليومية البسيطة والمركبة.",
          "relatedObjectiveIds": [
            "obj-3-1"
          ]
        },
        {
          "id": "concept-unit-2-10",
          "titleAr": "بنية حساب الأستاذ T ووظيفته في تجميع حركات كل حساب على حدة.",
          "relatedObjectiveIds": [
            "obj-3-2"
          ]
        },
        {
          "id": "concept-unit-2-11",
          "titleAr": "خطوات الترحيل المنهجية الخمس من اليومية إلى الأستاذ دون أخطاء.",
          "relatedObjectiveIds": [
            "obj-3-2"
          ]
        },
        {
          "id": "concept-unit-2-12",
          "titleAr": "آلية الترصيد المحاسبي وحساب الرصيد الصافي وتحديد طبيعته.",
          "relatedObjectiveIds": [
            "obj-3-3",
            "obj-3-4"
          ]
        }
      ],
      "skills": [
        {
          "id": "skill-unit-2-20",
          "titleAr": "حلل المعاملة بالأسئلة الثلاثة الاسترشادية.",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-3-1"
          ]
        },
        {
          "id": "skill-unit-2-21",
          "titleAr": "حدد الطرف المدين واكتبه أولاً ملاصقاً لليمين (من حـ/ ...).",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-3-2"
          ]
        },
        {
          "id": "skill-unit-2-22",
          "titleAr": "حدد الطرف الدائن واكتبه تحته مع إزاحة خفيفة لليسار (إلى حـ/ ...).",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-3-3"
          ]
        },
        {
          "id": "skill-unit-2-23",
          "titleAr": "تأكد من تطابق مجموع المبالغ المدينة مع المبالغ الدائنة وضع شرحاً مختصراً.",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-3-4"
          ]
        },
        {
          "id": "skill-unit-2-24",
          "titleAr": "فتح صفحة أو حساب T لكل بند مالي ورد في قيود اليومية.",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-3-1"
          ]
        },
        {
          "id": "skill-unit-2-25",
          "titleAr": "تسمية الحساب باسمه الواضح (حـ/ النقدية، حـ/ المخزون، حـ/ الدائنون...).",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-3-2"
          ]
        },
        {
          "id": "skill-unit-2-26",
          "titleAr": "تخصيص الجانب الأيمن للمدين والأيسر للدائن.",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-3-3"
          ]
        },
        {
          "id": "skill-unit-2-27",
          "titleAr": "انقل الطرف المدين من القيد إلى الجانب الأيمن من حساب الأستاذ الخاص به.",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-3-4"
          ]
        },
        {
          "id": "skill-unit-2-28",
          "titleAr": "انقل الطرف الدائن من القيد إلى الجانب الأيسر من حساب الأستاذ الخاص به.",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-3-1"
          ]
        },
        {
          "id": "skill-unit-2-29",
          "titleAr": "في نهاية الفترة، اجمع الجانب المدين واجمع الجانب الدائن.",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-3-2"
          ]
        },
        {
          "id": "skill-unit-2-30",
          "titleAr": "اطرح الجانب الأصغر من الجانب الأكبر: الرصيد = الجانب الأكبر - الجانب الأصغر، ويسمى باسم الجانب الأكبر.",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-3-3"
          ]
        }
      ],
      "questionIds": [
        "eb2-mcq-007",
        "eb2-mcq-008",
        "eb2-tf-003"
      ],
      "reviewItemIds": [
        
        "u2-outcome-3",
        
        "u2-step-3",
        
        "u2-maryam-step-3",
        
        "u2-err-3",
        
        "JRE-2-01"

      ],
      "hasExercises": true,
      "legacyContentRef": "u2-lesson-3"
    },
    {
      "id": "lesson-4",
      "lessonNumber": 4,
      "unitId": "unit-2",
      "titleAr": "ميزان المراجعة واكتشاف وتصحيح الأخطاء المحاسبية",
      "subtitleAr": "هل يعني توازن ميزان المراجعة أن كل شيء في الدفاتر صحيح تمامًا؟",
      "textbookPages": [
        35,
        41
      ],
      "nominalWeight": 16,
      "objectives": [
        {
          "id": "obj-4-1",
          "code": "ACC.U2.4.1",
          "lessonId": "lesson-4",
          "titleAr": "يعد ميزان المراجعة بالأرصدة بطريقة احترافية مع ترتيب الحسابات وفق طبيعتها.",
          "taxonomy": "Understand",
          "cognitiveDomain": "KNOWLEDGE",
          "targetDifficulty": "intermediate",
          "weightPercentage": 5,
          "bookPageRef": 35,
          "primaryMisconceptions": [
            "الاعتقاد بأن توازن ميزان المراجعة يعني خلو الحسابات من جميع الأخطاء."
          ],
          "conceptIds": [
            "concept-unit-2-13"
          ],
          "isJRERequired": false,
          "questionIds": [
            "eb2-mcq-009"
          ]
        },
        {
          "id": "obj-4-2",
          "code": "ACC.U2.4.2",
          "lessonId": "lesson-4",
          "titleAr": "يصنف الأخطاء المحاسبية إلى أخطاء تؤثر على التوازن وأخطاء لا تؤثر.",
          "taxonomy": "Understand",
          "cognitiveDomain": "KNOWLEDGE",
          "targetDifficulty": "intermediate",
          "weightPercentage": 5,
          "bookPageRef": 35,
          "primaryMisconceptions": [
            "الخلط بين الخطأ الفني في اتجاه القيد (مدين بدل دائن) وخطأ التوجيه المحاسبي."
          ],
          "conceptIds": [
            "concept-unit-2-14",
            "concept-unit-2-15"
          ],
          "isJRERequired": false,
          "questionIds": [
            "eb2-mcq-010"
          ]
        },
        {
          "id": "obj-4-3",
          "code": "ACC.U2.4.3",
          "lessonId": "lesson-4",
          "titleAr": "يوظف قواعد الفحص الرياضي (القسمة على 2 والقسمة على 9) لكشف مواضع الأخطاء الشائعة.",
          "taxonomy": "Understand",
          "cognitiveDomain": "KNOWLEDGE",
          "targetDifficulty": "intermediate",
          "weightPercentage": 5,
          "bookPageRef": 35,
          "primaryMisconceptions": [
            "الاعتقاد بأن عدم تسجيل عملية بالكامل سيُخل بتوازن ميزان المراجعة."
          ],
          "conceptIds": [
            "concept-unit-2-14"
          ],
          "isJRERequired": false,
          "questionIds": [
            "eb2-tf-004"
          ]
        },
        {
          "id": "obj-4-4",
          "code": "ACC.U2.4.4",
          "lessonId": "lesson-4",
          "titleAr": "يحرر قيود التصحيح الدفترية لمعالجة الأخطاء المحاسبية وإقفال حساب التسوية.",
          "taxonomy": "Understand",
          "cognitiveDomain": "KNOWLEDGE",
          "targetDifficulty": "intermediate",
          "weightPercentage": 5,
          "bookPageRef": 35,
          "primaryMisconceptions": [
            "تصحيح الخطأ الدفتري بالشطب أو الكشط بدلًا من إثبات قيد تصحيحي معتمد."
          ],
          "conceptIds": [
            "concept-unit-2-16"
          ],
          "isJRERequired": false,
          "questionIds": []
        }
      ],
      "concepts": [
        {
          "id": "concept-unit-2-13",
          "titleAr": "خطوات إعداد ميزان المراجعة بالأرصدة من واقع دفاتر الأستاذ العام.",
          "relatedObjectiveIds": [
            "obj-4-1"
          ]
        },
        {
          "id": "concept-unit-2-14",
          "titleAr": "الأخطاء المحاسبية التي تخل بتوازن ميزان المراجعة وطرق استنتاجها من قيمة الفرق.",
          "relatedObjectiveIds": [
            "obj-4-2",
            "obj-4-3"
          ]
        },
        {
          "id": "concept-unit-2-15",
          "titleAr": "الأخطاء المحاسبية الخفية التي لا تؤثر على توازن الميزان (خطأ التوجيه، السهو الكلي، الأخطاء المتكافئة).",
          "relatedObjectiveIds": [
            "obj-4-2"
          ]
        },
        {
          "id": "concept-unit-2-16",
          "titleAr": "التمييز العميق بين الاتساق الداخلي (Internal Consistency) والتمثيل الصادق (Faithful Representation).",
          "relatedObjectiveIds": [
            "obj-4-4"
          ]
        }
      ],
      "skills": [
        {
          "id": "skill-unit-2-31",
          "titleAr": "اجمع أرصدة جميع حسابات الأستاذ بعد الترصيد.",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-4-1"
          ]
        },
        {
          "id": "skill-unit-2-32",
          "titleAr": "ضع كل رصيد مدين في عمود الأرصدة المدينة، وكل رصيد دائن في عمود الأرصدة الدائنة.",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-4-2"
          ]
        },
        {
          "id": "skill-unit-2-33",
          "titleAr": "اجمع كل عمود على حدة، وتحقق من تطابق الإجماليين.",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-4-3"
          ]
        },
        {
          "id": "skill-unit-2-34",
          "titleAr": "إذا تساوى العمودان ⬅ تحقق الاتساق الداخلي. إذا اختلفا ⬅ يوجد خطأ يخل بالقيد المزدوج.",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-4-4"
          ]
        },
        {
          "id": "skill-unit-2-35",
          "titleAr": "احسب الفرق بين الجانبين: الفرق = إجمالي المدين - إجمالي الدائن.",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-4-1"
          ]
        },
        {
          "id": "skill-unit-2-36",
          "titleAr": "إذا كان الفرق يساوي قيمة معاملة كاملة ⬅ خطأ سهو جزئي (ترحيل طرف واحد).",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-4-2"
          ]
        },
        {
          "id": "skill-unit-2-37",
          "titleAr": "إذا كان الفرق يقبل القسمة على 2 والناتج يساوي مبلغ معاملة ⬅ خطأ عكس اتجاه (تسجيل مدين بدل دائن).",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-4-3"
          ]
        },
        {
          "id": "skill-unit-2-38",
          "titleAr": "إذا كان الفرق رقماً غير منتظم ⬅ خطأ كتابي في نقل الأرقام أو جمع الحسابات.",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-4-4"
          ]
        },
        {
          "id": "skill-unit-2-39",
          "titleAr": "لا تعتمد على توازن ميزان المراجعة كدليل وحيد على خلو الدفاتر من الأخطاء.",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-4-1"
          ]
        },
        {
          "id": "skill-unit-2-40",
          "titleAr": "راجع المستندات المؤيدة للقيود (الفواتير والعقود) للتأكد من صحة التوجيه.",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-4-2"
          ]
        },
        {
          "id": "skill-unit-2-41",
          "titleAr": "تأكد من أن المصروفات لم تُسجل كأصول (خطأ توجيه) وأن كل الفواتير قُيدت بالكامل.",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-4-3"
          ]
        }
      ],
      "questionIds": [
        "eb2-mcq-009",
        "eb2-mcq-010",
        "eb2-tf-004"
      ],
      "reviewItemIds": [
        
        "u2-outcome-4",
        
        "u2-step-4",
        
        "u2-maryam-step-4",
        
        "u2-err-4",
        
        "JRE-2-02"

      ],
      "hasExercises": true,
      "legacyContentRef": "u2-lesson-4"
    },
    {
      "id": "lesson-5",
      "lessonNumber": 5,
      "unitId": "unit-2",
      "titleAr": "التطبيق العملي المتكامل للدورة المحاسبية كاملة",
      "subtitleAr": "كيف تترابط كل خطوات الوحدة (التحليل، التصنيف، الترحيل، الترصيد، الميزان) في دورة واحدة متكاملة؟",
      "textbookPages": [
        35,
        41
      ],
      "nominalWeight": 16,
      "objectives": [
        {
          "id": "obj-5-1",
          "code": "ACC.U2.5.1",
          "lessonId": "lesson-5",
          "titleAr": "يربط بين كافة حلقات الدورة المحاسبية ويوضح وظيفة كل مستند وسجل.",
          "taxonomy": "Understand",
          "cognitiveDomain": "KNOWLEDGE",
          "targetDifficulty": "intermediate",
          "weightPercentage": 5,
          "bookPageRef": 35,
          "primaryMisconceptions": [
            "التعامل مع مراحل الدورة المحاسبية كخطوات منفصلة لا علاقة بينها."
          ],
          "conceptIds": [
            "concept-unit-2-17"
          ],
          "isJRERequired": false,
          "questionIds": [
            "eb2-mcq-011"
          ]
        },
        {
          "id": "obj-5-2",
          "code": "ACC.U2.5.2",
          "lessonId": "lesson-5",
          "titleAr": "ينفذ دورة محاسبية كاملة من واقع مستندات وعمليات شهرية وحتى استخراج ميزان المراجعة.",
          "taxonomy": "Understand",
          "cognitiveDomain": "KNOWLEDGE",
          "targetDifficulty": "intermediate",
          "weightPercentage": 5,
          "bookPageRef": 35,
          "primaryMisconceptions": [
            "إغفال الترتيب المنطقي لتسلسل العمليات الدفترية."
          ],
          "conceptIds": [
            "concept-unit-2-18",
            "concept-unit-2-19"
          ],
          "isJRERequired": false,
          "questionIds": [
            "eb2-mcq-012"
          ]
        },
        {
          "id": "obj-5-3",
          "code": "ACC.U2.5.3",
          "lessonId": "lesson-5",
          "titleAr": "يتجنب الوقوع في تراكم الأخطاء عبر تطبيق نقاط الفحص المرحلية.",
          "taxonomy": "Understand",
          "cognitiveDomain": "KNOWLEDGE",
          "targetDifficulty": "intermediate",
          "weightPercentage": 5,
          "bookPageRef": 35,
          "primaryMisconceptions": [
            "الاعتقاد بأن الوصول إلى ميزان مراجعة متوازن هو الهدف النهائي للدورة المحاسبية."
          ],
          "conceptIds": [
            "concept-unit-2-20"
          ],
          "isJRERequired": false,
          "questionIds": []
        },
        {
          "id": "obj-5-4",
          "code": "ACC.U2.5.4",
          "lessonId": "lesson-5",
          "titleAr": "يقيّم كفاءة وسرعة الدورة المستندية في إمداد الإدارة بالمعلومات اللازمة لاتخاذ القرارات.",
          "taxonomy": "Understand",
          "cognitiveDomain": "KNOWLEDGE",
          "targetDifficulty": "intermediate",
          "weightPercentage": 5,
          "bookPageRef": 35,
          "primaryMisconceptions": [
            "إهمال توثيق العمليات بالمستندات المؤيدة المؤرخة."
          ],
          "conceptIds": [
            "concept-unit-2-17",
            "concept-unit-2-20"
          ],
          "isJRERequired": false,
          "questionIds": []
        }
      ],
      "concepts": [
        {
          "id": "concept-unit-2-17",
          "titleAr": "التنفيذ المتسلسل للدورة المحاسبية من المعاملة الاقتصادية وحتى ميزان المراجعة.",
          "relatedObjectiveIds": [
            "obj-5-1",
            "obj-5-4"
          ]
        },
        {
          "id": "concept-unit-2-18",
          "titleAr": "تسجيل ثماني معاملات واقعية متنوعة تمثل كافة الأنماط وفئات الحسابات الخمس.",
          "relatedObjectiveIds": [
            "obj-5-2"
          ]
        },
        {
          "id": "concept-unit-2-19",
          "titleAr": "الترحيل الدقيق للحسابات الثمانية وحساب أرصدتها الصافية بعد حركات متعددة.",
          "relatedObjectiveIds": [
            "obj-5-2"
          ]
        },
        {
          "id": "concept-unit-2-20",
          "titleAr": "إعداد ميزان المراجعة المتوازن (255,000 جنيه) وفهم دلالته والحدود الفنية له.",
          "relatedObjectiveIds": [
            "obj-5-3",
            "obj-5-4"
          ]
        }
      ],
      "skills": [
        {
          "id": "skill-unit-2-42",
          "titleAr": "المعاملة 1: استثمر المالك 150,000 جنيه نقدًا في المشروع.",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-5-1"
          ]
        },
        {
          "id": "skill-unit-2-43",
          "titleAr": "المعاملة 2: تم شراء معدات بمبلغ 60,000 جنيه نقدًا.",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-5-2"
          ]
        },
        {
          "id": "skill-unit-2-44",
          "titleAr": "المعاملة 3: تم شراء بضاعة بالآجل بمبلغ 40,000 جنيه من الموردين.",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-5-3"
          ]
        },
        {
          "id": "skill-unit-2-45",
          "titleAr": "المعاملة 4: تم بيع بضائع نقدًا بمبلغ 50,000 جنيه.",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-5-4"
          ]
        },
        {
          "id": "skill-unit-2-46",
          "titleAr": "المعاملة 5: تم بيع بضائع بالآجل بمبلغ 30,000 جنيه للعملاء.",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-5-1"
          ]
        },
        {
          "id": "skill-unit-2-47",
          "titleAr": "المعاملة 6: تم سداد 15,000 جنيه نقدًا للمورد.",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-5-2"
          ]
        },
        {
          "id": "skill-unit-2-48",
          "titleAr": "المعاملة 7: تم دفع رواتب العاملين 8,000 جنيه نقدًا.",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-5-3"
          ]
        },
        {
          "id": "skill-unit-2-49",
          "titleAr": "المعاملة 8: تم تحصيل 10,000 جنيه نقدًا من عميل عن مبيعات سابقة.",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-5-4"
          ]
        },
        {
          "id": "skill-unit-2-50",
          "titleAr": "تأكد من أن كل قيد متوازن قبل ترحيله.",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-5-1"
          ]
        },
        {
          "id": "skill-unit-2-51",
          "titleAr": "رحل الأرقام بدقة لحسابات الأستاذ.",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-5-2"
          ]
        },
        {
          "id": "skill-unit-2-52",
          "titleAr": "احسب مجاميع الجانبين واطرح لاستخراج رصيد كل حساب.",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-5-3"
          ]
        },
        {
          "id": "skill-unit-2-53",
          "titleAr": "انقل الأرصدة لميزان المراجعة في عموديها الصحيحين.",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-5-4"
          ]
        }
      ],
      "questionIds": [
        "eb2-mcq-011",
        "eb2-mcq-012"
      ],
      "reviewItemIds": [
        
        "u2-outcome-5",
        
        "u2-step-5",
        
        "u2-maryam-step-5",
        
        "u2-err-5"

      ],
      "hasExercises": true,
      "legacyContentRef": "u2-lesson-5"
    },
    {
      "id": "lesson-6",
      "lessonNumber": 6,
      "unitId": "unit-2",
      "titleAr": "المراجعة التركيبية الشاملة ومهمة الصحفي الاستقصائي (JRE 2)",
      "subtitleAr": "كيف تكشف التضليل المالي المستتر خلف ميزان مراجعة متوازن تمامًا؟",
      "textbookPages": [
        35,
        41
      ],
      "nominalWeight": 16,
      "objectives": [
        {
          "id": "obj-6-1",
          "code": "ACC.U2.6.1",
          "lessonId": "lesson-6",
          "titleAr": "ينقد الفكرة الخاطئة القائلة بأن توازن ميزان المراجعة يعني دائمًا سلامة الدفاتر.",
          "taxonomy": "Understand",
          "cognitiveDomain": "KNOWLEDGE",
          "targetDifficulty": "intermediate",
          "weightPercentage": 5,
          "bookPageRef": 35,
          "primaryMisconceptions": [
            "الاعتقاد بأن الصحفي أو المراجع المالي يكتفي بمطابقة إجمالي الأرقام في ميزان المراجعة."
          ],
          "conceptIds": [
            "concept-unit-2-21"
          ],
          "isJRERequired": false,
          "questionIds": [
            "eb2-mcq-013"
          ]
        },
        {
          "id": "obj-6-2",
          "code": "ACC.U2.6.2",
          "lessonId": "lesson-6",
          "titleAr": "يحدد أساليب التضليل المالي التي تبقي الميزان متوازنًا شكليًا ومغلوطًا جوهريًا.",
          "taxonomy": "Understand",
          "cognitiveDomain": "KNOWLEDGE",
          "targetDifficulty": "intermediate",
          "weightPercentage": 5,
          "bookPageRef": 35,
          "primaryMisconceptions": [
            "الظن بأن التلاعب المالي يظهر دائمًا في صورة اختلاس نقدي مباشر فقط."
          ],
          "conceptIds": [
            "concept-unit-2-22",
            "concept-unit-2-23"
          ],
          "isJRERequired": false,
          "questionIds": [
            "eb2-jre-001"
          ]
        },
        {
          "id": "obj-6-3",
          "code": "ACC.U2.6.3",
          "lessonId": "lesson-6",
          "titleAr": "يمارس دور المحقق المالي في فحص المستندات وربط الوقائع بالأدلة المحاسبية.",
          "taxonomy": "Understand",
          "cognitiveDomain": "KNOWLEDGE",
          "targetDifficulty": "intermediate",
          "weightPercentage": 5,
          "bookPageRef": 35,
          "primaryMisconceptions": [
            "الاعتماد على إفادات الإدارة الشفوية دون التحقق من المستندات الثبوتية المؤيدة."
          ],
          "conceptIds": [
            "concept-unit-2-23"
          ],
          "isJRERequired": false,
          "questionIds": []
        },
        {
          "id": "obj-6-4",
          "code": "ACC.U2.6.4",
          "lessonId": "lesson-6",
          "titleAr": "يكتب مقال JRE متقنًا في الوحدة الثانية يحصل على الدرجة الكاملة (20/20) وفق الروباريك الرسمي.",
          "taxonomy": "Understand",
          "cognitiveDomain": "KNOWLEDGE",
          "targetDifficulty": "intermediate",
          "weightPercentage": 5,
          "bookPageRef": 35,
          "primaryMisconceptions": [
            "صياغة مقال JRE إنشائي يفتقر للأسانيد المحاسبية والمعايير المهنية."
          ],
          "conceptIds": [
            "concept-unit-2-24"
          ],
          "isJRERequired": false,
          "questionIds": []
        }
      ],
      "concepts": [
        {
          "id": "concept-unit-2-21",
          "titleAr": "الربط التركيبي الشامل بين الدروس الخمسة للوحدة الثانية في شبكة مفاهيمية واحدة.",
          "relatedObjectiveIds": [
            "obj-6-1"
          ]
        },
        {
          "id": "concept-unit-2-22",
          "titleAr": "كيفية تحليل القوائم المالية بعين المحقق الناقد وليس مجرد الجامع الحسابي للأرقام.",
          "relatedObjectiveIds": [
            "obj-6-2"
          ]
        },
        {
          "id": "concept-unit-2-23",
          "titleAr": "تقنيات كشف رسملة المصروفات والسهو الكلي والتوجيه المضلل.",
          "relatedObjectiveIds": [
            "obj-6-2",
            "obj-6-3"
          ]
        },
        {
          "id": "concept-unit-2-24",
          "titleAr": "إعداد تقرير تحقيق مالي مهني يقدم الأدلة المحاسبية الموثقة ويقترح قيود التصحيح.",
          "relatedObjectiveIds": [
            "obj-6-4"
          ]
        }
      ],
      "skills": [
        {
          "id": "skill-unit-2-54",
          "titleAr": "تأكد من إتقان النقلات بين المراحل: من الفاتورة إلى التحليل إلى القيد إلى الأستاذ إلى الميزان.",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-6-1"
          ]
        },
        {
          "id": "skill-unit-2-55",
          "titleAr": "تذكر دائماً أن التوازن الحسابي أداة وسيطة لضبط الحسابات، بينما الهدف النهائي هو الصدق والأمانة في عرض المركز المالي.",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-6-2"
          ]
        },
        {
          "id": "skill-unit-2-56",
          "titleAr": "امتلك الحس النقدي للمحاسب المهني عند فحص أي كشف مالي.",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-6-3"
          ]
        },
        {
          "id": "skill-unit-2-57",
          "titleAr": "فحص بنود الأصول الثابتة: هل تحتوي على مصروفات تشغيلية كان ينبغي إقفالها في قائمة الدخل؟",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-6-4"
          ]
        },
        {
          "id": "skill-unit-2-58",
          "titleAr": "فحص المبيعات والعملاء: هل تم تسجيل مبيعات وهمية أو استباق إيرادات غير محققة؟",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-6-1"
          ]
        },
        {
          "id": "skill-unit-2-59",
          "titleAr": "فحص الموردين والمخزون: هل تم إخفاء فواتير مشتريات بالأجل لتصغير الالتزامات وتضخيم الأرباح؟",
          "taxonomy": "Apply",
          "relatedObjectiveIds": [
            "obj-6-2"
          ]
        }
      ],
      "questionIds": [
        "eb2-mcq-013",
        "eb2-jre-001"
      ],
      "reviewItemIds": [
        
        "u2-outcome-6",
        
        "u2-step-6",
        
        "u2-maryam-step-6",
        
        "JRE-2-03"

      ],
      "hasExercises": true,
      "legacyContentRef": "u2-lesson-6"
    }
  ],
  "questionIds": [
    "eb2-mcq-001",
    "eb2-mcq-002",
    "eb2-mcq-003",
    "eb2-tf-001",
    "eb2-mcq-004",
    "eb2-mcq-005",
    "eb2-mcq-006",
    "eb2-tf-002",
    "eb2-mcq-007",
    "eb2-mcq-008",
    "eb2-tf-003",
    "eb2-mcq-009",
    "eb2-mcq-010",
    "eb2-tf-004",
    "eb2-mcq-011",
    "eb2-mcq-012",
    "eb2-mcq-013",
    "eb2-jre-001"
  ],
  "reviewItemIds": [
    
    "u2-outcome-1",
    
    "u2-outcome-2",
    
    "u2-outcome-3",
    
    "u2-outcome-4",
    
    "u2-outcome-5",
    
    "u2-outcome-6",
    
    "u2-step-1",
    
    "u2-step-2",
    
    "u2-step-3",
    
    "u2-step-4",
    
    "u2-step-5",
    
    "u2-step-6",
    
    "u2-maryam-step-1",
    
    "u2-maryam-step-2",
    
    "u2-maryam-step-3",
    
    "u2-maryam-step-4",
    
    "u2-maryam-step-5",
    
    "u2-maryam-step-6",
    
    "u2-err-1",
    
    "u2-err-2",
    
    "u2-err-3",
    
    "u2-err-4",
    
    "u2-err-5",
    
    "JRE-2-01",
    
    "JRE-2-02",
    
    "JRE-2-03"

  ]
};

export { CANONICAL_UNIT_3 } from './canonicalUnit3';
export { CANONICAL_UNIT_4 } from './canonicalUnit4';
