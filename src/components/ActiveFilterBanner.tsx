import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Filter, X, RotateCcw, ExternalLink, Sparkles, BookOpen, 
  Scale, Layers, Target, ChevronLeft, ChevronDown 
} from 'lucide-react';
import { useCurriculumFilter } from '../context/CurriculumFilterContext';

export const ActiveFilterBanner: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    selectedUnit,
    selectedLesson,
    selectedLearningOutcome,
    selectedUnitId,
    selectedLessonId,
    selectedLearningOutcomeId,
    selectUnit,
    selectLesson,
    selectLearningOutcome,
    clearFilters,
    isFilterActive,
    matchingStats,
    openMobileDrawer,
    isSidebarCollapsed,
    toggleSidebarCollapse
  } = useCurriculumFilter();

  if (!isFilterActive) return null;

  const pathname = location.pathname;

  return (
    <div 
      id="active-curriculum-filter-banner"
      className="no-print bg-[#1D1D1B] text-[#F9F7F2] border-b-2 border-[#C4A484] px-4 py-2.5 shadow-md font-serif text-xs transition-all"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Filter Details and Chips */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 bg-[#C4A484] text-[#1D1D1B] px-2 py-0.5 font-bold tracking-wide uppercase text-[11px]">
            <Filter className="w-3.5 h-3.5" />
            <span>فلترة مفعلة لكامل المنصة</span>
          </div>

          {/* Unit Breadcrumb Chip */}
          {selectedUnit && (
            <div className="flex items-center gap-1 bg-[#2A2A28] border border-[#C4A484]/40 px-2 py-0.5">
              <span className="text-[#C4A484] font-bold">الوحدة:</span>
              <span className="font-bold text-[#F9F7F2] truncate max-w-[140px] sm:max-w-[200px]">
                {selectedUnit.titleAr.split(':')[0] || selectedUnit.titleAr}
              </span>
              <button
                onClick={() => selectUnit(null)}
                className="text-[#F9F7F2]/50 hover:text-rose-300 mr-0.5 cursor-pointer"
                title="إلغاء فلتر الوحدة"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Lesson Breadcrumb Chip */}
          {selectedLesson && (
            <div className="flex items-center gap-1 bg-[#2A2A28] border border-[#C4A484]/40 px-2 py-0.5">
              <span className="text-[#C4A484] font-bold">الدرس {selectedLesson.lessonNumber}:</span>
              <span className="font-bold text-[#F9F7F2] truncate max-w-[140px] sm:max-w-[220px]">
                {selectedLesson.titleAr}
              </span>
              <button
                onClick={() => selectLesson(selectedUnitId || 'unit-1', null)}
                className="text-[#F9F7F2]/50 hover:text-rose-300 mr-0.5 cursor-pointer"
                title="إلغاء فلتر الدرس"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Learning Outcome Chip */}
          {selectedLearningOutcome && (
            <div className="flex items-center gap-1 bg-[#C4A484]/20 border border-[#C4A484] px-2 py-0.5">
              <span className="text-[#C4A484] font-mono font-bold">{selectedLearningOutcome.code}:</span>
              <span className="font-bold text-[#F9F7F2] truncate max-w-[160px] sm:max-w-[280px]">
                {selectedLearningOutcome.titleAr}
              </span>
              <button
                onClick={() => selectLearningOutcome(selectedUnitId || 'unit-1', selectedLessonId || 'lesson-1', null)}
                className="text-[#F9F7F2]/60 hover:text-rose-300 mr-0.5 cursor-pointer"
                title="إلغاء فلتر ناتج التعلم"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Matching items count badge */}
          <span className="text-[#F9F7F2]/70 font-mono hidden md:inline text-[11px] bg-[#FFFFFF]/5 px-2 py-0.5 border border-[#FFFFFF]/10">
            {matchingStats.questionsCount} سؤالاً مطابقاً
          </span>
        </div>

        {/* Right: Quick actions to jump to the filtered content & clear filter */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Quick jump to question bank */}
          {!pathname.includes('/assessment/question-bank') && (
            <button
              onClick={() => navigate('/assessment/question-bank')}
              className="px-2.5 py-1 bg-[#FFFFFF]/10 hover:bg-[#FFFFFF]/20 text-[#F9F7F2] border border-[#FFFFFF]/20 flex items-center gap-1 text-[11px] transition cursor-pointer font-bold"
              title="عرض أسئلة بنك الأسئلة الموافقة للفلتر"
            >
              <Sparkles className="w-3 h-3 text-[#C4A484]" />
              <span>بنك الأسئلة المفلتر</span>
            </button>
          )}

          {/* Quick jump to lesson if lesson is selected */}
          {selectedLesson && selectedUnitId && !pathname.includes(`/lessons/${selectedLesson.id}`) && (
            <button
              onClick={() => navigate(`/curriculum/${selectedUnitId}/lessons/${selectedLesson.id}`)}
              className="px-2.5 py-1 bg-[#FFFFFF]/10 hover:bg-[#FFFFFF]/20 text-[#F9F7F2] border border-[#FFFFFF]/20 flex items-center gap-1 text-[11px] transition cursor-pointer font-bold"
              title="الانتقال إلى صفحة شرح الدرس"
            >
              <BookOpen className="w-3 h-3 text-[#C4A484]" />
              <span>شرح الدرس</span>
            </button>
          )}

          {/* Open/Toggle Sidebar button */}
          <button
            onClick={() => {
              if (window.innerWidth < 1024) {
                openMobileDrawer();
              } else if (isSidebarCollapsed) {
                toggleSidebarCollapse();
              }
            }}
            className="px-2 py-1 bg-[#2A2A28] hover:bg-[#333331] text-[#C4A484] border border-[#C4A484]/40 flex items-center gap-1 text-[11px] transition cursor-pointer font-bold"
            title="فتح قائمة المنهج لتعديل الفلتر"
          >
            <Layers className="w-3 h-3" />
            <span>تغيير الفلتر</span>
          </button>

          {/* Reset / Clear All Filter */}
          <button
            onClick={clearFilters}
            className="px-2.5 py-1 bg-rose-950/80 hover:bg-rose-900 text-rose-200 border border-rose-800 flex items-center gap-1 text-[11px] transition cursor-pointer font-bold"
            title="إلغاء جميع الفلاتر وعرض المنصة كاملة"
          >
            <RotateCcw className="w-3 h-3" />
            <span>إلغاء الفلترة</span>
          </button>
        </div>
      </div>
    </div>
  );
};
