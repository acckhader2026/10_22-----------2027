import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { curriculumRegistry } from '../domain/curriculum/CurriculumRegistry';
import type { UnitSpec, LessonSpec, LearningObjectiveSpec } from '../domain/curriculum/CurriculumModel';

export interface CurriculumFilterContextType {
  // State
  selectedUnitId: string | null;
  selectedLessonId: string | null;
  selectedLearningOutcomeId: string | null;
  isSidebarCollapsed: boolean;
  isMobileDrawerOpen: boolean;

  // Actions
  selectUnit: (unitId: string | null) => void;
  selectLesson: (unitId: string, lessonId: string | null) => void;
  selectLearningOutcome: (unitId: string, lessonId: string, loId: string | null) => void;
  clearFilters: () => void;
  toggleSidebarCollapse: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  openMobileDrawer: () => void;
  closeMobileDrawer: () => void;

  // Derived Objects
  selectedUnit: UnitSpec | null;
  selectedLesson: LessonSpec | null;
  selectedLearningOutcome: LearningObjectiveSpec | null;
  isFilterActive: boolean;

  // Summary and statistics
  filterSummary: string;
  matchingStats: {
    unitsCount: number;
    lessonsCount: number;
    learningOutcomesCount: number;
    questionsCount: number;
  };
}

const CurriculumFilterContext = createContext<CurriculumFilterContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_COLLAPSED = 'eb_curriculum_sidebar_collapsed';
const LOCAL_STORAGE_KEY_FILTER_UNIT = 'eb_curriculum_filter_unit';
const LOCAL_STORAGE_KEY_FILTER_LESSON = 'eb_curriculum_filter_lesson';
const LOCAL_STORAGE_KEY_FILTER_LO = 'eb_curriculum_filter_lo';

