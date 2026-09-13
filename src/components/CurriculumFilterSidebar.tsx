import React, { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Layers, BookOpen, ChevronDown, ChevronLeft, ChevronRight, 
  Search, X, Check, Filter, Sparkles, Target, Compass, 
  Scale, Award, RotateCcw, PanelLeftClose, PanelLeftOpen, 
  ExternalLink, CheckCircle2
} from 'lucide-react';
import { curriculumRegistry } from '../domain/curriculum/CurriculumRegistry';
import { useCurriculumFilter } from '../context/CurriculumFilterContext';
import { TaxonomyLevel } from '../domain/curriculum/CurriculumModel';

interface CurriculumFilterSidebarProps {
  // Can be rendered in a docked layout or inside a modal/drawer
  className?: string;
  isDrawer?: boolean;
  onCloseDrawer?: () => void;
}

export const CurriculumFilterSidebar: React.FC<CurriculumFilterSidebarProps> = ({
  className = '',
  isDrawer = false,
  onCloseDrawer
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    selectedUnitId,
    selectedLessonId,
    selectedLearningOutcomeId,
    isSidebarCollapsed,
    toggleSidebarCollapse,
    selectUnit,
    selectLesson,
    selectLearningOutcome,
    clearFilters,
    isFilterActive,
    matchingStats
  } = useCurriculumFilter();

  const units = useMemo(() => curriculumRegistry.getUnits(), []);

  // Accordion open states
  const [expandedUnits, setExpandedUnits] = useState<Record<string, boolean>>({
    'unit-1': true,
    'unit-2': false,
    'unit-3': false
  });

  const [expandedLessons, setExpandedLessons] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Auto-expand active unit and lesson
  React.useEffect(() => {
    if (selectedUnitId) {
      setExpandedUnits(prev => ({ ...prev, [selectedUnitId]: true }));
    }
    if (selectedLessonId) {
      setExpandedLessons(prev => ({ ...prev, [selectedLessonId]: true }));
    }
  }, [selectedUnitId, selectedLessonId]);

  const toggleUnitExpand = (unitId: string) => {
    setExpandedUnits(prev => ({ ...prev, [unitId]: !prev[unitId] }));
  };

  const toggleLessonExpand = (lessonId: string) => {
    setExpandedLessons(prev => ({ ...prev, [lessonId]: !prev[lessonId] }));
  };

  const getTaxonomyLabel = (tax?: TaxonomyLevel) => {
    switch (tax) {
      case 'Remember': return { label: 'تذكر', bg: 'bg-blue-100 text-blue-900 border-blue-300' };
      case 'Understand': return { label: 'فهم', bg: 'bg-emerald-100 text-emerald-900 border-emerald-300' };
      case 'Apply': return { label: 'تطبيق', bg: 'bg-amber-100 text-amber-900 border-amber-300' };
      case 'Analyze': return { label: 'تحليل', bg: 'bg-purple-100 text-purple-900 border-purple-300' };
      case 'Evaluate': return { label: 'تقييم', bg: 'bg-rose-100 text-rose-900 border-rose-300' };
      case 'Create': return { label: 'تركيب', bg: 'bg-indigo-100 text-indigo-900 border-indigo-300' };
      default: return { label: 'معرفي', bg: 'bg-neutral-100 text-neutral-800 border-neutral-300' };
    }
  };

  // Filter units and lessons if search query is entered
  const filteredUnits = useMemo(() => {
    if (!searchQuery.trim()) return units;
    const query = searchQuery.toLowerCase().trim();

    return units.map(unit => {
      const unitMatches = unit.titleAr.toLowerCase().includes(query) || (unit.descriptionAr && unit.descriptionAr.toLowerCase().includes(query));
      
      const filteredLessons = unit.lessons.filter(lesson => {
        const lessonMatches = lesson.titleAr.toLowerCase().includes(query) || (lesson.subtitleAr && lesson.subtitleAr.toLowerCase().includes(query));
        const objMatches = lesson.objectives?.some(obj => 
          obj.titleAr.toLowerCase().includes(query) || obj.code.toLowerCase().includes(query)
        );
        return lessonMatches || objMatches || unitMatches;
      });

      return {
        ...unit,
        lessons: filteredLessons,
        hasMatches: unitMatches || filteredLessons.length > 0
      };
    }).filter(u => u.hasMatches);
  }, [units, searchQuery]);

  // Navigate to a lesson directly
  const handleNavigateToLesson = (unitId: string, lessonId: string) => {
    navigate(`/curriculum/${unitId}/lessons/${lessonId}`);
    if (onCloseDrawer) onCloseDrawer();
  };

  // Compact / Collapsed View on Desktop
  if (isSidebarCollapsed && !isDrawer) {
    return (
      <aside 
        id="curriculum-sidebar-collapsed"
        className="w-14 bg-[#FFFFFF] border-l-2 border-[#1D1D1B] flex flex-col items-center py-4 space-y-4 shrink-0 shadow-xs z-30 transition-all font-serif select-none"
        dir="rtl"
        aria-label="قائمة تصفية المنهج المنطوية"
      >
        {/* Expand Toggle Button */}
        <button
          onClick={toggleSidebarCollapse}
          className="w-9 h-9 flex items-center justify-center bg-[#1D1D1B] text-[#F9F7F2] hover:bg-[#C4A484] hover:text-[#1D1D1B] transition shadow-xs cursor-pointer"
          title="فرد القائمة الجانبية لتصفية المنهج"
          aria-label="فرد القائمة الجانبية"
        >
          <PanelLeftOpen className="w-5 h-5" />
        </button>

        {/* Filter State Indicator */}
        <div className="flex flex-col items-center gap-1">
          <div 
            className={`w-9 h-9 flex items-center justify-center border transition ${
              isFilterActive 
                ? 'bg-[#C4A484] text-[#1D1D1B] border-[#1D1D1B] font-bold' 
                : 'bg-[#F9F7F2] text-[#1D1D1B]/60 border-[#1D1D1B]/20'
            }`}
            title={isFilterActive ? 'الفلترة نشطة حالياً' : 'تصفح كافة المحتويات'}
          >
            <Filter className="w-4 h-4" />
          </div>
          {isFilterActive && (
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
          )}
        </div>

        {/* Units Icon Buttons */}
        <div className="flex flex-col items-center gap-2 pt-2 border-t border-[#1D1D1B]/15 w-full">
          {units.map((u, idx) => {
            const isSelected = selectedUnitId === u.id;
            return (
              <button
                key={u.id}
                onClick={() => {
                  selectUnit(isSelected ? null : u.id);
                  toggleSidebarCollapse();
                }}
                className={`w-9 h-9 flex items-center justify-center text-xs font-bold font-mono transition border cursor-pointer ${
                  isSelected 
                    ? 'bg-[#1D1D1B] text-[#C4A484] border-[#1D1D1B] shadow-xs' 
                    : 'bg-[#F9F7F2] text-[#1D1D1B] hover:bg-[#C4A484]/30 border-[#1D1D1B]/20'
                }`}
                title={`${u.titleAr} (انقر للاختيار والفرد)`}
              >
                و{idx + 1}
              </button>
            );
          })}
        </div>

        {/* Clear Filter if active */}
        {isFilterActive && (
          <div className="pt-2 border-t border-[#1D1D1B]/15">
            <button
              onClick={clearFilters}
              className="w-9 h-9 flex items-center justify-center bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 transition cursor-pointer"
              title="إلغاء جميع الفلاتر"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        )}
      </aside>
    );
  }

  // Expanded Sidebar View
  return (
    <aside 
      id="curriculum-sidebar-expanded"
      className={`w-80 lg:w-96 bg-[#FFFFFF] border-l-2 border-[#1D1D1B] flex flex-col h-full shrink-0 shadow-md font-serif ${className}`}
      dir="rtl"
      aria-label="قائمة المنهج ونواتج التعلم وتصفية المحتوى"
    >
      {/* Top Header */}
      <div className="p-4 bg-[#1D1D1B] text-[#F9F7F2] border-b border-[#1D1D1B] flex items-center justify-between gap-2 select-none">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#C4A484] text-[#1D1D1B] flex items-center justify-center font-bold">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-[#F9F7F2] leading-tight">
              تصفية المنهج والمحتوى
            </h3>
            <p className="text-[11px] text-[#C4A484]">
              اختر وحدة أو درساً أو ناتج تعلم
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Collapse toggle button */}
          {!isDrawer && (
            <button
              onClick={toggleSidebarCollapse}
              className="p-1.5 text-[#F9F7F2]/80 hover:text-white hover:bg-[#FFFFFF]/10 transition border border-[#F9F7F2]/20 cursor-pointer"
              title="طي القائمة الجانبية (تصغير الحجم)"
              aria-label="طي القائمة الجانبية"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          )}

          {/* Drawer Close Button if in mobile drawer */}
          {isDrawer && onCloseDrawer && (
            <button
              onClick={onCloseDrawer}
              className="p-1.5 text-[#F9F7F2]/80 hover:text-white hover:bg-[#FFFFFF]/10 transition border border-[#F9F7F2]/20 cursor-pointer"
              title="إغلاق القائمة"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Active Filter Banner in Sidebar */}
      {isFilterActive && (
        <div className="p-3 bg-[#F9F7F2] border-b-2 border-[#C4A484] space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#1D1D1B]">
              <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block animate-pulse" />
              <span>نطاق الفلترة المطبق حالياً:</span>
            </div>
            <button
              onClick={clearFilters}
              className="text-[11px] text-rose-700 hover:text-rose-900 font-bold flex items-center gap-1 px-2 py-0.5 border border-rose-200 bg-rose-50 hover:bg-rose-100 transition cursor-pointer"
              title="إلغاء جميع الفلاتر وعرض كافة محتويات المنصة"
            >
              <RotateCcw className="w-3 h-3" />
              <span>إلغاء الفلترة</span>
            </button>
          </div>

          <div className="space-y-1 text-xs">
            {selectedUnitId && (
              <div className="flex items-center justify-between gap-1 bg-[#FFFFFF] p-1.5 border border-[#1D1D1B]/15">
                <span className="font-bold text-[#1D1D1B] truncate">
                  🏛️ {units.find(u => u.id === selectedUnitId)?.titleAr}
                </span>
                <button
                  onClick={() => selectUnit(null)}
                  className="text-neutral-400 hover:text-rose-600 p-0.5"
                  title="إلغاء فلتر الوحدة"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {selectedLessonId && (
              <div className="flex items-center justify-between gap-1 bg-[#FFFFFF] p-1.5 border border-[#1D1D1B]/15">
                <span className="font-bold text-[#1D1D1B] truncate">
                  📖 {units.flatMap(u => u.lessons).find(l => l.id === selectedLessonId)?.titleAr}
                </span>
                <button
                  onClick={() => selectLesson(selectedUnitId || 'unit-1', null)}
                  className="text-neutral-400 hover:text-rose-600 p-0.5"
                  title="إلغاء فلتر الدرس"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {selectedLearningOutcomeId && (
              <div className="flex items-center justify-between gap-1 bg-[#FFFFFF] p-1.5 border border-[#1D1D1B]/15">
                <span className="font-bold text-[#1D1D1B] truncate text-[11px]">
                  🎯 {units.flatMap(u => u.lessons).flatMap(l => l.objectives).find(o => o.id === selectedLearningOutcomeId)?.code}: {units.flatMap(u => u.lessons).flatMap(l => l.objectives).find(o => o.id === selectedLearningOutcomeId)?.titleAr}
                </span>
                <button
                  onClick={() => selectLearningOutcome(selectedUnitId || 'unit-1', selectedLessonId || 'lesson-1', null)}
                  className="text-neutral-400 hover:text-rose-600 p-0.5"
                  title="إلغاء فلتر ناتج التعلم"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          <div className="text-[11px] text-[#1D1D1B]/70 flex items-center justify-between pt-1 border-t border-[#1D1D1B]/10 font-mono">
            <span>البنود المطابقة:</span>
            <span>{matchingStats.questionsCount} سؤالاً • {matchingStats.lessonsCount} درساً</span>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="p-3 border-b border-[#1D1D1B]/15 bg-[#FFFFFF]">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث في الوحدات والدروس ونواتج التعلم..."
            className="w-full pl-8 pr-8 py-1.5 text-xs bg-[#F9F7F2] border border-[#1D1D1B]/20 focus:border-[#1D1D1B] focus:outline-hidden placeholder:text-[#1D1D1B]/40"
          />
          <Search className="w-3.5 h-3.5 text-[#1D1D1B]/50 absolute right-2.5 top-2.5" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute left-2.5 top-2.5 text-[#1D1D1B]/50 hover:text-[#1D1D1B]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Curriculum Units & Lessons Accordion List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 divide-y divide-[#1D1D1B]/10">
        {/* Button to Clear Filter & Show Everything */}
        <button
          onClick={clearFilters}
          className={`w-full py-2 px-3 text-xs font-bold flex items-center justify-between border transition cursor-pointer ${
            !isFilterActive
              ? 'bg-[#1D1D1B] text-[#F9F7F2] border-[#1D1D1B] shadow-xs'
              : 'bg-[#F9F7F2] hover:bg-[#1D1D1B]/5 text-[#1D1D1B] border-[#1D1D1B]/20'
          }`}
        >
          <div className="flex items-center gap-2">
            <Compass className="w-3.5 h-3.5 text-[#C4A484]" />
            <span>عرض كافة محتويات المنصة (الكل)</span>
          </div>
          {!isFilterActive && <Check className="w-4 h-4 text-[#C4A484]" />}
        </button>

        {/* Units List */}
        <div className="pt-3 space-y-3">
          <div className="text-[11px] font-bold text-[#1D1D1B]/60 px-1 uppercase tracking-wider">
            الوحدات الدراسية المعتمدة ({filteredUnits.length})
          </div>

          {filteredUnits.map((unit) => {
            const isUnitSelected = selectedUnitId === unit.id && !selectedLessonId && !selectedLearningOutcomeId;
            const isUnitActiveParent = selectedUnitId === unit.id;
            const isExpanded = expandedUnits[unit.id] ?? false;

            return (
              <div 
                key={unit.id}
                className={`border transition ${
                  isUnitActiveParent 
                    ? 'border-[#1D1D1B] shadow-xs bg-white' 
                    : 'border-[#1D1D1B]/20 bg-white hover:border-[#1D1D1B]/40'
                }`}
              >
                {/* Unit Header Row */}
                <div className={`p-2.5 flex items-center justify-between gap-2 ${
                  isUnitSelected ? 'bg-[#C4A484]/25 border-b border-[#1D1D1B]/20' : 'bg-[#F9F7F2]/60'
                }`}>
                  <button
                    onClick={() => toggleUnitExpand(unit.id)}
                    className="flex-1 flex items-center gap-2 text-right cursor-pointer"
                  >
                    <span className="w-6 h-6 bg-[#1D1D1B] text-[#C4A484] flex items-center justify-center font-bold text-xs font-mono shrink-0">
                      {unit.unitNumber || 1}
                    </span>
                    <div className="min-w-0">
                      <div className="font-bold text-xs text-[#1D1D1B] line-clamp-1">
                        {unit.titleAr}
                      </div>
                      <div className="text-[10px] text-[#1D1D1B]/60 font-mono">
                        {unit.lessons.length} دروس • {unit.lessons.reduce((acc, l) => acc + (l.objectives?.length || 0), 0)} ناتج تعلم
                      </div>
                    </div>
                  </button>

                  <div className="flex items-center gap-1 shrink-0">
                    {/* Select Unit Filter Button */}
                    <button
                      onClick={() => selectUnit(unit.id)}
                      className={`px-2 py-1 text-[11px] font-bold border transition cursor-pointer ${
                        isUnitSelected
                          ? 'bg-[#1D1D1B] text-[#F9F7F2] border-[#1D1D1B]'
                          : 'bg-[#FFFFFF] hover:bg-[#C4A484]/20 text-[#1D1D1B] border-[#1D1D1B]/20'
                      }`}
                      title="تطبيق الفلترة على كامل هذه الوحدة"
                    >
                      {isUnitSelected ? 'الوحدة مفلترة ✓' : 'فلترة الوحدة'}
                    </button>

                    {/* Expand/Collapse Chevron */}
                    <button
                      onClick={() => toggleUnitExpand(unit.id)}
                      className="p-1 hover:bg-[#1D1D1B]/10 transition text-[#1D1D1B]/70"
                    >
                      {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Lessons List inside Unit */}
                {isExpanded && (
                  <div className="divide-y divide-[#1D1D1B]/10 bg-white">
                    {unit.lessons.map((lesson) => {
                      const isLessonSelected = selectedUnitId === unit.id && selectedLessonId === lesson.id && !selectedLearningOutcomeId;
                      const isLessonActiveParent = selectedUnitId === unit.id && selectedLessonId === lesson.id;
                      const isLessonExpanded = expandedLessons[lesson.id] ?? false;

                      return (
                        <div 
                          key={lesson.id} 
                          className={`p-2 transition ${
                            isLessonSelected ? 'bg-[#C4A484]/15' : 'hover:bg-[#F9F7F2]'
                          }`}
                        >
                          {/* Lesson Row */}
                          <div className="flex items-start justify-between gap-2">
                            <button
                              onClick={() => toggleLessonExpand(lesson.id)}
                              className="flex-1 flex items-start gap-2 text-right cursor-pointer"
                            >
                              <span className={`w-5 h-5 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5 ${
                                isLessonActiveParent 
                                  ? 'bg-[#1D1D1B] text-[#F9F7F2]' 
                                  : 'bg-[#1D1D1B]/10 text-[#1D1D1B]'
                              }`}>
                                {lesson.lessonNumber}
                              </span>
                              <div className="min-w-0">
                                <div className={`text-xs leading-snug line-clamp-2 ${
                                  isLessonActiveParent ? 'font-bold text-[#1D1D1B]' : 'text-[#1D1D1B]/85'
                                }`}>
                                  {lesson.titleAr}
                                </div>
                                <div className="text-[10px] text-[#1D1D1B]/50 flex items-center gap-2 mt-0.5">
                                  <span>ص {lesson.textbookPages[0]}-{lesson.textbookPages[1]}</span>
                                  <span>•</span>
                                  <span>{lesson.objectives?.length || 0} نواتج تعلم</span>
                                </div>
                              </div>
                            </button>

                            <div className="flex items-center gap-1 shrink-0">
                              {/* Filter this Lesson Button */}
                              <button
                                onClick={() => selectLesson(unit.id, lesson.id)}
                                className={`px-2 py-0.5 text-[10px] font-bold border transition cursor-pointer ${
                                  isLessonSelected
                                    ? 'bg-[#1D1D1B] text-[#F9F7F2] border-[#1D1D1B]'
                                    : 'bg-[#FFFFFF] hover:bg-[#C4A484]/20 text-[#1D1D1B] border-[#1D1D1B]/20'
                                }`}
                                title="تطبيق الفلترة على هذا الدرس ومشتملاته"
                              >
                                {isLessonSelected ? 'الدرس مفلتر ✓' : 'فلترة'}
                              </button>

                              {/* Navigate to Lesson Page Button */}
                              <button
                                onClick={() => handleNavigateToLesson(unit.id, lesson.id)}
                                className="p-1 hover:bg-[#1D1D1B]/10 transition text-[#1D1D1B]/70"
                                title="الانتقال لصفحة الدرس الكاملة"
                              >
                                <ExternalLink className="w-3 h-3" />
                              </button>

                              {/* Toggle Objectives Button */}
                              <button
                                onClick={() => toggleLessonExpand(lesson.id)}
                                className="p-1 hover:bg-[#1D1D1B]/10 transition text-[#1D1D1B]/70"
                                title="عرض نواتج التعلم التفصيلية"
                              >
                                {isLessonExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </div>

                          {/* Learning Outcomes List (نواتج التعلم) */}
                          {isLessonExpanded && lesson.objectives && lesson.objectives.length > 0 && (
                            <div className="mt-2 mr-6 pl-2 space-y-1.5 border-r-2 border-[#C4A484]/40 pt-1">
                              <div className="text-[10px] font-bold text-[#1D1D1B]/60 mb-1 flex items-center gap-1">
                                <Target className="w-3 h-3 text-[#C4A484]" />
                                <span>نواتج التعلم (LOs) في هذا الدرس:</span>
                              </div>

                              {lesson.objectives.map((obj) => {
                                const isLOSelected = selectedLearningOutcomeId === obj.id;
                                const taxBadge = getTaxonomyLabel(obj.taxonomy);

                                return (
                                  <div
                                    key={obj.id}
                                    className={`p-1.5 border text-right transition flex items-start justify-between gap-1.5 ${
                                      isLOSelected
                                        ? 'bg-[#1D1D1B] text-[#F9F7F2] border-[#1D1D1B]'
                                        : 'bg-[#F9F7F2] hover:bg-[#FFFFFF] text-[#1D1D1B] border-[#1D1D1B]/10'
                                    }`}
                                  >
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                                        <span className={`px-1.5 py-0.2 text-[9px] font-mono font-bold border ${
                                          isLOSelected ? 'bg-[#C4A484] text-[#1D1D1B] border-[#C4A484]' : 'bg-[#1D1D1B] text-[#F9F7F2] border-[#1D1D1B]'
                                        }`}>
                                          {obj.code}
                                        </span>
                                        <span className={`px-1 py-0.2 text-[9px] font-bold border ${taxBadge.bg}`}>
                                          {taxBadge.label}
                                        </span>
                                      </div>
                                      <p className="text-[11px] leading-relaxed line-clamp-2 font-medium">
                                        {obj.titleAr}
                                      </p>
                                    </div>

                                    <button
                                      onClick={() => selectLearningOutcome(unit.id, lesson.id, obj.id)}
                                      className={`px-1.5 py-1 text-[10px] font-bold shrink-0 border transition cursor-pointer ${
                                        isLOSelected
                                          ? 'bg-[#C4A484] text-[#1D1D1B] border-[#C4A484]'
                                          : 'bg-white text-[#1D1D1B] hover:bg-[#C4A484]/30 border-[#1D1D1B]/20'
                                      }`}
                                      title={`تصفية المنصة بناتج التعلم ${obj.code}`}
                                    >
                                      {isLOSelected ? 'محدد ✓' : 'تحديد'}
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Quick Hub Shortcuts */}
      <div className="p-3 bg-[#F9F7F2] border-t border-[#1D1D1B]/20 space-y-2">
        <div className="text-[10px] font-bold text-[#1D1D1B]/60 uppercase tracking-wider">
          انتقال سريع بالمحتوى المفلتر:
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            onClick={() => {
              navigate('/assessment/question-bank');
              if (onCloseDrawer) onCloseDrawer();
            }}
            className="py-1.5 px-2 bg-[#FFFFFF] hover:bg-[#1D1D1B] hover:text-[#F9F7F2] text-[#1D1D1B] border border-[#1D1D1B]/20 font-bold transition flex items-center justify-center gap-1 text-[11px] cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-[#C4A484]" />
            <span>بنك الأسئلة</span>
          </button>

          <button
            onClick={() => {
              navigate('/training');
              if (onCloseDrawer) onCloseDrawer();
            }}
            className="py-1.5 px-2 bg-[#FFFFFF] hover:bg-[#1D1D1B] hover:text-[#F9F7F2] text-[#1D1D1B] border border-[#1D1D1B]/20 font-bold transition flex items-center justify-center gap-1 text-[11px] cursor-pointer"
          >
            <Scale className="w-3 h-3 text-[#C4A484]" />
            <span>المحاكاة والتدريب</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
