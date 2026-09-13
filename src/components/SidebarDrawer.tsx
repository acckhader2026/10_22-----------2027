import React from 'react';
import { 
  X, BookOpen, FileText, CheckCircle2, Award, Scale, PenTool, 
  Sparkles, Layers, ArrowLeft, BookmarkCheck, ChevronLeft, ShieldCheck,
  BookA, Brain, Printer, Check
} from 'lucide-react';
import { ActiveTab } from './Header';

interface SidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedUnit: 'unit-1' | 'unit-2' | 'unit-3' | 'unit-4';
  onSelectUnit: (unitId: 'unit-1' | 'unit-2' | 'unit-3' | 'unit-4') => void;
  currentLessonIndex: number;
  onSelectLesson: (lessonIndex: number) => void;
  onNavigateTab: (tab: ActiveTab) => void;
  onOpenMethodologyReport: (unitId: 'unit-1' | 'unit-2' | 'unit-3' | 'unit-4') => void;
  onOpenGlossary: () => void;
  onOpenStudentDashboard: () => void;
}

const unit1Lessons = [
  { num: 1, title: 'ماهية المحاسبة ومبادئها وأسس القياس', pages: 'ص 11 - 15', index: 0 },
  { num: 2, title: 'المعادلة المحاسبية وهيكل المركز المالي', pages: 'ص 16 - 17', index: 1 },
  { num: 3, title: 'قاعدة القيد المزدوج وحسابات الأستاذ T', pages: 'ص 18 - 20', index: 2 },
  { num: 4, title: 'ميزان المراجعة واكتشاف وتصحيح الأخطاء', pages: 'ص 21 - 22', index: 3 },
  { num: 5, title: 'من ميزان المراجعة إلى القوائم المالية', pages: 'ص 23 - 30', index: 4 },
  { num: 6, title: 'مهارات التفسير المدعوم بالأدلة (JRE 1)', pages: 'ص 31 - 34', index: 5 },
];

const unit2Lessons = [
  { num: 1, title: 'تحليل المعاملات المالية وأثرها المزدوج', pages: 'ص 35 - 41', index: 6 },
  { num: 2, title: 'قواعد القيد المزدوج ومنطق المدين والدائن', pages: 'ص 42 - 48', index: 7 },
  { num: 3, title: 'دفتر اليومية وحسابات الأستاذ والترصيد', pages: 'ص 49 - 57', index: 8 },
  { num: 4, title: 'ميزان المراجعة وتصحيح الأخطاء المحاسبية', pages: 'ص 58 - 65', index: 9 },
  { num: 5, title: 'التطبيق العملي المتكامل للدورة المحاسبية', pages: 'ص 66 - 72', index: 10 },
  { num: 6, title: 'التحقيق الاستقصائي ونزاهة التقارير (JRE 2)', pages: 'ص 73 - 78', index: 11 },
];

const unit3Lessons = [
  { num: 1, title: 'مقدمة إلى دفاتر اليومية المساعدة', pages: 'ص 59 - 62', index: 12 },
  { num: 2, title: 'دفاتر المبيعات والمشتريات الآجلة', pages: 'ص 63 - 67', index: 13 },
  { num: 3, title: 'دفاتر المردودات والخصومات', pages: 'ص 68 - 72', index: 14 },
  { num: 4, title: 'دفتر النقدية والمصروفات النثرية', pages: 'ص 73 - 76', index: 15 },
  { num: 5, title: 'تطبيق عملي فريدة للتجارة', pages: 'ص 77 - 81', index: 16 },
  { num: 6, title: 'التحقيق الاستقصائي (JRE 3)', pages: 'ص 82 - 88', index: 17 },
];

const unit4Lessons = [
  { num: 1, title: 'إعداد ميزان المراجعة وتأكيد الدقة الحسابية', pages: 'ص 89 - 93', index: 18 },
  { num: 2, title: 'الأخطاء المؤثرة على توازن ميزان المراجعة', pages: 'ص 94 - 97', index: 19 },
  { num: 3, title: 'الأخطاء غير المؤثرة على التوازن ومخاطرها', pages: 'ص 98 - 102', index: 20 },
  { num: 4, title: 'الحساب المعلق: شروط الفتح وقاعدة الأقل', pages: 'ص 103 - 106', index: 21 },
  { num: 5, title: 'قيود التصحيح وتصفير الحساب المعلق', pages: 'ص 107 - 110', index: 22 },
  { num: 6, title: 'دراسة حالة زيد للتجارة والتفسير (JRE 4)', pages: 'ص 111 - 118', index: 23 },
];

