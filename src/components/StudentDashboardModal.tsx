import React, { useState, useEffect } from 'react';
import { X, Award, Brain, Target, ArrowLeft, BookOpen, RefreshCw, AlertTriangle, ShieldCheck } from 'lucide-react';
import { apiClient } from '../api/apiClient';

interface StudentDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  userFullName: string;
  onNavigateToLesson: (lessonId: string) => void;
}

export const StudentDashboardModal: React.FC<StudentDashboardModalProps> = ({
  isOpen,
  onClose,
  userFullName,
  onNavigateToLesson
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'adaptive'>('overview');
  const [progressData, setProgressData] = useState<any>(null);
  const [adaptiveData, setAdaptiveData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
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
      setErrorMessage(e?.message || 'تعذر تحميل بيانات الإتقان. يرجى إعادة المحاولة.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchStudentData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isInsufficient = progressData?.status === 'INSUFFICIENT_DATA' || (progressData?.totalAttempts ?? 0) === 0;
  const compositeMastery = progressData?.compositeMastery ?? 0;
  const confidence = progressData?.confidence ?? 0;
  const components = progressData?.masteryComponents;
  const prescriptions = adaptiveData?.adaptivePath?.prescriptions || [];
  const nextStep = adaptiveData?.adaptivePath?.nextLearningStep;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1D1D1B]/70 backdrop-blur-xs font-serif animate-in fade-in duration-200">
      <div className="bg-[#F9F7F2] border-2 border-[#1D1D1B] w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#1D1D1B] text-[#F9F7F2] p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#C4A484] text-[#1D1D1B] flex items-center justify-center font-bold text-lg">
              EB
            </div>
            <div>
              <h2 className="font-extrabold text-base sm:text-lg flex items-center gap-2">
                <span>لوحة إتقان الطالب الأكاديمية (Canonical Mastery Hub)</span>
                <span className="text-[10px] bg-[#C4A484] text-[#1D1D1B] font-mono px-2 py-0.5 font-bold">
                  {progressData?.algorithmVersion || 'mastery-v1.0'}
                </span>
              </h2>
              <p className="text-xs text-[#F9F7F2]/75">الطالب: {userFullName} | قياس سيكومتري شفاف بالأدلة الحقيقية</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchStudentData}
              className="p-1.5 hover:bg-[#F9F7F2]/20 transition text-[#F9F7F2] cursor-pointer"
              title="تحديث البيانات"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-[#F9F7F2]/20 transition text-[#F9F7F2] cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-[#1D1D1B]/20 bg-[#FFFFFF] px-4 pt-2 gap-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 border-b-2 transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'overview'
                ? 'border-[#1D1D1B] text-[#1D1D1B] bg-[#F9F7F2]'
                : 'border-transparent text-[#1D1D1B]/60 hover:text-[#1D1D1B]'
            }`}
          >
            <Target className="w-4 h-4" />
            <span>نظرة عامة على الإتقان والمؤشرات (Mastery & Evidence)</span>
          </button>

          <button
            onClick={() => setActiveTab('adaptive')}
            className={`px-4 py-2.5 border-b-2 transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'adaptive'
                ? 'border-[#1D1D1B] text-[#1D1D1B] bg-[#F9F7F2]'
                : 'border-transparent text-[#1D1D1B]/60 hover:text-[#1D1D1B]'
            }`}
          >
            <Brain className="w-4 h-4" />
            <span>المسار التعليمي التكيفي والعلاجي (Adaptive Path)</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6 text-[#1D1D1B]">
          
          {/* Error Banner if any */}
          {errorMessage && (
            <div className="p-4 bg-rose-50 border-2 border-rose-400 text-rose-900 space-y-2 shadow-xs">
              <div className="flex items-center gap-2 font-bold text-xs">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={fetchStudentData}
                  className="px-3 py-1.5 bg-[#1D1D1B] text-[#F9F7F2] hover:bg-[#333330] text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>إعادة المحاولة وتحديث الجلسة</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Insufficient Data Alert if fresh student */}
              {isInsufficient ? (
                <div className="p-5 bg-[#FFFFFF] border-2 border-[#1D1D1B] space-y-3 shadow-xs">
                  <div className="flex items-center gap-2 text-[#C4A484] font-bold text-sm">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                    <span className="text-[#1D1D1B] font-bold">بيانات الأدلة غير كافية حالياً (INSUFFICIENT_DATA)</span>
                  </div>
                  <p className="text-xs text-[#1D1D1B]/80 leading-relaxed">
                    وفقاً للمعايير السيكومترية الصارمة للمنصة، لا يتم تخمين أو افتراض درجة إتقان الطالب بشكل عشوائي. يرجى حل التمارين التفاعلية أو إجراء أحد الامتحانات لتوليد سجل الأدلة وحساب درجة الإتقان تلقائياً.
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateToLesson('lesson-1');
                    }}
                    className="px-4 py-2 bg-[#1D1D1B] text-[#F9F7F2] text-xs font-bold hover:bg-[#333330] transition flex items-center gap-2"
                  >
                    <span>ابدأ حل تمارين الدرس الأول</span>
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                </div>
              ) : null}

              {/* Overall Score & Formula Breakdown Card */}
              <div className="bg-[#FFFFFF] border border-[#1D1D1B]/20 p-5 space-y-4 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1D1D1B]/10 pb-4">
                  <div>
                    <span className="text-xs font-bold text-[#1D1D1B]/70 block font-serif">مؤشر الإتقان الكلي المرجح (Evidence-Weighted Mastery)</span>
                    <div className="flex items-baseline gap-3 mt-1">
                      <span className="text-3xl sm:text-4xl font-black font-mono text-[#1D1D1B]">
                        {compositeMastery}%
                      </span>
                      <span className="text-xs font-bold px-2 py-0.5 bg-[#1D1D1B] text-[#C4A484]">
                        {progressData?.masteryBand === 'MASTERED' ? 'متقن (Mastered)' :
                         progressData?.masteryBand === 'PROFICIENT' ? 'كفء (Proficient)' :
                         progressData?.masteryBand === 'DEVELOPING' ? 'قيد التطوير (Developing)' :
                         'بيانات أولية / غير كافية'}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-[#1D1D1B]/80 sm:text-left space-y-1">
                    <div>إجمالي الأسئلة المنجزة: <strong>{progressData?.totalAttempts ?? 0} سؤالاً</strong></div>
                    <div>درجة الموثوقية الإحصائية: <strong>{Math.round(confidence * 100)}%</strong></div>
                    <div>الدروس المكتملة: <strong>{progressData?.completedLessonsCount ?? 0} من 6</strong></div>
                  </div>
                </div>

                {/* The 4-Component Mathematical Weights */}
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-bold text-[#1D1D1B] block">معادلة حساب الإتقان المعتمدة (The 4 Mastery Dimensions):</span>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
                    <div className="p-2.5 bg-[#F9F7F2] border border-[#1D1D1B]/10">
                      <span className="text-[#1D1D1B]/70 block text-[11px]">1. دقة الإجابات (40%)</span>
                      <strong className="font-mono text-sm">{Math.round(components?.accuracy?.rawRate ?? 0)}%</strong>
                    </div>
                    <div className="p-2.5 bg-[#F9F7F2] border border-[#1D1D1B]/10">
                      <span className="text-[#1D1D1B]/70 block text-[11px]">2. وزن الصعوبة (30%)</span>
                      <strong className="font-mono text-sm">{Math.round(components?.difficulty?.rawRate ?? 0)}%</strong>
                    </div>
                    <div className="p-2.5 bg-[#F9F7F2] border border-[#1D1D1B]/10">
                      <span className="text-[#1D1D1B]/70 block text-[11px]">3. منحنى الأداء الأخير (20%)</span>
                      <strong className="font-mono text-sm">{Math.round(components?.trend?.rawRate ?? 0)}%</strong>
                    </div>
                    <div className="p-2.5 bg-[#F9F7F2] border border-[#1D1D1B]/10">
                      <span className="text-[#1D1D1B]/70 block text-[11px]">4. شمولية الدروس (10%)</span>
                      <strong className="font-mono text-sm">{Math.round(components?.breadth?.rawRate ?? 0)}%</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actionable Insights */}
              {progressData?.actionableInsights && progressData.actionableInsights.length > 0 && (
                <div className="p-4 bg-[#1D1D1B] text-[#F9F7F2] space-y-2 border-r-4 border-[#C4A484]">
                  <h4 className="font-bold text-xs text-[#C4A484] flex items-center gap-1.5">
                    <Award className="w-4 h-4" /> التوصية الأكاديمية الموجهة
                  </h4>
                  <ul className="text-xs space-y-1 text-[#F9F7F2]/90 list-disc list-inside">
                    {progressData.actionableInsights.map((ins: string, idx: number) => (
                      <li key={idx}>{ins}</li>
                    ))}
                  </ul>
                </div>
              )}

            </div>
          )}

          {activeTab === 'adaptive' && (
            <div className="space-y-6">
              
              {/* Prescribed Next Step */}
              {nextStep && (
                <div className="p-5 bg-[#FFFFFF] border-2 border-[#1D1D1B] space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="bg-[#C4A484] text-[#1D1D1B] font-bold text-[11px] px-2.5 py-0.5">
                      الخطوة التعليمية العلاجية الموصى بها الآن
                    </span>
                    <span className="text-xs font-bold text-[#1D1D1B]/70">توجيه ذكي</span>
                  </div>
                  <h3 className="text-lg font-bold text-[#1D1D1B]">{nextStep.titleAr}</h3>
                  <p className="text-xs text-[#1D1D1B]/80 leading-relaxed">{nextStep.descriptionAr}</p>
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateToLesson(nextStep.lessonId);
                    }}
                    className="mt-2 px-4 py-2 bg-[#1D1D1B] hover:bg-[#333330] text-[#F9F7F2] text-xs font-bold transition flex items-center gap-2 cursor-pointer"
                  >
                    <span>الانتقال فوراً للمسار العلاجي</span>
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Identified Misconceptions */}
              <div className="space-y-3">
                <h4 className="font-bold text-xs text-[#1D1D1B]">سجل المفاهيم المشخصة والأخطاء الشائعة:</h4>
                {prescriptions.length === 0 ? (
                  <div className="p-4 bg-[#FFFFFF] border border-[#1D1D1B]/15 text-xs text-center text-[#1D1D1B]/70">
                    رائع! لم يتم رصد أي فجوات حرجة أو سوء فهم محاسبي في محاولاتك السابقة.
                  </div>
                ) : (
                  prescriptions.map((pres: any) => (
                    <div key={pres.prescriptionId} className="p-4 bg-[#FFFFFF] border border-[#1D1D1B]/15 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[#1D1D1B]">{pres.lessonTitleAr} ({pres.objectiveCode})</span>
                        <span className={`px-2 py-0.5 text-[10px] font-bold ${
                          pres.severity === 'HIGH' ? 'bg-red-100 text-red-900 border border-red-300' : 'bg-amber-100 text-amber-900 border border-amber-300'
                        }`}>
                          {pres.severity === 'HIGH' ? 'أولوية علاجية قصوى' : 'أولوية متوسطة'}
                        </span>
                      </div>
                      <p className="text-xs text-[#1D1D1B]/80">
                        <strong>التشخيص:</strong> {pres.misconceptionDiagnosed}
                      </p>
                      <div className="text-[11px] text-[#1D1D1B]/70 flex items-center gap-2 bg-[#F9F7F2] p-2 border border-[#1D1D1B]/10">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>المرجع الموصى به: صفحة {pres.textbookPageRef} في كتاب الوزارة الرسمي.</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
