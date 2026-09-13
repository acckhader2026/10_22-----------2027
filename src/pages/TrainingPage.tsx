import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Scale, PenTool, Dumbbell, Sparkles, ArrowLeft, BookOpen, FileText } from 'lucide-react';
import { AccountingSimulator } from '../components/AccountingSimulator';
import { JRETalker } from '../components/JRETalker';
import { DocumentaryCycleSimulator } from '../components/DocumentaryCycleSimulator';

export const TrainingPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  const activeSubTab = path.includes('/documentary-cycle')
    ? 'documentary-cycle'
    : path.includes('/jre') 
    ? 'jre' 
    : path.includes('/simulators') 
    ? 'simulator' 
    : path.includes('/exercises') 
    ? 'exercises' 
    : 'overview';

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 font-serif" dir="rtl">
      {/* Subnavigation Bar */}
      <div className="bg-white border-2 border-[#1D1D1B] p-3 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="bg-[#1D1D1B] text-[#C4A484] text-xs font-bold px-2.5 py-1">
            ورش العمل والمحاكاة التفاعلية
          </span>
          <span className="text-xs text-[#1D1D1B]/70 font-bold hidden sm:inline">
            التطبيق الميداني لمنهجية البكالوريا المصرية
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <NavLink
            to="/training/documentary-cycle"
            className={({ isActive }) => 
              `px-3 py-1.5 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                isActive || activeSubTab === 'documentary-cycle'
                  ? 'bg-[#1D1D1B] text-[#F9F7F2]'
                  : 'bg-[#F9F7F2] text-[#1D1D1B] hover:bg-[#C4A484]/20 border border-[#1D1D1B]/15'
              }`
            }
          >
            <FileText className="w-3.5 h-3.5 text-[#C4A484]" />
            <span>محاكي الدورة المستندية (مصادر القيد)</span>
          </NavLink>

          <NavLink
            to="/training/simulators"
            className={({ isActive }) => 
              `px-3 py-1.5 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                isActive || activeSubTab === 'simulator'
                  ? 'bg-[#1D1D1B] text-[#F9F7F2]'
                  : 'bg-[#F9F7F2] text-[#1D1D1B] hover:bg-[#C4A484]/20 border border-[#1D1D1B]/15'
              }`
            }
          >
            <Scale className="w-3.5 h-3.5 text-[#C4A484]" />
            <span>المحاكي المحاسبي الشامل (Accounting Simulator)</span>
          </NavLink>

          <NavLink
            to="/training/jre"
            className={({ isActive }) => 
              `px-3 py-1.5 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                isActive || activeSubTab === 'jre'
                  ? 'bg-[#1D1D1B] text-[#F9F7F2]'
                  : 'bg-[#F9F7F2] text-[#1D1D1B] hover:bg-[#C4A484]/20 border border-[#1D1D1B]/15'
              }`
            }
          >
            <PenTool className="w-3.5 h-3.5 text-[#C4A484]" />
            <span>ورشة التفسير المحاسبي JRE (20 درجة)</span>
          </NavLink>

          <NavLink
            to="/training/exercises"
            className={({ isActive }) => 
              `px-3 py-1.5 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                isActive || activeSubTab === 'exercises'
                  ? 'bg-[#1D1D1B] text-[#F9F7F2]'
                  : 'bg-[#F9F7F2] text-[#1D1D1B] hover:bg-[#C4A484]/20 border border-[#1D1D1B]/15'
              }`
            }
          >
            <Dumbbell className="w-3.5 h-3.5 text-[#C4A484]" />
            <span>التدريبات التطبيقية المتكاملة</span>
          </NavLink>
        </div>
      </div>

      {/* Render Component based on Sub-Route */}
      {activeSubTab === 'documentary-cycle' && (
        <DocumentaryCycleSimulator 
          onNavigateToJournal={(seed) => {
            navigate('/training/simulators', { state: { seedTransaction: seed } });
          }} 
        />
      )}

      {activeSubTab === 'simulator' && <AccountingSimulator />}

      {activeSubTab === 'jre' && <JRETalker />}

      {(activeSubTab === 'exercises' || activeSubTab === 'overview') && (
        <div className="space-y-8">
          <div className="bg-white border-2 border-[#1D1D1B] p-6 sm:p-8 space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-[#1D1D1B]">
                منظومة التدريب العملي والمحاكاة المحاسبية
              </h2>
              <p className="text-sm text-[#1D1D1B]/70 leading-relaxed">
                التسلسل التعليمي المعتمد: يبدأ من فحص المستند المؤيد في الدورة المستندية، ثم تسجيل القيود في دفتر اليومية وترحيلها لحسابات الأستاذ وميزان المراجعة، وصولاً إلى صياغة التفسير المحاسبي المدعوم بالأدلة (JRE).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              {/* Card 1: Documentary Cycle */}
              <div 
                onClick={() => navigate('/training/documentary-cycle')}
                className="bg-[#F9F7F2] border border-[#1D1D1B]/20 p-6 space-y-4 hover:border-[#1D1D1B] transition cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 bg-[#8A1F1D] text-white flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold bg-[#B45309]/15 text-[#B45309] border border-[#B45309]/30 px-2.5 py-0.5">إثرائي</span>
                </div>
                <h3 className="text-lg font-bold text-[#1D1D1B] group-hover:text-[#8A1F1D] transition-colors">
                  محاكي الدورة المستندية (مصادر القيد)
                </h3>
                <p className="text-xs text-[#1D1D1B]/70 leading-relaxed">
                  فحص الفواتير، سندات القبض والصرف، الشيكات، والأذون المخزنية واستخراج بياناتها المحاسبية وتحليل أثرها قبل صياغة القيد.
                </p>
                <div className="flex items-center text-xs font-bold text-[#8A1F1D] gap-1 group-hover:gap-2 transition-all">
                  <span>فتح محاكي المستندات</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Card 2: Accounting Simulator */}
              <div 
                onClick={() => navigate('/training/simulators')}
                className="bg-[#F9F7F2] border border-[#1D1D1B]/20 p-6 space-y-4 hover:border-[#1D1D1B] transition cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 bg-[#1D1D1B] text-[#C4A484] flex items-center justify-center">
                    <Scale className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono font-bold bg-[#1D1D1B]/10 px-2 py-0.5">شامل تفاعلي</span>
                </div>
                <h3 className="text-lg font-bold text-[#1D1D1B] group-hover:text-[#8A1F1D] transition-colors">
                  مكون المحاكاة المحاسبية (Accounting Simulator)
                </h3>
                <p className="text-xs text-[#1D1D1B]/70 leading-relaxed">
                  نماذج تفاعلية لدفاتر اليومية المساعدة، دفتر الأستاذ العام، ميزان المراجعة، مع خيار 'الترحيل اليدوي' وزر خاص لـ 'محاكاة الأخطاء' لكشف الفروق وفق الكتاب المدرسي الرسمي.
                </p>
                <div className="flex items-center text-xs font-bold text-[#1D1D1B] gap-1 group-hover:gap-2 transition-all">
                  <span>فتح المحاكي المحاسبي</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Card 3: JRE Workshop */}
              <div 
                onClick={() => navigate('/training/jre')}
                className="bg-[#F9F7F2] border border-[#1D1D1B]/20 p-6 space-y-4 hover:border-[#1D1D1B] transition cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 bg-[#1B4D2E] text-white flex items-center justify-center">
                    <PenTool className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono font-bold bg-[#1B4D2E]/10 text-[#1B4D2E] px-2 py-0.5">20 درجة رسمية</span>
                </div>
                <h3 className="text-lg font-bold text-[#1D1D1B] group-hover:text-[#1B4D2E] transition-colors">
                  ورشة صياغة مقال التفسير المحاسبي JRE
                </h3>
                <p className="text-xs text-[#1D1D1B]/70 leading-relaxed">
                  تدرب على صياغة المقال المالي المنضبط وفق سلم التصحيح الرسمي (الأدلة + المنهجية + التحليل + التوصية + الصياغة).
                </p>
                <div className="flex items-center text-xs font-bold text-[#1B4D2E] gap-1 group-hover:gap-2 transition-all">
                  <span>بدء تدريب JRE</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
