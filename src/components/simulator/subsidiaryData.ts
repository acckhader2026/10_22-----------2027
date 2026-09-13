import { 
  SalesDayBookEntry, 
  PurchasesDayBookEntry, 
  SalesReturnsEntry, 
  PurchasesReturnsEntry, 
  CashBookReceipt, 
  CashBookPayment, 
  PettyCashExpense,
  SubsidiaryCustomerAccount,
  SubsidiarySupplierAccount,
  Unit4SimulatedError
} from './types';

// Preset Unit 3 Data: مؤسسة فريدة ومحلات بلال التجارية (نماذج كتاب الوزارة المعتمدة)
export const INITIAL_SALES_ENTRIES: SalesDayBookEntry[] = [
  {
    id: 's-1',
    date: '2026/02/02',
    customerName: 'مؤسسة الأهرام التجارية',
    customerLedgerFolio: 'ع/101',
    invoiceNo: 'فاتورة مبيعات رقم 401',
    terms: 'صافي 30 يوماً',
    grossAmount: 30000,
    tradeDiscountPercent: 10,
    netAmount: 27000, // 30,000 - 3,000
    postedToSubsidiary: true
  },
  {
    id: 's-2',
    date: '2026/02/08',
    customerName: 'شركة النيل للخدمات واللوازم',
    customerLedgerFolio: 'ع/102',
    invoiceNo: 'فاتورة مبيعات رقم 402',
    terms: '2/10 صافي 30',
    grossAmount: 20000,
    tradeDiscountPercent: 5,
    netAmount: 19000, // 20,000 - 1,000
    postedToSubsidiary: true
  },
  {
    id: 's-3',
    date: '2026/02/15',
    customerName: 'محلات بلال الحديثة',
    customerLedgerFolio: 'ع/103',
    invoiceNo: 'فاتورة مبيعات رقم 403',
    terms: 'صافي 15 يوماً',
    grossAmount: 16000,
    tradeDiscountPercent: 0,
    netAmount: 16000,
    postedToSubsidiary: true
  },
  {
    id: 's-4',
    date: '2026/02/22',
    customerName: 'العميل أحمد حسن',
    customerLedgerFolio: 'ع/104',
    invoiceNo: 'فاتورة مبيعات رقم 404',
    terms: 'على الحساب',
    grossAmount: 8000,
    tradeDiscountPercent: 0,
    netAmount: 8000,
    postedToSubsidiary: true
  }
];

export const INITIAL_PURCHASES_ENTRIES: PurchasesDayBookEntry[] = [
  {
    id: 'p-1',
    date: '2026/02/01',
    supplierName: 'شركة النور للمهمات والتوريدات',
    supplierLedgerFolio: 'م/201',
    invoiceNo: 'فاتورة شراء أصل رقم 710',
    terms: '5/10 صافي 30',
    grossAmount: 40000,
    tradeDiscountPercent: 10,
    netAmount: 36000,
    postedToSubsidiary: true
  },
  {
    id: 'p-2',
    date: '2026/02/07',
    supplierName: 'مؤسسة السلام الصناعية',
    supplierLedgerFolio: 'م/202',
    invoiceNo: 'فاتورة شراء أصل رقم 855',
    terms: 'صافي 60 يوماً',
    grossAmount: 25000,
    tradeDiscountPercent: 0,
    netAmount: 25000,
    postedToSubsidiary: true
  },
  {
    id: 'p-3',
    date: '2026/02/18',
    supplierName: 'شركة الاتحاد للتجارة',
    supplierLedgerFolio: 'م/203',
    invoiceNo: 'فاتورة شراء أصل رقم 920',
    terms: 'على الحساب',
    grossAmount: 15000,
    tradeDiscountPercent: 0,
    netAmount: 15000,
    postedToSubsidiary: true
  }
];

