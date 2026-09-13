/**
 * Unit 3 Official JRE Rubric Contract
 * روبرك تقييم مقال التفسير المدعوم بالأدلة (JRE) الرسمي للوحدة الثالثة – دفاتر اليومية المساعدة
 *
 * معرف الروبرك: U03-JRE-RUBRIC-01
 * الدرجة الكلية: 20 درجة
 * الأبعاد الخمسة (4 درجات لكل بعد):
 * 1. Framework (الإطار الفكري): 4 درجات
 * 2. Deep Analysis (التحليل العميق): 4 درجات
 * 3. Evidence (استخدام الأدلة من حالة بلال): 4 درجات
 * 4. Organization (التنظيم والترابط وفق الأقسام الخمسة): 4 درجات
 * 5. Judgment (الرأي والاستنتاج المبرر): 4 درجات
 */

export interface Unit3JRERubricDimension {
  id: 'framework' | 'deep_analysis' | 'evidence' | 'organization' | 'judgment';
  nameAr: string;
  nameEn: string;
  maxMarks: 4;
  weight: number; // 0.20
  descriptionAr: string;
  descriptors: {
    score: number; // 0 to 4
    labelAr: string;
    criteriaAr: string;
  }[];
}

export interface Unit3JRERubricContract {
  id: 'U03-JRE-RUBRIC-01';
  titleAr: string;
  titleEn: string;
  unitId: 'unit-3';
  associatedQuestionId: 'U3-Q36';
  totalMarks: 20;
  dimensions: Unit3JRERubricDimension[];
}

