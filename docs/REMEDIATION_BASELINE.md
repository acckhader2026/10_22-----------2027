# Forensic Baseline Audit Report (Phase 0)
**Egyptian Baccalaureate (EB) Management & Financial Accounting Platform**
*Date: 2026-08-25 | Status: Baseline Completed | Lead: Assessment & Software Architecture*

---

## 1. Executive Summary & Forensic Findings

A comprehensive baseline inspection of the entire codebase (frontend, server, in-memory relational schema, API endpoints, assessment workflows, question banks, adaptive heuristics, and dashboards) was conducted.

While the platform possesses a solid educational foundation for Unit 1 (6 structured lessons, high-fidelity T-Account interactive ledger, double-entry simulator, and bilingual curriculum alignment with Ministry Textbook `Accuonting-Ar-EB-Part1.pdf`), the audit revealed critical architectural and psychometric inconsistencies that violate canonical assessment principles.

---

## 2. Current Architecture Overview

- **Frontend Stack**: React 19 + TypeScript + Vite + Tailwind CSS v4 + Motion animations + Lucide React.
- **Backend Stack**: Express 4.21 with Node.js runtime served through Vite middleware in dev and bundled CJS in production.
- **Data Persistence**: In-memory relational emulation in `src/server/db/database.ts` with typed interfaces in `src/server/db/schema.ts`.
- **API Routing**: Centralized in `server.ts` directing traffic to modular handlers in `src/server/modules/`.
- **Educational Content**: Modularized data modules in `src/data/` (Lessons 1-6, Question Bank, Exams, Unit Review, Book Metadata).

---

## 3. Detailed Forensic Baseline by Domain

### 3.1 Educational Architecture
- **Curriculum Model**: Unit 1 ("لماذا نتعلم المحاسبة؟") covers 6 lessons:
  1. طبيعة المحاسبة والمبادئ الأساسية (Matching, Prudence, Historical Cost, Accrual vs Cash).
  2. المعادلة المحاسبية الأساسية وأثر العمليات المالية.
  3. نظرية القيد المزدوج والمدين والدائن وتوجيه الحسابات.
  4. دفتر الأستاذ وترصيد الحسابات وميزان المراجعة والأخطاء المحاسبية.
  5. الحسابات الختامية وقائمة المركز المالي والميزانية العمومية.
  6. ورشة مقال التفسير المحاسبي المدعوم بالأدلة (JRE).
- **Gaps Identified**:
  - Lack of a machine-readable, computable Blueprint domain engine to calculate topic/taxonomy/difficulty coverage dynamically.
  - Learning objectives are static string arrays without computable taxonomy IDs and skill weightings.

### 3.2 Assessment Architecture & Exam Simulator
- **Current State**: `src/components/ExamSimulator.tsx` and `src/data/examsData.ts` contain 2 exams (Exam 1: 50 marks, Simulation EB: 60 marks).
- **Gaps Identified**:
  - `handleSubmitExam` in `src/server/modules/exams.ts` uses an arbitrary mock calculation (`Math.round(q.marks * 0.85) : 17`) for essay/JRE questions instead of integrating the real rubric evaluation engine.
  - Auto-grading is limited to exact string matching without partial credit or miscalculation diagnosis.

### 3.3 JRE Architecture & Rubric Inconsistencies (P0 Critical)
- **The Core Contradiction**:
  - **Educational Specification**: 20 Marks canonical rubric across 5 criteria (Intellectual Framework: 4, Deep Analysis: 4, Evidence Usage: 4, Structure & Coherence: 4, Justified Conclusion: 4).
  - **Backend API (`/api/ai/evaluate-jre` in `src/server/modules/ai.ts`)**: Evaluates on a 10-point scale (Judgment: 3, Reasoning: 3, Evidence: 2, Structure: 1, Clarity: 1).
  - **Client UI (`src/components/JRETalker.tsx`)**: Hardcoded regex keyword detection for 5 criteria of 4 marks each, completely disconnected from backend evaluation.
  - **OpenAPI Doc**: Declares "Evaluate JRE essay with 10-point Rubric".

### 3.4 Question Bank Architecture & Coverage Matrix
- **Current State**: 62 items in `src/data/expandedQuestionBank.ts` with metadata (`learningObjectiveId`, `concept`, `difficulty`, `questionType`, `sourceMapping`). (Future planned expansion target: 200+ items).
- **Gaps Identified**:
  - No formal Question Quality Engine to validate distractor plausibility, unambiguous keys, or calculation integrity before ingestion.
  - No machine-evaluated Coverage Matrix classifying cells into RED (uncovered), YELLOW (insufficient), GREEN (optimal), BLUE (overrepresented).

