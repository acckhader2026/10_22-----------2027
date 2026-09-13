export interface UnifiedSkill {
  code: string; // S1 - S15
  nameAr: string;
  nameEn: string;
  category: 'foundational' | 'applied' | 'analytical' | 'evaluative' | 'synthesis';
  descriptionAr: string;
}

export const UNIFIED_SKILLS: UnifiedSkill[] = [
  {
    code: 'S1',
    nameAr: 'استدعاء المعرفة',
    nameEn: 'Knowledge Recall',
    category: 'foundational',
    descriptionAr: 'استرجاع المفاهيم والمصطلحات المحاسبية الأساسية والتعريفات المعيارية بدقة.'
  },
  {
    code: 'S2',
    nameAr: 'الفهم والتفسير',
    nameEn: 'Comprehension & Interpretation',
    category: 'foundational',
    descriptionAr: 'استيعاب المنطق الاقتصادي والمحاسبي وتفسير دلالات العمليات والقواعد.'
  },
  {
    code: 'S3',
    nameAr: 'التصنيف والتمييز',
    nameEn: 'Classification & Distinction',
    category: 'analytical',
    descriptionAr: 'فرز العمليات والحسابات إلى فئاتها الصحيحة والتمييز بين المفاهيم المتقاربة (مثل الربح والنقدية، الأصل والمصروف).'
  },
  {
    code: 'S4',
    nameAr: 'التطبيق',
    nameEn: 'Application',
    category: 'applied',
    descriptionAr: 'تطبيق القواعد المحاسبية (القيد المزدوج، المدين والدائن، الترحيل) على مواقف مالية محددة.'
  },
  {
    code: 'S5',
    nameAr: 'الحساب والاستنتاج الكمي',
    nameEn: 'Calculation & Quantitative Inference',
    category: 'applied',
    descriptionAr: 'إجراء العمليات الحسابية المحاسبية، استخراج الأرصدة، وتحديد مجمل وصافي النتيجة وحقوق الملكية.'
  },
  {
    code: 'S6',
    nameAr: 'تحليل المعاملة',
    nameEn: 'Transaction Analysis',
    category: 'analytical',
    descriptionAr: 'تفكيك المعاملة المالية إلى طرفيها الاقتصاديين، وتحديد أثرها الثنائي على معادلة المركز المالي.'
  },
  {
    code: 'S7',
    nameAr: 'الاستدلال المحاسبي',
    nameEn: 'Accounting Reasoning',
    category: 'analytical',
    descriptionAr: 'بناء مسار منطقي متسلسل يربط بين معطيات الحدث المالي وتوجيهه الدفتري السليم.'
  },
  {
    code: 'S8',
    nameAr: 'اكتشاف الخطأ',
    nameEn: 'Error Detection',
    category: 'analytical',
    descriptionAr: 'تشخيص مواضع الخلل في القيود، الترحيل، الترصيد، أو ميزان المراجعة وتحديد نوع الخطأ.'
  },
  {
    code: 'S9',
    nameAr: 'تصحيح الخطأ',
    nameEn: 'Error Correction',
    category: 'applied',
    descriptionAr: 'صياغة قيود اليومية التصحيحية المناسبة (مباشرة، مضاعفة، أو عبر الحساب المعلق) وإقفال الفروق.'
  },
  {
    code: 'S10',
    nameAr: 'تفسير النتائج',
    nameEn: 'Results Interpretation',
    category: 'evaluative',
    descriptionAr: 'قراءة مخرجات الحسابات الختامية والمركز المالي وفهم دلالاتها على استمرارية ونشاط المنشأة.'
  },
  {
    code: 'S11',
    nameAr: 'المقارنة',
    nameEn: 'Comparison',
    category: 'analytical',
    descriptionAr: 'المفاضلة والتحليل المقارن بين البدائل المحاسبية (النقدي مقابل الاستحقاق، الأثر النقدي مقابل الآجل).'
  },
  {
    code: 'S12',
    nameAr: 'التقييم',
    nameEn: 'Evaluation',
    category: 'evaluative',
    descriptionAr: 'نقد الممارسات والقرارات المحاسبية وفحص مدى توافقها مع المبادئ وفحص كفاية الأدلة.'
  },
  {
    code: 'S13',
    nameAr: 'اتخاذ القرار',
    nameEn: 'Decision Making',
    category: 'evaluative',
    descriptionAr: 'المفاضلة المهنية بين المعالجات البديلة وتقديم توصية مالية أو رقابية مبررة.'
  },
  {
    code: 'S14',
    nameAr: 'الاستدلال المدعوم بالأدلة',
    nameEn: 'Evidence-Based Reasoning',
    category: 'synthesis',
    descriptionAr: 'صياغة حجج محاسبية متماسكة تعتمد على مستندات وأرقام وقواعد المنهج للوصول إلى حكم عادل.'
  },
  {
    code: 'S15',
    nameAr: 'الكتابة المحاسبية المنظمة',
    nameEn: 'Structured Accounting Writing',
    category: 'synthesis',
    descriptionAr: 'صياغة مقالات وتقارير مالية وتفسيرات JRE بهيكل سداسي محكم ولغة مهنية رفيعة.'
  }
];

export const SKILL_BY_CODE = new Map<string, UnifiedSkill>(
  UNIFIED_SKILLS.map(s => [s.code, s])
);
