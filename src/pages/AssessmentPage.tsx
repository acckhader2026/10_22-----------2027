import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Sparkles, Layers, Award, ArrowLeft, BookOpen, CheckCircle2 } from 'lucide-react';
import { QuestionBankViewer } from '../components/QuestionBankViewer';
import { UnitReviewViewer } from '../components/UnitReviewViewer';
import { ExamSimulator } from '../components/ExamSimulator';

export const AssessmentPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  const activeSubTab = path.includes('/question-bank')
    ? 'qbank'
    : path.includes('/unit-tests')
    ? 'tests'
    : path.includes('/mock-exams')
    ? 'exams'
    : 'overview';

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 font-serif" dir="rtl">
      {/* Subnavigation Bar */}
      <div className="bg-white border-2 border-[#1D1D1B] p-3 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="bg-[#1D1D1B] text-[#C4A484] text-xs font-bold px-2.5 py-1">
            التقويم والقياس السيكومتري
          </span>
          <span className="text-xs text-[#1D1D1B]/70 font-bold hidden sm:inline">
            بنك الأسئلة والمراجعات التركيبية ونماذج المحاكاة
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <NavLink
            to="/assessment/question-bank"
            className={({ isActive }) => 
              `px-3 py-1.5 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                isActive || activeSubTab === 'qbank'
                  ? 'bg-[#1D1D1B] text-[#F9F7F2]'
                  : 'bg-[#F9F7F2] text-[#1D1D1B] hover:bg-[#C4A484]/20 border border-[#1D1D1B]/15'
              }`
            }
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C4A484]" />
            <span>بنك الأسئلة المعتمد (130 سؤالاً)</span>
          </NavLink>

          <NavLink
            to="/assessment/unit-tests"
            className={({ isActive }) => 
              `px-3 py-1.5 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                isActive || activeSubTab === 'tests'
                  ? 'bg-[#1D1D1B] text-[#F9F7F2]'
                  : 'bg-[#F9F7F2] text-[#1D1D1B] hover:bg-[#C4A484]/20 border border-[#1D1D1B]/15'
              }`
            }
          >
            <Layers className="w-3.5 h-3.5 text-[#C4A484]" />
            <span>المراجعات التركيبية الشاملة</span>
          </NavLink>

          <NavLink
            to="/assessment/mock-exams"
            className={({ isActive }) => 
              `px-3 py-1.5 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                isActive || activeSubTab === 'exams'
                  ? 'bg-[#1D1D1B] text-[#F9F7F2]'
                  : 'bg-[#F9F7F2] text-[#1D1D1B] hover:bg-[#C4A484]/20 border border-[#1D1D1B]/15'
              }`
            }
          >
            <Award className="w-3.5 h-3.5 text-[#C4A484]" />
            <span>الامتحانات المحاكية الرسمية</span>
          </NavLink>
        </div>
      </div>

      {/* Render Component based on Sub-Route */}
      {activeSubTab === 'qbank' && <QuestionBankViewer />}

      {activeSubTab === 'tests' && <UnitReviewViewer />}

      {activeSubTab === 'exams' && <ExamSimulator />}

      {activeSubTab === 'overview' && (
        <div className="space-y-8">
          <div className="bg-white border-2 border-[#1D1D1B] p-6 sm:p-8 space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-[#1D1D1B]">
                منظومة التقويم والتحقق المعياري (100% تغطية)
              </h2>
              <p className="text-sm text-[#1D1D1B]/70 leading-relaxed">
                تتكامل عناصر التقويم لضمان قياس الفهم العميق والقدرة على حل المشكلات المحاسبية بدقة وموضوعية.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              <div 
                onClick={() => navigate('/assessment/question-bank')}
                className="bg-[#F9F7F2] border border-[#1D1D1B]/20 p-6 space-y-4 hover:border-[#1D1D1B] transition cursor-pointer group"
              >
                <div className="w-10 h-10 bg-[#1D1D1B] text-[#C4A484] flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[#1D1D1B] group-hover:text-[#8A1F1D] transition-colors">
                  بنك الأسئلة المعتمد
                </h3>
                <p className="text-xs text-[#1D1D1B]/70 leading-relaxed">
                  130 سؤالاً مقنناً سيكومترياً يغطي مستويات بلوم الستة، مع تصحيح فوري وتحليل البدائل المشتتة.
                </p>
                <div className="flex items-center text-xs font-bold text-[#1D1D1B] gap-1 group-hover:gap-2 transition-all">
                  <span>فتح بنك الأسئلة</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </div>
              </div>

              <div 
                onClick={() => navigate('/assessment/unit-tests')}
                className="bg-[#F9F7F2] border border-[#1D1D1B]/20 p-6 space-y-4 hover:border-[#1D1D1B] transition cursor-pointer group"
              >
                <div className="w-10 h-10 bg-[#1D1D1B] text-[#C4A484] flex items-center justify-center">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[#1D1D1B] group-hover:text-[#8A1F1D] transition-colors">
                  المراجعات التركيبية
                </h3>
                <p className="text-xs text-[#1D1D1B]/70 leading-relaxed">
                  دراسات حالة مركبة، خرائط ذهنية، أسئلة الصواب والخطأ التفسيرية، وملخصات ليلة الامتحان.
                </p>
                <div className="flex items-center text-xs font-bold text-[#1D1D1B] gap-1 group-hover:gap-2 transition-all">
                  <span>فتح المراجعات</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </div>
              </div>

              <div 
                onClick={() => navigate('/assessment/mock-exams')}
                className="bg-[#F9F7F2] border border-[#1D1D1B]/20 p-6 space-y-4 hover:border-[#1D1D1B] transition cursor-pointer group"
              >
                <div className="w-10 h-10 bg-[#8A1F1D] text-white flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[#1D1D1B] group-hover:text-[#8A1F1D] transition-colors">
                  الامتحانات المحاكية
                </h3>
                <p className="text-xs text-[#1D1D1B]/70 leading-relaxed">
                  نماذج مطابقة لمواصفات الورقة الامتحانية الرسمية لوزارة التربية والتعليم المصرية مع توقيت محسوب.
                </p>
                <div className="flex items-center text-xs font-bold text-[#1D1D1B] gap-1 group-hover:gap-2 transition-all">
                  <span>دخول الامتحان</span>
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