export const SidebarDrawer: React.FC<SidebarDrawerProps> = ({
  isOpen,
  onClose,
  selectedUnit,
  onSelectUnit,
  currentLessonIndex,
  onSelectLesson,
  onNavigateTab,
  onOpenMethodologyReport,
  onOpenGlossary,
  onOpenStudentDashboard
}) => {
  if (!isOpen) return null;

  const currentLessons = selectedUnit === 'unit-4' ? unit4Lessons : selectedUnit === 'unit-3' ? unit3Lessons : selectedUnit === 'unit-2' ? unit2Lessons : unit1Lessons;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-[#1D1D1B]/70 backdrop-blur-xs transition-opacity cursor-pointer animate-fade-in"
      />

      {/* Drawer Container (right side for RTL) */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-[#F9F7F2] text-[#1D1D1B] border-l-2 border-[#1D1D1B] shadow-2xl flex flex-col font-serif">
          
          {/* Drawer Top Header */}
          <div className="bg-[#1D1D1B] text-[#F9F7F2] p-4 flex items-center justify-between border-b-2 border-[#C4A484]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-[#C4A484] text-[#1D1D1B] flex items-center justify-center font-bold">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-tight">القائمة الجانبية وفهرس الوحدات</h3>
                <span className="text-[10px] text-[#C4A484] font-mono block">منهاج البكالوريا المصرية EB v2.0</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 bg-[#FFFFFF]/10 hover:bg-[#FFFFFF]/20 text-[#F9F7F2] transition cursor-pointer"
              title="إغلاق القائمة"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">

            {/* 1. Unit Selector Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1D1D1B]/80 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#C4A484]" />
                  <span>اختيار الوحدة الدراسية:</span>
                </span>
                <span className="text-[10px] font-mono bg-[#1D1D1B] text-[#C4A484] px-1.5 py-0.5 font-bold">
                  {selectedUnit === 'unit-4' ? 'الوحدة 4 نشطة' : selectedUnit === 'unit-3' ? 'الوحدة 3 نشطة' : selectedUnit === 'unit-2' ? 'الوحدة 2 نشطة' : 'الوحدة 1 نشطة'}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2">
                {/* Unit 4 Button */}
                <button
                  onClick={() => {
                    onSelectUnit('unit-4');
                    if (currentLessonIndex < 18) {
                      onSelectLesson(18);
                    }
                  }}
                  className={`p-3 text-right border transition cursor-pointer flex flex-col gap-1 ${
                    selectedUnit === 'unit-4'
                      ? 'bg-[#1D1D1B] text-[#F9F7F2] border-[#1D1D1B] shadow-xs'
                      : 'bg-[#FFFFFF] text-[#1D1D1B] hover:bg-[#FFFFFF]/80 border-[#1D1D1B]/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs">الوحدة الرابعة: ميزان المراجعة وتصحيح الأخطاء</span>
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 ${
                      selectedUnit === 'unit-4' ? 'bg-[#C4A484] text-[#1D1D1B]' : 'bg-[#F9F7F2] text-[#1D1D1B]/70'
                    }`}>
                      ص 89 - 118
                    </span>
                  </div>
                  <p className={`text-[11px] leading-tight ${selectedUnit === 'unit-4' ? 'text-[#F9F7F2]/75' : 'text-[#1D1D1B]/60'}`}>
                    التوازن المحاسبي، الأخطاء المؤثرة وغير المؤثرة، الحساب المعلق، و JRE 4 (6 دروس)
                  </p>
                </button>

                {/* Unit 3 Button */}
                <button
                  onClick={() => {
                    onSelectUnit('unit-3');
                    if (currentLessonIndex < 12 || currentLessonIndex >= 18) {
                      onSelectLesson(12);
                    }
                  }}
                  className={`p-3 text-right border transition cursor-pointer flex flex-col gap-1 ${
                    selectedUnit === 'unit-3'
                      ? 'bg-[#1D1D1B] text-[#F9F7F2] border-[#1D1D1B] shadow-xs'
                      : 'bg-[#FFFFFF] text-[#1D1D1B] hover:bg-[#FFFFFF]/80 border-[#1D1D1B]/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs">الوحدة الثالثة: الدفاتر المساعدة</span>
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 ${
                      selectedUnit === 'unit-3' ? 'bg-[#C4A484] text-[#1D1D1B]' : 'bg-[#F9F7F2] text-[#1D1D1B]/70'
                    }`}>
                      ص 79 - 120
                    </span>
                  </div>
                  <p className={`text-[11px] leading-tight ${selectedUnit === 'unit-3' ? 'text-[#F9F7F2]/75' : 'text-[#1D1D1B]/60'}`}>
                    دفاتر اليومية المتخصصة، المردودات، الخصم التجاري والنقدي، والنقدية و JRE 3 (6 دروس)
                  </p>
                </button>

                {/* Unit 2 Button */}
                <button
                  onClick={() => {
                    onSelectUnit('unit-2');
                    if (currentLessonIndex < 6 || currentLessonIndex >= 12) {
                      onSelectLesson(6);
                    }
                  }}
                  className={`p-3 text-right border transition cursor-pointer flex flex-col gap-1 ${
                    selectedUnit === 'unit-2'
                      ? 'bg-[#1D1D1B] text-[#F9F7F2] border-[#1D1D1B] shadow-xs'
                      : 'bg-[#FFFFFF] text-[#1D1D1B] hover:bg-[#FFFFFF]/80 border-[#1D1D1B]/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs">الوحدة الثانية: التسجيل المحاسبي والدورة المستندية</span>
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 ${
                      selectedUnit === 'unit-2' ? 'bg-[#C4A484] text-[#1D1D1B]' : 'bg-[#F9F7F2] text-[#1D1D1B]/70'
                    }`}>
                      ص 35 - 78
                    </span>
                  </div>
                  <p className={`text-[11px] leading-tight ${selectedUnit === 'unit-2' ? 'text-[#F9F7F2]/75' : 'text-[#1D1D1B]/60'}`}>
                    تحليل العمليات، القيد المزدوج، اليومية والأستاذ والترصيد، والأخطاء و JRE 2 (6 دروس)
                  </p>
                </button>

                {/* Unit 1 Button */}
                <button
                  onClick={() => {
                    onSelectUnit('unit-1');
                    if (currentLessonIndex >= 6) {
                      onSelectLesson(0);
                    }
                  }}
                  className={`p-3 text-right border transition cursor-pointer flex flex-col gap-1 ${
                    selectedUnit === 'unit-1'
                      ? 'bg-[#1D1D1B] text-[#F9F7F2] border-[#1D1D1B] shadow-xs'
                      : 'bg-[#FFFFFF] text-[#1D1D1B] hover:bg-[#FFFFFF]/80 border-[#1D1D1B]/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs">الوحدة الأولى: مدخل المحاسبة والمركز المالي</span>
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 ${
                      selectedUnit === 'unit-1' ? 'bg-[#C4A484] text-[#1D1D1B]' : 'bg-[#F9F7F2] text-[#1D1D1B]/70'
                    }`}>
                      ص 11 - 34
                    </span>
                  </div>
                  <p className={`text-[11px] leading-tight ${selectedUnit === 'unit-1' ? 'text-[#F9F7F2]/75' : 'text-[#1D1D1B]/60'}`}>
                    المفاهيم، المبادئ، المعادلة المحاسبية، وميزان المراجعة والقوائم المالية (6 دروس)
                  </p>
                </button>
              </div>
            </div>

            {/* 2. Lessons of the Selected Unit */}
            <div className="space-y-2">
              <div className="flex items-center justify-between border-b border-[#1D1D1B]/15 pb-1">
                <span className="text-xs font-bold text-[#1D1D1B] flex items-center gap-1.5">
                  <BookmarkCheck className="w-3.5 h-3.5 text-[#C4A484]" />
                  <span>فهرس دروس {selectedUnit === 'unit-4' ? 'الوحدة الرابعة (6 دروس)' : selectedUnit === 'unit-3' ? 'الوحدة الثالثة (6 دروس)' : selectedUnit === 'unit-2' ? 'الوحدة الثانية (6 دروس)' : 'الوحدة الأولى (6 دروس)'}:</span>
                </span>
                <span className="text-[10px] text-[#1D1D1B]/60">انقر للفتح الفوري</span>
              </div>

              <div className="space-y-1.5">
                {currentLessons.map((item) => {
                  const isCurrent = currentLessonIndex === item.index;
                  return (
                    <button
                      key={item.index}
                      onClick={() => {
                        onSelectLesson(item.index);
                        onNavigateTab('lessons');
                        onClose();
                      }}
                      className={`w-full p-2.5 text-right border transition cursor-pointer flex items-center justify-between gap-2 text-xs ${
                        isCurrent 
                          ? 'bg-[#1D1D1B] text-[#F9F7F2] border-[#1D1D1B] font-bold shadow-xs' 
                          : 'bg-[#FFFFFF] text-[#1D1D1B] hover:bg-[#FFFFFF]/90 border-[#1D1D1B]/15'
                      }`}
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <span className={`w-5 h-5 flex items-center justify-center text-[11px] font-bold shrink-0 ${
                          isCurrent ? 'bg-[#C4A484] text-[#1D1D1B]' : 'bg-[#F9F7F2] border border-[#1D1D1B]/20'
                        }`}>
                          {item.num}
                        </span>
                        <span className="truncate">{item.title}</span>
                      </div>
                      <span className={`text-[10px] font-mono shrink-0 px-1.5 py-0.2 ${
                        isCurrent ? 'text-[#C4A484]' : 'text-[#1D1D1B]/60'
                      }`}>
                        {item.pages}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Official Methodology & Alignment Reports (100%) */}
            <div className="bg-[#FFFFFF] border-2 border-[#1D1D1B] p-3 space-y-2.5 shadow-xs">
              <div className="flex items-center gap-2 text-[#1D1D1B]">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span className="text-xs font-bold">تقارير المطابقة المنهجية (100% معتمد)</span>
              </div>
              <p className="text-[11px] text-[#1D1D1B]/70 leading-relaxed">
                توثيق كامل لمطابقة كل مفهوم وناتج تعلم مع كتاب الوزارة الرسمي المعتمد:
              </p>
              
              <div className="grid grid-cols-1 gap-1.5 pt-1">
                <button
                  onClick={() => {
                    onOpenMethodologyReport('unit-1');
                    onClose();
                  }}
                  className="w-full text-right p-2 bg-[#F9F7F2] hover:bg-[#1D1D1B] hover:text-[#F9F7F2] text-[#1D1D1B] border border-[#1D1D1B]/20 text-[11px] font-bold transition flex flex-col gap-1.5 cursor-pointer group"
                >
                  <div className="flex items-start gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#C4A484] shrink-0 mt-0.5" />
                    <span className="leading-tight">توثيق شامل لمطابقة الكتاب الخارجي مع كتاب الوزارة الرسمي (الوحدة الأولى كاملة: ص 11 - 34)</span>
                  </div>
                  <div className="flex justify-end">
                    <span className="text-[10px] bg-emerald-100 text-emerald-900 group-hover:bg-emerald-700 group-hover:text-white px-1.5 py-0.5 font-mono font-bold border border-emerald-300">
                      معتمد 100%
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    onOpenMethodologyReport('unit-2');
                    onClose();
                  }}
                  className="w-full text-right p-2 bg-[#F9F7F2] hover:bg-[#1D1D1B] hover:text-[#F9F7F2] text-[#1D1D1B] border border-[#1D1D1B]/20 text-[11px] font-bold transition flex flex-col gap-1.5 cursor-pointer group"
                >
                  <div className="flex items-start gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#C4A484] shrink-0 mt-0.5" />
                    <span className="leading-tight">توثيق شامل لمطابقة الكتاب الخارجي مع كتاب الوزارة الرسمي (الوحدة الثانية كاملة: ص 35 - 78)</span>
                  </div>
                  <div className="flex justify-end">
                    <span className="text-[10px] bg-emerald-100 text-emerald-900 group-hover:bg-emerald-700 group-hover:text-white px-1.5 py-0.5 font-mono font-bold border border-emerald-300">
                      معتمد 100%
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    onOpenMethodologyReport('unit-3');
                    onClose();
                  }}
                  className="w-full text-right p-2 bg-[#F9F7F2] hover:bg-[#1D1D1B] hover:text-[#F9F7F2] text-[#1D1D1B] border border-[#1D1D1B]/20 text-[11px] font-bold transition flex flex-col gap-1.5 cursor-pointer group"
                >
                  <div className="flex items-start gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#C4A484] shrink-0 mt-0.5" />
                    <span className="leading-tight">توثيق شامل لمطابقة الكتاب الخارجي مع كتاب الوزارة الرسمي (الوحدة الثالثة كاملة: ص 79 - 120)</span>
                  </div>
                  <div className="flex justify-end">
                    <span className="text-[10px] bg-emerald-100 text-emerald-900 group-hover:bg-emerald-700 group-hover:text-white px-1.5 py-0.5 font-mono font-bold border border-emerald-300">
                      معتمد 100%
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* 4. Quick Sections Navigation */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#1D1D1B]/80 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-[#C4A484]" />
                <span>أقسام المنصة والورش التطبيقية:</span>
              </span>

              <div className="grid grid-cols-2 gap-1.5 text-xs">
                <button
                  onClick={() => {
                    onNavigateTab('simulator');
                    onClose();
                  }}
                  className="p-2 bg-[#FFFFFF] hover:bg-[#1D1D1B] hover:text-[#F9F7F2] text-[#1D1D1B] border border-[#1D1D1B]/15 text-right font-medium transition cursor-pointer flex items-center gap-1.5"
                >
                  <Scale className="w-3.5 h-3.5 text-[#C4A484]" />
                  <span>محاكي الحسابات T</span>
                </button>

                <button
                  onClick={() => {
                    onNavigateTab('jre_workshop');
                    onClose();
                  }}
                  className="p-2 bg-[#FFFFFF] hover:bg-[#1D1D1B] hover:text-[#F9F7F2] text-[#1D1D1B] border border-[#1D1D1B]/15 text-right font-medium transition cursor-pointer flex items-center gap-1.5"
                >
                  <PenTool className="w-3.5 h-3.5 text-[#C4A484]" />
                  <span>ورشة JRE (20 درجة)</span>
                </button>

                <button
                  onClick={() => {
                    onNavigateTab('review');
                    onClose();
                  }}
                  className="p-2 bg-[#FFFFFF] hover:bg-[#1D1D1B] hover:text-[#F9F7F2] text-[#1D1D1B] border border-[#1D1D1B]/15 text-right font-medium transition cursor-pointer flex items-center gap-1.5"
                >
                  <Layers className="w-3.5 h-3.5 text-[#C4A484]" />
                  <span>المراجعة الشاملة</span>
                </button>

                <button
                  onClick={() => {
                    onNavigateTab('qbank');
                    onClose();
                  }}
                  className="p-2 bg-[#FFFFFF] hover:bg-[#1D1D1B] hover:text-[#F9F7F2] text-[#1D1D1B] border border-[#1D1D1B]/15 text-right font-medium transition cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#C4A484]" />
                  <span>بنك الأسئلة (62+)</span>
                </button>

                <button
                  onClick={() => {
                    onNavigateTab('exams');
                    onClose();
                  }}
                  className="p-2 bg-[#FFFFFF] hover:bg-[#1D1D1B] hover:text-[#F9F7F2] text-[#1D1D1B] border border-[#1D1D1B]/15 text-right font-medium transition cursor-pointer flex items-center gap-1.5"
                >
                  <Award className="w-3.5 h-3.5 text-[#C4A484]" />
                  <span>الامتحانات المحاكية</span>
                </button>

                <button
                  onClick={() => {
                    onOpenGlossary();
                    onClose();
                  }}
                  className="p-2 bg-[#FFFFFF] hover:bg-[#1D1D1B] hover:text-[#F9F7F2] text-[#1D1D1B] border border-[#1D1D1B]/15 text-right font-medium transition cursor-pointer flex items-center gap-1.5"
                >
                  <BookA className="w-3.5 h-3.5 text-[#C4A484]" />
                  <span>قاموس المصطلحات</span>
                </button>
              </div>
            </div>

            {/* 5. Student Hub / Dashboard */}
            <div className="pt-2 border-t border-[#1D1D1B]/15 flex items-center justify-between gap-2">
              <button
                onClick={() => {
                  onOpenStudentDashboard();
                  onClose();
                }}
                className="w-full py-2 px-3 bg-[#1D1D1B] hover:bg-[#333333] text-[#F9F7F2] text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Brain className="w-3.5 h-3.5 text-[#C4A484]" />
                <span>لوحة إتقان الطالب والمسار التكيفي</span>
              </button>
            </div>

          </div>

          {/* Drawer Footer */}
          <div className="bg-[#1D1D1B] text-[#F9F7F2] p-3 text-center text-[10px] text-[#F9F7F2]/60 border-t border-[#1D1D1B]">
            منهاج المحاسبة المالية المعتمد • الصف الثاني الثانوي EB v2.0
          </div>

        </div>
      </div>
    </div>
  );
};
