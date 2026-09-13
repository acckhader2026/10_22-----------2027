import React, { useState, useEffect } from 'react';
import { X, Users, TrendingUp, AlertTriangle, CheckCircle, BarChart3, HelpCircle, ArrowUpRight, RefreshCw } from 'lucide-react';
import { TeacherAnalyticsReport } from '../domain/analytics/TeacherAnalyticsEngine';
import { apiClient } from '../api/apiClient';

interface TeacherDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TeacherDashboardModal: React.FC<TeacherDashboardModalProps> = ({ isOpen, onClose }) => {
  const [analytics, setAnalytics] = useState<TeacherAnalyticsReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedCohort, setSelectedCohort] = useState('شعبة المحاسبة 1 - الثانوية المصرية EB');

  const fetchAnalytics = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const data = await apiClient.request('/api/analytics/teacher');
      setAnalytics(data);
    } catch (e: any) {
      setErrorMessage(e?.message || 'يتطلب هذا التقرير صلاحيات معلم أو مسؤول. يرجى تسجيل الدخول بحساب المعلم.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAnalytics();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const metrics = analytics?.metrics;
  const atRisk = analytics?.atRiskStudents || [];
  const conceptPerf = analytics?.conceptPerformance || [];
  const itemAnalysis = analytics?.itemAnalysis || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1D1D1B]/70 backdrop-blur-xs font-serif animate-in fade-in duration-200">
      <div className="bg-[#F9F7F2] border-2 border-[#1D1D1B] w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#1D1D1B] text-[#F9F7F2] p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#C4A484] text-[#1D1D1B] flex items-center justify-center font-bold text-lg">
              EB
            </div>
            <div>
              <h2 className="font-extrabold text-base sm:text-lg">لوحة تحليلات المعلم والأداء الصفي (Teacher Cohort Analytics)</h2>
              <p className="text-xs text-[#F9F7F2]/75">متابعة دقيقة للطلاب | حساب سيكومتري مبني على البيانات الحقيقية فقط</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchAnalytics}
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

        {/* Filter bar */}
        <div className="bg-[#FFFFFF] border-b border-[#1D1D1B]/15 px-6 py-2.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#1D1D1B]">الشعبة الدراسية:</span>
            <select
              value={selectedCohort}
              onChange={(e) => setSelectedCohort(e.target.value)}
              className="border border-[#1D1D1B]/30 px-2 py-1 bg-[#F9F7F2] font-serif cursor-pointer"
            >
              <option value="شعبة المحاسبة 1 - الثانوية المصرية EB">شعبة المحاسبة 1 - الثانوية المصرية EB</option>
            </select>
          </div>
          <div className="text-[#1D1D1B]/70 font-mono text-[11px]">
            {analytics?.generatedAt ? `آخر احتساب: ${new Date(analytics.generatedAt).toLocaleTimeString('ar-EG')}` : 'جاري الاحتساب...'}
          </div>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6 text-[#1D1D1B]">
          
          {/* Error Banner */}
          {errorMessage && (
            <div className="p-4 bg-rose-50 border-2 border-rose-400 text-rose-900 space-y-2 shadow-xs">
              <div className="flex items-center gap-2 font-bold text-xs">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={fetchAnalytics}
                  className="px-3 py-1.5 bg-[#1D1D1B] text-[#F9F7F2] hover:bg-[#333330] text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>إعادة المحاولة</span>
                </button>
              </div>
            </div>
          )}

          {/* Key KPI Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-[#FFFFFF] border border-[#1D1D1B]/20 p-4 space-y-1 shadow-xs">
              <span className="text-[11px] font-bold text-[#1D1D1B]/70 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-[#1D1D1B]" /> الطلاب المسجلون
              </span>
              <p className="text-2xl font-black font-mono">{metrics?.totalStudents ?? 0} طالباً</p>
              <span className="text-[10px] text-emerald-800 font-bold">{metrics?.activeToday ?? 0} نشطاً اليوم</span>
            </div>

            <div className="bg-[#FFFFFF] border border-[#1D1D1B]/20 p-4 space-y-1 shadow-xs">
              <span className="text-[11px] font-bold text-[#1D1D1B]/70 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-[#1D1D1B]" /> متوسط دقة الإجابات
              </span>
              <p className="text-2xl font-black font-mono">
                {metrics?.avgAccuracyRate !== null && metrics?.avgAccuracyRate !== undefined ? `${metrics.avgAccuracyRate}%` : 'لا توجد بيانات'}
              </p>
              <span className="text-[10px] text-[#1D1D1B]/70 font-bold">عبر {metrics?.totalAttemptsRecorded ?? 0} محاولة</span>
            </div>

            <div className="bg-[#FFFFFF] border border-[#1D1D1B]/20 p-4 space-y-1 shadow-xs">
              <span className="text-[11px] font-bold text-[#1D1D1B]/70 flex items-center gap-1">
                <BarChart3 className="w-3.5 h-3.5 text-[#1D1D1B]" /> نسبة إكمال الوحدة الأولى
              </span>
              <p className="text-2xl font-black font-mono">{metrics?.unitCompletionPercentage ?? 0}%</p>
              <span className="text-[10px] text-emerald-800 font-bold">من إجمالي 6 دروس</span>
            </div>

            <div className="bg-[#FFFFFF] border border-[#1D1D1B]/20 p-4 space-y-1 shadow-xs">
              <span className="text-[11px] font-bold text-[#1D1D1B]/70 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-700" /> الطلاب المعرضون للتعثر
              </span>
              <p className="text-2xl font-black font-mono text-amber-900">{metrics?.atRiskStudentsCount ?? 0} طلاب</p>
              <span className="text-[10px] text-amber-800 font-bold">يحتاجون تدخلاً علاجياً</span>
            </div>
          </div>

          {/* At Risk Students Table */}
          <div className="bg-[#FFFFFF] border border-[#1D1D1B]/20 p-4 space-y-3 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#1D1D1B]/10 pb-2">
              <h3 className="font-bold text-sm text-[#1D1D1B] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" /> تشخيص الطلاب المعرضين للتعثر (At-Risk Diagnostic)
              </h3>
            </div>

            {atRisk.length === 0 ? (
              <p className="text-xs text-[#1D1D1B]/70 py-3 text-center">
                ممتاز! لا يوجد طلاب في دائرة الخطر في الوقت الحالي.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-right border-collapse">
                  <thead>
                    <tr className="bg-[#F9F7F2] border-b border-[#1D1D1B]/20 text-[#1D1D1B]">
                      <th className="p-2.5 font-bold">الطالب</th>
                      <th className="p-2.5 font-bold">نسبة الدقة</th>
                      <th className="p-2.5 font-bold">المحاولات</th>
                      <th className="p-2.5 font-bold">مستوى الخطر</th>
                      <th className="p-2.5 font-bold">التشخيص والتوصية</th>
                    </tr>
                  </thead>
                  <tbody>
                    {atRisk.map((st) => (
                      <tr key={st.studentId} className="border-b border-[#1D1D1B]/10 hover:bg-[#F9F7F2]/50">
                        <td className="p-2.5 font-bold">{st.studentName}</td>
                        <td className="p-2.5 font-mono font-bold">{st.accuracyRate}%</td>
                        <td className="p-2.5 font-mono">{st.attemptsCount}</td>
                        <td className="p-2.5">
                          <span className={`px-2 py-0.5 text-[10px] font-bold ${
                            st.riskLevel === 'HIGH' ? 'bg-red-100 text-red-900 border border-red-300' : 'bg-amber-100 text-amber-900 border border-amber-300'
                          }`}>
                            {st.riskLevel === 'HIGH' ? 'خطر مرتفع' : 'متوسط'}
                          </span>
                        </td>
                        <td className="p-2.5 text-[#1D1D1B]/80">{st.primaryIssue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Concepts Cohort Mastery & Item Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            
            {/* Concept Breakdown */}
            <div className="bg-[#FFFFFF] border border-[#1D1D1B]/20 p-4 space-y-3 shadow-xs">
              <h3 className="font-bold text-sm text-[#1D1D1B] flex items-center gap-2 border-b border-[#1D1D1B]/10 pb-2">
                <CheckCircle className="w-4 h-4 text-emerald-700" /> تحليل إتقان المفاهيم الصفي
              </h3>
              {conceptPerf.length === 0 ? (
                <p className="text-xs text-[#1D1D1B]/60 py-4 text-center">لا توجد محاولات كافية بعد لإجراء التحليل الصفي.</p>
              ) : (
                <div className="space-y-2">
                  {conceptPerf.map((c, i) => (
                    <div key={i} className="p-2.5 bg-[#F9F7F2] border border-[#1D1D1B]/10 text-xs space-y-1">
                      <div className="flex items-center justify-between font-bold">
                        <span>{c.concept}</span>
                        <span className="font-mono">{c.successRate}% ({c.attempts} محاولة)</span>
                      </div>
                      <div className="w-full bg-[#1D1D1B]/10 h-1.5">
                        <div
                          className={`h-1.5 ${c.successRate >= 75 ? 'bg-emerald-700' : c.successRate >= 60 ? 'bg-amber-600' : 'bg-red-700'}`}
                          style={{ width: `${c.successRate}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Item Analysis */}
            <div className="bg-[#FFFFFF] border border-[#1D1D1B]/20 p-4 space-y-3 shadow-xs">
              <h3 className="font-bold text-sm text-[#1D1D1B] flex items-center gap-2 border-b border-[#1D1D1B]/10 pb-2">
                <HelpCircle className="w-4 h-4 text-[#C4A484]" /> التحليل السيكومتري لمعامل سهولة الأسئلة (Facility Index p)
              </h3>
              {itemAnalysis.length === 0 ? (
                <p className="text-xs text-[#1D1D1B]/60 py-4 text-center">سيظهر التحليل السيكومتري فور تفاعل الطلاب مع الأسئلة.</p>
              ) : (
                <div className="space-y-2">
                  {itemAnalysis.slice(0, 5).map((item) => (
                    <div key={item.questionId} className="p-2.5 bg-[#F9F7F2] border border-[#1D1D1B]/10 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-[11px] text-[#1D1D1B]/70">{item.questionId} ({item.concept})</span>
                        <span className="font-mono font-bold bg-[#1D1D1B] text-[#C4A484] px-1.5 py-0.5 text-[11px]">
                          p = {item.facilityIndex}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#1D1D1B]/80">{item.recommendationAr}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
