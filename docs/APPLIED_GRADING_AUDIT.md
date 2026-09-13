# Applied, Numerical, and Case Questions Grading Audit
**Forensic Baseline & Elimination of "Presence-Based" Scoring**
*Document Code: AUDIT-EB-APPLIED-GRADING-2026-P0*

---

## 1. Executive Summary & Root Cause

A critical psychometric flaw was identified in the grading subsystem: open-response applied and case questions were awarded **100% full marks** simply if the student's answer text length exceeded 10 characters (`String(userAnswer).trim().length > 10`).

This resulted in:
1. Complete failure to validate actual numerical calculations (e.g. COGS, gross profit, net profit, ending capital).
2. Complete failure to validate journal entries (debit/credit direction, account names, balance equality).
3. Complete failure to assess case analysis against a structured rubric.
4. Total disconnect between student effort/correctness and marks awarded.

---

## 2. Forensic Code Audit & Locations of the Bug

### 2.1 Primary Server-Side Grading Bug (`src/server/modules/exams.ts`)

**Lines 68–74**:
```typescript
// ❌ CRITICAL BUG FOUND:
} else if (q.type === 'applied' || q.type === 'case') {
  // Evaluate applied calculation presence or steps
  const isAttempted = Boolean(userAnswer && String(userAnswer).trim().length > 10);
  const appliedScore = isAttempted ? (q.marks || 10) : 0;
  totalScore += appliedScore;
  evaluations[q.id] = { isCorrect: isAttempted, score: appliedScore, maxMarks: q.marks || 10, type: q.type };
}
```

### 2.2 Client-Side Exam Simulation Disconnect (`src/components/ExamSimulator.tsx`)

In `ExamSimulator.tsx`:
- Only MCQ/True-False was scored locally (`autoScore`), leaving applied/case questions un-evaluated on the client, or relying on mock representations without calling `/api/exams/submit` to retrieve the authoritative server grading.
- Client had no UI feedback displaying itemized step-by-step marks, partial credit breakdown, or specific error diagnostics.

---

## 3. Question Types Requiring Rigorous Grading

| Question Category | Current Buggy Behavior | Required Authoritative Behavior |
| :--- | :--- | :--- |
| **Numerical / Computational** | `length > 10` $\rightarrow$ Full Marks | Normalization of Arabic/English digits, comma/dot separators, currency, unit, and question-configured tolerance ($\pm \text{abs}/\text{rel}$). Working steps marks. |
| **Journal Entry** | `length > 10` $\rightarrow$ Full Marks | Semantic account alias resolution, debit/credit direction check, amount balance check, partial credit for individual correct legs. |
| **Multi-Step Financial Statement / Working** | `length > 10` $\rightarrow$ Full Marks | Breakdown of intermediate calculations (COGS, Gross Profit, Expenses, Net Profit, Balance Sheet total). Partial credit for each step. |
| **Case Analysis / Error Correction** | `length > 10` $\rightarrow$ Full Marks | Multi-criteria rubric evaluating Error Identification (marks), Impact Analysis (marks), and Correcting Entry (marks). |

---

## 4. Remediation Plan

1. **Phase 2**: Define Canonical `AppliedGradingResult` and engine contracts in `src/domain/assessment/grading/AppliedGradingEngine.ts`.
2. **Phase 3**: Implement deterministic Numerical Parser & Validator with configurable tolerance.
3. **Phase 4**: Implement Step/Working Evaluation Engine for intermediate accounting calculations.
4. **Phase 5**: Implement Semantic Journal Entry Grader with account alias dictionary and debit/credit direction validation.
5. **Phase 6**: Implement Multi-criteria Case Grader.
6. **Phase 7–10**: Deterministic grading first, AI/Human-review fallback with explicit confidence thresholds.
7. **Phase 11–15**: Connect server-side authoritative grading in `src/server/modules/exams.ts`, update `ExamSimulator.tsx` to display complete itemized evaluations, and add exhaustive unit tests in `src/domain/__tests__/appliedGradingValidation.ts`.
