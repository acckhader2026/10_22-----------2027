# PHASE 0: ARCHITECTURE FORENSIC AUDIT

## 1. COMPONENT FORENSIC AUDIT
| Component | File | State Source | Data Source | Navigation | Unit Dependency | Role Dependency | Persistence Dependency | Status |
|---|---|---|---|---|---|---|---|---|
| `AppShell` | `src/components/AppShell.tsx` | Route State (`useLocation`) | Static UI | React Router | `selectedUnit` (local state) | `useAuth()` | LocalStorage (progress count) | CONFIRMED |
| `LessonViewer` | `src/components/LessonViewer.tsx` | Local State (`currentLessonIndex`) | Static (`unit1Lessons`/`unit2Lessons`) | Internal Prop Drilling | Yes (indirect) | None | LocalStorage (sync progress) | CONFIRMED |
| `UnitMapAndOutcomes`| `src/components/UnitMapAndOutcomes.tsx` | Local State | Static (`allLessons`, `unit2AnalysisData`) | Prop Callback | Yes (Props) | None | None | CONFIRMED |
| `QuestionBankViewer`| `src/components/QuestionBankViewer.tsx`| Local State | Static (`expandedQuestionBank`) | None | Hardcoded (u1/u2) | None | None | CONFIRMED |
| `UnitReviewViewer` | `src/components/UnitReviewViewer.tsx`| Local State | Static (`unitReviewData`/`unit2ReviewData`)| None | Yes (Props) | None | None | CONFIRMED |
| `TAccountSimulator`| `src/components/TAccountSimulator.tsx`| Local State | Hardcoded scenarios | Internal | None | None | None | CONFIRMED |
| `ExamSimulator` | `src/components/ExamSimulator.tsx` | Local State | Static (`comprehensiveExams`) | Internal | Hardcoded | None | None | CONFIRMED |
| `JRETalker` | `src/components/JRETalker.tsx` | Local State | Local constants | None | None | None | None | CONFIRMED |
| `AuthModal` | `src/components/AuthModal.tsx` | Context/Local | Server API (`/api/auth`) | None | None | `PlatformRole` | Database | CONFIRMED |
| `Header` | `src/components/Header.tsx` | Route Props | Static UI | React Router callbacks| None | `PlatformRole` | None | CONFIRMED |
| `SidebarDrawer` | `src/components/SidebarDrawer.tsx`| Local Props | Static UI | React Router callbacks| `selectedUnit` | None | None | CONFIRMED |

## 2. DATABASE RUNTIME FORENSIC AUDIT
Runtime Dependency Graph:
`Static Content` -> `database.ts (seed)` -> `PersistentProductionDatabase` (In-Memory + JSON-backed) -> `server.ts` -> REST APIs -> `Frontend`

- **Lessons Source**: Static `allLessons` mapped into `db.lessons` in `database.ts` during `seed()`.
- **Questions Source**: `expandedQuestionBank` mapped into `db.questions` in `database.ts` during `seed()`.
- **Exams Source**: `comprehensiveExams` mapped into `db.exams` in `database.ts` during `seed()`.
- **Progress Source**: `db.lessonProgress` and `db.questionAttempts` (Memory/JSON).
- **Mastery Source**: `studentMasteryEngine` (calculates from attempts).

## 3. PRISMA VERIFICATION
| Prisma Model | Schema Exists | Runtime Usage | Repository Usage | Actual Source | Decision |
|---|---|---|---|---|---|
| User | Yes | No | No | `database.ts` | DEPRECATE / MIGRATE (Phase 5) |
| Subject/Course/Unit | Yes | No | No | `database.ts` | DEPRECATE / MIGRATE (Phase 5) |
| Lesson/Objective | Yes | No | No | `database.ts` | DEPRECATE / MIGRATE (Phase 5) |
| Question | Yes | No | No | `database.ts` | DEPRECATE / MIGRATE (Phase 5) |
| Exam | Yes | No | No | `database.ts` | DEPRECATE / MIGRATE (Phase 5) |
| Progress/Attempts | Yes | No | No | `database.ts` | DEPRECATE / MIGRATE (Phase 5) |

**Conclusion**: Prisma is completely unused in the runtime path. The current production backend relies entirely on `database.ts` (`PersistentProductionDatabase`), which writes to JSON files.

## 4. PERSISTENCE VERIFICATION
- The backend uses `fs.writeFileSync` in `src/server/db/database.ts` to persist state to a JSON file (`database.json`).
- It is a Disk-backed / In-Memory hybrid solution. Data is held in memory, and synced to disk on mutations.

