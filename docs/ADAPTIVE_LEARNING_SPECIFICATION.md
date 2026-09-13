# Adaptive Learning & Remediation Specification
**Egyptian Baccalaureate (EB) Management & Financial Accounting Platform**
*Specification Code: SPEC-EB-ADAPTIVE-2026*

---

## 1. Pedagogical Remediation Loop

The platform rejects simplistic "wrong answer $\rightarrow$ repeat same question" heuristics. Instead, it executes an 8-stage diagnostic-remedial cycle:

```
                  [Student Attempt]
                          │
                          ▼
            [1. Diagnose Error Pattern]
                          │
                          ▼
        [2. Classify Accounting Misconception]
                          │
                          ▼
          [3. Select Targeted Intervention]
                          │
                          ▼
          [4. Reteach Core Principle & Rule]
            (Ministry Textbook Page Reference)
                          │
                          ▼
         [5. Interactive Guided Simulation]
              (T-Account / Ledger Workbench)
                          │
                          ▼
             [6. Retest on Similar Item]
             (Same Objective, New Context)
                          │
                          ▼
             [7. Recalculate Mastery]
                          │
                          ▼
          [8. Unlock Next Cognitive Step]
```

---

## 2. Misconception Taxonomy in Accounting (Unit 1)

1. **MIS-01: Cash vs. Accrual Confusion**: Believing revenue or expense occurs only when cash changes hands, violating the Matching Principle.
2. **MIS-02: Debit/Credit Reversal on Normal Balances**: Incorrectly treating revenues as debit and expenses as credit, or assets as credit.
3. **MIS-03: Capital vs. Revenue Expenditure**: Capitalizing operating maintenance expenses or expensing long-term productive assets.
4. **MIS-04: Trial Balance Infallibility**: Believing a balanced trial balance guarantees zero accounting errors (ignoring errors of omission, commission, and compensating errors).
5. **MIS-05: Single-Sided Transaction Fallacy**: Recording an asset purchase on credit without adjusting accounts payable, breaking the Accounting Equation.

---

## 3. Machine-Readable Recommendation Output

Every adaptive intervention must provide:
- `concept`: Name of the focal concept.
- `misconceptionDiagnosed`: Specific error diagnosed.
- `explanationAr`: Clear, pedagogical explanation of the correct accounting rule.
- `textbookReference`: Explicit page numbers from `Accuonting-Ar-EB-Part1.pdf`.
- `recommendedAction`: Step-by-step guidance for the student.
- `targetQuestionIds`: Calibrated practice questions to re-test understanding.
