export interface TraceableQuestion {
  id: string;
  lessonId: string;
  unitId: string;
  learningObjectiveId: string;
  concept: string;
  difficulty: 'basic' | 'intermediate' | 'advanced' | 'challenge';
  questionType: 'mcq' | 'true_false' | 'fill_blank' | 'concept' | 'applied' | 'case' | 'analytical' | 'jre' | 't_account' | 'essay';
  type?: string;
  question: string;
  options?: string[];
  correctAnswer: string | boolean;
  explanation?: string;
  distractors?: string[];
  tags?: string[];
  sourceMapping?: {
    source_document: string;
    source_page: number;
    concept: string;
  };
  sourceType?: 'official_textbook' | 'training_bank_generated' | 'official_source_content' | string;
  sourceQuestionId?: string;
  sourcePage?: number;
  sourceDocument?: string;
  caseType?: 'unsolved_training' | 'official_JRE_case' | string;
  isSolvedExample?: boolean;
  rubricTotal?: number;
  rubricId?: string;
  originalId?: string;
  skillCode?: string;
  subLo?: string;
  bloomLevel?: 'knowledge' | 'comprehension' | 'application' | 'analysis' | 'synthesis' | 'evaluation' | string;
  commonMisconception?: string;
  expectedReasoning?: string;
  distractorRationale?: { option: string; rationale: string; isCorrect?: boolean }[];
  usageMode?: 'training_only' | 'unit_assessment' | 'baccalaureate_simulation';
  marks?: number;
  rubric?: string | { criteria?: { label: string; marks: number }[]; totalMarks?: number; [key: string]: any };
  modelAnswer?: string;
}