export const INITIAL_SALES_RETURNS_ENTRIES: SalesReturnsEntry[] = [
  {
    id: 'sr-1',
    date: '2026/02/10',
    customerName: 'مؤسسة الأهرام التجارية',
    creditNoteNo: 'إشعار دائن رقم 12',
    reason: 'رد بضاعة تالفة أثناء الشحن غير مطابقة للمواصفات',
    amount: 3000,
    postedToSubsidiary: true
  },
  {
    id: 'sr-2',
    date: '2026/02/24',
    customerName: 'محلات بلال الحديثة',
    creditNoteNo: 'إشعار دائن رقم 13',
    reason: 'سماح مسموحات مبيعات لوجود عيب طفيف بالكرتونة',
    amount: 1000,
    postedToSubsidiary: true
  }
];

export const INITIAL_PURCHASES_RETURNS_ENTRIES: PurchasesReturnsEntry[] = [
  {
    id: 'pr-1',
    date: '2026/02/12',
    supplierName: 'شركة النور للمهمات والتوريدات',
    debitNoteNo: 'إشعار مدين رقم 31',
    reason: 'رد جزء من البضاعة المعيبة لعدم مطابقة الصنف',
    amount: 4000,
    postedToSubsidiary: true
  }
];

export const INITIAL_CASH_RECEIPTS: CashBookReceipt[] = [
  {
    id: 'cr-1',
    date: '2026/02/01',
    description: 'رصيد أول المدة المنقول (Balance b/f)',
    receiptNo: '-',
    ledgerFolio: 'حـ/أستاذ',
    discountAllowed: 0,
    cash: 15000,
    bank: 85000
  },
  {
    id: 'cr-2',
    date: '2026/02/05',
    description: 'تحصيل نقدي من مبيعات نقدية فورية بالمعرض',
    receiptNo: 'إيصال 101',
    ledgerFolio: 'حـ/المبيعات',
    discountAllowed: 0,
    cash: 12000,
    bank: 0
  },
  {
    id: 'cr-3',
    date: '2026/02/14',
    description: 'تحصيل شيك من مؤسسة الأهرام مع منح خصم تعجيل دفع',
    receiptNo: 'شيك 601',
    ledgerFolio: 'أستاذ عملاء ع/101',
    discountAllowed: 1000,
    cash: 0,
    bank: 23000
  },
  {
    id: 'cr-4',
    date: '2026/02/20',
    description: 'تحويل نقدية من الخزينة وإيداعها بالبنك (قيد عكسي)',
    receiptNo: 'إذن إيداع 40',
    ledgerFolio: 'ع (Contra)',
    discountAllowed: 0,
    cash: 0,
    bank: 10000,
    isContra: true
  }
];

export const INITIAL_CASH_PAYMENTS: CashBookPayment[] = [
  {
    id: 'cp-1',
    date: '2026/02/03',
    description: 'تغذية سلفة صندوق المصروفات النثرية المستديمة',
    voucherNo: 'شيك رقم 901',
    ledgerFolio: 'حـ/السلفة',
    discountReceived: 0,
    cash: 0,
    bank: 5000
  },
  {
    id: 'cp-2',
    date: '2026/02/09',
    description: 'سداد مستحقات شركة النور بشيك مع الاستفادة من خصم السداد',
    voucherNo: 'شيك رقم 902',
    ledgerFolio: 'أستاذ موردين م/201',
    discountReceived: 2000,
    cash: 0,
    bank: 30000
  },
  {
    id: 'cp-3',
    date: '2026/02/20',
    description: 'إيداع نقدية من الخزينة في البنك (قيد عكسي)',
    voucherNo: 'إذن صرف 12',
    ledgerFolio: 'ع (Contra)',
    discountReceived: 0,
    cash: 10000,
    bank: 0,
    isContra: true
  },
  {
    id: 'cp-4',
    date: '2026/02/28',
    description: 'سداد رواتب العاملين عن شهر فبراير بشيك بنكي',
    voucherNo: 'شيك رقم 903',
    ledgerFolio: 'حـ/المرتبات',
    discountReceived: 0,
    cash: 0,
    bank: 14000
  }
];

