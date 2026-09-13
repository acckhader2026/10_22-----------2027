import React, { useState } from 'react';
import { ArrowLeft, BookOpen, Layers, CheckCircle2, ChevronLeft, Sparkles, Scale, PenTool, Lightbulb, Compass, Target } from 'lucide-react';
import { allLessons, unit1Lessons, unit2Lessons, unit3Lessons, unit4Lessons } from '../data/lessonsData';
import { unitReviewData } from '../data/unitReviewData';
import { unit2ReviewData } from '../data/unit2ReviewData';
import { unit3ReviewData } from '../data/unit3ReviewData';
import { unit4ReviewData } from '../data/unit4ReviewData';
import { curriculumRegistry } from '../domain/curriculum/CurriculumRegistry';

interface UnitMapAndOutcomesProps {
  initialUnitId?: string;
  onSelectLesson: (lessonIndex: number) => void;
}

export const UnitMapAndOutcomes: React.FC<UnitMapAndOutcomesProps> = ({ 
  initialUnitId = 'unit-4',
  onSelectLesson 
}) => {
  const [selectedUnit, setSelectedUnit] = useState<string>(initialUnitId);
  const [showOutcomesTable, setShowOutcomesTable] = useState<boolean>(true);

  const customUnit = curriculumRegistry.getUnitById(selectedUnit);
  const isCustom = !!customUnit;

  const currentData = selectedUnit === 'unit-4' ? unit4ReviewData : selectedUnit === 'unit-3' ? unit3ReviewData : selectedUnit === 'unit-2' ? unit2ReviewData : unitReviewData;
  const currentLessons = selectedUnit === 'unit-4' ? unit4Lessons : selectedUnit === 'unit-3' ? unit3Lessons : selectedUnit === 'unit-2' ? unit2Lessons : unit1Lessons;
  const lessonOffset = selectedUnit === 'unit-4' ? 18 : selectedUnit === 'unit-3' ? 12 : selectedUnit === 'unit-2' ? 6 : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      
      {/* Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 border border-[#1D1D1B] bg-[#1D1D1B] text-[#C4A484] text-xs font-bold px-3 py-1 font-serif">
          <span>{currentData.edition}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#1D1D1B] font-serif">
          {customUnit ? customUnit.titleAr : (selectedUnit === 'unit-3'
            ? 'الوحدة الثالثة: دفاتر اليومية المساعدة'
            : selectedUnit === 'unit-2' 
            ? 'الوحدة الثانية: التسجيل المحاسبي والدورة المستندية'
            : 'الوحدة الأولى: أساسيات المحاسبة والتقارير المالية')}
        </h1>
        <p className="text-xs sm:text-sm text-[#1D1D1B]/70 font-serif max-w-2xl mx-auto leading-relaxed">
          {(isCustom && customUnit?.descriptionAr) || 'تتبع رحلة المعرفة المحاسبية من المفهوم الأساسي وحتى صياغة المقال المالي الرفيع (JRE) لبكالوريا مصر 2027 — مسار الأعمال'}
        </p>

        {/* Unit Selector Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-3">
          {curriculumRegistry.getUnits().map((u) => (
            <button
              key={u.id}
              onClick={() => setSelectedUnit(u.id)}
              className={`px-4 py-2 text-xs font-bold font-serif transition border cursor-pointer ${
                selectedUnit === u.id
                  ? 'bg-[#1D1D1B] text-[#F9F7F2] border-[#1D1D1B] shadow-xs'
                  : 'bg-[#FFFFFF] text-[#1D1D1B]/80 hover:bg-[#F9F7F2] border-[#1D1D1B]/20'
              }`}
            >
              خريطة {u.titleAr} ({u.lessons.length} دروس)
            </button>
          ))}
        </div>
      </div>

      {/* Big Idea & Essential Question Card */}
      <div className="bg-[#FFFFFF] border-2 border-[#1D1D1B] p-6 sm:p-8 shadow-xs space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-[#1D1D1B]/15">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#1D1D1B] font-bold text-sm font-serif">
              <Lightbulb className="w-5 h-5 text-[#C4A484]" />
              <span>الفكرة الكبرى (The Big Idea)</span>
            </div>
            <p className="text-xs sm:text-sm text-[#1D1D1B]/85 font-serif leading-relaxed pr-7">
              {currentData.theBigPicture.bigIdea}
            </p>
          </div>
          <div className="space-y-2 pt-4 md:pt-0 md:pr-6">
            <div className="flex items-center gap-2 text-[#1D1D1B] font-bold text-sm font-serif">
              <Compass className="w-5 h-5 text-[#C4A484]" />
              <span>السؤال الجوهري (Essential Question)</span>
            </div>
            <p className="text-xs sm:text-sm text-[#1D1D1B]/85 font-serif leading-relaxed pr-7 font-bold">
              {currentData.theBigPicture.essentialQuestion}
            </p>
          </div>
        </div>

        {/* Real-world Hook */}
        <div className="bg-[#F9F7F2] border border-[#1D1D1B]/20 p-4 space-y-2">
          <span className="text-xs font-bold text-[#1D1D1B] flex items-center gap-1.5 font-serif">
            🌍 المدخل الواقعي للوحدة: مخبز مريم بالإسكندرية
          </span>
          <p className="text-xs text-[#1D1D1B]/80 font-serif leading-relaxed">
            {currentData.theBigPicture.realWorldHook.story}
          </p>
          <p className="text-[11px] text-[#C4A484] font-bold font-serif">
            💡 {currentData.theBigPicture.realWorldHook.connection}
          </p>
        </div>
      </div>

      {/* Learning Outcomes (Sub-LOs Table) */}
      <div className="bg-[#FFFFFF] border border-[#1D1D1B]/15 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-[#1D1D1B]" />
            <h2 className="text-base sm:text-lg font-bold text-[#1D1D1B] font-serif">
              مصفوفة نواتج التعلم المستهدفة ({selectedUnit === 'unit-3' ? 'الوحدة الثالثة' : selectedUnit === 'unit-2' ? 'الوحدة الثانية' : 'الوحدة الأولى'})
            </h2>
          </div>
          <button
            onClick={() => setShowOutcomesTable(!showOutcomesTable)}
            className="text-xs font-bold text-[#1D1D1B] hover:underline font-serif cursor-pointer"
          >
            {showOutcomesTable ? 'إخفاء الجدول' : 'عرض الجدول'}
          </button>
        </div>

        {showOutcomesTable && (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs border-collapse">
              <thead>
                <tr className="bg-[#1D1D1B] text-[#F9F7F2] font-serif">
                  <th className="p-3 border border-[#1D1D1B] font-bold w-20 text-center">الرمز</th>
                  <th className="p-3 border border-[#1D1D1B] font-bold w-36">مستوى بلوم</th>
                  <th className="p-3 border border-[#1D1D1B] font-bold">ما ينبغي أن يستطيع الطالب فعله</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1D1D1B]/10 font-serif">
                {currentData.unitOutcomes.map((lo) => (
                  <tr key={lo.subLo} className="hover:bg-[#F9F7F2]/60 transition">
                    <td className="p-3 border border-[#1D1D1B]/10 font-mono font-bold text-center bg-[#F9F7F2]">
                      Sub-LO {lo.subLo}
                    </td>
                    <td className="p-3 border border-[#1D1D1B]/10 font-bold text-[#1D1D1B]">
                      <span className="inline-block px-2 py-0.5 bg-[#1D1D1B]/10 text-[11px]">
                        {lo.bloomLevel}
                      </span>
                    </td>
                    <td className="p-3 border border-[#1D1D1B]/10 text-[#1D1D1B]/90 leading-relaxed">
                      {lo.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Visual Timeline & Mind Map */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#1D1D1B]/15 pb-2">
          <h2 className="text-base sm:text-lg font-bold text-[#1D1D1B] font-serif flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#C4A484]" />
            <span>
              المسار البنائي لدروس {customUnit ? customUnit.titleAr : (selectedUnit === 'unit-2' ? 'الوحدة الثانية' : 'الوحدة الأولى')} ({customUnit ? customUnit.lessons.length : currentLessons.length} دروس)
            </span>
          </h2>
          <span className="text-xs text-[#1D1D1B]/60 font-serif">اختر أي درس لبدء المذاكرة والتطبيق التفاعلي</span>
        </div>

        {isCustom && customUnit ? (
          customUnit.lessons.map((lesson, idx) => (
            <div 
              key={lesson.id}
              onClick={() => onSelectLesson(lessonOffset + idx)}
              className="group cursor-pointer bg-[#FFFFFF] border border-[#1D1D1B]/15 hover:border-[#1D1D1B] p-5 sm:p-6 shadow-xs transition-all duration-200 relative overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#1D1D1B] text-[#C4A484] font-serif font-black text-lg flex items-center justify-center shrink-0 border border-[#1D1D1B]">
                    {lesson.lessonNumber}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#1D1D1B]">
                        الدرس {lesson.lessonNumber} ({customUnit.titleAr})
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-[#1D1D1B] group-hover:text-[#C4A484] transition font-serif">
                      {lesson.titleAr}
                    </h3>
                    <p className="text-xs text-[#1D1D1B]/60 mt-1 line-clamp-1">
                      {lesson.subtitleAr}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-[#1D1D1B]/10">
                  <div className="w-8 h-8 bg-[#F9F7F2] group-hover:bg-[#1D1D1B] group-hover:text-[#F9F7F2] flex items-center justify-center text-[#1D1D1B] border border-[#1D1D1B]/15 transition">
                    <ChevronLeft className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          currentLessons.map((lesson, idx) => (
          <div 
            key={lesson.id}
            onClick={() => onSelectLesson(lessonOffset + idx)}
            className="group cursor-pointer bg-[#FFFFFF] border border-[#1D1D1B]/15 hover:border-[#1D1D1B] p-5 sm:p-6 shadow-xs transition-all duration-200 relative overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#1D1D1B] text-[#C4A484] font-serif font-black text-lg flex items-center justify-center shrink-0 border border-[#1D1D1B]">
                  {lesson.lessonNumber}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#1D1D1B]">
                      الدرس {lesson.lessonNumber} ({selectedUnit === 'unit-2' ? 'الوحدة 2' : 'الوحدة 1'})
                    </span>
                    <span className="text-[11px] text-[#1D1D1B]/50">• {lesson.estimatedMinutes} دقيقة مذاكرة</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-[#1D1D1B] group-hover:text-[#C4A484] transition font-serif">
                    {lesson.title}
                  </h3>
                  <p className="text-xs text-[#1D1D1B]/60 mt-1 line-clamp-1">
                    {lesson.subtitle}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-[#1D1D1B]/10">
                <div className="flex items-center gap-1.5 text-xs text-[#1D1D1B]/70 bg-[#F9F7F2] px-3 py-1.5 border border-[#1D1D1B]/10">
                  <span>{lesson.sections.length} أقسام رئيسية</span>
                  <span>•</span>
                  <span>{lesson.quickChecks.length} تدريبات</span>
                </div>
                <div className="w-8 h-8 bg-[#F9F7F2] group-hover:bg-[#1D1D1B] group-hover:text-[#F9F7F2] flex items-center justify-center text-[#1D1D1B] border border-[#1D1D1B]/15 transition">
                  <ChevronLeft className="w-4 h-4" />
                </div>
              </div>

            </div>

            {/* Micro Concept Pills */}
            <div className="mt-4 pt-4 border-t border-[#1D1D1B]/10 flex flex-wrap gap-1.5">
              {lesson.whatYouWillLearn.slice(0, 3).map((item, i) => (
                <span key={i} className="text-[11px] bg-[#F9F7F2] text-[#1D1D1B]/80 px-2.5 py-1 border border-[#1D1D1B]/10 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-[#C4A484]" />
                  <span className="truncate max-w-xs">{item}</span>
                </span>
              ))}
            </div>
          </div>
        )))}
      </div>

    </div>
  );
};
