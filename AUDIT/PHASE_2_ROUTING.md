# PHASE 2: Application Shell + Real Routing Architecture

## Changes Implemented & Codebase Alignment

1. **Routing Setup**:
   - Installed `react-router-dom` (v7) for client-side routing.
   - Wrapped `<App />` with `<BrowserRouter>` inside `src/main.tsx`.
   - Setup Vitest with `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`, and `@testing-library/user-event` for true component-level rendering tests.

2. **Application Shell Architecture (`src/app/AppShell.tsx`)**:
   - Implemented in `src/app/AppShell.tsx` (not `components/`), extracting the persistent application shell frame (Header, Sidebar Drawer, Mobile Bottom Navigation, Modals, and Footer) with `<Outlet />` for child views.
   - Preserves state across navigations with zero flicker.
   - Top Header and Mobile Navigation tabs derive their active state dynamically from `location.pathname` via `pathToLegacyTab()`.

3. **Canonical Routes Hierarchy (`src/app/AppRoutes.tsx`)**:
   - `/` -> `HomePage` (Hero & Quick Entry)
   - `/curriculum` -> `CurriculumPage` (Overview of Units 1 & 2)
   - `/curriculum/:unitSlug` -> `UnitPage` (Interactive unit map & outcomes)
   - `/curriculum/:unitSlug/lessons/:lessonSlug` -> `LessonPage` (Canonical deep-linkable lesson viewer for lessons 1 to 6 in Units 1 & 2)
   - `/training` -> `TrainingPage` (Training Hub)
   - `/training/simulators` -> `TrainingPage` (T-Account Simulator v2)
   - `/training/jre` -> `TrainingPage` (JRE 20-mark interactive workshop)
   - `/training/exercises` -> `TrainingPage` (Integrated practice exercises)
   - `/assessment` -> `AssessmentPage` (Assessment Hub)
   - `/assessment/question-bank` -> `AssessmentPage` (130-Question psychometric question bank)
   - `/assessment/unit-tests` -> `AssessmentPage` (Comprehensive unit reviews & cases)
   - `/assessment/mock-exams` -> `AssessmentPage` (Standardized mock exams)
   - `/my-path` -> `MyPathPage` (Student adaptive mastery hub)
   - `/teacher-dashboard` -> `TeacherDashboardPage` (Protected by `RoleGuard` for `TEACHER`, `ADMIN`)
   - `/content-analytics` -> `ContentAnalyticsPage` (Protected by `RoleGuard` for `CONTENT_MANAGER`, `ADMIN`)
   - `/print` -> `PrintView` (Standalone printable textbook and exams)
   - `/unauthorized` -> `UnauthorizedPage` (HTTP 403 visual recovery)
   - `*` -> `NotFoundPage` (HTTP 404 visual recovery with path suggestions)

4. **100% Backward Compatibility (`src/routing/legacyNavigationAdapter.ts`)**:
   - Legacy URLs automatically redirect with HTTP 301/302 replacement semantics:
     - `/welcome` -> `/curriculum`
     - `/map` -> `/curriculum/unit-1`
     - `/lessons` -> `/curriculum/unit-1/lessons/lesson-1`
     - `/simulator` -> `/training/simulators`
     - `/jre` -> `/training/jre`
     - `/review` -> `/assessment/unit-tests`
     - `/qbank` -> `/assessment/question-bank`
     - `/exams` -> `/assessment/mock-exams`
   - Active navigation tabs and legacy `setActiveTab` continue working seamlessly via `pathToLegacyTab` and `LEGACY_TAB_TO_PATH`.

5. **Param Normalization (`src/routing/routeParams.ts`)**:
   - Supports flexible slugs: `unit-1` / `unit-01` / `u1`, `lesson-1` / `lesson-01` / `u1-lesson-1`.
   - Maps slugs bi-directionally to canonical unit IDs and zero-based lesson indices (0..11).

6. **Component-Level & Unit Verification**:
   - Real rendering test suite: `src/app/__tests__/AppRoutes.test.tsx` (16 React Testing Library tests).
   - Route unit test suite: `src/routing/__tests__/Phase2Routing.test.ts` (17 unit tests).
   - Entire platform test suite: 95 tests passing across 11 test suites.
