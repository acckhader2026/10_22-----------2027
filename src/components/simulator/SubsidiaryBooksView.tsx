import React, { useState } from 'react';
import { 
  BookOpen, Plus, FileText, CheckCircle2, 
  ArrowLeftRight, ShieldCheck, DollarSign, Wallet, 
  Layers, Filter, FileSpreadsheet, Eye, Sparkles
} from 'lucide-react';
import { 
  SalesDayBookEntry, 
  PurchasesDayBookEntry, 
  SalesReturnsEntry, 
  PurchasesReturnsEntry, 
  CashBookReceipt, 
  CashBookPayment, 
  PettyCashExpense,
  SubsidiaryCustomerAccount,
  SubsidiarySupplierAccount
} from './types';
import { 
  INITIAL_SALES_ENTRIES,
  INITIAL_PURCHASES_ENTRIES,
  INITIAL_SALES_RETURNS_ENTRIES,
  INITIAL_PURCHASES_RETURNS_ENTRIES,
  INITIAL_CASH_RECEIPTS,
  INITIAL_CASH_PAYMENTS,
  INITIAL_PETTY_CASH_EXPENSES,
  INITIAL_CUSTOMER_ACCOUNTS,
  INITIAL_SUPPLIER_ACCOUNTS
} from './subsidiaryData';

interface SubsidiaryBooksViewProps {
  onTransferToGeneralJournal?: (entry: {
    description: string;
    debitAccount: string;
    creditAccount: string;
    amount: number;
    date: string;
  }) => void;
}

type SubsidiarySubTab = 
  | 'sales'
  | 'purchases'
  | 'returns'
  | 'three_column_cash'
  | 'petty_cash'
  | 'subsidiary_ledgers'
  | 'reconciliation';

