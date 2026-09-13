import React, { useState, useEffect } from 'react';
import { BarChart3, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';
import { ContentManagerAnalyticsReport } from '../domain/analytics/ContentAnalyticsEngine';
import { apiClient } from '../api/apiClient';

export const ContentAnalyticsPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<ContentManagerAnalyticsReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const data = await apiClient.request('/api/analytics/content');
      setAnalytics(data);
    } catch (e: any) {
      setErrorMessage(e?.message || 'يتطلب هذا التقرير صلاحيات مدير محتوى أو مسؤول.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const totalQuestions = analytics?.totalQuestions ?? 0;
  const qualitySummary = analytics?.qualitySummary;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 font-serif" dir="rtl">
      {/* Header */}
      <div className="bg-white border-2 border-[#1D1D1B] p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#1D1D1B] text-[#C4A484] flex items-center justify-center font-bold text-xl">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1D1D1B]">لوحة جودة المحتوى والتحليل السيكومتري</h1>
            <p className="text-xs text-[#1D1D1B]/70">فحص معاملات التمييز، الصعوبة، وسلامة المشتتات لبنك الأسئلة</p>
          </div>
        </div>

        <button
          onClick={fetchAnalytics}
          className="px-3 py-2 bg-[#1D1D1B] text-[#F9F7F2] text-xs font-bold hover:bg-[#333333] transition flex items-center gap-2 cursor-pointer shadow-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>تحديث التقرير</span>
        </button>
      </div>

      {loading && (
        <div className="bg-white border border-[#1D1D1B]/15 p-12 text-center">
          <div className="w-8 h-8 border-2 border-[#1D1D1B] border-t-transparent animate-spin mx-auto mb-3" />
          <p className="text-xs text-[#1D1D1B]/70 font-bold">جاري حساب المؤشرات الإحصائية ومصفوفات التمييز...</p>
        </div>
      )}

      {errorMessage && !loading && (
        <div className="bg-rose-50 border border-rose-300 p-4 text-xs text-rose-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {!loading && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border-2 border-[#1D1D1B] p-4 text-center">
              <div className="text-xs text-[#1D1D1B]/60 font-bold">إجمالي بنود البنك المحللة</div>
              <div className="text-3xl font-black text-[#1D1D1B] mt-1 font-mono">
                {totalQuestions}
              </div>
            </div>

            <div className="bg-white border-2 border-[#1D1D1B] p-4 text-center">
              <div className="text-xs text-[#1D1D1B]/60 font-bold">حالة سلامة البنك</div>
              <div className="text-2xl font-bold text-emerald-700 mt-1">
                {(qualitySummary?.criticalIssuesCount ?? 0) === 0 ? 'معتمد 100%' : 'قيد المراجعة'}
              </div>
            </div>

            <div className="bg-white border-2 border-[#1D1D1B] p-4 text-center">
              <div className="text-xs text-[#1D1D1B]/60 font-bold">عدد الامتحانات والدروس</div>
              <div className="text-lg font-bold text-[#1D1D1B] mt-2 font-mono">
                {analytics?.totalExams ?? 0} امتحانات • {analytics?.totalLessons ?? 0} درساً
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
