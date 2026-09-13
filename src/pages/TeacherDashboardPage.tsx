import React, { useState, useEffect } from 'react';
import { Users, TrendingUp, AlertTriangle, CheckCircle, BarChart3, RefreshCw } from 'lucide-react';
import { TeacherAnalyticsReport } from '../domain/analytics/TeacherAnalyticsEngine';
import { apiClient } from '../api/apiClient';

export const TeacherDashboardPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<TeacherAnalyticsReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const data = await apiClient.request('/api/analytics/teacher');
      setAnalytics(data);
    } catch (e: any) {
      setErrorMessage(e?.message || 'يتطلب هذا التقرير صلاحيات معلم أو مسؤول.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const metrics = analytics?.metrics;
  const atRisk = analytics?.atRiskStudents || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 font-serif" dir="rtl">
      {/* Header */}
      <div className="bg-white border-2 border-[#1D1D1B] p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#1D1D1B] text-[#C4A484] flex items-center justify-center font-bold text-xl">
            EB
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1D1D1B]">لوحة تحليلات المعلم والأداء الصفي</h1>
            <p className="text-xs text-[#1D1D1B]/70">بيانات سيكومترية وتحليلات مباشرة للمجموعة الصفية</p>
          </div>
        </div>

        <button
          onClick={fetchAnalytics}
          className="px-3 py-2 bg-[#1D1D1B] text-[#F9F7F2] text-xs font-bold hover:bg-[#333333] transition flex items-center gap-2 cursor-pointer shadow-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>تحديث البيانات</span>
        </button>
      </div>

      {loading && (
        <div className="bg-white border border-[#1D1D1B]/15 p-12 text-center">
          <div className="w-8 h-8 border-2 border-[#1D1D1B] border-t-transparent animate-spin mx-auto mb-3" />
          <p className="text-xs text-[#1D1D1B]/70 font-bold">جاري تجميع مؤشرات أداء الشعبة الصفية...</p>
        </div>
      )}

      {errorMessage && !loading && (
        <div className="bg-rose-50 border border-rose-300 p-4 text-xs text-rose-800 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {!loading && (
        <div className="space-y-6">
          {/* Metrics summary */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white border-2 border-[#1D1D1B] p-4 text-center">
              <div className="text-xs text-[#1D1D1B]/60 font-bold">متوسط دقة الشعبة الصفية</div>
              <div className="text-3xl font-black text-[#1D1D1B] mt-1 font-mono">
                {metrics?.avgAccuracyRate !== null && metrics?.avgAccuracyRate !== undefined ? `${metrics.avgAccuracyRate}%` : '—'}
              </div>
            </div>

            <div className="bg-white border-2 border-[#1D1D1B] p-4 text-center">
              <div className="text-xs text-[#1D1D1B]/60 font-bold">الطلاب المحتاجون لدعم تدخلي</div>
              <div className="text-3xl font-black text-[#8A1F1D] mt-1 font-mono">
                {metrics?.atRiskStudentsCount ?? 0}
              </div>
            </div>

            <div className="bg-white border-2 border-[#1D1D1B] p-4 text-center">
              <div className="text-xs text-[#1D1D1B]/60 font-bold">نسبة إتمام الدروس</div>
              <div className="text-3xl font-black text-[#1D1D1B] mt-1 font-mono">
                {metrics?.unitCompletionPercentage ?? 0}%
              </div>
            </div>

            <div className="bg-white border-2 border-[#1D1D1B] p-4 text-center">
              <div className="text-xs text-[#1D1D1B]/60 font-bold">إجمالي المحاولات المسجلة</div>
              <div className="text-3xl font-black text-[#1D1D1B] mt-1 font-mono">
                {metrics?.totalAttemptsRecorded ?? 0}
              </div>
            </div>
          </div>

          {/* At-Risk Students */}
          {atRisk.length > 0 && (
            <div className="bg-white border-2 border-[#1D1D1B] p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-[#1D1D1B]/15 pb-3">
                <AlertTriangle className="w-5 h-5 text-[#8A1F1D]" />
                <h3 className="font-bold text-base text-[#1D1D1B]">قائمة الطلاب المحتاجين لخطة تدخلية فورية</h3>
              </div>
              <div className="divide-y divide-[#1D1D1B]/10">
                {atRisk.map((student, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-sm text-[#1D1D1B]">{student.studentName}</span>
                      <span className="text-xs text-[#1D1D1B]/60 mr-2 font-mono">({student.studentId})</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-bold text-[#8A1F1D] bg-[#8A1F1D]/10 px-2 py-1 font-mono">
                        الدقة: {student.accuracyRate}% ({student.attemptsCount} محاولات)
                      </span>
                      <span className="text-xs text-[#1D1D1B]/70">
                        {student.primaryIssue}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
