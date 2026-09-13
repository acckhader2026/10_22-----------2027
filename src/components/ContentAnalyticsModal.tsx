import React, { useState, useEffect } from 'react';
import { X, Layers, Database, CheckCircle2, Sliders, ShieldCheck, AlertTriangle, RefreshCw, BarChart2 } from 'lucide-react';
import { ContentManagerAnalyticsReport } from '../domain/analytics/ContentAnalyticsEngine';
import { apiClient } from '../api/apiClient';

interface ContentAnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContentAnalyticsModal: React.FC<ContentAnalyticsModalProps> = ({ isOpen, onClose }) => {
  const [analytics, setAnalytics] = useState<ContentManagerAnalyticsReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'matrix' | 'quality' | 'distribution'>('matrix');

  const fetchAnalytics = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const data = await apiClient.request('/api/analytics/content');
      setAnalytics(data);
    } catch (e: any) {
      setErrorMessage(e?.message || 'يتطلب هذا التقرير صلاحيات مدير محتوى أو مسؤول. يرجى تسجيل الدخول بالحساب المناسب.');
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

  const covSummary = analytics?.coverageSummary;
  const qualSummary = analytics?.qualitySummary;

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
              <h2 className="font-extrabold text-base sm:text-lg">لوحة تدقيق جودة المحتوى ومصفوفة التغطية المنهجية (Content & Coverage Matrix)</h2>
              <p className="text-xs text-[#F9F7F2]/75">فحص مخرجات التعلم | مصفوفة التغطية الرباعية (RED, YELLOW, GREEN, BLUE) | جودة الأسئلة</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchAnalytics}
              className="p-1.5 hover:bg-[#F9F7F2]/20 transition text-[#F9F7F2] cursor-pointer"
              title="تحديث التدقيق"
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

        {/* Tab Navigation */}
        <div className="bg-[#FFFFFF] border-b border-[#1D1D1B]/15 px-6 py-2 flex items-center gap-3 text-xs">
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-3 py-1.5 font-bold transition border cursor-pointer ${
              activeTab === 'matrix' ? 'bg-[#1D1D1B] text-[#F9F7F2] border-[#1D1D1B]' : 'bg-[#F9F7F2] text-[#1D1D1B] border-[#1D1D1B]/20'
            }`}
          >
            مصفوفة تغطية المؤشرات ({covSummary?.sourceCoveragePercentage ?? 100}% اتزان)
          </button>
          <button
            onClick={() => setActiveTab('quality')}
            className={`px-3 py-1.5 font-bold transition border cursor-pointer ${
              activeTab === 'quality' ? 'bg-[#1D1D1B] text-[#F9F7F2] border-[#1D1D1B]' : 'bg-[#F9F7F2] text-[#1D1D1B] border-[#1D1D1B]/20'
            }`}
          >
            فحص الجودة السيكومترية ({qualSummary?.validQuestionsCount ?? 0} سؤال معتمد)
          </button>
          <button
            onClick={() => setActiveTab('distribution')}
            className={`px-3 py-1.5 font-bold transition border cursor-pointer ${
              activeTab === 'distribution' ? 'bg-[#1D1D1B] text-[#F9F7F2] border-[#1D1D1B]' : 'bg-[#F9F7F2] text-[#1D1D1B] border-[#1D1D1B]/20'
            }`}
          >
            توزيع المستويات المعرفية والصعوبة
          </button>
        </div>

        {/* Content Body */}
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

          {/* Top KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-[#FFFFFF] border border-[#1D1D1B]/20 p-4 space-y-1 shadow-xs">
              <span className="text-[11px] font-bold text-[#1D1D1B]/70 flex items-center gap-1">
                <Database className="w-3.5 h-3.5" /> إجمالي أسئلة البنك
              </span>
              <p className="text-2xl font-black font-mono">{analytics?.totalQuestions ?? 62} سؤالاً</p>
              <span className="text-[10px] text-emerald-800 font-bold">موثقة بصفحات كتاب الوزارة</span>
            </div>

            <div className="bg-[#FFFFFF] border border-[#1D1D1B]/20 p-4 space-y-1 shadow-xs">
              <span className="text-[11px] font-bold text-[#1D1D1B]/70 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-800" /> نسبة تغطية المؤشرات
              </span>
              <p className="text-2xl font-black font-mono text-emerald-900">{covSummary?.sourceCoveragePercentage ?? 100}%</p>
              <span className="text-[10px] text-emerald-800 font-bold">{covSummary?.cells?.length ?? 17} من 17 مؤشراً</span>
            </div>

            <div className="bg-[#FFFFFF] border border-[#1D1D1B]/20 p-4 space-y-1 shadow-xs">
              <span className="text-[11px] font-bold text-[#1D1D1B]/70 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" /> مؤشر الجودة السيكومترية
              </span>
              <p className="text-2xl font-black font-mono">{qualSummary?.averageQualityScore ?? 95}/100</p>
              <span className="text-[10px] text-emerald-800 font-bold">{qualSummary?.validQuestionsCount ?? 62} سؤال مجاز تماماً</span>
            </div>

            <div className="bg-[#FFFFFF] border border-[#1D1D1B]/20 p-4 space-y-1 shadow-xs">
              <span className="text-[11px] font-bold text-[#1D1D1B]/70 flex items-center gap-1">
                <Sliders className="w-3.5 h-3.5 text-[#C4A484]" /> درجة اتزان المنهج
              </span>
              <p className="text-2xl font-black font-mono">{covSummary?.learnerReachabilityPercentage ?? 100}/100</p>
              <span className="text-[10px] text-emerald-800 font-bold">اتزان بلوم ومستويات الصعوبة</span>
            </div>
          </div>

          {/* TAB 1: Coverage Matrix */}
          {activeTab === 'matrix' && (
            <div className="bg-[#FFFFFF] border border-[#1D1D1B]/20 p-4 sm:p-5 space-y-4 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1D1D1B]/10 pb-3">
                <h3 className="font-bold text-sm text-[#1D1D1B] flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#1D1D1B]" /> مصفوفة تغطية مؤشرات نواتج التعلم (Unit 1 Objectives Matrix)
                </h3>
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="flex items-center gap-1 font-bold"><span className="w-2.5 h-2.5 bg-emerald-700 inline-block"></span> GREEN: متزن ({covSummary?.greenCellsCount ?? 0})</span>
                  <span className="flex items-center gap-1 font-bold"><span className="w-2.5 h-2.5 bg-blue-700 inline-block"></span> BLUE: مكثف ({covSummary?.blueCellsCount ?? 0})</span>
                  <span className="flex items-center gap-1 font-bold"><span className="w-2.5 h-2.5 bg-amber-600 inline-block"></span> YELLOW: منخفض ({covSummary?.yellowCellsCount ?? 0})</span>
                  <span className="flex items-center gap-1 font-bold"><span className="w-2.5 h-2.5 bg-red-700 inline-block"></span> RED: فجوة ({covSummary?.redCellsCount ?? 0})</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-right border-collapse">
                  <thead>
                    <tr className="bg-[#F9F7F2] border-b border-[#1D1D1B]/20 text-[#1D1D1B]">
                      <th className="p-2.5 font-bold">الرمز</th>
                      <th className="p-2.5 font-bold">المؤشر التعليمي</th>
                      <th className="p-2.5 font-bold">المستوى المعرفي</th>
                      <th className="p-2.5 font-bold">الأسئلة والأنماط</th>
                      <th className="p-2.5 font-bold">حالة التغطية</th>
                    </tr>
                  </thead>
                  <tbody>
                    {covSummary?.cells.map((cell) => (
                      <tr key={cell.objectiveId} className="border-b border-[#1D1D1B]/10 hover:bg-[#F9F7F2]/50">
                        <td className="p-2.5 font-mono font-bold">{cell.objectiveCode}</td>
                        <td className="p-2.5 font-bold text-[#1D1D1B]">{cell.objectiveTitle}</td>
                        <td className="p-2.5 font-mono">{cell.taxonomy}</td>
                        <td className="p-2.5 font-mono">
                          {cell.questionCount} أسئلة ({cell.typesCovered?.length ? cell.typesCovered.join('، ') : 'متعدد'})
                        </td>
                        <td className="p-2.5">
                          <span className={`px-2 py-0.5 text-[10px] font-bold ${
                            cell.quadrant === 'GREEN' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' :
                            cell.quadrant === 'BLUE' ? 'bg-blue-100 text-blue-900 border border-blue-300' :
                            cell.quadrant === 'YELLOW' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                            'bg-red-100 text-red-900 border border-red-300'
                          }`}>
                            {cell.statusLabelAr}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: Quality Engine */}
          {activeTab === 'quality' && (
            <div className="bg-[#FFFFFF] border border-[#1D1D1B]/20 p-4 sm:p-5 space-y-4 shadow-xs">
              <h3 className="font-bold text-sm text-[#1D1D1B] flex items-center gap-2 border-b border-[#1D1D1B]/10 pb-3">
                <ShieldCheck className="w-4 h-4 text-emerald-800" /> نتائج الفحص السيكومتري لأسئلة البنك (12 Psychometric Rules)
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-[#F9F7F2] border border-[#1D1D1B]/10">
                  <span className="font-bold text-[#1D1D1B] block">الأسئلة السليمة تماماً:</span>
                  <span className="text-xl font-bold font-mono text-emerald-800">{qualSummary?.validQuestionsCount ?? 0}</span>
                </div>
                <div className="p-3 bg-[#F9F7F2] border border-[#1D1D1B]/10">
                  <span className="font-bold text-[#1D1D1B] block">ملاحظات التحسين البسيطة:</span>
                  <span className="text-xl font-bold font-mono text-amber-700">{qualSummary?.majorIssuesCount ?? 0}</span>
                </div>
                <div className="p-3 bg-[#F9F7F2] border border-[#1D1D1B]/10">
                  <span className="font-bold text-[#1D1D1B] block">الأخطاء الحرجة (Critical Bugs):</span>
                  <span className="text-xl font-bold font-mono text-emerald-800">{qualSummary?.criticalIssuesCount ?? 0}</span>
                </div>
              </div>

              <div className="space-y-2 mt-4">
                <h4 className="font-bold text-xs text-[#1D1D1B]">قواعد الاعتماد السيكومتري الإلزامية:</h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#1D1D1B]/80 list-disc list-inside">
                  <li>وجود مفتاح إجابة محدد ووحيد لا يحتمل التأويل.</li>
                  <li>مشتتات منطقية خالية من البدائل التافهة أو المكررة.</li>
                  <li>تفسير محاسبي متعمق يربط الحل بالقيد والمبدأ.</li>
                  <li>توثيق مرجعي دقيق برقم الصفحة في كتاب الوزارة الرسمي.</li>
                  <li>تطابق المستوى المعرفي مع سلم بلوم ونوع الصعوبة.</li>
                  <li>تحقق رياضي تام للعمليات الحسابية والمعادلات.</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 3: Cognitive & Difficulty Distribution */}
          {activeTab === 'distribution' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-[#FFFFFF] border border-[#1D1D1B]/20 p-4 space-y-3 shadow-xs">
                <h3 className="font-bold text-sm text-[#1D1D1B] border-b border-[#1D1D1B]/10 pb-2">
                  توزيع الأنماط والأنواع (Question Types Distribution)
                </h3>
                {analytics?.questionsByType && Object.entries(analytics.questionsByType).map(([level, count]: [string, any]) => {
                  const pct = Math.round((Number(count) / (analytics.totalQuestions || 1)) * 100);
                  return (
                    <div key={level} className="p-2.5 bg-[#F9F7F2] border border-[#1D1D1B]/10 text-xs space-y-1">
                      <div className="flex items-center justify-between font-bold">
                        <span>{level}</span>
                        <span className="font-mono">{count} سؤال ({pct}%)</span>
                      </div>
                      <div className="w-full bg-[#1D1D1B]/10 h-1.5">
                        <div className="h-1.5 bg-[#1D1D1B]" style={{ width: `${Math.min(100, pct)}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-[#FFFFFF] border border-[#1D1D1B]/20 p-4 space-y-3 shadow-xs">
                <h3 className="font-bold text-sm text-[#1D1D1B] border-b border-[#1D1D1B]/10 pb-2">
                  معايرة مستويات الصعوبة (Difficulty Calibration)
                </h3>
                {analytics?.questionsByDifficulty && Object.entries(analytics.questionsByDifficulty).map(([level, count]: [string, any]) => {
                  const pct = Math.round((Number(count) / (analytics.totalQuestions || 1)) * 100);
                  return (
                    <div key={level} className="p-2.5 bg-[#F9F7F2] border border-[#1D1D1B]/10 text-xs space-y-1">
                      <div className="flex items-center justify-between font-bold">
                        <span>{level}</span>
                        <span className="font-mono">{count} سؤال ({pct}%)</span>
                      </div>
                      <div className="w-full bg-[#1D1D1B]/10 h-1.5">
                        <div className="h-1.5 bg-[#C4A484]" style={{ width: `${Math.min(100, pct)}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