### 3.5 Student Mastery & Adaptive Engine
- **Current State**: `src/server/modules/progress.ts` and `src/server/modules/adaptive.ts`.
- **Gaps Identified**:
  - **Fabricated Default Mastery**: In `progress.ts`, when zero attempts exist, fallback values like `85%`, `75%`, `85%`, and `100 * 0.1` are returned instead of `"INSUFFICIENT_DATA"`.
  - **Static Adaptive Recommendations**: `adaptive.ts` uses a static dictionary without dynamic diagnosis of student misconceptions based on distractor rationale.

### 3.6 Analytics Architecture & Fake Cohort Data
- **Current State**: `src/server/modules/analytics.ts` and `src/components/TeacherDashboardModal.tsx`.
- **Gaps Identified**:
  - **Hardcoded Fake Data**: `TeacherDashboardModal.tsx` uses client-side static variables (`cohortsMetrics = { totalEnrolled: 48, activeThisWeek: 45, unit1AvgScore: 84.5... }`, `atRiskStudents`, `topicMasteryCohort`).
  - **Backend Fallbacks**: `handleGetTeacherAnalytics` defaults to `45 students`, `38 active`, `87% completion` if DB is unseeded.
  - Missing transparent mathematical formulas and data-source traceability.

---

## 4. Current Database Entities & Endpoints

### Database Entities (`src/server/db/schema.ts`)
1. `DbUser` (STUDENT, TEACHER, CONTENT_MANAGER, ADMIN)
2. `DbSubject`
3. `DbUnit`
4. `DbLesson`
5. `DbLearningObjective`
6. `DbQuestion`, `DbQuestionOption`, `DbQuestionTag`
7. `DbExam`
8. `DbStudentLessonProgress`
9. `DbStudentQuestionAttempt`
10. `DbStudentExamAttempt`
11. `DbStudentConceptMastery`
12. `DbAdaptiveRecommendation`

### API Endpoints (`server.ts`)
- `GET /health`, `GET /ready`, `GET /api/docs`
- `POST /api/auth/login`, `GET /api/auth/me`, `GET /api/auth/users`
- `GET /api/lessons`, `GET /api/lessons/:id`
- `GET /api/questions`, `GET /api/questions/:id`
- `GET /api/exams`, `GET /api/exams/:id`, `POST /api/exams/submit`
- `POST /api/progress/attempt`, `GET /api/progress/student`
- `GET /api/adaptive/path`
- `GET /api/analytics/teacher`, `GET /api/analytics/content`
- `POST /api/ai/evaluate-jre`

---

## 5. Priority Classification of Discovered Issues

| Priority | Component | Issue Description | Remediation Target |
| :--- | :--- | :--- | :--- |
| **P0** | JRE Evaluator | Backend uses 10-point scale while methodology specifies 20 marks across 5 criteria (4 pts each). | Phase 1 & 2: Create canonical `JRERubric.ts` (20 pts) & real semantic/psychometric evaluation pipeline. |
| **P0** | Exam Grading | `handleSubmitExam` mocks essay scores at 85% instead of invoking canonical rubric evaluator. | Phase 1, 2 & 7: Connect exam essay grading to real JRE evaluator. |
| **P0** | Student Mastery | `progress.ts` fabricates 85%/75% mastery when attempts are 0 instead of returning `INSUFFICIENT_DATA`. | Phase 8: Implement transparent, evidence-weighted mastery calculation. |
| **P0** | Teacher Analytics | `TeacherDashboardModal` uses hardcoded local student stats instead of real DB aggregation. | Phase 10: Purge fake numbers; calculate exclusively from real DB events or show "No sufficient data". |
| **P1** | Curriculum Blueprint | Blueprint is a static document without machine-readable computable engine. | Phase 3: Build `src/domain/curriculum/BlueprintEngine.ts`. |
| **P1** | Question Quality | Question bank lacks automated validator for distractors, ambiguity, and numerical checks. | Phase 5: Implement `QuestionQualityEngine.ts`. |
| **P1** | Question Coverage | Missing dynamic coverage matrix (RED, YELLOW, GREEN, BLUE). | Phase 4: Build `CoverageMatrixEngine.ts`. |
| **P1** | Adaptive Remediation | Adaptive engine uses hardcoded static dict rather than diagnostic misconception path. | Phase 9: Implement Diagnostic-to-Remediation cycle. |
| **P2** | Separation of Roles | Teacher/Authoring modal accessible without strict role and context boundaries. | Phase 12: Enforce clear role views and operational separation. |
| **P2** | Test Automation | Absence of automated integration and psychometric unit tests. | Phases 14 & 15: Add test suites for JRE, Blueprint, Mastery, and API flows. |

---

## 6. Phase 0 Acceptance Declaration

- **Phase 0 Status**: **PASS**
- **Artifact Generated**: `docs/REMEDIATION_BASELINE.md`
- **Ready for Phase 1**: YES (JRE Consistency Repair).
