import React, { useState, useEffect } from 'react';
import { PenTool, Award, Sparkles, CheckCircle2, AlertTriangle, BookOpen, Layers, RefreshCw, ChevronDown, Check, Send, BarChart2 } from 'lucide-react';
import { CANONICAL_JRE_RUBRIC, JREEvaluationResult, getPerformanceBand } from '../domain/assessment/jre/JRERubric';
import { evaluateJREArgument } from '../domain/assessment/jre/JREEvaluationEngine';

interface JRETalkerProps {
  onComplete?: () => void;
}

export const JRETalker: React.FC<JRETalkerProps> = ({ onComplete }) => {
  // 6-step components
  const [claim, setClaim] = useState<string>('إن قاعدة القيد المزدوج تضمن بشكل قاطع الاتساق الداخلي والتوازن الرياضي، لكنها بمفردها لا تضمن بالضرورة مصداقية وعدالة القوائم المالية.');
  const [reasoning, setReasoning] = useState<string>('لأن قاعدة القيد المزدوج تفرض توازن المدين والدائن لكل عملية، وهذا يحقق الانضباط الحسابي الداخلي، إلا أن النظام المحاسبي قد يتعرض لأخطاء متوازنة أو تلاعب في التقديرات.');
  const [evidence, setEvidence] = useState<string>('على سبيل المثال، خطأ التوجيه المحاسبي (كتسجيل أصل رأسمالي كمصروف) ينتهك مبدأ المقابلة ويشوه الأرباح، كما أن خطأ السهو يغفل عمليات بالكامل، ومع ذلك يبقى ميزان المراجعة متوازناً تماماً.');
  const [counterArg, setCounterArg] = useState<string>('قد يرى البعض أن تساوي جانبي ميزان المراجعة يقدم دليلاً كافياً على سلامة السجلات وصحتها المطلقة.');
  const [rebuttal, setRebuttal] = useState<string>('والرد على هذا الرأي هو أنه يخلط بين الصحة الرياضية الحسابية والتمثيل الصادق للواقع الاقتصادي للمنشأة.');
  const [conclusion, setConclusion] = useState<string>('ختاماً، القيد المزدوج شرط ضروري لتحقيق التوازن، لكن مصداقية القوائم تتطلب الالتزام بالمبادئ المحاسبية (الحيطة والاستحقاق) ونظم التدقيق المستقل.');

  const [selectedTopic, setSelectedTopic] = useState<'topic1' | 'topic2'>('topic1');
  const [evaluation, setEvaluation] = useState<JREEvaluationResult | null>(null);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);

  const runEvaluation = async () => {
    setIsEvaluating(true);
    try {
      // Direct domain evaluator execution (mirrors server endpoint with 100% fidelity)
      const res = await evaluateJREArgument({
        essay: '',
        claim,
        reasoning,
        evidence,
        counterArg,
        rebuttal,
        conclusion,
        scenarioContext: selectedTopic === 'topic1' ? 'قضية القيد المزدوج ومصداقية القوائم' : 'أساس الاستحقاق مقابل الأساس النقدي',
        targetConcept: selectedTopic === 'topic1' ? 'ميزان المراجعة والمبادئ المحاسبية' : 'مبدأ المقابلة وأساس الاستحقاق'
      });
      setEvaluation(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsEvaluating(false);
    }
  };

  useEffect(() => {
    runEvaluation();
  }, [claim, reasoning, evidence, counterArg, rebuttal, conclusion, selectedTopic]);

  const handleTopicChange = (topic: 'topic1' | 'topic2') => {
    setSelectedTopic(topic);
    if (topic === 'topic1') {
      setClaim('إن قاعدة القيد المزدوج تضمن بشكل قاطع الاتساق الداخلي والتوازن الرياضي، لكنها بمفردها لا تضمن بالضرورة مصداقية وعدالة القوائم المالية.');
      setReasoning('لأن قاعدة القيد المزدوج تفرض توازن المدين والدائن لكل عملية، وهذا يحقق الانضباط الحسابي الداخلي، إلا أن النظام المحاسبي قد يتعرض لأخطاء متوازنة أو تلاعب في التقديرات.');
      setEvidence('على سبيل المثال، خطأ التوجيه المحاسبي (كتسجيل أصل رأسمالي كمصروف) ينتهك مبدأ المقابلة ويشوه الأرباح، كما أن خطأ السهو يغفل عمليات بالكامل، ومع ذلك يبقى ميزان المراجعة متوازناً تماماً.');
      setCounterArg('قد يرى البعض أن تساوي جانبي ميزان المراجعة يقدم دليلاً كافياً على سلامة السجلات وصحتها المطلقة.');
      setRebuttal('والرد على هذا الرأي هو أنه يخلط بين الصحة الرياضية الحسابية والتمثيل الصادق للواقع الاقتصادي للمنشأة.');
      setConclusion('ختاماً، القيد المزدوج شرط ضروري لتحقيق التوازن، لكن مصداقية القوائم تتطلب الالتزام بالمبادئ المحاسبية (الحيطة والاستحقاق) ونظم التدقيق المستقل.');
    } else {
      setClaim('أرى أن تطبيق أساس الاستحقاق أفضل للمنشآت التجارية من الأساس النقدي لأنه يعكس الربحية الحقيقية للفترة بعدالة.');
      setReasoning('لأن أساس الاستحقاق يربط إيرادات الفترة بالمصروفات التي ساهمت في تحقيقها بصرف النظر عن تاريخ التدفق النقدي، تطبيقاً لمبدأ المقابلة.');
      setEvidence('مثلاً، إذا سددت الشركة إيجار عامين مقدماً (24,000 جنيه)، فإن الأساس النقدي يخفض أرباح العام الحالي ظلماً، بينما أساس الاستحقاق يحمل العام بنصيبه العادل (12,000 ج) فقط.');
      setCounterArg('قد يفضل البعض الأساس النقدي لبساطته وتوافقه المباشر مع الرصيد الفعلي في الخزينة.');
      setRebuttal('لكن هذا الرأي يتجاهل تشويه قياس الأداء وتضارب نتائج السنوات المالية وعدم تحقق مبدأ المقابلة.');
      setConclusion('لذلك، أساس الاستحقاق هو المعيار الدولي المعتمد لإعداد القوائم المالية ذات المصداقية والشفافية لحماية حقوق المتعاملين.');
    }
  };

  const currentScore = evaluation?.totalScore ?? 20;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-[#1D1D1B] text-[#F9F7F2] rounded-none p-6 sm:p-8 shadow-xs border border-[#1D1D1B] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#C4A484] text-[#1D1D1B] font-bold text-xs px-3 py-0.5 uppercase tracking-wider font-serif">
              ورشة التفكير المالي الرفيع
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold mt-2 font-serif">
            ورشة بناء مقال الـ JRE ومقياس الـ 20 درجة
          </h2>
          <p className="text-xs sm:text-sm text-[#F9F7F2]/80 mt-1 font-serif">
            Justified Reasoning with Evidence • سلم التقييم المعتمد الموحد (5 معايير × 4 درجات = 20 درجة كاملة)
          </p>
        </div>

        <div className="bg-[#FFFFFF]/10 backdrop-blur-md p-3 border border-[#F9F7F2]/20 text-center shrink-0">
          <span className="text-[11px] text-[#F9F7F2]/70 block font-serif">درجة التقييم التقديرية</span>
          <div className="text-2xl font-black text-[#C4A484] font-mono">
            {currentScore} / 20
          </div>
          <span className="text-[10px] text-[#F9F7F2] font-bold font-serif">
            {currentScore >= 18 ? 'مستوى ممتاز (Exemplary)' : currentScore >= 14 ? 'مستوى كفء (Proficient)' : 'مستوى قيد التطوير'}
          </span>
        </div>
      </div>

      {/* Preset Topics */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs font-bold text-[#1D1D1B] font-serif">اختر قضية المقال التدريبية:</span>
        <button
          onClick={() => handleTopicChange('topic1')}
          className={`px-3.5 py-1.5 text-xs font-bold transition border font-serif cursor-pointer ${
            selectedTopic === 'topic1'
              ? 'bg-[#1D1D1B] text-[#F9F7F2] border-[#1D1D1B]'
              : 'bg-[#FFFFFF] text-[#1D1D1B] border-[#1D1D1B]/20 hover:bg-[#F9F7F2]'
          }`}
        >
          1. هل يضمن القيد المزدوج المصداقية أم الاتساق الداخلي فقط؟
        </button>
        <button
          onClick={() => handleTopicChange('topic2')}
          className={`px-3.5 py-1.5 text-xs font-bold transition border font-serif cursor-pointer ${
            selectedTopic === 'topic2'
              ? 'bg-[#1D1D1B] text-[#F9F7F2] border-[#1D1D1B]'
              : 'bg-[#FFFFFF] text-[#1D1D1B] border-[#1D1D1B]/20 hover:bg-[#F9F7F2]'
          }`}
        >
          2. مقارنة أساس الاستحقاق بالأساس النقدي في قياس الربح العادل
        </button>
      </div>

      {/* The 6-Step Construction Builder & Live Evaluator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Editor (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Step 1: Claim */}
          <div className="bg-[#FFFFFF] border border-[#1D1D1B]/15 rounded-none p-4 space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <label className="font-bold text-xs text-[#1D1D1B] flex items-center gap-2 font-serif">
                <span className="w-5 h-5 bg-[#1D1D1B] text-[#C4A484] text-[11px] flex items-center justify-center font-bold">1</span>
                <span>الموقف والحكم المباشر (Claim / Judgment):</span>
              </label>
              <span className="text-[10px] text-[#1D1D1B]/50 font-serif">المعيار الأول (4 درجات)</span>
            </div>
            <textarea
              value={claim}
              onChange={e => setClaim(e.target.value)}
              rows={2}
              className="w-full p-2.5 bg-[#F9F7F2] border border-[#1D1D1B]/20 focus:outline-[#1D1D1B] text-xs leading-relaxed font-serif"
            />
          </div>

          {/* Step 2: Reasoning */}
          <div className="bg-[#FFFFFF] border border-[#1D1D1B]/15 rounded-none p-4 space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <label className="font-bold text-xs text-[#1D1D1B] flex items-center gap-2 font-serif">
                <span className="w-5 h-5 bg-[#1D1D1B] text-[#C4A484] text-[11px] flex items-center justify-center font-bold">2</span>
                <span>التفسير والربط السببي والمبادئ (Reasoning & Principles):</span>
              </label>
              <span className="text-[10px] text-[#1D1D1B]/50 font-serif">المعيار الثاني (4 درجات)</span>
            </div>
            <textarea
              value={reasoning}
              onChange={e => setReasoning(e.target.value)}
              rows={2}
              className="w-full p-2.5 bg-[#F9F7F2] border border-[#1D1D1B]/20 focus:outline-[#1D1D1B] text-xs leading-relaxed font-serif"
            />
          </div>

          {/* Step 3: Evidence */}
          <div className="bg-[#FFFFFF] border border-[#1D1D1B]/15 rounded-none p-4 space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <label className="font-bold text-xs text-[#1D1D1B] flex items-center gap-2 font-serif">
                <span className="w-5 h-5 bg-[#1D1D1B] text-[#C4A484] text-[11px] flex items-center justify-center font-bold">3</span>
                <span>الأدلة المحاسبية والأمثلة الرقمية (Evidence & Data):</span>
              </label>
              <span className="text-[10px] text-[#1D1D1B]/50 font-serif">المعيار الثالث (4 درجات)</span>
            </div>
            <textarea
              value={evidence}
              onChange={e => setEvidence(e.target.value)}
              rows={3}
              className="w-full p-2.5 bg-[#F9F7F2] border border-[#1D1D1B]/20 focus:outline-[#1D1D1B] text-xs leading-relaxed font-serif"
            />
          </div>

          {/* Step 4: Counter-Argument */}
          <div className="bg-[#FFFFFF] border border-[#1D1D1B]/15 rounded-none p-4 space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <label className="font-bold text-xs text-[#1D1D1B] flex items-center gap-2 font-serif">
                <span className="w-5 h-5 bg-[#1D1D1B] text-[#C4A484] text-[11px] flex items-center justify-center font-bold">4</span>
                <span>عرض الحجة المضادة للرأي المعارض (Counter-Argument):</span>
              </label>
              <span className="text-[10px] text-[#1D1D1B]/50 font-serif">جزء من المعيار الرابع (البنية)</span>
            </div>
            <textarea
              value={counterArg}
              onChange={e => setCounterArg(e.target.value)}
              rows={2}
              className="w-full p-2.5 bg-[#F9F7F2] border border-[#1D1D1B]/20 focus:outline-[#1D1D1B] text-xs leading-relaxed font-serif"
            />
          </div>

          {/* Step 5: Rebuttal */}
          <div className="bg-[#FFFFFF] border border-[#1D1D1B]/15 rounded-none p-4 space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <label className="font-bold text-xs text-[#1D1D1B] flex items-center gap-2 font-serif">
                <span className="w-5 h-5 bg-[#1D1D1B] text-[#C4A484] text-[11px] flex items-center justify-center font-bold">5</span>
                <span>التفنيد والرد المحاسبي على الحجة المضادة (Rebuttal):</span>
              </label>
              <span className="text-[10px] text-[#1D1D1B]/50 font-serif">جزء من المعيار الرابع (التماسك والجدلية)</span>
            </div>
            <textarea
              value={rebuttal}
              onChange={e => setRebuttal(e.target.value)}
              rows={2}
              className="w-full p-2.5 bg-[#F9F7F2] border border-[#1D1D1B]/20 focus:outline-[#1D1D1B] text-xs leading-relaxed font-serif"
            />
          </div>

          {/* Step 6: Conclusion */}
          <div className="bg-[#FFFFFF] border border-[#1D1D1B]/15 rounded-none p-4 space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <label className="font-bold text-xs text-[#1D1D1B] flex items-center gap-2 font-serif">
                <span className="w-5 h-5 bg-[#1D1D1B] text-[#C4A484] text-[11px] flex items-center justify-center font-bold">6</span>
                <span>الخاتمة المعللة والتوصية المهنية (Justified Conclusion):</span>
              </label>
              <span className="text-[10px] text-[#1D1D1B]/50 font-serif">المعيار الخامس (4 درجات)</span>
            </div>
            <textarea
              value={conclusion}
              onChange={e => setConclusion(e.target.value)}
              rows={2}
              className="w-full p-2.5 bg-[#F9F7F2] border border-[#1D1D1B]/20 focus:outline-[#1D1D1B] text-xs leading-relaxed font-serif"
            />
          </div>

        </div>

        {/* Diagnostic Rubric Scorecard (1 Col) */}
        <div className="space-y-4">
          
          <div className="bg-[#FFFFFF] border border-[#1D1D1B]/15 rounded-none p-4 sm:p-5 space-y-4 shadow-xs">
            <div className="border-b border-[#1D1D1B]/10 pb-3 flex items-center justify-between">
              <h3 className="font-bold text-[#1D1D1B] text-sm flex items-center gap-2 font-serif">
                <Award className="w-4 h-4 text-[#C4A484]" />
                <span>سلم الـ Rubric السداسي (20 درجة)</span>
              </h3>
              <span className="text-xs font-mono font-bold bg-[#1D1D1B] text-[#C4A484] px-2 py-0.5">
                {currentScore} / 20
              </span>
            </div>

            {/* Criteria Breakdown */}
            <div className="space-y-3">
              {CANONICAL_JRE_RUBRIC.map((crit, idx) => {
                const critEval = evaluation?.criteria[crit.id];
                const score = critEval?.score ?? 4;
                const isFull = score === 4;

                return (
                  <div key={crit.id} className="p-2.5 bg-[#F9F7F2] border border-[#1D1D1B]/10 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#1D1D1B] font-serif">{idx + 1}. {crit.nameAr.split('(')[0]}</span>
                      <span className={`font-mono font-bold px-1.5 py-0.5 text-[11px] ${
                        isFull ? 'bg-emerald-900 text-emerald-100' : 'bg-[#1D1D1B] text-[#C4A484]'
                      }`}>
                        {score} / 4
                      </span>
                    </div>
                    {critEval?.reasoning && (
                      <p className="text-[11px] text-[#1D1D1B]/75 font-serif leading-tight">
                        {critEval.reasoning}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Evaluator Notes */}
            {evaluation?.evaluatorNotes && (
              <div className="p-3 bg-[#1D1D1B] text-[#F9F7F2] text-xs font-serif leading-relaxed border-r-4 border-[#C4A484]">
                <strong className="block text-[#C4A484] mb-1">ملاحظة خبير التقييم:</strong>
                {evaluation.evaluatorNotes}
              </div>
            )}

            {/* Complete Action */}
            {onComplete && (
              <button
                onClick={onComplete}
                className="w-full py-2.5 bg-[#1D1D1B] hover:bg-[#333330] text-[#F9F7F2] font-bold text-xs transition border border-[#1D1D1B] font-serif cursor-pointer"
              >
                اعتماد نتيجة الـ JRE وإكمال الورشة
              </button>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};
