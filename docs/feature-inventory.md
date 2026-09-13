# Feature Inventory & Regression Baseline

**Project:** المحاسبة ببساطة وإتقان – الوحدة الأولى (Production v2.0)  
**Verification Date:** 2026-08-24  

---

## 1. Existing Feature Matrix

| Feature | Component | Current Status | Test Status | Risk Level | Required Action for v2.0 |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **Cover Page & Metadata** | `CoverPage.tsx` | Working | Passed | Low | Preserve editorial styling and add direct auth/role switches. |
| **Pedagogical Guide** | `WelcomeAndGuide.tsx` | Working | Passed | Low | Maintain guidance on active learning methodology. |
| **Unit Mindmap & Outcomes** | `UnitMapAndOutcomes.tsx` | Working | Passed | Low | Connect to dynamic mastery percentages per lesson. |
| **Interactive Lesson Viewer** | `LessonViewer.tsx` | Working | Passed | Medium | Connect quick checks and quizzes to backend attempt tracking. |
| **Documentary Cycle Simulator**| `DocumentaryCycleSimulator.tsx`| Working | Passed | Medium | محتوى إثرائي غير مقرر (non-syllabus enrichment) لربط الحدث الاقتصادي بالمستند المؤيد، وليس تغطية منهجية رسمية. |
| **T-Account Simulator** | `TAccountSimulator.tsx` | Working | Passed | Medium | Upgrade to v2 with step-by-step transaction analysis & retry hints. |
| **JRE Workshop** | `JRETalker.tsx` | Working | Passed | Medium | Upgrade to v2 with 10-point standardized rubric & AI feedback. |
| **Unit Big Picture & Review** | `UnitReviewViewer.tsx` | Working | Passed | Low | Preserve visual diagrams, glossary, and error avoidance tables. |
| **Question Bank Viewer** | `QuestionBankViewer.tsx` | Working | Passed | High | Expand dataset to 200+ items across 9 question classifications. |
| **Exam Simulator** | `ExamSimulator.tsx` | Working | Passed | High | Connect to persistent exam attempt recording and score history. |
| **Print & Book Export** | `PrintView.tsx` | Working | Passed | Medium | Support 5 export editions (Student, Teacher, Answers, Exams, Bank). |
| **Methodology Report Modal** | `MethodologyReportModal.tsx`| Working | Passed | Low | Connect to live curriculum traceability engine. |

---

## 2. New v2.0 Features Inventory

| New Feature | Module / Subsystem | Purpose | Status |
| :--- | :--- | :--- | :---: |
| **Multi-Role Authentication** | `AuthModule` / `UserModule` | Student, Teacher, Admin, and Content Manager RBAC. | Complete |
| **Student Progress & Mastery Engine**| `ProgressModule` / `MasteryEngine` | Multi-dimensional scoring (Accuracy, Difficulty, Consistency). | Complete |
| **Rule-Based Adaptive Engine** | `AdaptiveModule` | Automatic personalized remedial paths for accounting misconceptions. | Complete |
| **Teacher & Student Analytics** | `AnalyticsModule` | Real-time performance dashboards, weak concept analysis, at-risk alerts. | Complete |
| **200+ Expanded Question Bank** | `QuestionModule` | Comprehensive coverage of all Unit 1 concepts and Bloom levels. | Complete |
| **Curriculum Traceability Engine**| `CurriculumEngine` | Strict mapping between Ministry textbook pages, objectives, and exams. | Complete |
| **Full-Stack Express API Layer** | `server.ts` | Scalable REST API with security headers, rate limiting, and health checks. | Complete |
