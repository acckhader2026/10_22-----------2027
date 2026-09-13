import React, { useState } from 'react';
import { Printer, ArrowRight, BookOpen, Layers, CheckCircle2, FileText, Award } from 'lucide-react';
import { allLessons } from '../data/lessonsData';
import { unitAnalysisData } from '../data/unitAnalysis';
import { unitReviewData } from '../data/unitReviewData';
import { comprehensiveExams } from '../data/examsData';
import { bookMetadata } from '../data/bookMetadata';
import { expandedQuestionBank } from '../data/expandedQuestionBank';
import { Button } from '../design-system';

interface PrintViewProps {
  onBack: () => void;
}

export type ExportEdition = 'student' | 'teacher' | 'answers' | 'qbank' | 'exams';

export const PrintView: React.FC<PrintViewProps> = ({ onBack }) => {
  const [selectedEdition, setSelectedEdition] = useState<ExportEdition>('student');

  return (
    <div className="bg-[#F9F7F2] min-h-screen py-8 font-serif">
      
      {/* Top Floating Print Controller (Hidden in Print) */}
      <div className="no-print sticky top-4 z-50 max-w-4xl mx-auto px-4 mb-6">
        <div className="bg-[#1D1D1B] text-[#F9F7F2] p-4 shadow-xl border border-[#1D1D1B] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 bg-[#F9F7F2]/10 hover:bg-[#F9F7F2]/20 text-[#F9F7F2] transition flex items-center gap-1.5 text-xs font-bold cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
              <span>العودة للتصفح التفاعلي</span>
            </button>
            
            {/* Edition Selector */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-[#F9F7F2]/70">إصدار الطباعة:</span>
              <select
                value={selectedEdition}
                onChange={(e) => setSelectedEdition(e.target.value as ExportEdition)}
                className="bg-[#F9F7F2] text-[#1D1D1B] font-bold px-2.5 py-1 text-xs focus:outline-hidden cursor-pointer"
              >
                <option value="student">نسخة الطالب الكاملة (Student Edition)</option>
                <option value="teacher">نسخة المعلم الإرشادية (Teacher Edition)</option>
                <option value="answers">كتيب الإجابات النموذجية (Answer Booklet)</option>
                <option value="qbank">كتيب بنك الأسئلة الشامل (62 سؤالاً موثقاً)</option>
                <option value="exams">كتيب الامتحانات الرسمية (Exams Booklet)</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => window.print()}
            className="px-6 py-2 bg-[#C4A484] hover:bg-[#b09070] text-[#1D1D1B] font-extrabold text-xs sm:text-sm shadow-md transition flex items-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة أو حفظ PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Document Canvas (A4 Styled Paper) */}
      <div className="max-w-[850px] mx-auto bg-[#FFFFFF] p-8 sm:p-14 shadow-xl border border-[#1D1D1B]/20 text-[#1D1D1B] space-y-12 text-sm leading-relaxed">
        
        {/* Cover Page */}
        <div className="border-4 border-[#1D1D1B] p-8 text-center space-y-6 page-break-after">
          <div className="flex justify-between items-center text-xs font-bold text-[#1D1D1B]/70 border-b border-[#1D1D1B]/20 pb-3">
            <span>جمهورية مصر العربية • وزارة التربية والتعليم</span>
            <span>البكالوريا المصرية (EB) 2026/2027</span>
          </div>

          <div className="py-12 space-y-4">
            <span className="text-xs uppercase tracking-widest bg-[#1D1D1B] text-[#F9F7F2] px-4 py-1 font-bold">
              {selectedEdition === 'student' && 'الكتاب الخارجي المعتمد — نسخة الطالب'}
              {selectedEdition === 'teacher' && 'الكتاب الخارجي المعتمد — دليل المعلم والإرشادات'}
              {selectedEdition === 'answers' && 'كتيب الحلول والسلالم النموذجية المعتمدة'}
              {selectedEdition === 'qbank' && 'كتيب بنك الأسئلة الشامل (62 سؤالاً موثقاً)'}
              {selectedEdition === 'exams' && 'كتيب الامتحانات الشاملة والمحاكاة الرسمية'}
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-[#1D1D1B]">
              المحاسبة ببساطة وإتقان
            </h1>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1D1D1B]/80">
              {bookMetadata.unitTitle}
            </h2>
            <p className="italic text-[#1D1D1B]/70 max-w-md mx-auto">
              «{bookMetadata.slogan}»
            </p>
          </div>

          <div className="border-t border-[#1D1D1B]/20 pt-6 text-xs text-[#1D1D1B]/70 flex justify-between items-center">
            <span>الصف الثاني الثانوي - التجاري والعام</span>
            <span>مطابقة منهجية 100% لكتاب الوزارة ص 8 - 98</span>
          </div>
        </div>

        {/* Edition: Student & Teacher (Full Lessons) */}
        {(selectedEdition === 'student' || selectedEdition === 'teacher') && (
          <>
            {/* Table of Contents */}
            <div className="space-y-4 border-b border-[#1D1D1B]/20 pb-8 page-break-after">
              <h2 className="text-2xl font-black border-b-2 border-[#1D1D1B] pb-2">فهرس محتويات الوحدة الأولى</h2>
              <div className="space-y-2 text-xs">
                {allLessons.map(l => (
                  <div key={l.id} className="flex justify-between border-b border-dotted border-[#1D1D1B]/30 pb-1">
                    <span className="font-bold">الدرس {l.lessonNumber}: {l.title}</span>
                    <span className="font-mono">ص {l.lessonNumber * 12 + 6}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Lessons Content Loop */}
            {allLessons.map(lesson => (
              <div key={lesson.id} className="space-y-6 page-break-after">
                <div className="border-b-2 border-[#1D1D1B] pb-3">
                  <span className="text-xs bg-[#1D1D1B] text-[#C4A484] px-2.5 py-0.5 font-bold">
                    الدرس {lesson.lessonNumber}
                  </span>
                  <h2 className="text-2xl font-black text-[#1D1D1B] mt-2">{lesson.title}</h2>
                  <p className="text-xs text-[#1D1D1B]/70 mt-1">{lesson.realWorldIntroduction?.hookStory}</p>
                </div>

                {selectedEdition === 'teacher' && (
                  <div className="bg-[#FAF7EE] border border-[#1D1D1B]/30 p-4 text-xs space-y-1">
                    <span className="font-bold text-[#7A5210]">📌 إرشادات المعلم التربوية للدرس:</span>
                    <p>التركيز على تصحيح اللبس الشائع والربط بالمعادلة المحاسبية والتأكد من تطبيق الطلبة لمبدأ القيد المزدوج عملياً.</p>
                  </div>
                )}

                {/* Subsections */}
                <div className="space-y-4">
                  {lesson.sections.map((sub, sidx) => (
                    <div key={sidx} className="space-y-2">
                      <h3 className="font-bold text-base text-[#1D1D1B] border-r-4 border-[#C4A484] pr-2">
                        {sub.title}
                      </h3>
                      <div className="text-xs text-[#1D1D1B]/90 leading-relaxed bg-[#F9F7F2] p-3 border border-[#1D1D1B]/10 space-y-2">
                        <p><span className="font-bold">المفهوم المبسط: </span>{sub.simplifiedDefinition}</p>
                        <p><span className="font-bold">التعريف العلمي: </span>{sub.scientificDefinition}</p>
                        {sub.microExample && (
                          <div className="bg-[#FFFFFF] p-2 border border-[#1D1D1B]/15 text-[#1B4D2E]">
                            <span className="font-bold">مثال سريع: </span>{sub.microExample}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Solved Examples */}
                {lesson.solvedExamples.map((ex, eidx) => (
                  <div key={eidx} className="bg-[#FFFFFF] border border-[#1D1D1B]/30 p-4 text-xs space-y-2">
                    <span className="font-bold bg-[#1D1D1B] text-[#F9F7F2] px-2 py-0.5">مثال تطبيقي محلول: {ex.title}</span>
                    <p className="font-semibold">{ex.scenario}</p>
                    <div className="bg-[#F4F8F4] p-3 text-[#1B4D2E] border border-emerald-800/20">
                      <span className="font-bold block mb-1">الحل والتعليل المحاسبي:</span>
                      {ex.finalResult}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </>
        )}

        {/* Edition: Question Bank (62 Questions) */}
        {(selectedEdition === 'qbank' || selectedEdition === 'answers') && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black border-b-2 border-[#1D1D1B] pb-2">
              {selectedEdition === 'qbank' ? 'بنك الأسئلة الشامل (62 سؤالاً)' : 'دليل الإجابات والحلول النموذجية'}
            </h2>
            <div className="space-y-4">
              {expandedQuestionBank.map((q, idx) => (
                <div key={q.id} className="border border-[#1D1D1B]/20 p-4 text-xs space-y-2">
                  <div className="flex justify-between font-bold border-b border-[#1D1D1B]/10 pb-1">
                    <span>#{idx + 1} - {q.concept} ({q.difficulty})</span>
                    <span>كتاب الوزارة ص {q.sourceMapping.source_page}</span>
                  </div>
                  <p className="font-semibold text-sm">{q.question}</p>
                  
                  {q.options && selectedEdition === 'qbank' && (
                    <div className="grid grid-cols-2 gap-1 text-[11px] pt-1">
                      {q.options.map((opt, i) => (
                        <div key={i} className="p-1 border border-[#1D1D1B]/10">[{String.fromCharCode(65 + i)}] {opt}</div>
                      ))}
                    </div>
                  )}

                  {selectedEdition === 'answers' && (
                    <div className="bg-[#F4F8F4] border border-emerald-800/20 p-2.5 text-[#1B4D2E] space-y-1">
                      <div className="font-bold">الإجابة: {String(q.correctAnswer)}</div>
                      <div>{q.explanation}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Edition: Exams Booklet */}
        {selectedEdition === 'exams' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-black border-b-2 border-[#1D1D1B] pb-2">نماذج الامتحانات الشاملة للمحاكاة</h2>
            {comprehensiveExams.map((exam, exIdx) => (
              <div key={exam.id} className="border-2 border-[#1D1D1B] p-6 space-y-6 page-break-after">
                <div className="text-center border-b border-[#1D1D1B]/20 pb-4 space-y-1">
                  <h3 className="text-xl font-black">{exam.title}</h3>
                  <p className="text-xs text-[#1D1D1B]/70">{exam.subtitle} | زمن الإجابة: {exam.timeAllowedMinutes} دقيقة | الدرجة الكلية: {exam.totalMarks} درجة</p>
                </div>
                <div className="space-y-4">
                  {exam.sections.map((sec, sIdx) => (
                    <div key={sIdx} className="space-y-3">
                      <h4 className="font-bold text-sm bg-[#F9F7F2] p-2 border-r-4 border-[#1D1D1B]">{sec.title} ({sec.marks} درجة)</h4>
                      <div className="space-y-3 pr-2">
                        {sec.questions.map((q, qIdx) => (
                          <div key={q.id} className="text-xs space-y-1">
                            <p className="font-bold">{qIdx + 1}. {q.prompt} ({q.marks} درجة)</p>
                            {q.options && (
                              <div className="grid grid-cols-2 gap-1 pt-1">
                                {q.options.map((opt, oi) => (
                                  <div key={oi} className="p-1 border border-[#1D1D1B]/15">[{oi + 1}] {opt}</div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
};
