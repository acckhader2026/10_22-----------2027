import React, { useState } from 'react';
import { 
  Scale, ShieldAlert, Eye, EyeOff, CheckCircle2, 
  AlertTriangle, RefreshCw, PenTool, ArrowRight, ArrowLeft, 
  HelpCircle, Sparkles, Check, X, Calculator, Zap, Award
} from 'lucide-react';
import { Unit4SimulatedError, Unit4ErrorType } from './types';
import { PRESET_UNIT4_ERRORS } from './subsidiaryData';

interface PostingChallengeViewProps {
  onApplyCorrectingEntryToJournal?: (entry: {
    debitAccount: string;
    creditAccount: string;
    amount: number;
    description: string;
    date: string;
  }) => void;
  onNavigateToTrialBalance?: () => void;
  initialPostingMode?: 'auto' | 'manual';
  initialHideCorrectPosting?: boolean;
  onModeChange?: (mode: 'auto' | 'manual') => void;
  onHideCorrectPostingChange?: (hide: boolean) => void;
}

export const PostingChallengeView: React.FC<PostingChallengeViewProps> = ({
  onApplyCorrectingEntryToJournal,
  onNavigateToTrialBalance,
  initialPostingMode = 'manual',
  initialHideCorrectPosting = true,
  onModeChange,
  onHideCorrectPostingChange
}) => {
  // Mode: Auto vs Manual
  const [postingMode, setPostingMode] = useState<'auto' | 'manual'>(initialPostingMode);
  
  // Hide correct posting toggle (The requested feature)
  const [hideCorrectPosting, setHideCorrectPosting] = useState<boolean>(initialHideCorrectPosting);

  // Sync when props change
  React.useEffect(() => {
    if (initialPostingMode) setPostingMode(initialPostingMode);
  }, [initialPostingMode]);

  React.useEffect(() => {
    if (initialHideCorrectPosting !== undefined) setHideCorrectPosting(initialHideCorrectPosting);
  }, [initialHideCorrectPosting]);

  const handleToggleMode = (mode: 'auto' | 'manual') => {
    setPostingMode(mode);
    onModeChange?.(mode);
  };

  const handleToggleHide = (val: boolean) => {
    setHideCorrectPosting(val);
    onHideCorrectPostingChange?.(val);
  };

  // Active simulated error
  const [selectedErrorType, setSelectedErrorType] = useState<Unit4ErrorType>('reversed_posting');
  const [activeError, setActiveError] = useState<Unit4SimulatedError | null>(PRESET_UNIT4_ERRORS[0]);

  // Student manual attempt state for the active transaction
  const [studentDebitSide, setStudentDebitSide] = useState<'debit' | 'credit'>('credit'); // default simulating wrong side
  const [studentDebitAmount, setStudentDebitAmount] = useState<number | ''>(8000);
  const [studentCreditSide, setStudentCreditSide] = useState<'debit' | 'credit'>('credit');
  const [studentCreditAmount, setStudentCreditAmount] = useState<number | ''>(8000);

  // Correcting Entry Input Form state
  const [userCorrDebitAcc, setUserCorrDebitAcc] = useState('');
  const [userCorrCreditAcc, setUserCorrCreditAcc] = useState('');
  const [userCorrAmount, setUserCorrAmount] = useState<number | ''>('');
  const [correctionFeedback, setCorrectionFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const [isResolved, setIsResolved] = useState<boolean>(false);

  // Gamified student mastery score
  const [masteryScore, setMasteryScore] = useState<number>(85);

  // Handle switching error scenario
  const handleSelectScenario = (err: Unit4SimulatedError) => {
    setSelectedErrorType(err.type);
    setActiveError(err);
    setIsResolved(false);
    setCorrectionFeedback(null);
    setUserCorrDebitAcc('');
    setUserCorrCreditAcc('');
    setUserCorrAmount('');

    if (err.type === 'reversed_posting') {
      setStudentDebitSide('credit'); // wrong side
      setStudentDebitAmount(err.nominalAmount);
      setStudentCreditSide('credit');
      setStudentCreditAmount(err.nominalAmount);
    } else if (err.type === 'single_sided') {
      setStudentDebitSide('debit');
      setStudentDebitAmount(err.nominalAmount);
      setStudentCreditSide('credit');
      setStudentCreditAmount(0); // omitted
    } else if (err.type === 'transposition') {
      setStudentDebitSide('debit');
      setStudentDebitAmount(err.actualPostedAmount);
      setStudentCreditSide('credit');
      setStudentCreditAmount(err.nominalAmount);
    } else {
      setStudentDebitSide('debit');
      setStudentDebitAmount(err.nominalAmount);
      setStudentCreditSide('credit');
      setStudentCreditAmount(err.nominalAmount);
    }
  };

  // Check Student's Correcting Entry
  const handleVerifyCorrection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeError) return;

    const nominal = activeError.correctingEntry.amount;
    const debitMatches = userCorrDebitAcc.includes(activeError.correctingEntry.debitAccount) || 
      activeError.correctingEntry.debitAccount.includes(userCorrDebitAcc) ||
      (userCorrDebitAcc.includes('معلق') && activeError.correctingEntry.debitAccount.includes('معلق')) ||
      (userCorrDebitAcc.includes('مشتريات') && activeError.correctingEntry.debitAccount.includes('مشتريات')) ||
      (userCorrDebitAcc.includes('سيارات') && activeError.correctingEntry.debitAccount.includes('سيارات'));

    const creditMatches = userCorrCreditAcc.includes(activeError.correctingEntry.creditAccount) || 
      activeError.correctingEntry.creditAccount.includes(userCorrCreditAcc) ||
      (userCorrCreditAcc.includes('معلق') && activeError.correctingEntry.creditAccount.includes('معلق')) ||
      (userCorrCreditAcc.includes('مبيعات') && activeError.correctingEntry.creditAccount.includes('مبيعات')) ||
      (userCorrCreditAcc.includes('إيجار') && activeError.correctingEntry.creditAccount.includes('إيجار')) ||
      (userCorrCreditAcc.includes('صيانة') && activeError.correctingEntry.creditAccount.includes('صيانة'));

    const amountMatches = Number(userCorrAmount) === nominal;

    if (debitMatches && creditMatches && amountMatches) {
      setIsResolved(true);
      setMasteryScore(prev => Math.min(100, prev + 15));
      setCorrectionFeedback({
        success: true,
        message: `ممتاز! صياغة القيد التصحيحي سليمة تماماً بمبلغ ${nominal.toLocaleString()} ج. تم تصفير الحساب المعلق وعاد ميزان المراجعة إلى التوازن الحسابي 100%.`
      });

      if (onApplyCorrectingEntryToJournal) {
        onApplyCorrectingEntryToJournal({
          description: `قيد تصحيح خطأ: ${activeError.title}`,
          debitAccount: activeError.correctingEntry.debitAccount,
          creditAccount: activeError.correctingEntry.creditAccount,
          amount: nominal,
          date: '2026/02/28'
        });
      }
    } else {
      setCorrectionFeedback({
        success: false,
        message: `القيد غير دقيق. المبلغ الصحيح المطلوب هو ${nominal.toLocaleString()} ج. راجع الحساب المدين والدائن في قاعدة التصحيح أسفله.`
      });
    }
  };

  // Apply model correction directly
  const handleApplyModelCorrection = () => {
    if (!activeError) return;
    setUserCorrDebitAcc(activeError.correctingEntry.debitAccount);
    setUserCorrCreditAcc(activeError.correctingEntry.creditAccount);
    setUserCorrAmount(activeError.correctingEntry.amount);
    setIsResolved(true);
    setCorrectionFeedback({
      success: true,
      message: `تم تطبيق قيد التصحيح النموذجي بنجاح: ${activeError.correctingEntry.explanation}`
    });

    if (onApplyCorrectingEntryToJournal) {
      onApplyCorrectingEntryToJournal({
        description: `قيد تصحيح خطأ: ${activeError.title}`,
        debitAccount: activeError.correctingEntry.debitAccount,
        creditAccount: activeError.correctingEntry.creditAccount,
        amount: activeError.correctingEntry.amount,
        date: '2026/02/28'
      });
    }
  };

  // Reset error
  const handleReset = () => {
    setIsResolved(false);
    setCorrectionFeedback(null);
    setUserCorrDebitAcc('');
    setUserCorrCreditAcc('');
    setUserCorrAmount('');
    if (activeError) {
      handleSelectScenario(activeError);
    }
  };

  return (
    <div className="space-y-6 font-serif" dir="rtl">
      
      {/* Top Controller Bar: Auto vs Manual + Hide Correct Posting Button */}
      <div className="bg-[#FFFFFF] border-2 border-[#1D1D1B] p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#1D1D1B]/15 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#1D1D1B] text-[#C4A484] text-xs font-bold px-2.5 py-0.5">
                مختبر الترحيل وأخطاء الوحدة الرابعة
              </span>
              <span className="text-xs text-[#1D1D1B]/70 font-bold hidden sm:inline">
                الترحيل اليدوي بالتوازي مع الإلكتروني + محاكاة الأخطاء
              </span>
            </div>
            <h3 className="text-xl font-extrabold text-[#1D1D1B] mt-1">
              منظومة الترحيل التنافسي وكاشف أخطاء ميزان المراجعة
            </h3>
            <p className="text-xs text-[#1D1D1B]/70 mt-0.5 max-w-2xl">
              تتيح للطالب الترحيل بنفسه واختبار قدرته على كشف وتصحيح أخطاء الترحيل الشائعة (النقل العكسي، الجانب الواحد، الأرقام المقلوبة، وأخطاء التوجيه).
            </p>
          </div>

          {/* Gamified Mastery Badge */}
          <div className="flex items-center gap-3 bg-[#F9F7F2] border border-[#1D1D1B]/20 p-2.5 shrink-0">
            <Award className="w-6 h-6 text-[#C4A484]" />
            <div>
              <span className="text-[10px] text-[#1D1D1B]/70 block font-bold">مؤشر كفاءة الطالب في الترحيل:</span>
              <span className="font-mono font-extrabold text-sm text-[#1B4D2E]">{masteryScore}% (مستوى متقدم)</span>
            </div>
          </div>
        </div>

        {/* Dual Mode Switch & HIDE CORRECT POSTING BUTTON */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#1D1D1B]">نمط الترحيل الحالي:</span>
            <div className="inline-flex border border-[#1D1D1B]/20 p-0.5 bg-[#F9F7F2]">
              <button
                onClick={() => setPostingMode('manual')}
                className={`px-3 py-1 text-xs font-bold transition cursor-pointer ${
                  postingMode === 'manual'
                    ? 'bg-[#1D1D1B] text-[#F9F7F2] shadow-xs'
                    : 'text-[#1D1D1B] hover:bg-[#FFFFFF]'
                }`}
              >
                الترحيل اليدوي التفاعلي (تحدي الطالب)
              </button>
              <button
                onClick={() => {
                  setPostingMode('auto');
                  setHideCorrectPosting(false);
                }}
                className={`px-3 py-1 text-xs font-bold transition cursor-pointer ${
                  postingMode === 'auto'
                    ? 'bg-[#1D1D1B] text-[#F9F7F2] shadow-xs'
                    : 'text-[#1D1D1B] hover:bg-[#FFFFFF]'
                }`}
              >
                الترحيل الإلكتروني الفوري (آلي 100%)
              </button>
            </div>
          </div>

          {/* Special Toggle Button: Hide Correct Posting to Simulate Errors */}
          <button
            onClick={() => setHideCorrectPosting(!hideCorrectPosting)}
            className={`px-4 py-2 text-xs font-bold transition flex items-center gap-2 cursor-pointer border ${
              hideCorrectPosting 
                ? 'bg-rose-900 text-[#FFFFFF] border-rose-950 hover:bg-rose-950 shadow-xs'
                : 'bg-emerald-800 text-[#FFFFFF] border-emerald-900 hover:bg-emerald-900'
            }`}
          >
            {hideCorrectPosting ? (
              <>
                <EyeOff className="w-4 h-4 text-rose-300" />
                <span>الترحيل النموذجي مخفي الآن (وضع محاكاة أخطاء الوحدة الرابعة مفعل)</span>
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 text-emerald-300" />
                <span>إخفاء الترحيل الصحيح لمحاكاة أخطاء الترحيل (الوحدة الرابعة)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Selectable Error Scenarios (From Unit 4 syllabus) */}
      <div className="bg-[#FFFFFF] border border-[#1D1D1B]/15 p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#1D1D1B] flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-[#C4A484]" />
            <span>اختر نمط خطأ ترحيل للمحاكاة واختبار أثره على ميزان المراجعة والحساب المعلق:</span>
          </span>
          <span className="text-[11px] text-[#1D1D1B]/60 font-mono">
            {PRESET_UNIT4_ERRORS.length} سيناريوهات وزارية
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {PRESET_UNIT4_ERRORS.map((err) => (
            <button
              key={err.type}
              onClick={() => handleSelectScenario(err)}
              className={`p-3 text-right border transition flex flex-col justify-between gap-2 cursor-pointer ${
                selectedErrorType === err.type 
                  ? 'border-[#1D1D1B] bg-[#F9F7F2] ring-2 ring-[#1D1D1B]'
                  : 'border-[#1D1D1B]/15 bg-[#FFFFFF] hover:border-[#1D1D1B]/40'
              }`}
            >
              <div className="space-y-1">
                <span className="text-[10px] font-bold px-1.5 py-0.5 bg-[#1D1D1B]/10 text-[#1D1D1B] inline-block">
                  {err.affectsBalance ? 'مؤثر على التوازن' : 'غير مؤثر على التوازن'}
                </span>
                <div className="font-bold text-xs text-[#1D1D1B] leading-snug">{err.title}</div>
              </div>
              <div className="text-[10px] text-[#1D1D1B]/70 font-mono">
                {err.affectsBalance ? `الفرق: ${err.difference.toLocaleString()} ج` : 'الميزان متوازن حسابياً'}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Active Error Diagnosis & Sandbox Card */}
      {activeError && (
        <div className="bg-[#FFFFFF] border-2 border-[#1D1D1B] p-5 sm:p-6 shadow-xs space-y-5">
          
          {/* Card Title & Problem Statement */}
          <div className="border-b border-[#1D1D1B]/15 pb-4 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="font-extrabold text-base text-[#1D1D1B] flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-800" />
                <span>{activeError.title}</span>
              </h4>
              <span className={`text-xs font-bold px-2.5 py-1 ${
                isResolved ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-rose-100 text-rose-900 border border-rose-300'
              }`}>
                {isResolved ? '✓ تم تصحيح الخطأ بنجاح' : '⚠️ الخطأ قائم حالياً في الدفاتر'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#1D1D1B]/80 leading-relaxed bg-[#FDF3F2] p-3 border border-rose-200">
              <strong>بيان العملية:</strong> {activeError.description}
            </p>
          </div>

          {/* Two-Column Comparison: How it was posted vs How it should be posted */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Box 1: Actual Posting (WithError) */}
            <div className="border border-rose-300 bg-rose-50/40 p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-rose-200 pb-2">
                <span className="font-bold text-xs text-rose-900">
                  1. ما تم ترحيله فعلياً بالدفاتر (الترحيل الخاطئ):
                </span>
                <span className="text-[10px] bg-rose-200 text-rose-900 font-bold px-1.5 py-0.5">واقعي</span>
              </div>
              
              <div className="text-xs space-y-2 font-mono">
                <div className="p-2 bg-white border border-rose-200">
                  <span className="font-bold text-[#1D1D1B] block font-serif text-[11px]">الحساب المتأثر: {activeError.affectedAccountName}</span>
                  <div className="flex justify-between text-xs mt-1">
                    <span>الجانب الذي رُحل إليه:</span>
                    <strong className="text-rose-800 font-bold">
                      {activeError.wrongSide === 'credit' ? 'الجانب الدائن (له)' : activeError.wrongSide === 'debit' ? 'الجانب المدين (منه)' : 'لم يُرحل (أُغفل)'}
                    </strong>
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span>المبلغ المسجل في الأستاذ:</span>
                    <strong className="text-rose-800 font-bold">{activeError.actualPostedAmount.toLocaleString()} ج</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Box 2: Correct Model Posting */}
            <div className="border border-emerald-300 bg-emerald-50/40 p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                <span className="font-bold text-xs text-emerald-900">
                  2. الترحيل النظامي الصحيح الواجب إثباته:
                </span>
                <span className="text-[10px] bg-emerald-200 text-emerald-900 font-bold px-1.5 py-0.5">النموذجي</span>
              </div>

              {hideCorrectPosting ? (
                <div className="p-4 bg-white border border-dashed border-emerald-300 text-center space-y-2">
                  <EyeOff className="w-6 h-6 text-emerald-700 mx-auto" />
                  <div className="text-xs font-bold text-emerald-900">
                    تم إخفاء الترحيل الصحيح لتحفيز تفكير الطالب
                  </div>
                  <p className="text-[11px] text-[#1D1D1B]/70">
                    استخدم عقلك المحاسبي لمعرفة أين يجب أن يرحل القيد، وكيف يؤثر على ميزان المراجعة.
                  </p>
                  <button
                    onClick={() => setHideCorrectPosting(false)}
                    className="text-xs text-emerald-800 underline font-bold cursor-pointer hover:text-emerald-950"
                  >
                    كشف الترحيل النموذجي مؤقتاً
                  </button>
                </div>
              ) : (
                <div className="text-xs space-y-2 font-mono">
                  <div className="p-2 bg-white border border-emerald-200">
                    <span className="font-bold text-[#1D1D1B] block font-serif text-[11px]">الحساب المستحق: {activeError.affectedAccountName}</span>
                    <div className="flex justify-between text-xs mt-1">
                      <span>الجانب الصحيح الواجب:</span>
                      <strong className="text-emerald-800 font-bold">
                        {activeError.correctSide === 'debit' ? 'الجانب المدين (منه)' : 'الجانب الدائن (له)'}
                      </strong>
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                      <span>المبلغ الصحيح الأصلي:</span>
                      <strong className="text-emerald-800 font-bold">{activeError.nominalAmount.toLocaleString()} ج</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Analytical Impact on Trial Balance & Suspense Account */}
          <div className="bg-[#F9F7F2] border border-[#1D1D1B]/20 p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-[#1D1D1B]/10 pb-2">
              <h5 className="font-bold text-xs sm:text-sm text-[#1D1D1B] flex items-center gap-2">
                <Calculator className="w-4 h-4 text-[#C4A484]" />
                <span>الأثر الحسابي اللحظي على ميزان المراجعة والحساب المعلق (الوحدة 4):</span>
              </h5>
              <span className="text-xs font-mono font-bold text-[#1D1D1B]">
                {activeError.affectsBalance ? `الفارق العددي: ${activeError.difference.toLocaleString()} ج` : 'الميزان متطابق عددياً'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="bg-white p-3 border border-[#1D1D1B]/10">
                <span className="text-[#1D1D1B]/70 block text-[11px]">قاعدة الفحص والتشخيص:</span>
                <span className="font-bold text-[#1D1D1B] block mt-0.5 leading-snug">
                  {activeError.type === 'reversed_posting' 
                    ? 'الفرق زوجي (يقبل القسمة على 2) = ترحيل عكسي' 
                    : activeError.type === 'transposition' 
                    ? 'الفرق يقبل القسمة على 9 = خطأ تبديل خانات' 
                    : activeError.type === 'single_sided' 
                    ? 'الفرق يساوي مبلغ أحد الأطراف = إغفال ترحيل طرف' 
                    : 'خطأ نوعي خفي لا يؤثر على التوازن الرياضي'}
                </span>
              </div>

              <div className="bg-white p-3 border border-[#1D1D1B]/10">
                <span className="text-[#1D1D1B]/70 block text-[11px]">موقع الحساب المعلق (Suspense):</span>
                <span className="font-bold text-rose-900 block mt-0.5">
                  {isResolved 
                    ? 'تم إقفاله (الرصيد = 0.00 ج ✓)' 
                    : activeError.affectsBalance 
                    ? `يُدرج بقيمة ${activeError.difference.toLocaleString()} ج في الجانب الأقل` 
                    : 'لا يظهر (لأن الميزان متوازن شكلياً)'}
                </span>
              </div>

              <div className="bg-white p-3 border border-[#1D1D1B]/10">
                <span className="text-[#1D1D1B]/70 block text-[11px]">سند القاعدة في كتاب الوزارة:</span>
                <span className="font-semibold text-[#1D1D1B] block mt-0.5 text-[11px] leading-snug">
                  {activeError.ruleCitation}
                </span>
              </div>
            </div>

            <p className="text-xs text-[#1D1D1B]/80 leading-relaxed bg-white p-2.5 border border-[#1D1D1B]/10">
              <strong>التفسير التحليلي:</strong> {activeError.explanation}
            </p>
          </div>

          {/* Interactive Correcting Journal Entry Form (الطالب يصيغ قيد التصحيح) */}
          <div className="border-2 border-[#1D1D1B] p-5 bg-white space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1D1D1B]/10 pb-2">
              <div>
                <h5 className="font-extrabold text-sm text-[#1D1D1B] flex items-center gap-2">
                  <PenTool className="w-4 h-4 text-[#C4A484]" />
                  <span>صياغة قيد اليومية التصحيحي (Correcting Journal Entry)</span>
                </h5>
                <span className="text-xs text-[#1D1D1B]/60">
                  اكتب قيد التصحيح لإلغاء الخطأ وإثبات الصحيح وتصفير الحساب المعلق:
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleApplyModelCorrection}
                  className="px-3 py-1 bg-[#F9F7F2] hover:bg-[#EFECE6] text-[#1D1D1B] border border-[#1D1D1B]/20 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#C4A484]" />
                  <span>تطبيق الحل النموذجي التلقائي</span>
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-2.5 py-1 text-xs text-[#1D1D1B]/60 hover:text-[#1D1D1B] flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>إعادة ضبط</span>
                </button>
              </div>
            </div>

            {/* Feedback alert */}
            {correctionFeedback && (
              <div className={`p-3 text-xs flex items-center gap-2 font-bold border ${
                correctionFeedback.success 
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-300' 
                  : 'bg-rose-50 text-rose-900 border-rose-300'
              }`}>
                {correctionFeedback.success ? <CheckCircle2 className="w-4 h-4 text-emerald-700" /> : <AlertTriangle className="w-4 h-4 text-rose-700" />}
                <span>{correctionFeedback.message}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleVerifyCorrection} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-[#1B4D2E] mb-1">الطرف المدين (من حـ/):</label>
                  <input
                    type="text"
                    value={userCorrDebitAcc}
                    onChange={e => setUserCorrDebitAcc(e.target.value)}
                    placeholder={activeError.correctingEntry.debitAccount}
                    className="w-full p-2 bg-[#F4F8F4] border border-emerald-800/30 text-xs font-bold text-[#1B4D2E]"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#8A1F1D] mb-1">الطرف الدائن (إلى حـ/):</label>
                  <input
                    type="text"
                    value={userCorrCreditAcc}
                    onChange={e => setUserCorrCreditAcc(e.target.value)}
                    placeholder={activeError.correctingEntry.creditAccount}
                    className="w-full p-2 bg-[#FDF3F2] border border-rose-800/30 text-xs font-bold text-[#8A1F1D]"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#1D1D1B] mb-1">المبلغ المطلوب تسويته (جنيه):</label>
                  <input
                    type="number"
                    value={userCorrAmount}
                    onChange={e => setUserCorrAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder={activeError.correctingEntry.amount.toString()}
                    className="w-full p-2 bg-[#F9F7F2] border border-[#1D1D1B]/20 font-mono text-sm font-bold text-[#1D1D1B]"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="text-[11px] text-[#1D1D1B]/70">
                  المطلوب: إقفال الحساب المعلق ({activeError.difference.toLocaleString()} ج) إن وجد وإعادة التوازن.
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#1D1D1B] hover:bg-[#333330] text-[#F9F7F2] font-bold text-xs transition flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <Check className="w-4 h-4 text-[#C4A484]" />
                  <span>اعتماد قيد التصحيح وتصفير المعلق</span>
                </button>
              </div>
            </form>
          </div>

        </div>
      )}

    </div>
  );
};
