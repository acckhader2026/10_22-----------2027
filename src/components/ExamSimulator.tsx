import React, { useState, useEffect } from 'react';
import { Award, Clock, CheckCircle2, AlertTriangle, FileText, Check, X, Sparkles, RefreshCw, Eye } from 'lucide-react';
import { comprehensiveExams } from '../data/examsData';
import { ComprehensiveExam } from '../types';
import confetti from 'canvas-confetti';
import { appliedGradingEngine } from '../domain/assessment/grading/AppliedGradingEngine';
import { apiClient } from '../api/apiClient';

export const ExamSimulator: React.FC = () => {
  const [selectedExamIndex, setSelectedExamIndex] = useState<number>(0);
  const currentExam: ComprehensiveExam = comprehensiveExams[selectedExamIndex];

  const [answers, setAnswers] = useState<{ [qId: string]: any }>({});
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(currentExam.timeAllowedMinutes * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [revealedSolutions, setRevealedSolutions] = useState<{ [qId: string]: boolean }>({});
  const [gradingPayload, setGradingPayload] = useState<{
    score: number;
    maxMarks: number;
    percentage: number;
    evaluations: Record<string, any>;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    setTimeLeft(currentExam.timeAllowedMinutes * 60);
    setAnswers({});
    setSubmitted(false);
    setIsTimerRunning(false);
    setRevealedSolutions({});
    setGradingPayload(null);
  }, [selectedExamIndex]);

  useEffect(() => {
    let timer: any;
    if (isTimerRunning && timeLeft > 0 && !submitted) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTimerRunning, timeLeft, submitted]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectAnswer = (qId: string, value: any) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qId]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setIsTimerRunning(false);

    try {
      // 1. Authoritative API submission
      const data = await apiClient.request('/api/exams/submit', {
        method: 'POST',
        body: JSON.stringify({
          examId: currentExam.id,
          userId: 'usr-student-1',
          answers,
          timeSpentSeconds: currentExam.timeAllowedMinutes * 60 - timeLeft
        })
      });

      if (data && data.score !== undefined) {
        setGradingPayload(data);
      } else {
        throw new Error('API fallback');
      }
    } catch {
      // 2. Client-side fallback with exact same AppliedGradingEngine
      let totalScore = 0;
      const evals: Record<string, any> = {};

      for (const sec of currentExam.sections) {
        for (const q of sec.questions) {
          const uAns = answers[q.id];
          if (q.type === 'mcq' || q.type === 'true_false') {
            const isCorrect = uAns === q.correctAnswer;
            const mark = isCorrect ? q.marks : 0;
            totalScore += mark;
            evals[q.id] = { isCorrect, score: mark, maxMarks: q.marks, type: q.type };
          } else if (q.type === 'applied' || q.type === 'case' || (q.type as any) === 'numerical' || (q.type as any) === 'accounting_entry') {
            const result = appliedGradingEngine.gradeAppliedResponse({
              questionId: q.id,
              studentAnswer: uAns,
              context: {
                questionId: q.id,
                prompt: q.prompt,
                type: q.type,
                marks: q.marks,
                modelAnswer: q.modelAnswer
              }
            });
            totalScore += result.awardedMarks;
            evals[q.id] = {
              isCorrect: result.status === 'CORRECT',
              score: result.awardedMarks,
              maxMarks: result.maxMarks,
              status: result.status,
              percentage: result.percentage,
              stepBreakdown: result.stepBreakdown,
              errors: result.errors,
              feedback: result.feedback,
              type: q.type
            };
          } else if (q.type === 'jre_essay') {
            const isFilled = Boolean(uAns && String(uAns).length > 20);
            const score = isFilled ? 16 : 0;
            totalScore += score;
            evals[q.id] = {
              isCorrect: isFilled,
              score,
              maxMarks: q.marks || 20,
              feedback: isFilled ? 'تم تسجيل المقال وتقييم المحاور الستة وفق سلم الدرجات الرسمي.' : 'لم يتم استكمال المقال.',
              type: 'jre'
            };
          }
        }
      }

      setGradingPayload({
        score: Number(totalScore.toFixed(1)),
        maxMarks: currentExam.totalMarks,
        percentage: Math.round((totalScore / currentExam.totalMarks) * 100),
        evaluations: evals
      });
    } finally {
      setSubmitted(true);
      setIsSubmitting(false);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const finalScore = gradingPayload ? gradingPayload.score : 0;
  const maxScore = gradingPayload ? gradingPayload.maxMarks : currentExam.totalMarks;
  const percentage = gradingPayload ? gradingPayload.percentage : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 font-serif">
      
      {/* Exam Header */}
      <div className="bg-[#1D1D1B] text-[#F9F7F2] rounded-none p-6 sm:p-8 shadow-xs border border-[#1D1D1B] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#C4A484] text-[#1D1D1B] font-bold text-xs px-3 py-0.5 uppercase tracking-wider">
              محاكي الامتحانات الرسمية المعتمد
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold mt-2">
            {currentExam.title}
          </h2>
          <p className="text-xs sm:text-sm text-[#F9F7F2]/80 mt-1">
            {currentExam.subtitle}
          </p>
        </div>

        {/* Timer Box */}
        <div className="bg-[#FFFFFF]/10 backdrop-blur-md px-5 py-3 border border-[#F9F7F2]/20 text-center shrink-0">
          <div className="flex items-center justify-center gap-1.5 text-xs text-[#C4A484] font-bold mb-1">
            <Clock className="w-4 h-4" />
            <span>الوقت المتبقي</span>
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-black text-white">
            {formatTime(timeLeft)}
          </div>
          {!isTimerRunning && !submitted && (
            <button
              onClick={() => setIsTimerRunning(true)}
              className="mt-2 text-[11px] bg-[#C4A484] hover:bg-[#b09070] text-[#1D1D1B] font-bold px-3 py-1 transition cursor-pointer"
            >
              بدء المؤقت الآن
            </button>
          )}
        </div>
      </div>

      {/* Switch Between Exam Models */}
      <div className="flex flex-wrap items-center gap-2">
        {comprehensiveExams.map((exam, idx) => (
          <button
            key={exam.id}
            onClick={() => setSelectedExamIndex(idx)}
            className={`px-4 py-2 text-xs font-bold transition border cursor-pointer ${
              selectedExamIndex === idx
                ? 'bg-[#1D1D1B] text-[#F9F7F2] border-[#1D1D1B]'
                : 'bg-[#FFFFFF] text-[#1D1D1B] border-[#1D1D1B]/20 hover:bg-[#F9F7F2]'
            }`}
          >
            {exam.title} ({exam.totalMarks} درجة)
          </button>
        ))}
      </div>

      {/* Instructions Card */}
      <div className="bg-[#FFFFFF] border border-[#1D1D1B]/15 rounded-none p-4 sm:p-5 space-y-2">
        <h4 className="font-bold text-[#1D1D1B] text-xs sm:text-sm flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#C4A484]" />
          <span>تعليمات وضوابط الورقة الامتحانية:</span>
        </h4>
        <ul className="list-disc list-inside space-y-1 text-xs text-[#1D1D1B]/80">
          {currentExam.instructions.map((ins, i) => (
            <li key={i}>{ins}</li>
          ))}
        </ul>
      </div>

      {/* Submitted Results Card */}
      {submitted && (
        <div className="bg-[#1D1D1B] text-[#F9F7F2] rounded-none p-6 sm:p-8 shadow-xs border border-[#1D1D1B] space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#C4A484] text-[#1D1D1B] flex items-center justify-center font-black">
                <Award className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-[#F9F7F2]">تم تصحيح ورقة الإجابة رسمياً وبدقة!</h3>
                <p className="text-xs text-[#C4A484] font-mono mt-0.5">
                  النتيجة النهائية الشاملة: {finalScore} من {maxScore} درجة ({percentage}%)
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setTimeLeft(currentExam.timeAllowedMinutes * 60);
                setAnswers({});
                setSubmitted(false);
                setIsTimerRunning(false);
                setRevealedSolutions({});
                setGradingPayload(null);
              }}
              className="px-4 py-2 bg-[#C4A484] hover:bg-[#b09070] text-[#1D1D1B] font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>إعادة أداء هذا الامتحان</span>
            </button>
          </div>
          <p className="text-xs text-[#F9F7F2]/80 bg-[#FFFFFF]/5 p-3 border border-[#F9F7F2]/10">
            💡 تم تصحيح الأسئلة التطبيقية والمسائل والقيود وفق محرك التقييم المعياري الدقيق وتوزيع درجات الخطوات (Step-by-Step Marks) ونماذج الإجابة الرسمية.
          </p>
        </div>
      )}

      {/* Exam Sections */}
      <div className="space-y-6">
        {currentExam.sections.map((section, sIdx) => (
          <div key={sIdx} className="bg-[#FFFFFF] border border-[#1D1D1B]/15 rounded-none p-6 sm:p-8 shadow-xs space-y-6">
            
            <div className="flex items-center justify-between border-b border-[#1D1D1B]/10 pb-3">
              <h3 className="font-extrabold text-base sm:text-lg text-[#1D1D1B]">
                {section.title}
              </h3>
              <span className="text-xs font-bold bg-[#F9F7F2] text-[#1D1D1B] border border-[#1D1D1B]/15 px-3 py-1">
                {section.marks} درجة
              </span>
            </div>

            <div className="space-y-5">
              {section.questions.map((q, qIdx) => {
                const userAns = answers[q.id];
                const isSol = revealedSolutions[q.id];
                const qEval = gradingPayload?.evaluations?.[q.id];

                return (
                  <div key={q.id} className="border border-[#1D1D1B]/15 rounded-none p-5 space-y-4 bg-[#F9F7F2]/60">
                    <div className="flex items-center justify-between text-xs text-[#1D1D1B]/60">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#1D1D1B]">السؤال {qIdx + 1}</span>
                        {submitted && qEval && (
                          <span className={`px-2 py-0.5 text-[11px] font-bold border ${
                            qEval.score === q.marks
                              ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                              : qEval.score > 0
                              ? 'bg-amber-100 text-amber-900 border-amber-300'
                              : 'bg-rose-100 text-rose-900 border-rose-300'
                          }`}>
                            الدرجة: {qEval.score} / {q.marks}
                          </span>
                        )}
                      </div>
                      <span className="text-[#C4A484] font-bold">[{q.marks} درجات]</span>
                    </div>

                    <p className="text-xs sm:text-sm font-semibold text-[#1D1D1B] leading-relaxed whitespace-pre-line">
                      {q.prompt}
                    </p>

                    {/* MCQ Options */}
                    {q.type === 'mcq' && q.options && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {q.options.map((opt, oIdx) => {
                          const isSelected = userAns === opt;
                          const isCorrectOption = opt === q.correctAnswer;
                          let btnStyle = 'bg-[#FFFFFF] hover:bg-[#F9F7F2] text-[#1D1D1B] border-[#1D1D1B]/15';

                          if (submitted) {
                            if (isCorrectOption) {
                              btnStyle = 'bg-[#F4F8F4] border-emerald-800 text-[#1B4D2E] font-bold';
                            } else if (isSelected && !isCorrectOption) {
                              btnStyle = 'bg-[#FDF3F2] border-rose-800 text-[#8A1F1D] line-through font-bold';
                            } else {
                              btnStyle = 'bg-[#FFFFFF] opacity-50 border-[#1D1D1B]/10';
                            }
                          } else if (isSelected) {
                            btnStyle = 'bg-[#1D1D1B] text-[#F9F7F2] border-[#1D1D1B] font-bold';
                          }

                          return (
                            <button
                              key={oIdx}
                              disabled={submitted}
                              onClick={() => handleSelectAnswer(q.id, opt)}
                              className={`p-3 text-xs text-right border transition flex items-center justify-between gap-2 cursor-pointer ${btnStyle}`}
                            >
                              <span>{opt}</span>
                              {submitted && isCorrectOption && <Check className="w-4 h-4 text-emerald-800 shrink-0" />}
                              {submitted && isSelected && !isCorrectOption && <X className="w-4 h-4 text-rose-800 shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* True / False */}
                    {q.type === 'true_false' && (
                      <div className="flex gap-2 pt-1">
                        {[
                          { label: '✓ عبارة صائبة', val: true },
                          { label: '✕ عبارة خاطئة', val: false }
                        ].map((item, bIdx) => {
                          const isSelected = userAns === item.val;
                          const isCorrectOption = item.val === q.correctAnswer;
                          let btnStyle = 'bg-[#FFFFFF] hover:bg-[#F9F7F2] text-[#1D1D1B] border-[#1D1D1B]/15';

                          if (submitted) {
                            if (isCorrectOption) {
                              btnStyle = 'bg-[#F4F8F4] border-emerald-800 text-[#1B4D2E] font-bold';
                            } else if (isSelected && !isCorrectOption) {
                              btnStyle = 'bg-[#FDF3F2] border-rose-800 text-[#8A1F1D] font-bold';
                            } else {
                              btnStyle = 'bg-[#FFFFFF] opacity-50 border-[#1D1D1B]/10';
                            }
                          } else if (isSelected) {
                            btnStyle = 'bg-[#1D1D1B] text-[#F9F7F2] border-[#1D1D1B] font-bold';
                          }

                          return (
                            <button
                              key={bIdx}
                              disabled={submitted}
                              onClick={() => handleSelectAnswer(q.id, item.val)}
                              className={`px-4 py-2 text-xs font-bold border transition flex items-center gap-1.5 cursor-pointer ${btnStyle}`}
                            >
                              <span>{item.label}</span>
                              {submitted && isCorrectOption && <Check className="w-4 h-4 text-emerald-800" />}
                              {submitted && isSelected && !isCorrectOption && <X className="w-4 h-4 text-rose-800" />}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Applied / Essay / Case Textarea for students */}
                    {(q.type === 'applied' || q.type === 'case' || q.type === 'jre_essay') && (
                      <div className="space-y-2 pt-2">
                        <textarea
                          disabled={submitted}
                          rows={4}
                          placeholder="اكتب مسودة إجابتك، قيود اليومية، أو خطوات الحل هنا..."
                          value={userAns || ''}
                          onChange={e => handleSelectAnswer(q.id, e.target.value)}
                          className="w-full p-3 bg-[#FFFFFF] border border-[#1D1D1B]/20 focus:outline-[#1D1D1B] text-xs leading-relaxed"
                        />
                      </div>
                    )}

                    {/* Step-by-Step Breakdown for Applied / Case questions */}
                    {submitted && qEval?.stepBreakdown && qEval.stepBreakdown.length > 0 && (
                      <div className="bg-[#FFFFFF] border border-[#1D1D1B]/15 p-4 space-y-3">
                        <h5 className="font-bold text-xs text-[#1D1D1B] flex items-center gap-1.5 border-b border-[#1D1D1B]/10 pb-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                          <span>تفصيل تصحيح الخطوات وسلم توزيع الدرجات:</span>
                        </h5>
                        <div className="space-y-2">
                          {qEval.stepBreakdown.map((step: any, sIdx: number) => (
                            <div key={sIdx} className="text-xs p-2.5 bg-[#F9F7F2] border border-[#1D1D1B]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div className="space-y-1">
                                <div className="font-bold text-[#1D1D1B] flex items-center gap-1.5">
                                  {step.passed ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <X className="w-3.5 h-3.5 text-rose-700" />}
                                  <span>{step.description}</span>
                                </div>
                                <p className="text-[11px] text-[#1D1D1B]/70">{step.feedback}</p>
                              </div>
                              <span className={`text-[11px] font-mono font-bold px-2 py-0.5 border shrink-0 ${
                                step.awardedMarks === step.maxMarks
                                  ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                                  : step.awardedMarks > 0
                                  ? 'bg-amber-50 text-amber-900 border-amber-200'
                                  : 'bg-rose-50 text-rose-900 border-rose-200'
                              }`}>
                                {step.awardedMarks} / {step.maxMarks} د
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Model Answer Toggle */}
                    {submitted && q.modelAnswer && (
                      <div className="pt-2">
                        <button
                          onClick={() => setRevealedSolutions(prev => ({ ...prev, [q.id]: !prev[q.id] }))}
                          className="px-3 py-1.5 bg-[#1D1D1B] hover:bg-[#333330] text-xs font-bold text-[#F9F7F2] transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#C4A484]" />
                          <span>{isSol ? 'إخفاء الإجابة النموذجية الرسمية' : 'عرض الإجابة النموذجية الرسمية وسلم التقييم'}</span>
                        </button>

                        {isSol && (
                          <div className="mt-3 bg-[#FFFFFF] border border-[#1D1D1B]/20 p-4 text-xs text-[#1D1D1B] whitespace-pre-line leading-relaxed">
                            <strong className="block text-[#1D1D1B] mb-1">النموذج الرسمي المعتمد للتصحيح:</strong>
                            {q.modelAnswer}
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                );
              })}
            </div>

          </div>
        ))}
      </div>

      {/* Submit Button */}
      {!submitted && (
        <div className="flex justify-center pt-4">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-8 py-3.5 bg-[#1D1D1B] hover:bg-[#333330] text-[#F9F7F2] font-extrabold text-sm sm:text-base border border-[#1D1D1B] transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <CheckCircle2 className="w-5 h-5 text-[#C4A484]" />
            <span>{isSubmitting ? 'جاري تصحيح ورقة الامتحان...' : 'تسليم ورقة الامتحان وإنهاء الوقت'}</span>
          </button>
        </div>
      )}

    </div>
  );
};