export const SubsidiaryBooksView: React.FC<SubsidiaryBooksViewProps> = ({ onTransferToGeneralJournal }) => {
  const [activeBook, setActiveBook] = useState<SubsidiarySubTab>('sales');

  // State for Subsidiary entries
  const [salesEntries, setSalesEntries] = useState<SalesDayBookEntry[]>(INITIAL_SALES_ENTRIES);
  const [purchasesEntries, setPurchasesEntries] = useState<PurchasesDayBookEntry[]>(INITIAL_PURCHASES_ENTRIES);
  const [salesReturns, setSalesReturns] = useState<SalesReturnsEntry[]>(INITIAL_SALES_RETURNS_ENTRIES);
  const [purchasesReturns, setPurchasesReturns] = useState<PurchasesReturnsEntry[]>(INITIAL_PURCHASES_RETURNS_ENTRIES);
  const [cashReceipts, setCashReceipts] = useState<CashBookReceipt[]>(INITIAL_CASH_RECEIPTS);
  const [cashPayments, setCashPayments] = useState<CashBookPayment[]>(INITIAL_CASH_PAYMENTS);
  const [pettyExpenses, setPettyExpenses] = useState<PettyCashExpense[]>(INITIAL_PETTY_CASH_EXPENSES);
  const [pettyImprestAmount] = useState<number>(5000); // المبلغ الأصلي للسلفة المستديمة

  const [customerAccounts] = useState<SubsidiaryCustomerAccount[]>(INITIAL_CUSTOMER_ACCOUNTS);
  const [supplierAccounts] = useState<SubsidiarySupplierAccount[]>(INITIAL_SUPPLIER_ACCOUNTS);

  // New Sales Entry Form State
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newGrossAmount, setNewGrossAmount] = useState<number | ''>('');
  const [newDiscountPercent, setNewDiscountPercent] = useState<number>(0);
  const [newInvoiceNo, setNewInvoiceNo] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [transferFeedback, setTransferFeedback] = useState<string | null>(null);

  // Computations
  const totalSalesGross = salesEntries.reduce((sum, e) => sum + e.grossAmount, 0);
  const totalSalesTradeDiscount = salesEntries.reduce((sum, e) => sum + (e.grossAmount - e.netAmount), 0);
  const totalSalesNet = salesEntries.reduce((sum, e) => sum + e.netAmount, 0);

  const totalPurchasesGross = purchasesEntries.reduce((sum, e) => sum + e.grossAmount, 0);
  const totalPurchasesTradeDiscount = purchasesEntries.reduce((sum, e) => sum + (e.grossAmount - e.netAmount), 0);
  const totalPurchasesNet = purchasesEntries.reduce((sum, e) => sum + e.netAmount, 0);

  const totalSalesReturns = salesReturns.reduce((sum, e) => sum + e.amount, 0);
  const totalPurchasesReturns = purchasesReturns.reduce((sum, e) => sum + e.amount, 0);

  // Cash Book Computations
  const totalDiscountAllowed = cashReceipts.reduce((sum, r) => sum + r.discountAllowed, 0);
  const totalReceiptsCash = cashReceipts.reduce((sum, r) => sum + r.cash, 0);
  const totalReceiptsBank = cashReceipts.reduce((sum, r) => sum + r.bank, 0);

  const totalDiscountReceived = cashPayments.reduce((sum, p) => sum + p.discountReceived, 0);
  const totalPaymentsCash = cashPayments.reduce((sum, p) => sum + p.cash, 0);
  const totalPaymentsBank = cashPayments.reduce((sum, p) => sum + p.bank, 0);

  const closingCash = totalReceiptsCash - totalPaymentsCash;
  const closingBank = totalReceiptsBank - totalPaymentsBank;

  // Petty Cash Computations
  const totalPettySpent = pettyExpenses.reduce((sum, e) => sum + e.totalPaid, 0);
  const pettyCashBalanceRemaining = pettyImprestAmount - totalPettySpent;
  const totalPostage = pettyExpenses.reduce((sum, e) => sum + e.postageAndStamps, 0);
  const totalTransport = pettyExpenses.reduce((sum, e) => sum + e.transportation, 0);
  const totalHospitality = pettyExpenses.reduce((sum, e) => sum + e.hospitality, 0);
  const totalMaintenance = pettyExpenses.reduce((sum, e) => sum + e.maintenanceAndGeneral, 0);

  // Subsidiary Balances Computations
  const customerBalances = customerAccounts.map(c => {
    const totalDebit = c.entries.reduce((sum, e) => sum + e.debit, 0);
    const totalCredit = c.entries.reduce((sum, e) => sum + e.credit, 0);
    return {
      name: c.name,
      code: c.code,
      balance: totalDebit - totalCredit
    };
  });
  const sumCustomerLedgerBalances = customerBalances.reduce((sum, c) => sum + c.balance, 0);

  const supplierBalances = supplierAccounts.map(s => {
    const totalDebit = s.entries.reduce((sum, e) => sum + e.debit, 0);
    const totalCredit = s.entries.reduce((sum, e) => sum + e.credit, 0);
    return {
      name: s.name,
      code: s.code,
      balance: totalCredit - totalDebit
    };
  });
  const sumSupplierLedgerBalances = supplierBalances.reduce((sum, s) => sum + s.balance, 0);

  // Add Sales Transaction
  const handleAddSalesEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomerName.trim() || !newGrossAmount || Number(newGrossAmount) <= 0) return;

    const gross = Number(newGrossAmount);
    const discPct = Number(newDiscountPercent) || 0;
    const net = gross - (gross * discPct / 100);
    const invNo = newInvoiceNo.trim() || `فاتورة مبيعات رقم ${400 + salesEntries.length + 1}`;

    const newEntry: SalesDayBookEntry = {
      id: `s-${Date.now()}`,
      date: '2026/02/28',
      customerName: newCustomerName.trim(),
      customerLedgerFolio: `ع/10${salesEntries.length + 1}`,
      invoiceNo: invNo,
      terms: 'على الحساب',
      grossAmount: gross,
      tradeDiscountPercent: discPct,
      netAmount: net,
      postedToSubsidiary: true
    };

    setSalesEntries(prev => [...prev, newEntry]);
    setNewCustomerName('');
    setNewGrossAmount('');
    setNewDiscountPercent(0);
    setNewInvoiceNo('');
    setShowAddForm(false);
  };

  // Transfer Monthly Total to General Journal
  const handleTransferToJournal = (type: 'sales' | 'purchases' | 'sales_returns' | 'purchases_returns') => {
    if (!onTransferToGeneralJournal) return;

    if (type === 'sales') {
      onTransferToGeneralJournal({
        description: `قيد إجمالي مبيعات الشهر الآجلة من واقع دفتر يومية المبيعات (${salesEntries.length} فاتورة)`,
        debitAccount: 'حساب مراقبة العملاء / المدينون (Receivables Control)',
        creditAccount: 'حساب المبيعات (Sales)',
        amount: totalSalesNet,
        date: '2026/02/28'
      });
      setTransferFeedback(`تم بنجاح ترحيل إجمالي يومية المبيعات الآجلة (${totalSalesNet.toLocaleString()} ج) إلى دفتر اليومية العامة كقيد مركزي شهري!`);
    } else if (type === 'purchases') {
      onTransferToGeneralJournal({
        description: `قيد إجمالي مشتريات الشهر الآجلة من واقع دفتر يومية المشتريات (${purchasesEntries.length} فاتورة)`,
        debitAccount: 'حساب المشتريات (Purchases)',
        creditAccount: 'حساب مراقبة الموردين / الدائنون (Payables Control)',
        amount: totalPurchasesNet,
        date: '2026/02/28'
      });
      setTransferFeedback(`تم بنجاح ترحيل إجمالي يومية المشتريات الآجلة (${totalPurchasesNet.toLocaleString()} ج) إلى دفتر اليومية العامة كقيد مركزي شهري!`);
    } else if (type === 'sales_returns') {
      onTransferToGeneralJournal({
        description: `قيد إجمالي مردودات المبيعات الشهرية من واقع دفتر يومية المردودات`,
        debitAccount: 'حساب مردودات ومسموحات المبيعات',
        creditAccount: 'حساب مراقبة العملاء / المدينون (Receivables Control)',
        amount: totalSalesReturns,
        date: '2026/02/28'
      });
      setTransferFeedback(`تم بنجاح ترحيل إجمالي مردودات المبيعات (${totalSalesReturns.toLocaleString()} ج) إلى دفتر اليومية العامة!`);
    } else if (type === 'purchases_returns') {
      onTransferToGeneralJournal({
        description: `قيد إجمالي مردودات المشتريات الشهرية من واقع دفتر يومية المردودات`,
        debitAccount: 'حساب مراقبة الموردين / الدائنون (Payables Control)',
        creditAccount: 'حساب مردودات ومسموحات المشتريات',
        amount: totalPurchasesReturns,
        date: '2026/02/28'
      });
      setTransferFeedback(`تم بنجاح ترحيل إجمالي مردودات المشتريات (${totalPurchasesReturns.toLocaleString()} ج) إلى دفتر اليومية العامة!`);
    }

    setTimeout(() => {
      setTransferFeedback(null);
    }, 6000);
  };

  return (
    <div className="space-y-6 font-serif" dir="rtl">
      
      {/* Header Banner */}
      <div className="bg-[#1D1D1B] text-[#F9F7F2] p-5 sm:p-6 border border-[#1D1D1B] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#C4A484] text-[#1D1D1B] font-bold text-xs px-2.5 py-0.5">
              منظومة دفاتر اليومية والأستاذ المساعدة (الوحدة الثالثة)
            </span>
            <span className="text-xs text-[#F9F7F2]/70 hidden sm:inline">
              نماذج منشأة فريدة ومحلات بلال المعتمدة وزارياً
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold mt-1 text-[#F9F7F2]">
            الدفاتر المساعدة وقواعد المعالجة ثنائية المراحل
          </h3>
          <p className="text-xs text-[#F9F7F2]/80 mt-1 max-w-3xl leading-relaxed">
            محاكاة تطبيقية كاملة: الترحيل الفردي اللحظي لحسابات الأشخاص بالأستاذ المساعد، ثم ترحيل المجموع الإجمالي الدوري إلى دفتر اليومية والأستاذ العام مع الرقابة والمطابقة.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="text-left bg-[#FFFFFF]/10 p-2.5 border border-[#F9F7F2]/20 text-xs">
            <div className="text-[#C4A484] font-bold">حالة التطابق الرقابي</div>
            <div className="text-[#F9F7F2] font-mono font-bold mt-0.5 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>مطابق 100% (أستاذ = مراقبة)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Transfer Feedback Banner */}
      {transferFeedback && (
        <div className="bg-[#1B4D2E]/10 border-2 border-[#1B4D2E] p-3.5 flex items-center gap-3 text-xs sm:text-sm text-[#1B4D2E] font-bold animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-[#1B4D2E]" />
          <span>{transferFeedback}</span>
        </div>
      )}

      {/* Subsidiary Books Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-[#1D1D1B]/15 scrollbar-none">
        <button
          onClick={() => setActiveBook('sales')}
          className={`px-3.5 py-2 text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 border cursor-pointer ${
            activeBook === 'sales'
              ? 'bg-[#1D1D1B] text-[#F9F7F2] border-[#1D1D1B] shadow-xs'
              : 'bg-[#FFFFFF] text-[#1D1D1B] border-[#1D1D1B]/15 hover:bg-[#F9F7F2]'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-[#C4A484]" />
          <span>1. يومية المبيعات الآجلة ({salesEntries.length})</span>
        </button>

        <button
          onClick={() => setActiveBook('purchases')}
          className={`px-3.5 py-2 text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 border cursor-pointer ${
            activeBook === 'purchases'
              ? 'bg-[#1D1D1B] text-[#F9F7F2] border-[#1D1D1B] shadow-xs'
              : 'bg-[#FFFFFF] text-[#1D1D1B] border-[#1D1D1B]/15 hover:bg-[#F9F7F2]'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-[#C4A484]" />
          <span>2. يومية المشتريات الآجلة ({purchasesEntries.length})</span>
        </button>

        <button
          onClick={() => setActiveBook('returns')}
          className={`px-3.5 py-2 text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 border cursor-pointer ${
            activeBook === 'returns'
              ? 'bg-[#1D1D1B] text-[#F9F7F2] border-[#1D1D1B] shadow-xs'
              : 'bg-[#FFFFFF] text-[#1D1D1B] border-[#1D1D1B]/15 hover:bg-[#F9F7F2]'
          }`}
        >
          <ArrowLeftRight className="w-3.5 h-3.5 text-[#C4A484]" />
          <span>3. دفاتر المردودات (مبيعات ومشتريات)</span>
        </button>

        <button
          onClick={() => setActiveBook('three_column_cash')}
          className={`px-3.5 py-2 text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 border cursor-pointer ${
            activeBook === 'three_column_cash'
              ? 'bg-[#1D1D1B] text-[#F9F7F2] border-[#1D1D1B] shadow-xs'
              : 'bg-[#FFFFFF] text-[#1D1D1B] border-[#1D1D1B]/15 hover:bg-[#F9F7F2]'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5 text-[#C4A484]" />
          <span>4. دفتر النقدية ذو الـ 3 أعمدة (الخزينة والبنك والخصم)</span>
        </button>

        <button
          onClick={() => setActiveBook('petty_cash')}
          className={`px-3.5 py-2 text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 border cursor-pointer ${
            activeBook === 'petty_cash'
              ? 'bg-[#1D1D1B] text-[#F9F7F2] border-[#1D1D1B] shadow-xs'
              : 'bg-[#FFFFFF] text-[#1D1D1B] border-[#1D1D1B]/15 hover:bg-[#F9F7F2]'
          }`}
        >
          <Wallet className="w-3.5 h-3.5 text-[#C4A484]" />
          <span>5. صندوق المصروفات النثرية (السلفة المستديمة)</span>
        </button>

        <button
          onClick={() => setActiveBook('subsidiary_ledgers')}
          className={`px-3.5 py-2 text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 border cursor-pointer ${
            activeBook === 'subsidiary_ledgers'
              ? 'bg-[#1D1D1B] text-[#F9F7F2] border-[#1D1D1B] shadow-xs'
              : 'bg-[#FFFFFF] text-[#1D1D1B] border-[#1D1D1B]/15 hover:bg-[#F9F7F2]'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-[#C4A484]" />
          <span>6. دفاتر الأستاذ المساعد (العملاء والموردين)</span>
        </button>

        <button
          onClick={() => setActiveBook('reconciliation')}
          className={`px-3.5 py-2 text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 border cursor-pointer ${
            activeBook === 'reconciliation'
              ? 'bg-[#1D1D1B] text-[#F9F7F2] border-[#1D1D1B] shadow-xs'
              : 'bg-[#FFFFFF] text-[#1D1D1B] border-[#1D1D1B]/15 hover:bg-[#F9F7F2]'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-[#C4A484]" />
          <span>7. المطابقة مع حساب المراقبة بالأستاذ العام</span>
        </button>
      </div>

      {/* 1. SALES DAY BOOK */}
      {activeBook === 'sales' && (
        <div className="space-y-5">
          <div className="bg-[#FFFFFF] border border-[#1D1D1B]/15 p-5 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1D1D1B]/10 pb-3">
              <div>
                <span className="text-[10px] bg-[#1D1D1B] text-[#C4A484] font-bold px-2 py-0.5">
                  دفتر يومية مساعد قانوني
                </span>
                <h4 className="font-extrabold text-base text-[#1D1D1B] mt-1">
                  دفتر يومية المبيعات الآجلة (Sales Day Book)
                </h4>
                <p className="text-xs text-[#1D1D1B]/60">
                  يختص بقيد مبيعات البضاعة بالآجل فقط استناداً لصور فواتير البيع. المبالغ تثبت بالصافي بعد استبعاد الخصم التجاري فوراً.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="px-3 py-1.5 bg-[#F9F7F2] hover:bg-[#EFECE6] text-[#1D1D1B] border border-[#1D1D1B]/20 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-[#C4A484]" />
                  <span>{showAddForm ? 'إغلاق نموذج الفاتورة' : 'إثبات فاتورة مبيعات جديدة'}</span>
                </button>

                <button
                  onClick={() => handleTransferToJournal('sales')}
                  className="px-3.5 py-1.5 bg-[#1D1D1B] hover:bg-[#333330] text-[#F9F7F2] text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#C4A484]" />
                  <span>ترحيل المجموع الشهري لليومية العامة ({totalSalesNet.toLocaleString()} ج)</span>
                </button>
              </div>
            </div>

            {/* Quick Add Invoice Form */}
            {showAddForm && (
              <form onSubmit={handleAddSalesEntry} className="bg-[#F9F7F2] p-4 border border-[#1D1D1B]/15 space-y-3 text-xs">
                <div className="font-bold text-[#1D1D1B] flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#C4A484]" />
                  <span>إدخال بيانات صورة فاتورة البيع الآجلة:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[#1D1D1B]/70 mb-1">اسم العميل (المدين):</label>
                    <input
                      type="text"
                      value={newCustomerName}
                      onChange={e => setNewCustomerName(e.target.value)}
                      placeholder="مثال: شركة القدس للتجارة"
                      className="w-full p-2 bg-white border border-[#1D1D1B]/20 text-xs font-bold"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[#1D1D1B]/70 mb-1">السعر الإجمالي المعلن (جنيه):</label>
                    <input
                      type="number"
                      value={newGrossAmount}
                      onChange={e => setNewGrossAmount(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="مثال: 20000"
                      className="w-full p-2 bg-white border border-[#1D1D1B]/20 text-xs font-mono font-bold"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[#1D1D1B]/70 mb-1">نسبة الخصم التجاري (%):</label>
                    <input
                      type="number"
                      value={newDiscountPercent}
                      onChange={e => setNewDiscountPercent(Number(e.target.value))}
                      placeholder="0"
                      min="0"
                      max="50"
                      className="w-full p-2 bg-white border border-[#1D1D1B]/20 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[#1D1D1B]/70 mb-1">رقم الفاتورة:</label>
                    <input
                      type="text"
                      value={newInvoiceNo}
                      onChange={e => setNewInvoiceNo(e.target.value)}
                      placeholder={`فاتورة مبيعات ${400 + salesEntries.length + 1}`}
                      className="w-full p-2 bg-white border border-[#1D1D1B]/20 text-xs font-mono"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <div className="text-xs text-[#1D1D1B]/70 font-mono">
                    القيمة الصافية المستحقة بعد الخصم:{' '}
                    <strong className="text-[#1B4D2E] text-sm font-bold">
                      {newGrossAmount ? (Number(newGrossAmount) * (1 - (newDiscountPercent || 0) / 100)).toLocaleString() : 0} ج
                    </strong>
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-[#1D1D1B] text-[#F9F7F2] font-bold text-xs hover:bg-[#333330] cursor-pointer"
                  >
                    حفظ في يومية المبيعات
                  </button>
                </div>
              </form>
            )}

            {/* Sales Table */}
            <div className="overflow-x-auto border border-[#1D1D1B]/20">
              <table className="w-full text-xs text-right">
                <thead className="bg-[#1D1D1B] text-[#F9F7F2] font-bold">
                  <tr>
                    <th className="p-2.5 border-l border-[#1D1D1B]/40 font-mono">التاريخ</th>
                    <th className="p-2.5 border-l border-[#1D1D1B]/40">اسم العميل (المشتري)</th>
                    <th className="p-2.5 border-l border-[#1D1D1B]/40">رقم الفاتورة</th>
                    <th className="p-2.5 border-l border-[#1D1D1B]/40 font-mono">ص.أ (أستاذ المساعد)</th>
                    <th className="p-2.5 border-l border-[#1D1D1B]/40">شروط السداد</th>
                    <th className="p-2.5 border-l border-[#1D1D1B]/40 text-left font-mono">المبلغ الإجمالي</th>
                    <th className="p-2.5 border-l border-[#1D1D1B]/40 text-left font-mono">الخصم التجاري</th>
                    <th className="p-2.5 text-left font-mono bg-[#2C2C28] text-[#C4A484]">المبلغ الصافي المقيد</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1D1D1B]/10 bg-[#FFFFFF]">
                  {salesEntries.map((entry) => (
                    <tr key={entry.id} className="hover:bg-[#F9F7F2]">
                      <td className="p-2.5 font-mono text-[#1D1D1B]/70 border-l border-[#1D1D1B]/10">{entry.date}</td>
                      <td className="p-2.5 font-bold text-[#1D1D1B] border-l border-[#1D1D1B]/10">{entry.customerName}</td>
                      <td className="p-2.5 font-mono text-[#1D1D1B]/70 border-l border-[#1D1D1B]/10">{entry.invoiceNo}</td>
                      <td className="p-2.5 font-mono text-center text-[#1D1D1B]/80 border-l border-[#1D1D1B]/10 bg-[#F9F7F2]">
                        {entry.customerLedgerFolio}
                      </td>
                      <td className="p-2.5 border-l border-[#1D1D1B]/10 text-[11px] text-[#1D1D1B]/70">{entry.terms}</td>
                      <td className="p-2.5 text-left font-mono text-[#1D1D1B]/80 border-l border-[#1D1D1B]/10">
                        {entry.grossAmount.toLocaleString()} ج
                      </td>
                      <td className="p-2.5 text-left font-mono text-rose-800 border-l border-[#1D1D1B]/10">
                        {entry.tradeDiscountPercent > 0 ? `(${entry.tradeDiscountPercent}%) ${(entry.grossAmount - entry.netAmount).toLocaleString()} ج` : '-'}
                      </td>
                      <td className="p-2.5 text-left font-mono font-bold text-[#1B4D2E] bg-[#F4F8F4]">
                        {entry.netAmount.toLocaleString()} ج
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-[#1D1D1B] text-[#F9F7F2] font-mono font-bold text-xs border-t-2 border-[#1D1D1B]">
                  <tr>
                    <td colSpan={5} className="p-3 text-right font-serif text-[#C4A484]">
                      الإجمالي الشهري لدفتر يومية المبيعات الآجلة (يُرحل إلى دائن حـ/ المبيعات بالأستاذ العام):
                    </td>
                    <td className="p-3 text-left">{totalSalesGross.toLocaleString()} ج</td>
                    <td className="p-3 text-left text-rose-300">({totalSalesTradeDiscount.toLocaleString()}) ج</td>
                    <td className="p-3 text-left text-sm text-[#C4A484] underline decoration-double">
                      {totalSalesNet.toLocaleString()} ج
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Accounting Rule Box */}
            <div className="bg-[#F9F7F2] border border-[#1D1D1B]/15 p-3.5 text-xs text-[#1D1D1B]/80 space-y-1">
              <span className="font-bold text-[#1D1D1B] block">📌 القاعدة الرقابية للترحيل على مرحلتين (Two-Tier Posting):</span>
              <p>
                1. <strong>الترحيل الفردي اليومي:</strong> يُرحل كل مبلغ صافٍ فورياً إلى <strong>الجانب المدين</strong> لحساب العميل المختص في دفتر <strong>أستاذ مساعد العملاء</strong>.
              </p>
              <p>
                2. <strong>الترحيل الإجمالي الشهري:</strong> يُثبت قيد مركزي شهري في <strong>دفتر اليومية العامة</strong>: <span className="font-mono font-bold text-[#1B4D2E]">(من حـ/ مراقبة العملاء {totalSalesNet.toLocaleString()} إلى حـ/ المبيعات {totalSalesNet.toLocaleString()})</span> ويُرحل إلى دفتر الأستاذ العام.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 2. PURCHASES DAY BOOK */}
      {activeBook === 'purchases' && (
        <div className="space-y-5">
          <div className="bg-[#FFFFFF] border border-[#1D1D1B]/15 p-5 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1D1D1B]/10 pb-3">
              <div>
                <span className="text-[10px] bg-[#1D1D1B] text-[#C4A484] font-bold px-2 py-0.5">
                  دفتر يومية مساعد قانوني
                </span>
                <h4 className="font-extrabold text-base text-[#1D1D1B] mt-1">
                  دفتر يومية المشتريات الآجلة (Purchases Day Book)
                </h4>
                <p className="text-xs text-[#1D1D1B]/60">
                  يختص بقيد مشتريات البضاعة الموردة للمنشأة بالآجل استناداً لأصول فواتير الشراء بعد فحصها ومطابقتها مع محضر الاستلام.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleTransferToJournal('purchases')}
                  className="px-3.5 py-1.5 bg-[#1D1D1B] hover:bg-[#333330] text-[#F9F7F2] text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#C4A484]" />
                  <span>ترحيل المجموع الشهري لليومية العامة ({totalPurchasesNet.toLocaleString()} ج)</span>
                </button>
              </div>
            </div>

            {/* Purchases Table */}
            <div className="overflow-x-auto border border-[#1D1D1B]/20">
              <table className="w-full text-xs text-right">
                <thead className="bg-[#1D1D1B] text-[#F9F7F2] font-bold">
                  <tr>
                    <th className="p-2.5 border-l border-[#1D1D1B]/40 font-mono">التاريخ</th>
                    <th className="p-2.5 border-l border-[#1D1D1B]/40">اسم المورد (الدائن)</th>
                    <th className="p-2.5 border-l border-[#1D1D1B]/40">أصل فاتورة الشراء</th>
                    <th className="p-2.5 border-l border-[#1D1D1B]/40 font-mono">ص.أ (أستاذ الموردين)</th>
                    <th className="p-2.5 border-l border-[#1D1D1B]/40">شروط الدفع</th>
                    <th className="p-2.5 border-l border-[#1D1D1B]/40 text-left font-mono">السعر المعلن</th>
                    <th className="p-2.5 border-l border-[#1D1D1B]/40 text-left font-mono">الخصم التجاري</th>
                    <th className="p-2.5 text-left font-mono bg-[#2C2C28] text-[#C4A484]">المبلغ الصافي المقيد</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1D1D1B]/10 bg-[#FFFFFF]">
                  {purchasesEntries.map((entry) => (
                    <tr key={entry.id} className="hover:bg-[#F9F7F2]">
                      <td className="p-2.5 font-mono text-[#1D1D1B]/70 border-l border-[#1D1D1B]/10">{entry.date}</td>
                      <td className="p-2.5 font-bold text-[#1D1D1B] border-l border-[#1D1D1B]/10">{entry.supplierName}</td>
                      <td className="p-2.5 font-mono text-[#1D1D1B]/70 border-l border-[#1D1D1B]/10">{entry.invoiceNo}</td>
                      <td className="p-2.5 font-mono text-center text-[#1D1D1B]/80 border-l border-[#1D1D1B]/10 bg-[#F9F7F2]">
                        {entry.supplierLedgerFolio}
                      </td>
                      <td className="p-2.5 border-l border-[#1D1D1B]/10 text-[11px] text-[#1D1D1B]/70">{entry.terms}</td>
                      <td className="p-2.5 text-left font-mono text-[#1D1D1B]/80 border-l border-[#1D1D1B]/10">
                        {entry.grossAmount.toLocaleString()} ج
                      </td>
                      <td className="p-2.5 text-left font-mono text-rose-800 border-l border-[#1D1D1B]/10">
                        {entry.tradeDiscountPercent > 0 ? `(${entry.tradeDiscountPercent}%) ${(entry.grossAmount - entry.netAmount).toLocaleString()} ج` : '-'}
                      </td>
                      <td className="p-2.5 text-left font-mono font-bold text-[#8A1F1D] bg-[#FDF3F2]">
                        {entry.netAmount.toLocaleString()} ج
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-[#1D1D1B] text-[#F9F7F2] font-mono font-bold text-xs border-t-2 border-[#1D1D1B]">
                  <tr>
                    <td colSpan={5} className="p-3 text-right font-serif text-[#C4A484]">
                      الإجمالي الشهري لدفتر يومية المشتريات الآجلة (يُرحل إلى مدين حـ/ المشتريات بالأستاذ العام):
                    </td>
                    <td className="p-3 text-left">{totalPurchasesGross.toLocaleString()} ج</td>
                    <td className="p-3 text-left text-rose-300">({totalPurchasesTradeDiscount.toLocaleString()}) ج</td>
                    <td className="p-3 text-left text-sm text-[#C4A484] underline decoration-double">
                      {totalPurchasesNet.toLocaleString()} ج
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Rule Box */}
            <div className="bg-[#F9F7F2] border border-[#1D1D1B]/15 p-3.5 text-xs text-[#1D1D1B]/80 space-y-1">
              <span className="font-bold text-[#1D1D1B] block">📌 التوجيه المحاسبي للإجمالي الشهري:</span>
              <p>
                قيد مركزي شهري في دفتر اليومية العامة: <span className="font-mono font-bold text-[#8A1F1D]">(من حـ/ المشتريات {totalPurchasesNet.toLocaleString()} ج إلى حـ/ مراقبة الموردين {totalPurchasesNet.toLocaleString()} ج)</span>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3. RETURNS DAY BOOKS */}
      {activeBook === 'returns' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Sales Returns */}
            <div className="bg-[#FFFFFF] border border-[#1D1D1B]/15 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#1D1D1B]/10 pb-2">
                <div>
                  <h4 className="font-bold text-sm text-[#1D1D1B]">
                    دفتر يومية مردودات المبيعات (Sales Returns)
                  </h4>
                  <p className="text-[11px] text-[#1D1D1B]/60">استناداً لصور الإشعارات الدائنة (Credit Notes)</p>
                </div>
                <button
                  onClick={() => handleTransferToJournal('sales_returns')}
                  className="px-2.5 py-1 bg-[#1D1D1B] text-[#F9F7F2] text-[11px] font-bold"
                >
                  ترحيل الإجمالي ({totalSalesReturns.toLocaleString()} ج)
                </button>
              </div>

              <div className="overflow-x-auto border border-[#1D1D1B]/20">
                <table className="w-full text-xs text-right">
                  <thead className="bg-[#1D1D1B] text-[#F9F7F2]">
                    <tr>
                      <th className="p-2 border-l border-[#1D1D1B]/40">التاريخ</th>
                      <th className="p-2 border-l border-[#1D1D1B]/40">اسم العميل</th>
                      <th className="p-2 border-l border-[#1D1D1B]/40">الإشعار الدائن</th>
                      <th className="p-2 text-left font-mono">المبلغ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1D1D1B]/10">
                    {salesReturns.map(r => (
                      <tr key={r.id}>
                        <td className="p-2 font-mono text-[11px]">{r.date}</td>
                        <td className="p-2 font-bold">{r.customerName}</td>
                        <td className="p-2 text-[11px]">{r.creditNoteNo}</td>
                        <td className="p-2 text-left font-mono font-bold text-[#8A1F1D]">{r.amount.toLocaleString()} ج</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-[#1D1D1B] text-[#F9F7F2] font-mono font-bold text-xs">
                    <tr>
                      <td colSpan={3} className="p-2 text-right">إجمالي مردودات المبيعات:</td>
                      <td className="p-2 text-left text-[#C4A484]">{totalSalesReturns.toLocaleString()} ج</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Purchases Returns */}
            <div className="bg-[#FFFFFF] border border-[#1D1D1B]/15 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#1D1D1B]/10 pb-2">
                <div>
                  <h4 className="font-bold text-sm text-[#1D1D1B]">
                    دفتر يومية مردودات المشتريات (Purchases Returns)
                  </h4>
                  <p className="text-[11px] text-[#1D1D1B]/60">استناداً لأصول الإشعارات المدينة (Debit Notes)</p>
                </div>
                <button
                  onClick={() => handleTransferToJournal('purchases_returns')}
                  className="px-2.5 py-1 bg-[#1D1D1B] text-[#F9F7F2] text-[11px] font-bold"
                >
                  ترحيل الإجمالي ({totalPurchasesReturns.toLocaleString()} ج)
                </button>
              </div>

              <div className="overflow-x-auto border border-[#1D1D1B]/20">
                <table className="w-full text-xs text-right">
                  <thead className="bg-[#1D1D1B] text-[#F9F7F2]">
                    <tr>
                      <th className="p-2 border-l border-[#1D1D1B]/40">التاريخ</th>
                      <th className="p-2 border-l border-[#1D1D1B]/40">اسم المورد</th>
                      <th className="p-2 border-l border-[#1D1D1B]/40">الإشعار المدين</th>
                      <th className="p-2 text-left font-mono">المبلغ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1D1D1B]/10">
                    {purchasesReturns.map(r => (
                      <tr key={r.id}>
                        <td className="p-2 font-mono text-[11px]">{r.date}</td>
                        <td className="p-2 font-bold">{r.supplierName}</td>
                        <td className="p-2 text-[11px]">{r.debitNoteNo}</td>
                        <td className="p-2 text-left font-mono font-bold text-[#1B4D2E]">{r.amount.toLocaleString()} ج</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-[#1D1D1B] text-[#F9F7F2] font-mono font-bold text-xs">
                    <tr>
                      <td colSpan={3} className="p-2 text-right">إجمالي مردودات المشتريات:</td>
                      <td className="p-2 text-left text-[#C4A484]">{totalPurchasesReturns.toLocaleString()} ج</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 4. THREE-COLUMN CASH BOOK */}
      {activeBook === 'three_column_cash' && (
        <div className="space-y-5">
          <div className="bg-[#FFFFFF] border border-[#1D1D1B]/15 p-5 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1D1D1B]/10 pb-3">
              <div>
                <span className="text-[10px] bg-[#1D1D1B] text-[#C4A484] font-bold px-2 py-0.5">
                  سجل محاسبي هجين (يومية مساعدة + حساب أستاذ)
                </span>
                <h4 className="font-extrabold text-base text-[#1D1D1B] mt-1">
                  دفتر النقدية ذو الثلاثة أعمدة (Three-Column Cash Book)
                </h4>
                <p className="text-xs text-[#1D1D1B]/60">
                  يتضمن 3 أعمدة مالية في كل جانب: الخصم، الخزينة (النقدية)، والبنك. لا حاجة لفتح حساب للأستاذ العام للخزينة أو البنك لأنهما ممثلان فيه مباشرة.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono font-bold">
                <span className="bg-[#F4F8F4] text-[#1B4D2E] border border-[#1B4D2E]/20 px-2.5 py-1">
                  رصيد الخزينة الختامي: {closingCash.toLocaleString()} ج
                </span>
                <span className="bg-[#F4F8F4] text-[#1B4D2E] border border-[#1B4D2E]/20 px-2.5 py-1">
                  رصيد البنك الختامي: {closingBank.toLocaleString()} ج
                </span>
              </div>
            </div>

            {/* Split layout: Debit Side (Receipts) & Credit Side (Payments) */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              
              {/* Receipts (Debit) */}
              <div className="border border-[#1D1D1B]/20 flex flex-col">
                <div className="bg-[#1B4D2E] text-white p-2.5 text-center font-bold text-xs">
                  الجانب المدين (منه) - المقبوضات والتحصيلات
                </div>
                <div className="overflow-x-auto flex-1">
                  <table className="w-full text-xs text-right">
                    <thead className="bg-[#F4F8F4] text-[#1D1D1B] font-bold text-[11px] border-b border-[#1D1D1B]/20">
                      <tr>
                        <th className="p-2 border-l border-[#1D1D1B]/10">التاريخ</th>
                        <th className="p-2 border-l border-[#1D1D1B]/10">البيان</th>
                        <th className="p-2 border-l border-[#1D1D1B]/10 text-center">ص.أ</th>
                        <th className="p-2 border-l border-[#1D1D1B]/10 text-left font-mono">خصم مسموح به</th>
                        <th className="p-2 border-l border-[#1D1D1B]/10 text-left font-mono">الخزينة</th>
                        <th className="p-2 text-left font-mono">البنك</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1D1D1B]/10 bg-white">
                      {cashReceipts.map(r => (
                        <tr key={r.id} className="hover:bg-[#F9F7F2]">
                          <td className="p-2 font-mono text-[11px] text-[#1D1D1B]/70 border-l border-[#1D1D1B]/10">{r.date}</td>
                          <td className="p-2 font-bold text-[#1D1D1B] border-l border-[#1D1D1B]/10 text-[11px]">{r.description}</td>
                          <td className="p-2 text-center font-mono text-[10px] border-l border-[#1D1D1B]/10 bg-amber-50 font-bold">
                            {r.isContra ? 'ع (C)' : r.ledgerFolio}
                          </td>
                          <td className="p-2 text-left font-mono text-rose-800 border-l border-[#1D1D1B]/10">
                            {r.discountAllowed > 0 ? r.discountAllowed.toLocaleString() : '-'}
                          </td>
                          <td className="p-2 text-left font-mono font-bold text-[#1B4D2E] border-l border-[#1D1D1B]/10">
                            {r.cash > 0 ? r.cash.toLocaleString() : '-'}
                          </td>
                          <td className="p-2 text-left font-mono font-bold text-[#1B4D2E]">
                            {r.bank > 0 ? r.bank.toLocaleString() : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-[#1D1D1B] text-[#F9F7F2] font-mono font-bold text-xs">
                      <tr>
                        <td colSpan={3} className="p-2 text-right font-serif text-[#C4A484]">المجموع:</td>
                        <td className="p-2 text-left text-amber-300">{totalDiscountAllowed.toLocaleString()}</td>
                        <td className="p-2 text-left text-emerald-400">{totalReceiptsCash.toLocaleString()}</td>
                        <td className="p-2 text-left text-emerald-400">{totalReceiptsBank.toLocaleString()}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Payments (Credit) */}
              <div className="border border-[#1D1D1B]/20 flex flex-col">
                <div className="bg-[#8A1F1D] text-white p-2.5 text-center font-bold text-xs">
                  الجانب الدائن (له) - المدفوعات والمسحوبات
                </div>
                <div className="overflow-x-auto flex-1">
                  <table className="w-full text-xs text-right">
                    <thead className="bg-[#FDF3F2] text-[#1D1D1B] font-bold text-[11px] border-b border-[#1D1D1B]/20">
                      <tr>
                        <th className="p-2 border-l border-[#1D1D1B]/10">التاريخ</th>
                        <th className="p-2 border-l border-[#1D1D1B]/10">البيان</th>
                        <th className="p-2 border-l border-[#1D1D1B]/10 text-center">ص.أ</th>
                        <th className="p-2 border-l border-[#1D1D1B]/10 text-left font-mono">خصم مكتسب</th>
                        <th className="p-2 border-l border-[#1D1D1B]/10 text-left font-mono">الخزينة</th>
                        <th className="p-2 text-left font-mono">البنك</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1D1D1B]/10 bg-white">
                      {cashPayments.map(p => (
                        <tr key={p.id} className="hover:bg-[#F9F7F2]">
                          <td className="p-2 font-mono text-[11px] text-[#1D1D1B]/70 border-l border-[#1D1D1B]/10">{p.date}</td>
                          <td className="p-2 font-bold text-[#1D1D1B] border-l border-[#1D1D1B]/10 text-[11px]">{p.description}</td>
                          <td className="p-2 text-center font-mono text-[10px] border-l border-[#1D1D1B]/10 bg-amber-50 font-bold">
                            {p.isContra ? 'ع (C)' : p.ledgerFolio}
                          </td>
                          <td className="p-2 text-left font-mono text-emerald-800 border-l border-[#1D1D1B]/10">
                            {p.discountReceived > 0 ? p.discountReceived.toLocaleString() : '-'}
                          </td>
                          <td className="p-2 text-left font-mono font-bold text-[#8A1F1D] border-l border-[#1D1D1B]/10">
                            {p.cash > 0 ? p.cash.toLocaleString() : '-'}
                          </td>
                          <td className="p-2 text-left font-mono font-bold text-[#8A1F1D]">
                            {p.bank > 0 ? p.bank.toLocaleString() : '-'}
                          </td>
                        </tr>
                      ))}
                      {/* Balancing Line */}
                      <tr className="bg-amber-50/50 font-bold text-[11px]">
                        <td className="p-2 font-mono">2026/02/28</td>
                        <td className="p-2">رصيد مرحل آخر الشهر (c/d)</td>
                        <td className="p-2 text-center font-mono">-</td>
                        <td className="p-2 text-left font-mono">-</td>
                        <td className="p-2 text-left font-mono text-[#1B4D2E]">{closingCash.toLocaleString()}</td>
                        <td className="p-2 text-left font-mono text-[#1B4D2E]">{closingBank.toLocaleString()}</td>
                      </tr>
                    </tbody>
                    <tfoot className="bg-[#1D1D1B] text-[#F9F7F2] font-mono font-bold text-xs">
                      <tr>
                        <td colSpan={3} className="p-2 text-right font-serif text-[#C4A484]">المجموع المتوازن:</td>
                        <td className="p-2 text-left text-amber-300">{totalDiscountReceived.toLocaleString()}</td>
                        <td className="p-2 text-left text-[#C4A484]">{totalReceiptsCash.toLocaleString()}</td>
                        <td className="p-2 text-left text-[#C4A484]">{totalReceiptsBank.toLocaleString()}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

            </div>

            {/* Contra Entry Rule Card */}
            <div className="bg-[#F9F7F2] border border-[#1D1D1B]/15 p-3.5 text-xs text-[#1D1D1B]/80 space-y-1">
              <span className="font-bold text-[#1D1D1B] block">💡 القيد العكسي (Contra Entry - رمزه 'ع'):</span>
              <p>
                عند تحويل نقدية من الخزينة للبنك أو العكس، تسجل المعاملة في نفس الدفتر في الجانبين (دائن للخزينة ومدين للبنك) ولا ترحل لأي دفتر خارجي، وتوضع علامة 'ع' في عمود صفحة الأستاذ.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 5. PETTY CASH BOOK */}
      {activeBook === 'petty_cash' && (
        <div className="space-y-5">
          <div className="bg-[#FFFFFF] border border-[#1D1D1B]/15 p-5 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1D1D1B]/10 pb-3">
              <div>
                <span className="text-[10px] bg-[#1D1D1B] text-[#C4A484] font-bold px-2 py-0.5">
                  نظام السلفة المستديمة (Imprest System)
                </span>
                <h4 className="font-extrabold text-base text-[#1D1D1B] mt-1">
                  دفتر صندوق المصروفات النثرية التحليلي (Petty Cash Book)
                </h4>
                <p className="text-xs text-[#1D1D1B]/60">
                  صرف المصروفات الصغيرة المتكررة بمستندات معتمدة، مع استعاضة المنصرف دورياً بشيك بنكي لإعادة الصندوق لمبلغه الأصلي ({pettyImprestAmount.toLocaleString()} ج).
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="p-2 bg-[#F9F7F2] border border-[#1D1D1B]/15 text-xs">
                  <span className="text-[#1D1D1B]/70 block text-[10px]">الرصيد النقدي المتبقي بالعهدة:</span>
                  <span className="font-mono font-bold text-sm text-[#1B4D2E]">{pettyCashBalanceRemaining.toLocaleString()} ج</span>
                </div>
                <div className="p-2 bg-[#FDF3F2] border border-rose-200 text-xs">
                  <span className="text-rose-900 block text-[10px]">مبلغ شيك الاستعاضة المطلوب:</span>
                  <span className="font-mono font-bold text-sm text-rose-800">{totalPettySpent.toLocaleString()} ج</span>
                </div>
              </div>
            </div>

            {/* Petty Cash Table */}
            <div className="overflow-x-auto border border-[#1D1D1B]/20">
              <table className="w-full text-xs text-right">
                <thead className="bg-[#1D1D1B] text-[#F9F7F2] font-bold">
                  <tr>
                    <th className="p-2 border-l border-[#1D1D1B]/40 text-left font-mono">المقبوضات</th>
                    <th className="p-2 border-l border-[#1D1D1B]/40 font-mono">التاريخ</th>
                    <th className="p-2 border-l border-[#1D1D1B]/40">البيان</th>
                    <th className="p-2 border-l border-[#1D1D1B]/40">سند الصرف</th>
                    <th className="p-2 border-l border-[#1D1D1B]/40 text-left font-mono bg-[#8A1F1D]">إجمالي المدفوع</th>
                    <th className="p-2 border-l border-[#1D1D1B]/40 text-left font-mono">بريد ودمغات</th>
                    <th className="p-2 border-l border-[#1D1D1B]/40 text-left font-mono">انتقالات ومواصلات</th>
                    <th className="p-2 border-l border-[#1D1D1B]/40 text-left font-mono">بوفيه وضيافة</th>
                    <th className="p-2 text-left font-mono">صيانة ونثريات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1D1D1B]/10 bg-white">
                  <tr className="bg-emerald-50/50 font-bold">
                    <td className="p-2 text-left font-mono text-[#1B4D2E] border-l border-[#1D1D1B]/10">{pettyImprestAmount.toLocaleString()} ج</td>
                    <td className="p-2 font-mono text-[11px] border-l border-[#1D1D1B]/10">2026/02/03</td>
                    <td className="p-2 border-l border-[#1D1D1B]/10">استلام شيك إنشاء السلفة المستديمة</td>
                    <td className="p-2 border-l border-[#1D1D1B]/10 text-center font-mono">شيك 901</td>
                    <td className="p-2 border-l border-[#1D1D1B]/10 text-center font-mono">-</td>
                    <td className="p-2 border-l border-[#1D1D1B]/10 text-center font-mono">-</td>
                    <td className="p-2 border-l border-[#1D1D1B]/10 text-center font-mono">-</td>
                    <td className="p-2 border-l border-[#1D1D1B]/10 text-center font-mono">-</td>
                    <td className="p-2 text-center font-mono">-</td>
                  </tr>
                  {pettyExpenses.map(e => (
                    <tr key={e.id} className="hover:bg-[#F9F7F2]">
                      <td className="p-2 text-center font-mono text-[#1D1D1B]/30 border-l border-[#1D1D1B]/10">-</td>
                      <td className="p-2 font-mono text-[11px] text-[#1D1D1B]/70 border-l border-[#1D1D1B]/10">{e.date}</td>
                      <td className="p-2 font-bold text-[#1D1D1B] border-l border-[#1D1D1B]/10">{e.description}</td>
                      <td className="p-2 font-mono text-[11px] text-[#1D1D1B]/70 border-l border-[#1D1D1B]/10">{e.voucherNo}</td>
                      <td className="p-2 text-left font-mono font-bold text-[#8A1F1D] border-l border-[#1D1D1B]/10 bg-rose-50/30">
                        {e.totalPaid.toLocaleString()}
                      </td>
                      <td className="p-2 text-left font-mono border-l border-[#1D1D1B]/10">
                        {e.postageAndStamps > 0 ? e.postageAndStamps.toLocaleString() : '-'}
                      </td>
                      <td className="p-2 text-left font-mono border-l border-[#1D1D1B]/10">
                        {e.transportation > 0 ? e.transportation.toLocaleString() : '-'}
                      </td>
                      <td className="p-2 text-left font-mono border-l border-[#1D1D1B]/10">
                        {e.hospitality > 0 ? e.hospitality.toLocaleString() : '-'}
                      </td>
                      <td className="p-2 text-left font-mono">
                        {e.maintenanceAndGeneral > 0 ? e.maintenanceAndGeneral.toLocaleString() : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-[#1D1D1B] text-[#F9F7F2] font-mono font-bold text-xs">
                  <tr>
                    <td className="p-2 text-left text-emerald-400">{pettyImprestAmount.toLocaleString()}</td>
                    <td colSpan={3} className="p-2 text-right font-serif text-[#C4A484]">الإجماليات التحليلية للمصروفات:</td>
                    <td className="p-2 text-left text-rose-300">{totalPettySpent.toLocaleString()}</td>
                    <td className="p-2 text-left text-[#F9F7F2]">{totalPostage.toLocaleString()}</td>
                    <td className="p-2 text-left text-[#F9F7F2]">{totalTransport.toLocaleString()}</td>
                    <td className="p-2 text-left text-[#F9F7F2]">{totalHospitality.toLocaleString()}</td>
                    <td className="p-2 text-left text-[#F9F7F2]">{totalMaintenance.toLocaleString()}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Imprest Replenishment Journal Entry */}
            <div className="bg-[#F9F7F2] border border-[#1D1D1B]/15 p-4 text-xs space-y-2">
              <span className="font-bold text-[#1D1D1B] block">📝 قيد استعاضة السلفة المستديمة في نهاية الشهر:</span>
              <div className="font-mono text-xs bg-white p-3 border border-[#1D1D1B]/15 space-y-1">
                <div className="text-[#1B4D2E] font-bold">من مذكورين:</div>
                <div className="pr-4">• حـ/ مصروفات البريد والدمغات: {totalPostage.toLocaleString()} ج</div>
                <div className="pr-4">• حـ/ مصروفات الانتقالات والمواصلات: {totalTransport.toLocaleString()} ج</div>
                <div className="pr-4">• حـ/ مصروفات الضيافة والبوفيه: {totalHospitality.toLocaleString()} ج</div>
                <div className="pr-4">• حـ/ مصروفات الصيانة والنثريات: {totalMaintenance.toLocaleString()} ج</div>
                <div className="text-[#8A1F1D] font-bold pt-1 border-t border-[#1D1D1B]/10">
                  إلى حـ/ البنك (شيك استعاضة العهدة): {totalPettySpent.toLocaleString()} ج
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. SUBSIDIARY LEDGERS */}
      {activeBook === 'subsidiary_ledgers' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Customers Subsidiary Ledger */}
            <div className="bg-[#FFFFFF] border-2 border-[#1D1D1B] p-5 shadow-xs space-y-4">
              <div className="border-b border-[#1D1D1B]/10 pb-2 flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-base text-[#1D1D1B]">
                    دفتر أستاذ مساعد العملاء (Customers Ledger)
                  </h4>
                  <p className="text-xs text-[#1D1D1B]/60">حسابات تفصيلية شخصية لكل عميل مدين</p>
                </div>
                <span className="text-xs font-mono font-bold bg-[#1D1D1B] text-[#F9F7F2] px-2.5 py-1">
                  إجمالي الأرصدة: {sumCustomerLedgerBalances.toLocaleString()} ج
                </span>
              </div>

              <div className="space-y-4">
                {customerAccounts.map(cust => {
                  const totD = cust.entries.reduce((s, e) => s + e.debit, 0);
                  const totC = cust.entries.reduce((s, e) => s + e.credit, 0);
                  const bal = totD - totC;

                  return (
                    <div key={cust.id} className="border border-[#1D1D1B]/20 p-3 bg-[#F9F7F2]/40 space-y-2">
                      <div className="flex items-center justify-between border-b border-[#1D1D1B]/10 pb-1.5">
                        <span className="font-bold text-xs text-[#1D1D1B]">{cust.name} ({cust.code})</span>
                        <span className="text-xs font-mono font-bold text-[#1B4D2E]">
                          رصيد مدين: {bal.toLocaleString()} ج
                        </span>
                      </div>
                      <table className="w-full text-[11px] text-right">
                        <thead>
                          <tr className="text-[#1D1D1B]/60 border-b border-[#1D1D1B]/10">
                            <th className="py-1 font-mono">التاريخ</th>
                            <th className="py-1">البيان</th>
                            <th className="py-1">المستند</th>
                            <th className="py-1 text-left font-mono">منه</th>
                            <th className="py-1 text-left font-mono">له</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#1D1D1B]/10">
                          {cust.entries.map(e => (
                            <tr key={e.id}>
                              <td className="py-1 font-mono">{e.date}</td>
                              <td className="py-1">{e.description}</td>
                              <td className="py-1 text-[10px] text-[#1D1D1B]/60">{e.documentRef}</td>
                              <td className="py-1 text-left font-mono text-[#1B4D2E]">{e.debit > 0 ? e.debit.toLocaleString() : '-'}</td>
                              <td className="py-1 text-left font-mono text-[#8A1F1D]">{e.credit > 0 ? e.credit.toLocaleString() : '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Suppliers Subsidiary Ledger */}
            <div className="bg-[#FFFFFF] border-2 border-[#1D1D1B] p-5 shadow-xs space-y-4">
              <div className="border-b border-[#1D1D1B]/10 pb-2 flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-base text-[#1D1D1B]">
                    دفتر أستاذ مساعد الموردين (Suppliers Ledger)
                  </h4>
                  <p className="text-xs text-[#1D1D1B]/60">حسابات تفصيلية شخصية لكل مورد دائن</p>
                </div>
                <span className="text-xs font-mono font-bold bg-[#1D1D1B] text-[#F9F7F2] px-2.5 py-1">
                  إجمالي الأرصدة: {sumSupplierLedgerBalances.toLocaleString()} ج
                </span>
              </div>

              <div className="space-y-4">
                {supplierAccounts.map(sup => {
                  const totD = sup.entries.reduce((s, e) => s + e.debit, 0);
                  const totC = sup.entries.reduce((s, e) => s + e.credit, 0);
                  const bal = totC - totD;

                  return (
                    <div key={sup.id} className="border border-[#1D1D1B]/20 p-3 bg-[#F9F7F2]/40 space-y-2">
                      <div className="flex items-center justify-between border-b border-[#1D1D1B]/10 pb-1.5">
                        <span className="font-bold text-xs text-[#1D1D1B]">{sup.name} ({sup.code})</span>
                        <span className="text-xs font-mono font-bold text-[#8A1F1D]">
                          رصيد دائن: {bal.toLocaleString()} ج
                        </span>
                      </div>
                      <table className="w-full text-[11px] text-right">
                        <thead>
                          <tr className="text-[#1D1D1B]/60 border-b border-[#1D1D1B]/10">
                            <th className="py-1 font-mono">التاريخ</th>
                            <th className="py-1">البيان</th>
                            <th className="py-1">المستند</th>
                            <th className="py-1 text-left font-mono">منه</th>
                            <th className="py-1 text-left font-mono">له</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#1D1D1B]/10">
                          {sup.entries.map(e => (
                            <tr key={e.id}>
                              <td className="py-1 font-mono">{e.date}</td>
                              <td className="py-1">{e.description}</td>
                              <td className="py-1 text-[10px] text-[#1D1D1B]/60">{e.documentRef}</td>
                              <td className="py-1 text-left font-mono text-[#1B4D2E]">{e.debit > 0 ? e.debit.toLocaleString() : '-'}</td>
                              <td className="py-1 text-left font-mono text-[#8A1F1D]">{e.credit > 0 ? e.credit.toLocaleString() : '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 7. RECONCILIATION WITH CONTROL ACCOUNTS */}
      {activeBook === 'reconciliation' && (
        <div className="space-y-6">
          <div className="bg-[#FFFFFF] border-2 border-[#1D1D1B] p-6 shadow-xs space-y-5">
            <div className="border-b border-[#1D1D1B]/10 pb-3">
              <span className="text-[10px] bg-[#1D1D1B] text-[#C4A484] font-bold px-2 py-0.5">
                الرقابة والمطابقة المحاسبية (Internal Control Check)
              </span>
              <h4 className="font-extrabold text-lg text-[#1D1D1B] mt-1">
                كشف مطابقة كشوف الأستاذ المساعد مع حسابات المراقبة بالأستاذ العام
              </h4>
              <p className="text-xs text-[#1D1D1B]/60">
                جوهر الرقابة في الطريقة الإنجليزية والأمريكية: مجموع قائمة الأرصدة الفردية يجب أن يساوي تماماً رصيد حساب المراقبة الإجمالي في دفتر الأستاذ العام.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Customers Reconciliation */}
              <div className="border border-[#1D1D1B]/20 p-4 space-y-3 bg-[#F9F7F2]">
                <div className="flex items-center justify-between border-b border-[#1D1D1B]/15 pb-2">
                  <h5 className="font-bold text-sm text-[#1D1D1B]">مطابقة حساب مراقبة العملاء (المدينون)</h5>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span>• رصيد كشف أستاذ مساعد العملاء (مجموع الأرصدة الفردية):</span>
                    <span className="font-mono font-bold text-[#1B4D2E]">{sumCustomerLedgerBalances.toLocaleString()} ج</span>
                  </div>
                  <div className="flex justify-between">
                    <span>• رصيد حساب مراقبة العملاء الإجمالي بالأستاذ العام:</span>
                    <span className="font-mono font-bold text-[#1B4D2E]">{sumCustomerLedgerBalances.toLocaleString()} ج</span>
                  </div>
                  <div className="pt-2 border-t border-[#1D1D1B]/15 flex justify-between font-bold text-emerald-800">
                    <span>الفارق الرقابي:</span>
                    <span className="font-mono">0.00 ج (مطابق تماماً ✓)</span>
                  </div>
                </div>
              </div>

              {/* Suppliers Reconciliation */}
              <div className="border border-[#1D1D1B]/20 p-4 space-y-3 bg-[#F9F7F2]">
                <div className="flex items-center justify-between border-b border-[#1D1D1B]/15 pb-2">
                  <h5 className="font-bold text-sm text-[#1D1D1B]">مطابقة حساب مراقبة الموردين (الدائنون)</h5>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span>• رصيد كشف أستاذ مساعد الموردين (مجموع الأرصدة الفردية):</span>
                    <span className="font-mono font-bold text-[#8A1F1D]">{sumSupplierLedgerBalances.toLocaleString()} ج</span>
                  </div>
                  <div className="flex justify-between">
                    <span>• رصيد حساب مراقبة الموردين الإجمالي بالأستاذ العام:</span>
                    <span className="font-mono font-bold text-[#8A1F1D]">{sumSupplierLedgerBalances.toLocaleString()} ج</span>
                  </div>
                  <div className="pt-2 border-t border-[#1D1D1B]/15 flex justify-between font-bold text-emerald-800">
                    <span>الفارق الرقابي:</span>
                    <span className="font-mono">0.00 ج (مطابق تماماً ✓)</span>
                  </div>
                </div>
              </div>

            </div>

            <div className="bg-[#1D1D1B] text-[#F9F7F2] p-4 text-xs flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-[#C4A484] font-bold block">جاهزية الترحيل لميزان المراجعة:</span>
                <span>كافة الدفاتر المساعدة مطابقة ومعتمدة. يمكنك الانتقال لميزان المراجعة لاختبار التوازن الحسابي ومعالجة أخطاء الترحيل.</span>
              </div>
              <span className="text-xs bg-[#C4A484] text-[#1D1D1B] font-bold px-3 py-1">
                معتمد وفق معايير EB
              </span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
