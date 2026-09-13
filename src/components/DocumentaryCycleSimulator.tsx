import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  ArrowLeft, 
  RotateCcw, 
  ExternalLink, 
  Eye, 
  HelpCircle, 
  ShieldCheck, 
  Building2, 
  Calendar, 
  Hash, 
  DollarSign, 
  Award, 
  Scale, 
  BookOpen, 
  Sparkles,
  Layers,
  FileCheck2,
  Receipt,
  CreditCard,
  Package,
  Landmark,
  AlertCircle
} from 'lucide-react';
import { DOCUMENTARY_SCENARIOS, DOCUMENT_TYPE_METADATA } from '../data/documentaryCycleData';
import { DocumentaryScenario, SourceDocumentType } from '../types';
import { apiClient } from '../api/apiClient';

interface DocumentaryCycleSimulatorProps {
  onNavigateToJournal?: (seedData: {
    description: string;
    date: string;
    debitAccount: string;
    creditAccount: string;
    amount: number;
    reference: string;
  }) => void;
}

export const DocumentaryCycleSimulator: React.FC<DocumentaryCycleSimulatorProps> = ({
  onNavigateToJournal
}) => {
  // Scenario state
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState<number>(0);
  const scenario: DocumentaryScenario = DOCUMENTARY_SCENARIOS[currentScenarioIndex];

  // Steps: 1: Event & Doc selection, 2: Document Inspection & Extraction, 3: Preliminary Analysis, 4: Journal Bridge
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Document selection
  const [selectedDocType, setSelectedDocType] = useState<SourceDocumentType | null>(null);
  const [docFeedbackShown, setDocFeedbackShown] = useState<boolean>(false);

  // Step 2: Extraction answers { [fieldId]: string }
  const [extractionAnswers, setExtractionAnswers] = useState<Record<string, string>>({});
  const [extractionChecked, setExtractionChecked] = useState<boolean>(false);

  // Step 3: Preliminary analysis answers
  const [selectedCat1, setSelectedCat1] = useState<string>('');
  const [selectedImpact1, setSelectedImpact1] = useState<string>('');
  const [selectedCat2, setSelectedCat2] = useState<string>('');
  const [selectedImpact2, setSelectedImpact2] = useState<string>('');
  const [analysisChecked, setAnalysisChecked] = useState<boolean>(false);

  // Completion and scoring
  const [completedScenarios, setCompletedScenarios] = useState<Record<string, number>>({});
  const [persistingAttempt, setPersistingAttempt] = useState<boolean>(false);

  // Reset states when changing scenarios
  const loadScenario = (index: number) => {
    setCurrentScenarioIndex(index);
    setActiveStep(1);
    setSelectedDocType(null);
    setDocFeedbackShown(false);
    setExtractionAnswers({});
    setExtractionChecked(false);
    setSelectedCat1('');
    setSelectedImpact1('');
    setSelectedCat2('');
    setSelectedImpact2('');
    setAnalysisChecked(false);
  };

  // Step 1 check
  const handleSelectDocument = (type: SourceDocumentType) => {
    setSelectedDocType(type);
    setDocFeedbackShown(true);
  };

  // Step 2 extraction selection
  const handleSelectExtractionField = (fieldId: string, value: string) => {
    setExtractionAnswers(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const checkExtractions = () => {
    setExtractionChecked(true);
  };

  // Step 3 check
  const checkPreliminaryAnalysis = () => {
    setAnalysisChecked(true);
  };

  // Calculate score for current scenario
  const calculateScenarioScore = (): number => {
    let score = 0;
    // Step 1: 30 pts
    if (selectedDocType === scenario.correctDocumentType) {
      score += 30;
    }
    // Step 2: 30 pts (7.5 per field for 4 fields)
    let extractionCorrect = 0;
    scenario.extractionFields.forEach(f => {
      if (extractionAnswers[f.id] === f.expectedValue) {
        extractionCorrect += 1;
      }
    });
    score += Math.round((extractionCorrect / scenario.extractionFields.length) * 30);

    // Step 3: 40 pts (10 pts each for cat1, impact1, cat2, impact2)
    if (selectedCat1 === scenario.preliminaryAnalysis.account1.category) score += 10;
    if (selectedImpact1 === scenario.preliminaryAnalysis.account1.impact) score += 10;
    if (selectedCat2 === scenario.preliminaryAnalysis.account2.category) score += 10;
    if (selectedImpact2 === scenario.preliminaryAnalysis.account2.impact) score += 10;

    return Math.min(100, score);
  };

  // Record attempt to backend or storage
  const handleFinishScenario = async () => {
    const finalScore = calculateScenarioScore();
    setCompletedScenarios(prev => ({
      ...prev,
      [scenario.id]: Math.max(prev[scenario.id] || 0, finalScore)
    }));

    setPersistingAttempt(true);
    try {
      await apiClient.request('/api/attempts/record', {
        method: 'POST',
        body: JSON.stringify({
          questionId: `eb-doc-${scenario.id}`,
          isCorrect: finalScore >= 70,
          score: finalScore,
          selectedAnswer: selectedDocType,
          type: 'DOCUMENT_ANALYSIS',
          learningObjectiveId: scenario.learningObjectiveId,
          conceptId: 'concept-doc-cycle',
          meta: {
            scenarioId: scenario.id,
            documentType: selectedDocType,
            extractionAnswers
          }
        })
      });
    } catch {
      // Fallback locally if offline
      try {
        const localHistory = JSON.parse(localStorage.getItem('eb_doc_cycle_history') || '[]');
        localHistory.push({
          scenarioId: scenario.id,
          score: finalScore,
          timestamp: new Date().toISOString()
        });
        localStorage.setItem('eb_doc_cycle_history', JSON.stringify(localHistory));
      } catch (e) {
        console.warn('Could not save attempt locally', e);
      }
    } finally {
      setPersistingAttempt(false);
    }
  };

  useEffect(() => {
    if (activeStep === 4) {
      handleFinishScenario();
    }
  }, [activeStep]);

  // Document Icon selector helper
  const getDocIcon = (type: SourceDocumentType) => {
    switch (type) {
      case 'sales_invoice_credit':
      case 'sales_invoice_cash':
        return <FileText className="w-5 h-5" />;
      case 'purchase_invoice_credit':
      case 'purchase_invoice_cash':
        return <FileCheck2 className="w-5 h-5" />;
      case 'receipt_voucher':
        return <Receipt className="w-5 h-5" />;
      case 'payment_voucher':
        return <DollarSign className="w-5 h-5" />;
      case 'bank_cheque':
        return <CreditCard className="w-5 h-5" />;
      case 'warehouse_receipt':
      case 'warehouse_issue':
        return <Package className="w-5 h-5" />;
      case 'bank_reconciliation':
        return <Landmark className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const isCurrentDocCorrect = selectedDocType === scenario.correctDocumentType;

  return (
    <div id="documentary-cycle-simulator" className="w-full max-w-6xl mx-auto p-4 sm:p-6 font-serif text-[#1D1D1B]" dir="rtl">
      
      {/* Header Banner */}
      <div className="bg-[#1D1D1B] text-[#F9F7F2] p-5 sm:p-6 mb-6 shadow-md border-b-4 border-[#C4A484]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="bg-[#B45309] text-white text-xs font-bold px-2.5 py-1 tracking-wide flex items-center gap-1.5 shadow-xs">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                محتوى إثرائي تمهيدي — خارج نطاق الكتاب المقرر
              </span>
              <span className="bg-[#1B4D2E] text-white text-xs px-2.5 py-1 font-mono">
                LO-ENRICH-DOC.1 / LO-ENRICH-DOC.2 / LO-ENRICH-DOC.3
              </span>
              <span className="border border-[#F9F7F2]/30 text-xs px-2.5 py-1 text-[#F9F7F2]/80">
                الدورة المستندية ومصادر القيد
              </span>
            </div>
            <div className="text-xs text-[#FBBF24] font-medium mb-1">
              يهدف إلى توثيق الحدث الاقتصادي بمستنداته قبل صياغة القيد؛ غير مطلوب في امتحان البكالوريا الرسمي.
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              محاكي الدورة المستندية ومصادر القيد (Documentary Cycle Simulator)
            </h1>
            <p className="text-sm text-[#F9F7F2]/80 mt-1 max-w-3xl">
              تدريب تفاعلي كامل وفق المعايير المحاسبية: من الحدث الاقتصادي ← اختيار المستند المؤيد ← استخراج البيانات ← التحليل المحاسبي التمهيدي للأثر ← الربط المباشر بالقيد اليومي.
            </p>
          </div>

          {/* Scenarios Tracker Badge */}
          <div className="bg-[#2A2A28] border border-[#F9F7F2]/20 p-3 text-center min-w-[170px]">
            <div className="text-xs text-[#F9F7F2]/70 mb-1">السيناريوهات المنجزة</div>
            <div className="text-2xl font-bold text-[#C4A484]">
              {Object.keys(completedScenarios).length} / {DOCUMENTARY_SCENARIOS.length}
            </div>
            <div className="text-[11px] text-[#F9F7F2]/60 mt-0.5">
              نسبة الإتقان: {Object.keys(completedScenarios).length > 0 
                ? Math.round(Object.values(completedScenarios).reduce((a, b) => a + b, 0) / Object.keys(completedScenarios).length) 
                : 0}%
            </div>
          </div>
        </div>

        {/* Scenario Carousel / Quick Switcher */}
        <div className="mt-5 pt-4 border-t border-[#F9F7F2]/15 flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs text-[#F9F7F2]/60 shrink-0 font-sans ml-2">الحالات التطبيقية:</span>
          {DOCUMENTARY_SCENARIOS.map((sc, idx) => {
            const isDone = completedScenarios[sc.id] !== undefined;
            const isCurrent = idx === currentScenarioIndex;
            return (
              <button
                key={sc.id}
                id={`btn-select-scenario-${idx + 1}`}
                onClick={() => loadScenario(idx)}
                className={`px-3 py-1.5 text-xs font-sans font-medium transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  isCurrent
                    ? 'bg-[#C4A484] text-[#1D1D1B] font-bold shadow-xs'
                    : isDone
                    ? 'bg-[#1B4D2E]/80 text-[#F9F7F2] hover:bg-[#1B4D2E]'
                    : 'bg-[#1D1D1B] border border-[#F9F7F2]/25 text-[#F9F7F2]/80 hover:bg-[#2A2A28]'
                }`}
              >
                <span>حالة {sc.scenarioNumber}</span>
                {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-[#C4A484]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4-Step Progress Flow Stepper */}
      <div className="bg-[#F9F7F2] border-2 border-[#1D1D1B] p-3 sm:p-4 mb-6 shadow-xs">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center text-xs sm:text-sm font-sans">
          
          {/* Step 1 */}
          <button
            id="tab-step-1"
            onClick={() => setActiveStep(1)}
            className={`p-2 sm:p-3 border transition flex flex-col items-center gap-1 cursor-pointer ${
              activeStep === 1
                ? 'bg-[#1D1D1B] text-[#F9F7F2] border-[#1D1D1B] font-bold'
                : selectedDocType
                ? 'bg-[#F9F7F2] border-[#1B4D2E] text-[#1B4D2E] font-semibold'
                : 'bg-[#F9F7F2] border-[#1D1D1B]/20 text-[#1D1D1B]/60'
            }`}
          >
            <div className="flex items-center gap-1">
              <span>١. اختيار المستند المؤيد</span>
              {selectedDocType && <CheckCircle2 className="w-3.5 h-3.5 text-[#1B4D2E]" />}
            </div>
            <span className="text-[10px] opacity-80">تحليل الحدث الاقتصادي</span>
          </button>

          {/* Step 2 */}
          <button
            id="tab-step-2"
            onClick={() => {
              if (selectedDocType) setActiveStep(2);
            }}
            disabled={!selectedDocType}
            className={`p-2 sm:p-3 border transition flex flex-col items-center gap-1 ${
              !selectedDocType
                ? 'opacity-40 cursor-not-allowed bg-gray-100 border-gray-300'
                : activeStep === 2
                ? 'bg-[#1D1D1B] text-[#F9F7F2] border-[#1D1D1B] font-bold cursor-pointer'
                : extractionChecked
                ? 'bg-[#F9F7F2] border-[#1B4D2E] text-[#1B4D2E] font-semibold cursor-pointer'
                : 'bg-[#F9F7F2] border-[#1D1D1B]/20 text-[#1D1D1B]/60 cursor-pointer'
            }`}
          >
            <div className="flex items-center gap-1">
              <span>٢. فحص المستند واستخراج البيانات</span>
              {extractionChecked && <CheckCircle2 className="w-3.5 h-3.5 text-[#1B4D2E]" />}
            </div>
            <span className="text-[10px] opacity-80">قراءة وتدقيق المستند</span>
          </button>

          {/* Step 3 */}
          <button
            id="tab-step-3"
            onClick={() => {
              if (extractionChecked) setActiveStep(3);
            }}
            disabled={!extractionChecked}
            className={`p-2 sm:p-3 border transition flex flex-col items-center gap-1 ${
              !extractionChecked
                ? 'opacity-40 cursor-not-allowed bg-gray-100 border-gray-300'
                : activeStep === 3
                ? 'bg-[#1D1D1B] text-[#F9F7F2] border-[#1D1D1B] font-bold cursor-pointer'
                : analysisChecked
                ? 'bg-[#F9F7F2] border-[#1B4D2E] text-[#1B4D2E] font-semibold cursor-pointer'
                : 'bg-[#F9F7F2] border-[#1D1D1B]/20 text-[#1D1D1B]/60 cursor-pointer'
            }`}
          >
            <div className="flex items-center gap-1">
              <span>٣. التحليل المحاسبي التمهيدي</span>
              {analysisChecked && <CheckCircle2 className="w-3.5 h-3.5 text-[#1B4D2E]" />}
            </div>
            <span className="text-[10px] opacity-80">تحديد الحسابين وأثرهما</span>
          </button>

          {/* Step 4 */}
          <button
            id="tab-step-4"
            onClick={() => {
              if (analysisChecked) setActiveStep(4);
            }}
            disabled={!analysisChecked}
            className={`p-2 sm:p-3 border transition flex flex-col items-center gap-1 ${
              !analysisChecked
                ? 'opacity-40 cursor-not-allowed bg-gray-100 border-gray-300'
                : activeStep === 4
                ? 'bg-[#1D1D1B] text-[#F9F7F2] border-[#1D1D1B] font-bold cursor-pointer'
                : 'bg-[#F9F7F2] border-[#1D1D1B]/20 text-[#1D1D1B]/60 cursor-pointer'
            }`}
          >
            <div className="flex items-center gap-1">
              <span>٤. الربط بالقيد المحاسبي</span>
              <Sparkles className="w-3.5 h-3.5 text-[#C4A484]" />
            </div>
            <span className="text-[10px] opacity-80">صياغة القيد والترحيل</span>
          </button>

        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="bg-[#F9F7F2] border-2 border-[#1D1D1B] p-5 sm:p-8 shadow-md min-h-[460px]">
        
        {/* ============================================================ */}
        {/* STEP 1: ECONOMIC EVENT & DOCUMENT CANDIDATES                 */}
        {/* ============================================================ */}
        {activeStep === 1 && (
          <div className="animate-in fade-in duration-200">
            {/* Event Scenario Box */}
            <div className="bg-[#F2EFE9] border-r-4 border-[#C4A484] p-4 sm:p-5 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#8A1F1D] tracking-wide">
                  الحدث الاقتصادي الواقعي #{scenario.scenarioNumber}:
                </span>
                <span className="text-xs bg-[#1D1D1B] text-[#F9F7F2] px-2 py-0.5">
                  المستوى: {scenario.difficulty === 'basic' ? 'مبتدئ' : scenario.difficulty === 'intermediate' ? 'متوسط' : 'متقدم'}
                </span>
              </div>
              <p className="text-base sm:text-lg font-bold text-[#1D1D1B] leading-relaxed">
                {scenario.economicEvent}
              </p>
              <div className="mt-3 text-xs text-[#1D1D1B]/70 flex items-center gap-1.5 pt-2 border-t border-[#1D1D1B]/15">
                <ShieldCheck className="w-4 h-4 text-[#1B4D2E]" />
                <span><strong>السياق المهني الرقابي:</strong> {scenario.realWorldContext}</span>
              </div>
            </div>

            {/* Instruction Prompt */}
            <div className="mb-4">
              <h3 className="text-base font-bold text-[#1D1D1B] flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#8A1F1D]" />
                <span>المطلوب: ما هو المستند المؤيد الرسمي الواجب تحريره أو اعتماده لإثبات هذه الواقعة؟</span>
              </h3>
              <p className="text-xs text-[#1D1D1B]/75 mt-0.5">
                اختر المستند الصحيح من بين البدائل المتاحة أدناه لدراسة مبرراته الرقابية والقانونية:
              </p>
            </div>

            {/* Candidate Options Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {scenario.candidateOptions.map((opt, idx) => {
                const isSelected = selectedDocType === opt.type;
                return (
                  <div
                    key={opt.type}
                    id={`card-candidate-doc-${idx}`}
                    onClick={() => handleSelectDocument(opt.type)}
                    className={`p-4 border-2 transition cursor-pointer text-right flex flex-col justify-between ${
                      isSelected
                        ? opt.isCorrect
                          ? 'bg-[#1B4D2E]/10 border-[#1B4D2E] shadow-sm'
                          : 'bg-[#8A1F1D]/10 border-[#8A1F1D] shadow-sm'
                        : 'bg-white border-[#1D1D1B]/25 hover:border-[#1D1D1B] hover:shadow-xs'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded-none ${isSelected ? 'bg-[#1D1D1B] text-[#F9F7F2]' : 'bg-[#F2EFE9] text-[#1D1D1B]'}`}>
                            {getDocIcon(opt.type)}
                          </div>
                          <h4 className="font-bold text-sm sm:text-base text-[#1D1D1B]">
                            {opt.titleAr}
                          </h4>
                        </div>
                        <span className="text-[11px] bg-[#F2EFE9] text-[#1D1D1B]/70 border border-[#1D1D1B]/20 px-2 py-0.5">
                          {opt.categoryBadge}
                        </span>
                      </div>

                      {/* Brief helper */}
                      <p className="text-xs text-[#1D1D1B]/75 mt-1">
                        {DOCUMENT_TYPE_METADATA[opt.type]?.description}
                      </p>
                    </div>

                    {/* Feedback when selected */}
                    {isSelected && docFeedbackShown && (
                      <div className={`mt-3 pt-3 border-t text-xs leading-relaxed ${
                        opt.isCorrect
                          ? 'border-[#1B4D2E]/30 text-[#1B4D2E] font-medium'
                          : 'border-[#8A1F1D]/30 text-[#8A1F1D]'
                      }`}>
                        <div className="flex items-start gap-1.5">
                          {opt.isCorrect ? (
                            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-[#1B4D2E]" />
                          ) : (
                            <XCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#8A1F1D]" />
                          )}
                          <span>{opt.explanation}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Navigation / Next Button */}
            <div className="flex items-center justify-between pt-4 border-t border-[#1D1D1B]/20">
              <div className="text-xs text-[#1D1D1B]/70">
                {selectedDocType ? (
                  isCurrentDocCorrect ? (
                    <span className="text-[#1B4D2E] font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> اختيار المستند سليم ومكتمل بنجاح.
                    </span>
                  ) : (
                    <span className="text-[#8A1F1D] font-bold flex items-center gap-1">
                      <XCircle className="w-4 h-4" /> المستند المختار غير مناسب لهذه المعاملة، حاول اختيار مستند آخر.
                    </span>
                  )
                ) : (
                  <span>اضغط على أحد المستندات للمتابعة.</span>
                )}
              </div>

              <button
                id="btn-next-to-step-2"
                onClick={() => setActiveStep(2)}
                disabled={!isCurrentDocCorrect}
                className={`px-5 py-2.5 font-bold text-sm flex items-center gap-2 cursor-pointer transition ${
                  isCurrentDocCorrect
                    ? 'bg-[#1D1D1B] text-[#F9F7F2] hover:bg-[#C4A484] hover:text-[#1D1D1B]'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <span>الانتقال لفحص المستند واستخراج البيانات</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* STEP 2: DOCUMENT INSPECTION & DATA EXTRACTION                 */}
        {/* ============================================================ */}
        {activeStep === 2 && (
          <div className="animate-in fade-in duration-200">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-[#1D1D1B] flex items-center gap-2">
                  <Eye className="w-5 h-5 text-[#C4A484]" />
                  <span>فحص المستند المؤيد واستخراج البيانات المحاسبية (LO-ENRICH-DOC.2)</span>
                </h3>
                <p className="text-xs text-[#1D1D1B]/75 mt-0.5">
                  طالع صورة المستند المعتمد أدناه واستخرج منه الحقائق المحاسبية الأربع المطلوبة للتسجيل.
                </p>
              </div>
              <button
                onClick={() => setActiveStep(1)}
                className="text-xs text-[#8A1F1D] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>العودة للحدث والمستند</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
              
              {/* DOCUMENT FACSIMILE (7 Cols) */}
              <div className="lg:col-span-7">
                <div className="bg-white border-2 border-[#1D1D1B] p-5 sm:p-6 shadow-md relative overflow-hidden font-sans">
                  
                  {/* Watermark / Stamp simulation */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-5 rotate-[-25deg] text-5xl font-black uppercase text-[#1D1D1B]">
                    OFFICIAL VOUCHER
                  </div>

                  {/* Document Header */}
                  <div className="border-b-2 border-[#1D1D1B] pb-3 mb-4 flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Building2 className="w-5 h-5 text-[#8A1F1D]" />
                        <span className="font-bold text-xs sm:text-sm text-[#1D1D1B]">
                          {scenario.documentFacsimile.organizationName}
                        </span>
                      </div>
                      <h4 className="text-base sm:text-lg font-black text-[#8A1F1D]">
                        {scenario.documentFacsimile.documentTitle}
                      </h4>
                      {scenario.documentFacsimile.documentSubtitle && (
                        <p className="text-[11px] text-gray-500">
                          {scenario.documentFacsimile.documentSubtitle}
                        </p>
                      )}
                    </div>

                    <div className="text-left bg-[#F2EFE9] border border-[#1D1D1B]/20 p-2 text-xs">
                      <div className="font-mono font-bold text-[#1D1D1B]">
                        رقم: {scenario.documentFacsimile.documentNumber}
                      </div>
                      <div className="text-gray-600 text-[11px] mt-0.5">
                        التاريخ: {scenario.documentFacsimile.date}
                      </div>
                    </div>
                  </div>

                  {/* Counterparty / Beneficiary */}
                  <div className="bg-[#F9F7F2] border border-[#1D1D1B]/20 p-3 mb-4 text-xs">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-gray-700">المعني بالأمر / الطرف المقابل:</span>
                      <span className="bg-[#1D1D1B] text-white text-[10px] px-1.5 py-0.5">معتمد دفترياً</span>
                    </div>
                    <div className="text-sm font-bold text-[#1D1D1B]">
                      {scenario.documentFacsimile.counterpartyName}
                    </div>
                    {scenario.documentFacsimile.bankName && (
                      <div className="text-xs text-[#8A1F1D] mt-1 font-semibold">
                        المصرف المسحوب عليه: {scenario.documentFacsimile.bankName}
                      </div>
                    )}
                  </div>

                  {/* Items / Description Table */}
                  <div className="border border-[#1D1D1B]/30 mb-4 overflow-x-auto">
                    <table className="w-full text-xs text-right">
                      <thead className="bg-[#1D1D1B] text-white">
                        <tr>
                          <th className="p-2">البيان والتفاصيل</th>
                          <th className="p-2 text-center">الكمية</th>
                          <th className="p-2 text-center">سعر الوحدة</th>
                          <th className="p-2 text-left">الإجمالي</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1D1D1B]/15">
                        {scenario.documentFacsimile.itemsOrDescription.map((item, i) => (
                          <tr key={i} className="hover:bg-gray-50">
                            <td className="p-2 font-medium">{item.description}</td>
                            <td className="p-2 text-center">{item.quantity ?? '-'}</td>
                            <td className="p-2 text-center">{item.unitPrice ? `${item.unitPrice.toLocaleString()} ج` : '-'}</td>
                            <td className="p-2 text-left font-bold">{item.total.toLocaleString()} ج</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Total and Wording */}
                  <div className="bg-[#F2EFE9] p-3 border border-[#1D1D1B]/30 mb-4 flex justify-between items-center">
                    <div>
                      <div className="text-[11px] text-gray-600">المبلغ بالحروف والتفقيط:</div>
                      <div className="text-xs font-bold text-[#1D1D1B] mt-0.5">
                        {scenario.documentFacsimile.amountInWords}
                      </div>
                      <div className="text-[11px] text-[#8A1F1D] mt-1">
                        طريقة التسوية: {scenario.documentFacsimile.paymentMethodText}
                      </div>
                    </div>
                    <div className="text-left bg-white border border-[#1D1D1B] px-3 py-2">
                      <div className="text-[10px] text-gray-500">إجمالي القيمة:</div>
                      <div className="text-base sm:text-lg font-black text-[#1D1D1B]">
                        {scenario.documentFacsimile.totalAmount.toLocaleString()} {scenario.documentFacsimile.currency}
                      </div>
                    </div>
                  </div>

                  {/* Signatures & Stamp */}
                  <div className="grid grid-cols-2 gap-4 text-[11px] pt-3 border-t border-[#1D1D1B]/20">
                    <div>
                      <span className="text-gray-500">المعتمد / المصدر:</span>
                      <div className="font-bold text-[#1D1D1B] mt-0.5">
                        {scenario.documentFacsimile.authorizedSignatory}
                      </div>
                    </div>
                    <div className="text-left">
                      <span className="text-gray-500">المستلم / أمين العهدة:</span>
                      <div className="font-bold text-[#1D1D1B] mt-0.5">
                        {scenario.documentFacsimile.treasurerOrReceiver || 'قسم الحسابات'}
                      </div>
                    </div>
                  </div>

                  {/* Stamp Badge */}
                  {scenario.documentFacsimile.officialStampText && (
                    <div className="mt-3 flex justify-end">
                      <div className="inline-block border-2 border-dashed border-[#8A1F1D] text-[#8A1F1D] text-[10px] font-bold px-2 py-1 rotate-[-2deg]">
                        {scenario.documentFacsimile.officialStampText}
                      </div>
                    </div>
                  )}

                </div>
              </div>

              {/* EXTRACTION QUESTIONS (5 Cols) */}
              <div className="lg:col-span-5 flex flex-col justify-between">
                <div className="space-y-3.5">
                  <div className="bg-[#1D1D1B] text-white p-2.5 text-xs font-bold flex items-center gap-1.5">
                    <Hash className="w-4 h-4 text-[#C4A484]" />
                    <span>بطاقة استخراج البيانات المحاسبية (Data Extraction Card)</span>
                  </div>

                  {scenario.extractionFields.map((field, fIdx) => {
                    const selectedVal = extractionAnswers[field.id];
                    const isCorrect = selectedVal === field.expectedValue;
                    return (
                      <div
                        key={field.id}
                        id={`extraction-field-box-${fIdx}`}
                        className={`p-3 border transition ${
                          extractionChecked
                            ? isCorrect
                              ? 'bg-[#1B4D2E]/10 border-[#1B4D2E]'
                              : 'bg-[#8A1F1D]/10 border-[#8A1F1D]'
                            : 'bg-white border-[#1D1D1B]/20'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-bold text-[#1D1D1B]">
                            {fIdx + 1}. {field.label}:
                          </label>
                          {extractionChecked && (
                            isCorrect ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#1B4D2E]" />
                            ) : (
                              <XCircle className="w-3.5 h-3.5 text-[#8A1F1D]" />
                            )
                          )}
                        </div>
                        <p className="text-[11px] text-gray-600 mb-2">{field.prompt}</p>

                        <div className="grid grid-cols-2 gap-1.5">
                          {field.options.map((opt) => {
                            const isChosen = selectedVal === opt;
                            return (
                              <button
                                key={opt}
                                id={`opt-${field.id}-${opt.replace(/\s+/g, '-')}`}
                                onClick={() => handleSelectExtractionField(field.id, opt)}
                                className={`text-xs p-1.5 border text-right transition truncate cursor-pointer ${
                                  isChosen
                                    ? 'bg-[#1D1D1B] text-white border-[#1D1D1B] font-bold'
                                    : 'bg-[#F9F7F2] border-[#1D1D1B]/20 text-[#1D1D1B] hover:bg-[#F2EFE9]'
                                }`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>

                        {extractionChecked && !isCorrect && (
                          <div className="mt-1.5 text-[11px] text-[#8A1F1D]">
                            الإجابة الصحيحة: <strong>{field.expectedValue}</strong> ({field.explanation})
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Validation and Step 3 trigger */}
                <div className="mt-4 pt-3 border-t border-[#1D1D1B]/20 flex flex-col gap-2">
                  {!extractionChecked ? (
                    <button
                      id="btn-verify-extractions"
                      onClick={checkExtractions}
                      disabled={Object.keys(extractionAnswers).length < scenario.extractionFields.length}
                      className={`w-full py-2.5 font-bold text-xs sm:text-sm transition cursor-pointer ${
                        Object.keys(extractionAnswers).length === scenario.extractionFields.length
                          ? 'bg-[#8A1F1D] text-white hover:bg-[#8A1F1D]/90'
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <span>تدقيق ومطابقة البيانات المستخرجة</span>
                    </button>
                  ) : (
                    <div className="flex items-center justify-between gap-2">
                      <button
                        onClick={() => setExtractionChecked(false)}
                        className="text-xs text-gray-600 hover:text-black flex items-center gap-1 cursor-pointer p-1"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>تعديل الإجابات</span>
                      </button>

                      <button
                        id="btn-next-to-step-3"
                        onClick={() => setActiveStep(3)}
                        className="bg-[#1D1D1B] text-[#F9F7F2] hover:bg-[#C4A484] hover:text-[#1D1D1B] px-4 py-2 font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition"
                      >
                        <span>الانتقال للتحليل المحاسبي التمهيدي</span>
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

              </div>

            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* STEP 3: PRELIMINARY ACCOUNTING ANALYSIS (A = L + E)          */}
        {/* ============================================================ */}
        {activeStep === 3 && (
          <div className="animate-in fade-in duration-200">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-[#1D1D1B] flex items-center gap-2">
                  <Scale className="w-5 h-5 text-[#8A1F1D]" />
                  <span>التحليل المحاسبي التمهيدي لأثر المستند (LO-ENRICH-DOC.3)</span>
                </h3>
                <p className="text-xs text-[#1D1D1B]/75 mt-0.5">
                  قبل صياغة القيد في دفتر اليومية، حدد نوع الحسابين المتأثرين من واقع المستند، واتجاه أثرهما على المعادلة المحاسبية.
                </p>
              </div>
              <button
                onClick={() => setActiveStep(2)}
                className="text-xs text-[#8A1F1D] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>العودة للمستند</span>
              </button>
            </div>

            {/* Reassurance Equation Banner */}
            <div className="bg-[#2A2A28] text-white p-3 sm:p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#C4A484]" />
                <span><strong>قاعدة المعادلة المحاسبية:</strong> الأصول = الالتزامات + حقوق الملكية (مع مراعاة أثر الإيرادات والمصروفات).</span>
              </div>
              <div className="font-mono bg-[#1D1D1B] px-3 py-1 border border-[#C4A484] text-[#C4A484] text-xs font-bold">
                {scenario.preliminaryAnalysis.accountingEquationRule}
              </div>
            </div>

            {/* Analysis Grid: 2 Accounts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              
              {/* Account 1 Card */}
              <div className="bg-white border-2 border-[#1D1D1B] p-4 sm:p-5 shadow-sm">
                <div className="border-b pb-2 mb-3">
                  <span className="text-xs text-[#8A1F1D] font-bold">الحساب الأول المتأثر:</span>
                  <h4 className="text-base font-extrabold text-[#1D1D1B] mt-0.5">
                    {scenario.preliminaryAnalysis.account1.accountName}
                  </h4>
                  <p className="text-xs text-gray-600 mt-1">
                    {scenario.preliminaryAnalysis.account1.explanation}
                  </p>
                </div>

                {/* Category selector */}
                <div className="mb-4">
                  <label className="text-xs font-bold block mb-1.5 text-[#1D1D1B]">
                    ما هو تصنيف هذا الحساب؟
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { key: 'asset', label: 'أصل (Asset)' },
                      { key: 'liability', label: 'التزام (Liability)' },
                      { key: 'equity', label: 'حق ملكية (Equity)' },
                      { key: 'revenue', label: 'إيراد (Revenue)' },
                      { key: 'expense', label: 'مصروف (Expense)' }
                    ].map(cat => (
                      <button
                        key={cat.key}
                        id={`cat1-${cat.key}`}
                        onClick={() => setSelectedCat1(cat.key)}
                        className={`text-xs p-2 border transition cursor-pointer text-center ${
                          selectedCat1 === cat.key
                            ? 'bg-[#1D1D1B] text-white border-[#1D1D1B] font-bold'
                            : 'bg-[#F9F7F2] border-[#1D1D1B]/20 text-[#1D1D1B] hover:bg-[#F2EFE9]'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Impact direction */}
                <div>
                  <label className="text-xs font-bold block mb-1.5 text-[#1D1D1B]">
                    ما هو اتجاه التغير بالعملية؟
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      id="impact1-increase"
                      onClick={() => setSelectedImpact1('increase')}
                      className={`text-xs p-2 border transition cursor-pointer text-center ${
                        selectedImpact1 === 'increase'
                          ? 'bg-[#1B4D2E] text-white border-[#1B4D2E] font-bold'
                          : 'bg-[#F9F7F2] border-[#1D1D1B]/20 text-[#1D1D1B] hover:bg-[#F2EFE9]'
                      }`}
                    >
                      زيادة (+)
                    </button>
                    <button
                      id="impact1-decrease"
                      onClick={() => setSelectedImpact1('decrease')}
                      className={`text-xs p-2 border transition cursor-pointer text-center ${
                        selectedImpact1 === 'decrease'
                          ? 'bg-[#8A1F1D] text-white border-[#8A1F1D] font-bold'
                          : 'bg-[#F9F7F2] border-[#1D1D1B]/20 text-[#1D1D1B] hover:bg-[#F2EFE9]'
                      }`}
                    >
                      نقصان (-)
                    </button>
                  </div>
                </div>

                {analysisChecked && (
                  <div className="mt-3 pt-2 border-t text-xs">
                    {selectedCat1 === scenario.preliminaryAnalysis.account1.category &&
                     selectedImpact1 === scenario.preliminaryAnalysis.account1.impact ? (
                      <div className="text-[#1B4D2E] font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> تحليل سليم تماماً للحساب الأول.
                      </div>
                    ) : (
                      <div className="text-[#8A1F1D] flex items-center gap-1">
                        <XCircle className="w-4 h-4 shrink-0" />
                        <span>الصحيح: تصنيف <strong>{scenario.preliminaryAnalysis.account1.category}</strong> وأثره <strong>{scenario.preliminaryAnalysis.account1.impact === 'increase' ? 'زيادة' : 'نقصان'}</strong></span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Account 2 Card */}
              <div className="bg-white border-2 border-[#1D1D1B] p-4 sm:p-5 shadow-sm">
                <div className="border-b pb-2 mb-3">
                  <span className="text-xs text-[#8A1F1D] font-bold">الحساب الثاني المقابل:</span>
                  <h4 className="text-base font-extrabold text-[#1D1D1B] mt-0.5">
                    {scenario.preliminaryAnalysis.account2.accountName}
                  </h4>
                  <p className="text-xs text-gray-600 mt-1">
                    {scenario.preliminaryAnalysis.account2.explanation}
                  </p>
                </div>

                {/* Category selector */}
                <div className="mb-4">
                  <label className="text-xs font-bold block mb-1.5 text-[#1D1D1B]">
                    ما هو تصنيف هذا الحساب؟
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { key: 'asset', label: 'أصل (Asset)' },
                      { key: 'liability', label: 'التزام (Liability)' },
                      { key: 'equity', label: 'حق ملكية (Equity)' },
                      { key: 'revenue', label: 'إيراد (Revenue)' },
                      { key: 'expense', label: 'مصروف (Expense)' }
                    ].map(cat => (
                      <button
                        key={cat.key}
                        id={`cat2-${cat.key}`}
                        onClick={() => setSelectedCat2(cat.key)}
                        className={`text-xs p-2 border transition cursor-pointer text-center ${
                          selectedCat2 === cat.key
                            ? 'bg-[#1D1D1B] text-white border-[#1D1D1B] font-bold'
                            : 'bg-[#F9F7F2] border-[#1D1D1B]/20 text-[#1D1D1B] hover:bg-[#F2EFE9]'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Impact direction */}
                <div>
                  <label className="text-xs font-bold block mb-1.5 text-[#1D1D1B]">
                    ما هو اتجاه التغير بالعملية؟
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      id="impact2-increase"
                      onClick={() => setSelectedImpact2('increase')}
                      className={`text-xs p-2 border transition cursor-pointer text-center ${
                        selectedImpact2 === 'increase'
                          ? 'bg-[#1B4D2E] text-white border-[#1B4D2E] font-bold'
                          : 'bg-[#F9F7F2] border-[#1D1D1B]/20 text-[#1D1D1B] hover:bg-[#F2EFE9]'
                      }`}
                    >
                      زيادة (+)
                    </button>
                    <button
                      id="impact2-decrease"
                      onClick={() => setSelectedImpact2('decrease')}
                      className={`text-xs p-2 border transition cursor-pointer text-center ${
                        selectedImpact2 === 'decrease'
                          ? 'bg-[#8A1F1D] text-white border-[#8A1F1D] font-bold'
                          : 'bg-[#F9F7F2] border-[#1D1D1B]/20 text-[#1D1D1B] hover:bg-[#F2EFE9]'
                      }`}
                    >
                      نقصان (-)
                    </button>
                  </div>
                </div>

                {analysisChecked && (
                  <div className="mt-3 pt-2 border-t text-xs">
                    {selectedCat2 === scenario.preliminaryAnalysis.account2.category &&
                     selectedImpact2 === scenario.preliminaryAnalysis.account2.impact ? (
                      <div className="text-[#1B4D2E] font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> تحليل سليم تماماً للحساب الثاني.
                      </div>
                    ) : (
                      <div className="text-[#8A1F1D] flex items-center gap-1">
                        <XCircle className="w-4 h-4 shrink-0" />
                        <span>الصحيح: تصنيف <strong>{scenario.preliminaryAnalysis.account2.category}</strong> وأثره <strong>{scenario.preliminaryAnalysis.account2.impact === 'increase' ? 'زيادة' : 'نقصان'}</strong></span>
                      </div>
                    )}
                  </div>
                )}
              </div>

            </div>

            {/* Step 3 Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-[#1D1D1B]/20">
              <div className="text-xs text-[#1D1D1B]/70">
                <span>{scenario.preliminaryAnalysis.pedagogicalSummary}</span>
              </div>

              {!analysisChecked ? (
                <button
                  id="btn-verify-analysis"
                  onClick={checkPreliminaryAnalysis}
                  disabled={!selectedCat1 || !selectedImpact1 || !selectedCat2 || !selectedImpact2}
                  className={`px-5 py-2.5 font-bold text-xs sm:text-sm transition cursor-pointer ${
                    selectedCat1 && selectedImpact1 && selectedCat2 && selectedImpact2
                      ? 'bg-[#8A1F1D] text-white hover:bg-[#8A1F1D]/90'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <span>التحقق من صحة التحليل المحاسبي</span>
                </button>
              ) : (
                <button
                  id="btn-next-to-step-4"
                  onClick={() => setActiveStep(4)}
                  className="bg-[#1D1D1B] text-[#F9F7F2] hover:bg-[#C4A484] hover:text-[#1D1D1B] px-5 py-2.5 font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition"
                >
                  <span>الانتقال لصياغة القيد في دفتر اليومية</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
            </div>

          </div>
        )}

        {/* ============================================================ */}
        {/* STEP 4: BRIDGE TO JOURNAL ENTRY & LEDGER (T-ACCOUNTS)        */}
        {/* ============================================================ */}
        {activeStep === 4 && (
          <div className="animate-in fade-in duration-200">
            <div className="bg-[#1B4D2E]/10 border-2 border-[#1B4D2E] p-4 sm:p-5 mb-6 text-right">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Award className="w-6 h-6 text-[#1B4D2E]" />
                  <h3 className="text-lg font-black text-[#1B4D2E]">
                    اكتملت الدورة المستندية للحالة #{scenario.scenarioNumber} بنجاح!
                  </h3>
                </div>
                <div className="bg-[#1B4D2E] text-white px-3 py-1 font-bold text-sm">
                  النتيجة المحققة: {calculateScenarioScore()} / 100
                </div>
              </div>
              <p className="text-xs sm:text-sm text-[#1D1D1B] leading-relaxed">
                تحولت الواقعة الاقتصادية الآن من مجرد مستند ورقي إلى قيد محاسبي ثنائي الأطراف متوازن بالكامل وجاهز للترحيل إلى دفتر الأستاذ العام وميزان المراجعة.
              </p>
            </div>

            {/* Formal Journal Entry Table */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-bold text-[#1D1D1B] flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#8A1F1D]" />
                  <span>شكل القيد في دفتر اليومية العام (General Journal Entry):</span>
                </h4>
                <span className="text-xs text-gray-500 font-mono">
                  رقم المرجع المستندي: {scenario.journalSeed.reference}
                </span>
              </div>

              <div className="border-2 border-[#1D1D1B] overflow-x-auto shadow-sm bg-white">
                <table className="w-full text-xs sm:text-sm text-right">
                  <thead className="bg-[#1D1D1B] text-white font-serif">
                    <tr>
                      <th className="p-2.5 w-24 text-center">التاريخ</th>
                      <th className="p-2.5 w-24 text-center">منه (مدين)</th>
                      <th className="p-2.5 w-24 text-center">له (دائن)</th>
                      <th className="p-2.5">البيان والحسابات</th>
                      <th className="p-2.5 w-32 text-center">المستند المؤيد</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1D1D1B]/15">
                    {/* Debit Line */}
                    <tr className="bg-[#F9F7F2]/60">
                      <td className="p-2.5 text-center font-mono">{scenario.journalSeed.date}</td>
                      <td className="p-2.5 text-center font-bold text-[#1B4D2E]">
                        {scenario.journalSeed.amount.toLocaleString()}
                      </td>
                      <td className="p-2.5 text-center text-gray-300">-</td>
                      <td className="p-2.5 font-bold text-[#1D1D1B]">
                        من {scenario.journalSeed.debitAccount}
                      </td>
                      <td className="p-2.5 text-center font-mono text-xs text-gray-600">
                        {scenario.journalSeed.reference}
                      </td>
                    </tr>
                    {/* Credit Line */}
                    <tr className="bg-white">
                      <td className="p-2.5 text-center font-mono">"</td>
                      <td className="p-2.5 text-center text-gray-300">-</td>
                      <td className="p-2.5 text-center font-bold text-[#8A1F1D]">
                        {scenario.journalSeed.amount.toLocaleString()}
                      </td>
                      <td className="p-2.5 font-bold text-[#1D1D1B] pr-8">
                        إلى {scenario.journalSeed.creditAccount}
                      </td>
                      <td className="p-2.5 text-center font-mono text-xs text-gray-600">
                        {scenario.candidateOptions.find(o => o.isCorrect)?.titleAr}
                      </td>
                    </tr>
                    {/* Explanation Line */}
                    <tr className="bg-[#F2EFE9] text-xs text-gray-700">
                      <td colSpan={5} className="p-2 pr-4 italic">
                        ({scenario.journalSeed.description})
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Next Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              
              {/* Button to T-Account simulator */}
              <button
                id="btn-bridge-to-t-accounts"
                onClick={() => {
                  if (onNavigateToJournal) {
                    onNavigateToJournal(scenario.journalSeed);
                  }
                }}
                className="p-3.5 bg-[#1B4D2E] text-white hover:bg-[#1B4D2E]/90 transition font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Layers className="w-4 h-4 text-[#C4A484]" />
                <span>ترحيل القيد واختباره في محاكي دفتر الأستاذ (T-Accounts)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>

              {/* Button to Next Scenario */}
              {currentScenarioIndex < DOCUMENTARY_SCENARIOS.length - 1 ? (
                <button
                  id="btn-next-scenario"
                  onClick={() => loadScenario(currentScenarioIndex + 1)}
                  className="p-3.5 bg-[#1D1D1B] text-[#F9F7F2] hover:bg-[#C4A484] hover:text-[#1D1D1B] transition font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>الانتقال للحدث التالي (#{currentScenarioIndex + 2})</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              ) : (
                <button
                  id="btn-restart-scenarios"
                  onClick={() => loadScenario(0)}
                  className="p-3.5 bg-[#C4A484] text-[#1D1D1B] hover:bg-[#C4A484]/90 transition font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>إعادة تدريب الدورة المستندية من البداية</span>
                </button>
              )}

            </div>

            {persistingAttempt && (
              <div className="mt-3 text-center text-xs text-gray-500">
                جاري تسجيل نتيجة الإتقان في سجل مخرجات التعلم الأكاديمية...
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
};
