import React, { useState, useEffect } from 'react';
import { 
  Sparkles, CheckCircle2, Search, Filter, Check, X, 
  Award, Eye, EyeOff, BookOpen, Layers, AlertTriangle, Lightbulb, Compass, FileText, Target, RotateCcw
} from 'lucide-react';
import { curriculumRegistry } from '../domain/curriculum/CurriculumRegistry';
import type { TraceableQuestion } from '../data/expandedQuestionBank';
import { DifficultyBadge, Button } from '../design-system';
import { SKILL_BY_CODE, UNIFIED_SKILLS } from '../domain/curriculum/SkillTaxonomy';
import { ADVANCED_ESSAY_RUBRIC } from '../domain/assessment/rubrics/AdvancedEssayRubric';
import { useCurriculumFilter } from '../context/CurriculumFilterContext';

export const QuestionBankViewer: React.FC = () => {
  const {
    selectedUnitId: globalUnitId,
    selectedLessonId: globalLessonId,
    selectedLearningOutcomeId: globalLOId,
    selectedLearningOutcome: globalLO,
    clearFilters: clearGlobalFilters,
    selectUnit: setGlobalUnit,
    selectLesson: setGlobalLesson
  } = useCurriculumFilter();

  // Mode: 'textbook' (130 official) vs 'training' (72 unified interactive)
  const [bankMode, setBankMode] = useState<'textbook' | 'training'>('textbook');

  const [selectedUnit, setSelectedUnit] = useState<string>(globalUnitId || 'all');
  const [selectedLesson, setSelectedLesson] = useState<string>(globalLessonId || 'all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedSkill, setSelectedSkill] = useState<string>('all');
  const [selectedBloom, setSelectedBloom] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Sync with global filter
  useEffect(() => {
    if (globalUnitId) {
      setSelectedUnit(globalUnitId);
    } else {
      setSelectedUnit('all');
    }
  }, [globalUnitId]);

  useEffect(() => {
    if (globalLessonId) {
      setSelectedLesson(globalLessonId);
    } else {
      setSelectedLesson('all');
    }
  }, [globalLessonId]);
  
  const [userAnswers, setUserAnswers] = useState<{ [id: string]: any }>({});
  const [revealedExplanations, setRevealedExplanations] = useState<{ [id: string]: boolean }>({});
  const [revealedRubrics, setRevealedRubrics] = useState<{ [id: string]: boolean }>({});

  const textbookQuestions = curriculumRegistry.getQuestionBank();
  const trainingQuestions = curriculumRegistry.getTrainingBankQuestions();

  const activeQuestions = bankMode === 'textbook' ? textbookQuestions : trainingQuestions;

  const handleSelectAnswer = (qId: string, answer: any) => {
    setUserAnswers(prev => ({ ...prev, [qId]: answer }));
  };

  const toggleExplanation = (qId: string) => {
    setRevealedExplanations(prev => ({ ...prev, [qId]: !prev[qId] }));
  };

  const toggleRubric = (qId: string) => {
    setRevealedRubrics(prev => ({ ...prev, [qId]: !prev[qId] }));
  };

  const filteredQuestions = activeQuestions.filter(q => {
    if (selectedUnit !== 'all' && q.unitId !== selectedUnit) return false;
    if (selectedLesson !== 'all' && q.lessonId !== selectedLesson) return false;
    if (selectedLevel !== 'all' && q.difficulty !== selectedLevel) return false;
    if (selectedType !== 'all' && q.questionType !== selectedType) return false;
    if (bankMode === 'training') {
      if (selectedSkill !== 'all' && q.skillCode !== selectedSkill) return false;
      if (selectedBloom !== 'all' && q.bloomLevel !== selectedBloom) return false;
    }
    // Global Learning Outcome Filter
    if (globalLOId && globalLO) {
      const qIds = globalLO.questionIds || [];
      const code = globalLO.code.toLowerCase();
      const title = globalLO.titleAr.toLowerCase();
      const matchesSpecificLO = 
        qIds.includes(q.id) || 
        (q.originalId && qIds.includes(q.originalId)) || 
        (q.subLo && q.subLo.toLowerCase().includes(code)) ||
        (q.concept && title.includes(q.concept.toLowerCase()));
      // If there are specific questions mapped, filter by them; otherwise fallback to the lesson
      if (qIds.length > 0 && !matchesSpecificLO) return false;
      if (qIds.length === 0 && q.lessonId !== globalLO.lessonId) return false;
    }
    if (searchQuery.trim() !== '') {
      const s = searchQuery.toLowerCase();
      const matchText = 
        q.question.toLowerCase().includes(s) || 
        q.concept.toLowerCase().includes(s) || 
        (q.tags && q.tags.some(t => t.toLowerCase().includes(s))) ||
        (q.originalId && q.originalId.toLowerCase().includes(s));
      if (!matchText) return false;
    }
    return true;
  });

  const bloomLabels: Record<string, string> = {
    knowledge: 'تذكر واستدعاء',
    comprehension: 'فهم وتفسير',
    application: 'تطبيق عملي',
    analysis: 'تحليل وتفكيك',
    evaluation: 'تقييم وإصدار حكم',
    synthesis: 'تركيب وصياغة'
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 font-serif" dir="rtl">
      
      {/* Header Banner */}
      <div className="bg-[#1D1D1B] text-[#F9F7F2] p-6 sm:p-8 shadow-xs border border-[#1D1D1B] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-[#C4A484] text-[#1D1D1B] font-bold text-xs px-3 py-0.5 uppercase tracking-wider">
              {bankMode === 'textbook' ? 'بنك أسئلة كتاب الوزارة المعتمد' : 'بنك التدريب والمحاكاة التفاعلية v2.2'}
            </span>
            <span className="text-xs text-[#F9F7F2]/75 border border-[#F9F7F2]/20 px-2 py-0.5">
              {bankMode === 'textbook' ? 'توثيق معتمد بأرقام الصفحات 8 - 98' : `${trainingQuestions.length} بنداً تدريبياً معمقاً (S1–S15)`}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold mt-2">
            {bankMode === 'textbook' 
              ? `أسئلة الكتاب المدرسي الرسمي (${textbookQuestions.length} سؤالاً موثقاً)` 
              : `بنك التدريب التفاعلي وحالات JRE (${trainingQuestions.length} بنداً تعليمياً)`
            }
          </h2>
          <p className="text-xs sm:text-sm text-[#F9F7F2]/80 mt-1">
            {bankMode === 'textbook'
              ? 'تغطية معيارية لأسئلة الكتاب المدرسي للوحدات الثلاث مع إحالات دقيقة للصفحات ونماذج الإجابة.'
              : 'مسائل تدريبية متدرجة، كشف المفاهيم الشائعة الخاطئة، تحليل المشتتات، ومقالات JRE المحاسبية.'
            }
          </p>
        </div>

        <div className="bg-[#FFFFFF]/10 backdrop-blur-md px-5 py-3 border border-[#F9F7F2]/20 text-center shrink-0">
          <span className="text-[11px] text-[#F9F7F2]/70 block">
            {bankMode === 'textbook' ? 'إجمالي بنك الكتاب' : 'إجمالي بنك التدريب'}
          </span>
          <span className="text-3xl font-black text-[#C4A484] font-mono">
            {activeQuestions.length}
          </span>
        </div>
      </div>

      {/* Global Learning Outcome Filter Notice */}
      {globalLO && (
        <div className="bg-white border-2 border-[#1D1D1B] p-4 flex flex-wrap items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 bg-[#1D1D1B] text-[#C4A484] flex items-center justify-center font-bold">
              <Target className="w-4 h-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#1D1D1B]">فلترة نشطة حسب ناتج التعلم:</span>
                <span className="bg-[#1D1D1B] text-[#C4A484] text-[11px] font-mono font-bold px-2 py-0.5">
                  {globalLO.code}
                </span>
              </div>
              <p className="text-xs text-[#1D1D1B]/80 font-medium mt-0.5">
                {globalLO.titleAr}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold font-mono bg-[#F9F7F2] border border-[#1D1D1B]/20 px-2.5 py-1 text-[#1D1D1B]">
              {filteredQuestions.length} سؤالاً مطابقاً
            </span>
            <button
              onClick={clearGlobalFilters}
              className="text-xs bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 font-bold px-3 py-1 flex items-center gap-1 transition cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>إلغاء الفلتر وعرض الكل</span>
            </button>
          </div>
        </div>
      )}

      {/* Mode Switcher Tabs */}
      <div className="flex border-b-2 border-[#1D1D1B] bg-[#F9F7F2]">
        <button
          onClick={() => { setBankMode('textbook'); setSelectedUnit('all'); setSelectedLesson('all'); }}
          className={`px-6 py-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-t-2 border-r-2 transition cursor-pointer ${
            bankMode === 'textbook'
              ? 'bg-white text-[#1D1D1B] border-t-[#8A1F1D] border-x-[#1D1D1B] -mb-[2px]'
              : 'bg-transparent text-[#1D1D1B]/60 hover:text-[#1D1D1B] border-transparent'
          }`}
        >
          <BookOpen className="w-4 h-4 text-[#C4A484]" />
          <span>أسئلة الكتاب المدرسي الرسمي (130 سؤالاً موثقاً بالصفحة)</span>
        </button>

        <button
          onClick={() => { setBankMode('training'); setSelectedUnit('all'); setSelectedLesson('all'); }}
          className={`px-6 py-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-t-2 border-r-2 transition cursor-pointer ${
            bankMode === 'training'
              ? 'bg-white text-[#1D1D1B] border-t-[#8A1F1D] border-x-[#1D1D1B] -mb-[2px]'
              : 'bg-transparent text-[#1D1D1B]/60 hover:text-[#1D1D1B] border-transparent'
          }`}
        >
          <Sparkles className="w-4 h-4 text-[#C4A484]" />
          <span>بنك التدريب والمحاكاة التفاعلية ({trainingQuestions.length} سؤالاً تعليمياً غنياً)</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-[#FFFFFF] border border-[#1D1D1B]/15 p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1D1D1B]/10 pb-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#C4A484]" />
            <span className="font-bold text-xs sm:text-sm text-[#1D1D1B]">تصفية وترشيح الأسئلة:</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute right-3 top-2.5 text-[#1D1D1B]/50" />
              <input
                type="text"
                placeholder="ابحث بمفهوم أو كلمة أو رمز..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-3 pr-9 py-1.5 text-xs bg-[#F9F7F2] border border-[#1D1D1B]/20 focus:outline-[#1D1D1B]"
              />
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-[#1D1D1B]/60 hover:text-[#1D1D1B] underline cursor-pointer"
              >
                مسح
              </button>
            )}
          </div>
        </div>

        {/* Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block font-semibold text-[#1D1D1B] mb-1">الوحدة الدراسية:</label>
            <select
              value={selectedUnit}
              onChange={e => { setSelectedUnit(e.target.value); setSelectedLesson('all'); }}
              className="w-full p-2 bg-[#F9F7F2] border border-[#1D1D1B]/20 text-xs text-[#1D1D1B] focus:outline-[#1D1D1B]"
            >
              <option value="all">كافة الوحدات</option>
              <option value="unit-1">الوحدة الأولى: مدخل المحاسبة المالية</option>
              <option value="unit-2">الوحدة الثانية: القيد المزدوج والدورة المحاسبية</option>
              <option value="unit-3">الوحدة الثالثة: الدفاتر المساعدة والمعاملات التمويلية</option>
              <option value="unit-4">الوحدة الرابعة: التسويات الجردية والقوائم المالية</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-[#1D1D1B] mb-1">نمط السؤال:</label>
            <select
              value={selectedType}
              onChange={e => setSelectedType(e.target.value)}
              className="w-full p-2 bg-[#F9F7F2] border border-[#1D1D1B]/20 text-xs text-[#1D1D1B] focus:outline-[#1D1D1B]"
            >
              <option value="all">جميع الأنماط</option>
              <option value="mcq">اختيار من متعدد (MCQ)</option>
              <option value="true_false">صواب وخطأ مع التعليل</option>
              <option value="applied">تطبيقات ومسائل حسابية</option>
              <option value="concept">مفاهيمي واستدلالي</option>
              <option value="case">حالات دراسية متكاملة</option>
              <option value="jre">مقالات JRE (الحكم والأدلة)</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-[#1D1D1B] mb-1">مستوى الصعوبة:</label>
            <select
              value={selectedLevel}
              onChange={e => setSelectedLevel(e.target.value)}
              className="w-full p-2 bg-[#F9F7F2] border border-[#1D1D1B]/20 text-xs text-[#1D1D1B] focus:outline-[#1D1D1B]"
            >
              <option value="all">جميع المستويات</option>
              <option value="basic">المستوى الأساسي (Basic)</option>
              <option value="intermediate">المستوى المتوسط (Intermediate)</option>
              <option value="advanced">المستوى المتقدم (Advanced)</option>
              <option value="challenge">مستوى التحدي (Challenge)</option>
            </select>
          </div>

          {bankMode === 'training' ? (
            <div>
              <label className="block font-semibold text-[#1D1D1B] mb-1">مصفوفة المهارات (S1–S15):</label>
              <select
                value={selectedSkill}
                onChange={e => setSelectedSkill(e.target.value)}
                className="w-full p-2 bg-[#F9F7F2] border border-[#1D1D1B]/20 text-xs text-[#1D1D1B] focus:outline-[#1D1D1B]"
              >
                <option value="all">كافة المهارات (S1 - S15)</option>
                {UNIFIED_SKILLS.map(sk => (
                  <option key={sk.code} value={sk.code}>
                    {sk.code} — {sk.nameAr}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div>
              <label className="block font-semibold text-[#1D1D1B] mb-1">الدرس المستهدف:</label>
              <select
                value={selectedLesson}
                onChange={e => setSelectedLesson(e.target.value)}
                className="w-full p-2 bg-[#F9F7F2] border border-[#1D1D1B]/20 text-xs text-[#1D1D1B] focus:outline-[#1D1D1B]"
              >
                <option value="all">جميع الدروس</option>
                <option value="lesson-1">الدرس 1: طبيعة المحاسبة والمبادئ</option>
                <option value="lesson-2">الدرس 2: المعادلة المحاسبية</option>
                <option value="lesson-3">الدرس 3: القيد المزدوج ودورة المعاملات</option>
                <option value="lesson-4">الدرس 4: دفتر الأستاذ وميزان المراجعة</option>
                <option value="lesson-5">الدرس 5: الحسابات الختامية</option>
                <option value="lesson-6">الدرس 6: ورشة مقال JRE</option>
              </select>
            </div>
          )}
        </div>

        {bankMode === 'training' && (
          <div className="flex items-center gap-3 pt-2 border-t border-[#1D1D1B]/10 text-xs">
            <span className="font-semibold text-[#1D1D1B]">المستوى المعرفي (Bloom):</span>
            <div className="flex flex-wrap gap-1.5">
              {['all', 'knowledge', 'comprehension', 'application', 'analysis', 'evaluation', 'synthesis'].map(lvl => (
                <button
                  key={lvl}
                  onClick={() => setSelectedBloom(lvl)}
                  className={`px-2.5 py-1 text-[11px] font-bold border transition cursor-pointer ${
                    selectedBloom === lvl
                      ? 'bg-[#1D1D1B] text-[#F9F7F2] border-[#1D1D1B]'
                      : 'bg-[#F9F7F2] text-[#1D1D1B] hover:bg-[#C4A484]/20 border-[#1D1D1B]/15'
                  }`}
                >
                  {lvl === 'all' ? 'الكل' : bloomLabels[lvl] || lvl}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-[#1D1D1B]/70 pt-2 border-t border-[#1D1D1B]/10">
          <span>نتائج التصفية: {filteredQuestions.length} سؤالاً مطابقاً</span>
          <span className="text-[11px] font-bold text-emerald-800">
            {bankMode === 'textbook' ? 'توثيق رسمي من كتاب الوزارة ✓' : 'تدريب كفايات واكتشاف أخطاء ✓'}
          </span>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        {filteredQuestions.length === 0 ? (
          <div className="bg-[#FFFFFF] border border-[#1D1D1B]/20 p-8 text-center space-y-2">
            <Layers className="w-8 h-8 text-[#1D1D1B]/40 mx-auto" />
            <p className="text-sm font-bold text-[#1D1D1B]">لا توجد أسئلة تطابق معايير التصفية المختارة.</p>
            <Button size="sm" variant="outline" onClick={() => { 
              setSelectedUnit('all'); 
              setSelectedLesson('all'); 
              setSelectedLevel('all'); 
              setSelectedType('all'); 
              setSelectedSkill('all');
              setSelectedBloom('all');
              setSearchQuery(''); 
            }}>
              إعادة ضبط معايير التصفية
            </Button>
          </div>
        ) : (
          filteredQuestions.map((q, idx) => {
            const isAnswered = userAnswers[q.id] !== undefined;
            const isCorrect = isAnswered && userAnswers[q.id] === q.correctAnswer;
            const showExplanation = revealedExplanations[q.id];
            const showRubric = revealedRubrics[q.id];
            const skillInfo = q.skillCode ? SKILL_BY_CODE.get(q.skillCode) : undefined;

            return (
              <div 
                key={q.id} 
                className="bg-[#FFFFFF] border border-[#1D1D1B]/20 p-5 sm:p-6 shadow-xs space-y-4"
              >
                {/* Question Top Info */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1D1D1B]/10 pb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-black text-xs bg-[#1D1D1B] text-[#F9F7F2] px-2 py-0.5">
                      {q.originalId || `#${idx + 1}`}
                    </span>
                    <DifficultyBadge level={q.difficulty} />
                    <span className="text-[11px] text-[#1D1D1B]/80 font-bold">
                      {q.concept}
                    </span>

                    {/* Skill Badge for Training Bank */}
                    {skillInfo && (
                      <span className="text-[11px] bg-[#1D1D1B]/10 text-[#1D1D1B] font-bold px-2 py-0.5 border border-[#1D1D1B]/20 flex items-center gap-1">
                        <Compass className="w-3 h-3 text-[#C4A484]" />
                        <span>مهارة {skillInfo.code}: {skillInfo.nameAr}</span>
                      </span>
                    )}

                    {/* Bloom Level Badge */}
                    {q.bloomLevel && (
                      <span className="text-[10px] bg-[#C4A484]/20 text-[#1D1D1B] px-2 py-0.5 font-bold border border-[#C4A484]/40">
                        {bloomLabels[q.bloomLevel] || q.bloomLevel}
                      </span>
                    )}
                  </div>

                  {/* Ministry Textbook Citation or Training Badge */}
                  {q.sourceMapping ? (
                    <div className="flex items-center gap-1 text-[11px] text-[#1D1D1B]/70 bg-[#F9F7F2] border border-[#1D1D1B]/15 px-2 py-0.5">
                      <BookOpen className="w-3 h-3 text-[#C4A484]" />
                      <span>كتاب الوزارة ص {q.sourceMapping.source_page}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-[11px] text-[#1D1D1B]/70 bg-[#F9F7F2] border border-[#1D1D1B]/15 px-2 py-0.5">
                      <Sparkles className="w-3 h-3 text-[#C4A484]" />
                      <span>بنك التدريب التفاعلي v2.2</span>
                    </div>
                  )}
                </div>

                {/* Prompt */}
                <div className="text-sm sm:text-base font-bold text-[#1D1D1B] leading-relaxed whitespace-pre-line">
                  {q.question}
                </div>

                {/* Options / Answer Interface for MCQ */}
                {q.questionType === 'mcq' && Array.isArray(q.options) && q.options.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                    {q.options.map((option, optIdx) => {
                      const isSelected = userAnswers[q.id] === option;
                      let btnStyle = 'bg-[#F9F7F2] border-[#1D1D1B]/20 text-[#1D1D1B] hover:bg-[#FAF7EE]';

                      if (isAnswered) {
                        if (option === q.correctAnswer) {
                          btnStyle = 'bg-[#F4F8F4] border-emerald-800 text-[#1B4D2E] font-bold';
                        } else if (isSelected) {
                          btnStyle = 'bg-[#FDF3F2] border-rose-800 text-[#8A1F1D] line-through';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={isAnswered}
                          onClick={() => handleSelectAnswer(q.id, option)}
                          className={`p-3 text-xs sm:text-sm text-right border transition flex items-start gap-2 cursor-pointer ${btnStyle}`}
                        >
                          <span className="font-mono font-bold text-[11px] opacity-70">
                            [{String.fromCharCode(65 + optIdx)}]
                          </span>
                          <span className="flex-1">{option}</span>
                          {isAnswered && option === q.correctAnswer && (
                            <Check className="w-4 h-4 text-emerald-800 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* True / False Interface */}
                {q.questionType === 'true_false' && (
                  <div className="flex gap-3 pt-2">
                    <button
                      disabled={isAnswered}
                      onClick={() => handleSelectAnswer(q.id, true)}
                      className={`px-5 py-2 text-xs font-bold border transition cursor-pointer ${
                        isAnswered
                          ? q.correctAnswer === true
                            ? 'bg-[#F4F8F4] border-emerald-800 text-[#1B4D2E]'
                            : userAnswers[q.id] === true
                            ? 'bg-[#FDF3F2] border-rose-800 text-[#8A1F1D]'
                            : 'bg-[#F9F7F2] opacity-60'
                          : 'bg-[#F9F7F2] border-[#1D1D1B]/20 hover:bg-[#FAF7EE]'
                      }`}
                    >
                      ✓ العبارة صائبة (صحيح)
                    </button>
                    <button
                      disabled={isAnswered}
                      onClick={() => handleSelectAnswer(q.id, false)}
                      className={`px-5 py-2 text-xs font-bold border transition cursor-pointer ${
                        isAnswered
                          ? q.correctAnswer === false
                            ? 'bg-[#F4F8F4] border-emerald-800 text-[#1B4D2E]'
                            : userAnswers[q.id] === false
                            ? 'bg-[#FDF3F2] border-rose-800 text-[#8A1F1D]'
                            : 'bg-[#F9F7F2] opacity-60'
                          : 'bg-[#F9F7F2] border-[#1D1D1B]/20 hover:bg-[#FAF7EE]'
                      }`}
                    >
                      ✕ العبارة خاطئة (خطأ)
                    </button>
                  </div>
                )}

                {/* Pedagogical Alerts for Training Bank */}
                {q.commonMisconception && (
                  <div className="bg-[#FFF9F2] border-r-4 border-amber-500 p-3 text-xs text-[#1D1D1B] space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-amber-900">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      <span>المفهوم الشائع الخاطئ (Misconception):</span>
                    </div>
                    <p className="text-[#1D1D1B]/80 leading-relaxed pr-5">
                      {q.commonMisconception}
                    </p>
                  </div>
                )}

                {/* Distractor Rationale (if present) */}
                {Array.isArray(q.distractorRationale) && q.distractorRationale.length > 0 && isAnswered && (
                  <div className="bg-[#F9F7F2] border border-[#1D1D1B]/15 p-3 text-xs space-y-2">
                    <div className="font-bold text-[#1D1D1B] flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5 text-[#C4A484]" />
                      <span>تحليل البدائل والمشتتات:</span>
                    </div>
                    <div className="space-y-1 pr-4">
                      {q.distractorRationale.map((dr, dri) => (
                        <div key={dri} className="leading-relaxed">
                          <span className={`font-bold ${dr.isCorrect ? 'text-emerald-800' : 'text-[#1D1D1B]/70'}`}>
                            • {dr.option}:
                          </span>{' '}
                          <span className="text-[#1D1D1B]/85">{dr.rationale}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Toolbar */}
                <div className="pt-2 border-t border-[#1D1D1B]/10 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleExplanation(q.id)}
                      className="flex items-center gap-1.5 text-xs text-[#1D1D1B]/80 hover:text-[#1D1D1B] font-bold cursor-pointer"
                    >
                      {showExplanation ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{showExplanation ? 'إخفاء الإجابة النموذجية' : 'إظهار الحل والنموذج'}</span>
                    </button>

                    {q.rubric && (
                      <button
                        onClick={() => toggleRubric(q.id)}
                        className="flex items-center gap-1.5 text-xs text-[#8A1F1D] hover:text-[#1D1D1B] font-bold cursor-pointer border border-[#8A1F1D]/30 px-2 py-0.5 bg-[#FAF7EE]"
                      >
                        <FileText className="w-3 h-3" />
                        <span>{showRubric ? 'إخفاء روبرك التصحيح' : 'عرض معايير التصحيح والروبرك'}</span>
                      </button>
                    )}
                  </div>

                  <div className="flex gap-1 flex-wrap">
                    {Array.isArray(q.tags) && q.tags.map((t, ti) => (
                      <span key={ti} className="text-[10px] bg-[#F9F7F2] border border-[#1D1D1B]/15 px-2 py-0.5">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Rubric View */}
                {showRubric && q.rubric && (
                  <div className="bg-[#FAF7EE] border border-[#8A1F1D]/30 p-4 text-xs space-y-2 leading-relaxed animate-in fade-in">
                    <div className="font-bold text-[#8A1F1D] flex items-center gap-1.5">
                      <Award className="w-4 h-4" />
                      <span>معايير التقييم والروبرك المعتمد لهذا السؤال ({q.marks || 5} درجات):</span>
                    </div>
                    <div className="text-[#1D1D1B]/90 font-mono pr-5 bg-white p-2 border border-[#1D1D1B]/10">
                      {typeof q.rubric === 'string' ? (
                        q.rubric
                      ) : (
                        <div className="space-y-1 font-sans">
                          {q.rubric.criteria?.map((c, ci) => (
                            <div key={ci} className="flex justify-between items-center py-0.5 border-b border-[#1D1D1B]/5 last:border-0">
                              <span>{c.label}</span>
                              <span className="font-bold text-[#8A1F1D]">{c.marks} درجات</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="text-[11px] text-[#1D1D1B]/70 pr-5">
                      * للاطلاع على روبرك تصحيح المقالات المتقدمة الكامل، راجع مصفوفة التقييم السداسية للأبعاد الخمسة (20/25/25/20/10%).
                    </div>
                  </div>
                )}

                {/* Detailed Solution Box */}
                {showExplanation && (
                  <div className="bg-[#FAF7EE] border border-[#1D1D1B]/20 p-4 text-xs space-y-2 leading-relaxed animate-in fade-in">
                    <div className="font-bold text-[#1D1D1B] flex items-center gap-1">
                      <span className="text-[#C4A484]">●</span>
                      <span>الإجابة النموذجية: </span>
                      <span className="text-emerald-900 font-bold">
                        {String(q.correctAnswer === true ? 'صحيح' : q.correctAnswer === false ? 'خطأ' : q.correctAnswer)}
                      </span>
                    </div>
                    <div className="text-[#1D1D1B]/90 pr-3 border-r-2 border-[#C4A484]">
                      <span className="font-bold">التفسير الأكاديمي والاستدلال: </span>
                      {q.explanation}
                    </div>
                    {q.expectedReasoning && (
                      <div className="text-[#1D1D1B]/80 pr-3 border-r-2 border-emerald-700 text-[11px]">
                        <span className="font-bold text-emerald-900">مسار الاستدلال المتوقع من المتعلم: </span>
                        {q.expectedReasoning}
                      </div>
                    )}
                  </div>
                )}

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
