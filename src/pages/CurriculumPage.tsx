import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Award, ArrowLeft, CheckCircle2, Layers, Compass, Sparkles, Filter, RotateCcw } from 'lucide-react';
import { curriculumRegistry } from '../domain/curriculum/CurriculumRegistry';
import { useCurriculumFilter } from '../context/CurriculumFilterContext';

export const CurriculumPage: React.FC = () => {
  const { 
    selectedUnitId, 
    selectedLessonId, 
    selectedLearningOutcomeId, 
    selectedLearningOutcome, 
    clearFilters, 
    selectUnit, 
    selectLesson 
  } = useCurriculumFilter();

  const allUnits = curriculumRegistry.getUnits();
  const units = selectedUnitId ? allUnits.filter(u => u.id === selectedUnitId) : allUnits;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 font-serif" dir="rtl">
      {/* Header Section */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 border border-[#1D1D1B] bg-[#1D1D1B] text-[#C4A484] text-xs font-bold px-3 py-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>منهاج البكالوريا المصرية المعتمد (EB v2.0)</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#1D1D1B] tracking-tight">
          هيكل الوحدات والمسار التعليمي
        </h1>
        <p className="text-sm sm:text-base text-[#1D1D1B]/70 leading-relaxed">
          خريطة معيارية متكاملة تغطي دروس الوحدات المعتمدة، مصممة لإتقان الفكر المحاسبي والتطبيق العملي ومقالات التفسير المدعوم بالأدلة (JRE).
        </p>

        {selectedUnitId && (
          <div className="inline-flex items-center gap-3 bg-[#F9F7F2] border border-[#1D1D1B] px-4 py-2 text-xs">
            <span className="font-bold text-[#1D1D1B]">
              يتم الآن عرض محتوى الوحدة المحددة فقط
            </span>
            <button
              onClick={clearFilters}
              className="text-rose-700 hover:text-rose-900 font-bold flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>عرض كافة الوحدات</span>
            </button>
          </div>
        )}
      </div>

      {/* Units Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {units.map((unit, uIdx) => {
          const unitSlug = unit.id; // 'unit-1' or 'unit-2'
          const isUnit2 = unit.id === 'unit-2';

          return (
            <div 
              key={unit.id}
              className="bg-white border-2 border-[#1D1D1B] p-6 sm:p-8 flex flex-col justify-between shadow-md space-y-6 hover:shadow-lg transition-shadow"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="bg-[#1D1D1B] text-[#C4A484] text-xs font-bold px-3 py-1 font-mono">
                    الوحدة {uIdx + 1}
                  </span>
                  <span className="text-xs font-bold text-[#1D1D1B]/60 font-mono">
                    {unit.lessons.length} دروس • {unit.lessons.reduce((acc, l) => acc + (l.objectives?.length || 0), 0) || (unit.lessons.length * 4)} هدفاً
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-[#1D1D1B] leading-snug">
                  {unit.titleAr}
                </h2>

                <p className="text-xs sm:text-sm text-[#1D1D1B]/70 leading-relaxed">
                  {unit.descriptionAr || (isUnit2 
                    ? 'منهجية تحليل المعاملات وقواعد القيد المزدوج، وإعداد دفاتر اليومية والأستاذ T، وميزان المراجعة وحتى إتمام الدورة المحاسبية الكاملة والمقال الاستقصائي.'
                    : 'الأسس والمبادئ المحاسبية، معادلة المركز المالي، منطق التسجيل، معالجة أخطاء الترحيل، والقوائم المالية الختامية مع نموذج التفسير المدعوم بالأدلة الأول.')}
                </p>

                {/* Lessons Mini-List */}
                <div className="border-t border-[#1D1D1B]/15 pt-4 space-y-2">
                  <div className="text-xs font-bold text-[#1D1D1B] flex items-center gap-1.5 mb-2">
                    <BookOpen className="w-3.5 h-3.5 text-[#C4A484]" />
                    <span>قائمة دروس الوحدة:</span>
                  </div>
                  <div className="space-y-1.5">
                    {unit.lessons.map((lesson, lIdx) => (
                      <Link
                        key={lesson.id}
                        to={`/curriculum/${unitSlug}/lessons/${lesson.id}`}
                        className="flex items-center justify-between p-2 text-xs bg-[#F9F7F2] hover:bg-[#C4A484]/20 border border-[#1D1D1B]/10 transition group"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 bg-[#1D1D1B] text-[#F9F7F2] flex items-center justify-center font-bold text-[10px]">
                            {lIdx + 1}
                          </span>
                          <span className="font-bold text-[#1D1D1B] group-hover:text-[#8A1F1D] transition-colors">
                            {lesson.titleAr}
                          </span>
                        </div>
                        <ArrowLeft className="w-3.5 h-3.5 text-[#1D1D1B]/40 group-hover:text-[#1D1D1B] group-hover:-translate-x-1 transition-transform" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-t border-[#1D1D1B]/15 pt-4 flex flex-col sm:flex-row items-center gap-3">
                <Link
                  to={`/curriculum/${unitSlug}`}
                  className="w-full sm:w-1/2 py-2.5 bg-[#1D1D1B] text-[#F9F7F2] text-xs font-bold text-center hover:bg-[#333333] transition flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Compass className="w-4 h-4 text-[#C4A484]" />
                  <span>استعراض خريطة الوحدة</span>
                </Link>

                <Link
                  to={`/curriculum/${unitSlug}/lessons/${unit.lessons[0]?.id || 'lesson-1'}`}
                  className="w-full sm:w-1/2 py-2.5 bg-[#C4A484] text-[#1D1D1B] text-xs font-bold text-center hover:bg-[#b89574] transition flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>بدء دراسة الدرس الأول</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
