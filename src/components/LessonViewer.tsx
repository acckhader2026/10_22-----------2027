import React, { useState } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  BookOpen, Clock, Sparkles, CheckCircle2, ChevronLeft, ChevronRight, 
  Lightbulb, AlertTriangle, Scale, Brain, HelpCircle, Check, X, 
  ArrowLeft, ArrowRight, Layers, FileSpreadsheet, Eye, EyeOff, Award, BookA
} from 'lucide-react';
import { LessonContent, SolvedExample, QuickCheckQuestion, LessonQuiz } from '../types';
import { curriculumRegistry } from '../domain/curriculum/CurriculumRegistry';
import { accountingGlossary } from '../data/accountingGlossaryData';
import { useFocusMode } from '../context/FocusModeContext';
import { FocusModeToggle } from './FocusModeToggle';

const allLessons: LessonContent[] = curriculumRegistry.getAllLessonsContent();

interface LessonViewerProps {
  currentLessonIndex: number;
  setCurrentLessonIndex: (index: number) => void;
  onCompleteExercise: () => void;
  onOpenGlossaryTerm?: (termId: string) => void;
}

export const LessonViewer: React.FC<LessonViewerProps> = ({
  currentLessonIndex,
  setCurrentLessonIndex,
  onCompleteExercise,
  onOpenGlossaryTerm
}) => {
  const { isFocusMode, toggleFocusMode, fontSize } = useFocusMode();
  const lesson: LessonContent = curriculumRegistry.getLessonContentByIndex(currentLessonIndex);
  const [unitFilter, setUnitFilter] = useState<'all' | 'unit-1' | 'unit-2' | 'unit-3' | 'unit-4'>('all');
  const [activeTab, setActiveTab] = useState<'study' | 'examples' | 'cases' | 'misconceptions' | 'summary' | 'quiz'>('study');
  
  const displayedLessonsWithOriginalIndex = allLessons
    .map((l, idx) => ({ lesson: l, originalIndex: idx }))
    .filter(item => {
      if (unitFilter === 'all') return true;
      return item.lesson.unitId === unitFilter;
    });
  
  // Interactive quiz & quick check states
  const [selectedAnswers, setSelectedAnswers] = useState<{ [id: string]: string }>({});
  const [revealedSolutions, setRevealedSolutions] = useState<{ [id: string]: boolean }>({});
  const [revealedSteps, setRevealedSteps] = useState<{ [exampleId: string]: boolean }>({});
  const [revealedDiagnostic, setRevealedDiagnostic] = useState<{ [id: string]: boolean }>({});

  const toggleRevealDiagnostic = (id: string) => {
    setRevealedDiagnostic(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSelectAnswer = (qId: string, option: string) => {
    setSelectedAnswers(prev => ({ ...prev, [qId]: option }));
    onCompleteExercise();
  };

  const toggleRevealStep = (id: string) => {
    setRevealedSteps(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleRevealSolution = (id: string) => {
    setRevealedSolutions(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleNextLesson = () => {
    if (currentLessonIndex < allLessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
      setActiveTab('study');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
      setActiveTab('study');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Dynamic typography scale classes proportional to screen size and focus mode
  const titleClass = isFocusMode
    ? 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#F9F7F2] font-serif leading-tight'
    : 'text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#F9F7F2] font-serif leading-tight';

  const subtitleClass = isFocusMode
    ? 'text-base sm:text-lg md:text-xl lg:text-2xl text-[#F9F7F2]/85 mt-2 font-serif'
    : 'text-sm sm:text-base text-[#F9F7F2]/80 mt-2 font-serif';

  const sectionHeadingClass = isFocusMode
    ? 'text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#1D1D1B] font-serif'
    : 'text-lg sm:text-xl font-extrabold text-[#1D1D1B] font-serif';

  const bodyTextClass = isFocusMode
    ? 'text-sm sm:text-base md:text-lg lg:text-xl text-[#1D1D1B]/90 leading-relaxed font-serif'
    : 'text-xs sm:text-sm text-[#1D1D1B]/85 leading-relaxed font-serif';

  const subHeadingClass = isFocusMode
    ? 'text-base sm:text-lg md:text-xl font-bold text-[#1D1D1B] font-serif'
    : 'text-xs sm:text-sm font-bold text-[#1D1D1B] font-serif';

  const tableHeaderClass = isFocusMode
    ? 'p-3.5 sm:p-4 md:p-5 text-sm sm:text-base md:text-lg font-bold border-l border-[#1D1D1B]/40 last:border-l-0'
    : 'p-3 text-xs border-l border-[#1D1D1B]/40 last:border-l-0';

  const tableCellClass = isFocusMode
    ? 'p-3.5 sm:p-4 md:p-5 text-sm sm:text-base md:text-lg border-l border-[#1D1D1B]/10 last:border-l-0'
    : 'p-3 text-xs border-l border-[#1D1D1B]/10';

  const stepCardClass = isFocusMode
    ? 'p-3.5 sm:p-4 md:p-5 text-sm sm:text-base md:text-lg bg-[#F9F7F2] border border-[#1D1D1B]/10 leading-relaxed'
    : 'p-2.5 text-xs bg-[#F9F7F2] border border-[#1D1D1B]/10 leading-relaxed';

  const tabBtnClass = isFocusMode
    ? 'px-4 sm:px-5 py-2.5 sm:py-3 text-sm sm:text-base font-bold transition flex items-center gap-2 whitespace-nowrap border'
    : 'px-4 py-2 text-xs sm:text-sm font-bold transition flex items-center gap-1.5 whitespace-nowrap border';

  return (
    <div className={`${
      isFocusMode 
        ? `focus-mode-container focus-mode-scale-${fontSize} px-2 sm:px-6 md:px-8 lg:px-12 py-4 space-y-8` 
        : 'max-w-5xl mx-auto px-4 py-6 space-y-8'
    } transition-all duration-300`}>
      
      {/* Focus Mode Toggle Component at the Top of Reading Interface */}
      <FocusModeToggle
        isFocusMode={isFocusMode}
        onToggle={toggleFocusMode}
      />

      {/* Unit Filter & Lesson Selector Bar (Hidden in Focus Mode) */}
      {!isFocusMode && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 border-b border-[#1D1D1B]/15 pb-2">
            <span className="text-xs font-bold text-[#1D1D1B]/70 font-serif">اختر الوحدة:</span>
            <button
              onClick={() => setUnitFilter('all')}
              className={`px-3 py-1 text-xs font-bold font-serif transition border ${
                unitFilter === 'all'
                  ? 'bg-[#1D1D1B] text-[#F9F7F2] border-[#1D1D1B]'
                  : 'bg-[#FFFFFF] text-[#1D1D1B]/80 hover:bg-[#F9F7F2] border-[#1D1D1B]/20'
              }`}
            >
              جميع الدروس (18)
            </button>
            <button
              onClick={() => {
                setUnitFilter('unit-1');
                if (lesson.unitId !== 'unit-1') {
                  setCurrentLessonIndex(0);
                  setActiveTab('study');
                }
              }}
              className={`px-3 py-1 text-xs font-bold font-serif transition border ${
                unitFilter === 'unit-1'
                  ? 'bg-[#1D1D1B] text-[#F9F7F2] border-[#1D1D1B]'
                  : 'bg-[#FFFFFF] text-[#1D1D1B]/80 hover:bg-[#F9F7F2] border-[#1D1D1B]/20'
              }`}
            >
              الوحدة 1: الأساسيات (6 دروس)
            </button>
            <button
              onClick={() => {
                setUnitFilter('unit-2');
                if (lesson.unitId !== 'unit-2') {
                  setCurrentLessonIndex(6);
                  setActiveTab('study');
                }
              }}
              className={`px-3 py-1 text-xs font-bold font-serif transition border ${
                unitFilter === 'unit-2'
                  ? 'bg-[#1D1D1B] text-[#F9F7F2] border-[#1D1D1B]'
                  : 'bg-[#FFFFFF] text-[#1D1D1B]/80 hover:bg-[#F9F7F2] border-[#1D1D1B]/20'
              }`}
            >
              الوحدة 2: التسجيل المحاسبي (6 دروس)
            </button>
            <button
              onClick={() => {
                setUnitFilter('unit-3');
                if (lesson.unitId !== 'unit-3') {
                  setCurrentLessonIndex(12);
                  setActiveTab('study');
                }
              }}
              className={`px-3 py-1 text-xs font-bold font-serif transition border ${
                unitFilter === 'unit-3'
                  ? 'bg-[#1D1D1B] text-[#F9F7F2] border-[#1D1D1B]'
                  : 'bg-[#FFFFFF] text-[#1D1D1B]/80 hover:bg-[#F9F7F2] border-[#1D1D1B]/20'
              }`}
            >
              الوحدة 3: الدفاتر المساعدة (6 دروس)
            </button>
            <button
              onClick={() => {
                setUnitFilter('unit-4');
                if (lesson.unitId !== 'unit-4') {
                  setCurrentLessonIndex(18);
                  setActiveTab('study');
                }
              }}
              className={`px-3 py-1 text-xs font-bold font-serif transition border ${
                unitFilter === 'unit-4'
                  ? 'bg-[#1D1D1B] text-[#F9F7F2] border-[#1D1D1B]'
                  : 'bg-[#FFFFFF] text-[#1D1D1B]/80 hover:bg-[#F9F7F2] border-[#1D1D1B]/20'
              }`}
            >
              الوحدة 4: ميزان المراجعة وتصحيح الأخطاء (6 دروس)
            </button>
          </div>

          <div className="flex items-center justify-start gap-2 overflow-x-auto pb-2 scrollbar-none">
            {displayedLessonsWithOriginalIndex.map(({ lesson: l, originalIndex }) => (
              <button
                key={l.id}
                onClick={() => {
                  setCurrentLessonIndex(originalIndex);
                  setActiveTab('study');
                }}
                className={`px-3.5 py-2 text-xs font-bold whitespace-nowrap transition flex items-center gap-2 border ${
                  originalIndex === currentLessonIndex
                    ? 'bg-[#1D1D1B] text-[#F9F7F2] border-[#1D1D1B] shadow-xs'
                    : 'bg-[#FFFFFF] text-[#1D1D1B]/70 hover:bg-[#F9F7F2] hover:text-[#1D1D1B] border-[#1D1D1B]/15'
                }`}
              >
                <span className={`w-5 h-5 text-[10px] font-black flex items-center justify-center font-serif ${
                  originalIndex === currentLessonIndex ? 'bg-[#C4A484] text-[#1D1D1B]' : 'bg-[#F9F7F2] text-[#1D1D1B] border border-[#1D1D1B]/20'
                }`}>
                  {l.lessonNumber}
                </span>
                <span className="font-serif">
                  الدرس {l.lessonNumber}
                  <span className="text-[10px] opacity-75 mr-1 font-mono">
                    ({l.unitId === 'unit-4' ? 'و4' : l.unitId === 'unit-3' ? 'و3' : l.unitId === 'unit-2' ? 'و2' : 'و1'})
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Lesson Hero Banner */}
      <div className="bg-[#1D1D1B] text-[#F9F7F2] rounded-none p-6 sm:p-8 shadow-xs border border-[#1D1D1B] space-y-4 relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1D1D1B]/40 pb-4">
          <div className="flex items-center gap-2">
            <span className="bg-[#C4A484] text-[#1D1D1B] text-xs font-bold px-3 py-0.5 uppercase tracking-wider">
              {lesson.unitId === 'unit-2' ? 'الوحدة الثانية' : 'الوحدة الأولى'} • الدرس {lesson.lessonNumber} من 6
            </span>
            {lesson.subLo && (
              <span className="bg-[#FFFFFF]/10 text-[#C4A484] text-xs font-bold px-2.5 py-0.5 border border-[#C4A484]/40 font-mono">
                {lesson.subLo}
              </span>
            )}
            <div className="flex items-center gap-1.5 text-[#F9F7F2]/70 text-xs bg-[#FFFFFF]/10 px-2.5 py-0.5 border border-[#F9F7F2]/20">
              <Clock className="w-3.5 h-3.5 text-[#C4A484]" />
              <span>{lesson.estimatedMinutes} دقيقة مذاكرة</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevLesson}
              disabled={currentLessonIndex === 0}
              className="p-2 bg-[#FFFFFF]/10 hover:bg-[#FFFFFF]/20 disabled:opacity-30 disabled:cursor-not-allowed transition border border-[#F9F7F2]/20"
              title="الدرس السابق"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextLesson}
              disabled={currentLessonIndex === allLessons.length - 1}
              className="p-2 bg-[#FFFFFF]/10 hover:bg-[#FFFFFF]/20 disabled:opacity-30 disabled:cursor-not-allowed transition border border-[#F9F7F2]/20"
              title="الدرس التالي"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div>
          <h2 className={titleClass}>
            {lesson.title}
          </h2>
          <p className={subtitleClass}>
            {lesson.subtitle}
          </p>
          {lesson.subLoDescription && (
            <div className={`mt-3 bg-[#FFFFFF]/5 border-r-2 border-[#C4A484] p-3 leading-relaxed font-serif ${isFocusMode ? 'text-sm sm:text-base text-[#F9F7F2]/90' : 'text-xs text-[#F9F7F2]/85'}`}>
              <strong className="text-[#C4A484]">🎯 مخرجات التعلم المرتبطة (Master Template):</strong> {lesson.subLoDescription}
            </div>
          )}
        </div>

        {/* Real-world Hook Card */}
        <div className="bg-[#F9F7F2]/10 backdrop-blur-md rounded-none p-4 sm:p-5 border border-[#F9F7F2]/15 space-y-2 mt-4">
          <div className="flex items-center gap-2 text-[#C4A484] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>قصة البداية والواقع العملي</span>
          </div>
          <p className={`${isFocusMode ? 'text-sm sm:text-base md:text-lg text-[#F9F7F2]/95' : 'text-xs sm:text-sm text-[#F9F7F2]/90'} leading-relaxed font-serif`}>
            {lesson.realWorldIntroduction.hookStory}
          </p>
          <p className={`${isFocusMode ? 'text-xs sm:text-sm text-[#C4A484]' : 'text-xs text-[#C4A484]'} font-semibold border-t border-[#F9F7F2]/10 pt-2 font-serif`}>
            💡 {lesson.realWorldIntroduction.connectionToLesson}
          </p>
        </div>
      </div>

      {/* Internal Lesson Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-[#1D1D1B]/15">
        <button
          onClick={() => setActiveTab('study')}
          className={`${tabBtnClass} ${
            activeTab === 'study'
              ? 'bg-[#1D1D1B] text-[#F9F7F2] border-[#1D1D1B] shadow-xs'
              : 'text-[#1D1D1B]/70 hover:bg-[#F9F7F2] border-transparent'
          }`}
        >
          <BookOpen className="w-4 h-4 text-[#C4A484]" />
          <span>الشرح والمفاهيم ({lesson.sections.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('examples')}
          className={`${tabBtnClass} ${
            activeTab === 'examples'
              ? 'bg-[#1D1D1B] text-[#F9F7F2] border-[#1D1D1B] shadow-xs'
              : 'text-[#1D1D1B]/70 hover:bg-[#F9F7F2] border-transparent'
          }`}
        >
          <Layers className="w-4 h-4 text-[#C4A484]" />
          <span>الأمثلة المحلولة ({lesson.solvedExamples.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('cases')}
          className={`${tabBtnClass} ${
            activeTab === 'cases'
              ? 'bg-[#1D1D1B] text-[#F9F7F2] border-[#1D1D1B] shadow-xs'
              : 'text-[#1D1D1B]/70 hover:bg-[#F9F7F2] border-transparent'
          }`}
        >
          <Brain className="w-4 h-4 text-[#C4A484]" />
          <span>فكر كمحاسب وحالات واقعية</span>
        </button>

        {lesson.misconceptions && lesson.misconceptions.length > 0 && (
          <button
            onClick={() => setActiveTab('misconceptions')}
            className={`${tabBtnClass} ${
              activeTab === 'misconceptions'
                ? 'bg-[#1D1D1B] text-[#F9F7F2] border-[#1D1D1B] shadow-xs'
                : 'text-[#1D1D1B]/70 hover:bg-[#F9F7F2] border-transparent'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-[#C4A484]" />
            <span>الأخطاء التشخيصية ({lesson.misconceptions.length})</span>
          </button>
        )}

        <button
          onClick={() => setActiveTab('summary')}
          className={`${tabBtnClass} ${
            activeTab === 'summary'
              ? 'bg-[#1D1D1B] text-[#F9F7F2] border-[#1D1D1B] shadow-xs'
              : 'text-[#1D1D1B]/70 hover:bg-[#F9F7F2] border-transparent'
          }`}
        >
          <Clock className="w-4 h-4 text-[#C4A484]" />
          <span>في دقيقة واحدة (كبسولة الدرس)</span>
        </button>

        {lesson.lessonQuiz && (
          <button
            onClick={() => setActiveTab('quiz')}
            className={`${tabBtnClass} ${
              activeTab === 'quiz'
                ? 'bg-[#1D1D1B] text-[#F9F7F2] border-[#1D1D1B] shadow-xs'
                : 'text-[#1D1D1B]/70 hover:bg-[#F9F7F2] border-transparent'
            }`}
          >
            <Award className="w-4 h-4 text-[#C4A484]" />
            <span>اختبار إتقان الدرس{lesson.lessonQuiz.totalMarks ? ` (${lesson.lessonQuiz.totalMarks} درجة)` : ''}</span>
          </button>
        )}
      </div>

      {/* TAB 1: STUDY & SECTIONS */}
      {activeTab === 'study' && (
        <div className="space-y-8">
          
          {/* Interactive Accounting Glossary Terms Card */}
          {(() => {
            const lessonTerms = accountingGlossary.filter(g => g.relatedLessonId === lesson.id);
            if (lessonTerms.length === 0) return null;
            return (
              <div className="bg-[#FDFCF7] border-2 border-[#1D1D1B] p-4 sm:p-5 shadow-xs space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1D1D1B]/15 pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-[#C4A484] text-[#1D1D1B] flex items-center justify-center font-bold">
                      <BookA className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-[#1D1D1B] text-xs sm:text-sm font-serif">
                        قاموس المصطلحات والمبادئ المحورية في هذا الدرس:
                      </h4>
                      <p className="text-[11px] text-[#1D1D1B]/70">
                        اضغط على أي مصطلح لعرض تعريفه الأكاديمي، مثاله العملي، والتنبيهات المنهجية فوراً
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono bg-[#1D1D1B] text-[#F9F7F2] px-2 py-0.5 font-bold">
                    {lessonTerms.length} مصطلحات أساسية
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {lessonTerms.map(term => (
                    <button
                      key={term.id}
                      onClick={() => onOpenGlossaryTerm && onOpenGlossaryTerm(term.id)}
                      className="px-3 py-1.5 bg-[#FFFFFF] hover:bg-[#1D1D1B] text-[#1D1D1B] hover:text-[#F9F7F2] border border-[#1D1D1B]/25 hover:border-[#1D1D1B] text-xs font-bold transition flex items-center gap-1.5 group cursor-pointer shadow-2xs"
                    >
                      <span className="w-1.5 h-1.5 bg-[#C4A484] group-hover:bg-[#F9F7F2]" />
                      <span>{term.term}</span>
                      <span className="text-[10px] text-[#1D1D1B]/50 group-hover:text-[#F9F7F2]/70 font-mono">
                        ({term.termEn})
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Learning Objectives Pill Box */}
          {((lesson.whatYouWillLearn && lesson.whatYouWillLearn.length > 0) || (lesson.learningOutcomes && lesson.learningOutcomes.length > 0) || (lesson.objectives && lesson.objectives.length > 0)) && (
            <div className="bg-[#FFFFFF] border border-[#1D1D1B]/15 rounded-none p-4 sm:p-5 shadow-xs">
              <h4 className="font-bold text-[#1D1D1B] text-sm mb-2 flex items-center gap-2 font-serif">
                <CheckCircle2 className="w-4 h-4 text-[#C4A484]" />
                <span>ما ستتعلمه وتتقنه في هذا الدرس:</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(lesson.whatYouWillLearn || lesson.learningOutcomes || lesson.objectives || []).map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-[#1D1D1B]/80 font-medium">
                    <span className="w-1.5 h-1.5 bg-[#C4A484] mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sections List */}
          <div className="space-y-6">
            {(lesson.sections || []).map((section, sIdx) => (
              <div 
                key={section.id || sIdx} 
                className="bg-[#FFFFFF] border border-[#1D1D1B]/15 rounded-none p-5 sm:p-8 shadow-xs space-y-5"
              >
                <div className="border-b border-[#1D1D1B]/10 pb-3 flex items-center justify-between">
                  <h3 className={sectionHeadingClass}>
                    {section.title}
                  </h3>
                  <span className={`font-mono text-[#1D1D1B]/50 ${isFocusMode ? 'text-sm' : 'text-[11px]'}`}>§ {sIdx + 1}</span>
                </div>

                {/* Simplified vs Scientific Definitions */}
                {(section.simplifiedDefinition || section.scientificDefinition) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {section.simplifiedDefinition && (
                      <div className="bg-[#F9F7F2] border border-[#1D1D1B]/10 p-4 sm:p-5 space-y-1.5">
                        <div className="flex items-center gap-1.5 text-[#1D1D1B] font-bold font-serif">
                          <Lightbulb className="w-4 h-4 text-[#C4A484]" />
                          <span className={subHeadingClass}>المفهوم ببساطة (الفكرة الجوهرية):</span>
                        </div>
                        <p className={bodyTextClass}>
                          {section.simplifiedDefinition}
                        </p>
                      </div>
                    )}

                    {section.scientificDefinition && (
                      <div className="bg-[#FFFFFF] border border-[#1D1D1B]/20 p-4 sm:p-5 space-y-1.5">
                        <div className="flex items-center gap-1.5 text-[#1D1D1B] font-bold font-serif">
                          <BookOpen className="w-4 h-4 text-[#1D1D1B]" />
                          <span className={subHeadingClass}>التعريف العلمي الدقيق (معايير المحاسبة):</span>
                        </div>
                        <p className={bodyTextClass}>
                          {section.scientificDefinition}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Why We Study This */}
                {section.whyWeStudyThis && (
                  <div className="bg-[#F9F7F2] border-r-4 border-[#C4A484] p-4 sm:p-5 text-[#1D1D1B] space-y-1">
                    <span className={`font-bold block font-serif ${subHeadingClass}`}>🎯 لماذا ندرس هذا المفهوم وكيف يؤثر على المنشأة؟</span>
                    <p className={bodyTextClass}>{section.whyWeStudyThis}</p>
                  </div>
                )}

                {/* Deep Markdown / Conceptual & Technical Content */}
                {section.content && (
                  <div className="bg-[#FFFFFF] border border-[#1D1D1B]/15 p-5 sm:p-6 space-y-4 shadow-xs">
                    <div className="flex items-center justify-between border-b border-[#1D1D1B]/15 pb-3 flex-wrap gap-2">
                      <div className="flex items-center gap-2.5 text-[#1D1D1B] font-bold font-serif">
                        <BookOpen className="w-5 h-5 text-[#C4A484] shrink-0" />
                        <span className={`font-extrabold ${subHeadingClass}`}>
                          {section.contentTitle ? `📖 ${section.contentTitle}:` : '📖 الشرح التفصيلي والتأصيل المحاسبي للمفهوم:'}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-[#1D1D1B]/75 bg-[#F9F7F2] px-3 py-1 border border-[#1D1D1B]/15 font-serif flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C4A484]"></span>
                        قواعد وضوابط معتمدة
                      </span>
                    </div>

                    <div className={`text-[#1D1D1B]/90 font-serif leading-relaxed ${bodyTextClass}`}>
                      <Markdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          h1: ({ children }) => (
                            <h2 className="text-base sm:text-lg font-black text-[#1D1D1B] mt-5 mb-2.5 pb-1.5 border-b border-[#1D1D1B]/15 font-serif">
                              {children}
                            </h2>
                          ),
                          h2: ({ children }) => (
                            <h3 className="text-sm sm:text-base font-bold text-[#1D1D1B] mt-4 mb-2 pb-1 border-b border-[#1D1D1B]/10 font-serif">
                              {children}
                            </h3>
                          ),
                          h3: ({ children }) => (
                            <h4 className="text-xs sm:text-sm font-bold text-[#1D1D1B] mt-4 mb-2 flex items-center gap-2 font-serif">
                              <span className="w-2 h-2 bg-[#C4A484] inline-block shrink-0"></span>
                              <span>{children}</span>
                            </h4>
                          ),
                          h4: ({ children }) => (
                            <h5 className="text-xs sm:text-sm font-bold text-[#C4A484] mt-3 mb-1.5 font-serif">
                              {children}
                            </h5>
                          ),
                          p: ({ children }) => (
                            <p className="mb-3 last:mb-0 leading-relaxed font-serif">
                              {children}
                            </p>
                          ),
                          strong: ({ children }) => (
                            <strong className="font-extrabold text-[#1D1D1B]">{children}</strong>
                          ),
                          ul: ({ children }) => (
                            <ul className="list-disc list-inside space-y-1.5 my-3 pr-2 text-[#1D1D1B]/90 font-serif">
                              {children}
                            </ul>
                          ),
                          ol: ({ children }) => (
                            <ol className="list-decimal list-inside space-y-2 my-3 pr-2 text-[#1D1D1B]/90 font-serif font-bold">
                              {children}
                            </ol>
                          ),
                          li: ({ children }) => (
                            <li className="leading-relaxed">
                              <span className="font-normal">{children}</span>
                            </li>
                          ),
                          blockquote: ({ children }) => (
                            <div className="bg-[#F9F7F2] border-r-4 border-[#C4A484] p-4 my-3 text-xs sm:text-sm text-[#1D1D1B] font-serif not-italic">
                              {children}
                            </div>
                          ),
                          table: ({ children }) => (
                            <div className="overflow-x-auto my-4 border border-[#1D1D1B]/20">
                              <table className="w-full text-right border-collapse text-xs sm:text-sm">
                                {children}
                              </table>
                            </div>
                          ),
                          thead: ({ children }) => (
                            <thead className="bg-[#1D1D1B] text-[#F9F7F2] font-bold font-serif">
                              {children}
                            </thead>
                          ),
                          th: ({ children }) => (
                            <th className="p-3 border-l border-[#1D1D1B]/40 last:border-l-0 text-center font-serif text-xs sm:text-sm">
                              {children}
                            </th>
                          ),
                          tbody: ({ children }) => (
                            <tbody className="divide-y divide-[#1D1D1B]/10 bg-[#FFFFFF]">
                              {children}
                            </tbody>
                          ),
                          tr: ({ children }) => (
                            <tr className="hover:bg-[#F9F7F2]/60 transition-colors">
                              {children}
                            </tr>
                          ),
                          td: ({ children }) => (
                            <td className="p-3 border-l border-[#1D1D1B]/10 last:border-l-0 font-serif text-right text-xs sm:text-sm leading-relaxed">
                              {children}
                            </td>
                          ),
                          hr: () => <hr className="my-4 border-[#1D1D1B]/15" />,
                          code: ({ children }) => (
                            <code className="bg-[#F9F7F2] border border-[#1D1D1B]/15 px-2 py-0.5 text-xs font-mono font-bold text-[#1D1D1B]">
                              {children}
                            </code>
                          )
                        }}
                      >
                        {section.content}
                      </Markdown>
                    </div>
                  </div>
                )}

                {/* How to Apply */}
                {section.howToApply && section.howToApply.length > 0 && (
                  <div className="space-y-2.5">
                    <h4 className={`font-bold text-[#1D1D1B] flex items-center gap-2 font-serif ${subHeadingClass}`}>
                      <span>⚙️ خطوات التطبيق والحل المحاسبي السليم:</span>
                    </h4>
                    <div className="space-y-2">
                      {section.howToApply.map((step, stepIdx) => (
                        <div key={stepIdx} className={`flex items-start gap-3 ${stepCardClass}`}>
                          <span className="font-bold text-[#1D1D1B] shrink-0 font-serif">{stepIdx + 1}.</span>
                          <span className="leading-relaxed">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Key Insight */}
                {section.keyInsight && (
                  <div className="bg-[#1D1D1B] text-[#F9F7F2] p-4 sm:p-5 border border-[#1D1D1B] space-y-1.5">
                    <span className={`text-[#C4A484] font-bold block font-serif ${subHeadingClass}`}>💡 {section.keyInsight.title}</span>
                    <p className="font-mono text-xs sm:text-sm text-[#C4A484]">{section.keyInsight.mnemonicOrRule}</p>
                    <p className={`text-[#F9F7F2]/85 font-serif ${bodyTextClass}`}>{section.keyInsight.explanation}</p>
                  </div>
                )}

                {/* Micro Example */}
                {section.microExample && (
                  <div className="bg-[#F9F7F2] border border-[#1D1D1B]/15 p-4 sm:p-5 text-[#1D1D1B] flex items-start gap-2.5">
                    <span className={`font-bold shrink-0 font-serif ${subHeadingClass}`}>📌 مثال تطبيقي سريع:</span>
                    <span className={bodyTextClass}>{section.microExample}</span>
                  </div>
                )}

                {/* Comparison Table if exists */}
                {section.comparison && (
                  <div className="space-y-2.5 mt-4">
                    <h5 className={`font-bold text-[#1D1D1B] flex items-center gap-2 font-serif ${subHeadingClass}`}>
                      <Scale className="w-4 h-4 text-[#C4A484]" />
                      <span>{section.comparison.title}</span>
                    </h5>
                    <div className="overflow-x-auto border border-[#1D1D1B]/20">
                      <table className="w-full text-right">
                        <thead className="bg-[#1D1D1B] text-[#F9F7F2] font-bold">
                          <tr>
                            {(section.comparison.headers || []).map((h, i) => (
                              <th key={i} className={tableHeaderClass}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#1D1D1B]/10 bg-[#FFFFFF]">
                          {(section.comparison.rows || []).map((row, rIdx) => (
                            <tr key={rIdx} className="hover:bg-[#F9F7F2]">
                              <td className={`${tableCellClass} font-semibold text-[#1D1D1B]`}>{row.aspect}</td>
                              <td className={`${tableCellClass} text-[#1D1D1B]/80`}>{row.col1}</td>
                              <td className={`${tableCellClass} text-[#1D1D1B]/80`}>{row.col2}</td>
                              {row.extra && <td className={`${tableCellClass} text-[#1D1D1B]/80`}>{row.extra}</td>}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Caution Box */}
                {section.caution && (
                  <div className="bg-[#FFFFFF] border-2 border-[#1D1D1B] p-4 sm:p-6 space-y-2.5">
                    <div className="flex items-center gap-2 text-[#1D1D1B] font-bold uppercase tracking-wider">
                      <AlertTriangle className="w-4 h-4 text-[#C4A484]" />
                      <span className={subHeadingClass}>⚠️ انتبه: {section.caution.title}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div className="bg-[#F9F7F2] p-3.5 sm:p-4 border border-[#1D1D1B]/15">
                        <span className={`font-bold text-[#1D1D1B] block mb-1 ${subHeadingClass}`}>الخطأ الشائع:</span>
                        <p className={bodyTextClass}>{section.caution.commonMistake}</p>
                        <p className={`text-[#1D1D1B] font-bold mt-1.5 font-serif ${isFocusMode ? 'text-xs sm:text-sm' : 'text-[11px]'}`}>السبب: {section.caution.whyWrong}</p>
                      </div>
                      <div className="bg-[#F9F7F2] p-3.5 sm:p-4 border border-[#1D1D1B]/15">
                        <span className={`font-bold text-[#1D1D1B] block mb-1 ${subHeadingClass}`}>التصرف الصحيح المحاسبي:</span>
                        <p className={bodyTextClass}>{section.caution.correctWay}</p>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            ))}
          </div>

          {/* Quick Check Practice */}
          {lesson.quickChecks && lesson.quickChecks.length > 0 && (
            <div className="bg-[#1D1D1B] text-[#F9F7F2] rounded-none p-6 sm:p-8 space-y-6 shadow-xs border border-[#1D1D1B]">
              <div className="flex items-center justify-between border-b border-[#1D1D1B]/40 pb-4">
                <div>
                  <span className="text-[#C4A484] text-xs font-bold uppercase tracking-wider block mb-1">تدريب ذاتي فوري</span>
                  <h3 className={`font-extrabold text-[#F9F7F2] font-serif ${sectionHeadingClass}`}>✏️ تدرب سريعاً واختبر فهمك للدرس</h3>
                </div>
                <span className={`border border-[#C4A484] text-[#C4A484] font-bold px-3 py-1 ${isFocusMode ? 'text-xs sm:text-sm' : 'text-xs'}`}>
                  {lesson.quickChecks.length} أسئلة
                </span>
              </div>

              <div className="space-y-4">
                {lesson.quickChecks.map((qc, qIdx) => {
                  const userAns = selectedAnswers[qc.id];
                  const isAnswered = userAns !== undefined;
                  const isCorrect = userAns === qc.correctAnswer;

                  return (
                    <div key={qc.id || qIdx} className="bg-[#FFFFFF]/5 border border-[#F9F7F2]/15 p-5 sm:p-6 space-y-3.5">
                      <div className={`flex items-center justify-between text-[#F9F7F2]/60 ${isFocusMode ? 'text-xs sm:text-sm' : 'text-xs'}`}>
                        <span className="font-serif">السؤال {qIdx + 1}</span>
                        <span className="text-[#C4A484]">مستوى الصعوبة: {qc.level}</span>
                      </div>

                      <p className={`font-semibold text-[#F9F7F2] leading-relaxed font-serif ${subHeadingClass}`}>
                        {qc.question}
                      </p>

                      {qc.options && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                          {qc.options.map((opt, optIdx) => {
                            const isSelected = userAns === opt;
                            return (
                              <button
                                key={optIdx}
                                onClick={() => handleSelectAnswer(qc.id, opt)}
                                className={`p-3.5 font-medium text-right transition border flex items-center justify-between cursor-pointer ${
                                  isFocusMode ? 'text-xs sm:text-sm' : 'text-xs'
                                } ${
                                  isSelected
                                    ? isCorrect
                                      ? 'bg-[#C4A484] text-[#1D1D1B] border-[#C4A484] font-bold'
                                      : 'bg-[#1D1D1B] text-[#F9F7F2] border-white/60 font-bold'
                                    : 'bg-[#FFFFFF]/10 hover:bg-[#FFFFFF]/20 text-[#F9F7F2] border-[#F9F7F2]/20'
                                }`}
                              >
                                <span>{opt}</span>
                                {isSelected && (
                                  isCorrect ? <Check className="w-4 h-4 text-[#1D1D1B]" /> : <X className="w-4 h-4 text-white" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {isAnswered && (
                        <div className={`p-4 border ${
                          isFocusMode ? 'text-xs sm:text-sm' : 'text-xs'
                        } ${
                          isCorrect ? 'bg-[#FFFFFF]/10 text-[#C4A484] border-[#C4A484]/40' : 'bg-[#FFFFFF]/10 text-white border-white/40'
                        }`}>
                          <div className="font-bold mb-1 font-serif">
                            {isCorrect ? '✨ إجابة صحيحة ومتقنة!' : `❌ إجابة غير دقيقة. الإجابة الصحيحة هي: [${qc.correctAnswer}]`}
                          </div>
                          <p className="opacity-90 leading-relaxed">{qc.explanation}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      )}

      {/* TAB 2: SOLVED EXAMPLES */}
      {activeTab === 'examples' && (
        <div className="space-y-6">
          <div className="bg-[#F9F7F2] border border-[#1D1D1B]/15 p-4 text-xs text-[#1D1D1B] flex items-center justify-between font-serif">
            <span>💡 تعرض هذه الأمثلة طريقة التفكير المحاسبي خطوة بخطوة مع التعليل المعياري.</span>
            <span className="font-bold border border-[#1D1D1B] bg-[#FFFFFF] px-2 py-0.5">{(lesson.solvedExamples || []).length} أمثلة متدرجة</span>
          </div>

          {(lesson.solvedExamples || []).map((ex, exIdx) => {
            const isRevealed = revealedSteps[ex.id];

            return (
              <div key={ex.id || exIdx} className="bg-[#FFFFFF] border border-[#1D1D1B]/15 rounded-none p-6 sm:p-8 shadow-xs space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1D1D1B]/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 bg-[#1D1D1B] text-[#C4A484] font-bold text-xs flex items-center justify-center font-serif">
                      {exIdx + 1}
                    </span>
                    <h3 className={subHeadingClass}>
                      {ex.title}
                    </h3>
                  </div>
                  <span className={`border border-[#1D1D1B]/30 bg-[#F9F7F2] text-[#1D1D1B] px-3 py-0.5 font-bold ${isFocusMode ? 'text-xs sm:text-sm' : 'text-xs'}`}>
                    مستوى: {ex.level}
                  </span>
                </div>

                {/* Scenario */}
                <div className="bg-[#F9F7F2] p-4 sm:p-5 border border-[#1D1D1B]/10 space-y-2">
                  <span className={`font-bold text-[#1D1D1B]/60 uppercase tracking-wider block ${isFocusMode ? 'text-xs sm:text-sm' : 'text-xs'}`}>نص المسألة والبيانات المعطاة:</span>
                  <p className={`${bodyTextClass} whitespace-pre-line`}>
                    {ex.scenario}
                  </p>
                </div>

                {/* Required */}
                {ex.required && ex.required.length > 0 && (
                  <div className="bg-[#FFFFFF] border-r-4 border-[#C4A484] p-4 sm:p-5 border-y border-l border-[#1D1D1B]/10">
                    <span className={`font-bold block mb-1.5 font-serif ${subHeadingClass}`}>المطلوب:</span>
                    <ul className={`list-disc list-inside space-y-1 font-medium ${bodyTextClass}`}>
                      {ex.required.map((r, i) => <li key={i}>{r}</li>)}
                    </ul>
                  </div>
                )}

                {/* Thinking Method */}
                {ex.thinkingMethod && (
                  <div className={`bg-[#F9F7F2] p-3.5 sm:p-4 border border-[#1D1D1B]/10 ${bodyTextClass}`}>
                    <strong className="text-[#1D1D1B] font-serif">🧠 طريقة التفكير المحاسبي الذكي:</strong> {ex.thinkingMethod}
                  </div>
                )}

                {/* Toggle Reveal Button */}
                <button
                  onClick={() => toggleRevealStep(ex.id)}
                  className={`w-full py-3 bg-[#F9F7F2] hover:bg-[#1D1D1B] hover:text-[#F9F7F2] text-[#1D1D1B] font-bold transition flex items-center justify-center gap-2 border border-[#1D1D1B]/20 cursor-pointer ${isFocusMode ? 'text-sm sm:text-base' : 'text-xs'}`}
                >
                  {isRevealed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  <span>{isRevealed ? 'إخفاء خطوات الحل التفصيلي' : 'إظهار الحل النموذجي خطوة بخطوة'}</span>
                </button>

                {/* Steps Accordion */}
                {isRevealed && (
                  <div className="space-y-3 pt-2 border-t border-[#1D1D1B]/10">
                    <div className="space-y-2.5">
                      {(ex.steps || []).map((step) => (
                        <div key={step.stepNumber} className={`p-4 border border-[#1D1D1B]/10 space-y-2 ${stepCardClass}`}>
                          <div className="flex items-center gap-2 font-bold text-[#1D1D1B] font-serif">
                            <span className="w-6 h-6 bg-[#1D1D1B] text-[#C4A484] flex items-center justify-center text-xs">
                              {step.stepNumber}
                            </span>
                            <span>{step.description}</span>
                          </div>
                          {step.calculation && (
                            <div className={`font-mono bg-[#FFFFFF] p-2.5 border border-[#1D1D1B]/20 text-[#1D1D1B] ${isFocusMode ? 'text-sm sm:text-base' : 'text-xs'}`}>
                              {step.calculation}
                            </div>
                          )}
                          <p className={`text-[#1D1D1B]/70 leading-relaxed font-serif ${isFocusMode ? 'text-xs sm:text-sm' : 'text-xs'}`}>{step.note}</p>
                        </div>
                      ))}
                    </div>

                    <div className="bg-[#1D1D1B] text-[#F9F7F2] p-5 space-y-1.5 mt-4 border border-[#1D1D1B]">
                      <div className="text-xs font-bold text-[#C4A484] uppercase tracking-wider">النتيجة النهائية:</div>
                      <div className={`font-extrabold font-serif ${isFocusMode ? 'text-base sm:text-lg md:text-xl' : 'text-sm sm:text-base'}`}>{ex.finalResult}</div>
                      {ex.accountingJustification && (
                        <div className={`text-[#F9F7F2]/80 pt-1.5 border-t border-[#F9F7F2]/20 font-serif ${isFocusMode ? 'text-sm sm:text-base' : 'text-xs'}`}>
                          ⚖️ <strong>التعليل المحاسبي:</strong> {ex.accountingJustification}
                        </div>
                      )}
                    </div>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

      {/* TAB 3: CASES & THINK LIKE AN ACCOUNTANT */}
      {activeTab === 'cases' && (
        <div className="space-y-8">
          
          {/* Think Like an Accountant */}
          {lesson.thinkLikeAnAccountantQuestions && lesson.thinkLikeAnAccountantQuestions.length > 0 && (
            <div className="bg-[#FFFFFF] border border-[#1D1D1B]/15 rounded-none p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="flex items-center gap-3 border-b border-[#1D1D1B]/10 pb-4">
                <div className="p-3 bg-[#1D1D1B] text-[#C4A484]">
                  <Brain className="w-6 h-6" />
                </div>
                <div>
                  <h3 className={sectionHeadingClass}>
                    🧠 فكر كمحاسب (Think Like an Accountant)
                  </h3>
                  <p className={`text-[#1D1D1B]/60 ${isFocusMode ? 'text-sm' : 'text-xs'}`}>تحليل مالي ومساءلة مهنية رفيعة</p>
                </div>
              </div>

              <div className="space-y-4">
                {lesson.thinkLikeAnAccountantQuestions.map((tla, tlaIdx) => {
                  const isSolRevealed = revealedSolutions[tla.id];

                  return (
                    <div key={tla.id || tlaIdx} className="bg-[#F9F7F2] border border-[#1D1D1B]/15 p-5 sm:p-6 space-y-3.5">
                      <h4 className={`font-bold text-[#1D1D1B] font-serif ${subHeadingClass}`}>{tla.question}</h4>
                      <p className={`bg-[#FFFFFF] p-4 border border-[#1D1D1B]/10 font-serif ${bodyTextClass}`}>
                        <strong>السيناريو الواقعي:</strong> {tla.scenario}
                      </p>

                      {tla.guidingQuestions && tla.guidingQuestions.length > 0 && (
                        <div className={`space-y-1 text-[#1D1D1B] ${isFocusMode ? 'text-sm sm:text-base' : 'text-xs'}`}>
                          <span className="font-bold block font-serif">أسئلة استرشادية للتفكير:</span>
                          <ul className="list-disc list-inside space-y-1 text-[#1D1D1B]/80">
                            {tla.guidingQuestions.map((g, i) => <li key={i}>{g}</li>)}
                          </ul>
                        </div>
                      )}

                      <button
                        onClick={() => toggleRevealSolution(tla.id)}
                        className={`px-4 py-2.5 bg-[#1D1D1B] hover:bg-[#333330] text-[#F9F7F2] font-bold transition border border-[#1D1D1B] cursor-pointer ${isFocusMode ? 'text-sm sm:text-base' : 'text-xs'}`}
                      >
                        {isSolRevealed ? 'إخفاء الرأي المهني النموذجي' : 'عرض الرأي المهني النموذجي'}
                      </button>

                      {isSolRevealed && (
                        <div className="bg-[#FFFFFF] p-4 sm:p-5 border border-[#1D1D1B]/20 space-y-2">
                          <strong className={`text-[#1D1D1B] block font-serif ${subHeadingClass}`}>الإجابة والاستنتاج المهني:</strong>
                          <p className={bodyTextClass}>{tla.idealAnswer}</p>
                          <span className={`text-[#C4A484] block pt-2 border-t border-[#1D1D1B]/10 font-bold ${isFocusMode ? 'text-xs sm:text-sm' : 'text-[11px]'}`}>
                            📌 المبدأ المحاسبي الحاكم: {tla.accountingPrinciple}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Real World Case Study */}
          {lesson.realWorldCase && (
            <div className="bg-[#FFFFFF] border border-[#1D1D1B]/15 rounded-none p-6 sm:p-8 space-y-5 shadow-xs">
              <div className="flex items-center gap-3 border-b border-[#1D1D1B]/10 pb-3">
                <div className="p-2.5 bg-[#1D1D1B] text-[#C4A484]">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={sectionHeadingClass}>
                    {lesson.realWorldCase.title}
                  </h3>
                  <p className={`text-[#1D1D1B]/60 ${isFocusMode ? 'text-sm' : 'text-xs'}`}>حالة عملية متكاملة من واقع السوق المصري</p>
                </div>
              </div>

              <div className={`bg-[#F9F7F2] p-4 sm:p-5 whitespace-pre-line border border-[#1D1D1B]/10 font-serif ${bodyTextClass}`}>
                {lesson.realWorldCase.businessContext}
              </div>

              {lesson.realWorldCase.transactions && lesson.realWorldCase.transactions.length > 0 && (
                <div className="space-y-2">
                  <span className={`font-bold text-[#1D1D1B] font-serif ${subHeadingClass}`}>المعاملات المالية التي تمت:</span>
                  <div className="space-y-1.5">
                    {lesson.realWorldCase.transactions.map((t, idx) => (
                      <div key={idx} className={`bg-[#F9F7F2] p-3 flex items-center justify-between border border-[#1D1D1B]/10 ${bodyTextClass}`}>
                        <span className="font-semibold text-[#1D1D1B]">{t.date}: {t.description}</span>
                        {t.amount && <span className="font-mono font-bold text-[#1D1D1B]">{t.amount.toLocaleString()} ج</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Case Solution */}
              {lesson.realWorldCase.solution && (
                <div className="bg-[#FFFFFF] border-r-4 border-[#C4A484] border-y border-l border-[#1D1D1B]/15 p-4 sm:p-5 space-y-2">
                  <span className={`font-bold text-[#1D1D1B] block font-serif ${subHeadingClass}`}>الحل والتحليل المحاسبي النهائي:</span>
                  <ul className={`list-disc list-inside space-y-1 font-serif ${bodyTextClass}`}>
                    {(lesson.realWorldCase.solution.analysisNotes || []).map((n, i) => (
                      <li key={i} className="leading-relaxed">{n}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

        </div>
      )}

      {/* TAB: MISCONCEPTIONS (Master Template) */}
      {activeTab === 'misconceptions' && lesson.misconceptions && (
        <div className="space-y-6">
          <div className="bg-[#1D1D1B] text-[#F9F7F2] rounded-none p-6 sm:p-8 shadow-xs border border-[#1D1D1B] space-y-2">
            <div className="flex items-center gap-2 text-[#C4A484] text-xs font-bold uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4" />
              <span>مصفوفة الأخطاء التشخيصية – Master Template Edition 2.0</span>
            </div>
            <h3 className={sectionHeadingClass}>
              جدول الأخطاء التشخيصية الشائعة وطرق تفاديها
            </h3>
            <p className={`${bodyTextClass} text-[#F9F7F2]/85`}>
              تحليل دقيق لأبرز المفاهيم المغلوطة التي تسبب خسارة الدرجات في الامتحانات، مع الصواب المحاسبي وسؤال تشخيصي لاختبار الفهم.
            </p>
          </div>

          <div className="space-y-4">
            {lesson.misconceptions.map((m) => (
              <div
                key={m.id}
                className="bg-[#FFFFFF] border border-[#1D1D1B]/15 shadow-xs overflow-hidden"
              >
                {/* Header row with ID and Sub-LO */}
                <div className="bg-[#F9F7F2] border-b border-[#1D1D1B]/10 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#1D1D1B] text-[#F9F7F2] font-mono text-xs font-bold px-2.5 py-0.5">
                      {m.id}
                    </span>
                    <span className={`font-serif font-bold text-[#1D1D1B] ${isFocusMode ? 'text-sm' : 'text-xs'}`}>
                      خطأ تشخيصي مستهدف
                    </span>
                  </div>
                  {m.subLo && (
                    <span className={`font-mono text-[#C4A484] bg-[#1D1D1B]/5 px-2.5 py-0.5 border border-[#1D1D1B]/10 ${isFocusMode ? 'text-sm' : 'text-xs'}`}>
                      🎯 {m.subLo}
                    </span>
                  )}
                </div>

                {/* Error vs Correct Comparison */}
                <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* The Common Error */}
                  <div className="bg-red-50/50 border border-red-200/80 p-4 sm:p-5 space-y-2">
                    <div className="flex items-center gap-2 text-red-700 font-bold font-serif">
                      <span className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center text-red-700 text-xs font-black">✕</span>
                      <span className={subHeadingClass}>الخطأ الشائع (Misconception):</span>
                    </div>
                    <p className={`${bodyTextClass} text-red-900`}>
                      {m.error}
                    </p>
                  </div>

                  {/* The Accounting Correction */}
                  <div className="bg-[#1D1D1B]/5 border border-[#C4A484]/50 p-4 sm:p-5 space-y-2">
                    <div className="flex items-center gap-2 text-[#1D1D1B] font-bold font-serif">
                      <span className="w-5 h-5 rounded-full bg-[#C4A484] flex items-center justify-center text-[#1D1D1B] text-xs font-black">✓</span>
                      <span className={subHeadingClass}>الصواب المحاسبي المعتمد:</span>
                    </div>
                    <p className={`${bodyTextClass} font-medium`}>
                      {m.correct}
                    </p>
                  </div>
                </div>

                {/* Diagnostic Question Section */}
                <div className="bg-[#F9F7F2] border-t border-[#1D1D1B]/10 p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-[#C4A484] font-bold uppercase tracking-wider">
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>السؤال التشخيصي الميداني:</span>
                    </div>
                    <p className={`${bodyTextClass} font-semibold`}>
                      {m.diagnosticQuestion}
                    </p>
                  </div>

                  <button
                    onClick={() => toggleRevealDiagnostic(m.id)}
                    className={`self-start sm:self-center shrink-0 px-4 py-2 font-bold border border-[#1D1D1B] bg-[#FFFFFF] text-[#1D1D1B] hover:bg-[#1D1D1B] hover:text-[#F9F7F2] transition cursor-pointer ${isFocusMode ? 'text-sm' : 'text-xs'}`}
                  >
                    {revealedDiagnostic[m.id] ? 'إخفاء التفسير' : 'عرض المعيار المحاسبي'}
                  </button>
                </div>

                {/* Revealed Diagnostic Guidance */}
                {revealedDiagnostic[m.id] && (
                  <div className="bg-[#1D1D1B] text-[#F9F7F2] p-5 sm:p-6 border-t border-[#1D1D1B] space-y-2 font-serif leading-relaxed animate-fadeIn">
                    <div className={`text-[#C4A484] font-bold flex items-center gap-2 ${subHeadingClass}`}>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>طريقة التفكير المحاسبي السليم لحل هذا السؤال:</span>
                    </div>
                    <p className={`${bodyTextClass} text-[#F9F7F2]/90`}>
                      {m.correct} احرص دائماً على صياغة الإجابة بالربط المباشر بين المبدأ المحاسبي (مثل الحيطة والحذر أو المقابلة أو الاستحقاق) وأثره على الأرقام الدفترية.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: ONE-MINUTE SUMMARY */}
      {activeTab === 'summary' && (
        <div className="space-y-6">
          <div className="bg-[#1D1D1B] text-[#F9F7F2] rounded-none p-6 sm:p-8 shadow-xs border border-[#1D1D1B] space-y-2">
            <h3 className={sectionHeadingClass}>⚡ في دقيقة واحدة: خلاصة الدرس {lesson.lessonNumber}</h3>
            <p className={`${bodyTextClass} text-[#F9F7F2]/80`}>
              مراجعة سريعة ومكثفة تركز على القواعد الذهبية والمصطلحات ليلة الامتحان
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Definitions */}
            {lesson.inOneMinuteSummary.coreDefinitions && lesson.inOneMinuteSummary.coreDefinitions.length > 0 && (
              <div className="bg-[#FFFFFF] border border-[#1D1D1B]/15 p-5 sm:p-6 space-y-3">
                <h4 className={`font-bold text-[#1D1D1B] flex items-center gap-2 font-serif ${subHeadingClass}`}>
                  <BookOpen className="w-4 h-4 text-[#C4A484]" />
                  <span>المفاهيم الجوهرية (التعريف الدقيق):</span>
                </h4>
                <div className="space-y-2">
                  {lesson.inOneMinuteSummary.coreDefinitions.map((d, i) => (
                    <div key={i} className={`bg-[#F9F7F2] p-3 border border-[#1D1D1B]/10 ${bodyTextClass}`}>
                      <strong className="text-[#1D1D1B] block mb-0.5 font-serif">{d.term}:</strong>
                      <span className="text-[#1D1D1B]/70">{d.definition}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Core Rules */}
            {lesson.inOneMinuteSummary.coreRules && lesson.inOneMinuteSummary.coreRules.length > 0 && (
              <div className="bg-[#FFFFFF] border border-[#1D1D1B]/15 p-5 sm:p-6 space-y-3">
                <h4 className={`font-bold text-[#1D1D1B] flex items-center gap-2 font-serif ${subHeadingClass}`}>
                  <Scale className="w-4 h-4 text-[#C4A484]" />
                  <span>القواعد الحسابية والمحاسبية الحاكمة:</span>
                </h4>
                <ul className="space-y-2 text-[#1D1D1B]">
                  {lesson.inOneMinuteSummary.coreRules.map((r, i) => (
                    <li key={i} className={`bg-[#F9F7F2] p-3 border border-[#1D1D1B]/10 flex items-start gap-2 ${bodyTextClass}`}>
                      <span className="text-[#C4A484] font-bold">✓</span>
                      <span className="font-serif">{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Common Traps */}
            {lesson.inOneMinuteSummary.commonTraps && lesson.inOneMinuteSummary.commonTraps.length > 0 && (
              <div className="bg-[#FFFFFF] border border-[#1D1D1B]/15 p-5 sm:p-6 space-y-3">
                <h4 className={`font-bold text-[#1D1D1B] flex items-center gap-2 font-serif ${subHeadingClass}`}>
                  <AlertTriangle className="w-4 h-4 text-[#C4A484]" />
                  <span>احذر من هذه الأفخاخ الشائعة في الامتحانات:</span>
                </h4>
                <ul className="space-y-2 text-[#1D1D1B]">
                  {lesson.inOneMinuteSummary.commonTraps.map((t, i) => (
                    <li key={i} className={`bg-[#F9F7F2] p-3 border border-[#1D1D1B]/10 flex items-start gap-2 ${bodyTextClass}`}>
                      <span className="text-[#1D1D1B] font-bold">✕</span>
                      <span className="font-serif">{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Cheatsheet */}
            {lesson.inOneMinuteSummary.solutionCheatsheet && lesson.inOneMinuteSummary.solutionCheatsheet.length > 0 && (
              <div className="bg-[#FFFFFF] border border-[#1D1D1B]/15 p-5 sm:p-6 space-y-3">
                <h4 className={`font-bold text-[#1D1D1B] flex items-center gap-2 font-serif ${subHeadingClass}`}>
                  <Sparkles className="w-4 h-4 text-[#C4A484]" />
                  <span>خريطة الحل السريع:</span>
                </h4>
                <div className="space-y-2 text-[#1D1D1B]">
                  {lesson.inOneMinuteSummary.solutionCheatsheet.map((c, i) => (
                    <div key={i} className={`bg-[#F9F7F2] p-3 border border-[#1D1D1B]/10 font-mono text-[#1D1D1B] font-medium ${bodyTextClass}`}>
                      {c}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* TAB 5: LESSON QUIZ */}
      {activeTab === 'quiz' && (
        <div className="bg-[#FFFFFF] border border-[#1D1D1B]/15 rounded-none p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1D1D1B]/10 pb-4">
            <div>
              <span className={`border border-[#1D1D1B] bg-[#F9F7F2] text-[#1D1D1B] font-bold px-3 py-1 uppercase tracking-wider ${isFocusMode ? 'text-xs sm:text-sm' : 'text-xs'}`}>
                التقييم الختامي للدرس
              </span>
              <h3 className={`font-extrabold text-[#1D1D1B] font-serif mt-2 ${sectionHeadingClass}`}>
                {lesson.lessonQuiz.title}
              </h3>
            </div>
            <div className={`flex items-center gap-3 text-[#1D1D1B] bg-[#F9F7F2] px-4 py-2 border border-[#1D1D1B]/15 font-serif ${isFocusMode ? 'text-xs sm:text-sm' : 'text-xs'}`}>
              <span>⏱️ {lesson.lessonQuiz.durationMinutes} دقيقة</span>
              <span>•</span>
              <span className="font-bold text-[#1D1D1B]">🏆 {lesson.lessonQuiz.totalMarks} درجة</span>
            </div>
          </div>

          {/* Quiz MCQs */}
          {lesson.lessonQuiz.mcqs && lesson.lessonQuiz.mcqs.length > 0 && (
            <div className="space-y-4">
              <h4 className={`font-bold text-[#1D1D1B] font-serif ${subHeadingClass}`}>أولاً: أسئلة الاختيار من متعدد</h4>
              {lesson.lessonQuiz.mcqs.map((q, idx) => {
                const userAns = selectedAnswers[q.id];
                const isAnswered = userAns !== undefined;
                const isCorrect = userAns === q.correctAnswer;

                return (
                  <div key={q.id || idx} className="border border-[#1D1D1B]/15 p-4 sm:p-5 space-y-3.5 bg-[#F9F7F2]">
                    <p className={`font-semibold text-[#1D1D1B] font-serif ${subHeadingClass}`}>
                      {idx + 1}. {q.question}
                    </p>
                    {q.options && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {q.options.map((opt, oIdx) => (
                          <button
                            key={oIdx}
                            onClick={() => handleSelectAnswer(q.id, opt)}
                            className={`p-3 text-right border transition cursor-pointer ${
                              isFocusMode ? 'text-xs sm:text-sm' : 'text-xs'
                            } ${
                              userAns === opt
                                ? isCorrect
                                  ? 'bg-[#C4A484] text-[#1D1D1B] border-[#C4A484] font-bold'
                                  : 'bg-[#1D1D1B] text-[#F9F7F2] border-[#1D1D1B] font-bold'
                                : 'bg-[#FFFFFF] hover:bg-[#F9F7F2] text-[#1D1D1B] border-[#1D1D1B]/15'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}
                    {isAnswered && (
                      <div className={`text-[#1D1D1B]/80 bg-[#FFFFFF] p-3 border border-[#1D1D1B]/15 font-serif ${isFocusMode ? 'text-xs sm:text-sm' : 'text-xs'}`}>
                        💡 <strong>التفسير:</strong> {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* True / False */}
          {lesson.lessonQuiz.trueFalse && lesson.lessonQuiz.trueFalse.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-[#1D1D1B]/10">
              <h4 className={`font-bold text-[#1D1D1B] font-serif ${subHeadingClass}`}>ثانياً: أسئلة الصواب والخطأ مع التعليل</h4>
              {lesson.lessonQuiz.trueFalse.map((tf, idx) => {
                const userAns = selectedAnswers[tf.id];
                const isAnswered = userAns !== undefined;

                return (
                  <div key={tf.id} className="border border-[#1D1D1B]/15 p-4 sm:p-5 space-y-3.5 bg-[#F9F7F2]">
                    <p className={`font-semibold text-[#1D1D1B] font-serif ${subHeadingClass}`}>
                      {idx + 1}. {tf.question}
                    </p>
                    <div className="flex gap-2.5">
                      <button
                        onClick={() => handleSelectAnswer(tf.id, 'true')}
                        className={`px-4 py-2.5 font-bold border transition cursor-pointer ${
                          isFocusMode ? 'text-xs sm:text-sm' : 'text-xs'
                        } ${
                          userAns === 'true'
                            ? tf.correctAnswer === true ? 'bg-[#C4A484] text-[#1D1D1B] border-[#C4A484]' : 'bg-[#1D1D1B] text-[#F9F7F2] border-[#1D1D1B]'
                            : 'bg-[#FFFFFF] hover:bg-[#F9F7F2] text-[#1D1D1B] border-[#1D1D1B]/15'
                        }`}
                      >
                        ✓ عبارة صائبة
                      </button>
                      <button
                        onClick={() => handleSelectAnswer(tf.id, 'false')}
                        className={`px-4 py-2.5 font-bold border transition cursor-pointer ${
                          isFocusMode ? 'text-xs sm:text-sm' : 'text-xs'
                        } ${
                          userAns === 'false'
                            ? tf.correctAnswer === false ? 'bg-[#C4A484] text-[#1D1D1B] border-[#C4A484]' : 'bg-[#1D1D1B] text-[#F9F7F2] border-[#1D1D1B]'
                            : 'bg-[#FFFFFF] hover:bg-[#F9F7F2] text-[#1D1D1B] border-[#1D1D1B]/15'
                        }`}
                      >
                        ✕ عبارة خاطئة
                      </button>
                    </div>
                    {isAnswered && (
                      <div className={`text-[#1D1D1B]/80 bg-[#FFFFFF] p-3 border border-[#1D1D1B]/15 font-serif ${isFocusMode ? 'text-xs sm:text-sm' : 'text-xs'}`}>
                        💡 <strong>التعليل والبيان:</strong> {tf.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Applied & Case Questions */}
          {lesson.lessonQuiz.appliedQuestions && lesson.lessonQuiz.appliedQuestions.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-[#1D1D1B]/10">
              <h4 className={`font-bold text-[#1D1D1B] font-serif ${subHeadingClass}`}>ثالثاً: المسائل التطبيقية وسؤال الإتقان</h4>
              {lesson.lessonQuiz.appliedQuestions.map((app, idx) => {
                const isSol = revealedSolutions[app.id || `app-${idx}`];

                return (
                  <div key={idx} className="border border-[#1D1D1B]/15 p-4 sm:p-5 space-y-3.5 bg-[#F9F7F2]">
                    <div className={`flex items-center justify-between text-[#1D1D1B]/60 ${isFocusMode ? 'text-xs sm:text-sm' : 'text-xs'}`}>
                      <span className="font-bold text-[#1D1D1B] font-serif">مسألة تطبيقية ({app.markAllocation} درجات)</span>
                    </div>
                    <p className={`font-medium whitespace-pre-line font-serif ${bodyTextClass}`}>{app.prompt}</p>
                    
                    <button
                      onClick={() => toggleRevealSolution(app.id || `app-${idx}`)}
                      className={`px-4 py-2 bg-[#FFFFFF] hover:bg-[#1D1D1B] hover:text-[#F9F7F2] text-[#1D1D1B] font-bold transition border border-[#1D1D1B]/20 cursor-pointer ${isFocusMode ? 'text-xs sm:text-sm' : 'text-xs'}`}
                    >
                      {isSol ? 'إخفاء الإجابة النموذجية' : 'عرض الإجابة النموذجية وتوزيع الدرجات'}
                    </button>

                    {isSol && (
                      <div className={`bg-[#FFFFFF] p-4 border border-[#1D1D1B]/20 text-[#1D1D1B] whitespace-pre-line leading-relaxed font-mono ${bodyTextClass}`}>
                        {app.modelAnswer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* Bottom Lesson Navigation */}
      <div className="flex items-center justify-between pt-6 border-t border-[#1D1D1B]/15">
        <button
          onClick={handlePrevLesson}
          disabled={currentLessonIndex === 0}
          className="px-4 py-2.5 bg-[#FFFFFF] hover:bg-[#F9F7F2] border border-[#1D1D1B]/20 text-xs sm:text-sm font-bold text-[#1D1D1B] disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-2"
        >
          <ArrowRight className="w-4 h-4" />
          <span>الدرس السابق</span>
        </button>

        <span className="text-xs text-[#1D1D1B]/70 font-serif">
          الدرس {lesson.lessonNumber} ({lesson.unitId === 'unit-3' ? 'الوحدة الثالثة' : lesson.unitId === 'unit-2' ? 'الوحدة الثانية' : lesson.unitId === 'unit-4' ? 'الوحدة الرابعة' : 'الوحدة الأولى'}) • الدرس {currentLessonIndex + 1} من {allLessons.length}
        </span>

        <button
          onClick={handleNextLesson}
          disabled={currentLessonIndex === allLessons.length - 1}
          className="px-4 py-2.5 bg-[#1D1D1B] hover:bg-[#333330] text-[#F9F7F2] text-xs sm:text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-2 border border-[#1D1D1B]"
        >
          <span>الدرس التالي</span>
          <ArrowLeft className="w-4 h-4 text-[#C4A484]" />
        </button>
      </div>

    </div>
  );
};
