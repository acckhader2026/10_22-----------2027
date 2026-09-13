import { DocumentaryScenario } from '../types';

/**
 * Egyptian Baccalaureate (EB) Accounting - Documentary Cycle Scenarios Dataset
 * Aligned with Supplementary Enrichment: الدورة المستندية ومصادر القيد (محتوى إثرائي خارج نطاق الكتاب المقرر)
 * Objectives: LO-ENRICH-DOC.1 (Identification), LO-ENRICH-DOC.2 (Data Extraction), LO-ENRICH-DOC.3 (Preliminary Analysis)
 */

export const DOCUMENTARY_SCENARIOS: DocumentaryScenario[] = [
  {
    id: 'doc-sc-001',
    scenarioNumber: 1,
    title: 'بيع بضاعة لعميل تجاري بالأجل (على الحساب)',
    difficulty: 'basic',
    economicEvent: 'في 2026/10/05، قامت منشأة "الأهرام للأدوات الهندسية" ببيع بضاعة بمبلغ 45,000 جنيه إلى "شركة النيل للمقاولات" على الحساب (بالأجل يستحق السداد بعد 45 يوماً)، دون استلام أي نقدية فورية.',
    realWorldContext: 'البيع بالأجل لا يتضمن حركة نقدية في الصندوق، بل ينشئ التزاماً قانونياً على العميل (مدينون/عملاء) وحقاً تعاقدياً للمنشأة.',
    correctDocumentType: 'sales_invoice_credit',
    learningObjectiveId: 'LO-ENRICH-DOC.2',
    candidateOptions: [
      {
        type: 'sales_invoice_credit',
        titleAr: 'فاتورة بيع بضاعة بالأجل (آجلة)',
        categoryBadge: 'مستند مبيعات رسمي',
        isCorrect: true,
        explanation: 'صحيح! فاتورة البيع بالأجل هي المستند القانوني الملزم الذي يثبت تسليم البضاعة للعميل وشروط الدفع الائتماني دون استلام نقدي فوري.'
      },
      {
        type: 'receipt_voucher',
        titleAr: 'سند قبض نقدية (Receipt Voucher)',
        categoryBadge: 'مستند خزينة',
        isCorrect: false,
        explanation: 'غير صحيح؛ سند القبض يُحرر فقط عند استلام أموال نقدية أو شيكات فعلية في الخزينة، وهنا البيع تم على الحساب بالأجل.'
      },
      {
        type: 'warehouse_receipt',
        titleAr: 'إذن إضافة مخزني (بضاعة واردة)',
        categoryBadge: 'مستند مستودعات',
        isCorrect: false,
        explanation: 'غير صحيح؛ إذن الإضافة المخزني يثبت دخول بضاعة جديدة إلى المستودع عند الشراء أو المرتجع، وليس خروج بضاعة مباعة.'
      },
      {
        type: 'payment_voucher',
        titleAr: 'سند صرف نقدية (Payment Voucher)',
        categoryBadge: 'مستند خزينة',
        isCorrect: false,
        explanation: 'غير صحيح؛ سند الصرف مستند لإثبات خروج نقدية من الخزينة لسداد التزام أو مصروف.'
      }
    ],
    documentFacsimile: {
      documentTitle: 'فاتورة بيع ضريبية (مبيعات بالأجل)',
      documentSubtitle: 'أصل للعميل - صورة للحسابات - صورة للمستودع',
      documentNumber: 'INV-2026-0842',
      date: '2026/10/05',
      organizationName: 'شركة الأهرام للأدوات الهندسية ش.م.م - السجل التجاري: 84210',
      counterpartyName: 'السادة / شركة النيل للمقاولات العامة',
      itemsOrDescription: [
        { description: 'أجهزة قياس ليزرية رقمية (فئة أ)', quantity: 10, unitPrice: 3000, total: 30000 },
        { description: 'حقائب معدات سلامة مهنية متكاملة', quantity: 15, unitPrice: 1000, total: 15000 }
      ],
      totalAmount: 45000,
      currency: 'جنيه مصري',
      amountInWords: 'فقط خمسة وأربعون ألف جنيه مصري لا غير',
      paymentMethodText: 'بالأجل (ائتمان تجاري 45 يوماً من تاريخ التحرير)',
      authorizedSignatory: 'أحمد فؤاد (مدير المبيعات)',
      treasurerOrReceiver: 'مندوب العميل: مهندس شريف حامد',
      officialStampText: 'خاتم مبيعات معتمد - شركة الأهرام',
      notes: 'البضاعة المباعة تسلم بموجب إذن صرف مخزني رقم GIN-412.'
    },
    extractionFields: [
      {
        id: 'ext-1-1',
        label: 'تاريخ الحدث الاقتصادي',
        prompt: 'حدد تاريخ تحرير الفاتورة كما يظهر في الترويسة:',
        fieldKey: 'date',
        expectedValue: '2026/10/05',
        options: ['2026/10/01', '2026/10/05', '2026/10/15', '2026/11/20'],
        explanation: 'التاريخ المثبت في خانة تاريخ الفاتورة هو 2026/10/05.'
      },
      {
        id: 'ext-1-2',
        label: 'الطرف المشتري (العميل)',
        prompt: 'حدد الطرف الآخر المدين بقيمة البضاعة:',
        fieldKey: 'counterparty',
        expectedValue: 'شركة النيل للمقاولات العامة',
        options: ['شركة الأهرام للأدوات الهندسية', 'شركة النيل للمقاولات العامة', 'بنك مصر', 'مستودع الأهرام'],
        explanation: 'الطرف المحرر له الفاتورة هو "شركة النيل للمقاولات العامة" ويمثل حـ/ العملاء.'
      },
      {
        id: 'ext-1-3',
        label: 'إجمالي القيمة المحاسبية',
        prompt: 'ما هو المبلغ الإجمالي المستحق الواجب إثباته بالدفاتر؟',
        fieldKey: 'totalAmount',
        expectedValue: '45,000 ج',
        options: ['30,000 ج', '15,000 ج', '45,000 ج', '50,000 ج'],
        explanation: 'إجمالي الفاتورة الصافي هو 45,000 جنيه مصري.'
      },
      {
        id: 'ext-1-4',
        label: 'الرقم المرجعي للمستند',
        prompt: 'استخرج الرقم المسلسل للفاتورة لأغراض الرقابة الداخلية والتوثيق:',
        fieldKey: 'referenceNo',
        expectedValue: 'INV-2026-0842',
        options: ['INV-2026-0842', 'GIN-412', 'REC-104', '84210'],
        explanation: 'الرقم المرجعي المطبوع للفاتورة الضريبية هو INV-2026-0842.'
      }
    ],
    preliminaryAnalysis: {
      account1: {
        accountName: 'حـ/ العملاء (شركة النيل للمقاولات)',
        category: 'asset',
        impact: 'increase',
        nature: 'debit',
        explanation: 'حقوق المنشأة لدى الغير تمثل أصولاً متداولة زادت بقيمة البضاعة المسلمة.'
      },
      account2: {
        accountName: 'حـ/ المبيعات',
        category: 'revenue',
        impact: 'increase',
        nature: 'credit',
        explanation: 'تسليم البضاعة يحقق إيراد مبيعات يرفع أرباح النشاط وحقوق الملكية.'
      },
      accountingEquationRule: 'زيادة في أصل (العملاء +45,000) يقابلها زيادة في حقوق الملكية عبر الإيرادات (المبيعات +45,000)، فتبقى المعادلة متوازنة تماماً.',
      pedagogicalSummary: 'قبل صياغة القيد، علمتنا الفاتورة أن هناك طرفين: أصل متداول زاد (العملاء)، وإيراد تحقق (المبيعات).'
    },
    journalSeed: {
      description: 'إثبات بيع بضاعة بالأجل بموجب فاتورة رقم INV-2026-0842',
      date: '2026-10-05',
      debitAccount: 'حـ/ العملاء (شركة النيل)',
      creditAccount: 'حـ/ المبيعات',
      amount: 45000,
      reference: 'INV-2026-0842'
    }
  },
  {
    id: 'doc-sc-002',
    scenarioNumber: 2,
    title: 'تحصيل مستحقات نقدية من عميل وإيداعها بخزينة المنشأة',
    difficulty: 'basic',
    economicEvent: 'في 2026/10/12، حضر مندوب "شركة النيل للمقاولات" وسدد نقداً مبلغ 20,000 جنيه من حسابه السابق، فقام أمين الخزينة باستلام النقدية وعدها وإيداعها في الصندوق.',
    realWorldContext: 'دخول نقدية للخزينة يستوجب تحرير مستند قبض فوري يسلم أصله للمسدد وتودع صورته في قسم الحسابات.',
    correctDocumentType: 'receipt_voucher',
    learningObjectiveId: 'LO-ENRICH-DOC.1',
    candidateOptions: [
      {
        type: 'receipt_voucher',
        titleAr: 'سند قبض نقدية (Official Receipt Voucher)',
        categoryBadge: 'مستند خزينة رسمي',
        isCorrect: true,
        explanation: 'صحيح! سند القبض هو المستند الرقابي الذي يثبت دخول مبالغ نقدية أو شيكات إلى عهدة أمين الخزينة مع توقيعه بالاستلام.'
      },
      {
        type: 'sales_invoice_cash',
        titleAr: 'فاتورة بيع نقدي',
        categoryBadge: 'مستند مبيعات',
        isCorrect: false,
        explanation: 'غير صحيح؛ لم تحدث مبيعات جديدة، بل تم تحصيل رصيد سابق من عميل مسجل بالفعل بالدفاتر.'
      },
      {
        type: 'payment_voucher',
        titleAr: 'سند صرف نقدية',
        categoryBadge: 'مستند خزينة',
        isCorrect: false,
        explanation: 'غير صحيح؛ سند الصرف مستند لإخراج أموال، بينما هنا المنشأة تقبض وتستلم أموالاً.'
      },
      {
        type: 'bank_cheque',
        titleAr: 'شيك بنكي مسحوب',
        categoryBadge: 'أداة مصرفية',
        isCorrect: false,
        explanation: 'غير صحيح؛ السداد تم نقداً داخل الخزينة، ولم يتسلم أمين الصندوق شيكاً بنكياً.'
      }
    ],
    documentFacsimile: {
      documentTitle: 'سند قبض نقدية معتمد',
      documentSubtitle: 'الأصل للمسدد - صورة للحسابات - صورة لدفتر الصندوق',
      documentNumber: 'REC-2026-0318',
      date: '2026/10/12',
      organizationName: 'شركة الأهرام للأدوات الهندسية ش.م.م',
      counterpartyName: 'السيد / مندوب شركة النيل للمقاولات العامة',
      itemsOrDescription: [
        { description: 'دفعة نقدية تحت حساب الفاتورة الآجلة رقم INV-2026-0842', total: 20000 }
      ],
      totalAmount: 20000,
      currency: 'جنيه مصري',
      amountInWords: 'فقط عشرون ألف جنيه مصري لا غير',
      paymentMethodText: 'نقداً بالخزينة الرئيسية للمنشأة',
      authorizedSignatory: 'محمود عزت (رئيس الحسابات)',
      treasurerOrReceiver: 'سامي عبد الرحمن (أمين الخزينة)',
      officialStampText: 'خزينة الأهرام - مدفوع نقداً',
      notes: 'تم فحص العملات وإيداعها بالخزينة تحت إشراف المراقب الداخلي.'
    },
    extractionFields: [
      {
        id: 'ext-2-1',
        label: 'تاريخ التحصيل الفعلي',
        prompt: 'ما هو تاريخ تسجيل عملية القبض في الخزينة؟',
        fieldKey: 'date',
        expectedValue: '2026/10/12',
        options: ['2026/10/05', '2026/10/12', '2026/10/20', '2026/10/30'],
        explanation: 'تاريخ سند القبض هو 2026/10/12.'
      },
      {
        id: 'ext-2-2',
        label: 'المسدد (الطرف الآخر)',
        prompt: 'من هو الطرف الذي تم استلام النقدية منه وتخفيض حسابه؟',
        fieldKey: 'counterparty',
        expectedValue: 'شركة النيل للمقاولات',
        options: ['شركة النيل للمقاولات', 'شركة الأهرام', 'البنك الأهلي', 'المورد إبراهيم'],
        explanation: 'المسدد هو شركة النيل للمقاولات (حـ/ العملاء).'
      },
      {
        id: 'ext-2-3',
        label: 'المبلغ المقبوض',
        prompt: 'حدد المبلغ النقدي المستلم بالخزينة:',
        fieldKey: 'totalAmount',
        expectedValue: '20,000 ج',
        options: ['45,000 ج', '25,000 ج', '20,000 ج', '10,000 ج'],
        explanation: 'قيمة السند هي 20,000 جنيه مصري.'
      },
      {
        id: 'ext-2-4',
        label: 'رقم سند القبض',
        prompt: 'استخرج الرقم التسلسلي لسند القبض:',
        fieldKey: 'referenceNo',
        expectedValue: 'REC-2026-0318',
        options: ['REC-2026-0318', 'INV-0842', 'PAY-112', 'GIN-412'],
        explanation: 'الرقم التسلسلي المسجل بالسند هو REC-2026-0318.'
      }
    ],
    preliminaryAnalysis: {
      account1: {
        accountName: 'حـ/ الخزينة (النقدية بالصندوق)',
        category: 'asset',
        impact: 'increase',
        nature: 'debit',
        explanation: 'النقدية بالخزينة أصل زاد بقيمة المبلغ المستلم.'
      },
      account2: {
        accountName: 'حـ/ العملاء (شركة النيل)',
        category: 'asset',
        impact: 'decrease',
        nature: 'credit',
        explanation: 'رصيد دين العميل أصل نقص بسبب قيامه بالسداد.'
      },
      accountingEquationRule: 'أصل زاد (الخزينة +20,000) يقابله أصل آخر نقص (العملاء -20,000)؛ إجمالي الأصول ثابت وتوازن المعادلة محفوظ.',
      pedagogicalSummary: 'عملية تحصيل رصيد العميل هي معاملة تبادلية (أصل زاد وأصل نقص) نتجت عن سند القبض.'
    },
    journalSeed: {
      description: 'تحصيل نقدي من شركة النيل بموجب سند قبض REC-2026-0318',
      date: '2026-10-12',
      debitAccount: 'حـ/ الخزينة (الصندوق)',
      creditAccount: 'حـ/ العملاء (شركة النيل)',
      amount: 20000,
      reference: 'REC-2026-0318'
    }
  },
  {
    id: 'doc-sc-003',
    scenarioNumber: 3,
    title: 'سداد إيجار مقر المنشأة الإداري نقداً من الخزينة',
    difficulty: 'intermediate',
    economicEvent: 'في 2026/10/18، قامت إدارة المنشأة بسداد إيجار المقر الشهري وقدره 8,000 جنيه نقداً لمالك العقار "الحاج فؤاد المنشاوي" بعد استيفاء الموافقات الإدارية.',
    realWorldContext: 'صرف أي مبلغ من صندوق المنشأة يحظر تماماً دون سند صرف نقدية معتمد وموقع من المستلم والمفوض بالصرف.',
    correctDocumentType: 'payment_voucher',
    learningObjectiveId: 'LO-ENRICH-DOC.2',
    candidateOptions: [
      {
        type: 'payment_voucher',
        titleAr: 'سند صرف نقدية (Payment Voucher)',
        categoryBadge: 'مستند خزينة رسمي',
        isCorrect: true,
        explanation: 'صحيح! سند الصرف هو المستند الدفتري الرقابي لإخراج سيولة نقدية من عهدة الخزينة لإثبات سداد المصروف أو الالتزام.'
      },
      {
        type: 'receipt_voucher',
        titleAr: 'سند قبض نقدية',
        categoryBadge: 'مستند خزينة',
        isCorrect: false,
        explanation: 'غير صحيح؛ سند القبض يثبت دخول أموال للمنشأة، بينما الإيجار هو خروج نقدية لسداد مصروف.'
      },
      {
        type: 'purchase_invoice_cash',
        titleAr: 'فاتورة شراء بضاعة نقدية',
        categoryBadge: 'مستند بضاعة',
        isCorrect: false,
        explanation: 'غير صحيح؛ الإيجار خدمة تشغيلية دورية ومصروف عام، وليس شراء سلع مادية معدة لإعادة البيع.'
      },
      {
        type: 'warehouse_issue',
        titleAr: 'إذن صرف مخزني',
        categoryBadge: 'مستند مستودعات',
        isCorrect: false,
        explanation: 'غير صحيح؛ إذن الصرف المخزني مخصص لصرف أصناف مادية ومواد خام من المستودع، وليس نقدية.'
      }
    ],
    documentFacsimile: {
      documentTitle: 'سند صرف نقدية معتمد',
      documentSubtitle: 'صورة للمستلم - أصل للحسابات المرفقة بالسجل',
      documentNumber: 'PAY-2026-0512',
      date: '2026/10/18',
      organizationName: 'شركة الأهرام للأدوات الهندسية ش.م.م',
      counterpartyName: 'السيد / فؤاد المنشاوي (مالك العقار)',
      itemsOrDescription: [
        { description: 'قيمة إيجار المقر الإداري والمعرض عن شهر أكتوبر 2026', total: 8000 }
      ],
      totalAmount: 8000,
      currency: 'جنيه مصري',
      amountInWords: 'فقط ثمانية آلاف جنيه مصري لا غير',
      paymentMethodText: 'نقداً من الخزينة الرئيسية',
      authorizedSignatory: 'د. طارق الشناوي (المدير العام)',
      treasurerOrReceiver: 'المستلم: فؤاد المنشاوي (بالرقم القومي: 2750104120)',
      officialStampText: 'صُرف بموجبه - قسم الحسابات',
      notes: 'مرفق إيصال استلام الإيجار الموقع من المالك.'
    },
    extractionFields: [
      {
        id: 'ext-3-1',
        label: 'تاريخ سداد المصروف',
        prompt: 'استخرج تاريخ العملية المسجل بالسند:',
        fieldKey: 'date',
        expectedValue: '2026/10/18',
        options: ['2026/10/01', '2026/10/18', '2026/10/25', '2026/11/01'],
        explanation: 'التاريخ الدفتري المسجل هو 2026/10/18.'
      },
      {
        id: 'ext-3-2',
        label: 'المستفيد من الصرف',
        prompt: 'من هو المستفيد الموقع على استلام النقدية؟',
        fieldKey: 'counterparty',
        expectedValue: 'فؤاد المنشاوي (مالك العقار)',
        options: ['فؤاد المنشاوي (مالك العقار)', 'شركة النيل', 'مكتب الضرائب', 'أمين الخزينة'],
        explanation: 'المستفيد هو الحاج فؤاد المنشاوي مقابل الإيجار.'
      },
      {
        id: 'ext-3-3',
        label: 'المبلغ المنصرف',
        prompt: 'ما هو إجمالي المبلغ المنصرف من الصندوق؟',
        fieldKey: 'totalAmount',
        expectedValue: '8,000 ج',
        options: ['8,000 ج', '18,000 ج', '20,000 ج', '80,000 ج'],
        explanation: 'المبلغ المحدد بسند الصرف هو 8,000 جنيه.'
      },
      {
        id: 'ext-3-4',
        label: 'رقم سند الصرف',
        prompt: 'استخرج كود وسلسلة سند الصرف:',
        fieldKey: 'referenceNo',
        expectedValue: 'PAY-2026-0512',
        options: ['PAY-2026-0512', 'REC-0318', 'CHK-904', 'INV-0842'],
        explanation: 'الكود المسجل هو PAY-2026-0512.'
      }
    ],
    preliminaryAnalysis: {
      account1: {
        accountName: 'حـ/ مصروف الإيجار',
        category: 'expense',
        impact: 'increase',
        nature: 'debit',
        explanation: 'المصروفات تمثل عبئاً تشغيلياً على الفترة وتخفض حقوق الملكية.'
      },
      account2: {
        accountName: 'حـ/ الخزينة (الصندوق)',
        category: 'asset',
        impact: 'decrease',
        nature: 'credit',
        explanation: 'الأصل النقدي بالخزينة نقص بقيمة ما تم صرفه للمؤجر.'
      },
      accountingEquationRule: 'نقص في الأصول (الخزينة -8,000) يقابله نقص في حقوق الملكية عبر زيادة المصروفات (-8,000)، وتظل المعادلة متوازنة.',
      pedagogicalSummary: 'سند الصرف يوثق خروج الأصل النقدي وتحمل المنشأة لمصروف الإيجار.'
    },
    journalSeed: {
      description: 'إثبات سداد إيجار شهر أكتوبر بسند صرف رقم PAY-2026-0512',
      date: '2026-10-18',
      debitAccount: 'حـ/ مصروف الإيجار',
      creditAccount: 'حـ/ الخزينة (الصندوق)',
      amount: 8000,
      reference: 'PAY-2026-0512'
    }
  },
  {
    id: 'doc-sc-004',
    scenarioNumber: 4,
    title: 'سداد مستحقات مورد تجاري بتحرير شيك بنكي مسحوب على الحساب الجاري',
    difficulty: 'intermediate',
    economicEvent: 'في 2026/10/24، قامت المنشأة بتحرير شيك بنكي مسحوب على بنك مصر لصالح المورد "شركة السلام للتوريدات" بمبلغ 35,000 جنيه لسداد فاتورة مشتريات سابقة.',
    realWorldContext: 'الشيك البنكي هو أمر كتابي غير معلق على شرط موجه من الساحب (المنشأة) إلى المسحوب عليه (البنك) بدفع مبلغ معين للمستفيد.',
    correctDocumentType: 'bank_cheque',
    learningObjectiveId: 'LO-ENRICH-DOC.1',
    candidateOptions: [
      {
        type: 'bank_cheque',
        titleAr: 'شيك بنكي صادر (Bank Cheque)',
        categoryBadge: 'أداة دفع مصرفية قانونية',
        isCorrect: true,
        explanation: 'صحيح! الشيك البنكي الصادر هو الأمر المصرفي المكتوب الذي يخول المستفيد صرف أو قيد المبلغ من الحساب الجاري للمنشأة في البنك.'
      },
      {
        type: 'payment_voucher',
        titleAr: 'سند صرف نقدية من الصندوق',
        categoryBadge: 'مستند خزينة',
        isCorrect: false,
        explanation: 'غير صحيح؛ سند الصرف مخصص للخزينة النقدية، بينما الدفع تم هنا بأمر مصرفي شيكي مسحوب على رصيد البنك.'
      },
      {
        type: 'purchase_invoice_credit',
        titleAr: 'فاتورة شراء بالأجل',
        categoryBadge: 'مستند مشتريات',
        isCorrect: false,
        explanation: 'غير صحيح؛ الفاتورة صدرت في الماضي عند شراء البضاعة، والمعاملة الحالية هي سداد دين سابق.'
      },
      {
        type: 'warehouse_receipt',
        titleAr: 'إذن إضافة مخزني',
        categoryBadge: 'مستند مستودعات',
        isCorrect: false,
        explanation: 'غير صحيح؛ لا توجد حركة بضاعة واردة حالية، بل تسوية مالية مصرفية.'
      }
    ],
    documentFacsimile: {
      documentTitle: 'شيك مصرفي تجاري - بنك مصر',
      documentSubtitle: 'فرع طلعت حرب - الحساب الجاري: 104-002-88741',
      documentNumber: 'CHK-EG-994120',
      date: '2026/10/24',
      organizationName: 'الساحب: شركة الأهرام للأدوات الهندسية',
      counterpartyName: 'ادفعوا لأمر: السادة / شركة السلام للتوريدات الصناعية',
      itemsOrDescription: [
        { description: 'سداد رصيد الفاتورة المعتمدة رقم PUR-910 عن توريد كابلات', total: 35000 }
      ],
      totalAmount: 35000,
      currency: 'جنيه مصري',
      amountInWords: 'فقط خمسة وثلاثون ألف جنيه مصري لا غير',
      paymentMethodText: 'شيك بنكي غير قابل للتظهير (يصرف للمستفيد الأول فقط)',
      authorizedSignatory: 'توقيع أول: حسام الدين كامل / توقيع ثان: م. نبيل خيري',
      treasurerOrReceiver: 'المستفيد: شركة السلام للتوريدات',
      officialStampText: 'شيك مصرفي معتمد - بنك مصر',
      notes: 'مسحوب على الرصيد الجاري تحت المراجعة المصرفية.',
      bankName: 'بنك مصر - فرع طلعت حرب',
      chequeNumber: '994120'
    },
    extractionFields: [
      {
        id: 'ext-4-1',
        label: 'تاريخ استحقاق الشيك',
        prompt: 'استخرج تاريخ تحرير الشيك المصرفي:',
        fieldKey: 'date',
        expectedValue: '2026/10/24',
        options: ['2026/10/10', '2026/10/24', '2026/11/01', '2026/12/31'],
        explanation: 'التاريخ المدون على الشيك هو 2026/10/24.'
      },
      {
        id: 'ext-4-2',
        label: 'المستفيد من الشيك',
        prompt: 'من هو المستفيد المحدد الذي سيخفض التزامه بالدفاتر؟',
        fieldKey: 'counterparty',
        expectedValue: 'شركة السلام للتوريدات الصناعية',
        options: ['شركة السلام للتوريدات الصناعية', 'بنك مصر', 'شركة الأهرام', 'مندوب الصندوق'],
        explanation: 'المستفيد هو شركة السلام للتوريدات (حـ/ الموردون).'
      },
      {
        id: 'ext-4-3',
        label: 'قيمة الشيك',
        prompt: 'ما هي القيمة بالأرقام المحررة بالشيك؟',
        fieldKey: 'totalAmount',
        expectedValue: '35,000 ج',
        options: ['30,000 ج', '35,000 ج', '45,000 ج', '50,000 ج'],
        explanation: 'القيمة هي 35,000 جنيه مصري.'
      },
      {
        id: 'ext-4-4',
        label: 'رقم الشيك البنكي',
        prompt: 'حدد الرقم التسلسلي المطبوع في أسفل الشيك المصرفي:',
        fieldKey: 'referenceNo',
        expectedValue: 'CHK-EG-994120',
        options: ['CHK-EG-994120', 'PAY-0512', 'PUR-910', 'INV-0842'],
        explanation: 'الرقم المرجعي هو CHK-EG-994120.'
      }
    ],
    preliminaryAnalysis: {
      account1: {
        accountName: 'حـ/ الموردون (شركة السلام)',
        category: 'liability',
        impact: 'decrease',
        nature: 'debit',
        explanation: 'الالتزام المستحق على المنشأة تجاه الموردين نقص بسبب السداد.'
      },
      account2: {
        accountName: 'حـ/ البنك (الحساب الجاري)',
        category: 'asset',
        impact: 'decrease',
        nature: 'credit',
        explanation: 'الأصل النقدي في البنك سينقص عند تقديم الشيك للصرف أو المقاصة.'
      },
      accountingEquationRule: 'نقص في الالتزامات (الموردون -35,000) يقابله نقص مماثل في الأصول (البنك -35,000)؛ وتظل كفتا المعادلة متطابقتين.',
      pedagogicalSummary: 'الشيك البنكي وسيط مدفوعات يحرك الحساب الجاري للمنشأة في مواجهة ديون الموردين.'
    },
    journalSeed: {
      description: 'سداد مستحقات شركة السلام بشيك رقم 994120 مسحوب على بنك مصر',
      date: '2026-10-24',
      debitAccount: 'حـ/ الموردون (شركة السلام)',
      creditAccount: 'حـ/ البنك',
      amount: 35000,
      reference: 'CHK-EG-994120'
    }
  },
  {
    id: 'doc-sc-005',
    scenarioNumber: 5,
    title: 'فحص واستلام بضاعة مشتراة بالمستودع (إذن إضافة مخزني)',
    difficulty: 'advanced',
    economicEvent: 'في 2026/10/28، وصلت شاحنة المورد إلى مستودعات المنشأة تحمل 50 محركاً كهربائياً، وبعد الفحص الفني والمطابقة لأمر الشراء، استلمها أمين المخزن رسمياً.',
    realWorldContext: 'استلام البضاعة الفعلية ينفصل رقابياً عن استلام الفاتورة؛ فأمين المخزن مسؤول عن الكميات والمواصفات المادية بموجب إذن إضافة مخزني.',
    correctDocumentType: 'warehouse_receipt',
    learningObjectiveId: 'LO-ENRICH-DOC.2',
    candidateOptions: [
      {
        type: 'warehouse_receipt',
        titleAr: 'إذن إضافة مخزني (Goods Received Note - GRN)',
        categoryBadge: 'مستند مستودعات رقابي',
        isCorrect: true,
        explanation: 'صحيح! إذن الإضافة المخزني هو المستند الرقابي الفعلي الذي يثبت دخول أصناف عينية إلى عهدة المستودع بعد الفحص والمطابقة.'
      },
      {
        type: 'warehouse_issue',
        titleAr: 'إذن صرف مخزني (GIN)',
        categoryBadge: 'مستند مستودعات',
        isCorrect: false,
        explanation: 'غير صحيح؛ إذن الصرف يصدر عند خروج البضاعة لتسليمها لعميل أو لخط الإنتاج، بينما هنا البضاعة واردة للمخزن.'
      },
      {
        type: 'payment_voucher',
        titleAr: 'سند صرف نقدية',
        categoryBadge: 'مستند خزينة',
        isCorrect: false,
        explanation: 'غير صحيح؛ إذن الإضافة حركة عينية بضاعية وليست حركة نقدية في الصندوق.'
      },
      {
        type: 'bank_cheque',
        titleAr: 'شيك بنكي',
        categoryBadge: 'أداة مصرفية',
        isCorrect: false,
        explanation: 'غير صحيح؛ الشيك أداة سداد مالي ولا علاقة له باستلام المخزون العيني.'
      }
    ],
    documentFacsimile: {
      documentTitle: 'إذن إضافة مخزني - بضاعة واردة',
      documentSubtitle: 'أصل لإدارة المستودعات - صورة لقسم الحسابات والتكاليف',
      documentNumber: 'GRN-2026-0419',
      date: '2026/10/28',
      organizationName: 'شركة الأهرام للأدوات الهندسية - إدارة المستودعات المركزية (مستودع 1)',
      counterpartyName: 'المورد: الشركة الدولية للمحركات الصناعية',
      itemsOrDescription: [
        { description: 'محركات كهربائية صناعية 3 حصان 380V كود (MTR-03)', quantity: 50, unitPrice: 1200, total: 60000 }
      ],
      totalAmount: 60000,
      currency: 'جنيه مصري',
      amountInWords: 'فقط ستون ألف جنيه مصري لا غير',
      paymentMethodText: 'توريد تنفيذاً لأمر الشراء رقم PO-8820',
      authorizedSignatory: 'مهندس الجودة: كمال الدسوقي (تم الفحص الفني والمطابقة)',
      treasurerOrReceiver: 'أمين المستودع: عادل منصور (أودعت في العنبر ب - رف 4)',
      officialStampText: 'مستودع الأهرام المركزي - تمت الإضافة',
      notes: 'تمت مطابقة الأصناف بنسبة 100% ولا توجد أي تلفيات أو نواقص.'
    },
    extractionFields: [
      {
        id: 'ext-5-1',
        label: 'تاريخ دخول البضاعة للمخزن',
        prompt: 'استخرج تاريخ تحرير إذن الإضافة المخزني:',
        fieldKey: 'date',
        expectedValue: '2026/10/28',
        options: ['2026/10/20', '2026/10/28', '2026/11/01', '2026/11/10'],
        explanation: 'التاريخ المسجل في الإذن هو 2026/10/28.'
      },
      {
        id: 'ext-5-2',
        label: 'المورد الذي تم استلام البضاعة منه',
        prompt: 'من هي الجهة الموردة للأصناف المخزنية؟',
        fieldKey: 'counterparty',
        expectedValue: 'الشركة الدولية للمحركات الصناعية',
        options: ['الشركة الدولية للمحركات الصناعية', 'شركة النيل', 'عميل الأهرام', 'بنك مصر'],
        explanation: 'المورد هو الشركة الدولية للمحركات الصناعية.'
      },
      {
        id: 'ext-5-3',
        label: 'القيمة المقدرة للبضاعة المضافة',
        prompt: 'ما هي القيمة الإجمالية للبضاعة المستلمة في المخزن؟',
        fieldKey: 'totalAmount',
        expectedValue: '60,000 ج',
        options: ['50,000 ج', '60,000 ج', '12,000 ج', '75,000 ج'],
        explanation: 'إجمالي قيمة الأصناف المضافة هو 60,000 جنيه (50 × 1200).'
      },
      {
        id: 'ext-5-4',
        label: 'رقم إذن الإضافة المخزني',
        prompt: 'استخرج الرقم المرجعي لإذن الإضافة:',
        fieldKey: 'referenceNo',
        expectedValue: 'GRN-2026-0419',
        options: ['GRN-2026-0419', 'GIN-412', 'PO-8820', 'PAY-0512'],
        explanation: 'الرقم المرجعي هو GRN-2026-0419.'
      }
    ],
    preliminaryAnalysis: {
      account1: {
        accountName: 'حـ/ المشتريات (أو بضاعة المخزون)',
        category: 'asset',
        impact: 'increase',
        nature: 'debit',
        explanation: 'أصل المخزون المتاح للبيع زاد بقدوم البضاعة الجديدة للمستودع.'
      },
      account2: {
        accountName: 'حـ/ الموردين (الدائنون)',
        category: 'liability',
        impact: 'increase',
        nature: 'credit',
        explanation: 'ينشأ التزام على المنشأة بسداد قيمة البضاعة للمورد لاحقاً.'
      },
      accountingEquationRule: 'أصل زاد (المخزون/المشتريات +60,000) يقابله التزام زاد (الموردون +60,000)؛ فتتوازن طرفا المعادلة بالتساوي.',
      pedagogicalSummary: 'إذن الإضافة المخزني يمثل حلقة الوصل الرقابية بين الشراء الفعلي للسلعة وتحديد الذمة المالية للمورد.'
    },
    journalSeed: {
      description: 'إثبات استلام بضاعة بموجب إذن إضافة مخزني رقم GRN-2026-0419',
      date: '2026-10-28',
      debitAccount: 'حـ/ المشتريات (المخزون)',
      creditAccount: 'حـ/ الموردين (الدولية للمحركات)',
      amount: 60000,
      reference: 'GRN-2026-0419'
    }
  },
  {
    id: 'doc-sc-006',
    scenarioNumber: 6,
    title: 'تسوية بنكية واكتشاف مصروفات وعمولات مصرفية مخصومة من الحساب',
    difficulty: 'advanced',
    economicEvent: 'في 2026/10/31، تلقت المنشأة كشف حساب من البنك الأهلي المصري يفيد بخصم عمولات ومصروفات مصرفية دورية قدرها 1,500 جنيه لم تكن مسجلة بالدفاتر، وتم إعداد مذكرة وإشعار التسوية.',
    realWorldContext: 'مذكرة التسوية البنكية وإشعار الخصم تكشف الفروق بين رصيد البنك في الدفاتر وكشف الحساب البنكي لتسجيل القيود التصحيحية.',
    correctDocumentType: 'bank_reconciliation',
    learningObjectiveId: 'LO-ENRICH-DOC.3',
    candidateOptions: [
      {
        type: 'bank_reconciliation',
        titleAr: 'مذكرة تسوية بنكية / إشعار خصم بنكي (Debit Advice)',
        categoryBadge: 'مستند مطابقة رقابي',
        isCorrect: true,
        explanation: 'صحيح! إشعار الخصم البنكي ومذكرة التسوية هما المستندان الدالان على نقص رصيد البنك لصالح عمولات ومصروفات خدمات مصرفية.'
      },
      {
        type: 'receipt_voucher',
        titleAr: 'سند قبض نقدية',
        categoryBadge: 'مستند خزينة',
        isCorrect: false,
        explanation: 'غير صحيح؛ سند القبض يثبت زيادة أموال، بينما هنا حدث خصم ونقص في رصيد البنك.'
      },
      {
        type: 'warehouse_issue',
        titleAr: 'إذن صرف مخزني',
        categoryBadge: 'مستند مستودعات',
        isCorrect: false,
        explanation: 'غير صحيح؛ لا توجد بضاعة مادية منصرفة.'
      },
      {
        type: 'sales_invoice_cash',
        titleAr: 'فاتورة بيع نقدي',
        categoryBadge: 'مستند مبيعات',
        isCorrect: false,
        explanation: 'غير صحيح؛ المعاملة مصروف مصرفي وليست مبيعات للغير.'
      }
    ],
    documentFacsimile: {
      documentTitle: 'إشعار خصم بنكي رسمي (Bank Debit Advice)',
      documentSubtitle: 'إشعار موجه للعميل - مرفق كشف الحساب الشهري',
      documentNumber: 'BNK-ADV-2026-901',
      date: '2026/10/31',
      organizationName: 'البنك الأهلي المصري - قطاع الخدمات المصرفية للشركات',
      counterpartyName: 'السادة / شركة الأهرام للأدوات الهندسية (حساب رقم 010045889)',
      itemsOrDescription: [
        { description: 'عمولة إدارة حسابات ومصروفات تحويلات إلكترونية ومقاصة شيكات عن شهر أكتوبر', total: 1500 }
      ],
      totalAmount: 1500,
      currency: 'جنيه مصري',
      amountInWords: 'فقط ألف وخمسمائة جنيه مصري لا غير',
      paymentMethodText: 'خصماً مباشراً من الحساب الجاري للمنشأة',
      authorizedSignatory: 'إدارة العمليات المصرفية المركزية - البنك الأهلي',
      treasurerOrReceiver: 'المستلم بالحسابات: مدقق الحسابات البنكية',
      officialStampText: 'البنك الأهلي المصري - قسم التسويات والمقاصة',
      notes: 'قيدت في الجانب المدين لكشف حساب العميل تحت بند مصروفات مصرفية.'
    },
    extractionFields: [
      {
        id: 'ext-6-1',
        label: 'تاريخ الخصم البنكي',
        prompt: 'ما هو تاريخ قيد الخصم في كشف الحساب البنكي؟',
        fieldKey: 'date',
        expectedValue: '2026/10/31',
        options: ['2026/10/01', '2026/10/15', '2026/10/31', '2026/11/05'],
        explanation: 'تاريخ الإشعار والخصم هو 2026/10/31.'
      },
      {
        id: 'ext-6-2',
        label: 'الجهة القائمة بالخصم',
        prompt: 'حدد البنك الذي خصم العمولات من رصيد المنشأة:',
        fieldKey: 'counterparty',
        expectedValue: 'البنك الأهلي المصري',
        options: ['البنك الأهلي المصري', 'بنك مصر', 'شركة النيل', 'مصلحة الضرائب'],
        explanation: 'الجهة المصدرة للإشعار هي البنك الأهلي المصري.'
      },
      {
        id: 'ext-6-3',
        label: 'المبلغ المخصوم',
        prompt: 'ما هي قيمة المصروفات والعمولات البنكية المخصومة؟',
        fieldKey: 'totalAmount',
        expectedValue: '1,500 ج',
        options: ['500 ج', '1,000 ج', '1,500 ج', '15,000 ج'],
        explanation: 'قيمة العمولات والمصروفات هي 1,500 جنيه مصري.'
      },
      {
        id: 'ext-6-4',
        label: 'الرقم المرجعي للإشعار',
        prompt: 'استخرج كود إشعار الخصم البنكي:',
        fieldKey: 'referenceNo',
        expectedValue: 'BNK-ADV-2026-901',
        options: ['BNK-ADV-2026-901', 'GRN-0419', 'CHK-994', 'PAY-0512'],
        explanation: 'الكود هو BNK-ADV-2026-901.'
      }
    ],
    preliminaryAnalysis: {
      account1: {
        accountName: 'حـ/ المصروفات والعمولات البنكية',
        category: 'expense',
        impact: 'increase',
        nature: 'debit',
        explanation: 'المصروفات البنكية تمثل تكلفة خدمات تشغيلية وتخفض صافي أرباح المنشأة.'
      },
      account2: {
        accountName: 'حـ/ البنك (الحساب الجاري)',
        category: 'asset',
        impact: 'decrease',
        nature: 'credit',
        explanation: 'الأصل المالي للمنشأة في البنك نقص بقيمة العمولات المخصومة تلقائياً.'
      },
      accountingEquationRule: 'نقص في الأصول (البنك -1,500) يقابله نقص في حقوق الملكية عبر زيادة المصروفات (-1,500)، وتبقى المعادلة متطابقة.',
      pedagogicalSummary: 'مذكرة التسوية البنكية تبرز أهمية تدقيق المستندات الخارجية لضبط الدفاتر الداخلية.'
    },
    journalSeed: {
      description: 'إثبات مصروفات وعمولات بنكية بموجب إشعار خصم رقم BNK-ADV-2026-901',
      date: '2026-10-31',
      debitAccount: 'حـ/ المصروفات والعمولات البنكية',
      creditAccount: 'حـ/ البنك',
      amount: 1500,
      reference: 'BNK-ADV-2026-901'
    }
  }
];

