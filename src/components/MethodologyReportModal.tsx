import React, { useState } from 'react';
import { X, CheckCircle2, FileText, Layers, ShieldCheck, BookOpen, Sparkles, Check, Download, Printer } from 'lucide-react';
import { unitAnalysisData } from '../data/unitAnalysis';
import { unit2AnalysisData } from '../data/unit2Analysis';
import { unit3AnalysisData } from '../data/unit3Analysis';

interface MethodologyReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialUnitId?: 'unit-1' | 'unit-2' | 'unit-3';
}

export const MethodologyReportModal: React.FC<MethodologyReportModalProps> = ({ 
  isOpen, 
  onClose,
  initialUnitId = 'unit-1'
}) => {
  const [selectedUnit, setSelectedUnit] = useState<'unit-1' | 'unit-2' | 'unit-3'>(initialUnitId);

  // Keep state in sync if initialUnitId changes when opened
  React.useEffect(() => {
    if (isOpen && initialUnitId) {
      setSelectedUnit(initialUnitId);
    }
  }, [isOpen, initialUnitId]);

  if (!isOpen) return null;

  const currentAnalysis = selectedUnit === 'unit-3' ? unit3AnalysisData : selectedUnit === 'unit-2' ? unit2AnalysisData : unitAnalysisData;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#FFFFFF] max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl border-2 border-[#1D1D1B] overflow-hidden">
        
        {/* Modal Header */}
        <div className="bg-[#1D1D1B] text-[#F9F7F2] p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#C4A484]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#C4A484] text-[#1D1D1B] font-bold">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold font-serif">
                  تقرير التحليل المنهجي وجدول المطابقة الرسمية (100%)
                </h3>
                <span className="bg-[#C4A484] text-[#1D1D1B] text-[10px] font-black px-2 py-0.5 uppercase tracking-wider font-mono">
                  معتمد 100%
                </span>
              </div>
              <p className="text-xs text-[#F9F7F2]/80 font-serif">
                توثيق شامل لمطابقة الكتاب الخارجي والمنصة مع كتاب الوزارة الرسمي ({selectedUnit === 'unit-3' ? 'الوحدة الثالثة كاملة' : selectedUnit === 'unit-2' ? 'الوحدة الثانية كاملة: ص 35 - 78' : 'الوحدة الأولى كاملة: ص 11 - 34'})
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="p-2 bg-[#FFFFFF]/10 hover:bg-[#FFFFFF]/20 text-[#F9F7F2] text-xs font-bold transition flex items-center gap-1 font-serif cursor-pointer"
              title="طباعة التقرير"
            >
              <Printer className="w-4 h-4 text-[#C4A484]" />
              <span className="hidden sm:inline">طباعة</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 bg-[#FFFFFF]/10 hover:bg-[#FFFFFF]/20 text-[#F9F7F2] transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Unit Selector Tabs in Modal */}
        <div className="bg-[#F9F7F2] border-b border-[#1D1D1B]/15 px-4 py-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#1D1D1B] font-serif">اختر الوحدة للمراجعة:</span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setSelectedUnit('unit-1')}
                className={`px-3 py-1.5 text-xs font-bold font-serif transition border cursor-pointer ${
                  selectedUnit === 'unit-1'
                    ? 'bg-[#1D1D1B] text-[#F9F7F2] border-[#1D1D1B] shadow-xs'
                    : 'bg-[#FFFFFF] text-[#1D1D1B]/80 hover:bg-[#F9F7F2] border-[#1D1D1B]/20'
                }`}
              >
                الوحدة الأولى (ص 11 - 34)
              </button>
              <button
                onClick={() => setSelectedUnit('unit-2')}
                className={`px-3 py-1.5 text-xs font-bold font-serif transition border cursor-pointer ${
                  selectedUnit === 'unit-2'
                    ? 'bg-[#1D1D1B] text-[#F9F7F2] border-[#1D1D1B] shadow-xs'
                    : 'bg-[#FFFFFF] text-[#1D1D1B]/80 hover:bg-[#F9F7F2] border-[#1D1D1B]/20'
                }`}
              >
                الوحدة الثانية (ص 35 - 78)
              </button>
              <button
                onClick={() => setSelectedUnit('unit-3')}
                className={`px-3 py-1.5 text-xs font-bold font-serif transition border cursor-pointer ${
                  selectedUnit === 'unit-3'
                    ? 'bg-[#1D1D1B] text-[#F9F7F2] border-[#1D1D1B] shadow-xs'
                    : 'bg-[#FFFFFF] text-[#1D1D1B]/80 hover:bg-[#F9F7F2] border-[#1D1D1B]/20'
                }`}
              >
                الوحدة الثالثة
              </button>
            </div>
          </div>

          <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 border border-emerald-200">
            ✓ التغطية: 100% بدون أي حذف أو نقص
          </span>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-8 text-[#1D1D1B] text-sm">
          
          {/* Section 1: Overview Card */}
          <div className="bg-[#F9F7F2] border-2 border-[#1D1D1B] p-5 space-y-3">
            <h4 className="font-bold text-[#1D1D1B] text-base flex items-center gap-2 font-serif">
              <ShieldCheck className="w-5 h-5 text-[#C4A484]" />
              <span>1. بطاقة البيانات الرسمية والمصدر المعتمد</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-serif">
              <div className="bg-[#FFFFFF] p-3 border border-[#1D1D1B]/15">
                <span className="text-[#1D1D1B]/60 block font-bold">اسم الوحدة:</span>
                <strong className="text-[#1D1D1B]">{currentAnalysis.unitName}</strong>
              </div>
              <div className="bg-[#FFFFFF] p-3 border border-[#1D1D1B]/15">
                <span className="text-[#1D1D1B]/60 block font-bold">المصدر المعتمد:</span>
                <strong className="text-[#1D1D1B]">{currentAnalysis.sourceReference}</strong>
              </div>
              <div className="bg-[#FFFFFF] p-3 border border-[#1D1D1B]/15">
                <span className="text-[#1D1D1B]/60 block font-bold">المستوى الدراسي:</span>
                <strong className="text-[#1D1D1B]">{currentAnalysis.gradeLevel}</strong>
              </div>
              <div className="bg-[#FFFFFF] p-3 border border-[#1D1D1B]/15">
                <span className="text-[#1D1D1B]/60 block font-bold">عدد الدروس المعتمدة:</span>
                <strong className="text-[#1D1D1B]">{currentAnalysis.lessonsCount} دروس تفصيلية متدرجة</strong>
              </div>
            </div>
          </div>

          {/* Section 2: Detailed Lessons Analysis */}
          <div className="space-y-3">
            <h4 className="font-bold text-[#1D1D1B] text-base flex items-center gap-2 font-serif">
              <Layers className="w-5 h-5 text-[#C4A484]" />
              <span>2. التحليل المنهجي لدروس {selectedUnit === 'unit-3' ? 'الوحدة الثالثة' : selectedUnit === 'unit-2' ? 'الوحدة الثانية' : 'الوحدة الأولى'} (المفاهيم، المهارات، ونواتج التعلم)</span>
            </h4>
            <div className="space-y-4">
              {currentAnalysis.lessons.map((lesson) => (
                <div key={lesson.lessonNumber} className="border border-[#1D1D1B]/20 p-4 bg-[#FFFFFF] hover:border-[#1D1D1B] transition space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#1D1D1B]/10">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 bg-[#1D1D1B] text-[#C4A484] text-xs font-bold flex items-center justify-center font-serif">
                        {lesson.lessonNumber}
                      </span>
                      <span className="font-bold text-sm text-[#1D1D1B] font-serif">الدرس {lesson.lessonNumber}: {lesson.title}</span>
                    </div>
                    <span className="text-xs bg-[#F9F7F2] text-[#1D1D1B] border border-[#1D1D1B]/20 px-2.5 py-0.5 font-mono font-bold">
                      كتاب الوزارة: {lesson.sourcePages}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-serif">
                    <div className="bg-[#F9F7F2] p-3 border border-[#1D1D1B]/10 space-y-1.5">
                      <span className="font-bold text-[#1D1D1B] block">المفاهيم الأساسية:</span>
                      <ul className="list-disc list-inside space-y-1 text-[#1D1D1B]/80">
                        {lesson.coreConcepts.map((c, i) => <li key={i}>{c}</li>)}
                      </ul>
                    </div>
                    <div className="bg-[#F9F7F2] p-3 border border-[#1D1D1B]/10 space-y-1.5">
                      <span className="font-bold text-[#1D1D1B] block">نواتج التعلم والمهارات المستهدفة:</span>
                      <ul className="list-disc list-inside space-y-1 text-[#1D1D1B]/80">
                        {lesson.targetLearningOutcomes.map((o, i) => <li key={i}>{o}</li>)}
                      </ul>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#1D1D1B]/10 text-[11px] text-[#1D1D1B]/70 font-serif">
                    <div>
                      <strong>المهارات المكتسبة:</strong> {lesson.acquiredSkills.join(' • ')}
                    </div>
                    <div>
                      <strong>مستوى الصعوبة:</strong> <span className="font-bold text-[#1D1D1B]">{lesson.difficultyLevel}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Relational Map */}
          <div className="bg-[#1D1D1B] text-[#F9F7F2] p-5 border border-[#1D1D1B] space-y-2">
            <h4 className="font-bold text-[#C4A484] text-base flex items-center gap-2 font-serif">
              <Sparkles className="w-5 h-5" />
              <span>3. خريطة العلاقة المنطقية بين موضوعات الوحدة</span>
            </h4>
            <p className="text-xs text-[#F9F7F2]/90 leading-relaxed font-serif">
              {currentAnalysis.relationalMapDescription}
            </p>
          </div>

          {/* Section 4: 100% Content Matching Table */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="font-bold text-[#1D1D1B] text-base flex items-center gap-2 font-serif">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>4. جدول مطابقة الكتاب الخارجي مع كتاب الوزارة الرسمي (تغطية 100% معتمدة)</span>
              </h4>
              <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 border border-emerald-200">
                جميع البنود محققة وموثقة
              </span>
            </div>

            <div className="overflow-x-auto border-2 border-[#1D1D1B]">
              <table className="w-full text-xs text-right border-collapse">
                <thead className="bg-[#1D1D1B] text-[#F9F7F2] font-serif">
                  <tr>
                    <th className="p-3 border border-[#1D1D1B] font-bold">عنصر كتاب الوزارة الرسمي</th>
                    <th className="p-3 border border-[#1D1D1B] font-bold">تواجده في الكتاب الخارجي</th>
                    <th className="p-3 border border-[#1D1D1B] font-bold">مكان الشرح والتطبيق</th>
                    <th className="p-3 border border-[#1D1D1B] text-center font-bold w-28">عدد التدريبات</th>
                    <th className="p-3 border border-[#1D1D1B] text-center font-bold w-32">حالة التحقق</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1D1D1B]/15 font-serif">
                  {currentAnalysis.contentMatchingMatrix.map((item, idx) => (
                    <tr key={idx} className="hover:bg-[#F9F7F2] transition">
                      <td className="p-3 border border-[#1D1D1B]/15 font-bold text-[#1D1D1B] leading-relaxed">
                        {item.sourceElement}
                      </td>
                      <td className="p-3 border border-[#1D1D1B]/15 text-emerald-900 bg-emerald-50/50 font-medium">
                        {item.foundInExternalBook}
                      </td>
                      <td className="p-3 border border-[#1D1D1B]/15 text-[#1D1D1B]/80 font-mono text-[11px]">
                        {item.bookSection}
                      </td>
                      <td className="p-3 border border-[#1D1D1B]/15 text-center font-bold font-mono text-sm text-[#1D1D1B]">
                        {item.exercisesCount}+
                      </td>
                      <td className="p-3 border border-[#1D1D1B]/15 text-center">
                        <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-900 border border-emerald-300 px-2.5 py-0.5 font-bold text-[11px]">
                          <Check className="w-3.5 h-3.5 text-emerald-700" />
                          <span>{item.verificationStatus}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-[#F9F7F2] border-t-2 border-[#1D1D1B] p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-[#1D1D1B]/80 font-serif flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <span>تمت المراجعة والتدقيق العلمي والتربوي بنسبة 100% وفق كتاب الوزارة الرسمي (للوحدات الثلاث)</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#1D1D1B] hover:bg-[#333333] text-[#F9F7F2] text-xs font-bold transition font-serif cursor-pointer"
          >
            إغلاق التقرير والعودة للكتاب
          </button>
        </div>

      </div>
    </div>
  );
};
