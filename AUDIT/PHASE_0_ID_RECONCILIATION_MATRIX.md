# PHASE 0: UNIVERSAL CONTENT IDENTITY AUDIT

## Universal Content Identity Matrix

| Entity Type | Legacy ID / Concept | Canonical ID | Public ID / Slug | Parent | Persistence Identity | Source File | Status | Evidence |
|---|---|---|---|---|---|---|---|---|
| Unit 1 | `U01` / `unit-1` | `unit-1` | `unit-01` | `subj-acc-1` | `unit-1` | `CurriculumModel.ts` | CONFIRMED | `CANONICAL_UNIT_1` exported with full data |
| Unit 2 | `U02` / `unit-2` | `unit-2` | `unit-02` | `subj-acc-1` | `unit-2` | `CurriculumModel.ts` | CONFLICT / MISSING | `CANONICAL_UNIT_2` exists but is a skeleton (empty concept arrays) |
| U1 Lessons | `lesson-1` to `-6` | `lesson-1` to `-6` | `unit-01/lesson-X` | `unit-1` | `lesson-X` | `CurriculumModel.ts` | CONFIRMED | Embedded in `CANONICAL_UNIT_1` |
| U2 Lessons | `u2-lesson-1` ... | `lesson-1` to `-6` | `unit-02/lesson-X` | `unit-2` | `lesson-X` | `CurriculumModel.ts` | CONFLICT | Skeleton only; deep content missing in Canonical model |
| Learning Objective | Unstructured / mixed | `LO-X.X` etc. | (Hidden) | Lesson | `LO-X.X` | `CurriculumModel.ts` | CONFIRMED | Standardized in Canonical model |
| Concept | `keyAccountingConcepts` | N/A | N/A | Objective | N/A | `CurriculumModel.ts` | MISSING | U1 has raw strings, U2 has `[]`. No canonical ID schema for Concepts. |
| Skill | N/A | N/A | N/A | N/A | N/A | `CurriculumModel.ts` | NOT_APPLICABLE | Conceptually absent from `CurriculumModel` interfaces. |
| Exercise | Indices / Embedded | N/A | N/A | Lesson | N/A | `lessonsData.ts` | UNMAPPED | Buried inside static `sections` arrays; not in Canonical Model. |
| Question | `q1`, `u2-q-mcq-1` | `eb-mcq-001` etc. | (Hidden) | Objective | `eb-mcq-001` | `expandedQuestionBank.ts`| CONFIRMED | IDs mapped properly in `expandedQuestionBank.ts`. |
| JRE Item | N/A | N/A | N/A | Unit | N/A | `unitReviewData.ts` | UNMAPPED | Completely missing from Canonical architecture. |
| Error Analysis Item | `primaryMisconceptions`| N/A | N/A | Objective | N/A | `CurriculumModel.ts` | MISSING | Raw strings in U1; empty `[]` in U2. No canonical ID schema. |
| Review Item | Embedded | N/A | N/A | Unit | N/A | `unitReviewData.ts` | UNMAPPED | Static data. Not referenced in `UnitSpec`. |
| Simulator | N/A | N/A | N/A | N/A | N/A | `TAccountSimulator.tsx`| NOT_APPLICABLE | Hardcoded directly inside UI component; zero domain identity. |
| Exam | Index-based | N/A | N/A | N/A | N/A | `examsData.ts` | UNMAPPED | No canonical model for exams. |
| Exam Question | Mixed/Embedded | N/A | N/A | Exam | N/A | `examsData.ts` | UNMAPPED | Uses static references instead of canonical IDs. |

## ID Reconciliation Findings
- **Unit 2 Reality:** While `CANONICAL_UNIT_2` was created structurally to satisfy basic app loading, it is a hollow shell. Arrays like `keyAccountingConcepts` and `primaryMisconceptions` are completely empty (`[]`). This classifies U2's deeper content mapping as `MISSING`.
- **Missing Schema Entities:** Critical entities requested by the audit (`Skill`, `Simulator`, `Review Item`, `Exercise`) are structurally absent from the `UnitSpec` and `LessonSpec` interfaces in `CurriculumModel.ts`. They cannot be mapped because the architectural placeholders do not exist.
- **Concepts & Errors:** Exist only as raw `string[]` without UUIDs, making traceablity or DB relations impossible.