export const DOCUMENT_TYPE_METADATA: Record<string, { label: string; icon: string; description: string }> = {
  sales_invoice_credit: {
    label: 'فاتورة بيع بالأجل',
    icon: 'FileText',
    description: 'تثبت خروج بضاعة للعميل مع نشوء دين تجاري دون تحصيل نقدي فوري.'
  },
  sales_invoice_cash: {
    label: 'فاتورة بيع نقدي',
    icon: 'FileCheck',
    description: 'تثبت تسليم البضاعة مع استلام قيمتها نقداً فورياً في الخزينة.'
  },
  purchase_invoice_credit: {
    label: 'فاتورة شراء بالأجل',
    icon: 'ShoppingBag',
    description: 'تثبت شراء مواد أو بضائع من مورد مع تأجيل السداد (دائنون).'
  },
  purchase_invoice_cash: {
    label: 'فاتورة شراء نقدي',
    icon: 'ShoppingCart',
    description: 'تثبت شراء أصناف وسداد قيمتها فورياً من الصندوق.'
  },
  receipt_voucher: {
    label: 'سند قبض نقدية وشيكات',
    icon: 'ArrowDownLeft',
    description: 'يثبت دخول أموال أو شيكات إلى خزينة المنشأة وتحرير إيصال للمسدد.'
  },
  payment_voucher: {
    label: 'سند صرف نقدية',
    icon: 'ArrowUpRight',
    description: 'يثبت خروج أموال نقدية من الخزينة لسداد التزام أو مصروف معتمد.'
  },
  bank_cheque: {
    label: 'شيك بنكي مسحوب',
    icon: 'CreditCard',
    description: 'أمر مصرفي موجه للبنك بصرف مبلغ للمستفيد من رصيد الحساب الجاري.'
  },
  warehouse_receipt: {
    label: 'إذن إضافة مخزني (GRN)',
    icon: 'PackagePlus',
    description: 'يثبت استلام بضاعة مادية في المستودع بعد فحصها ومطابقتها.'
  },
  warehouse_issue: {
    label: 'إذن صرف مخزني (GIN)',
    icon: 'PackageMinus',
    description: 'يثبت خروج بضاعة من المستودع لتسليمها لعميل أو إدخالها في التشغيل.'
  },
  bank_reconciliation: {
    label: 'مذكرة تسوية / إشعار خصم بنكي',
    icon: 'Landmark',
    description: 'توضح الفروق بين دفاتر المنشأة وكشف الحساب المصرفي لتسوية العمولات والأخطاء.'
  }
};
