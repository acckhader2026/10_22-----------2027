# PHASE 0: OPEN ISSUES REGISTER

| Issue ID | Problem | Evidence | Affected Layer | Severity | Current Status | Phase Responsible | Recommended Action | Blocked By |
|---|---|---|---|---|---|---|---|---|
| `ISS-01` | Content (Sections, Examples) is missing from Canonical Curriculum Model. | `LessonSpec` only has metadata. UI still imports `allLessons` directly. | Domain | HIGH | OPEN — DEFERRED TO PHASE 3/4 | Phase 3/4 | Migrate rich content into a headless CMS or extend `CurriculumModel`. | None |
| `ISS-02` | UI Progress depends on `localStorage` instead of Backend. | `completedExercisesCount` in `AppShell` uses `localStorage`. | UI | HIGH | OPEN — DEFERRED TO PHASE 4 | Phase 4 | Connect UI to `/api/progress/student`. | None |
| `ISS-03` | Prisma is fully bypassed by the Runtime. | `server.ts` does not use `@prisma/client`. Uses `database.ts` instead. | Database / Runtime | CRITICAL | OPEN — DEFERRED TO PHASE 5 | Phase 5 | Migrate `database.ts` data to PostgreSQL via Prisma, or remove Prisma. | None |
| `ISS-04` | Unit 2 Canonical Content is a Hollow Skeleton. | `keyAccountingConcepts` and `primaryMisconceptions` for U2 in `CurriculumModel.ts` are `[]`. | Domain | CRITICAL | OPEN — DEFERRED TO PHASE 1 | Phase 1 | Populate U2 canonical metadata with actual domain content. | None |
| `ISS-05` | Canonical Schema Lacks Relational Entities (Skills, Simulators, Reviews). | `CurriculumModel.ts` interfaces have no fields/IDs for `Skill`, `simulatorRef`, `reviewItems`. | Domain / Data | HIGH | OPEN — DEFERRED TO PHASE 3 | Phase 3 | Refactor schema to assign UUIDs to Concepts/Misconceptions and add missing entities. | None |
| `ISS-06` | Exams and Simulators lack Canonical Identity. | `ExamSimulator.tsx` uses hardcoded data. | Domain / UI | MEDIUM | OPEN — DEFERRED TO PHASE 4 | Phase 4 | Create Canonical definitions for Exams. | None |
| `ISS-07` | Deep Linking for lessons uses local state indexing. | `currentLessonIndex` passed via props instead of `useParams()`. | UI (Routing) | HIGH | OPEN — DEFERRED TO PHASE 3 | Phase 3 | Refactor `LessonViewer` to consume URL params. | Phase 2 Routing |
| `ISS-08` | Duplicate Question Bank files exist. | `expandedQuestionBank.ts` and `questionBankData.ts` both exist. | Domain | LOW | OPEN — DEFERRED TO PHASE 1 | Phase 1 | Deprecate and delete `questionBankData.ts`. | None |
