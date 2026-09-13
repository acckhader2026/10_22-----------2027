/**
 * Unit 2 Official JRE Rubric Contract
 * روبرك تقييم مقال التفسير المدعوم بالأدلة (JRE) الرسمي للوحدة الثانية – ميزان المراجعة والتحقيق الاستقصائي
 *
 * معرف الروبرك: U02-JRE-RUBRIC-01
 * الدرجة الكلية: 20 درجة
 * الأبعاد الخمسة (4 درجات لكل بعد):
 * 1. Framework (الإطار الفكري وتحديد الموقف): 4 درجات
 * 2. Deep Analysis (التحليل المحاسبي العميق لآليات التضليل): 4 درجات
 * 3. Evidence (استخدام الأدلة من واقع الحالة المحاسبية): 4 درجات
 * 4. Organization (التنظيم والترابط الهيكلي للمرافعة الاستقصائية): 4 درجات
 * 5. Judgment (الحكم المهني والتوصيات المبررة): 4 درجات
 */

export interface Unit2JRERubricDimension {
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

export interface Unit2JRERubricContract {
  id: 'U02-JRE-RUBRIC-01';
  titleAr: string;
  titleEn: string;
  unitId: 'unit-2';
  associatedQuestionId: 'eb2-jre-001' | 'u2-bank-q36';
  totalMarks: 20;
  dimensions: Unit2JRERubricDimension[];
}

export const UNIT2_JRE_RUBRIC: Unit2JRERubricContract = {
  id: 'U02-JRE-RUBRIC-01',
  titleAr: 'روبرك تقييم مقال التفسير المدعوم بالأدلة (JRE) – الوحدة الثانية',
  titleEn: 'Unit 2 JRE Canonical Assessment Rubric (20 Marks)',
  unitId: 'unit-2',
  associatedQuestionId: 'eb2-jre-001',
  totalMarks: 20,
  dimensions: [
    {
      id: 'framework',
      nameAr: 'الإطار الفكري وتحديد الموقف (Intellectual Framework)',
      nameEn: 'Intellectual Framework',
      maxMarks: 4,
      weight: 0.20,
      descriptionAr: 'التفريق الجوهري بين الاتساق الحسابي الداخلي (توازن الميزان) والتمثيل الصادق للواقع الاقتصادي، مع تحديد موقف استقصائي صريح ودقيق.',
      descriptors: [
        { score: 4, labelAr: 'متميز', criteriaAr: 'تحديد دقيق للفرق بين التوازن الرياضي الشكلي والصدق في التعبير، مع صياغة أطروحة استقصائية محكمة تفند ادعاءات النزاهة المطلقة.' },
        { score: 3, labelAr: 'متقن', criteriaAr: 'طرح سليم يوضح حدود ميزان المراجعة كأداة مطابقة مبدئية مع اتخاذ موقف واضح.' },
        { score: 2, labelAr: 'نامٍ', criteriaAr: 'تعريف عام لميزان المراجعة دون تمييز عميق بين التوازن الحسابي والجوهر الاقتصادي.' },
        { score: 1, labelAr: 'محدود', criteriaAr: 'مقدمة سطحية أو لبس في مفهوم وظيفة ميزان المراجعة ونطاق حجيته.' },
        { score: 0, labelAr: 'غير مستوفٍ', criteriaAr: 'غياب تام للإطار الفكري المحاسبي.' }
      ]
    },
    {
      id: 'deep_analysis',
      nameAr: 'التحليل المحاسبي العميق لآليات التضليل (Deep Accounting Analysis)',
      nameEn: 'Deep Accounting Analysis',
      maxMarks: 4,
      weight: 0.20,
      descriptionAr: 'تفكيك آليات الأخطاء التي لا تخل بتوازن الميزان: خطأ التوجيه (رسملة المصروفات)، السهو الكلي، والاعتراف المبكر بإيراد وهمي، وشرح أثر كل منها على الأرباح والميزانية.',
      descriptors: [
        { score: 4, labelAr: 'متميز', criteriaAr: 'تحليل سببي متعمق يفصل أثر رسملة المصروفات على تضخيم الأرباح والأصول، وأثر السهو على كتمان الالتزامات مع بقاء الميزان متوازناً تماماً.' },
        { score: 3, labelAr: 'متقن', criteriaAr: 'تحليل محاسبي صحيح يغطي نوعين على الأقل من الأخطاء المتكافئة مع شرح أثرها على القوائم.' },
        { score: 2, labelAr: 'نامٍ', criteriaAr: 'ذكر أنواع الأخطاء دون بيان الآلية الدقيقة لبقاء الميزان متوازناً رغم وجود التضليل.' },
        { score: 1, labelAr: 'محدود', criteriaAr: 'سرد وصفي عام دون تفكيك لأثر الأخطاء على معادلتي الدخل والمركز المالي.' },
        { score: 0, labelAr: 'غير مستوفٍ', criteriaAr: 'انعدام أي تحليل محاسبي تخصصي.' }
      ]
    },
    {
      id: 'evidence',
      nameAr: 'استخدام الأدلة المحاسبية من واقع الحالة (Evidence Usage)',
      nameEn: 'Evidence Usage',
      maxMarks: 4,
      weight: 0.20,
      descriptionAr: 'الاستشهاد الدقيق بأرقام المعاملات والحسابات (مثل: رسملة استشارات بـ 40,000 ج، إيراد وهمي 30,000 ج، سهو فواتير 15,000 ج، والربح الحقيقي 35,000 ج مقابل 120,000 ج المعلن).',
      descriptors: [
        { score: 4, labelAr: 'متميز', criteriaAr: 'توظيف دقيق للأرقام المحاسبية المحددة للحالة لتأكيد كل حجة استقصائية، مع حساب الفارق الكمي في الأرباح.' },
        { score: 3, labelAr: 'متقن', criteriaAr: 'استخدام أدلة رقمية صحيحة من وقائع الحالة مع ربط واضح بالتحليل.' },
        { score: 2, labelAr: 'نامٍ', criteriaAr: 'إشارة مجملة لوقائع الحالة دون ذكر الأرقام بدقة أو وجود أخطاء في الحساب.' },
        { score: 1, labelAr: 'محدود', criteriaAr: 'غياب الأدلة الرقمية والاعتماد على عبارات إنشائية عامة.' },
        { score: 0, labelAr: 'غير مستوفٍ', criteriaAr: 'تجاهل تام لبيانات ومعاملات الحالة الاستقصائية.' }
      ]
    },
    {
      id: 'organization',
      nameAr: 'التنظيم والترابط الهيكلي للمرافعة (Structure & Coherence)',
      nameEn: 'Structure & Coherence',
      maxMarks: 4,
      weight: 0.20,
      descriptionAr: 'بناء مقال تحليلي استقصائي محكم: المقدمة الاستقصائية، تفنيد حجة التوازن، عرض القرائن والأدلة، قيود التصحيح، والخاتمة المهنية.',
      descriptors: [
        { score: 4, labelAr: 'متميز', criteriaAr: 'هيكل مقال استقصائي متكامل الأركان مع تسلسل برهاني منطقي ولغة محاسبية رصينة.' },
        { score: 3, labelAr: 'متقن', criteriaAr: 'بناء هيكلي منظم وواضح مع ترابط منطقي سليم بين الفقرات.' },
        { score: 2, labelAr: 'نامٍ', criteriaAr: 'هيكل غير مكتمل أو انتقال مفاجئ بين الحجج والأدلة.' },
        { score: 1, labelAr: 'محدود', criteriaAr: 'فقرات مفككة تفتقر لمقومات التقرير أو المقال التحليلي.' },
        { score: 0, labelAr: 'غير مستوفٍ', criteriaAr: 'نص عشوائي غير منظم.' }
      ]
    },
    {
      id: 'judgment',
      nameAr: 'الحكم المهني والتوصيات المبررة (Professional Judgment & Recommendations)',
      nameEn: 'Professional Judgment & Recommendations',
      maxMarks: 4,
      weight: 0.20,
      descriptionAr: 'صياغة حكم مهني قاطع وتوصيات استقصائية عملية تركز على المراجعة المستندية المستقلة وتدقيق جودة الأرباح.',
      descriptors: [
        { score: 4, labelAr: 'متميز', criteriaAr: 'استنتاج مهني رفيع وتوصيات عملية وقائية تفند الخدعة الإعلانية وتضع معايير الرقابة المستندية خارج جدول الميزان.' },
        { score: 3, labelAr: 'متقن', criteriaAr: 'حكم مهني سليم ومبرر وتوصيات واضحة ومترابطة مع الأدلة.' },
        { score: 2, labelAr: 'نامٍ', criteriaAr: 'استنتاج عام دون تقديم توصيات محاسبية أو رقابية ملموسة.' },
        { score: 1, labelAr: 'محدود', criteriaAr: 'إعادة تلخيص مقتضبة دون حكم تحليلي أو قيمة مضافة.' },
        { score: 0, labelAr: 'غير مستوفٍ', criteriaAr: 'غياب تام للاستنتاج أو الحكم المهني.' }
      ]
    }
  ]
};