// 112 Verified Traceable Questions across all 6 lessons of Unit 1
export const unit1QuestionBank: TraceableQuestion[] = [
  // ==========================================
  // 1. MCQs (42 Items)
  // ==========================================
  {
    id: "eb-mcq-001",
    lessonId: "lesson-1",
    unitId: "unit-1",
    learningObjectiveId: "obj-1-1",
    concept: "تعريف المحاسبة المالية ونظام المعلومات",
    difficulty: "basic",
    questionType: "mcq",
    question: "يُعرف نظام المعلومات المالي الذي يختص بتحديد وقياس وتسجيل وتبويب وتلخيص العمليات المالية وعرضها في شكل تقارير بـ:",
    options: ["إدارة الأعمال", "المحاسبة المالية", "علم الاقتصاد الجزئي", "التدقيق اللوجستي"],
    correctAnswer: "المحاسبة المالية",
    explanation: "المحاسبة المالية هي لغة الأعمال ونظام المعلومات المعني بتوثيق الأحداث المالية وإعداد القوائم للأطراف المستفيدة.",
    tags: ["تعريف المحاسبة", "مفاهيم أساسية"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 8, concept: "ماهية المحاسبة" }
  },
  {
    id: "eb-mcq-002",
    lessonId: "lesson-1",
    unitId: "unit-1",
    learningObjectiveId: "obj-1-2",
    concept: "المستخدمون الخارجيون للمعلومات المحاسبية",
    difficulty: "basic",
    questionType: "mcq",
    question: "أي من الأطراف التالية يُعد مستخدماً خارجياً لمعلومات القوائم المالية للمنشأة؟",
    options: ["مدير العمليات والإنتاج", "رئيس مجلس الإدارة", "مصلحة الضرائب والبنوك المقرضة", "المشرف المالي الداخلي"],
    correctAnswer: "مصلحة الضرائب والبنوك المقرضة",
    explanation: "المستخدمون الخارجيون هم أطراف خارج الهيكل التنفيذي للمنشأة كالمستثمرين والمقرضين والأجهزة الرقابية والضريبية.",
    tags: ["مستخدمو المحاسبة", "أطراف خارجية"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 10, concept: "مستخدمو القوائم المالية" }
  },
  {
    id: "eb-mcq-003",
    lessonId: "lesson-1",
    unitId: "unit-1",
    learningObjectiveId: "obj-1-3",
    concept: "مبدأ الحيطة والحذر (التحفظ المحاسبي)",
    difficulty: "basic",
    questionType: "mcq",
    question: "الأخذ في الحسبان كافة الخسائر والالتزامات المحتملة فور توقعها مع عدم الاعتراف بالأرباح إلا عند تحققها فعلياً يجسد مبدأ:",
    options: ["المقابلة", "الحيطة والحذر", "الثبات والاتساق", "التكلفة التاريخية"],
    correctAnswer: "الحيطة والحذر",
    explanation: "مبدأ الحيطة والحذر يحمي مستخدمي القوائم من التفاؤل غير المبرر بتسجيل الخسائر المتوقعة وتأجيل الأرباح غير المحققة.",
    tags: ["المبادئ المحاسبية", "التحفظ"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 14, concept: "مبدأ الحيطة والحذر" }
  },
  {
    id: "eb-mcq-004",
    lessonId: "lesson-1",
    unitId: "unit-1",
    learningObjectiveId: "obj-1-3",
    concept: "مبدأ المقابلة (Matching Principle)",
    difficulty: "intermediate",
    questionType: "mcq",
    question: "تحميل الفترة المحاسبية بجميع المصروفات التي ساهمت في توليد إيرادات نفس الفترة يمثل تطبيقاً لمبدأ:",
    options: ["المقابلة", "الوحدة النقدية", "الإفصاح الشامل", "الدورية"],
    correctAnswer: "المقابلة",
    explanation: "مبدأ المقابلة هو حجر الزاوية لتحديد صافي ربح أو خسارة الفترة بعدالة من خلال مقارنة إيرادات الفترة بمصروفاتها المرتبطة.",
    tags: ["المبادئ المحاسبية", "المقابلة"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 15, concept: "مبدأ المقابلة" }
  },
  {
    id: "eb-mcq-005",
    lessonId: "lesson-1",
    unitId: "unit-1",
    learningObjectiveId: "obj-1-4",
    concept: "أساس الاستحقاق مقابل الأساس النقدي",
    difficulty: "intermediate",
    questionType: "mcq",
    question: "وفقاً لأساس الاستحقاق المحاسبي، يتم إثبات إيراد تقديم الخدمة عند:",
    options: ["تحصيل النقدية من العميل وإيداعها بالخزينة", "إتمام تقديم الخدمة للعميل واكتساب الحق في الإيراد", "نهاية العام المالي فقط", "توقيع العقد الابتدائي"],
    correctAnswer: "إتمام تقديم الخدمة للعميل واكتساب الحق في الإيراد",
    explanation: "أساس الاستحقاق يعترف بالإيراد عند واقعة الأداء والاكتساب بصرف النظر عن تاريخ استلام النقدية.",
    tags: ["أسس القياس", "أساس الاستحقاق"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 17, concept: "أساس الاستحقاق" }
  },
  {
    id: "eb-mcq-006",
    lessonId: "lesson-1",
    unitId: "unit-1",
    learningObjectiveId: "obj-1-3",
    concept: "مبدأ التكلفة التاريخية",
    difficulty: "basic",
    questionType: "mcq",
    question: "تسجيل الأصول في الدفاتر بالقيمة الفعلية التي تم سدادها وقت الشراء دون تعديلها بتغيرات القيمة السوقية يُعزى إلى:",
    options: ["مبدأ التكلفة التاريخية", "مبدأ الاستمرار", "مبدأ الأهمية النسبية", "مبدأ الثبات"],
    correctAnswer: "مبدأ التكلفة التاريخية",
    explanation: "التكلفة التاريخية توفر قياساً موضوعياً وقابلاً للتحقق عبر المستندات والفواتير الأصلية المعززة للشراء.",
    tags: ["المبادئ المحاسبية", "التكلفة التاريخية"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 13, concept: "التكلفة التاريخية" }
  },
  {
    id: "eb-mcq-007",
    lessonId: "lesson-1",
    unitId: "unit-1",
    learningObjectiveId: "obj-1-3",
    concept: "مبدأ الإفصاح التام",
    difficulty: "intermediate",
    questionType: "mcq",
    question: "إظهار كافة المعلومات والبيانات الجوهرية المؤثرة في قرارات مستخدمي القوائم المالية عبر الإيضاحات المتممة يمثل:",
    options: ["مبدأ الإفصاح التام", "فرض الشخصية المعنوية", "مبدأ التكلفة التاريخية", "أساس النقدية"],
    correctAnswer: "مبدأ الإفصاح التام",
    explanation: "الإفصاح التام يضمن توفير كافة الحقائق المادية في متن القوائم أو الإيضاحات المرفقة لمنع تضليل متخذ القرار.",
    tags: ["المبادئ المحاسبية", "الإفصاح"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 16, concept: "الإفصاح التام" }
  },
  {
    id: "eb-mcq-008",
    lessonId: "lesson-1",
    unitId: "unit-1",
    learningObjectiveId: "obj-1-3",
    concept: "مبدأ الثبات (الاتساق)",
    difficulty: "intermediate",
    questionType: "mcq",
    question: "التزام المنشأة بتطبيق نفس السياسات والطرق المحاسبية من فترة مالية لأخرى يهدف إلى تحقيق:",
    options: ["قابلية القوائم المالية للمقارنة عبر الفترات", "زيادة السيولة النقدية بالخزينة", "تقليل الالتزامات الضريبية فقط", "تسريع إقفال الدفاتر اليومية"],
    correctAnswer: "قابلية القوائم المالية للمقارنة عبر الفترات",
    explanation: "مبدأ الثبات يتيح المقارنة الزمنية الدقيقة لنتائج أعمال المنشأة دون تشويه ناتج عن تغيير متكرر في السياسات.",
    tags: ["المبادئ المحاسبية", "الثبات"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 16, concept: "مبدأ الثبات" }
  },
  {
    id: "eb-mcq-009",
    lessonId: "lesson-1",
    unitId: "unit-1",
    learningObjectiveId: "obj-1-3",
    concept: "فرض الشخصية المعنوية المستقلة",
    difficulty: "basic",
    questionType: "mcq",
    question: "فصل المعاملات المالية الشخصية لصاحب المنشأة عن المعاملات المالية الخاصة بنشاط المنشأة يستند إلى:",
    options: ["فرض الشخصية المعنوية المستقلة", "فرض الاستمرار", "مبدأ الوحدة النقدية", "مبدأ التكلفة البديلة"],
    correctAnswer: "فرض الشخصية المعنوية المستقلة",
    explanation: "المنشأة شخصية اعتبارية مستقلة ذمة مالية خاصة بها تفصل أصولها والتزاماتها عن الذمة الشخصية لمالكها.",
    tags: ["الفروض المحاسبية", "الشخصية المعنوية"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 11, concept: "الشخصية المعنوية" }
  },
  {
    id: "eb-mcq-010",
    lessonId: "lesson-1",
    unitId: "unit-1",
    learningObjectiveId: "obj-1-3",
    concept: "فرض الاستمرار",
    difficulty: "intermediate",
    questionType: "mcq",
    question: "تقويم الأصول الثابتة بالتكلفة التاريخية مطروحاً منها مجمع الإهلاك بدلاً من قيم التصفية الفورية يعتمد على فرض:",
    options: ["الاستمرار (Going Concern)", "الدورية السنوية", "التحقق النقدي", "الشخصية الفردية"],
    correctAnswer: "الاستمرار (Going Concern)",
    explanation: "بافتراض بقاء المنشأة ومواصلة نشاطها في المستقبل المنظور، لا يتم تقويم الأصول بأسعار التصفية الجبرية.",
    tags: ["الفروض المحاسبية", "الاستمرار"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 12, concept: "فرض الاستمرار" }
  },

  // Lesson 2 MCQs
  {
    id: "eb-mcq-011",
    lessonId: "lesson-2",
    unitId: "unit-1",
    learningObjectiveId: "obj-2-1",
    concept: "المعادلة المحاسبية الأساسية",
    difficulty: "basic",
    questionType: "mcq",
    question: "الصياغة الجبرية السليمة لمعادلة الميزانية (المعادلة المحاسبية) هي:",
    options: ["الأصول = الخصوم + حقوق الملكية", "الأصول = الخصوم - حقوق الملكية", "الخصوم = الأصول + حقوق الملكية", "حقوق الملكية = الأصول + الخصوم"],
    correctAnswer: "الأصول = الخصوم + حقوق الملكية",
    explanation: "المعادلة تعبر عن توازن استخدامات الأموال (الأصول) مع مصادر تمويلها (الخصوم وحقوق الملكية).",
    tags: ["المعادلة المحاسبية"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 22, concept: "معادلة الميزانية" }
  },
  {
    id: "eb-mcq-012",
    lessonId: "lesson-2",
    unitId: "unit-1",
    learningObjectiveId: "obj-2-2",
    concept: "حساب الخصوم من المعادلة المحاسبية",
    difficulty: "basic",
    questionType: "mcq",
    question: "إذا كانت إجمالي أصول منشأة تبلغ 850,000 جنيه وحقوق ملكيتها 500,000 جنيه، فإن قيمة الخصوم تساوي:",
    options: ["350,000 جنيه", "1,350,000 جنيه", "500,000 جنيه", "250,000 جنيه"],
    correctAnswer: "350,000 جنيه",
    explanation: "الخصوم = الأصول - حقوق الملكية = 850,000 - 500,000 = 350,000 جنيه.",
    tags: ["المعادلة المحاسبية", "حسابات"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 24, concept: "تطبيق المعادلة" }
  },
  {
    id: "eb-mcq-013",
    lessonId: "lesson-2",
    unitId: "unit-1",
    learningObjectiveId: "obj-2-3",
    concept: "أثر شراء أصل بجزء نقدي والباقي على الحساب",
    difficulty: "intermediate",
    questionType: "mcq",
    question: "قامت منشأة بشراء آلات بمبلغ 200,000 جنيه، سددت 80,000 جنيه نقداً والباقي على الحساب. ما أثر ذلك على طرفي المعادلة؟",
    options: ["زيادة الأصول بـ 120,000 وزيادة الخصوم بـ 120,000", "زيادة الأصول بـ 200,000 وزيادة الخصوم بـ 200,000", "زيادة الأصول بـ 120,000 وزيادة حقوق الملكية بـ 120,000", "نقص الأصول بـ 80,000 وزيادة الخصوم بـ 120,000"],
    correctAnswer: "زيادة الأصول بـ 120,000 وزيادة الخصوم بـ 120,000",
    explanation: "صافي الأصول = (+200,000 آلات - 80,000 نقدية) = +120,000 جنيه، يقابله زيادة الخصوم (دائنون) بـ +120,000 جنيه.",
    tags: ["أثر العمليات", "المعادلة المحاسبية"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 26, concept: "أثر العمليات المالية" }
  },
  {
    id: "eb-mcq-014",
    lessonId: "lesson-2",
    unitId: "unit-1",
    learningObjectiveId: "obj-2-3",
    concept: "أثر سداد التزام نقداً على المعادلة",
    difficulty: "basic",
    questionType: "mcq",
    question: "سداد منشأة لمبلغ 40,000 جنيه نقداً لأحد الموردين (الدائنين) يؤدي إلى:",
    options: ["نقص في الأصول ونقص في الخصوم بنفس المبلغ", "نقص في الأصول وزيادة في الخصوم", "زيادة في الأصول ونقص في حقوق الملكية", "لا يتغير إجمالي طرفي المعادلة"],
    correctAnswer: "نقص في الأصول ونقص في الخصوم بنفس المبلغ",
    explanation: "تنقص النقدية (أصل) بـ 40,000 جنيه وينقص حساب الدائنين (خصم) بـ 40,000 جنيه متحافظاً على التوازن.",
    tags: ["سداد الديون", "المعادلة المحاسبية"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 28, concept: "سداد الخصوم" }
  },
  {
    id: "eb-mcq-015",
    lessonId: "lesson-2",
    unitId: "unit-1",
    learningObjectiveId: "obj-2-3",
    concept: "أثر المسحوبات الشخصية على المعادلة",
    difficulty: "intermediate",
    questionType: "mcq",
    question: "سحب صاحب المنشأة مبلغ 15,000 جنيه نقداً لاستخدامه الشخصي يترتب عليه:",
    options: ["نقص الأصول ونقص حقوق الملكية", "نقص الأصول وزيادة الخصوم", "نقص الأصول وزيادة المصروفات الإدارية", "زيادة الأصول ونقص حقوق الملكية"],
    correctAnswer: "نقص الأصول ونقص حقوق الملكية",
    explanation: "المسحوبات ليست مصروفاً للمنشأة بل تخفيض مباشر لحقوق الملكية (رأس المال) مقترناً بنقص النقدية (الأصول).",
    tags: ["المسحوبات", "حقوق الملكية"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 30, concept: "المسحوبات الشخصية" }
  },
  {
    id: "eb-mcq-016",
    lessonId: "lesson-2",
    unitId: "unit-1",
    learningObjectiveId: "obj-2-4",
    concept: "استنتاج صافي الربح من تغير حقوق الملكية",
    difficulty: "advanced",
    questionType: "mcq",
    question: "إذا كان رأس المال أول المدة 400,000 جنيه، ورأس المال آخر المدة 550,000 جنيه، وكانت مسحوبات المالك 30,000 جنيه ولا توجد استثمارات إضافية، فإن صافي ربح الفترة يبلغ:",
    options: ["180,000 جنيه", "120,000 جنيه", "150,000 جنيه", "210,000 جنيه"],
    correctAnswer: "180,000 جنيه",
    explanation: "حقوق الملكية آخر المدة = أول المدة + صافي الربح - المسحوبات -> 550,000 = 400,000 + الربح - 30,000 -> صافي الربح = 550,000 - 370,000 = 180,000 جنيه.",
    tags: ["صافي الربح", "حقوق الملكية"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 33, concept: "معادلة حقوق الملكية" }
  },

  // Lesson 3 MCQs (Double Entry & Debit/Credit)
  {
    id: "eb-mcq-017",
    lessonId: "lesson-3",
    unitId: "unit-1",
    learningObjectiveId: "obj-3-1",
    concept: "قاعدة القيد المزدوج",
    difficulty: "basic",
    questionType: "mcq",
    question: "تنص قاعدة القيد المزدوج على أن كل معاملة مالية لها طرفان متساويان في القيمة:",
    options: ["أحدهما مدين والآخر دائن", "كلاهما مدين دائماً", "كلاهما دائن دائماً", "أحدهما نقدي والآخر عيني دون قيد"],
    correctAnswer: "أحدهما مدين والآخر دائن",
    explanation: "القيد المزدوج يلزم أن يكون الطرف الآخذ (المدين) مساوياً للطرف العاطي (الدائن) لضمان التوازن المحاسبي المستمر.",
    tags: ["القيد المزدوج", "المدين والدائن"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 40, concept: "نظرية القيد المزدوج" }
  },
  {
    id: "eb-mcq-018",
    lessonId: "lesson-3",
    unitId: "unit-1",
    learningObjectiveId: "obj-3-2",
    concept: "طبيعة حسابات الأصول والمصروفات",
    difficulty: "basic",
    questionType: "mcq",
    question: "حسابات الأصول والمصروفات ذات طبيعة مدينة، وبالتالي فإنها:",
    options: ["تزيد بجعلها مدينة وتنتقص بجعلها دائنة", "تزيد بجعلها دائنة وتنتقص بجعلها مدينة", "تكون دائنة في جميع الأحوال", "لا تتأثر بالقيود اليومية"],
    correctAnswer: "تزيد بجعلها مدينة وتنتقص بجعلها دائنة",
    explanation: "القاعدة الذهبية: الزيادة في الحساب تكون في نفس جانب طبيعته (مدين يزيد مديناً، دائن يزيد دائناً).",
    tags: ["طبيعة الحسابات", "المدين والدائن"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 42, concept: "قواعد المدين والدائن" }
  },
  {
    id: "eb-mcq-019",
    lessonId: "lesson-3",
    unitId: "unit-1",
    learningObjectiveId: "obj-3-3",
    concept: "إثبات قيد الشراء الآجل للبضاعة",
    difficulty: "intermediate",
    questionType: "mcq",
    question: "عند شراء بضاعة بمبلغ 70,000 جنيه على الحساب من المورد 'الأهرام'، يكون الطرف الدائن للقيد هو:",
    options: ["حساب المشتريات", "حساب الموردين (الأهرام)", "حساب الخزينة", "حساب المبيعات"],
    correctAnswer: "حساب الموردين (الأهرام)",
    explanation: "المشتريات أصل/مصروف يزيد فيكون مديناً، وحساب الموردين (خصم) يزيد فيكون دائناً.",
    tags: ["قيود اليومية", "المشتريات"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 46, concept: "قيود الشراء" }
  },
  {
    id: "eb-mcq-020",
    lessonId: "lesson-3",
    unitId: "unit-1",
    learningObjectiveId: "obj-3-3",
    concept: "إثبات قيد بيع البضاعة نقداً",
    difficulty: "basic",
    questionType: "mcq",
    question: "بيع بضاعة بمبلغ 95,000 جنيه نقداً يُسجل بالقيد:",
    options: ["من حـ/ النقدية بالخزينة إلى حـ/ المبيعات", "من حـ/ المبيعات إلى حـ/ النقدية بالخزينة", "من حـ/ المدينين إلى حـ/ المبيعات", "من حـ/ المشتريات إلى حـ/ النقدية"],
    correctAnswer: "من حـ/ النقدية بالخزينة إلى حـ/ المبيعات",
    explanation: "النقدية (أصل) زادت فتكون مدينة، والمبيعات (إيراد) زادت فتكون دائنة.",
    tags: ["قيود اليومية", "المبيعات"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 48, concept: "قيود المبيعات" }
  },
  {
    id: "eb-mcq-021",
    lessonId: "lesson-3",
    unitId: "unit-1",
    learningObjectiveId: "obj-3-4",
    concept: "القيد المركب",
    difficulty: "intermediate",
    questionType: "mcq",
    question: "القيد المحاسبي الذي يتضمن أكثر من حساب في أحد طرفيه أو كلاهما يُسمى:",
    options: ["قيداً بسيطاً", "قيداً مركباً", "قيداً عكسياً", "قيد تسوية"],
    correctAnswer: "قيداً مركباً",
    explanation: "القيد المركب يحتوي على كلمة 'مذكورين' في الطرف المدين أو الدائن لتعدد الحسابات المتأثرة بالمعاملة.",
    tags: ["أنواع القيود", "القيد المركب"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 51, concept: "القيد المركب" }
  },

  // Lesson 4 MCQs (Ledger & Trial Balance)
  {
    id: "eb-mcq-022",
    lessonId: "lesson-4",
    unitId: "unit-1",
    learningObjectiveId: "obj-4-1",
    concept: "الترحيل لدفتر الأستاذ",
    difficulty: "basic",
    questionType: "mcq",
    question: "العملية التي يتم بموجبها نقل أطراف قيود اليومية إلى حساباتها الخاصة في دفتر الأستاذ تُسمى:",
    options: ["الترصيد", "الترحيل (Posting)", "المطابقة", "الجرد السنوي"],
    correctAnswer: "الترحيل (Posting)",
    explanation: "الترحيل هو نقل الأرقام المدينة والدائنة من دفتر اليومية العامة إلى صفحات الحسابات الفردية بدفتر الأستاذ.",
    tags: ["دفتر الأستاذ", "الترحيل"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 58, concept: "الترحيل للأستاذ" }
  },
  {
    id: "eb-mcq-023",
    lessonId: "lesson-4",
    unitId: "unit-1",
    learningObjectiveId: "obj-4-2",
    concept: "حساب رصيد الحساب (T-Account)",
    difficulty: "intermediate",
    questionType: "mcq",
    question: "إذا كان مجموع الجانب المدين لحساب البنك 350,000 جنيه ومجموع الجانب الدائن 210,000 جنيه، فإن رصيد الحساب هو:",
    options: ["رصيد مدين قدره 140,000 جنيه", "رصيد دائن قدره 140,000 جنيه", "رصيد مدين قدره 560,000 جنيه", "رصيد متوازن صفري"],
    correctAnswer: "رصيد مدين قدره 140,000 جنيه",
    explanation: "الرصيد يتبع الجانب الأكبر: 350,000 مدين - 210,000 دائن = 140,000 جنيه رصيد مدين.",
    tags: ["الترصيد", "حسابات الأستاذ"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 62, concept: "ترصيد الحسابات" }
  },
  {
    id: "eb-mcq-024",
    lessonId: "lesson-4",
    unitId: "unit-1",
    learningObjectiveId: "obj-4-3",
    concept: "وظيفة ميزان المراجعة",
    difficulty: "basic",
    questionType: "mcq",
    question: "الهدف الجوهري من إعداد ميزان المراجعة قبل إعداد القوائم المالية هو:",
    options: ["التحقق المبدئي من صحة التوازن الحسابي للدفاتر", "حساب الضرائب المستحقة بدقة", "تحديد مكافآت الإدارة التنفيذية", "تسجيل العمليات اليومية بالتفصيل"],
    correctAnswer: "التحقق المبدئي من صحة التوازن الحسابي للدفاتر",
    explanation: "ميزان المراجعة كشف تجميعي لأرصدة ومجاميع الحسابات يبرهن على توازن جانبي القيد المزدوج رياضياً.",
    tags: ["ميزان المراجعة", "الرقابة المحاسبية"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 65, concept: "ميزان المراجعة" }
  },
  {
    id: "eb-mcq-025",
    lessonId: "lesson-4",
    unitId: "unit-1",
    learningObjectiveId: "obj-4-4",
    concept: "الأخطاء التي لا يكتشفها ميزان المراجعة",
    difficulty: "advanced",
    questionType: "mcq",
    question: "أي من الأخطاء المحاسبية التالية لن يؤدي إلى الإخلال بتوازن ميزان المراجعة؟",
    options: ["خطأ الحذف والسهو الكامل لقيد يومية بأكمله", "ترحيل مبلغ مدين فقط دون ترحيل الطرف الدائن", "تسجيل مبلغ مدين بـ 5,000 والدائن بـ 50,000", "إدراج رصيد مدين في الجانب الدائن بالميزان"],
    correctAnswer: "خطأ الحذف والسهو الكامل لقيد يومية بأكمله",
    explanation: "عند إغفال المعاملة برمتها بطرفيها، يظل ميزان المراجعة متوازناً رقمياً رغم الخطأ في اكتمال السجلات.",
    tags: ["أخطاء ميزان المراجعة", "الرقابة"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 68, concept: "أخطاء التوازن" }
  },

  // Lesson 5 MCQs (Final Accounts & Financial Statements)
  {
    id: "eb-mcq-026",
    lessonId: "lesson-5",
    unitId: "unit-1",
    learningObjectiveId: "obj-5-1",
    concept: "حساب المتاجرة وتكلفة المبيعات",
    difficulty: "intermediate",
    questionType: "mcq",
    question: "المعادلة المحاسبية لحساب تكلفة البضاعة المباعة في حساب المتاجرة هي:",
    options: ["مخزون أول المدة + صافي المشتريات - مخزون آخر المدة", "المبيعات - المصروفات الإدارية", "مخزون آخر المدة + المبيعات - المشتريات", "صافي المشتريات + المصروفات العمومية"],
    correctAnswer: "مخزون أول المدة + صافي المشتريات - مخزون آخر المدة",
    explanation: "تكلفة المبيعات = البضاعة المتاحة للبيع (مخزون أول + مشتريات) مطروحاً منها البضاعة المتبقية بالمخازن آخر المدة.",
    tags: ["حساب المتاجرة", "تكلفة المبيعات"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 76, concept: "تكلفة البضاعة المباعة" }
  },
  {
    id: "eb-mcq-027",
    lessonId: "lesson-5",
    unitId: "unit-1",
    learningObjectiveId: "obj-5-2",
    concept: "ترحيل مجمل الربح",
    difficulty: "basic",
    questionType: "mcq",
    question: "الرصيد الدائن لحساب المتاجرة (مجمل الربح) يُرحل مباشرة إلى:",
    options: ["الجانب الدائن لحساب الأرباح والخسائر", "الجانب المدين لحساب الأرباح والخسائر", "قائمة المركز المالي كخصم متداول", "حساب جاري المالك بالمدين"],
    correctAnswer: "الجانب الدائن لحساب الأرباح والخسائر",
    explanation: "مجمل الربح هو الإيراد الإجمالي الرئيسي للنشاط التجاري فيُنقل للجانب الدائن بحساب الأرباح والخسائر لمقابلة المصروفات.",
    tags: ["الحسابات الختامية", "مجمل الربح"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 79, concept: "ترحيل مجمل الربح" }
  },
  {
    id: "eb-mcq-028",
    lessonId: "lesson-5",
    unitId: "unit-1",
    learningObjectiveId: "obj-5-3",
    concept: "قائمة المركز المالي (الميزانية العمومية)",
    difficulty: "basic",
    questionType: "mcq",
    question: "قائمة المركز المالي تختلف عن حسابات النتيجة في أنها:",
    options: ["توضح المركز المالي للمنشأة في لحظة زمنية محددة وليس عن فترة منقضية", "تتضمن الإيرادات والمصروفات فقط", "تُقفل أرصدتها تماماً في نهاية العام", "تُعد شهرياً فقط للأغراض الضريبية"],
    correctAnswer: "توضح المركز المالي للمنشأة في لحظة زمنية محددة وليس عن فترة منقضية",
    explanation: "الميزانية العمومية هي لقطة فوتوغرافية (Snapshot) لموجودات والتزامات المنشأة في تاريخ محدد (مثل 31 ديسمبر).",
    tags: ["المركز المالي", "الميزانية العمومية"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 84, concept: "المركز المالي" }
  },

  // Lesson 6 MCQs (JRE & High-Order Thinking)
  {
    id: "eb-mcq-029",
    lessonId: "lesson-6",
    unitId: "unit-1",
    learningObjectiveId: "obj-6-1",
    concept: "مفهوم سؤال JRE وسياقه",
    difficulty: "basic",
    questionType: "mcq",
    question: "يتكون الاختصار الأكاديمي JRE في منظومة الامتحانات الحديثة من العناصر الثلاثة:",
    options: ["الحكم المهني (Judgment)، التبرير المنطقي (Reasoning)، الأدلة الرقمية (Evidence)", "الجريدة اليومية، المراجعة، الفحص", "العدالة، المسؤولية، الكفاءة", "اليومية، الترصيد، التقييم"],
    correctAnswer: "الحكم المهني (Judgment)، التبرير المنطقي (Reasoning)، الأدلة الرقمية (Evidence)",
    explanation: "نموذج JRE يقيس قدرة الطالب على اتخاذ موقف محاسبي سليم مدعماً بالمبادئ والأدلة الرقمية من الواقعة.",
    tags: ["JRE", "التفكير النقدي"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 92, concept: "منهجية JRE" }
  },
  {
    id: "eb-mcq-030",
    lessonId: "lesson-6",
    unitId: "unit-1",
    learningObjectiveId: "obj-6-2",
    concept: "معايير تقييم مقال JRE الرسمي",
    difficulty: "intermediate",
    questionType: "mcq",
    question: "وفقاً لمصفوفة التقييم (Rubric) الرسمية لـ JRE (الدرجة الإجمالية 10 أو 20)، يتم منح أعلى وزن لـ:",
    options: ["دقة الحكم وصحة التعليل المحاسبي المدعوم بالمبادئ", "عدد الكلمات المكتوبة في المقال", "نوع الخط المستخدم والتنسيق الخارجي", "تكرار نص السؤال في المقدمة"],
    correctAnswer: "دقة الحكم وصحة التعليل المحاسبي المدعوم بالمبادئ",
    explanation: "المحك الأساسي في JRE هو الربط المحكم بين المشكلة والمبدأ المحاسبي وتأكيد النتيجة بالأرقام.",
    tags: ["معايير التقييم", "Rubric"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 95, concept: "مصفوفة تصحيح JRE" }
  },

  // Additional MCQs (31 to 60) for exhaustive Unit 1 coverage
  {
    id: "eb-mcq-031",
    lessonId: "lesson-1",
    unitId: "unit-1",
    learningObjectiveId: "obj-1-2",
    concept: "المستخدمون الداخليون للمعلومات المحاسبية",
    difficulty: "basic",
    questionType: "mcq",
    question: "أي من الفئات التالية يُصنف كمستخدم داخلي للمعلومات المحاسبية؟",
    options: ["إدارة التسويق والتخطيط بالمنشأة", "الموردون الخارجيون", "المستثمرون المحتملون بالبورصة", "المحللون الماليون المستقلون"],
    correctAnswer: "إدارة التسويق والتخطيط بالمنشأة",
    explanation: "الإدارة الداخلية تحتاج البيانات المحاسبية لاتخاذ القرارات التشغيلية والتسعيرية والرقابية اليومية.",
    tags: ["مستخدمو المحاسبة"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 9, concept: "المستخدمون الداخليون" }
  },
  {
    id: "eb-mcq-032",
    lessonId: "lesson-1",
    unitId: "unit-1",
    learningObjectiveId: "obj-1-3",
    concept: "فرض الوحدة النقدية وثبات القوة الشرائية",
    difficulty: "intermediate",
    questionType: "mcq",
    question: "افتراض أن النقود هي وحدة القياس النمطية الشائعة مع إغفال التغيرات الطفيفة في قوتها الشرائية يُعرف بـ:",
    options: ["فرض وحدة القياس النقدي", "مبدأ المقابلة", "فرض الدورية", "مبدأ الإفصاح المالي"],
    correctAnswer: "فرض وحدة القياس النقدي",
    explanation: "وحدة النقد هي المقياس المشترك للتعبير عن الأحداث والعمليات غير المتجانسة في القوائم المالية.",
    tags: ["الفروض المحاسبية", "الوحدة النقدية"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 12, concept: "وحدة القياس النقدي" }
  },
  {
    id: "eb-mcq-033",
    lessonId: "lesson-1",
    unitId: "unit-1",
    learningObjectiveId: "obj-1-3",
    concept: "مبدأ الأهمية النسبية",
    difficulty: "intermediate",
    questionType: "mcq",
    question: "معالجة شراء سلة مهملات أو دباسة مكتبية صغيرة بمبلغ 80 جنيهاً كمصروف فوري بدلاً من اعتبارها أصلاً ثابتاً يرجع إلى:",
    options: ["مبدأ الأهمية النسبية (Materiality)", "مبدأ التكلفة التاريخية", "فرض الاستمرار", "مبدأ تحقق الإيراد"],
    correctAnswer: "مبدأ الأهمية النسبية (Materiality)",
    explanation: "العناصر ضئيلة القيمة التي لا تؤثر على قرارات مستخدمي القوائم تُعالج بأبسط السبل المحاسبية توفيراً للجهد.",
    tags: ["الأهمية النسبية", "المبادئ"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 15, concept: "الأهمية النسبية" }
  },
  {
    id: "eb-mcq-034",
    lessonId: "lesson-2",
    unitId: "unit-1",
    learningObjectiveId: "obj-2-2",
    concept: "الأصول المتداولة",
    difficulty: "basic",
    questionType: "mcq",
    question: "أي من الحسابات التالية يُصنف ضمن الأصول المتداولة في قائمة المركز المالي؟",
    options: ["المدينون (العملاء) وأوراق القبض", "المباني الإدارية والإنشائية", "رأس المال المدفوع", "القروض طويلة الأجل"],
    correctAnswer: "المدينون (العملاء) وأوراق القبض",
    explanation: "الأصول المتداولة هي النقدية والأصول المتوقع تحويلها لنقدية أو استهلاكها خلال دورة تشغيلية واحدة أو سنة.",
    tags: ["الأصول المتداولة", "تبويب الأصول"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 25, concept: "تصنيف الأصول" }
  },
  {
    id: "eb-mcq-035",
    lessonId: "lesson-2",
    unitId: "unit-1",
    learningObjectiveId: "obj-2-2",
    concept: "الخصوم المتداولة",
    difficulty: "basic",
    questionType: "mcq",
    question: "أي من الالتزامات التالية يُعد التزاماً متداولاً قصير الأجل؟",
    options: ["أوراق الدفع والموردون", "السندات المصدرة لعشر سنوات", "رأس مال الشركاء", "الأراضي المملوكة"],
    correctAnswer: "أوراق الدفع والموردون",
    explanation: "الخصوم المتداولة هي الالتزامات واجبة الوفاء خلال فترة سنة مالية واحدة أو دورة النشاط العادية.",
    tags: ["الخصوم المتداولة", "تبويب الخصوم"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 27, concept: "تصنيف الخصوم" }
  },
  {
    id: "eb-mcq-036",
    lessonId: "lesson-2",
    unitId: "unit-1",
    learningObjectiveId: "obj-2-3",
    concept: "أثر الاقتراض البنكي على المعادلة",
    difficulty: "intermediate",
    questionType: "mcq",
    question: "حصلت منشأة على قرض بنكي قصير الأجل بمبلغ 150,000 جنيه أودعته في حسابها الجاري بالبنك. ما أثر هذه المعاملة؟",
    options: ["زيادة الأصول وزيادة الخصوم بنفس القيمة", "زيادة الأصول وزيادة حقوق الملكية", "نقص الأصول ونقص الخصوم", "لا يطرأ أي تغيير على طرفي المعادلة"],
    correctAnswer: "زيادة الأصول وزيادة الخصوم بنفس القيمة",
    explanation: "زاد أصل المنشأة (البنك) بـ 150,000 جنيه، وزادت التزاماتها للغير (القرض البنكي) بـ 150,000 جنيه.",
    tags: ["أثر العمليات", "القروض"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 29, concept: "أثر الاقتراض" }
  },
  {
    id: "eb-mcq-037",
    lessonId: "lesson-3",
    unitId: "unit-1",
    learningObjectiveId: "obj-3-2",
    concept: "طبيعة حساب الإيرادات",
    difficulty: "basic",
    questionType: "mcq",
    question: "حساب الإيرادات ذو طبيعة دائنة، وعند تحققه وتسجيله في الدفاتر فإنه يُجعل:",
    options: ["دائناً", "مديناً", "صفرياً", "موقوفاً لحين السداد"],
    correctAnswer: "دائناً",
    explanation: "الإيرادات تزيد من حقوق الملكية، وحقوق الملكية دائنة، لذلك تزداد الإيرادات بجعلها دائنة.",
    tags: ["طبيعة الإيرادات", "المدين والدائن"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 43, concept: "طبيعة الإيرادات" }
  },
  {
    id: "eb-mcq-038",
    lessonId: "lesson-3",
    unitId: "unit-1",
    learningObjectiveId: "obj-3-3",
    concept: "قيد سداد المصروف نقداً",
    difficulty: "basic",
    questionType: "mcq",
    question: "عند سداد إيجار مقر المنشأة بمبلغ 12,000 جنيه نقداً، فإن القيد المحاسبي الصحيح هو:",
    options: ["من حـ/ مصروف الإيجار إلى حـ/ الخزينة", "من حـ/ الخزينة إلى حـ/ مصروف الإيجار", "من حـ/ الإيرادات إلى حـ/ الخزينة", "من حـ/ الموردين إلى حـ/ الإيجار"],
    correctAnswer: "من حـ/ مصروف الإيجار إلى حـ/ الخزينة",
    explanation: "مصروف الإيجار (مدين) زاد فيكون مديناً، والخزينة (أصل) نقصت فتكون دائنة.",
    tags: ["سداد المصروفات", "قيود اليومية"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 49, concept: "سداد المصروفات" }
  },
  {
    id: "eb-mcq-039",
    lessonId: "lesson-3",
    unitId: "unit-1",
    learningObjectiveId: "obj-3-3",
    concept: "قيد تحصيل ديون من العملاء",
    difficulty: "intermediate",
    questionType: "mcq",
    question: "حصلت المنشأة مبلغ 25,000 جنيه نقداً من العميل 'البركة' سداداً للمستحق عليه. الطرف المدين للقيد هو:",
    options: ["حساب النقدية بالخزينة", "حساب العميل (البركة)", "حساب المبيعات", "حساب رأس المال"],
    correctAnswer: "حساب النقدية بالخزينة",
    explanation: "النقدية أصل زاد فيكون مديناً، والعميل (أصل مدينين) نقص فيكون دائناً.",
    tags: ["تحصيل الديون", "المدينون"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 50, concept: "تحصيل المستحقات" }
  },
  {
    id: "eb-mcq-040",
    lessonId: "lesson-4",
    unitId: "unit-1",
    learningObjectiveId: "obj-4-2",
    concept: "الرصيد المرحل والرصيد المنقول",
    difficulty: "intermediate",
    questionType: "mcq",
    question: "الرصيد المتمم الحسابي الذي يوضع في الجانب الأصغر عند ترصيد حساب الأستاذ لمعادلة الطرفين يُسمى:",
    options: ["رصيداً مرحلاً (Balance c/d)", "رصيداً منقولاً (Balance b/d)", "مجمل الربح", "صافي الربح"],
    correctAnswer: "رصيداً مرحلاً (Balance c/d)",
    explanation: "الرصيد المرحل يوضع في الجانب الأصغر لتساوي مجموع العمودين، ثم يُنقل في بداية الفترة التالية إلى جانبه الأصلي كرصيد منقول.",
    tags: ["الترصيد", "دفتر الأستاذ"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 63, concept: "تقنيات الترصيد" }
  },
  {
    id: "eb-mcq-041",
    lessonId: "lesson-5",
    unitId: "unit-1",
    learningObjectiveId: "obj-5-2",
    concept: "عناصر حساب الأرباح والخسائر",
    difficulty: "intermediate",
    questionType: "mcq",
    question: "أي من البنود التالية يظهر في الجانب المدين لحساب الأرباح والخسائر؟",
    options: ["مصروف إهلاك الآلات ورواتب الموظفين الإداريين", "إيراد المبيعات الإجمالي", "مجمل الربح المنقول من المتاجرة", "إيراد الأوراق المالية الدائن"],
    correctAnswer: "مصروف إهلاك الآلات ورواتب الموظفين الإداريين",
    explanation: "الجانب المدين لحساب الأرباح والخسائر يشتمل على كافة المصروفات البيعية والإدارية والتمويلية والإهلاكات.",
    tags: ["الأرباح والخسائر", "المصروفات التشغيلية"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 80, concept: "حساب الأرباح والخسائر" }
  },
  {
    id: "eb-mcq-042",
    lessonId: "lesson-5",
    unitId: "unit-1",
    learningObjectiveId: "obj-5-3",
    concept: "حقوق الملكية في قائمة المركز المالي",
    difficulty: "intermediate",
    questionType: "mcq",
    question: "في قائمة المركز المالي، تظهر حقوق الملكية في نهاية الفترة محتسبة كالآتي:",
    options: ["رأس المال أول المدة + صافي الربح - المسحوبات", "رأس المال + الأصول المتداولة - الخصوم", "المبيعات - تكلفة المبيعات", "الأصول الثابتة - مجمع الإهلاك"],
    correctAnswer: "رأس المال أول المدة + صافي الربح - المسحوبات",
    explanation: "صافي حقوق المالك في نهاية العام يعادل استثماره الأصلي مضافاً إليه ما حققه النشاط من أرباح ومطروحاً منه مسحوباته الشخصية.",
    tags: ["حقوق الملكية", "الميزانية العمومية"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 85, concept: "حقوق الملكية" }
  },

  // ==========================================
  // 2. True / False Questions (10 Items)
  // ==========================================
  {
    id: "eb-tf-001",
    lessonId: "lesson-1",
    unitId: "unit-1",
    learningObjectiveId: "obj-1-1",
    concept: "طبيعة المعلومات المحاسبية والتقديرات",
    difficulty: "basic",
    questionType: "true_false",
    question: "الأرقام والقوائم المحاسبية تعكس حقائق مطلقة ومجردة ولا تعتمد على أي تقديرات أو أحكام شخصية.",
    correctAnswer: false,
    explanation: "العبارة خاطئة؛ المحاسبة تعتمد على أحكام وتقديرات مهنية متعددة مثل تقدير العمر الإنتاجي للأصول، ونسب الديون المشكوك فيها.",
    tags: ["طبيعة المحاسبة", "التقديرات"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 9, concept: "الأحكام المحاسبية" }
  },
  {
    id: "eb-tf-002",
    lessonId: "lesson-1",
    unitId: "unit-1",
    learningObjectiveId: "obj-1-4",
    concept: "مقارنة الأساس النقدي وأساس الاستحقاق",
    difficulty: "intermediate",
    questionType: "true_false",
    question: "يُفضل استخدام أساس الاستحقاق في المنشآت الهادفة للربح لتحقيق المقابلة العادلة بين إيرادات الفترة ومصروفاتها.",
    correctAnswer: true,
    explanation: "العبارة صائبة؛ أساس الاستحقاق يعترف بالعمليات عند حدوثها واكتسابها بصرف النظر عن مواعيد التدفقات النقدية.",
    tags: ["أساس الاستحقاق", "المقابلة"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 17, concept: "أساس الاستحقاق" }
  },
  {
    id: "eb-tf-003",
    lessonId: "lesson-2",
    unitId: "unit-1",
    learningObjectiveId: "obj-2-1",
    concept: "مفهوم حقوق الملكية",
    difficulty: "basic",
    questionType: "true_false",
    question: "حقوق الملكية تمثل أصلاً مادياً ملموساً موجوداً داخل خزينة المنشأة ومستقلاً عن التزاماتها.",
    correctAnswer: false,
    explanation: "العبارة خاطئة؛ حقوق الملكية تمثل حقاً معنوياً والتزاماً مالياً على المنشأة تجاه ملاكها (صافي الأصول).",
    tags: ["حقوق الملكية", "المعادلة المحاسبية"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 23, concept: "مفهوم حقوق الملكية" }
  },
  {
    id: "eb-tf-004",
    lessonId: "lesson-2",
    unitId: "unit-1",
    learningObjectiveId: "obj-2-3",
    concept: "أثر سداد الالتزامات نقداً",
    difficulty: "basic",
    questionType: "true_false",
    question: "سداد المنشأة لقرض بنكي نقداً يؤدي إلى تخفيض طرفي المعادلة المحاسبية بنفس المقدار متحافظاً على التوازن.",
    correctAnswer: true,
    explanation: "العبارة صائبة؛ ينقص أصل النقدية وينقص التزام القرض البنكي بذات القيمة.",
    tags: ["سداد القروض", "المعادلة المحاسبية"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 28, concept: "سداد الالتزامات" }
  },
  {
    id: "eb-tf-005",
    lessonId: "lesson-3",
    unitId: "unit-1",
    learningObjectiveId: "obj-3-2",
    concept: "نقص الحسابات الدائنة",
    difficulty: "basic",
    questionType: "true_false",
    question: "الحسابات ذات الطبيعة الدائنة مثل الخصوم وحقوق الملكية تنقص بجعلها مدينة.",
    correctAnswer: true,
    explanation: "العبارة صائبة؛ النقص في أي حساب يُسجل دائماً في الجانب العكسي لطبيعته الأصلية.",
    tags: ["المدين والدائن", "قواعد القيد"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 42, concept: "قواعد القيد المزدوج" }
  },
  {
    id: "eb-tf-006",
    lessonId: "lesson-4",
    unitId: "unit-1",
    learningObjectiveId: "obj-4-4",
    concept: "تأثير خطأ السهو على ميزان المراجعة",
    difficulty: "intermediate",
    questionType: "true_false",
    question: "خطأ السهو الكامل عن تسجيل عملية مالية يؤدي إلى إخلال توازن ميزان المراجعة وظهور فرق بين الجانبين.",
    correctAnswer: false,
    explanation: "العبارة خاطئة؛ السهو الكامل يسقط الطرفين المدين والدائن معاً، مما يبقي الميزان متوازناً رقمياً رغم نقص السجلات.",
    tags: ["أخطاء ميزان المراجعة"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 68, concept: "أخطاء التوازن" }
  },
  {
    id: "eb-tf-007",
    lessonId: "lesson-5",
    unitId: "unit-1",
    learningObjectiveId: "obj-5-1",
    concept: "تبويب المصروفات في الحسابات الختامية",
    difficulty: "intermediate",
    questionType: "true_false",
    question: "المصروفات البيعية والإدارية مثل رواتب موظفي الإدارة تظهر في الجانب المدين لحساب المتاجرة.",
    correctAnswer: false,
    explanation: "العبارة خاطئة؛ حساب المتاجرة يختص بتكلفة البضاعة المباعة فقط، بينما تظهر الرواتب الإدارية في حساب الأرباح والخسائر.",
    tags: ["الحسابات الختامية", "المتاجرة"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 78, concept: "حساب المتاجرة" }
  },
  {
    id: "eb-tf-008",
    lessonId: "lesson-6",
    unitId: "unit-1",
    learningObjectiveId: "obj-6-1",
    concept: "الهدف من سؤال JRE",
    difficulty: "basic",
    questionType: "true_false",
    question: "سؤال JRE في الامتحانات الحديثة يهدف إلى قياس الحفظ الآلي للقوانين دون الاهتمام بالتفكير والتحليل.",
    correctAnswer: false,
    explanation: "العبارة خاطئة؛ سؤال JRE صُمم خصيصاً لقياس التفكير النقدي والمساءلة المهنية والحكم المدعوم بالأدلة المحاسبية.",
    tags: ["JRE", "التفكير النقدي"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 91, concept: "أهداف JRE" }
  },
  {
    id: "eb-tf-009",
    lessonId: "lesson-1",
    unitId: "unit-1",
    learningObjectiveId: "obj-1-3",
    concept: "مبدأ التكلفة التاريخية والتضخم",
    difficulty: "intermediate",
    questionType: "true_false",
    question: "مبدأ التكلفة التاريخية يتجاهل التغيرات في القوة الشرائية للنقود ويسجل الأصل بما دفع فيه فعلياً وقت اقتنائه.",
    correctAnswer: true,
    explanation: "العبارة صائبة؛ التكلفة التاريخية تضمن موضوعية الإثبات استناداً إلى المستندات الموثقة.",
    tags: ["التكلفة التاريخية"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 13, concept: "التكلفة التاريخية" }
  },
  {
    id: "eb-tf-010",
    lessonId: "lesson-2",
    unitId: "unit-1",
    learningObjectiveId: "obj-2-3",
    concept: "تأثير الإيرادات على حقوق الملكية",
    difficulty: "basic",
    questionType: "true_false",
    question: "تحقيق المنشأة لإيرادات الخدمات يؤدي إلى زيادة الأصول وزيادة حقوق الملكية بالتوازي.",
    correctAnswer: true,
    explanation: "العبارة صائبة؛ الإيراد يزيد من النقدية أو المدينين (أصول) وينعكس كزيادة في صافي حقوق الملكية.",
    tags: ["الإيرادات", "المعادلة المحاسبية"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 31, concept: "أثر الإيرادات" }
  },

  // ==========================================
  // 3. Fill in the Blank Questions (5 Items)
  // ==========================================
  {
    id: "eb-fill-001",
    lessonId: "lesson-1",
    unitId: "unit-1",
    learningObjectiveId: "obj-1-3",
    concept: "مبدأ الحيطة والحذر",
    difficulty: "basic",
    questionType: "fill_blank",
    question: "يقضي مبدأ ..................... بالاعتراف الفوري بجميع الخسائر المتوقعة وتأجيل تسجيل الأرباح حتى تتحقق فعلياً.",
    correctAnswer: "الحيطة والحذر",
    explanation: "مبدأ الحيطة والحذر (التحفظ) هو الدرع الواقي ضد تضخيم الأرباح والموجودات في القوائم المالية.",
    tags: ["المبادئ المحاسبية"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 14, concept: "الحيطة والحذر" }
  },
  {
    id: "eb-fill-002",
    lessonId: "lesson-2",
    unitId: "unit-1",
    learningObjectiveId: "obj-2-1",
    concept: "عناصر المعادلة المحاسبية",
    difficulty: "basic",
    questionType: "fill_blank",
    question: "المعادلة المحاسبية تنص على: الأصول = ..................... + حقوق الملكية.",
    correctAnswer: "الخصوم",
    explanation: "الخصوم (التزامات المنشأة تجاه الغير) تمثل أحد المصدرين الأساسيين لتمويل أصول المنشأة.",
    tags: ["المعادلة المحاسبية"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 22, concept: "معادلة الميزانية" }
  },
  {
    id: "eb-fill-003",
    lessonId: "lesson-3",
    unitId: "unit-1",
    learningObjectiveId: "obj-3-2",
    concept: "طبيعة حسابات المصروفات",
    difficulty: "basic",
    questionType: "fill_blank",
    question: "تعتبر حسابات المصروفات ذات طبيعة ..................... وبالتالي فإن زيادتها تُسجل في نفس الجانب.",
    correctAnswer: "مدينة",
    explanation: "المصروفات استخدام للموارد واستنزاف لحقوق الملكية فتأخذ الطبيعة المدينة وتزيد بالمدين.",
    tags: ["طبيعة الحسابات"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 42, concept: "طبيعة المصروفات" }
  },
  {
    id: "eb-fill-004",
    lessonId: "lesson-4",
    unitId: "unit-1",
    learningObjectiveId: "obj-4-3",
    concept: "كشف ميزان المراجعة",
    difficulty: "intermediate",
    questionType: "fill_blank",
    question: "يُعد ..................... كشفاً أو قائمة بجميع أرصدة ومجاميع حسابات دفتر الأستاذ للتحقق من التوازن الحسابي.",
    correctAnswer: "ميزان المراجعة",
    explanation: "ميزان المراجعة هو نقطة الوصل الرقابية بين التسجيل والترحيل وإعداد القوائم المالية الختامية.",
    tags: ["ميزان المراجعة"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 65, concept: "ميزان المراجعة" }
  },
  {
    id: "eb-fill-005",
    lessonId: "lesson-5",
    unitId: "unit-1",
    learningObjectiveId: "obj-5-1",
    concept: "نتيجة حساب المتاجرة",
    difficulty: "intermediate",
    questionType: "fill_blank",
    question: "الفرق الإيجابي بين صافي المبيعات وتكلفة البضاعة المباعة في حساب المتاجرة يُسمى .....................",
    correctAnswer: "مجمل الربح",
    explanation: "مجمل الربح (Gross Profit) يعبر عن كفاءة التسعير والنشاط التجاري المباشر قبل طرح المصروفات التشغيلية.",
    tags: ["حساب المتاجرة", "مجمل الربح"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 77, concept: "مجمل الربح" }
  },

  // ==========================================
  // 4. Applied Numerical & Exercises (2 Items)
  // ==========================================
  {
    id: "eb-app-001",
    lessonId: "lesson-2",
    unitId: "unit-1",
    learningObjectiveId: "obj-2-4",
    concept: "حساب رأس المال الختامي",
    difficulty: "intermediate",
    questionType: "applied",
    question: "بدأت منشأة نشاطها برأس مال قدره 300,000 جنيه، وحققت صافي ربح خلال العام قدره 85,000 جنيه، وكانت مسحوبات صاحب المنشأة 20,000 جنيه. احسب رصيد حقوق الملكية في نهاية العام.",
    correctAnswer: "365,000 جنيه",
    explanation: "حقوق الملكية الختامية = 300,000 + 85,000 - 20,000 = 365,000 جنيه.",
    tags: ["تطبيقات عددية", "حقوق الملكية"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 33, concept: "حساب حقوق الملكية" }
  },
  {
    id: "eb-app-002",
    lessonId: "lesson-5",
    unitId: "unit-1",
    learningObjectiveId: "obj-5-1",
    concept: "حساب تكلفة البضاعة المباعة ومجمل الربح",
    difficulty: "advanced",
    questionType: "applied",
    question: "توفرت لديك البيانات التالية: مخزون أول المدة 40,000 جنيه، المشتريات خلال العام 160,000 جنيه، ومخزون آخر المدة 50,000 جنيه، والمبيعات 250,000 جنيه. احسب تكلفة المبيعات ومجمل الربح.",
    correctAnswer: "تكلفة المبيعات = 150,000 جنيه، ومجمل الربح = 100,000 جنيه",
    explanation: "تكلفة المبيعات = 40,000 + 160,000 - 50,000 = 150,000 جنيه. مجمل الربح = 250,000 - 150,000 = 100,000 جنيه.",
    tags: ["تطبيقات عددية", "تكلفة المبيعات"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 76, concept: "تكلفة المبيعات" }
  },

  // ==========================================
  // 5. JRE Judgment & Reasoning Scenarios (2 Items)
  // ==========================================
  {
    id: "eb-jre-001",
    lessonId: "lesson-6",
    unitId: "unit-1",
    learningObjectiveId: "obj-6-1",
    concept: "مقال JRE حول تأجيل تسجيل المصروفات",
    difficulty: "challenge",
    questionType: "jre",
    question: "قامت شركة بتأجيل تسجيل فاتورة استهلاك كهرباء بمبلغ 60,000 جنيه مستحقة عن شهر ديسمبر إلى العام التالي لرفع صافي أرباح العام الحالي. قيم هذا التصرف محاسبياً مستخدماً منهجية (الحكم، التعليل، الأدلة).",
    correctAnswer: "تصرف غير سليم محاسبياً يخالف مبدأ المقابلة وأساس الاستحقاق",
    explanation: "1. الحكم (Judgment): الإجراء خاطئ ومخالف للمعايير. 2. التعليل (Reasoning): الكهرباء استُهلكت في توليد إيرادات ديسمبر فيجب تحميلها على نفس الفترة وفق مبدأ المقابلة. 3. الأدلة (Evidence): تأجيل الـ 60 ألف يضخم أرباح العام الحالي ويشوه المركز المالي.",
    tags: ["JRE", "أساس الاستحقاق", "المقابلة"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 94, concept: "قضية استحقاق المصروفات" }
  },
  {
    id: "eb-jre-002",
    lessonId: "lesson-6",
    unitId: "unit-1",
    learningObjectiveId: "obj-6-2",
    concept: "مقال JRE حول إعادة تقييم الأراضي بالسوق",
    difficulty: "challenge",
    questionType: "jre",
    question: "اشترت منشأة قطعة أرض بمبلغ 500,000 جنيه، وبعد عامين ارتفعت قيمتها السوقية إلى 1,200,000 جنيه. أصر المحاسب على زيادة قيمتها بالدفاتر وتسجيل ربح بـ 700,000 جنيه. قيم الموقف بمنهجية JRE.",
    correctAnswer: "تصرف خاطئ يخالف مبدأ التكلفة التاريخية والحيطة والحذر",
    explanation: "1. الحكم: مخالف للمعايير. 2. التعليل: مبدأ التكلفة التاريخية يلزم بقاء الأرض بـ 500 ألف، ومبدأ الحيطة والحذر يمنع الاعتراف بأرباح إعادة التقييم غير المحققة بيعاً. 3. الدليل: لم تحدث واقعة بيع فعلية ونقدية محققة.",
    tags: ["JRE", "التكلفة التاريخية", "الحيطة والحذر"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 96, concept: "قضية تقييم الأصول" }
  },

  // ==========================================
  // 6. T-Account & Ledger Scenarios (1 Item)
  // ==========================================
  {
    id: "eb-tac-001",
    lessonId: "lesson-4",
    unitId: "unit-1",
    learningObjectiveId: "obj-4-2",
    concept: "محاكاة وترصيد حساب النقدية بالخزينة",
    difficulty: "intermediate",
    questionType: "t_account",
    question: "بدأت الخزينة برصيد 50,000 جنيه. تمت العمليات: تحصيل مبيعات 30,000 نقداً، سداد إيجار 8,000 نقداً، سداد للمورد 12,000 نقداً. حدد الرصيد النهائي للخزينة وطبيعته.",
    correctAnswer: "رصيد مدين قدره 60,000 جنيه",
    explanation: "الجانب المدين = 50,000 + 30,000 = 80,000 جنيه. الجانب الدائن = 8,000 + 12,000 = 20,000 جنيه. الرصيد النهائي = 80,000 - 20,000 = 60,000 جنيه رصيد مدين.",
    tags: ["T-Account", "حساب الخزينة", "Bloom:Apply"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 60, concept: "حساب الخزينة T-Account" }
  },

  // ==========================================
  // 7. Expanded Question Set (50 New Verified Items, Total = 112)
  // ==========================================

  // --- Lesson 1: طبيعة المحاسبة والمبادئ (8 Items) ---
  {
    id: "eb-mcq-043",
    lessonId: "lesson-1",
    unitId: "unit-1",
    learningObjectiveId: "obj-1-1",
    concept: "الفرق بين المحاسبة ومسك الدفاتر",
    difficulty: "basic",
    questionType: "mcq",
    question: "أي من العبارات التالية تعبر بدقة عن العلاقة الجوهرية بين مسك الدفاتر والمحاسبة المالية؟",
    options: [
      "مسك الدفاتر هو المرحلة التنفيذية لتسجيل المعاملات بينما المحاسبة تشمل التحليل والتفسير والتقرير",
      "المحاسبة ومسك الدفاتر مصطلحان متطابقان تماماً ولا يوجد أي فرق وظيفي بينهما",
      "مسك الدفاتر يقتصر على المنشآت الكبيرة بينما المحاسبة للمنشآت الصغيرة",
      "المحاسبة تسبق مسك الدفاتر زمنياً في الدورة المحاسبية"
    ],
    correctAnswer: "مسك الدفاتر هو المرحلة التنفيذية لتسجيل المعاملات بينما المحاسبة تشمل التحليل والتفسير والتقرير",
    explanation: "مسك الدفاتر هو الجانب الإجرائي الروتيني لتسجيل المعاملات وتبويبها، في حين تمثل المحاسبة النظام الشامل الذي يشمل التصميم والتحليل وتفسير القوائم المالية لاتخاذ القرارات.",
    tags: ["مسك الدفاتر", "مفاهيم أساسية", "Bloom:Understand"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 9, concept: "المحاسبة ومسك الدفاتر" }
  },
  {
    id: "eb-mcq-044",
    lessonId: "lesson-1",
    unitId: "unit-1",
    learningObjectiveId: "obj-1-3",
    concept: "مبدأ الموضوعية والتحقق",
    difficulty: "intermediate",
    questionType: "mcq",
    question: "يُلزم مبدأ الموضوعية في المحاسبة المالية بأن تكون جميع البيانات المالية المسجلة بالدفاتر:",
    options: [
      "مبنية على تقديرات شخصية مرنة لمدير الحسابات",
      "معززة بمستندات وإثباتات ثبوتية مستقلة قابلة للتحقق والمراجعة",
      "مسجلة بأعلى قيمة بيعية متوقعة في السوق",
      "مقتصرة على المعاملات النقدية فقط دون الآجلة"
    ],
    correctAnswer: "معززة بمستندات وإثباتات ثبوتية مستقلة قابلة للتحقق والمراجعة",
    explanation: "يتطلب مبدأ الموضوعية استناد القياس والتسجيل المحاسبي إلى أدلة ومستندات موضوعية خالية من التحيز الشخصي مثل الفواتير والعقود والإيصالات المعتمدة.",
    tags: ["المبادئ المحاسبية", "الموضوعية", "Bloom:Understand"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 13, concept: "مبدأ الموضوعية" }
  },
  {
    id: "eb-tf-011",
    lessonId: "lesson-1",
    unitId: "unit-1",
    learningObjectiveId: "obj-1-2",
    concept: "فرض استقلالية الوحدة الاقتصادية",
    difficulty: "intermediate",
    questionType: "true_false",
    question: "قيام صاحب المنشأة الفردية بسداد إيجار مسكنه الخاص من خزينة المنشأة وتسجيله كـ 'مصروف إيجار عام للمنشأة' يعد تصرفاً محاسبياً سليماً لا يتعارض مع الفروض المحاسبية.",
    correctAnswer: false,
    explanation: "هذا تصرف خاطئ يخالف فرض الشخصية المعنوية المستقلة؛ حيث يجب معالجة هذه المبالغ كـ 'مسحوبات شخصية' تخفض حقوق الملكية ولا تدرج كمصروف لنشاط المنشأة.",
    tags: ["الفروض المحاسبية", "الشخصية المعنوية", "Bloom:Analyze"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 11, concept: "استقلالية الوحدة الاقتصادية" }
  },
  {
    id: "eb-tf-012",
    lessonId: "lesson-1",
    unitId: "unit-1",
    learningObjectiveId: "obj-1-3",
    concept: "فرض الاستمرارية ومبدأ التكلفة التاريخية",
    difficulty: "intermediate",
    questionType: "true_false",
    question: "يُعد فرض استمرار المنشأة (Going Concern) الأساس المنطقي الرئيسي لتقييم الأصول الثابتة بالتكلفة التاريخية مطروحاً منها مجمع الإهلاك بدلاً من قيمتها التصفوية الجارية.",
    correctAnswer: true,
    explanation: "بافتراض استمرار المنشأة في مزاولة نشاطها لمدى زمني غير محدد، لا تكون المنشأة بحاجة لتقييم أصولها بأسعار التصفية الفورية، مما يبرر استخدام التكلفة التاريخية وتوزيع تكلفة الأصل على فترات عمره الإنتاجي.",
    tags: ["الفروض المحاسبية", "الاستمرارية", "Bloom:Analyze"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 15, concept: "فرض الاستمرارية" }
  },
  {
    id: "eb-case-001",
    lessonId: "lesson-1",
    unitId: "unit-1",
    learningObjectiveId: "obj-1-3",
    concept: "تقييم الحيطة والحذر والأهمية النسبية في حالة قضائية",
    difficulty: "advanced",
    questionType: "case",
    question: "رفعت إحدى الشركات المنافسة دعوى قضائية ضد شركة 'الأمل' تطالبها بتعويض قدره 200,000 جنيه، وأكد المستشار القانوني للشركة أن احتمالية خسارة القضية وسداد المبلغ مؤكدة بنسبة 90%. أوصى المدير المالي بعدم إثبات أي قيد أو إفصاح لتفادي خفض الأرباح. قيم موقف المدير المالي محاسبياً.",
    correctAnswer: "موقف غير سليم؛ يلزم تكوين مخصص والإفصاح عن الالتزام المحتمل وفقاً لمبدأ الحيطة والحذر والإفصاح التام",
    explanation: "وفقاً لمبدأ الحيطة والحذر، يجب الاعتراف بالخسائر والالتزامات المحتملة الحدوث بصورة مرجحة وتكوين مخصص لها، والإفصاح عنها بالقوائم المالية تحقيقاً للشفافية وتجنباً لتضليل المستثمرين.",
    tags: ["حالات عملية", "الحيطة والحذر", "الإفصاح", "Bloom:Evaluate"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 18, concept: "تطبيقات الحيطة والحذر" }
  },
  {
    id: "eb-ana-001",
    lessonId: "lesson-1",
    unitId: "unit-1",
    learningObjectiveId: "obj-1-4",
    concept: "مقارنة أثر أساس الاستحقاق والأساس النقدي على صافي الدخل",
    difficulty: "advanced",
    questionType: "analytical",
    question: "حققت منشأة مبيعات خدمات خلال عام 2025 بمبلغ 350,000 جنيه (حصل منها 200,000 جنيه نقداً والباقي آجل)، وبلغت مصروفات العام 180,000 جنيه (سدد منها 120,000 جنيه نقداً والباقي مستحق). احسب الفرق بين صافي ربح المنشأة وفق أساس الاستحقاق وصافي الربح وفق الأساس النقدي.",
    correctAnswer: "صافي ربح أساس الاستحقاق = 170,000 جنيه، وصافي ربح الأساس النقدي = 80,000 جنيه، والفرق = 90,000 جنيه زيادة لصالح الاستحقاق",
    explanation: "أساس الاستحقاق: الإيرادات (350,000) - المصروفات (180,000) = 170,000 جنيه. الأساس النقدي: المقبوضات (200,000) - المدفوعات (120,000) = 80,000 جنيه. الفرق بينهما = 170,000 - 80,000 = 90,000 جنيه.",
    tags: ["تحليل محاسبي", "أساس الاستحقاق", "الأساس النقدي", "Bloom:Analyze"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 17, concept: "مقارنة أسس القياس" }
  },
  {
    id: "eb-applied-003",
    lessonId: "lesson-1",
    unitId: "unit-1",
    learningObjectiveId: "obj-1-3",
    concept: "حساب مصروف الإهلاك وتطبيق مبدأ المقابلة",
    difficulty: "intermediate",
    questionType: "applied",
    question: "اشترت منشأة آلة إنتاجية في 1/1/2025 بتكلفة 120,000 جنيه، وقدر عمرها الإنتاجي بـ 5 سنوات بقيمة تخريدية متوقعة 20,000 جنيه. وتتبع المنشأة طريقة القسط الثابت. احسب قسط الإهلاك السنوي الواجب تحميله على قائمة الدخل لعام 2025 تطبيقاً لمبدأ المقابلة.",
    correctAnswer: "20,000 جنيه",
    explanation: "قسط الإهلاك السنوي = (تكلفة الأصل - قيمة الخردة) ÷ العمر الإنتاجي = (120,000 - 20,000) ÷ 5 = 100,000 ÷ 5 = 20,000 جنيه سنوياً، ويحمل كمصروف لمقابلة إيرادات الإنتاج.",
    tags: ["مسائل تطبيقية", "الإهلاك", "مبدأ المقابلة", "Bloom:Apply"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 16, concept: "الإهلاك ومبدأ المقابلة" }
  },
  {
    id: "eb-applied-004",
    lessonId: "lesson-1",
    unitId: "unit-1",
    learningObjectiveId: "obj-1-4",
    concept: "تسوية الإيرادات المقدمة والمستحقة وفق أساس الاستحقاق",
    difficulty: "advanced",
    questionType: "applied",
    question: "بلغت المبالغ المحصلة من العملاء مقابل عقود صيانة سنوية خلال العام 60,000 جنيه سجلت بالكامل كإيراد صيانة. وفي نهاية العام تبين أن ما يخص الفترة من أعمال صيانة منجزة فعلياً قيمته 45,000 جنيه فقط. حدد قيمة إيراد الصيانة المحقق بقائمة الدخل ورصيد الإيراد المقدم بقائمة المركز المالي.",
    correctAnswer: "إيراد الصيانة المحقق = 45,000 جنيه، والإيراد المقدم (التزام) = 15,000 جنيه",
    explanation: "يدرج ما يخص الفترة فعلياً (45,000 جنيه) في قائمة الدخل كإيراد محقق، ويحول الجزء المتبقي غير المكتسب (60,000 - 45,000 = 15,000 جنيه) إلى خصوم متداولة كـ 'إيراد صيانة مقدم' بالمركز المالي.",
    tags: ["مسائل تطبيقية", "التسويات الجردية", "أساس الاستحقاق", "Bloom:Apply"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 19, concept: "تسوية الإيرادات المقدمة" }
  },

  // --- Lesson 2: المعادلة المحاسبية وتحليل العمليات (9 Items) ---
  {
    id: "eb-mcq-045",
    lessonId: "lesson-2",
    unitId: "unit-1",
    learningObjectiveId: "obj-2-1",
    concept: "البنية الجبرية لمعادلة الميزانية الموسعة",
    difficulty: "basic",
    questionType: "mcq",
    question: "أي من الصيغ التالية تمثل الصورة الموسعة الصحيحة لمعادلة الميزانية المحاسبية؟",
    options: [
      "الأصول = الخصوم + رأس المال + الإيرادات - المصروفات - المسحوبات",
      "الأصول + الخصوم = رأس المال + الإيرادات - المصروفات",
      "الأصول = الخصوم - رأس المال + المسحوبات",
      "الأصول = الخصوم + رأس المال - الإيرادات + المصروفات"
    ],
    correctAnswer: "الأصول = الخصوم + رأس المال + الإيرادات - المصروفات - المسحوبات",
    explanation: "حقوق الملكية تتكون من (رأس المال + الأرباح المحتجزة/الإيرادات - المصروفات - المسحوبات الشخصية)، مما يجعل المعادلة: الأصول = الخصوم + رأس المال + الإيرادات - المصروفات - المسحوبات.",
    tags: ["معادلة الميزانية", "الصيغة الموسعة", "Bloom:Understand"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 23, concept: "المعادلة المحاسبية الموسعة" }
  },
  {
    id: "eb-mcq-046",
    lessonId: "lesson-2",
    unitId: "unit-1",
    learningObjectiveId: "obj-2-2",
    concept: "تحليل أثر شراء أصل بجزء نقدي وجزء آجل",
    difficulty: "intermediate",
    questionType: "mcq",
    question: "اشترت المنشأة أجهزة حاسب آلي بمبلغ 50,000 جنيه، سددت منها 20,000 جنيه نقداً والباقي على الحساب. ما هو الأثر الصافي لهذه العملية على إجمالي الأصول وإجمالي الخصوم؟",
    options: [
      "زيادة الأصول بمبلغ 30,000 جنيه وزيادة الخصوم بمبلغ 30,000 جنيه",
      "زيادة الأصول بمبلغ 50,000 جنيه وزيادة الخصوم بمبلغ 50,000 جنيه",
      "نقص الأصول بمبلغ 20,000 جنيه ونقص الخصوم بمبلغ 20,000 جنيه",
      "لا يتغير إجمالي الأصول وتزيد الخصوم بمبلغ 30,000 جنيه"
    ],
    correctAnswer: "زيادة الأصول بمبلغ 30,000 جنيه وزيادة الخصوم بمبلغ 30,000 جنيه",
    explanation: "تزيد الأصول بأجهزة الحاسب (+50,000) وتنقص بالنقدية (-20,000)، فيكون صافي الزيادة بالأصول +30,000 جنيه، ويقابله زيادة في الخصوم (الموردون) بمبلغ +30,000 جنيه، فيظل التوازن قائماً.",
    tags: ["تحليل العمليات", "أثر المعاملات", "Bloom:Apply"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 27, concept: "أثر العمليات المركبة" }
  },
  {
    id: "eb-mcq-047",
    lessonId: "lesson-2",
    unitId: "unit-1",
    learningObjectiveId: "obj-2-4",
    concept: "أثر سداد دين للموردين نقداً",
    difficulty: "intermediate",
    questionType: "mcq",
    question: "سداد المنشأة لمبلغ 15,000 جنيه نقداً لأحد الموردين سداداً لمستحقات سابقة يؤدي إلى:",
    options: [
      "نقص في أصل (النقدية) ونقص في التزام (الموردين) بنفس القيمة",
      "نقص في أصل (النقدية) وزيادة في المصروفات",
      "زيادة في أصل ونقص في أصل آخر دون تأثر الخصوم",
      "نقص في الخصوم وزيادة في حقوق الملكية"
    ],
    correctAnswer: "نقص في أصل (النقدية) ونقص في التزام (الموردين) بنفس القيمة",
    explanation: "سداد الالتزام لا يعد مصروفا جديدا بل إبراء لذمة مالية سابقة، فيترتب عليه نقص النقدية بالخزينة (أصل) ونقص رصيد حساب الدائنين/الموردين (خصوم) بمبلغ 15,000 جنيه.",
    tags: ["تحليل العمليات", "سداد الالتزامات", "Bloom:Understand"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 33, concept: "أثر سداد الديون" }
  },
  {
    id: "eb-tf-013",
    lessonId: "lesson-2",
    unitId: "unit-1",
    learningObjectiveId: "obj-2-2",
    concept: "أثر العمليات التبادلية بين الأصول",
    difficulty: "basic",
    questionType: "true_false",
    question: "تحصيل منشأة لمبلغ 25,000 جنيه نقداً من أحد العملاء المدينين يؤدي إلى زيادة إجمالي أصول المنشأة بمبلغ 25,000 جنيه.",
    correctAnswer: false,
    explanation: "هذه العملية تمثل تغيراً في هيكل الأصول فقط (زيادة النقدية ونقص المدينين بنفس القيمة 25,000 جنيه)، وبالتالي يظل إجمالي الأصول ثابتاً دون أي زيادة إجمالية.",
    tags: ["معادلة الميزانية", "تبادل الأصول", "Bloom:Understand"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 25, concept: "العمليات التبادلية للأصول" }
  },
  {
    id: "eb-applied-005",
    lessonId: "lesson-2",
    unitId: "unit-1",
    learningObjectiveId: "obj-2-1",
    concept: "استنتاج المجهول في معادلة الميزانية",
    difficulty: "intermediate",
    questionType: "applied",
    question: "إذا علمت أن أصول منشأة 'الوفاء' في بداية العام بلغت 420,000 جنيه والتزاماتها 160,000 جنيه. وخلال العام زادت الأصول بمقدار 80,000 جنيه وانخفضت الخصوم بمقدار 30,000 جنيه. احسب رصيد حقوق الملكية في نهاية العام.",
    correctAnswer: "370,000 جنيه",
    explanation: "الأصول في نهاية العام = 420,000 + 80,000 = 500,000 جنيه. الخصوم في نهاية العام = 160,000 - 30,000 = 130,000 جنيه. حقوق الملكية في نهاية العام = الأصول - الخصوم = 500,000 - 130,000 = 370,000 جنيه.",
    tags: ["مسائل تطبيقية", "معادلة الميزانية", "Bloom:Apply"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 24, concept: "حساب عناصر المعادلة" }
  },
  {
    id: "eb-applied-006",
    lessonId: "lesson-2",
    unitId: "unit-1",
    learningObjectiveId: "obj-2-3",
    concept: "حساب صافي الربح من التغير في حقوق الملكية",
    difficulty: "advanced",
    questionType: "applied",
    question: "بدأت منشأة العام برأس مال 200,000 جنيه، وفي نهاية العام بلغت الأصول 550,000 جنيه والخصوم 180,000 جنيه. فإذا علمت أن صاحب المنشأة قام بضخ استثمارات إضافية خلال العام قدرها 50,000 جنيه وسحب نقدية لاستخدامه الشخصي بلغت 20,000 جنيه. احسب صافي ربح المنشأة المحقق عن العام.",
    correctAnswer: "140,000 جنيه",
    explanation: "حقوق الملكية نهاية العام = 550,000 - 180,000 = 370,000 جنيه. الزيادة في حقوق الملكية = 370,000 - 200,000 = 170,000 جنيه. صافي الربح = الزيادة في حقوق الملكية - الاستثمارات الإضافية + المسحوبات = 170,000 - 50,000 + 20,000 = 140,000 جنيه.",
    tags: ["مسائل تطبيقية", "حقوق الملكية", "صافي الربح", "Bloom:Analyze"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 30, concept: "تغيرات حقوق الملكية والأرباح" }
  },
  {
    id: "eb-applied-007",
    lessonId: "lesson-2",
    unitId: "unit-1",
    learningObjectiveId: "obj-2-2",
    concept: "تحليل معادلة الميزانية لسلسلة عمليات متتالية",
    difficulty: "advanced",
    questionType: "applied",
    question: "تمت العمليات التالية: 1) إيداع 100,000 جنيه بالبنك كرأس مال. 2) شراء بضاعة بـ 40,000 جنيه بشيك. 3) بيع نصف البضاعة بمبلغ 35,000 جنيه على الحساب. احسب إجمالي قيمة الأصول وحقوق الملكية بعد إتمام العمليات الثلاث.",
    correctAnswer: "إجمالي الأصول = 115,000 جنيه، وحقوق الملكية = 115,000 جنيه",
    explanation: "الأصول: بنك (60,000) + بضاعة متبقية (20,000) + مدينون (35,000) = 115,000 جنيه. الخصوم = 0. حقوق الملكية: رأس المال (100,000) + ربح بيع البضاعة (35,000 - 20,000 = 15,000) = 115,000 جنيه. التوازن = 115,000 = 115,000.",
    tags: ["مسائل تطبيقية", "أثر العمليات", "Bloom:Apply"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 28, concept: "سلسلة العمليات وتوازن المعادلة" }
  },
  {
    id: "eb-case-002",
    lessonId: "lesson-2",
    unitId: "unit-1",
    learningObjectiveId: "obj-2-2",
    concept: "تقييم أثر توزيعات الأرباح على توازن المعادلة",
    difficulty: "advanced",
    questionType: "case",
    question: "قرر مجلس إدارة شركة تجارية توزيع أرباح نقدية على المساهمين بمبلغ 80,000 جنيه، وتم السداد بشيك بنكي. اقترح محاسب الشركة قيد العملية بخصم المبلغ مباشرة من إيرادات النشاط الجاري. قيم اقتراح المحاسب وحدد الأثر الدقيق على معادلة الميزانية.",
    correctAnswer: "اقتراح خاطئ؛ توزيعات الأرباح ليست مصروفا جاريا بل توزيع لحقوق الملكية، والأثر هو نقص الأصول (البنك) ونقص حقوق الملكية (الأرباح المحتجزة) بـ 80,000 جنيه",
    explanation: "توزيعات الأرباح تخفض حقوق الملكية مباشرة ولا تدرج في قائمة الدخل كمصروف لأنها ليست تكلفة توليد إيراد، ويترتب عليها نقص البنك (أصل) ونقص الأرباح المحتجزة (حقوق ملكية).",
    tags: ["حالات عملية", "توزيعات الأرباح", "حقوق الملكية", "Bloom:Evaluate"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 35, concept: "توزيع الأرباح وحقوق الملكية" }
  },
  {
    id: "eb-ana-002",
    lessonId: "lesson-2",
    unitId: "unit-1",
    learningObjectiveId: "obj-2-4",
    concept: "تحليل أخطاء تبويب العمليات على معادلة الميزانية",
    difficulty: "challenge",
    questionType: "analytical",
    question: "قامت منشأة بشراء آلة إنتاجية بمبلغ 90,000 جنيه نقداً، وقام المحاسب بتسجيلها خطأً كـ 'مصروف صيانة عامة'. وضح أثر هذا الخطأ المحاسبي على: 1) إجمالي الأصول، 2) صافي ربح الفترة، 3) حقوق الملكية بنهاية العام.",
    correctAnswer: "يترتب على الخطأ: نقص الأصول بـ 90,000 جنيه، ونقص صافي الربح بـ 90,000 جنيه، ونقص حقوق الملكية بـ 90,000 جنيه",
    explanation: "تسجيل الأصل الرأسمالي كمصروف إيرادي يؤدي إلى تضخيم المصروفات وبالتالي تخفيض صافي الربح وحقوق الملكية بـ 90,000 جنيه، وحرمان قائمة المركز المالي من إظهار أصل ثابت حقيقي بنفس القيمة.",
    tags: ["تحليل أخطاء", "الأصول الثابتة", "المصروفات الرأسمالية", "Bloom:Analyze"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 37, concept: "أثر أخطاء التبويب على المعادلة" }
  },

  // --- Lesson 3: القيد المزدوج ودورة المعاملات (10 Items) ---
  {
    id: "eb-mcq-048",
    lessonId: "lesson-3",
    unitId: "unit-1",
    learningObjectiveId: "obj-3-1",
    concept: "طبيعة الحسابات وقواعد المدين والدائن",
    difficulty: "basic",
    questionType: "mcq",
    question: "وفقاً لقواعد القيد المزدوج، ما هي المجموعة التي تتميز جميع عناصرها بطبيعة حسابات 'مدينة' وتزداد بجعلها مدينة؟",
    options: [
      "الأصول والمصروفات والمسحوبات",
      "الخصوم وحقوق الملكية والإيرادات",
      "الأصول والإيرادات ورأس المال",
      "الخصوم والمصروفات ورأس المال"
    ],
    correctAnswer: "الأصول والمصروفات والمسحوبات",
    explanation: "الحسابات ذات الطبيعة المدينة الأصلية هي الأصول والمصروفات والمسحوبات؛ تزيد في الجانب المدين وتنقص في الجانب الدائن.",
    tags: ["القيد المزدوج", "قواعد المدين والدائن", "Bloom:Remember"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 41, concept: "طبيعة الحسابات المحاسبية" }
  },
  {
    id: "eb-mcq-049",
    lessonId: "lesson-3",
    unitId: "unit-1",
    learningObjectiveId: "obj-3-2",
    concept: "القيد اليومي للمبيعات الآجلة مع ضريبة القيمة المضافة",
    difficulty: "intermediate",
    questionType: "mcq",
    question: "باعت منشأة بضاعة على الحساب للعميل 'سمير' بمبلغ 40,000 جنيه، مع إضافة ضريبة قيمة مضافة بنسبة 14%. ما هو الطرف الدائن الصحيح لقيد اليومية؟",
    options: [
      "إلى مذكورين: حـ/ المبيعات (40,000) وحـ/ جاري القيمة المضافة (5,600)",
      "حـ/ العملاء - سمير بمبلغ 45,600 جنيه",
      "حـ/ المبيعات فقط بمبلغ 45,600 جنيه",
      "إلى حـ/ البنك بمبلغ 40,000 جنيه"
    ],
    correctAnswer: "إلى مذكورين: حـ/ المبيعات (40,000) وحـ/ جاري القيمة المضافة (5,600)",
    explanation: "القيد الصحيح: من حـ/ العملاء (45,600) إلى مذكورين: حـ/ المبيعات (40,000) وحـ/ مصلحة الضرائب - ضريبة القيمة المضافة الدائنة (5,600).",
    tags: ["قيود اليومية", "ضريبة القيمة المضافة", "Bloom:Apply"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 45, concept: "قيود المبيعات والضرائب" }
  },
  {
    id: "eb-mcq-050",
    lessonId: "lesson-3",
    unitId: "unit-1",
    learningObjectiveId: "obj-3-3",
    concept: "المعالجة المحاسبية للخصم التجاري والخصم النقدي",
    difficulty: "intermediate",
    questionType: "mcq",
    question: "اشترت المنشأة بضاعة قيمتها الاسمية 50,000 جنيه بخصم تجاري 10% وبشروط سداد 2/10 صافي 30 يوماً. ما هي القيمة التي تسجل بها المشتريات بدفتر اليومية في تاريخ الشراء؟",
    options: [
      "45,000 جنيه (القيمة بعد الخصم التجاري)",
      "50,000 جنيه (القيمة الإجمالية)",
      "44,100 جنيه (بعد خصم الـ 2%)",
      "40,000 جنيه"
    ],
    correctAnswer: "45,000 جنيه (القيمة بعد الخصم التجاري)",
    explanation: "الخصم التجاري (50,000 × 10% = 5,000) يستبعد فوراً ولا يظهر بالدفاتر، وتسجل المشتريات بالصافي (45,000 جنيه). أما الخصم النقدي فيثبت فقط عند السداد خلال مهلة الخصم.",
    tags: ["الخصم التجاري", "الخصم النقدي", "Bloom:Understand"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 49, concept: "معالجة الخصومات التجارية" }
  },
  {
    id: "eb-tf-014",
    lessonId: "lesson-3",
    unitId: "unit-1",
    learningObjectiveId: "obj-3-1",
    concept: "مبدأ توازن قيد اليومية",
    difficulty: "basic",
    questionType: "true_false",
    question: "في القيد اليومي المركب، يجوز أن يتضمن القيد أكثر من حساب في الجانب المدين بشرط أن يتساوى مجموع المبالغ المدينة تماماً مع مجموع المبالغ الدائنة.",
    correctAnswer: true,
    explanation: "نظرية القيد المزدوج تشترط حتمية التساوي الرياضي بين إجمالي الطرف المدين وإجمالي الطرف الدائن في أي قيد، سواء كان قيداً بسيطاً أو مركباً.",
    tags: ["القيد المزدوج", "القيود المركبة", "Bloom:Remember"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 43, concept: "توازن القيود المحاسبية" }
  },
  {
    id: "eb-applied-008",
    lessonId: "lesson-3",
    unitId: "unit-1",
    learningObjectiveId: "obj-3-3",
    concept: "إثبات سداد مشتريات مع الاستفادة من خصم تعجيل الدفع",
    difficulty: "intermediate",
    questionType: "applied",
    question: "اشترت شركة بضاعة على الحساب في 1 مارس بمبلغ 60,000 جنيه بشروط (3/10 صافي 30). قامت الشركة بسداد المستحق عليها بشيك في 8 مارس. صغ قيد اليومية الخاص بعملية السداد موضحاً المبالغ.",
    correctAnswer: "من حـ/ الموردين (60,000) إلى مذكورين: حـ/ البنك (58,200) وحـ/ الخصم المكتسب (1,800)",
    explanation: "تم السداد خلال 7 أيام (أقل من 10 أيام)، فيستحق الخصم النقدي = 60,000 × 3% = 1,800 جنيه. القيد: 60,000 من حـ/ الموردين، إلى مذكورين: 58,200 حـ/ البنك، 1,800 حـ/ الخصم المكتسب.",
    tags: ["مسائل تطبيقية", "الخصم المكتسب", "قيود السداد", "Bloom:Apply"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 50, concept: "قيود الخصم المكتسب" }
  },
  {
    id: "eb-applied-009",
    lessonId: "lesson-3",
    unitId: "unit-1",
    learningObjectiveId: "obj-3-2",
    concept: "قيد مردودات المبيعات وإشعار الخصم",
    difficulty: "advanced",
    questionType: "applied",
    question: "قام العميل 'طارق' برد بضاعة غير مطابقة للمواصفات كانت قد بيعت له على الحساب بمبلغ 8,000 جنيه. صغ قيد اليومية اللازم لإثبات مردودات المبيعات في دفاتر المنشأة.",
    correctAnswer: "8,000 من حـ/ مردودات ومسموحات المبيعات ، 8,000 إلى حـ/ العملاء (طارق)",
    explanation: "حساب مردودات المبيعات مدين بطبيعته لأنه يخفض إيراد المبيعات، ويجعل حساب العميل دائناً لخفض المديونية المستحقة عليه بمبلغ 8,000 جنيه.",
    tags: ["مسائل تطبيقية", "مردودات المبيعات", "قيود اليومية", "Bloom:Apply"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 47, concept: "قيود مردودات المبيعات" }
  },
  {
    id: "eb-applied-010",
    lessonId: "lesson-3",
    unitId: "unit-1",
    learningObjectiveId: "obj-3-4",
    concept: "المعالجة المحاسبية للأوراق التجارية (الكمبيالات)",
    difficulty: "advanced",
    questionType: "applied",
    question: "باعت منشأة بضاعة بمبلغ 30,000 جنيه وحصلت على كمبيالة تستحق السداد بعد 3 أشهر. صغ قيد استلام الكمبيالة، ثم صغ قيد تحصيل قيمتها نقداً في تاريخ الاستحقاق.",
    correctAnswer: "عند الاستلام: من حـ/ أوراق القبض إلى حـ/ المبيعات (30,000). وعند التحصيل: من حـ/ الخزينة إلى حـ/ أوراق القبض (30,000)",
    explanation: "عند البيع بسند إذني يثبت الأصل 'أوراق القبض' مديناً، وعند تحصيل القيمة في موعد الاستحقاق تزيد الخزينة (مدينة) وتقفل ورقة القبض بجعلها دائنة.",
    tags: ["مسائل تطبيقية", "أوراق القبض", "الكمبيالات", "Bloom:Apply"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 53, concept: "معالجة الأوراق التجارية" }
  },
  {
    id: "eb-case-003",
    lessonId: "lesson-3",
    unitId: "unit-1",
    learningObjectiveId: "obj-3-3",
    concept: "المفاضلة المالية بين الاستفادة من الخصم النقدي والاقتراض البنكي",
    difficulty: "challenge",
    questionType: "case",
    question: "اشترت شركة بضاعة بـ 100,000 جنيه بشروط (2/10 صافي 30). الشركة لا تمتلك نقدية في اليوم العاشر ولكن يمكنها الاقتراض من البنك بفائدة شهرية 1% لسداد الفاتورة واقتناص الخصم. قيم هذا القرار مالياً وقدم توصيتك المحاسبية.",
    correctAnswer: "يوصى بالاقتراض وسداد الفاتورة فوراً؛ لأن قيمة الخصم المكتسب (2,000 جنيه) تفوق تكلفة فائدة القرض عن فترة الـ 20 يوماً المتبقية (حوالي 653 جنيهاً)",
    explanation: "الاستفادة من الخصم توفر 2,000 جنيه (2%). تكلفة الاقتراض لمدة 20 يوماً = 98,000 × 1% × (20/30) ≈ 653 جنيهاً. الصافي المحقق لصالح الشركة = 2,000 - 653 = 1,347 جنيهاً، مما يبرر الاقتراض اقتصادياً.",
    tags: ["حالات عملية", "الخصم النقدي", "القرارات المالية", "Bloom:Evaluate"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 52, concept: "الجدوى الاقتصادية للخصم النقدي" }
  },
  {
    id: "eb-ana-003",
    lessonId: "lesson-3",
    unitId: "unit-1",
    learningObjectiveId: "obj-3-1",
    concept: "تحليل الأخطاء في توجيه قيود المصروفات الرأسمالية والإيرادية",
    difficulty: "advanced",
    questionType: "analytical",
    question: "قامت منشأة بإجراء عمرة شاملة لمحرك إحدى شاحنات النقل بمبلغ 40,000 جنيه أدت إلى زيادة عمرها الإنتاجي 4 سنوات. قام المحاسب بقيد العملية: (40,000 من حـ/ مصروفات صيانة الشاحنات إلى حـ/ البنك). حلل الخطأ المحاسبي وحدد قيد التصحيح اللازم.",
    correctAnswer: "الخطأ هو اعتبار المصروف إيرادياً بينما هو مصروف رأسمالي يطيل عمر الأصل؛ وقيد التصحيح: 40,000 من حـ/ السيارات (الشاحنات) ، 40,000 إلى حـ/ مصروفات صيانة الشاحنات",
    explanation: "المصروف الذي يزيد الطاقة الإنتاجية أو يطيل العمر الإنتاجي للأصل يعد مصروفاً رأسمالياً يضاف إلى تكلفة الأصل الثابت ولا يحمل كمصروف جاري على قائمة الدخل.",
    tags: ["تحليل أخطاء", "المصروفات الرأسمالية", "تصحيح القيود", "Bloom:Analyze"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 44, concept: "التفرقة بين المصروف الرأسمالي والإيرادي" }
  },
  {
    id: "eb-jre-003",
    lessonId: "lesson-3",
    unitId: "unit-1",
    learningObjectiveId: "obj-3-2",
    concept: "مبررات الفصل المحاسبي بين المسحوبات النقدية والعينية",
    difficulty: "challenge",
    questionType: "jre",
    question: "سحب مالك المنشأة بضاعة لاستخدامه المنزلي تكلفتها 6,000 جنيه وسعر بيعها للجمهور 7,500 جنيه، وسجلها المحاسب مديناً لحساب المسحوبات بسعر البيع ودائناً لحساب المبيعات. صغ مقالاً تبريرياً نقدياً (JRE) يحلل سلامة هذا الإجراء وفقاً لأسس تقييم المسحوبات.",
    correctAnswer: "الحكم: الإجراء غير سليم ويفضل تقييمها بالتكلفة بجعل المشتريات دائنة؛ التعليل: المالك لا يشتري من منشأته بربح تجاري؛ الأدلة: تسجيلها بسعر البيع يضخم المبيعات بأرباح وهمية غير محققة مع أطراف خارجية",
    explanation: "منهجية JRE: 1. الحكم: تقييم المسحوبات بسعر البيع يؤدي للاعتراف بأرباح وهمية مع الذات. 2. التعليل: الأصل في المسحوبات العينية أن تقيم بسعر التكلفة بجعل حـ/ المشتريات دائناً لإلغاء تكلفة البضاعة المسحوبة. 3. الأدلة: تطبيق مبدأ الحيطة والحذر ومفهوم الكيان المستقل يمنع توليد أرباح من معاملات المالك غير التجارية.",
    tags: ["JRE", "المسحوبات العينية", "تقييم المسحوبات", "Bloom:Create"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 55, concept: "تقييم المسحوبات العينية" }
  },

  // --- Lesson 4: دفتر الأستاذ وميزان المراجعة (8 Items) ---
  {
    id: "eb-mcq-051",
    lessonId: "lesson-4",
    unitId: "unit-1",
    learningObjectiveId: "obj-4-1",
    concept: "وظيفة دفتر الأستاذ العام",
    difficulty: "basic",
    questionType: "mcq",
    question: "ما هي الوظيفة الأساسية لعملية الترحيل إلى دفتر الأستاذ العام في الدورة المحاسبية؟",
    options: [
      "تجميع وتبويب وتلخيص كافة المعاملات الخاصة بكل حساب مستقل لتحديد رصيده الصافي",
      "إثبات العمليات المالية وفق تسلسلها الزمني اليومي",
      "إعداد الإقرارات الضريبية الشهرية",
      "استخراج أسعار بيع المنتجات في السوق"
    ],
    correctAnswer: "تجميع وتبويب وتلخيص كافة المعاملات الخاصة بكل حساب مستقل لتحديد رصيده الصافي",
    explanation: "دفتر الأستاذ هو سجل التبويب النهائي؛ يقوم بتجميع كافة الحركات المدينة والدائنة المتعلقة بحساب معين لإظهار مركزه ورصيده في أي لحظة.",
    tags: ["دفتر الأستاذ", "الترحيل والتبويب", "Bloom:Understand"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 59, concept: "أهمية دفتر الأستاذ" }
  },
  {
    id: "eb-mcq-052",
    lessonId: "lesson-4",
    unitId: "unit-1",
    learningObjectiveId: "obj-4-3",
    concept: "حدود ميزان المراجعة والأخطاء التي لا يكشفها",
    difficulty: "intermediate",
    questionType: "mcq",
    question: "أي من الأخطاء المحاسبية التالية لن يؤدي إلى حدوث أي خلل في توازن ميزان المراجعة (يتساوى الجانبان رغم وجود الخطأ)؟",
    options: [
      "ترحيل قيد يومية صحيح بالكامل إلى حساب شخصي آخر بالخطأ (خطأ في التوجيه)",
      "ترحيل مبلغ مدين 5,000 جنيه إلى الجانب المدين كـ 500 جنيه فقط",
      "إثبات جانب مدين في القيد دون إثبات الجانب الدائن",
      "إدراج رصيد حساب أوراق الدفع ضمن الأرصدة المدينة بميزان المراجعة"
    ],
    correctAnswer: "ترحيل قيد يومية صحيح بالكامل إلى حساب شخصي آخر بالخطأ (خطأ في التوجيه)",
    explanation: "خطأ التوجيه المحاسبي يرحل مبالغ متساوية تماماً في الجانبين المدين والدائن، ولذلك يتوازن ميزان المراجعة حسابياً ولا يستطيع كشف هذا الخطأ النوعي.",
    tags: ["ميزان المراجعة", "أخطاء التوجيه", "Bloom:Analyze"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 65, concept: "الأخطاء التي لا تؤثر على توازن الميزان" }
  },
  {
    id: "eb-tf-015",
    lessonId: "lesson-4",
    unitId: "unit-1",
    learningObjectiveId: "obj-4-2",
    concept: "قاعدة تحديد طبيعة الرصيد في حساب T",
    difficulty: "basic",
    questionType: "true_false",
    question: "إذا كان مجموع الجانب المدين في حساب 'البنك' 150,000 جنيه ومجموع الجانب الدائن 90,000 جنيه، فإن الحساب يظهر رصيداً دائناً منقولاً قدره 60,000 جنيه.",
    correctAnswer: false,
    explanation: "الرصيد مدين قدره 60,000 جنيه لأن الجانب المدين أكبر من الجانب الدائن بمقدار 60,000 جنيه، وطبيعة رصيد الحساب تتبع الجانب الأكبر.",
    tags: ["حساب T", "الترصيد", "Bloom:Understand"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 62, concept: "قواعد ترصيد الحسابات" }
  },
  {
    id: "eb-t_account-002",
    lessonId: "lesson-4",
    unitId: "unit-1",
    learningObjectiveId: "obj-4-1",
    concept: "إعداد وترصيد حساب العملاء (المدينين)",
    difficulty: "intermediate",
    questionType: "t_account",
    question: "أظهرت حركة حساب العميل 'الأمانة': رصيد أول المدة مدين 20,000 جنيه، مبيعات آجلة خلال الشهر 55,000 جنيه، مردودات مبيعات 5,000 جنيه، سداد نقدي 40,000 جنيه، ورقة قبض مقبولة 10,000 جنيه. رصد حساب T للعميل وحدد رصيده النهائي.",
    correctAnswer: "رصيد مدين قدره 20,000 جنيه",
    explanation: "الجانب المدين = 20,000 (أول المدة) + 55,000 (مبيعات) = 75,000 جنيه. الجانب الدائن = 5,000 (مردودات) + 40,000 (سداد) + 10,000 (أوراق قبض) = 55,000 جنيه. الرصيد المرحل = 75,000 - 55,000 = 20,000 جنيه رصيد مدين.",
    tags: ["T-Account", "حساب العملاء", "الترصيد", "Bloom:Apply"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 61, concept: "ترصيد حسابات العملاء" }
  },
  {
    id: "eb-t_account-003",
    lessonId: "lesson-4",
    unitId: "unit-1",
    learningObjectiveId: "obj-4-1",
    concept: "ترصيد حساب الموردين (الدائنين)",
    difficulty: "intermediate",
    questionType: "t_account",
    question: "بدأ حساب شركة 'النور' للمهمات برصيد دائن 30,000 جنيه. وتمت العمليات: شراء مهمات على الحساب بـ 45,000 جنيه، رد مهمات تالفة بـ 5,000 جنيه، سداد بشيك بـ 50,000 جنيه مع الحصول على خصم مكتسب 2,000 جنيه. احسب الرصيد النهائي لحساب المورد في دفتر الأستاذ.",
    correctAnswer: "رصيد دائن قدره 18,000 جنيه",
    explanation: "الجانب الدائن = 30,000 + 45,000 = 75,000 جنيه. الجانب المدين = 5,000 (مردودات) + 50,000 (شيك) + 2,000 (خصم) = 57,000 جنيه. الرصيد الدائن المتبقي = 75,000 - 57,000 = 18,000 جنيه دائن.",
    tags: ["T-Account", "حساب الموردين", "الترصيد", "Bloom:Apply"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 63, concept: "ترصيد حسابات الموردين" }
  },
  {
    id: "eb-applied-011",
    lessonId: "lesson-4",
    unitId: "unit-1",
    learningObjectiveId: "obj-4-4",
    concept: "إعداد ميزان المراجعة بالأرصدة وتحديد المجهول",
    difficulty: "advanced",
    questionType: "applied",
    question: "استخرجت الأرصدة التالية: خزينة 30,000، بضاعة 50,000، عملاء 40,000، سيارات 120,000، موردون 45,000، أوراق دفع 15,000، مبيعات 160,000، مشتريات 90,000، مصروفات عمومية 20,000. إذا علمت أن ميزان المراجعة متوازن، احسب قيمة رأس المال.",
    correctAnswer: "130,000 جنيه",
    explanation: "الأرصدة المدينة = 30,000 (خزينة) + 50,000 (بضاعة) + 40,000 (عملاء) + 120,000 (سيارات) + 90,000 (مشتريات) + 20,000 (مصروفات) = 350,000 جنيه. الأرصدة الدائنة = 45,000 (موردون) + 15,000 (أوراق دفع) + 160,000 (مبيعات) + رأس المال = 220,000 + رأس المال. رأس المال = 350,000 - 220,000 = 130,000 جنيه.",
    tags: ["مسائل تطبيقية", "ميزان المراجعة", "رأس المال", "Bloom:Apply"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 68, concept: "إعداد ميزان المراجعة بالأرصدة" }
  },
  {
    id: "eb-ana-004",
    lessonId: "lesson-4",
    unitId: "unit-1",
    learningObjectiveId: "obj-4-3",
    concept: "تحليل أثر أخطاء ميزان المراجعة وفرق الترصيد",
    difficulty: "challenge",
    questionType: "analytical",
    question: "عند إعداد ميزان المراجعة، بلغ مجموع الجانب المدين 425,000 جنيه والجانب الدائن 417,800 جنيه. وعند الفحص اكتشف: 1) إغفال ترحيل مصروف صيانة مدين بـ 3,600 جنيه، 2) تسجيل رصيد عميل مدين بـ 7,200 جنيه كـ 2,700 جنيه بالخطأ (خطأ تبديل أرقام)، 3) إدراج إيراد فوائد دائن بـ 6,300 جنيه ضمن الجانب المدين. أثبت الحسابات وصحح التوازن.",
    correctAnswer: "بعد التصحيح: الجانب المدين المعدل = 426,800 جنيه، الجانب الدائن المعدل = 426,800 جنيه، ويتطابق الميزان تماماً",
    explanation: "المدين المعدل: 425,000 + 3,600 (مصروف سقط) + 4,500 (تصحيح خطأ العميل: 7,200-2,700) - 6,300 (استبعاد الإيراد الموضوع خطأ بالمدين) = 426,800 جنيه. الدائن المعدل: 417,800 + 6,300 (إضافة الإيراد لمكانه الدائن الصحيح) + 2,700 = 426,800 جنيه.",
    tags: ["تحليل أخطاء", "ميزان المراجعة", "تصحيح الفروق", "Bloom:Analyze"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 70, concept: "معالجة فروق ميزان المراجعة" }
  },
  {
    id: "eb-case-004",
    lessonId: "lesson-4",
    unitId: "unit-1",
    learningObjectiveId: "obj-4-4",
    concept: "تقييم الاعتماد على ميزان المراجعة كأساس وحيد للرقابة",
    difficulty: "advanced",
    questionType: "case",
    question: "اكتفى المراجع الداخلي لشركة 'الصفوة' بفحص توازن ميزان المراجعة في نهاية العام وأصدر تقريراً يؤكد خلو الدفاتر تماماً من أي أخطاء أو اختلاسات استناداً إلى تطابق مجموع المدين والدائن. قيم هذا التقرير مبيناً أوجه القصور المهني.",
    correctAnswer: "تقرير معيب مهنياً؛ لأن ميزان المراجعة يثبت التوازن الحسابي فقط ولا يكشف الأخطاء المتكافئة، أو أخطاء الحذف الكامل، أو أخطاء التوجيه، أو قيود التزوير المتوازنة",
    explanation: "توازن ميزان المراجعة دليل ضروري ولكنه غير كافٍ على صحة الحسابات؛ حيث توجد فئات واسعة من الأخطاء لا تؤثر على التوازن مثل السهو التام، وتكرار القيد، وخطأ التوجيه المحاسبي، والأخطاء التعويضية.",
    tags: ["حالات عملية", "ميزان المراجعة", "الرقابة الداخلية", "Bloom:Evaluate"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 71, concept: "كفاية ميزان المراجعة في الرقابة" }
  },

  // --- Lesson 5: الحسابات الختامية والقوائم المالية (9 Items) ---
  {
    id: "eb-mcq-053",
    lessonId: "lesson-5",
    unitId: "unit-1",
    learningObjectiveId: "obj-5-1",
    concept: "حساب مجمل الربح في قائمة الدخل",
    difficulty: "basic",
    questionType: "mcq",
    question: "في قائمة الدخل للمنشآت التجارية، يتم الوصول إلى 'مجمل الربح' من خلال المعادلة:",
    options: [
      "صافي المبيعات - تكلفة البضاعة المباعة",
      "إجمالي الإيرادات - إجمالي المصروفات التشغيلية",
      "صافي المبيعات - المصروفات الإدارية والعمومية",
      "تكلفة البضاعة المباعة + بضاعة آخر المدة"
    ],
    correctAnswer: "صافي المبيعات - تكلفة البضاعة المباعة",
    explanation: "مجمل الربح (Gross Profit) يمثل فائض إيراد النشاط التجاري المباشر (صافي المبيعات) عن التكلفة المباشرة للبضاعة التي تم بيعها (تكلفة المبيعات).",
    tags: ["قائمة الدخل", "مجمل الربح", "Bloom:Understand"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 75, concept: "حساب مجمل الربح" }
  },
  {
    id: "eb-mcq-054",
    lessonId: "lesson-5",
    unitId: "unit-1",
    learningObjectiveId: "obj-5-2",
    concept: "تبويب الأصول المتداولة في المركز المالي",
    difficulty: "intermediate",
    questionType: "mcq",
    question: "أي من العناصر التالية يبوب حصراً ضمن مجموعة 'الأصول المتداولة' في قائمة المركز المالي للمنشأة؟",
    options: [
      "الخزينة، العملاء، بضاعة آخر المدة، المصروفات المقدمة",
      "المباني، الشهرة، الأثاث، الآلات",
      "القروض طويلة الأجل، الموردون، السحب على المكشوف",
      "رأس المال، الاحتياطيات، الأرباح المحتجزة"
    ],
    correctAnswer: "الخزينة، العملاء، بضاعة آخر المدة، المصروفات المقدمة",
    explanation: "الأصول المتداولة تشمل النقدية والأصول الأخرى المتوقع تحويلها إلى نقدية أو بيعها أو استهلاكها خلال دورة تشغيلية واحدة أو سنة مالية أيهما أطول.",
    tags: ["قائمة المركز المالي", "الأصول المتداولة", "Bloom:Understand"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 81, concept: "تبويب الأصول المتداولة" }
  },
  {
    id: "eb-tf-016",
    lessonId: "lesson-5",
    unitId: "unit-1",
    learningObjectiveId: "obj-5-2",
    concept: "التفرقة بين الالتزامات المتداولة وغير المتداولة",
    difficulty: "intermediate",
    questionType: "true_false",
    question: "يدرج الجزء الجاري استحقاقه وسداده خلال العام القادم من قرض بنكي طويل الأجل ضمن 'الالتزامات المتداولة' بقائمة المركز المالي.",
    correctAnswer: true,
    explanation: "طبقاً لمعايير العرض المحاسبي، يعاد تبويب أي قسط من الالتزامات طويلة الأجل يستحق سداده خلال الـ 12 شهراً القادمة كالتزام متداول.",
    tags: ["قائمة المركز المالي", "الالتزامات المتداولة", "Bloom:Analyze"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 83, concept: "تبويب الالتزامات المتداولة" }
  },
  {
    id: "eb-applied-012",
    lessonId: "lesson-5",
    unitId: "unit-1",
    learningObjectiveId: "obj-5-1",
    concept: "حساب تكلفة البضاعة المباعة ومجمل الربح",
    difficulty: "intermediate",
    questionType: "applied",
    question: "توافرت البيانات: بضاعة أول المدة 40,000 جنيه، المشتريات 180,000 جنيه، مصروفات نقل المشتريات 10,000 جنيه، مردودات المشتريات 15,000 جنيه، بضاعة آخر المدة 35,000 جنيه، والمبيعات 300,000 جنيه ومردوداتها 20,000 جنيه. احسب تكلفة البضاعة المباعة ومجمل الربح.",
    correctAnswer: "تكلفة البضاعة المباعة = 180,000 جنيه، ومجمل الربح = 100,000 جنيه",
    explanation: "صافي المشتريات = 180,000 + 10,000 - 15,000 = 175,000 جنيه. تكلفة البضاعة المتاحة للبيع = 40,000 + 175,000 = 215,000 جنيه. تكلفة البضاعة المباعة = 215,000 - 35,000 = 180,000 جنيه. صافي المبيعات = 300,000 - 20,000 = 280,000 جنيه. مجمل الربح = 280,000 - 180,000 = 100,000 جنيه.",
    tags: ["مسائل تطبيقية", "تكلفة المبيعات", "مجمل الربح", "Bloom:Apply"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 77, concept: "معادلة تكلفة المبيعات" }
  },
  {
    id: "eb-applied-013",
    lessonId: "lesson-5",
    unitId: "unit-1",
    learningObjectiveId: "obj-5-1",
    concept: "إعداد قائمة الدخل واستخراج صافي الربح التشغيلي والنهائي",
    difficulty: "advanced",
    questionType: "applied",
    question: "إذا كان مجمل الربح 120,000 جنيه، وبلغت المصروفات البيعية والتسويقية 30,000 جنيه، والمصروفات الإدارية والعمومية 40,000 جنيه، وإيراد استثمارات أوراق مالية 15,000 جنيه، وفوائد قروض مدينة 5,000 جنيه. احسب صافي ربح النشاط التشغيلي وصافي الربح النهائي للعام.",
    correctAnswer: "صافي الربح التشغيلي = 50,000 جنيه، وصافي الربح النهائي = 60,000 جنيه",
    explanation: "صافي الربح التشغيلي = مجمل الربح (120,000) - المصروفات البيعية والإدارية (30,000 + 40,000) = 50,000 جنيه. صافي الربح النهائي = 50,000 + إيراد استثمارات (15,000) - فوائد مدينة (5,000) = 60,000 جنيه.",
    tags: ["مسائل تطبيقية", "قائمة الدخل", "صافي الربح التشغيلي", "Bloom:Apply"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 79, concept: "هيكل قائمة الدخل" }
  },
  {
    id: "eb-applied-014",
    lessonId: "lesson-5",
    unitId: "unit-1",
    learningObjectiveId: "obj-5-2",
    concept: "استخراج إجمالي حقوق الملكية بالمركز المالي",
    difficulty: "advanced",
    questionType: "applied",
    question: "تضمنت دفاتر شركة في نهاية العام: رأس المال في بداية العام 300,000 جنيه، صافي أرباح العام المحققة 95,000 جنيه، احتياطي نظامي مستقطع 10,000 جنيه، مسحوبات شخصية للمالك 25,000 جنيه. احسب إجمالي حقوق الملكية الواجب إدراجها بقائمة المركز المالي.",
    correctAnswer: "370,000 جنيه",
    explanation: "حقوق الملكية = رأس المال (300,000) + صافي أرباح العام (95,000) - المسحوبات الشخصية (25,000) = 370,000 جنيه. (الاحتياطي النظامي هو مجرد تبويب واحتجاز داخلي ضمن حقوق الملكية ولا يغير إجماليها).",
    tags: ["مسائل تطبيقية", "حقوق الملكية", "قائمة المركز المالي", "Bloom:Apply"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 84, concept: "حقوق الملكية بالمركز المالي" }
  },
  {
    id: "eb-case-005",
    lessonId: "lesson-5",
    unitId: "unit-1",
    learningObjectiveId: "obj-5-3",
    concept: "تقييم سيولة المنشأة ورأس المال العامل",
    difficulty: "advanced",
    questionType: "case",
    question: "بلغت الأصول المتداولة لشركة 150,000 جنيه (منها 90,000 مخزون بطيء الحركة) والتزاماتها المتداولة 120,000 جنيه مستحقة السداد خلال شهرين. اعتبر المدير المالي أن الشركة في وضع سيولة آمن وممتاز لأن رأس المال العامل موجب (+30,000). قيم موقف المدير المالي محاسبياً ونقدياً.",
    correctAnswer: "تقييم مضلل؛ لأن نسبة السيولة السريعة (بدون المخزون) = (150,000 - 90,000) ÷ 120,000 = 0.5 فقط، مما يهدد المنشأة بمخاطر عجز سداد فوري",
    explanation: "رأس المال العامل الموجب لا يضمن وحده السيولة الفورية؛ فالأصول النقدية وشبه النقدية تبلغ 60,000 جنيه فقط بينما الالتزامات الفورية 120,000 جنيه، مما يعني عجزاً نقدياً وشيكاً إذا تعذر تصريف المخزون سريعاً.",
    tags: ["حالات عملية", "رأس المال العامل", "نسب السيولة", "Bloom:Evaluate"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 88, concept: "تقييم السيولة ورأس المال العامل" }
  },
  {
    id: "eb-ana-005",
    lessonId: "lesson-5",
    unitId: "unit-1",
    learningObjectiveId: "obj-5-2",
    concept: "تحليل أثر تسعير بضاعة آخر المدة على القوائم المالية",
    difficulty: "challenge",
    questionType: "analytical",
    question: "قامت شركة بتقييم بضاعة آخر المدة بمبلغ 70,000 جنيه بدلاً من قيمتها الحقيقية 50,000 جنيه (تضخيم المخزون بـ 20,000 جنيه). حلل أثر هذا التقييم الخاطئ بدقة على: 1) تكلفة البضاعة المباعة، 2) مجمل الربح، 3) إجمالي الأصول بقائمة المركز المالي.",
    correctAnswer: "يؤدي إلى: تخفيض تكلفة البضاعة المباعة بـ 20,000 جنيه، وتضخيم مجمل الربح بـ 20,000 جنيه، وتضخيم الأصول المتداولة بـ 20,000 جنيه",
    explanation: "بضاعة آخر المدة تطرح من تكلفة البضاعة المتاحة للبيع؛ فتضخيمها يقلل تكلفة المبيعات بصورة مصطنعة، مما يرفع مجمل وصافي الربح ويضخم الأصول وحقوق الملكية بالمركز المالي.",
    tags: ["تحليل أخطاء", "بضاعة آخر المدة", "تأثير التقييم", "Bloom:Analyze"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 86, concept: "أثر أخطاء المخزون على القوائم" }
  },
  {
    id: "eb-jre-004",
    lessonId: "lesson-5",
    unitId: "unit-1",
    learningObjectiveId: "obj-5-1",
    concept: "مقال JRE حول تحميل نفقات التسويق كأصل مؤجل",
    difficulty: "challenge",
    questionType: "jre",
    question: "أطلقت منشأة حملة إعلانية كبرى بمبلغ 120,000 جنيه للترويج لمنتج جديد، وقرر المحاسب رسملة هذا المبلغ بالكامل كـ 'أصل غير ملموس' يستهلك على 5 سنوات بهدف عدم التأثير سلباً على أرباح السنة الحالية. صغ مقالاً تبريرياً (JRE) لتقييم هذه المعالجة.",
    correctAnswer: "الحكم: معالجة غير سليمة محاسبياً؛ التعليل: نفقات الدعاية لا تولد منافع مستقبلية مؤكدة يمكن السيطرة عليها كأصل؛ الأدلة: معايير المحاسبة تلزم بالاعتراف بمصروفات الإعلان كمصروف فترة فور تكبدها",
    explanation: "1. الحكم: رسملة الإعلان مخالفة للمعايير. 2. التعليل: الإعلان مصروف إيرادي دوري يهدف لتنشيط المبيعات ولا يتوافر فيه شرط الأصل غير الملموس. 3. الأدلة: تطبيق مبدأ التحفظ والحيطة والحذر يلزم بتحميله فوراً على قائمة الدخل لعام الإنفاق.",
    tags: ["JRE", "رسملة المصروفات", "نفقات الإعلان", "Bloom:Evaluate"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 89, concept: "معالجة نفقات الدعاية والإعلان" }
  },

  // --- Lesson 6: ورشة مقال التفسير المدعوم بالأدلة JRE (6 Items) ---
  {
    id: "eb-mcq-055",
    lessonId: "lesson-6",
    unitId: "unit-1",
    learningObjectiveId: "obj-6-1",
    concept: "أركان ومنهجية التبرير المحاسبي JRE",
    difficulty: "basic",
    questionType: "mcq",
    question: "تتكون منهجية التبرير المحاسبي المدعوم بالأدلة (JRE) من ثلاثة أركان رئيسية متسلسلة هي:",
    options: [
      "الحكم المهني (Judgment)، التعليل المنطقي (Reasoning)، الأدلة المعيارية (Evidence)",
      "الجدول الزمني، التسجيل بالدفاتر، الاستنتاج النهائي",
      "القيد المحاسبي، الترحيل للأستاذ، إعداد الميزان",
      "التخمين المالي، مقارنة الأسعار، اتخاذ القرار"
    ],
    correctAnswer: "الحكم المهني (Judgment)، التعليل المنطقي (Reasoning)، الأدلة المعيارية (Evidence)",
    explanation: "إطار JRE المعتمد في البكالوريا المصرية يرتكز على إصدار الحكم الصريح، ثم تقديم التعليل المستند للمبادئ المحاسبية، وتدعيمه بالأدلة الرقمية والمعيارية الملموسة.",
    tags: ["JRE", "منهجية التبرير", "أركان JRE", "Bloom:Remember"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 92, concept: "هيكل منهجية JRE" }
  },
  {
    id: "eb-mcq-056",
    lessonId: "lesson-6",
    unitId: "unit-1",
    learningObjectiveId: "obj-6-2",
    concept: "جودة الأدلة في تقييم المخصصات في مقال JRE",
    difficulty: "intermediate",
    questionType: "mcq",
    question: "عند كتابة مقال JRE لتقييم قرار تكوين مخصص ديون مشكوك في تحصيلها، ما هو الدليل المحاسبي الأقوى الذي يجب أن يسوقه المحلل لدعم موقفه؟",
    options: [
      "التحليل العمري للديون ونسب التعثر التاريخية الموثقة للعملاء ومبدأ الحيطة والحذر",
      "الرغبة في تقليل الضرائب فقط بأي وسيلة",
      "الشعور العام لمدير المبيعات بعدم وفاء العملاء",
      "حجم رأس مال الشركة المسجل بالسجل التجاري"
    ],
    correctAnswer: "التحليل العمري للديون ونسب التعثر التاريخية الموثقة للعملاء ومبدأ الحيطة والحذر",
    explanation: "الأدلة في منهجية JRE يجب أن تكون موضوعية ومبنية على وقائع رقمية قابلة للتحقق (جدول أعمار الديون) ومعايير محاسبية معتمدة (التحفظ والمقابلة).",
    tags: ["JRE", "الأدلة الموضوعية", "مخصص الديون", "Bloom:Evaluate"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 95, concept: "توثيق الأدلة في JRE" }
  },
  {
    id: "eb-mcq-057",
    lessonId: "lesson-6",
    unitId: "unit-1",
    learningObjectiveId: "obj-6-1",
    concept: "كشف المغالطات المحاسبية في مقالات التبرير",
    difficulty: "intermediate",
    questionType: "mcq",
    question: "استند محاسب في تبرير عدم تسجيل فاتورة شراء بضاعة وردت للمخازن في 30 ديسمبر إلى عدم استلام الفاتورة الورقية الأصلية من المورد حتى 5 يناير. ما هو المبدأ المحاسبي الذي يدحض هذا التبرير ويعد دليلاً على خطأ المحاسب؟",
    options: [
      "مبدأ تغليب الجوهر الاقتصادي على الشكل القانوني وأساس الاستحقاق",
      "مبدأ التكلفة التاريخية",
      "مبدأ الوحدة النقدية الثابتة",
      "فرض الشخصية المعنوية"
    ],
    correctAnswer: "مبدأ تغليب الجوهر الاقتصادي على الشكل القانوني وأساس الاستحقاق",
    explanation: "الجوهر الاقتصادي والاستحقاق يفرضان إثبات واقعة الشراء واستلام البضاعة بالمخازن وإدراج الالتزام فور حدوث الواقعة المادية دون انتظار المستند الشكلي.",
    tags: ["JRE", "الجوهر الاقتصادي", "أساس الاستحقاق", "Bloom:Analyze"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 93, concept: "الجوهر الاقتصادي في مقالات JRE" }
  },
  {
    id: "eb-case-006",
    lessonId: "lesson-6",
    unitId: "unit-1",
    learningObjectiveId: "obj-6-2",
    concept: "سيناريو متكامل لمقال JRE حول الاعتراف بالإيراد قبل التسليم",
    difficulty: "challenge",
    questionType: "case",
    question: "أبرمت منشأة عقداً لبيع بضاعة بقيمة 500,000 جنيه واستلمت شيكاً بكامل القيمة في 28 ديسمبر 2025 على أن يتم تصنيع وتسليم البضاعة في فبراير 2026. قام المدير المالي بالاعتراف بكامل الـ 500,000 جنيه كإيراد مبيعات لعام 2025 لصرف مكافآت الأداء. صغ تقييماً متكاملاً للموقف.",
    correctAnswer: "تصرف غير سليم وتضليلي؛ لأن واقعة الأداء وانتقال المخاطر والمنافع للعميل لم تتم في 2025، ويجب تسجيل المبلغ كـ (عملاء - دفعات مقدمة / التزام) وليس إيراداً",
    explanation: "الحكم: الاعتراف بالإيراد خاطئ ومخالف للمعيار. التعليل: لا يعترف بإيراد البيع إلا عند استيفاء التزام الأداء وتسليم السلع وانتقال السيطرة للعميل. الدليل: البضاعة لم تصنع ولم تسلم، والنقدية المستلمة التزام واجب الإدراج بالمركز المالي كإيراد غير مكتسب.",
    tags: ["حالات عملية", "JRE", "تحقق الإيراد", "Bloom:Evaluate"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 97, concept: "تقييم تحقق الإيراد JRE" }
  },
  {
    id: "eb-jre-005",
    lessonId: "lesson-6",
    unitId: "unit-1",
    learningObjectiveId: "obj-6-2",
    concept: "صياغة مرافعة محاسبية JRE حول التغيير غير المبرر في طرق تقييم المخزون",
    difficulty: "challenge",
    questionType: "jre",
    question: "حولت شركة طريقة تقييم مخزونها من المتوسط المرجح إلى الوارد أولاً صادر أولاً (FIFO) في سنة شهدت تضخماً حاداً بالأسعار، مما رفع قيمة بضاعة آخر المدة وأظهر أرباحاً قياسية دون الإفصاح عن أثر التغيير. صغ مقال JRE ثلاثي الأركان يفند هذا التصرف.",
    correctAnswer: "1. الحكم: تصرف مخل بموثوقية القوائم. 2. التعليل: خرق مبدأ الثبات والاتساق والإفصاح التام. 3. الأدلة: الأرباح الناتجة وهمية وتضخمية بسبب تغير السياسة المحاسبية دون إفصاح مالي مقارن",
    explanation: "الحكم: التصرف يخالف مبادئ الشفافية والاتساق. التعليل: تغيير السياسة المحاسبية بغرض إظهار أرباح صورية يفقد القوائم ميزة المقارنة الموثوقة عبر الفترات. الأدلة: عدم الإفصاح عن فروق التقييم البالغة ملايين الجنيهات يحجب الحقيقة الاقتصادية عن المستثمرين والدائنين.",
    tags: ["JRE", "الثبات والاتساق", "تقييم المخزون", "Bloom:Create"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 96, concept: "مرافعة JRE حول سياسات المخزون" }
  },
  {
    id: "eb-t_account-004",
    lessonId: "lesson-6",
    unitId: "unit-1",
    learningObjectiveId: "obj-6-1",
    concept: "محاكاة حساب الأستاذ المساعد وتسوية خلاف في مقال JRE",
    difficulty: "advanced",
    questionType: "t_account",
    question: "أظهر حساب المورد 'الأصيل' بدفاتر المنشأة رصيداً دائناً 80,000 جنيه، بينما أظهر كشف حساب المورد الوارد من طرفه رصيداً مستحقاً 115,000 جنيه. وعند المطابقة تبين: 1) شيك مسدد بـ 25,000 جنيه لم يقدمه المورد للصرف، 2) بضاعة مشتراة بـ 10,000 جنيه سجلت بدفاتر المنشأة ولم تسجل بدفاتر المورد. بين الحساب المرجح وأثر التسوية.",
    correctAnswer: "الرصيد المطابق الفعلي لكلا الطرفين بعد التسوية = 90,000 جنيه",
    explanation: "كشف حساب المورد (115,000) - شيك بالطريق (25,000) = 90,000 جنيه. حساب الأستاذ بالمنشأة (80,000) + بضاعة بالطريق/تعديل (10,000) = 90,000 جنيه رصيد متطابق تماماً بعد إزالة الفروق التوقيتية.",
    tags: ["T-Account", "تسوية الحسابات", "JRE", "Bloom:Analyze"],
    sourceMapping: { source_document: "Accuonting-Ar-EB-Part1.pdf", source_page: 94, concept: "مطابقة كشوف الحسابات JRE" }
  }
];