export const INITIAL_PETTY_CASH_EXPENSES: PettyCashExpense[] = [
  {
    id: 'pce-1',
    date: '2026/02/04',
    description: 'شراء طوابع بريد وأوراق رسمية للمراسلات',
    voucherNo: 'سند 01',
    totalPaid: 450,
    postageAndStamps: 450,
    transportation: 0,
    hospitality: 0,
    maintenanceAndGeneral: 0
  },
  {
    id: 'pce-2',
    date: '2026/02/08',
    description: 'مصروفات انتقالات ومواصلات سريعة لمندوب التحصيل',
    voucherNo: 'سند 02',
    totalPaid: 600,
    postageAndStamps: 0,
    transportation: 600,
    hospitality: 0,
    maintenanceAndGeneral: 0
  },
  {
    id: 'pce-3',
    date: '2026/02/15',
    description: 'ضيافة وبوفيه لوفد عملاء المنشأة',
    voucherNo: 'سند 03',
    totalPaid: 850,
    postageAndStamps: 0,
    transportation: 0,
    hospitality: 850,
    maintenanceAndGeneral: 0
  },
  {
    id: 'pce-4',
    date: '2026/02/21',
    description: 'صيانة أدوات مكتبية وإصلاح قفل الباب الرئيسي',
    voucherNo: 'سند 04',
    totalPaid: 500,
    postageAndStamps: 0,
    transportation: 0,
    hospitality: 0,
    maintenanceAndGeneral: 500
  },
  {
    id: 'pce-5',
    date: '2026/02/26',
    description: 'دمغات ونثريات استخراج مستندات رسمية',
    voucherNo: 'سند 05',
    totalPaid: 400,
    postageAndStamps: 400,
    transportation: 0,
    hospitality: 0,
    maintenanceAndGeneral: 0
  }
];

// Initial Customer Subsidiary Accounts
export const INITIAL_CUSTOMER_ACCOUNTS: SubsidiaryCustomerAccount[] = [
  {
    id: 'c-101',
    name: 'مؤسسة الأهرام التجارية',
    code: 'ع/101',
    entries: [
      { id: 'ce-1', date: '2026/02/02', description: 'مبيعات آجلة (فاتورة 401)', documentRef: 'ي/مبيعات', debit: 27000, credit: 0 },
      { id: 'ce-2', date: '2026/02/10', description: 'مردودات مبيعات (إشعار دائن 12)', documentRef: 'ي/مردودات', debit: 0, credit: 3000 },
      { id: 'ce-3', date: '2026/02/14', description: 'سداد بشيك بنكي', documentRef: 'دفتر نقدية', debit: 0, credit: 23000 },
      { id: 'ce-4', date: '2026/02/14', description: 'خصم مسموح به (تعجيل دفع)', documentRef: 'دفتر نقدية', debit: 0, credit: 1000 }
    ]
  },
  {
    id: 'c-102',
    name: 'شركة النيل للخدمات واللوازم',
    code: 'ع/102',
    entries: [
      { id: 'ce-5', date: '2026/02/08', description: 'مبيعات آجلة (فاتورة 402)', documentRef: 'ي/مبيعات', debit: 19000, credit: 0 }
    ]
  },
  {
    id: 'c-103',
    name: 'محلات بلال الحديثة',
    code: 'ع/103',
    entries: [
      { id: 'ce-6', date: '2026/02/15', description: 'مبيعات آجلة (فاتورة 403)', documentRef: 'ي/مبيعات', debit: 16000, credit: 0 },
      { id: 'ce-7', date: '2026/02/24', description: 'مسموحات مبيعات (إشعار 13)', documentRef: 'ي/مردودات', debit: 0, credit: 1000 }
    ]
  },
  {
    id: 'c-104',
    name: 'العميل أحمد حسن',
    code: 'ع/104',
    entries: [
      { id: 'ce-8', date: '2026/02/22', description: 'مبيعات آجلة (فاتورة 404)', documentRef: 'ي/مبيعات', debit: 8000, credit: 0 }
    ]
  }
];

