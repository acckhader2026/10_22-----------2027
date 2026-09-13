import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Header, ActiveTab } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { MobileNavigation } from '../components/MobileNavigation';
import { MethodologyReportModal } from '../components/MethodologyReportModal';
import { StudentDashboardModal } from '../components/StudentDashboardModal';
import { TeacherDashboardModal } from '../components/TeacherDashboardModal';
import { ContentAnalyticsModal } from '../components/ContentAnalyticsModal';
import { AccountingGlossaryModal } from '../components/AccountingGlossaryModal';
import { AuthModal } from '../components/AuthModal';
import { useAuth } from '../context/AuthContext';
import { PlatformRole } from '../types';
import { pathToLegacyTab, LEGACY_TAB_TO_PATH } from '../routing/legacyNavigationAdapter';
import { apiClient } from '../api/apiClient';
import { useFocusMode } from '../context/FocusModeContext';

interface AppShellProps {
  children?: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isFocusMode, setIsFocusMode, toggleFocusMode, fontSize, increaseFontSize, decreaseFontSize } = useFocusMode();

  // Derive active tab from current URL
  const activeTab: ActiveTab = pathToLegacyTab(location.pathname);

  const setActiveTab = (tab: ActiveTab) => {
    const targetPath = LEGACY_TAB_TO_PATH[tab] || '/';
    navigate(targetPath);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [selectedUnit, setSelectedUnit] = useState<'unit-1' | 'unit-2' | 'unit-3' | 'unit-4'>('unit-4');
  const { user, role, isAuthModalOpen, setIsAuthModalOpen, quickSwitchRole } = useAuth();

  // Navigation & Modal states
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState<boolean>(false);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState<boolean>(false);
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState<boolean>(false);
  const [isContentModalOpen, setIsContentModalOpen] = useState<boolean>(false);
  const [isGlossaryModalOpen, setIsGlossaryModalOpen] = useState<boolean>(false);
  const [selectedGlossaryTermId, setSelectedGlossaryTermId] = useState<string | null>(null);

  const [completedExercisesCount, setCompletedExercisesCount] = useState<number>(14);

  // Sync progress from backend with local cache fallback (Resolving ISS-02)
  useEffect(() => {
    let isMounted = true;
    try {
      const saved = localStorage.getItem('eb_acc_progress');
      if (saved) {
        setCompletedExercisesCount(Number(saved) || 14);
      }
    } catch {}

    const fetchServerProgress = async () => {
      try {
        const res = await apiClient.request('/api/progress/student');
        if (isMounted && res && res.success) {
          const serverAttempts = typeof res.totalAttempts === 'number' ? res.totalAttempts : 0;
          const serverCompletedLessons = typeof res.completedLessonsCount === 'number' ? res.completedLessonsCount : 0;
          const totalProgress = Math.max(14, serverAttempts + serverCompletedLessons);
          setCompletedExercisesCount(totalProgress);
          try {
            localStorage.setItem('eb_acc_progress', String(totalProgress));
          } catch {}
        }
      } catch {
        // Fallback gracefully to cached localStorage
      }
    };

    fetchServerProgress();
    return () => {
      isMounted = false;
    };
  }, [user]);

  const handleCompleteExercise = () => {
    setCompletedExercisesCount(prev => {
      const next = prev + 1;
      try {
        localStorage.setItem('eb_acc_progress', String(next));
      } catch {}
      return next;
    });
  };

  const handleOpenGlossaryTerm = (termId: string) => {
    setSelectedGlossaryTermId(termId);
    setIsGlossaryModalOpen(true);
  };

  const handleRoleChange = async (newRole: PlatformRole) => {
    if (quickSwitchRole) {
      await quickSwitchRole(newRole);
    }
  };

  const handleNavigateToLessonById = (lessonId: string) => {
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

  const isPrintView = location.pathname === '/print';

  return (
    <div className="min-h-screen bg-[#F9F7F2] text-[#1D1D1B] font-serif flex flex-col selection:bg-[#C4A484] selection:text-[#1D1D1B]">
      {/* Top Navbar */}
      {!isPrintView && !isFocusMode && (
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenSidebar={() => setIsSidebarOpen(true)}
          onOpenAnalysisReport={(unitId) => {
            if (unitId) setSelectedUnit(unitId);
            setIsAnalysisModalOpen(true);
          }}
          onOpenStudentDashboard={() => setIsStudentModalOpen(true)}
          onOpenTeacherDashboard={() => setIsTeacherModalOpen(true)}
          onOpenContentAnalytics={() => setIsContentModalOpen(true)}
          onOpenGlossary={() => {
            setSelectedGlossaryTermId(null);
            setIsGlossaryModalOpen(true);
          }}
          completedExercisesCount={completedExercisesCount}
          totalExercisesCount={50}
          currentRole={role}
          setCurrentRole={handleRoleChange}
        />
      )}

      {/* Focus Mode Floating Top Bar (when default Header is hidden) */}
      {!isPrintView && isFocusMode && (
        <div id="focus-mode-top-bar" className="no-print sticky top-0 z-40 bg-[#1D1D1B] text-[#F9F7F2] border-b border-[#C4A484]/40 px-3 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-2 text-xs shadow-sm">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
            <span className="font-bold text-[#C4A484] font-serif text-xs sm:text-sm">وضع التركيز (ملء الصفحة وتكبير الخط التناسبي)</span>
            <span className="text-[#F9F7F2]/60 hidden md:inline font-serif">• عرض ممتد على كامل أبعاد الشاشة بدون هوامش ضيقة</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Font scale buttons in sticky bar */}
            <div className="flex items-center gap-1 bg-[#2A2A28] border border-[#C4A484]/40 px-2 py-0.5 text-xs">
              <span className="text-[#C4A484] font-serif text-[11px] font-bold">حجم الخط:</span>
              <button
                type="button"
                onClick={decreaseFontSize}
                disabled={fontSize === 'normal'}
                className="px-1.5 py-0.5 hover:bg-[#FFFFFF]/20 text-[#F9F7F2] disabled:opacity-30 disabled:cursor-not-allowed transition font-mono font-bold"
                title="تصغير الخط"
              >
                A-
              </button>
              <span className="font-mono text-[11px] font-bold text-[#F9F7F2] px-1 bg-[#1D1D1B]">
                {fontSize === 'normal' ? 'عادي' : fontSize === 'large' ? 'كبير' : fontSize === 'xlarge' ? 'كبير جداً' : 'أقصى'}
              </span>
              <button
                type="button"
                onClick={increaseFontSize}
                disabled={fontSize === 'huge'}
                className="px-1.5 py-0.5 hover:bg-[#FFFFFF]/20 text-[#F9F7F2] disabled:opacity-30 disabled:cursor-not-allowed transition font-mono font-bold"
                title="تكبير الخط"
              >
                A+
              </button>
            </div>

            <button
              id="focus-bar-exit-button"
              type="button"
              onClick={toggleFocusMode}
              className="px-3 py-1 bg-[#F9F7F2] text-[#1D1D1B] hover:bg-[#FFFFFF] text-xs font-bold font-serif transition flex items-center gap-1.5 cursor-pointer border border-[#C4A484]"
              title="العودة إلى الوضع الافتراضي (Esc)"
            >
              <span>الوضع الافتراضي</span>
              <span className="text-[10px] text-[#1D1D1B]/60 font-mono">[Esc]</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 pb-16 md:pb-0">
        {children || (
          <Outlet
            context={{
              onCompleteExercise: handleCompleteExercise,
              onOpenGlossaryTerm: handleOpenGlossaryTerm,
              completedExercisesCount,
              isFocusMode,
              setIsFocusMode,
              toggleFocusMode
            }}
          />
        )}
      </main>

      {/* Footer */}
      {!isPrintView && !isFocusMode && (
        <footer className="border-t border-[#1D1D1B]/15 bg-[#1D1D1B] text-[#F9F7F2] py-8 px-4 text-center text-xs space-y-2 mt-12">
          <div className="flex items-center justify-center gap-2">
            <span className="font-bold text-[#C4A484] text-sm">
              منهاج المحاسبة المالية المعتمد — البكالوريا المصرية (EB)
            </span>
          </div>
          <p className="text-[#F9F7F2]/60 max-w-xl mx-auto">
            منظومة تعليمية وتقويمية متقدمة مطابقة لنموذج البكالوريا v2.0 ومبنية على معايير الجودة السيكومترية.
          </p>
          <div className="pt-2 text-[10px] text-[#F9F7F2]/40 font-mono">
            Production Foundation v2.0 • Real Router Navigation • Clean URL Slugs • Single-Source Curriculum Registry
          </div>
        </footer>
      )}

      {/* Mobile Bottom Navigation Bar */}
      {!isPrintView && !isFocusMode && (
        <MobileNavigation onOpenSidebar={() => setIsSidebarOpen(true)} />
      )}

      {/* Sidebar Drawer */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Shared Modals */}
      <AccountingGlossaryModal
        isOpen={isGlossaryModalOpen}
        onClose={() => setIsGlossaryModalOpen(false)}
        initialTermId={selectedGlossaryTermId}
        onNavigateToLesson={(lessonIdx) => {
          const u = lessonIdx >= 6 ? 'unit-2' : 'unit-1';
          const lNum = lessonIdx >= 6 ? lessonIdx - 5 : lessonIdx + 1;
          navigate(`/curriculum/${u}/lessons/lesson-${lNum}`);
        }}
      />

      <MethodologyReportModal
        isOpen={isAnalysisModalOpen}
        onClose={() => setIsAnalysisModalOpen(false)}
        initialUnitId={selectedUnit === 'unit-4' ? 'unit-3' : selectedUnit}
      />

      <StudentDashboardModal
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
        userFullName={user?.full_name || 'طالب EB'}
        onNavigateToLesson={handleNavigateToLessonById}
      />

      <TeacherDashboardModal
        isOpen={isTeacherModalOpen}
        onClose={() => setIsTeacherModalOpen(false)}
      />

      <ContentAnalyticsModal
        isOpen={isContentModalOpen}
        onClose={() => setIsContentModalOpen(false)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
};
