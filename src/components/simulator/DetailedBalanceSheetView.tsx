import React, { useState } from 'react';
import { 
  Scale, Layers, DollarSign, CheckCircle2, AlertTriangle, 
  ArrowDownRight, TrendingUp, ShieldCheck, HelpCircle, 
  ChevronDown, ChevronUp, FileText, PieChart, Eye
} from 'lucide-react';
import { TAccount, TAccountEntry } from '../TAccountSimulator';

export interface DetailedBalanceSheetViewProps {
  accounts: TAccount[];
  endingInventory: number;
  grossProfit: number;
  netProfit: number;
  calculateAccountSummary: (account: TAccount) => {
    totalDebit?: number;
    totalCredit?: number;
    totalDebits?: number;
    totalCredits?: number;
    balanceAmount: number;
    balanceType: 'debit' | 'credit' | 'zero';
    [key: string]: any;
  };
  onSelectAccount?: (accountName: string) => void;
}

export const DetailedBalanceSheetView: React.FC<DetailedBalanceSheetViewProps> = ({
  accounts,
  endingInventory,
  grossProfit,
  netProfit,
  calculateAccountSummary,
  onSelectAccount
}) => {
  const [viewMode, setViewMode] = useState<'t_shape' | 'report'>('t_shape');
  const [showRatios, setShowRatios] = useState<boolean>(true);
  const [showGuide, setShowGuide] = useState<boolean>(false);

  // --- Classification Helper Functions ---
  
  // Is Fixed Asset?
  const isFixedAsset = (acc: TAccount): boolean => {
    const n = acc.name.toLowerCase();
    return (
      acc.category === 'asset' &&
      (n.includes('سيارات') ||
        n.includes('آلات') ||
        n.includes('معدات') ||
        n.includes('أثاث') ||
        n.includes('عقار') ||
        n.includes('مباني') ||
        n.includes('أراضي') ||
        n.includes('أجهزة') ||
        n.includes('equipment') ||
        n.includes('office') ||
        n.includes('ثابت'))
    );
  };

  // Is Other Debit Balance? (e.g., Prepaid expenses, accrued revenues, debit suspense)
  const isOtherDebit = (acc: TAccount): boolean => {
    const n = acc.name.toLowerCase();
    const isSuspenseDebit = n.includes('معلق') && calculateAccountSummary(acc).balanceType === 'debit';
    return (
      n.includes('مقدم') ||
      n.includes('مستحق') ||
      isSuspenseDebit
    );
  };

  // Is Current Asset? (All other asset accounts, e.g. Cash, Bank, Receivables/Clients, Notes Receivable)
  const isCurrentAsset = (acc: TAccount): boolean => {
    return (
      acc.category === 'asset' &&
      !isFixedAsset(acc) &&
      !isOtherDebit(acc) &&
      !acc.name.includes('مخزون أول') // Beginning inventory goes to Trading Account, not Balance Sheet
    );
  };

  // Is Long-term Liability?
  const isLongTermLiability = (acc: TAccount): boolean => {
    const n = acc.name.toLowerCase();
    return (
      acc.category === 'liability' &&
      (n.includes('طويل') || n.includes('رهن') || n.includes('سندات') || n.includes('قرض بنكي طويل'))
    );
  };

  // Is Other Credit Balance? (Accrued expenses, unearned revenue, credit suspense)
  const isOtherCredit = (acc: TAccount): boolean => {
    const n = acc.name.toLowerCase();
    const isSuspenseCredit = n.includes('معلق') && calculateAccountSummary(acc).balanceType === 'credit';
    return (
      (acc.category === 'liability' && (n.includes('مستحقة') || n.includes('مقدم'))) ||
      isSuspenseCredit
    );
  };

  // Is Current Liability? (Payables/Suppliers, Notes Payable, Short-term loan, Overdraft)
  const isCurrentLiability = (acc: TAccount): boolean => {
    return (
      acc.category === 'liability' &&
      !isLongTermLiability(acc) &&
      !isOtherCredit(acc)
    );
  };

  // Extract Accounts & Balances
  const fixedAssetAccounts = accounts.filter(isFixedAsset);
  const currentAssetAccounts = accounts.filter(isCurrentAsset);
  const otherDebitAccounts = accounts.filter(isOtherDebit);

  const longTermLiabilityAccounts = accounts.filter(isLongTermLiability);
  const currentLiabilityAccounts = accounts.filter(isCurrentLiability);
  const otherCreditAccounts = accounts.filter(isOtherCredit);

  // Capital & Drawings (Equity)
  const capitalAcc = accounts.find(a => a.name.includes('رأس المال') || a.category === 'equity' && !a.name.includes('المسحوبات'));
  const capitalBalance = capitalAcc ? calculateAccountSummary(capitalAcc).balanceAmount : 0;

  const drawingsAcc = accounts.find(a => a.name.includes('المسحوبات'));
  const drawingsBalance = drawingsAcc ? calculateAccountSummary(drawingsAcc).balanceAmount : 0;

  // Subtotals
  const totalFixedAssets = fixedAssetAccounts.reduce((sum, a) => {
    const s = calculateAccountSummary(a);
    return sum + (s.balanceType === 'debit' ? s.balanceAmount : -s.balanceAmount);
  }, 0);

  const totalCurrentAssetsFromLedger = currentAssetAccounts.reduce((sum, a) => {
    const s = calculateAccountSummary(a);
    return sum + (s.balanceType === 'debit' ? s.balanceAmount : -s.balanceAmount);
  }, 0);

  // Current Assets include ending inventory from actual physical count!
  const totalCurrentAssets = totalCurrentAssetsFromLedger + endingInventory;

  const totalOtherDebits = otherDebitAccounts.reduce((sum, a) => {
    const s = calculateAccountSummary(a);
    return sum + (s.balanceType === 'debit' ? s.balanceAmount : -s.balanceAmount);
  }, 0);

  // GRAND TOTAL ASSETS
  const grandTotalAssets = totalFixedAssets + totalCurrentAssets + totalOtherDebits;

  // Equity Subtotal
  // Net Equity = Capital + Net Profit (or - Net Loss) - Drawings
  const netEndingEquity = capitalBalance + netProfit - drawingsBalance;

  // Liabilities Subtotals
  const totalLongTermLiabilities = longTermLiabilityAccounts.reduce((sum, a) => {
    const s = calculateAccountSummary(a);
    return sum + (s.balanceType === 'credit' ? s.balanceAmount : -s.balanceAmount);
  }, 0);

  const totalCurrentLiabilities = currentLiabilityAccounts.reduce((sum, a) => {
    const s = calculateAccountSummary(a);
    return sum + (s.balanceType === 'credit' ? s.balanceAmount : -s.balanceAmount);
  }, 0);

  const totalOtherCredits = otherCreditAccounts.reduce((sum, a) => {
    const s = calculateAccountSummary(a);
    return sum + (s.balanceType === 'credit' ? s.balanceAmount : -s.balanceAmount);
  }, 0);

  // Total Liabilities (outside obligations)
  const totalLiabilitiesOnly = totalLongTermLiabilities + totalCurrentLiabilities + totalOtherCredits;

  // GRAND TOTAL LIABILITIES & OWNER'S EQUITY
  const grandTotalLiabilitiesAndEquity = netEndingEquity + totalLiabilitiesOnly;

  // Balance Check
  const balanceDifference = grandTotalAssets - grandTotalLiabilitiesAndEquity;
  const isPerfectBalance = Math.abs(balanceDifference) === 0;

  // Financial Indicators
  const workingCapital = totalCurrentAssets - totalCurrentLiabilities;
  const currentRatio = totalCurrentLiabilities > 0 ? (totalCurrentAssets / totalCurrentLiabilities).toFixed(2) : '∞ (لا ديون قصيرة)';
  const debtToAssets = grandTotalAssets > 0 ? ((totalLiabilitiesOnly / grandTotalAssets) * 100).toFixed(1) : '0';

  return (
    <div id="detailed-balance-sheet-container" className="bg-[#FFFFFF] border-2 border-[#1D1D1B] p-5 sm:p-7 shadow-xs space-y-6 font-serif">
      
      {/* Header with Title and Mode Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-[#1D1D1B] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] bg-[#1D1D1B] text-[#F9F7F2] font-bold px-2.5 py-0.5 uppercase tracking-wider">
              القائمة المالية الختامية الشاملة
            </span>
            <span className="text-[11px] bg-[#C4A484] text-[#1D1D1B] font-bold px-2.5 py-0.5">
              طبقا للأصول والمعايير المحاسبية
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-[#1D1D1B] mt-1.5 flex items-center gap-2">
            <Scale className="w-6 h-6 text-[#C4A484]" />
            <span>الميزانية العمومية التفصيلية (Balance Sheet Statement)</span>
          </h3>
          <p className="text-xs text-[#1D1D1B]/70 mt-1">
            كما في نهاية الفترة المالية 2026/01/31 • تبويب كامل للأصول والخصوم والالتزامات وحقوق الملكية
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* View Mode Toggle */}
          <div className="inline-flex border border-[#1D1D1B] p-0.5 bg-[#F9F7F2]">
            <button
              id="btn-view-t-shape"
              onClick={() => setViewMode('t_shape')}
              className={`px-3 py-1 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                viewMode === 't_shape'
                  ? 'bg-[#1D1D1B] text-[#F9F7F2]'
                  : 'text-[#1D1D1B] hover:bg-[#EFECE6]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>شكل حرف (T) ذو الجانبين</span>
            </button>
            <button
              id="btn-view-report"
              onClick={() => setViewMode('report')}
              className={`px-3 py-1 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'report'
                  ? 'bg-[#1D1D1B] text-[#F9F7F2]'
                  : 'text-[#1D1D1B] hover:bg-[#EFECE6]'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>شكل القائمة الرأسية (تقرير)</span>
            </button>
          </div>

          <button
            id="btn-toggle-ratios"
            onClick={() => setShowRatios(!showRatios)}
            className={`px-3 py-1.5 text-xs font-bold border transition flex items-center gap-1.5 cursor-pointer ${
              showRatios 
                ? 'bg-[#F9F7F2] text-[#1D1D1B] border-[#1D1D1B]' 
                : 'bg-[#FFFFFF] text-[#1D1D1B]/70 border-[#1D1D1B]/20'
            }`}
          >
            <PieChart className="w-3.5 h-3.5 text-[#C4A484]" />
            <span>المؤشرات المالية</span>
          </button>

          <button
            id="btn-toggle-guide"
            onClick={() => setShowGuide(!showGuide)}
            className="px-3 py-1.5 text-xs font-bold bg-[#FFFFFF] hover:bg-[#F9F7F2] text-[#1D1D1B] border border-[#1D1D1B]/25 transition flex items-center gap-1.5 cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-[#C4A484]" />
            <span>دليل التبويب</span>
          </button>
        </div>
      </div>

      {/* Educational Guide Card */}
      {showGuide && (
        <div className="bg-[#F9F7F2] border border-[#1D1D1B]/20 p-4 text-xs space-y-3 leading-relaxed">
          <div className="flex items-center justify-between border-b border-[#1D1D1B]/15 pb-2">
            <span className="font-extrabold text-sm text-[#1D1D1B] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#C4A484]" />
              <span>القواعد المعيارية لتبويب الميزانية العمومية في المحاسبة المالية:</span>
            </span>
            <button 
              onClick={() => setShowGuide(false)}
              className="text-[#1D1D1B]/60 hover:text-[#1D1D1B] font-bold text-xs"
            >
              ✕ إغلاق
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#FFFFFF] p-3 border border-[#1D1D1B]/10 space-y-1.5">
              <span className="font-bold text-[#1B4D2E] block">1. جانب الأصول (الموجودات / الاستخدامات):</span>
              <p className="text-[11px] text-[#1D1D1B]/80">
                • <strong>الأصول الثابتة:</strong> ممتلكات شُريت بغرض الاستخدام في النشاط وليس لإعادة البيع (مثل السيارات، الآلات، الأثاث، والمباني).
              </p>
              <p className="text-[11px] text-[#1D1D1B]/80">
                • <strong>الأصول المتداولة:</strong> نقدية أو بنود يسهل تحويلها لنقدية خلال دورة تشغيلية (الخزينة، البنك، العملاء، وبضاعة آخر المدة المقومة بالجرد الفعلي).
              </p>
              <p className="text-[11px] text-[#1D1D1B]/80">
                • <strong>أرصدة مدينة أخرى:</strong> مبالغ مدفوعة مقدماً للمستقبل، أو إيرادات اكتسبتها المنشأة ولم تحصلها بعد.
              </p>
            </div>
            <div className="bg-[#FFFFFF] p-3 border border-[#1D1D1B]/10 space-y-1.5">
              <span className="font-bold text-[#8A1F1D] block">2. جانب الخصوم وحقوق الملكية (المصادر / التعهدات):</span>
              <p className="text-[11px] text-[#1D1D1B]/80">
                • <strong>حقوق الملكية (الالتزام تجاه الملاك):</strong> رأس المال المبدئي + أرباح الفترة الصافية (المرحلة من حساب الأرباح والخسائر) - المسحوبات الشخصية.
              </p>
              <p className="text-[11px] text-[#1D1D1B]/80">
                • <strong>الالتزامات المتداولة (قصيرة الأجل):</strong> ديون واجبة السداد خلال عام كالموردين (الدائنون) وأوراق الدفع والسحب البنكي.
              </p>
              <p className="text-[11px] text-[#1D1D1B]/80">
                • <strong>الالتزامات طويلة الأجل:</strong> القروض البنكية التي يستغرق سدادها أكثر من سنة مالية.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Financial Ratios Bar */}
      {showRatios && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-[#F9F7F2] border border-[#1D1D1B]/15 p-3 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-[#1D1D1B]/60 font-bold block">صافي رأس المال العامل (Working Capital)</span>
              <span className="text-[10px] text-[#1D1D1B]/50 block font-mono">الأصول المتداولة - الخصوم المتداولة</span>
              <span className="text-base font-mono font-extrabold text-[#1D1D1B] mt-0.5 block">
                {workingCapital.toLocaleString()} ج.م
              </span>
            </div>
            <span className={`text-xs px-2 py-1 font-bold ${workingCapital >= 0 ? 'bg-emerald-100 text-emerald-900' : 'bg-rose-100 text-rose-900'}`}>
              {workingCapital >= 0 ? 'فائض تشغيلي آمن' : 'عجز تشغيلي'}
            </span>
          </div>

          <div className="bg-[#F9F7F2] border border-[#1D1D1B]/15 p-3 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-[#1D1D1B]/60 font-bold block">نسبة التداول (Current Ratio)</span>
              <span className="text-[10px] text-[#1D1D1B]/50 block font-mono">الأصول المتداولة ÷ الخصوم المتداولة</span>
              <span className="text-base font-mono font-extrabold text-[#1D1D1B] mt-0.5 block">
                {currentRatio} {totalCurrentLiabilities > 0 ? ': 1' : ''}
              </span>
            </div>
            <span className="text-[11px] text-[#1D1D1B]/70 font-mono">
              معيار الأمان المحاسبي: 2:1
            </span>
          </div>

          <div className="bg-[#F9F7F2] border border-[#1D1D1B]/15 p-3 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-[#1D1D1B]/60 font-bold block">نسبة الديون للموجودات (Debt Ratio)</span>
              <span className="text-[10px] text-[#1D1D1B]/50 block font-mono">إجمالي الالتزامات ÷ إجمالي الأصول</span>
              <span className="text-base font-mono font-extrabold text-[#1D1D1B] mt-0.5 block">
                {debtToAssets}%
              </span>
            </div>
            <span className={`text-xs px-2 py-1 font-bold ${Number(debtToAssets) < 50 ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'}`}>
              {Number(debtToAssets) < 50 ? 'مخاطر منخفضة' : 'اعتماد مرتفع عالديون'}
            </span>
          </div>
        </div>
      )}

      {/* VIEW MODE 1: T-SHAPE TWO-SIDED BALANCE SHEET */}
      {viewMode === 't_shape' && (
        <div className="border-2 border-[#1D1D1B] bg-[#FFFFFF] overflow-hidden">
          
          {/* Main T-Header */}
          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y-2 lg:divide-y-0 lg:divide-x-2 lg:divide-x-reverse divide-[#1D1D1B]">
            
            {/* RIGHT COLUMN: ASSETS (الأصول) */}
            <div className="flex flex-col">
              
              <div className="bg-[#1D1D1B] text-[#F9F7F2] px-4 py-2.5 flex items-center justify-between">
                <span className="font-extrabold text-sm flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-[#C4A484] inline-block"></span>
                  <span>الأصول (الموجودات والاستخدامات)</span>
                </span>
                <span className="text-[11px] text-[#C4A484] font-mono font-bold">الأرصدة المدينة</span>
              </div>

              {/* Column Sub-header: Account Name, Partial, Total */}
              <div className="bg-[#F9F7F2] border-b border-[#1D1D1B]/20 text-[11px] font-bold text-[#1D1D1B] px-4 py-1.5 grid grid-cols-12">
                <span className="col-span-6">البيان والحساب</span>
                <span className="col-span-3 text-left font-mono">جزئي (ج)</span>
                <span className="col-span-3 text-left font-mono">كلي (ج)</span>
              </div>

              <div className="p-4 space-y-5 flex-1 text-xs">
                
                {/* 1. Fixed Assets Group */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between font-extrabold text-[#1D1D1B] border-b border-[#1D1D1B]/20 pb-1">
                    <span className="text-xs bg-[#EFECE6] px-1.5 py-0.5">أولاً: الأصول الثابتة (غير المتداولة):</span>
                  </div>
                  
                  {fixedAssetAccounts.length > 0 ? (
                    fixedAssetAccounts.map(acc => {
                      const summary = calculateAccountSummary(acc);
                      return (
                        <div 
                          key={acc.id} 
                          onClick={() => onSelectAccount && onSelectAccount(acc.name)}
                          className="grid grid-cols-12 py-1 px-1.5 hover:bg-[#F9F7F2] transition cursor-pointer text-[#1D1D1B]/90"
                        >
                          <div className="col-span-6 flex items-center gap-1">
                            <span className="text-[10px] text-[#1D1D1B]/40 font-mono">({acc.code})</span>
                            <span className="font-semibold">{acc.name.split(' (')[0]}</span>
                          </div>
                          <span className="col-span-3 text-left font-mono font-semibold">
                            {summary.balanceAmount.toLocaleString()}
                          </span>
                          <span className="col-span-3 text-left font-mono text-[#1D1D1B]/30">-</span>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-[11px] text-[#1D1D1B]/40 py-1 italic pr-2">
                      لا توجد أصول ثابتة مسجلة في هذا السيناريو
                    </div>
                  )}

                  <div className="grid grid-cols-12 pt-1 border-t border-dashed border-[#1D1D1B]/30 font-bold text-[#1D1D1B] bg-[#F9F7F2]/60 px-1.5">
                    <span className="col-span-6 text-[11px]">مجموع الأصول الثابتة</span>
                    <span className="col-span-3 text-left font-mono text-[11px] text-[#1D1D1B]/40"></span>
                    <span className="col-span-3 text-left font-mono text-xs font-extrabold text-[#1B4D2E]">
                      {totalFixedAssets.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* 2. Current Assets Group */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between font-extrabold text-[#1D1D1B] border-b border-[#1D1D1B]/20 pb-1">
                    <span className="text-xs bg-[#EFECE6] px-1.5 py-0.5">ثانياً: الأصول المتداولة:</span>
                  </div>

                  {/* Ending Inventory (Always displayed in Balance Sheet) */}
                  <div className="grid grid-cols-12 py-1 px-1.5 hover:bg-[#F9F7F2] transition text-[#1D1D1B]">
                    <div className="col-span-6 flex items-center gap-1">
                      <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-1">جرد</span>
                      <span className="font-semibold">بضاعة آخر المدة (المخزون السلعي)</span>
                    </div>
                    <span className="col-span-3 text-left font-mono font-semibold text-[#1B4D2E]">
                      {endingInventory.toLocaleString()}
                    </span>
                    <span className="col-span-3 text-left font-mono text-[#1D1D1B]/30">-</span>
                  </div>

                  {/* Other Current Assets from accounts */}
                  {currentAssetAccounts.map(acc => {
                    const summary = calculateAccountSummary(acc);
                    return (
                      <div 
                        key={acc.id} 
                        onClick={() => onSelectAccount && onSelectAccount(acc.name)}
                        className="grid grid-cols-12 py-1 px-1.5 hover:bg-[#F9F7F2] transition cursor-pointer text-[#1D1D1B]/90"
                      >
                        <div className="col-span-6 flex items-center gap-1">
                          <span className="text-[10px] text-[#1D1D1B]/40 font-mono">({acc.code})</span>
                          <span className="font-semibold">{acc.name.split(' (')[0]}</span>
                        </div>
                        <span className="col-span-3 text-left font-mono font-semibold">
                          {summary.balanceAmount.toLocaleString()}
                        </span>
                        <span className="col-span-3 text-left font-mono text-[#1D1D1B]/30">-</span>
                      </div>
                    );
                  })}

                  <div className="grid grid-cols-12 pt-1 border-t border-dashed border-[#1D1D1B]/30 font-bold text-[#1D1D1B] bg-[#F9F7F2]/60 px-1.5">
                    <span className="col-span-6 text-[11px]">مجموع الأصول المتداولة</span>
                    <span className="col-span-3 text-left font-mono text-[11px] text-[#1D1D1B]/40"></span>
                    <span className="col-span-3 text-left font-mono text-xs font-extrabold text-[#1B4D2E]">
                      {totalCurrentAssets.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* 3. Other Debit Balances (if any) */}
                {otherDebitAccounts.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between font-extrabold text-[#1D1D1B] border-b border-[#1D1D1B]/20 pb-1">
                      <span className="text-xs bg-[#EFECE6] px-1.5 py-0.5">ثالثاً: أرصدة مدينة أخرى:</span>
                    </div>
                    {otherDebitAccounts.map(acc => {
                      const summary = calculateAccountSummary(acc);
                      return (
                        <div 
                          key={acc.id}
                          className="grid grid-cols-12 py-1 px-1.5 hover:bg-[#F9F7F2] transition text-[#8A1F1D]"
                        >
                          <div className="col-span-6 flex items-center gap-1">
                            <span className="text-[10px] font-mono">({acc.code})</span>
                            <span className="font-semibold">{acc.name}</span>
                          </div>
                          <span className="col-span-3 text-left font-mono font-semibold">
                            {summary.balanceAmount.toLocaleString()}
                          </span>
                          <span className="col-span-3 text-left font-mono text-[#1D1D1B]/30">-</span>
                        </div>
                      );
                    })}
                    <div className="grid grid-cols-12 pt-1 border-t border-dashed border-[#1D1D1B]/30 font-bold text-[#1D1D1B] bg-[#F9F7F2]/60 px-1.5">
                      <span className="col-span-6 text-[11px]">مجموع الأرصدة المدينة الأخرى</span>
                      <span className="col-span-3 text-left font-mono"></span>
                      <span className="col-span-3 text-left font-mono text-xs font-extrabold">
                        {totalOtherDebits.toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}

              </div>

              {/* Bottom Grand Total Assets Bar */}
              <div className="bg-[#1D1D1B] text-[#F9F7F2] p-3.5 border-t-2 border-[#1D1D1B] mt-auto">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm sm:text-base">إجمالي الأصول (Total Assets)</span>
                  </div>
                  <div className="text-left font-mono font-extrabold text-base sm:text-lg text-[#C4A484] border-b-4 border-double border-[#C4A484] pb-0.5">
                    {grandTotalAssets.toLocaleString()} ج.م
                  </div>
                </div>
              </div>

            </div>

            {/* LEFT COLUMN: LIABILITIES & OWNER'S EQUITY (الخصوم والالتزامات وحقوق الملكية) */}
            <div className="flex flex-col">
              
              <div className="bg-[#1D1D1B] text-[#F9F7F2] px-4 py-2.5 flex items-center justify-between">
                <span className="font-extrabold text-sm flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-[#C4A484] inline-block"></span>
                  <span>الخصوم والالتزامات وحقوق الملكية</span>
                </span>
                <span className="text-[11px] text-[#C4A484] font-mono font-bold">الأرصدة الدائنة</span>
              </div>

              {/* Column Sub-header: Account Name, Partial, Total */}
              <div className="bg-[#F9F7F2] border-b border-[#1D1D1B]/20 text-[11px] font-bold text-[#1D1D1B] px-4 py-1.5 grid grid-cols-12">
                <span className="col-span-6">البيان والحساب</span>
                <span className="col-span-3 text-left font-mono">جزئي (ج)</span>
                <span className="col-span-3 text-left font-mono">كلي (ج)</span>
              </div>

              <div className="p-4 space-y-5 flex-1 text-xs">
                
                {/* 1. Owner's Equity Group (حقوق الملكية) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between font-extrabold text-[#1D1D1B] border-b border-[#1D1D1B]/20 pb-1">
                    <span className="text-xs bg-[#EFECE6] px-1.5 py-0.5">أولاً: حقوق الملكية (التزامات للملاك):</span>
                  </div>

                  {/* Capital Account */}
                  <div className="grid grid-cols-12 py-1 px-1.5 hover:bg-[#F9F7F2] transition text-[#1D1D1B]">
                    <div className="col-span-6 flex items-center gap-1">
                      <span className="text-[10px] text-[#1D1D1B]/40 font-mono">
                        {capitalAcc ? `(${capitalAcc.code})` : ''}
                      </span>
                      <span className="font-semibold">رأس المال (أول الفترة)</span>
                    </div>
                    <span className="col-span-3 text-left font-mono font-semibold">
                      {capitalBalance.toLocaleString()}
                    </span>
                    <span className="col-span-3 text-left font-mono text-[#1D1D1B]/30">-</span>
                  </div>

                  {/* Net Profit / Loss from P&L */}
                  <div className="grid grid-cols-12 py-1 px-1.5 hover:bg-[#F9F7F2] transition text-[#1D1D1B]">
                    <div className="col-span-6 flex items-center gap-1">
                      <span className={`text-[10px] font-bold px-1 ${netProfit >= 0 ? 'bg-emerald-100 text-emerald-900' : 'bg-rose-100 text-rose-900'}`}>
                        {netProfit >= 0 ? '(+) أرباح' : '(-) خسائر'}
                      </span>
                      <span className="font-semibold">
                        {netProfit >= 0 ? 'صافي أرباح العام (مرحل من حـ/ أ.خ)' : 'صافي خسارة العام (مرحل من حـ/ أ.خ)'}
                      </span>
                    </div>
                    <span className={`col-span-3 text-left font-mono font-semibold ${netProfit >= 0 ? 'text-[#1B4D2E]' : 'text-[#8A1F1D]'}`}>
                      {netProfit >= 0 ? `+${netProfit.toLocaleString()}` : `(${Math.abs(netProfit).toLocaleString()})`}
                    </span>
                    <span className="col-span-3 text-left font-mono text-[#1D1D1B]/30">-</span>
                  </div>

                  {/* Drawings (Personal) */}
                  {drawingsBalance > 0 && (
                    <div className="grid grid-cols-12 py-1 px-1.5 hover:bg-[#F9F7F2] transition text-[#8A1F1D]">
                      <div className="col-span-6 flex items-center gap-1">
                        <span className="text-[10px] bg-rose-100 text-rose-900 font-bold px-1">(-) سحب</span>
                        <span className="font-semibold">المسحوبات الشخصية لصاحب المنشأة</span>
                      </div>
                      <span className="col-span-3 text-left font-mono font-semibold text-[#8A1F1D]">
                        ({drawingsBalance.toLocaleString()})
                      </span>
                      <span className="col-span-3 text-left font-mono text-[#1D1D1B]/30">-</span>
                    </div>
                  )}

                  <div className="grid grid-cols-12 pt-1 border-t border-dashed border-[#1D1D1B]/30 font-bold text-[#1D1D1B] bg-[#F9F7F2]/60 px-1.5">
                    <span className="col-span-6 text-[11px]">صافي حقوق الملكية آخر الفترة</span>
                    <span className="col-span-3 text-left font-mono text-[11px] text-[#1D1D1B]/40"></span>
                    <span className="col-span-3 text-left font-mono text-xs font-extrabold text-[#1B4D2E]">
                      {netEndingEquity.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* 2. Long-Term Liabilities (الخصوم طويلة الأجل) */}
                {longTermLiabilityAccounts.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between font-extrabold text-[#1D1D1B] border-b border-[#1D1D1B]/20 pb-1">
                      <span className="text-xs bg-[#EFECE6] px-1.5 py-0.5">ثانياً: الالتزامات طويلة الأجل (غير المتداولة):</span>
                    </div>
                    {longTermLiabilityAccounts.map(acc => {
                      const summary = calculateAccountSummary(acc);
                      return (
                        <div key={acc.id} className="grid grid-cols-12 py-1 px-1.5 hover:bg-[#F9F7F2] transition text-[#1D1D1B]/90">
                          <div className="col-span-6 flex items-center gap-1">
                            <span className="text-[10px] text-[#1D1D1B]/40 font-mono">({acc.code})</span>
                            <span className="font-semibold">{acc.name}</span>
                          </div>
                          <span className="col-span-3 text-left font-mono font-semibold">
                            {summary.balanceAmount.toLocaleString()}
                          </span>
                          <span className="col-span-3 text-left font-mono text-[#1D1D1B]/30">-</span>
                        </div>
                      );
                    })}
                    <div className="grid grid-cols-12 pt-1 border-t border-dashed border-[#1D1D1B]/30 font-bold text-[#1D1D1B] bg-[#F9F7F2]/60 px-1.5">
                      <span className="col-span-6 text-[11px]">مجموع الالتزامات طويلة الأجل</span>
                      <span className="col-span-3 text-left font-mono"></span>
                      <span className="col-span-3 text-left font-mono text-xs font-extrabold">
                        {totalLongTermLiabilities.toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}

                {/* 3. Current Liabilities (الخصوم المتداولة / قصيرة الأجل) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between font-extrabold text-[#1D1D1B] border-b border-[#1D1D1B]/20 pb-1">
                    <span className="text-xs bg-[#EFECE6] px-1.5 py-0.5">ثانياً: الخصوم المتداولة (الالتزامات قصيرة الأجل):</span>
                  </div>

                  {currentLiabilityAccounts.length > 0 ? (
                    currentLiabilityAccounts.map(acc => {
                      const summary = calculateAccountSummary(acc);
                      return (
                        <div 
                          key={acc.id} 
                          onClick={() => onSelectAccount && onSelectAccount(acc.name)}
                          className="grid grid-cols-12 py-1 px-1.5 hover:bg-[#F9F7F2] transition cursor-pointer text-[#1D1D1B]/90"
                        >
                          <div className="col-span-6 flex items-center gap-1">
                            <span className="text-[10px] text-[#1D1D1B]/40 font-mono">({acc.code})</span>
                            <span className="font-semibold">{acc.name.split(' (')[0]}</span>
                          </div>
                          <span className="col-span-3 text-left font-mono font-semibold">
                            {summary.balanceAmount.toLocaleString()}
                          </span>
                          <span className="col-span-3 text-left font-mono text-[#1D1D1B]/30">-</span>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-[11px] text-[#1D1D1B]/40 py-1 italic pr-2">
                      لا توجد التزامات متداولة قائمة (تم سداد كافة المستحقات)
                    </div>
                  )}

                  <div className="grid grid-cols-12 pt-1 border-t border-dashed border-[#1D1D1B]/30 font-bold text-[#1D1D1B] bg-[#F9F7F2]/60 px-1.5">
                    <span className="col-span-6 text-[11px]">مجموع الخصوم المتداولة</span>
                    <span className="col-span-3 text-left font-mono text-[11px] text-[#1D1D1B]/40"></span>
                    <span className="col-span-3 text-left font-mono text-xs font-extrabold text-[#8A1F1D]">
                      {totalCurrentLiabilities.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* 4. Other Credit Balances (أرصدة دائنة أخرى) */}
                {otherCreditAccounts.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between font-extrabold text-[#1D1D1B] border-b border-[#1D1D1B]/20 pb-1">
                      <span className="text-xs bg-[#EFECE6] px-1.5 py-0.5">رابعاً: أرصدة دائنة أخرى:</span>
                    </div>
                    {otherCreditAccounts.map(acc => {
                      const summary = calculateAccountSummary(acc);
                      return (
                        <div key={acc.id} className="grid grid-cols-12 py-1 px-1.5 hover:bg-[#F9F7F2] transition text-[#8A1F1D]">
                          <div className="col-span-6 flex items-center gap-1">
                            <span className="text-[10px] font-mono">({acc.code})</span>
                            <span className="font-semibold">{acc.name}</span>
                          </div>
                          <span className="col-span-3 text-left font-mono font-semibold">
                            {summary.balanceAmount.toLocaleString()}
                          </span>
                          <span className="col-span-3 text-left font-mono text-[#1D1D1B]/30">-</span>
                        </div>
                      );
                    })}
                    <div className="grid grid-cols-12 pt-1 border-t border-dashed border-[#1D1D1B]/30 font-bold text-[#1D1D1B] bg-[#F9F7F2]/60 px-1.5">
                      <span className="col-span-6 text-[11px]">مجموع الأرصدة الدائنة الأخرى</span>
                      <span className="col-span-3 text-left font-mono"></span>
                      <span className="col-span-3 text-left font-mono text-xs font-extrabold">
                        {totalOtherCredits.toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}

              </div>

              {/* Bottom Grand Total Liabilities & Equity Bar */}
              <div className="bg-[#1D1D1B] text-[#F9F7F2] p-3.5 border-t-2 border-[#1D1D1B] mt-auto">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm sm:text-base">إجمالي الخصوم وحقوق الملكية</span>
                  </div>
                  <div className="text-left font-mono font-extrabold text-base sm:text-lg text-[#C4A484] border-b-4 border-double border-[#C4A484] pb-0.5">
                    {grandTotalLiabilitiesAndEquity.toLocaleString()} ج.م
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* VIEW MODE 2: VERTICAL REPORT / STATEMENT FORMAT */}
      {viewMode === 'report' && (
        <div className="space-y-6">
          
          {/* 1. ASSETS SECTION (الأصول) */}
          <div className="border-2 border-[#1D1D1B] bg-[#FFFFFF]">
            <div className="bg-[#1D1D1B] text-[#F9F7F2] p-3 font-extrabold text-sm flex justify-between items-center">
              <span>أولاً: الموجودات والأصول (Assets)</span>
              <span className="font-mono text-[#C4A484] text-xs">الأرصدة المدينة</span>
            </div>

            <div className="p-4 space-y-4 text-xs">
              {/* Fixed */}
              <div>
                <h5 className="font-extrabold text-xs text-[#1D1D1B] bg-[#F9F7F2] p-1.5 border-r-4 border-[#C4A484] mb-2">
                  1. الأصول الثابتة (طويلة الأجل):
                </h5>
                <div className="space-y-1 pr-3">
                  {fixedAssetAccounts.map(acc => (
                    <div key={acc.id} className="flex justify-between py-1 border-b border-[#1D1D1B]/10">
                      <span>• {acc.name} ({acc.code}):</span>
                      <span className="font-mono font-bold">{calculateAccountSummary(acc).balanceAmount.toLocaleString()} ج.م</span>
                    </div>
                  ))}
                  {fixedAssetAccounts.length === 0 && (
                    <span className="text-[#1D1D1B]/50 italic block py-1">- لا توجد أصول ثابتة -</span>
                  )}
                  <div className="flex justify-between font-bold pt-1 text-[#1B4D2E]">
                    <span>إجمالي الأصول الثابتة:</span>
                    <span className="font-mono">{totalFixedAssets.toLocaleString()} ج.م</span>
                  </div>
                </div>
              </div>

              {/* Current */}
              <div>
                <h5 className="font-extrabold text-xs text-[#1D1D1B] bg-[#F9F7F2] p-1.5 border-r-4 border-[#C4A484] mb-2">
                  2. الأصول المتداولة (قصيرة الأجل والسيولة):
                </h5>
                <div className="space-y-1 pr-3">
                  <div className="flex justify-between py-1 border-b border-[#1D1D1B]/10 bg-amber-50/50 px-1">
                    <span className="font-semibold">• بضاعة آخر المدة (تقييم الجرد الفعلي للمستودعات):</span>
                    <span className="font-mono font-bold text-[#1B4D2E]">{endingInventory.toLocaleString()} ج.م</span>
                  </div>
                  {currentAssetAccounts.map(acc => (
                    <div key={acc.id} className="flex justify-between py-1 border-b border-[#1D1D1B]/10">
                      <span>• {acc.name} ({acc.code}):</span>
                      <span className="font-mono font-bold">{calculateAccountSummary(acc).balanceAmount.toLocaleString()} ج.م</span>
                    </div>
                  ))}
                  <div className="flex justify-between font-bold pt-1 text-[#1B4D2E]">
                    <span>إجمالي الأصول المتداولة:</span>
                    <span className="font-mono">{totalCurrentAssets.toLocaleString()} ج.م</span>
                  </div>
                </div>
              </div>

              {/* Other debits if any */}
              {otherDebitAccounts.length > 0 && (
                <div>
                  <h5 className="font-extrabold text-xs text-[#1D1D1B] bg-[#F9F7F2] p-1.5 border-r-4 border-[#C4A484] mb-2">
                    3. أرصدة مدينة أخرى:
                  </h5>
                  <div className="space-y-1 pr-3">
                    {otherDebitAccounts.map(acc => (
                      <div key={acc.id} className="flex justify-between py-1 border-b border-[#1D1D1B]/10">
                        <span>• {acc.name}:</span>
                        <span className="font-mono font-bold">{calculateAccountSummary(acc).balanceAmount.toLocaleString()} ج.م</span>
                      </div>
                    ))}
                    <div className="flex justify-between font-bold pt-1">
                      <span>إجمالي الأرصدة المدينة الأخرى:</span>
                      <span className="font-mono">{totalOtherDebits.toLocaleString()} ج.م</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-[#1D1D1B] text-[#F9F7F2] p-3 flex justify-between font-extrabold text-sm border-t border-[#1D1D1B]">
              <span>مجموع الأصول (Total Assets):</span>
              <span className="font-mono text-[#C4A484] text-base">{grandTotalAssets.toLocaleString()} ج.م</span>
            </div>
          </div>

          {/* 2. LIABILITIES & EQUITY SECTION (الخصوم وحقوق الملكية) */}
          <div className="border-2 border-[#1D1D1B] bg-[#FFFFFF]">
            <div className="bg-[#1D1D1B] text-[#F9F7F2] p-3 font-extrabold text-sm flex justify-between items-center">
              <span>ثانياً: الالتزامات وحقوق الملكية (Liabilities & Owner's Equity)</span>
              <span className="font-mono text-[#C4A484] text-xs">الأرصدة الدائنة</span>
            </div>

            <div className="p-4 space-y-4 text-xs">
              {/* Equity */}
              <div>
                <h5 className="font-extrabold text-xs text-[#1D1D1B] bg-[#F9F7F2] p-1.5 border-r-4 border-[#C4A484] mb-2">
                  1. حقوق الملكية:
                </h5>
                <div className="space-y-1 pr-3">
                  <div className="flex justify-between py-1 border-b border-[#1D1D1B]/10">
                    <span>• رأس المال (أول المدة):</span>
                    <span className="font-mono font-bold">{capitalBalance.toLocaleString()} ج.م</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#1D1D1B]/10">
                    <span>• {netProfit >= 0 ? '(+) صافي ربح العام' : '(-) صافي خسارة العام'} (من حـ/ الأرباح والخسائر):</span>
                    <span className={`font-mono font-bold ${netProfit >= 0 ? 'text-[#1B4D2E]' : 'text-[#8A1F1D]'}`}>
                      {netProfit >= 0 ? `+${netProfit.toLocaleString()}` : `(${Math.abs(netProfit).toLocaleString()})`} ج.م
                    </span>
                  </div>
                  {drawingsBalance > 0 && (
                    <div className="flex justify-between py-1 border-b border-[#1D1D1B]/10 text-[#8A1F1D]">
                      <span>• (-) المسحوبات الشخصية لصاحب المنشأة:</span>
                      <span className="font-mono font-bold">({drawingsBalance.toLocaleString()}) ج.م</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold pt-1 text-[#1B4D2E]">
                    <span>صافي حقوق الملكية في نهاية الفترة:</span>
                    <span className="font-mono">{netEndingEquity.toLocaleString()} ج.م</span>
                  </div>
                </div>
              </div>

              {/* Current Liabilities */}
              <div>
                <h5 className="font-extrabold text-xs text-[#1D1D1B] bg-[#F9F7F2] p-1.5 border-r-4 border-[#C4A484] mb-2">
                  2. الالتزامات والخصوم المتداولة (قصيرة الأجل):
                </h5>
                <div className="space-y-1 pr-3">
                  {currentLiabilityAccounts.map(acc => (
                    <div key={acc.id} className="flex justify-between py-1 border-b border-[#1D1D1B]/10">
                      <span>• {acc.name} ({acc.code}):</span>
                      <span className="font-mono font-bold">{calculateAccountSummary(acc).balanceAmount.toLocaleString()} ج.م</span>
                    </div>
                  ))}
                  {currentLiabilityAccounts.length === 0 && (
                    <span className="text-[#1D1D1B]/50 italic block py-1">- لا توجد التزامات متداولة قائمة -</span>
                  )}
                  <div className="flex justify-between font-bold pt-1 text-[#8A1F1D]">
                    <span>إجمالي الخصوم المتداولة:</span>
                    <span className="font-mono">{totalCurrentLiabilities.toLocaleString()} ج.م</span>
                  </div>
                </div>
              </div>

              {/* Long-term liabilities if any */}
              {longTermLiabilityAccounts.length > 0 && (
                <div>
                  <h5 className="font-extrabold text-xs text-[#1D1D1B] bg-[#F9F7F2] p-1.5 border-r-4 border-[#C4A484] mb-2">
                    3. الالتزامات طويلة الأجل:
                  </h5>
                  <div className="space-y-1 pr-3">
                    {longTermLiabilityAccounts.map(acc => (
                      <div key={acc.id} className="flex justify-between py-1 border-b border-[#1D1D1B]/10">
                        <span>• {acc.name}:</span>
                        <span className="font-mono font-bold">{calculateAccountSummary(acc).balanceAmount.toLocaleString()} ج.م</span>
                      </div>
                    ))}
                    <div className="flex justify-between font-bold pt-1">
                      <span>إجمالي الالتزامات طويلة الأجل:</span>
                      <span className="font-mono">{totalLongTermLiabilities.toLocaleString()} ج.م</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-[#1D1D1B] text-[#F9F7F2] p-3 flex justify-between font-extrabold text-sm border-t border-[#1D1D1B]">
              <span>مجموع الخصوم وحقوق الملكية:</span>
              <span className="font-mono text-[#C4A484] text-base">{grandTotalLiabilitiesAndEquity.toLocaleString()} ج.م</span>
            </div>
          </div>

        </div>
      )}

      {/* Balance Equilibrium Summary Banner */}
      <div className={`p-4 border-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-bold ${
        isPerfectBalance 
          ? 'bg-[#F4F8F4] border-emerald-800 text-[#1B4D2E]' 
          : 'bg-[#FDF3F2] border-rose-800 text-[#8A1F1D]'
      }`}>
        <div className="flex items-center gap-3">
          {isPerfectBalance ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-700 shrink-0" />
          ) : (
            <AlertTriangle className="w-6 h-6 text-rose-700 shrink-0" />
          )}
          <div>
            <span className="text-sm font-extrabold block">
              {isPerfectBalance 
                ? '✓ تم التحقق: الميزانية العمومية متوازنة تماماً وتتطابق مع المعادلة المحاسبية' 
                : '✕ تنبيه: الميزانية العمومية غير متوازنة! يوجد فارق بين الأصول والالتزامات'}
            </span>
            <span className="text-[11px] font-normal block mt-0.5 opacity-90">
              {isPerfectBalance 
                ? `الأصول (${grandTotalAssets.toLocaleString()} ج) = الالتزامات (${totalLiabilitiesOnly.toLocaleString()} ج) + حقوق الملكية (${netEndingEquity.toLocaleString()} ج)`
                : `مقدار الفرق: ${Math.abs(balanceDifference).toLocaleString()} ج.م. يرجى مراجعة قيود التسوية أو الحساب المعلق بميزان المراجعة.`}
            </span>
          </div>
        </div>

        <div className="text-left font-mono text-sm shrink-0 bg-[#FFFFFF] px-3 py-1.5 border border-current">
          الفارق: {balanceDifference.toLocaleString()} ج.م
        </div>
      </div>

    </div>
  );
};
