import React, { useState } from 'react';
import { Layers, BookOpen, AlertTriangle, Sparkles, Scale, Search, CheckCircle2, Store, Calendar, FileText, ArrowRight, Award, Check } from 'lucide-react';
import { unitReviewData } from '../data/unitReviewData';
import { unit2ReviewData } from '../data/unit2ReviewData';
import { unit3ReviewData } from '../data/unit3ReviewData';
import { unit4ReviewData } from '../data/unit4ReviewData';

interface UnitReviewViewerProps {
  initialUnitId?: 'unit-1' | 'unit-2' | 'unit-3' | 'unit-4';
}

export const UnitReviewViewer: React.FC<UnitReviewViewerProps> = ({ initialUnitId = 'unit-4' }) => {
  const [selectedUnit, setSelectedUnit] = useState<'unit-1' | 'unit-2' | 'unit-3' | 'unit-4'>(initialUnitId);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'big_picture' | 'maryam_case' | 'night_review' | 'jre_section' | 'glossary' | 'mistakes'>('big_picture');

  const currentReviewData = selectedUnit === 'unit-4' ? unit4ReviewData : selectedUnit === 'unit-3' ? unit3ReviewData : selectedUnit === 'unit-2' ? unit2ReviewData : unitReviewData;

  const filteredGlossary = currentReviewData.glossary.filter(g => 
    g.term.toLowerCase().includes(searchTerm.toLowerCase()) || 
    g.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="bg-[#1D1D1B] text-[#C4A484] text-xs font-bold px-3 py-1 uppercase tracking-wider font-serif">
          {currentReviewData.edition}
        </span>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-[#1D1D1B] font-serif">
          المراجعة الشاملة والتطبيقية {selectedUnit === 'unit-4' ? 'للوحدة الرابعة (ميزان المراجعة وتصحيح الأخطاء)' : selectedUnit === 'unit-3' ? 'للوحدة الثالثة (الدفاتر المساعدة)' : selectedUnit === 'unit-2' ? 'للوحدة الثانية (التسجيل المحاسبي)' : 'للوحدة الأولى (أساسيات المحاسبة)'}
        </h2>
        <p className="text-xs sm:text-sm text-[#1D1D1B]/70 font-serif">
          الصورة الكبيرة، التطبيق الشامل المتكامل، خطة ليلة الامتحان، معجم المفاهيم، وروباريك الـ JRE
        </p>

        {/* Unit Selector Toggle */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <button
            onClick={() => {
              setSelectedUnit('unit-4');
              setSearchTerm('');
            }}
            className={`px-4 py-2 text-xs font-bold font-serif transition border cursor-pointer ${
              selectedUnit === 'unit-4'
                ? 'bg-[#1D1D1B] text-[#F9F7F2] border-[#1D1D1B] shadow-xs'
                : 'bg-[#FFFFFF] text-[#1D1D1B]/80 hover:bg-[#F9F7F2] border-[#1D1D1B]/20'
            }`}
          >
            الوحدة الرابعة: ميزان المراجعة وتصحيح الأخطاء
          </button>
          <button
            onClick={() => {
              setSelectedUnit('unit-3');
              setSearchTerm('');
            }}
            className={`px-4 py-2 text-xs font-bold font-serif transition border cursor-pointer ${
              selectedUnit === 'unit-3'
                ? 'bg-[#1D1D1B] text-[#F9F7F2] border-[#1D1D1B] shadow-xs'
                : 'bg-[#FFFFFF] text-[#1D1D1B]/80 hover:bg-[#F9F7F2] border-[#1D1D1B]/20'
            }`}
          >
            الوحدة الثالثة: الدفاتر المساعدة
          </button>
          <button
            onClick={() => {
              setSelectedUnit('unit-2');
              setSearchTerm('');
            }}
            className={`px-4 py-2 text-xs font-bold font-serif transition border cursor-pointer ${
              selectedUnit === 'unit-2'
                ? 'bg-[#1D1D1B] text-[#F9F7F2] border-[#1D1D1B] shadow-xs'
                : 'bg-[#FFFFFF] text-[#1D1D1B]/80 hover:bg-[#F9F7F2] border-[#1D1D1B]/20'
            }`}
          >
            الوحدة الثانية: التسجيل المحاسبي والقيد المزدوج
          </button>
          <button
            onClick={() => {
              setSelectedUnit('unit-1');
              setSearchTerm('');
            }}
            className={`px-4 py-2 text-xs font-bold font-serif transition border cursor-pointer ${
              selectedUnit === 'unit-1'
                ? 'bg-[#1D1D1B] text-[#F9F7F2] border-[#1D1D1B] shadow-xs'
                : 'bg-[#FFFFFF] text-[#1D1D1B]/80 hover:bg-[#F9F7F2] border-[#1D1D1B]/20'
            }`}
          >
            الوحدة الأولى: مدخل المحاسبة والمركز المالي
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center justify-start sm:justify-center gap-1.5 border-b border-[#1D1D1B]/15 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('big_picture')}
          className={`px-3 py-2 text-xs font-bold transition flex items-center gap-1.5 font-serif border shrink-0 cursor-pointer ${
            activeTab === 'big_picture'
              ? 'bg-[#1D1D1B] text-[#F9F7F2] border-[#1D1D1B]'
              : 'text-[#1D1D1B] border-transparent hover:bg-[#FFFFFF]'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-[#C4A484]" />
          <span>الصورة الكبيرة</span>
        </button>

        <button
          onClick={() => setActiveTab('maryam_case')}
          className={`px-3 py-2 text-xs font-bold transition flex items-center gap-1.5 font-serif border shrink-0 cursor-pointer ${
            activeTab === 'maryam_case'
              ? 'bg-[#1D1D1B] text-[#F9F7F2] border-[#1D1D1B]'
              : 'text-[#1D1D1B] border-transparent hover:bg-[#FFFFFF]'
          }`}
        >
          <Store className="w-3.5 h-3.5 text-[#C4A484]" />
          <span>التطبيق الشامل المتكامل</span>
        </button>

        <button
          onClick={() => setActiveTab('night_review')}
          className={`px-3 py-2 text-xs font-bold transition flex items-center gap-1.5 font-serif border shrink-0 cursor-pointer ${
            activeTab === 'night_review'
              ? 'bg-[#1D1D1B] text-[#F9F7F2] border-[#1D1D1B]'
              : 'text-[#1D1D1B] border-transparent hover:bg-[#FFFFFF]'
          }`}
        >
          <Calendar className="w-3.5 h-3.5 text-[#C4A484]" />
          <span>مراجعة ليلة الامتحان</span>
        </button>

        <button
          onClick={() => setActiveTab('jre_section')}
          className={`px-3 py-2 text-xs font-bold transition flex items-center gap-1.5 font-serif border shrink-0 cursor-pointer ${
            activeTab === 'jre_section'
              ? 'bg-[#1D1D1B] text-[#F9F7F2] border-[#1D1D1B]'
              : 'text-[#1D1D1B] border-transparent hover:bg-[#FFFFFF]'
          }`}
        >
          <Award className="w-3.5 h-3.5 text-[#C4A484]" />
          <span>نماذج وروباريك JRE</span>
        </button>

        <button
          onClick={() => setActiveTab('glossary')}
          className={`px-3 py-2 text-xs font-bold transition flex items-center gap-1.5 font-serif border shrink-0 cursor-pointer ${
            activeTab === 'glossary'
              ? 'bg-[#1D1D1B] text-[#F9F7F2] border-[#1D1D1B]'
              : 'text-[#1D1D1B] border-transparent hover:bg-[#FFFFFF]'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-[#C4A484]" />
          <span>المعجم ({currentReviewData.glossary.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('mistakes')}
          className={`px-3 py-2 text-xs font-bold transition flex items-center gap-1.5 font-serif border shrink-0 cursor-pointer ${
            activeTab === 'mistakes'
              ? 'bg-[#1D1D1B] text-[#F9F7F2] border-[#1D1D1B]'
              : 'text-[#1D1D1B] border-transparent hover:bg-[#FFFFFF]'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-[#C4A484]" />
          <span>الأخطاء الشائعة</span>
        </button>
      </div>

      {/* TAB 1: THE BIG PICTURE */}
      {activeTab === 'big_picture' && (
        <div className="space-y-6">
          <div className="bg-[#1D1D1B] text-[#F9F7F2] rounded-none p-6 sm:p-8 space-y-4 border border-[#1D1D1B]">
            <div className="flex items-center gap-2 text-[#C4A484] text-xs font-bold uppercase tracking-wider">
              <span>الفكرة الكبرى والسؤال الجوهري</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#F9F7F2] font-serif">
              {currentReviewData.theBigPicture.title}
            </h3>
            <p className="text-xs sm:text-sm text-[#F9F7F2]/80 leading-relaxed font-serif">
              {currentReviewData.theBigPicture.description}
            </p>
            <div className="bg-[#FFFFFF]/10 p-4 border border-[#FFFFFF]/15 space-y-2 mt-4">
              <p className="text-xs text-[#C4A484] font-bold">💡 الفكرة الكبرى:</p>
              <p className="text-xs text-[#F9F7F2] leading-relaxed font-serif">
                {currentReviewData.theBigPicture.bigIdea}
              </p>
              <p className="text-xs text-[#C4A484] font-bold pt-2">🎯 السؤال الجوهري:</p>
              <p className="text-xs text-[#F9F7F2] leading-relaxed font-serif font-bold">
                {currentReviewData.theBigPicture.essentialQuestion}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentReviewData.theBigPicture.diagramSteps.map((step) => (
              <div key={step.step} className="bg-[#FFFFFF] border border-[#1D1D1B]/15 rounded-none p-5 shadow-xs space-y-2 hover:border-[#1D1D1B] transition">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 bg-[#1D1D1B] text-[#C4A484] font-bold text-xs flex items-center justify-center">
                    {step.step}
                  </span>
                  <h4 className="font-bold text-[#1D1D1B] text-sm font-serif">{step.title}</h4>
                </div>
                <p className="text-xs text-[#1D1D1B]/75 leading-relaxed pt-1 font-serif">
                  {step.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: COMPREHENSIVE CASE */}
      {activeTab === 'maryam_case' && (
        <div className="space-y-6">
          <div className="bg-[#FFFFFF] border-2 border-[#1D1D1B] p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2">
              <Store className="w-5 h-5 text-[#C4A484]" />
              <h3 className="text-lg sm:text-xl font-bold text-[#1D1D1B] font-serif">
                {currentReviewData.maryamComprehensiveCase.title}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[#1D1D1B]/80 font-serif leading-relaxed bg-[#F9F7F2] p-4 border border-[#1D1D1B]/10">
              {currentReviewData.maryamComprehensiveCase.context}
            </p>
          </div>

          {/* 6 Steps Table */}
          <div className="bg-[#FFFFFF] border border-[#1D1D1B]/15 p-6 space-y-4 shadow-xs">
            <h4 className="font-bold text-sm text-[#1D1D1B] font-serif">
              خطوات الحل التحليلية والأثر المحاسبي
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs border-collapse">
                <thead>
                  <tr className="bg-[#1D1D1B] text-[#F9F7F2] font-serif">
                    <th className="p-3 border border-[#1D1D1B] font-bold w-16 text-center">الخطوة</th>
                    <th className="p-3 border border-[#1D1D1B] font-bold w-48">عنوان العملية</th>
                    <th className="p-3 border border-[#1D1D1B] font-bold">التحليل أو القيد اليومي</th>
                    <th className="p-3 border border-[#1D1D1B] font-bold">الأثر المحاسبي على المعادلة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1D1D1B]/10 font-serif">
                  {currentReviewData.maryamComprehensiveCase.steps.map((s) => (
                    <tr key={s.step} className="hover:bg-[#F9F7F2]/60 transition">
                      <td className="p-3 border border-[#1D1D1B]/10 font-mono font-bold text-center bg-[#F9F7F2]">
                        {s.step}
                      </td>
                      <td className="p-3 border border-[#1D1D1B]/10 font-bold text-[#1D1D1B]">
                        {s.title}
                      </td>
                      <td className="p-3 border border-[#1D1D1B]/10 font-mono text-[#1D1D1B]/90 font-bold">
                        {s.analysisOrEntry}
                      </td>
                      <td className="p-3 border border-[#1D1D1B]/10 text-[#1D1D1B]/80 leading-relaxed">
                        {s.accountingImpact}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Integration Links */}
          <div className="bg-[#FFFFFF] border border-[#1D1D1B]/15 p-6 space-y-4 shadow-xs">
            <h4 className="font-bold text-sm text-[#1D1D1B] font-serif">
              حلقات الوصل البنائية في الدورة المحاسبية
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs border-collapse">
                <thead>
                  <tr className="bg-[#1D1D1B] text-[#F9F7F2] font-serif">
                    <th className="p-3 border border-[#1D1D1B] font-bold w-40">المرحلة</th>
                    <th className="p-3 border border-[#1D1D1B] font-bold">الناتج المباشر</th>
                    <th className="p-3 border border-[#1D1D1B] font-bold">السؤال المحوري الذي تجيب عنه</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1D1D1B]/10 font-serif">
                  {currentReviewData.maryamComprehensiveCase.cycleLinks.map((link, idx) => (
                    <tr key={idx} className="hover:bg-[#F9F7F2]/60 transition">
                      <td className="p-3 border border-[#1D1D1B]/10 font-bold text-[#1D1D1B] bg-[#F9F7F2]">
                        {link.stage}
                      </td>
                      <td className="p-3 border border-[#1D1D1B]/10 text-[#1D1D1B]/90 font-bold">
                        {link.output}
                      </td>
                      <td className="p-3 border border-[#1D1D1B]/10 text-[#1D1D1B]/80">
                        {link.questionAnswered}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: NIGHT REVIEW */}
      {activeTab === 'night_review' && (
        <div className="space-y-6">
          <div className="bg-[#1D1D1B] text-[#F9F7F2] p-6 space-y-3">
            <span className="text-xs font-bold text-[#C4A484] uppercase tracking-wider font-serif">
              خلاصة الوحدة في دقيقة
            </span>
            <p className="text-xs sm:text-sm text-[#F9F7F2]/90 leading-relaxed font-serif">
              {currentReviewData.examNightReview.summaryInOneMinute}
            </p>
          </div>

          <div className="bg-[#FFFFFF] border border-[#1D1D1B]/15 p-6 space-y-4 shadow-xs">
            <h3 className="font-bold text-sm sm:text-base text-[#1D1D1B] font-serif">
              {currentReviewData.examNightReview.title}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs border-collapse">
                <thead>
                  <tr className="bg-[#1D1D1B] text-[#F9F7F2] font-serif">
                    <th className="p-3 border border-[#1D1D1B] font-bold w-48">إذا طُلب منك في السؤال</th>
                    <th className="p-3 border border-[#1D1D1B] font-bold">ابدأ فوراً بهذه الخطوات</th>
                    <th className="p-3 border border-[#1D1D1B] font-bold w-64">تحقق دائماً من (نقطة الأمان)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1D1D1B]/10 font-serif">
                  {currentReviewData.examNightReview.checklist.map((item, idx) => (
                    <tr key={idx} className="hover:bg-[#F9F7F2]/60 transition">
                      <td className="p-3 border border-[#1D1D1B]/10 font-bold text-[#1D1D1B] bg-[#F9F7F2]">
                        {item.ifRequested}
                      </td>
                      <td className="p-3 border border-[#1D1D1B]/10 text-[#1D1D1B]/90 leading-relaxed">
                        {item.startWith}
                      </td>
                      <td className="p-3 border border-[#1D1D1B]/10 text-[#1D1D1B]/80 font-bold text-emerald-900 bg-emerald-50/50">
                        {item.verifyThat}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: JRE SUITE */}
      {activeTab === 'jre_section' && (
        <div className="space-y-6">
          <div className="bg-[#F9F7F2] border border-[#1D1D1B]/20 p-5 space-y-2">
            <span className="text-xs font-bold text-[#1D1D1B] flex items-center gap-1.5 font-serif">
              <Award className="w-4 h-4 text-[#C4A484]" />
              <span>مستويات سؤال التفسير المدعوم بالأدلة (JRE Scaffolded Suite)</span>
            </span>
            <p className="text-xs text-[#1D1D1B]/75 font-serif leading-relaxed">
              ثلاثة نماذج متدرجة الصعوبة (تمهيدي، متوسط، متقدم) مع الإجابات النموذجية ومصفوفات توزيع الدرجات المعتمدة رسمياً.
            </p>
          </div>

          <div className="space-y-6">
            {currentReviewData.jreScaffoldedSuite.map((item) => (
              <div key={item.id} className="bg-[#FFFFFF] border-2 border-[#1D1D1B] p-6 space-y-4 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1D1D1B]/10 pb-3">
                  <div>
                    <span className="text-[11px] font-bold text-[#C4A484] font-mono">{item.id}</span>
                    <h4 className="font-bold text-base text-[#1D1D1B] font-serif">{item.title}</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold bg-[#F9F7F2] border border-[#1D1D1B]/15 px-2.5 py-1 font-serif">
                      المستوى: {item.level}
                    </span>
                    <span className="text-xs font-bold bg-[#1D1D1B] text-[#F9F7F2] px-2.5 py-1 font-mono">
                      {item.totalMarks} درجات
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="font-bold text-xs text-[#1D1D1B] block font-serif">📌 نص السؤال:</span>
                  <p className="text-xs sm:text-sm text-[#1D1D1B] font-serif font-bold bg-[#F9F7F2] p-3 border border-[#1D1D1B]/10">
                    {item.question}
                  </p>
                </div>

                <div className="space-y-2 bg-[#F9F7F2]/50 p-4 border border-[#1D1D1B]/10">
                  <span className="font-bold text-xs text-[#1D1D1B] block font-serif">✓ الإجابة النموذجية المعتمدة:</span>
                  <p className="text-xs text-[#1D1D1B]/85 leading-relaxed font-serif whitespace-pre-line">
                    {item.modelAnswer}
                  </p>
                </div>

                {/* Rubric */}
                <div className="space-y-2">
                  <span className="font-bold text-xs text-[#1D1D1B] block font-serif">📊 روباريك تقييم المصحح (توزيع الدرجات):</span>
                  <div className="overflow-x-auto">
                    <table className="w-full text-right text-xs border-collapse">
                      <thead>
                        <tr className="bg-[#1D1D1B] text-[#F9F7F2] font-serif">
                          <th className="p-2 border border-[#1D1D1B] font-bold">معيار التقييم والأدلة المطلوبة</th>
                          <th className="p-2 border border-[#1D1D1B] font-bold w-24 text-center">الدرجة المخصصة</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1D1D1B]/10 font-serif">
                        {item.rubric.map((r, idx) => (
                          <tr key={idx} className="hover:bg-[#F9F7F2]/60">
                            <td className="p-2.5 border border-[#1D1D1B]/10">{r.criterion}</td>
                            <td className="p-2.5 border border-[#1D1D1B]/10 text-center font-bold font-mono">{r.marks}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: GLOSSARY */}
      {activeTab === 'glossary' && (
        <div className="space-y-6">
          <div className="relative">
            <Search className="w-4 h-4 text-[#1D1D1B]/40 absolute right-3 top-3" />
            <input
              type="text"
              placeholder="ابحث في معجم المصطلحات والمبادئ المحاسبية..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-10 py-2 text-xs border border-[#1D1D1B]/20 bg-[#FFFFFF] focus:outline-none focus:border-[#1D1D1B] font-serif"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredGlossary.map((item, idx) => (
              <div key={idx} className="bg-[#FFFFFF] border border-[#1D1D1B]/15 p-4 space-y-1.5 shadow-xs hover:border-[#1D1D1B] transition">
                <div className="font-bold text-xs sm:text-sm text-[#1D1D1B] font-serif flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#C4A484]" />
                  <span>{item.term}</span>
                </div>
                <p className="text-xs text-[#1D1D1B]/75 leading-relaxed pr-4 font-serif">
                  {item.definition}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: COMMON MISTAKES TABLE */}
      {activeTab === 'mistakes' && (
        <div className="space-y-6">
          <div className="bg-[#F9F7F2] border border-[#1D1D1B]/30 rounded-none p-4 text-xs text-[#1D1D1B] font-serif">
            ⚠️ <strong>تحذير للامتحانات:</strong> يقع كثير من الطلاب في هذه الأخطاء نتيجة الفهم الخاطئ أو التسرع. احرص على مراجعتها جيداً!
          </div>

          <div className="space-y-4">
            {currentReviewData.commonErrors.map((err) => (
              <div key={err.id} className="bg-[#FFFFFF] border border-[#1D1D1B]/15 rounded-none p-5 sm:p-6 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-[#1D1D1B]/10 pb-2">
                  <span className="bg-[#F9F7F2] text-[#1D1D1B] border border-[#1D1D1B]/15 text-xs font-bold px-3 py-1 font-serif">
                    الموضوع: {err.topic}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-[#F9F7F2] p-3.5 border border-[#1D1D1B]/15 space-y-1">
                    <span className="font-bold text-xs text-[#1D1D1B] block font-serif">❌ الخطأ الشائع:</span>
                    <p className="text-xs text-[#1D1D1B]/85 font-serif">{err.error}</p>
                    <span className="text-[11px] text-[#1D1D1B]/60 block pt-1 font-serif">السبب: {err.whyWrong}</span>
                  </div>

                  <div className="bg-[#FFFFFF] p-3.5 border border-[#1D1D1B]/25 space-y-1">
                    <span className="font-bold text-xs text-[#1D1D1B] block font-serif">✓ الطريقة المحاسبية الصحيحة:</span>
                    <p className="text-xs text-[#1D1D1B]/85 font-serif">{err.correctMethod}</p>
                    <span className="text-[11px] text-[#C4A484] block pt-1 font-mono">📌 مثال: {err.example}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