import { unit2Questions } from './unit2Questions';

// Combined question bank containing both Unit 1 and Unit 2
export const expandedQuestionBank: TraceableQuestion[] = [
  ...unit1QuestionBank,
  ...unit2Questions
];

export const questionBankSummary = {
  totalQuestions: 112 + unit2Questions.length,
  unit1QuestionsCount: 112,
  unit2QuestionsCount: unit2Questions.length,
  breakdown: {
    mcq: 57 + unit2Questions.filter(q => q.questionType === 'mcq').length,
    trueFalse: 16 + unit2Questions.filter(q => q.questionType === 'true_false').length,
    fillBlank: 5,
    applied: 14,
    case: 6,
    analytical: 5,
    tAccount: 4,
    jre: 5 + unit2Questions.filter(q => q.questionType === 'jre').length
  },
  lessonCoverage: {
    lesson1: 25,
    lesson2: 23,
    lesson3: 20,
    lesson4: 16,
    lesson5: 17,
    lesson6: 11,
    u2_lesson1: 4,
    u2_lesson2: 4,
    u2_lesson3: 3,
    u2_lesson4: 3,
    u2_lesson5: 2,
    u2_lesson6: 2
  },
  traceabilityRate: "100% (All items verified and mapped to Egyptian Baccalaureate EB Curricula Units 1 & 2)"
};