export const UNIT3_JRE_RUBRIC: Unit3JRERubricContract = {
  id: 'U03-JRE-RUBRIC-01',
  titleAr: 'روبرك تقييم مقال التفسير المدعوم بالأدلة (JRE) – الوحدة الثالثة',
  titleEn: 'Unit 3 JRE Canonical Assessment Rubric (20 Marks)',
  unitId: 'unit-3',
  associatedQuestionId: 'U3-Q36',
  totalMarks: 20,
  dimensions: [
    {
      id: 'framework',
      nameAr: 'الإطار الفكري وتحديد الموقف (Intellectual Framework)',
      nameEn: 'Intellectual Framework',
      maxMarks: 4,
      weight: 0.20,
      descriptionAr: 'تعريف دفاتر اليومية المساعدة ومفهوم الرقابة المزدوجة، وتحديد موقف واضح ومتوازن من إشكالية التخصص والتنسيق.',
      descriptors: [
        { score: 4, labelAr: 'متميز', criteriaAr: 'تحديد دقيق لمفهوم الدفاتر المساعدة والرقابة المزدوجة مع طرح أطروحة محاسبية متوازنة وناضجة.' },
        { score: 3, labelAr: 'متقن', criteriaAr: 'تعريف سليم مع صياغة موقف واضح ومرتبط بمفهوم الرقابة.' },
        { score: 2, labelAr: 'نامٍ', criteriaAr: 'طرح عام لمفهوم الدفاتر المساعدة دون ربط متين بإشكالية الرقابة أو مع غياب الموقف المحدد.' },
        { score: 1, labelAr: 'محدود', criteriaAr: 'مقدمة سطحية أو خلط في مفهوم دفاتر اليومية المساعدة ودورها التنظيمي.' },
        { score: 0, labelAr: 'غير مستوفٍ', criteriaAr: 'غياب تام للإطار الفكري المحاسبي.' }
      ]
    },
    {
      id: 'deep_analysis',
      nameAr: 'التحليل المحاسبي العميق (Deep Analysis)',
      nameEn: 'Deep Analysis',
      maxMarks: 4,
      weight: 0.20,
      descriptionAr: 'تفكيك دور التخصص في تقليل الأخطاء وتسهيل الترحيل، مقابل تفكيك تحديات التنسيق وتعدد مراحل التدقيق بين الدفاتر.',
      descriptors: [
        { score: 4, labelAr: 'متميز', criteriaAr: 'تحليل سببي متعمق يوازن ببراعة بين مزايا التخصص في الحد من أخطاء الازدحام وأعباء التنسيق والمطابقة الدورية.' },
        { score: 3, labelAr: 'متقن', criteriaAr: 'تحليل جيد يغطي جانبي التخصص والتنسيق مع وضوح العلاقة السببية.' },
        { score: 2, labelAr: 'نامٍ', criteriaAr: 'التركيز على مزايا التخصص فقط وإهمال أعباء التنسيق (أو العكس).' },
        { score: 1, labelAr: 'محدود', criteriaAr: 'سرد وصفي سطحي دون تفكيك سببي أو تحليل مقارن.' },
        { score: 0, labelAr: 'غير مستوفٍ', criteriaAr: 'انعدام أي تحليل محاسبي.' }
      ]
    },
    {
      id: 'evidence',
      nameAr: 'استخدام الأدلة من حالة محلات بلال (Evidence Usage)',
      nameEn: 'Evidence Usage',
      maxMarks: 4,
      weight: 0.20,
      descriptionAr: 'الاستشهاد الدقيق بأرقام وحسابات حالة محلات بلال (محلات منصور 45,000، جبريل 22,000، جمال 27,500، الإجمالي 49,500) كشاهد عملي.',
      descriptors: [
        { score: 4, labelAr: 'متميز', criteriaAr: 'توظيف دقيق ومحكم لأرقام المعاملات والمردودات بحالة بلال لتدعيم كل حجة تحليلية.' },
        { score: 3, labelAr: 'متقن', criteriaAr: 'استخدام أدلة رقمية صحيحة من حالة بلال مع ربط جيد بالحجج.' },
        { score: 2, labelAr: 'نامٍ', criteriaAr: 'إشارة عامة لحالة بلال دون توظيف الأرقام المحددة أو مع وجود أخطاء في الاستشهاد.' },
        { score: 1, labelAr: 'محدود', criteriaAr: 'غياب الأدلة الرقمية والاكتفاء بعبارات إنشائية عامة.' },
        { score: 0, labelAr: 'غير مستوفٍ', criteriaAr: 'تجاهل تام لبيانات ومعاملات حالة محلات بلال.' }
      ]
    },
    {
      id: 'organization',
      nameAr: 'التنظيم والترابط الهيكلي (Structure & Coherence)',
      nameEn: 'Structure & Coherence',
      maxMarks: 4,
      weight: 0.20,
      descriptionAr: 'الالتزام بالأقسام الخمسة الرسمية للمقال: المقدمة، الحجة 1 (الكفاءة)، الحجة 2 (التنسيق)، الرد على المعارض، والخاتمة.',
      descriptors: [
        { score: 4, labelAr: 'متميز', criteriaAr: 'بناء هيكلي محكم يتبع الأقسام الخمسة المعتمدة مع انتقال منطقي سلس وأدوات ربط متقدمة.' },
        { score: 3, labelAr: 'متقن', criteriaAr: 'التزام واضح بالأقسام مع ترابط منطقي سليم بين الفقرات.' },
        { score: 2, labelAr: 'نامٍ', criteriaAr: 'إغفال أحد الأقسام (مثل الرد على المعارض) أو ضعف في تسلسل الأفكار.' },
        { score: 1, labelAr: 'محدود', criteriaAr: 'فقرة مفككة غير منتظمة تفتقر للهيكل البنائي للمقال التفسيري.' },
        { score: 0, labelAr: 'غير مستوفٍ', criteriaAr: 'نص عشوائي غير منظم.' }
      ]
    },
    {
      id: 'judgment',
      nameAr: 'الحكم والاستنتاج المبرر (Justified Conclusion)',
      nameEn: 'Justified Conclusion',
      maxMarks: 4,
      weight: 0.20,
      descriptionAr: 'صياغة استنتاج ختامي مبرر يجيب عن السؤال الجوهري ويوضح شروط نجاح الرقابة المزدوجة عملياً.',
      descriptors: [
        { score: 4, labelAr: 'متميز', criteriaAr: 'خاتمة حاسمة ومبررة بالكامل تثبت أن تعزيز الرقابة مشروط بالانضباط في المطابقة، مع تلخيص مبدع لجوهر الموقف.' },
        { score: 3, labelAr: 'متقن', criteriaAr: 'استنتاج سليم ومبرر يجيب عن السؤال الجوهري بصورة واضحة.' },
        { score: 2, labelAr: 'نامٍ', criteriaAr: 'رأي شخصي انطباعي دون تبرير محاسبي كافٍ.' },
        { score: 1, labelAr: 'محدود', criteriaAr: 'إعادة ترديد مقتضبة للمقدمة دون تقديم حكم تحليلي مضاف.' },
        { score: 0, labelAr: 'غير مستوفٍ', criteriaAr: 'غياب تام للخاتمة أو الاستنتاج.' }
      ]
    }
  ]
};
