# PHASE 0: SOURCE OF TRUTH CONTRACT

| Domain | Source | Why / Authoritative Nature | Evidence | Confidence | Unresolved Issue |
|---|---|---|---|---|---|
| **Curriculum Structure** | `CurriculumRegistry` (`CurriculumModel.ts`) | The single source mapping Units, Lessons, Objectives, taxonomy, and weights. | `CANONICAL_UNIT_1` and `CANONICAL_UNIT_2` exports. | HIGH | Content arrays (like sections, examples) are still split in `lessonsData.ts` and `unit2Lessons/*`. |
| **Questions Data** | `expandedQuestionBank.ts` | The consolidated, canonical question bank containing items mapped to exact Learning Objectives. | 112+ questions mapped by `learningObjectiveId` and `unitId`. | HIGH | `questionBankData.ts` exists but is redundant. |
| **Runtime Persistence** | `database.ts` (`PersistentProductionDatabase`) | Persists all actual runtime state (users, progress, logs) to disk (`database.json`) acting as the application's backend. | API routes (`server.ts`) directly call `db.recordAttempt`, etc., saving to disk. | HIGH | None |
| **Prisma Schema** | UNUSED (Legacy Schema) | Prisma is set up and has seed scripts, but the runtime API (`server.ts`) does not import or use `PrismaClient`. | Zero imports of `PrismaClient` in `server.ts` or `src/server/modules/*`. | HIGH | Needs formal deprecation or migration (Phase 5). |
| **Exams/Simulators** | `examsData.ts` / Hardcoded | Simulators and Exams have no canonical schema and are just TS arrays used directly by React components. | Direct imports in `ExamSimulator.tsx`. | LOW | Requires modeling into Canonical Architecture. |
| **Student Progress** | `database.ts` (API) & `localStorage` (UI) | Server tracks official mastery; UI uses `localStorage` for optimistic exercise count tracking. | `localStorage.getItem('eb_acc_progress')` vs `/api/progress/student`. | MEDIUM | UI needs to fetch true progress from API instead of `localStorage`. |