export const CurriculumFilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Read initial collapsed state (default false on desktop)
  const [isSidebarCollapsed, setIsSidebarCollapsedState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_COLLAPSED);
      return saved !== null ? saved === 'true' : false;
    } catch {
      return false;
    }
  });

  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState<boolean>(false);

  // Read initial filter values from localStorage if available
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_FILTER_UNIT);
      if (saved && curriculumRegistry.getUnitById(saved)) return saved;
      const validUnits = curriculumRegistry.getUnits();
      return validUnits[0]?.id || 'unit-3';
    } catch {
      return 'unit-3';
    }
  });

  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(() => {
    try {
      return localStorage.getItem(LOCAL_STORAGE_KEY_FILTER_LESSON) || null;
    } catch {
      return null;
    }
  });

  const [selectedLearningOutcomeId, setSelectedLearningOutcomeId] = useState<string | null>(() => {
    try {
      return localStorage.getItem(LOCAL_STORAGE_KEY_FILTER_LO) || null;
    } catch {
      return null;
    }
  });

  // Persist filter changes
  useEffect(() => {
    try {
      if (selectedUnitId) {
        localStorage.setItem(LOCAL_STORAGE_KEY_FILTER_UNIT, selectedUnitId);
      } else {
        localStorage.removeItem(LOCAL_STORAGE_KEY_FILTER_UNIT);
      }
      if (selectedLessonId) {
        localStorage.setItem(LOCAL_STORAGE_KEY_FILTER_LESSON, selectedLessonId);
      } else {
        localStorage.removeItem(LOCAL_STORAGE_KEY_FILTER_LESSON);
      }
      if (selectedLearningOutcomeId) {
        localStorage.setItem(LOCAL_STORAGE_KEY_FILTER_LO, selectedLearningOutcomeId);
      } else {
        localStorage.removeItem(LOCAL_STORAGE_KEY_FILTER_LO);
      }
    } catch {
      // Storage unavailable
    }
  }, [selectedUnitId, selectedLessonId, selectedLearningOutcomeId]);

  const setSidebarCollapsed = (collapsed: boolean) => {
    setIsSidebarCollapsedState(collapsed);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_COLLAPSED, String(collapsed));
    } catch {}
  };

  const toggleSidebarCollapse = () => {
    setSidebarCollapsed(!isSidebarCollapsed);
  };

  const openMobileDrawer = () => setIsMobileDrawerOpen(true);
  const closeMobileDrawer = () => setIsMobileDrawerOpen(false);

  const selectUnit = (unitId: string | null) => {
    if (unitId === null || unitId === 'all') {
      setSelectedUnitId(null);
      setSelectedLessonId(null);
      setSelectedLearningOutcomeId(null);
      return;
    }
    setSelectedUnitId(unitId);
    // If current lesson doesn't belong to the new unit, clear lesson and LO
    if (selectedLessonId) {
      const lesson = curriculumRegistry.getLessonById(unitId, selectedLessonId);
      if (!lesson) {
        setSelectedLessonId(null);
        setSelectedLearningOutcomeId(null);
      }
    }
  };

  const selectLesson = (unitId: string, lessonId: string | null) => {
    setSelectedUnitId(unitId);
    if (lessonId === null || lessonId === 'all') {
      setSelectedLessonId(null);
      setSelectedLearningOutcomeId(null);
      return;
    }
    setSelectedLessonId(lessonId);
    // If current LO doesn't belong to new lesson, clear LO
    if (selectedLearningOutcomeId) {
      const lesson = curriculumRegistry.getLessonById(unitId, lessonId);
      const hasObjective = lesson?.objectives.some(o => o.id === selectedLearningOutcomeId);
      if (!hasObjective) {
        setSelectedLearningOutcomeId(null);
      }
    }
  };

  const selectLearningOutcome = (unitId: string, lessonId: string, loId: string | null) => {
    setSelectedUnitId(unitId);
    setSelectedLessonId(lessonId);
    setSelectedLearningOutcomeId(loId === 'all' ? null : loId);
  };

  const clearFilters = () => {
    setSelectedUnitId(null);
    setSelectedLessonId(null);
    setSelectedLearningOutcomeId(null);
  };

  // Derived objects from CurriculumRegistry
  const allUnits = useMemo(() => curriculumRegistry.getUnits(), []);

  const selectedUnit = useMemo(() => {
    if (!selectedUnitId) return null;
    return curriculumRegistry.getUnitById(selectedUnitId) || null;
  }, [selectedUnitId]);

  const selectedLesson = useMemo(() => {
    if (!selectedUnitId || !selectedLessonId) return null;
    return curriculumRegistry.getLessonById(selectedUnitId, selectedLessonId) || null;
  }, [selectedUnitId, selectedLessonId]);

  const selectedLearningOutcome = useMemo(() => {
    if (!selectedLearningOutcomeId) return null;
    return curriculumRegistry.getObjectiveById(selectedLearningOutcomeId) || null;
  }, [selectedLearningOutcomeId]);

  const isFilterActive = Boolean(selectedUnitId || selectedLessonId || selectedLearningOutcomeId);

  // Compute matching stats
  const matchingStats = useMemo(() => {
    let unitsCount = allUnits.length;
    let lessonsCount = allUnits.reduce((acc, u) => acc + u.lessons.length, 0);
    let learningOutcomesCount = allUnits.reduce((acc, u) => 
      acc + u.lessons.reduce((lAcc, l) => lAcc + (l.objectives?.length || 0), 0), 0
    );

    const allQuestions = curriculumRegistry.getQuestionBank({ includeTrainingBank: true });
    let questionsCount = allQuestions.length;

    if (selectedLearningOutcomeId && selectedLearningOutcome) {
      unitsCount = 1;
      lessonsCount = 1;
      learningOutcomesCount = 1;

      const loQIds = selectedLearningOutcome.questionIds || [];
      const loCode = selectedLearningOutcome.code.toLowerCase();
      const loTitle = selectedLearningOutcome.titleAr.toLowerCase();

      questionsCount = allQuestions.filter(q => {
        if (loQIds.includes(q.id) || (q.originalId && loQIds.includes(q.originalId))) return true;
        if (q.subLo && q.subLo.toLowerCase().includes(loCode)) return true;
        if (q.concept && loTitle.includes(q.concept.toLowerCase())) return true;
        return false;
      }).length;
      if (questionsCount === 0 && loQIds.length > 0) {
        questionsCount = loQIds.length;
      }
    } else if (selectedLessonId && selectedUnitId) {
      unitsCount = 1;
      lessonsCount = 1;
      learningOutcomesCount = selectedLesson?.objectives?.length || 0;
      questionsCount = allQuestions.filter(q => 
        q.unitId === selectedUnitId && q.lessonId === selectedLessonId
      ).length;
    } else if (selectedUnitId) {
      unitsCount = 1;
      lessonsCount = selectedUnit?.lessons?.length || 0;
      learningOutcomesCount = selectedUnit?.lessons?.reduce((acc, l) => acc + (l.objectives?.length || 0), 0) || 0;
      questionsCount = allQuestions.filter(q => q.unitId === selectedUnitId).length;
    }

    return {
      unitsCount,
      lessonsCount,
      learningOutcomesCount,
      questionsCount
    };
  }, [allUnits, selectedUnitId, selectedLessonId, selectedLearningOutcomeId, selectedUnit, selectedLesson, selectedLearningOutcome]);

  const filterSummary = useMemo(() => {
    const parts: string[] = [];
    if (selectedUnit) parts.push(selectedUnit.titleAr.split(':')[0] || selectedUnit.titleAr);
    if (selectedLesson) parts.push(`الدرس ${selectedLesson.lessonNumber}: ${selectedLesson.titleAr}`);
    if (selectedLearningOutcome) parts.push(`${selectedLearningOutcome.code}: ${selectedLearningOutcome.titleAr}`);
    return parts.join(' ❯ ');
  }, [selectedUnit, selectedLesson, selectedLearningOutcome]);

  return (
    <CurriculumFilterContext.Provider
      value={{
        selectedUnitId,
        selectedLessonId,
        selectedLearningOutcomeId,
        isSidebarCollapsed,
        isMobileDrawerOpen,
        selectUnit,
        selectLesson,
        selectLearningOutcome,
        clearFilters,
        toggleSidebarCollapse,
        setSidebarCollapsed,
        openMobileDrawer,
        closeMobileDrawer,
        selectedUnit,
        selectedLesson,
        selectedLearningOutcome,
        isFilterActive,
        filterSummary,
        matchingStats
      }}
    >
      {children}
    </CurriculumFilterContext.Provider>
  );
};

export const useCurriculumFilter = () => {
  const context = useContext(CurriculumFilterContext);
  if (!context) {
    throw new Error('useCurriculumFilter must be used within a CurriculumFilterProvider');
  }
  return context;
};