// Initial Supplier Subsidiary Accounts
export const INITIAL_SUPPLIER_ACCOUNTS: SubsidiarySupplierAccount[] = [
  {
    id: 's-201',
    name: 'شركة النور للمهمات والتوريدات',
    code: 'م/201',
    entries: [
      { id: 'se-1', date: '2026/02/01', description: 'مشتريات آجلة (فاتورة 710)', documentRef: 'ي/مشتريات', debit: 0, credit: 36000 },
      { id: 'se-2', date: '2026/02/09', description: 'سداد بشيك بنكي', documentRef: 'دفتر نقدية', debit: 30000, credit: 0 },
      { id: 'se-3', date: '2026/02/09', description: 'خصم مكتسب (تعجيل دفع)', documentRef: 'دفتر نقدية', debit: 2000, credit: 0 },
      { id: 'se-4', date: '2026/02/12', description: 'مردودات مشتريات (إشعار مدين 31)', documentRef: 'ي/مردودات', debit: 4000, credit: 0 }
    ]
  },
  {
    id: 's-202',
    name: 'مؤسسة السلام الصناعية',
    code: 'م/202',
    entries: [
      { id: 'se-5', date: '2026/02/07', description: 'مشتريات آجلة (فاتورة 855)', documentRef: 'ي/مشتريات', debit: 0, credit: 25000 }
    ]
  },
  {
    id: 's-203',
    name: 'شركة الاتحاد للتجارة',
    code: 'م/203',
    entries: [
      { id: 'se-6', date: '2026/02/18', description: 'مشتريات آجلة (فاتورة 920)', documentRef: 'ي/مشتريات', debit: 0, credit: 15000 }
    ]
  }
];

