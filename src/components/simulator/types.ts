// Types for Unit 3 Subsidiary Books & Unit 4 Error Simulation

export interface SalesDayBookEntry {
  id: string;
  date: string;
  customerName: string;
  customerLedgerFolio: string;
  invoiceNo: string;
  terms: string;
  grossAmount: number;
  tradeDiscountPercent: number;
  netAmount: number;
  postedToSubsidiary: boolean;
}

export interface PurchasesDayBookEntry {
  id: string;
  date: string;
  supplierName: string;
  supplierLedgerFolio: string;
  invoiceNo: string;
  terms: string;
  grossAmount: number;
  tradeDiscountPercent: number;
  netAmount: number;
  postedToSubsidiary: boolean;
}

export interface SalesReturnsEntry {
  id: string;
  date: string;
  customerName: string;
  creditNoteNo: string;
  reason: string;
  amount: number;
  postedToSubsidiary: boolean;
}

export interface PurchasesReturnsEntry {
  id: string;
  date: string;
  supplierName: string;
  debitNoteNo: string;
  reason: string;
  amount: number;
  postedToSubsidiary: boolean;
}

export interface CashBookReceipt {
  id: string;
  date: string;
  description: string;
  receiptNo: string;
  ledgerFolio: string;
  discountAllowed: number;
  cash: number;
  bank: number;
  isContra?: boolean;
}

export interface CashBookPayment {
  id: string;
  date: string;
  description: string;
  voucherNo: string;
  ledgerFolio: string;
  discountReceived: number;
  cash: number;
  bank: number;
  isContra?: boolean;
}

export interface PettyCashExpense {
  id: string;
  date: string;
  description: string;
  voucherNo: string;
  totalPaid: number;
  postageAndStamps: number;
  transportation: number;
  hospitality: number;
  maintenanceAndGeneral: number;
}

export interface SubsidiaryCustomerAccount {
  id: string;
  name: string;
  code: string;
  entries: Array<{
    id: string;
    date: string;
    description: string;
    documentRef: string;
    debit: number;
    credit: number;
  }>;
}

export interface SubsidiarySupplierAccount {
  id: string;
  name: string;
  code: string;
  entries: Array<{
    id: string;
    date: string;
    description: string;
    documentRef: string;
    debit: number;
    credit: number;
  }>;
}

export type Unit4ErrorType = 
  | 'none'
  | 'reversed_posting'     // ترحيل عكسي في الجانب الخطأ (يضاعف الخطأ)
  | 'single_sided'         // ترحيل من جانب واحد فقط وإغفال الجانب الآخر
  | 'transposition'        // تبديل أرقام (مبلغ مقلوب)
  | 'omission'             // سهو كلي
  | 'principle_error'      // خطأ في المبدأ / التوجيه المحاسبي
  | 'custom_student_error'; // خطأ ارتكبه الطالب أثناء الترحيل اليدوي

export interface Unit4SimulatedError {
  type: Unit4ErrorType;
  title: string;
  description: string;
  affectedAccountName: string;
  nominalAmount: number;
  actualPostedAmount: number;
  wrongSide?: 'debit' | 'credit';
  correctSide?: 'debit' | 'credit';
  difference: number;
  affectsBalance: boolean;
  explanation: string;
  ruleCitation: string;
  correctingEntry: {
    debitAccount: string;
    creditAccount: string;
    amount: number;
    explanation: string;
  };
}
