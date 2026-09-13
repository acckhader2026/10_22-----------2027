import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Brain, Target, Award, ArrowLeft, RefreshCw, BookOpen, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { apiClient } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';

export const MyPathPage: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  const [progressData, setProgressData] = useState<any>(null);
  const [adaptiveData, setAdaptiveData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchStudentData = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const [progData, adapData] = await Promise.all([
        apiClient.request('/api/progress/student'),
        apiClient.request('/api/adaptive/path')
      ]);
      setProgressData(progData);
      setAdaptiveData(adapData);
    } catch (e: any) {
      setErrorMessage(e?.message || 'تعذر تحميل بيانات الإتقان. يرجى التأكد من تشغيل الخادم.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, []);

  const activeSubTab = path.includes('/mastery')
    ? 'mastery'
    : path.includes('/recommendations')
    ? 'recommendations'
    : path.includes('/progress')
    ? 'progress'
    : 'overview';

  const isInsufficient = progressData?.status === 'INSUFFICIENT_DATA' || (progressData?.totalAttempts ?? 0) === 0;
  const compositeMastery = progressData?.compositeMastery ?? 0;
  const confidence = progressData?.confidence ?? 0;
  const components = progressData?.masteryComponents;
  const prescriptions = adaptiveData?.adaptivePath?.prescriptions || [];
  const nextStep = adaptiveData?.adaptivePath?.nextLearningStep;

  const handleGoToLesson = (lessonId: string) => {
    const map: Record<string, string> = {
      'lesson-1': '/curriculum/unit-1/lessons/lesson-1',
      'lesson-2': '/curriculum/unit-1/lessons/lesson-2',
      'lesson-3': '/curriculum/unit-1/lessons/lesson-3',
      'lesson-4': '/curriculum/unit-1/lessons/lesson-4',
      'lesson-5': '/curriculum/unit-1/lessons/lesson-5',
      'lesson-6': '/curriculum/unit-1/lessons/lesson-6',
      'u2-lesson-1': '/curriculum/unit-2/lessons/lesson-1',
      'u2-lesson-2': '/curriculum/unit-2/lessons/lesson-2',
      'u2-lesson-3': '/curriculum/unit-2/lessons/lesson-3',
      'u2-lesson-4': '/curriculum/unit-2/lessons/lesson-4',
      'u2-lesson-5': '/curriculum/unit-2/lessons/lesson-5',
      'u2-lesson-6': '/curriculum/unit-2/lessons/lesson-6'
    };
    const target = map[lessonId] || '/curriculum/unit-1/lessons/lesson-1';
    navigate(target);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 font-serif" dir="rtl">
      {/* Header & Subnav */}
      <div className="bg-white border-2 border-[#1D1D1B] p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#1D1D1B] text-[#C4A484] flex items-center justify-center">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#1D1D1B]">
              مسار الإتقان والتعلم التكيفي
            </h1>
            <p className="text-xs text-[#1D1D1B]/70">
              المتعلم: <strong className="text-[#1D1D1B]">{user?.full_name || 'طالب EB'}</strong> • محرك الاستدلال المبني على الأدلة
            </p>
          </div>
        </div>

        {/* Subnav Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <NavLink
            to="/my-path/progress"
            className={({ isActive }) => 
              `px-3 py-1.5 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                isActive || activeSubTab === 'progress' || activeSubTab === 'overview'
                  ? 'bg-[#1D1D1B] text-[#F9F7F2]'
                  : 'bg-[#F9F7F2] text-[#1D1D1B] hover:bg-[#C4A484]/20 border border-[#1D1D1B]/15'
              }`
            }
          >
            <Target className="w-3.5 h-3.5 text-[#C4A484]" />
            <span>نظرة عامة والتقدم</span>
          </NavLink>

          <NavLink
            to="/my-path/mastery"
            className={({ isActive }) => 
              `px-3 py-1.5 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                isActive || activeSubTab === 'mastery'
                  ? 'bg-[#1D1D1B] text-[#F9F7F2]'
                  : 'bg-[#F9F7F2] text-[#1D1D1B] hover:bg-[#C4A484]/20 border border-[#1D1D1B]/15'
              }`
            }
          >
            <Award className="w-3.5 h-3.5 text-[#C4A484]" />
            <span>مؤشرات الإتقان السيكومتري</span>
          </NavLink>

          <NavLink
            to="/my-path/recommendations"
            className={({ isActive }) => 
              `px-3 py-1.5 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                isActive || activeSubTab === 'recommendations'
                  ? 'bg-[#1D1D1B] text-[#F9F7F2]'
                  : 'bg-[#F9F7F2] text-[#1D1D1B] hover:bg-[#C4A484]/20 border border-[#1D1D1B]/15'
              }`
            }
          >
            <Brain className="w-3.5 h-3.5 text-[#C4A484]" />
            <span>التوصيات العلاجية التكيفية</span>
          </NavLink>

          <button
            onClick={fetchStudentData}
            title="تحديث البيانات"
            className="p-1.5 border border-[#1D1D1B]/20 hover:bg-[#1D1D1B]/5 transition cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 text-[#1D1D1B] ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {loading && (
        <div className="bg-white border border-[#1D1D1B]/15 p-12 text-center">
          <div className="w-8 h-8 border-2 border-[#1D1D1B] border-t-transparent animate-spin mx-auto mb-3" />
          <p className="text-xs text-[#1D1D1B]/70 font-bold">جاري تحميل سجل المحاولات ومطابقة مؤشرات الإتقان...</p>
        </div>
      )}

      {errorMessage && !loading && (
        <div className="bg-rose-50 border border-rose-300 p-4 text-xs text-rose-800 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {!loading && (
        <div className="space-y-8">
          {/* Main Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white border-2 border-[#1D1D1B] p-6 text-center space-y-2">
              <div className="text-xs font-bold text-[#1D1D1B]/60">درجة الإتقان التراكمية (Composite)</div>
              <div className="text-4xl font-extrabold text-[#1D1D1B] font-mono">
                {compositeMastery}%
              </div>
              <div className="text-[11px] text-[#1D1D1B]/70">
                {isInsufficient ? 'البيانات غير كافية لتقدير موثوق' : `بمستوى ثقة إحصائي: ${confidence}%`}
              </div>
            </div>

            <div className="bg-white border-2 border-[#1D1D1B] p-6 text-center space-y-2">
              <div className="text-xs font-bold text-[#1D1D1B]/60">إجمالي المحاولات الموثقة</div>
              <div className="text-4xl font-extrabold text-[#1D1D1B] font-mono">
                {progressData?.totalAttempts ?? 0}
              </div>
              <div className="text-[11px] text-[#1D1D1B]/70">
                محاولات مسجلة في قاعدة البيانات الموثوقة
              </div>
            </div>

            <div className="bg-white border-2 border-[#1D1D1B] p-6 text-center space-y-2">
              <div className="text-xs font-bold text-[#1D1D1B]/60">الخطوة التعليمية المقترحة</div>
              <div className="text-sm font-bold text-[#8A1F1D] line-clamp-2">
                {nextStep?.titleAr || 'مواصلة حل تدريبات الوحدة الأولى'}
              </div>
              <button
                onClick={() => handleGoToLesson(nextStep?.lessonId || 'lesson-1')}
                className="text-xs font-bold text-[#1D1D1B] underline hover:text-[#C4A484] cursor-pointer"
              >
                الانتقال للدرس المقترح ←
              </button>
            </div>
          </div>

          {/* Prescriptions / Adaptive Recommendations */}
          {(activeSubTab === 'recommendations' || activeSubTab === 'overview') && (
            <div className="bg-white border-2 border-[#1D1D1B] p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-[#1D1D1B]/15 pb-3">
                <Target className="w-5 h-5 text-[#8A1F1D]" />
                <h2 className="text-lg font-bold text-[#1D1D1B]">
                  الوصفات العلاجية التكيفية (Targeted Prescriptions)
                </h2>
              </div>

              {prescriptions.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#1D1D1B]/60">
                  لا توجد فجوات مفاهيمية حرجة مسجلة حالياً. استمر في حل تدريبات الدروس وامتحانات المحاكاة.
                </div>
              ) : (
                <div className="space-y-4">
                  {prescriptions.map((p: any, idx: number) => (
                    <div key={idx} className="bg-[#F9F7F2] border border-[#1D1D1B]/15 p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="bg-[#8A1F1D] text-white text-[10px] font-bold px-2 py-0.5">
                          تحدي مفاهيمي #{idx + 1}
                        </span>
                        <span className="text-xs text-[#1D1D1B]/60 font-mono">
                          {p.conceptName}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-[#1D1D1B]">{p.misconception}</h4>
                      <p className="text-xs text-[#1D1D1B]/80 leading-relaxed">{p.simplifiedExplanation}</p>
                      <div className="pt-2 flex items-center justify-between">
                        <span className="text-[11px] text-[#1D1D1B]/60 font-bold">
                          تمارين مقترحة: {p.drillQuestionIds?.join(', ')}
                        </span>
                        <button
                          onClick={() => handleGoToLesson(p.suggestedLesson)}
                          className="text-xs font-bold bg-[#1D1D1B] text-[#F9F7F2] px-3 py-1 hover:bg-[#333333] transition cursor-pointer"
                        >
                          مراجعة الدرس ذي الصلة
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
