import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  BookOpen, Compass, Scale, PenTool, Sparkles, Layers, 
  Award, Brain, Printer, ChevronLeft, ChevronDown, CheckCircle2 
} from 'lucide-react';
import { curriculumRegistry } from '../domain/curriculum/CurriculumRegistry';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLesson?: (lessonId: string) => void;
  onSelectUnit?: (unitId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const pathname = location.pathname;
  const units = curriculumRegistry.getUnits();

  const [expandedUnit, setExpandedUnit] = React.useState<'unit-1' | 'unit-2' | 'unit-3' | 'unit-4' | null>('unit-4');

  React.useEffect(() => {
    if (pathname.includes('/unit-4')) {
      setExpandedUnit('unit-4');
    } else if (pathname.includes('/unit-3')) {
      setExpandedUnit('unit-3');
    } else if (pathname.includes('/unit-2')) {
      setExpandedUnit('unit-2');
    } else if (pathname.includes('/unit-1')) {
      setExpandedUnit('unit-1');
    }
  }, [pathname]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-serif" dir="rtl">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-[#1D1D1B]/60 backdrop-blur-xs transition-opacity"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-sm bg-[#F9F7F2] border-l-2 border-[#1D1D1B] shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 bg-[#1D1D1B] text-[#F9F7F2] flex items-center justify-between border-b border-[#1D1D1B]">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#C4A484]" />
              <span className="font-bold text-sm">فهرس المحتوى والتنقل</span>
            </div>
            <button
              onClick={onClose}
              className="text-xs text-[#F9F7F2]/70 hover:text-white px-2 py-1 border border-[#F9F7F2]/20 cursor-pointer"
            >
              إغلاق ✕
            </button>
          </div>

          {/* Nav List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Primary Hub Links */}
            <div className="space-y-1">
              <div className="text-[11px] font-bold text-[#1D1D1B]/60 px-2 uppercase tracking-wider mb-2">
                الأقسام الرئيسية (المحاور الخمسة)
              </div>

              <NavLink
                to="/"
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 text-xs font-bold transition rounded-none ${
                    isActive && pathname === '/'
                      ? 'bg-[#1D1D1B] text-[#F9F7F2]'
                      : 'text-[#1D1D1B] hover:bg-[#C4A484]/20'
                  }`
                }
              >
                <span>الرئيسية</span>
                <ChevronLeft className="w-3.5 h-3.5" />
              </NavLink>

              <NavLink
                to="/curriculum"
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 text-xs font-bold transition rounded-none ${
                    isActive && pathname === '/curriculum'
                      ? 'bg-[#1D1D1B] text-[#F9F7F2]'
                      : 'text-[#1D1D1B] hover:bg-[#C4A484]/20'
                  }`
                }
              >
                <div className="flex items-center gap-2">
                  <Compass className="w-3.5 h-3.5 text-[#C4A484]" />
                  <span>المنهج والوحدات</span>
                </div>
                <ChevronLeft className="w-3.5 h-3.5" />
              </NavLink>

              <NavLink
                to="/training"
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 text-xs font-bold transition rounded-none ${
                    isActive || pathname.startsWith('/training')
                      ? 'bg-[#1D1D1B] text-[#F9F7F2]'
                      : 'text-[#1D1D1B] hover:bg-[#C4A484]/20'
                  }`
                }
              >
                <div className="flex items-center gap-2">
                  <Scale className="w-3.5 h-3.5 text-[#C4A484]" />
                  <span>التدريب والمحاكيات</span>
                </div>
                <ChevronLeft className="w-3.5 h-3.5" />
              </NavLink>

              <NavLink
                to="/assessment"
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 text-xs font-bold transition rounded-none ${
                    isActive || pathname.startsWith('/assessment')
                      ? 'bg-[#1D1D1B] text-[#F9F7F2]'
                      : 'text-[#1D1D1B] hover:bg-[#C4A484]/20'
                  }`
                }
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#C4A484]" />
                  <span>التقييم والامتحانات</span>
                </div>
                <ChevronLeft className="w-3.5 h-3.5" />
              </NavLink>

              <NavLink
                to="/my-path"
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 text-xs font-bold transition rounded-none ${
                    isActive || pathname.includes('/my-path')
                      ? 'bg-[#1D1D1B] text-[#F9F7F2]'
                      : 'text-[#1D1D1B] hover:bg-[#C4A484]/20'
                  }`
                }
              >
                <div className="flex items-center gap-2">
                  <Brain className="w-3.5 h-3.5 text-[#C4A484]" />
                  <span>مساري (الإتقان التكيفي)</span>
                </div>
                <ChevronLeft className="w-3.5 h-3.5" />
              </NavLink>
            </div>

            {/* Tree View for Units and Lessons */}
            <div className="space-y-3 pt-2 border-t border-[#1D1D1B]/15">
              <div className="text-[11px] font-bold text-[#1D1D1B]/60 px-2 uppercase tracking-wider">
                الدروس التفصيلية ({units.reduce((acc, u) => acc + u.lessons.length, 0)} درساً)
              </div>

              {units.map((unit) => {
                const isExpanded = expandedUnit === unit.id;
                const unitSlug = unit.id;

                return (
                  <div key={unit.id} className="border border-[#1D1D1B]/20 bg-white">
                    <button
                      onClick={() => setExpandedUnit(isExpanded ? null : (unit.id as any))}
                      className="w-full px-3 py-2 bg-[#1D1D1B]/5 hover:bg-[#1D1D1B]/10 flex items-center justify-between text-xs font-bold text-[#1D1D1B] transition cursor-pointer"
                    >
                      <span className="line-clamp-1">{unit.titleAr}</span>
                      {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
                    </button>

                    {isExpanded && (
                      <div className="divide-y divide-[#1D1D1B]/10 bg-white">
                        <NavLink
                          to={`/curriculum/${unitSlug}`}
                          onClick={onClose}
                          className={({ isActive }) =>
                            `block px-3 py-1.5 text-[11px] font-bold transition ${
                              isActive
                                ? 'bg-[#C4A484]/30 text-[#1D1D1B]'
                                : 'text-[#1D1D1B]/70 hover:bg-[#F9F7F2]'
                            }`
                          }
                        >
                          خريطة الوحدة ومخرجات التعلم ←
                        </NavLink>

                        {unit.lessons.map((lesson, lIdx) => {
                          const lessonPath = `/curriculum/${unitSlug}/lessons/${lesson.id}`;
                          const isCurrent = pathname === lessonPath;

                          return (
                            <NavLink
                              key={lesson.id}
                              to={lessonPath}
                              onClick={onClose}
                              aria-current={isCurrent ? 'page' : undefined}
                              className={`flex items-start gap-2 px-3 py-2 text-xs transition ${
                                isCurrent
                                  ? 'bg-[#1D1D1B] text-[#F9F7F2] font-bold'
                                  : 'text-[#1D1D1B]/80 hover:bg-[#F9F7F2]'
                              }`}
                            >
                              <span className={`w-4 h-4 flex items-center justify-center font-bold text-[9px] shrink-0 mt-0.5 ${
                                isCurrent ? 'bg-[#C4A484] text-[#1D1D1B]' : 'bg-[#1D1D1B]/10 text-[#1D1D1B]'
                              }`}>
                                {lIdx + 1}
                              </span>
                              <span className="line-clamp-2 leading-relaxed">
                                {lesson.titleAr}
                              </span>
                            </NavLink>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Print Link */}
          <div className="p-4 bg-[#F9F7F2] border-t border-[#1D1D1B]/20 flex items-center justify-between text-xs">
            <NavLink
              to="/print"
              onClick={onClose}
              className="text-[#1D1D1B] font-bold hover:text-[#C4A484] flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>تصدير وطباعة (PDF)</span>
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};