// Preset Unit 4 Error Scenarios for Posting Simulator (كتاب الوزارة والمنهج المصري)
export const PRESET_UNIT4_ERRORS: Unit4SimulatedError[] = [
  {
    type: 'reversed_posting',
    title: 'الخطأ 1: الترحيل في الجانب الخطأ (النقل العكسي - يضاعف الخطأ)',
    description: 'تم تسجيل شراء بضاعة نقداً بمبلغ 8,000 ج. وعند الترحيل لحساب المشتريات، تم ترحيل المبلغ في الجانب الدائن بدلاً من الجانب المدين.',
    affectedAccountName: 'حساب المشتريات (Purchases)',
    nominalAmount: 8000,
    actualPostedAmount: 8000,
    correctSide: 'debit',
    wrongSide: 'credit',
    difference: 16000, // Double discrepancy: 8,000 * 2
    affectsBalance: true,
    explanation: 'وفقاً لقاعدة الوحدة الرابعة: ترحيل رصيد مدين إلى الجانب الدائن يؤدي إلى اختلال التوازن بفارق مقداره "ضعف قيمة المعاملة" (8,000 × 2 = 16,000 ج)، وعند قسمة الفرق على 2 (16,000 ÷ 2 = 8,000 ج) نكتشف مبلغ المعاملة المنقولة عكسياً.',
    ruleCitation: 'كتاب الوزارة - الوحدة الرابعة: قاعدة الفروق الزوجية وقسمة الفرق على 2 لاكتشاف الترحيل العكسي.',
    correctingEntry: {
      debitAccount: 'حساب المشتريات',
      creditAccount: 'الحساب المعلق (Suspense)',
      amount: 16000,
      explanation: 'قيد تصحيح مضاعف: جعل المشتريات مديناً بـ 16,000 ج (8,000 لإلغاء القيد الدائن الخاطئ + 8,000 لإثبات القيد المدين الصحيح) في مواجهة الحساب المعلق.'
    }
  },
  {
    type: 'single_sided',
    title: 'الخطأ 2: الترحيل من جانب واحد فقط (إغفال ترحيل الطرف الدائن)',
    description: 'تم بيع بضاعة نقداً بمبلغ 12,000 ج. رُحّل المبلغ إلى الجانب المدين لحساب الخزينة، وأُغفل تماماً ترحيله إلى حساب المبيعات.',
    affectedAccountName: 'حساب المبيعات (Sales)',
    nominalAmount: 12000,
    actualPostedAmount: 0,
    correctSide: 'credit',
    difference: 12000,
    affectsBalance: true,
    explanation: 'وفقاً لمبدأ القيد المزدوج: تسجيل طرف دون الآخر يحدث فجوة فورية في ميزان المراجعة بقيمة الطرف المنسي (12,000 ج)، حيث يزيد جانب المدين عن الدائن بـ 12,000 ج، ويظهر الحساب المعلق في الجانب الدائن (الجانب الأقل) لمعادلة الميزان.',
    ruleCitation: 'كتاب الوزارة - الوحدة الرابعة: أخطاء الترحيل من جانب واحد تؤثر مباشرة على التوازن الحسابي.',
    correctingEntry: {
      debitAccount: 'الحساب المعلق (Suspense)',
      creditAccount: 'حساب المبيعات',
      amount: 12000,
      explanation: 'قيد تصحيح لإثبات الطرف الدائن المنسي وإقفال الحساب المعلق بتخفيضه في الجانب المدين.'
    }
  },
  {
    type: 'transposition',
    title: 'الخطأ 3: خطأ تبديل الأرقام (ترحيل 5,400 بدلاً من 4,500 ج)',
    description: 'سداد مصروف إيجار بشيك بمبلغ 4,500 ج. تم قيدها في اليومية 4,500 ج، ولكن رُحلت إلى حساب مصروف الإيجار في دفتر الأستاذ بمبلغ 5,400 ج.',
    affectedAccountName: 'حساب مصروف الإيجار (Rent)',
    nominalAmount: 4500,
    actualPostedAmount: 5400,
    correctSide: 'debit',
    difference: 900,
    affectsBalance: true,
    explanation: 'خطأ تبديل الأرقام (Transposition Error): الفارق هو (5,400 - 4,500 = 900 ج). تذكر قاعدة الوحدة الرابعة الذهبية: إذا كان الفارق يقبل القسمة على 9 (900 ÷ 9 = 100)، فهذا مؤشر قطعي على وقوع خطأ في تبديل خانات الأرقام أثناء النقل والترحيل!',
    ruleCitation: 'كتاب الوزارة - الوحدة الرابعة: قاعدة القسمة على 9 لكشف أخطاء تبديل الأرقام.',
    correctingEntry: {
      debitAccount: 'الحساب المعلق (Suspense)',
      creditAccount: 'حساب مصروف الإيجار',
      amount: 900,
      explanation: 'قيد تصحيح بتخفيض مصروف الإيجار بـ 900 ج في الجانب الدائن وإقفال رصيد الحساب المعلق.'
    }
  },
  {
    type: 'principle_error',
    title: 'الخطأ 4: خطأ في التوجيه والمبدأ المحاسبي (شراء أصل رسملي قُيد كمصروف)',
    description: 'شراء سيارة نقل للمنشأة بشيك بمبلغ 50,000 ج. قيدت بالخطأ: من حـ/ مصروفات الصيانة والإصلاح إلى حـ/ البنك.',
    affectedAccountName: 'حساب السيارات وحساب مصروف الصيانة',
    nominalAmount: 50000,
    actualPostedAmount: 50000,
    difference: 0,
    affectsBalance: false, // لا يؤثر على التوازن!
    explanation: 'خطأ مبدأ (Error of Principle): الميزان يظل متوازناً تماماً (مدين 50,000 ودائن 50,000)، ولن يظهر حساب معلق! لكن هذا الخطأ يشوه المركز المالي؛ إذ تم تضخيم المصروفات وتخفيض أرباح المنشأة وأصولها بـ 50,000 ج دون وجه حق.',
    ruleCitation: 'كتاب الوزارة - الوحدة الرابعة: الأخطاء الخفية المتوازنة التي لا يكشفها ميزان المراجعة بالأرصدة.',
    correctingEntry: {
      debitAccount: 'حساب السيارات والمعدات (Asset)',
      creditAccount: 'حساب مصروفات الصيانة (Expense)',
      amount: 50000,
      explanation: 'قيد تصحيح مباشر بدون حساب معلق: رسملة الأصل بجعل حساب السيارات مديناً وإلغاء المصروف الخاطئ بجعله دائناً.'
    }
  }
];
