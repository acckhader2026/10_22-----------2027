# PHASE 0: HARD-CODE FORENSIC AUDIT

## Hard-coded Dependencies

| Hard-Code Instance | File | Classification | Note / Impact |
|---|---|---|---|
| `const map: Record<string, number> = { 'lesson-1': 0, ... }` | `AppShell.tsx` | UI_CONSTANT / LEGACY_COMPATIBILITY | Maps lesson ID string to array index for `currentLessonIndex` state. |
| `selectedUnit: 'unit-1' \| 'unit-2' = 'unit-1'` | `AppShell.tsx`, `SidebarDrawer.tsx` | ARCHITECTURAL_HARD_CODE | Constrains the app to only two specific units explicitly. |
| `if (unitId === 'unit-2') { return unit2Lessons; }` | `LessonViewer.tsx`, `SidebarDrawer.tsx` | BUSINESS_LOGIC | Hardcoded resolution of static lesson arrays based on unit ID. |
| `Array(6).fill(...)` (lesson offsets) | `UnitMapAndOutcomes.tsx` | UI_CONSTANT | Assumes fixed 6 lessons per unit. |
| `totalExercisesCount={50}` | `AppShell.tsx` | CONTENT_CONSTANT | Hardcoded total metric. |
| `totalMarks: 20` | `QuestionBankViewer.tsx`, `ExamSimulator.tsx` | CONTENT_CONSTANT | Hardcoded metrics instead of dynamic calculation. |
| `unitId === 'unit-2'` checks | `UnitReviewViewer.tsx` | BUSINESS_LOGIC | Switching between `unitReviewData` and `unit2ReviewData` manually. |
| `expandedQuestionBank.filter(...)` with manual tag lists | `ExamSimulator.tsx` | BUSINESS_LOGIC | Hardcoded logic to assemble exams from the static array rather than dynamic DB queries. |

**Conclusion**: The UI layer still relies heavily on explicit checks for `'unit-1'` and `'unit-2'` to toggle between statically imported arrays. The transition to Canonical Architecture must abstract these by loading content via dynamic API calls or canonical registry lookups.
