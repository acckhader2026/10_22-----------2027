# Assessment Specification & Psychometric Engine
**Egyptian Baccalaureate (EB) Management & Financial Accounting Platform**
*Specification Code: SPEC-EB-ACT-2026-V2*

---

## 1. Assessment Objectives & Integrity

The assessment ecosystem guarantees that every student score is:
1. **Curriculum-Grounded**: Directly mapped to one of the 17 learning objectives in Unit 1.
2. **Psychometrically Calibrated**: Assessed for difficulty, distractor plausibility, and discrimination power.
3. **Deterministic & Transparent**: Graded by canonical rubrics and explicit calculation formulas, without random seeds or hardcoded fallbacks.

---

## 2. Exam Composition Blueprint (Canonical 60-Mark Exam)

| Section | Format | Items | Marks / Item | Total Marks | Duration |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Section A** | Multiple Choice (MCQ) | 10 | 2 Marks | 20 Marks | 30 Mins |
| **Section B** | Applied Computational (T-Accounts / Journal / Ledger) | 2 | 10 Marks | 20 Marks | 40 Mins |
| **Section C** | Justified Reasoned Essay (JRE Case Study) | 1 | 20 Marks | 20 Marks | 50 Mins |
| **Total** | | **13** | | **60 Marks** | **120 Mins** |

---

## 3. Blueprint Compliance Validation Engine

Before any exam is issued to a student, `BlueprintEngine` performs a strict compliance check against the target matrix:
- **Taxonomy Balance**: $\pm 5\%$ tolerance of target cognitive distribution.
- **Difficulty Distribution**: Basic (30%), Intermediate (50%), Advanced/Challenge (20%).
- **Objective Coverage**: No duplicate objectives in Section B/C; 100% curriculum representation across sections.

If an exam violates tolerance, the engine rejects the generated set (`STATUS = FAIL`) and selects an alternative compliant set.

---

## 4. Evidence-Based Student Mastery Engine

The platform strictly prohibits arbitrary static fallback scores (such as defaulting to 85% or 75% when data is missing). 

### 4.1 Cold-Start Zero Data Behavior
When a student has recorded 0 attempts:
$$\text{Status} = \text{"INSUFFICIENT\_DATA"}, \quad \text{Composite Mastery} = 0, \quad \text{Confidence} = 0.0$$

### 4.2 Transparent Weighted Formula
When student attempts are recorded ($N \ge 1$):
$$\text{Mastery} = (R_{\text{accuracy}} \times 0.40) + (R_{\text{difficulty}} \times 0.30) + (R_{\text{trend}} \times 0.20) + (R_{\text{breadth}} \times 0.10)$$

Where:
- $R_{\text{accuracy}}$: Raw percentage of correct attempts ($0-100\%$).
- $R_{\text{difficulty}}$: Percentage of correct answers on `advanced` and `challenge` items ($0-100\%$).
- $R_{\text{trend}}$: Accuracy across the most recent 10 attempts ($0-100\%$).
- $R_{\text{breadth}}$: Proportion of unit lessons attempted ($\min(100, (\text{lessonsAttempted} / 6) \times 100)$).
- **Statistical Confidence** ($\gamma$): Scaled linearly with sample size: $\gamma = \min(1.0, N / 25)$.

### 4.3 Mastery Bands
- **Mastered**: Composite Score $\ge 85\%$ with Confidence $\ge 0.70$.
- **Proficient**: Composite Score $70\% - 84\%$.
- **Developing**: Composite Score $50\% - 69\%$.
- **Novice / Needs Remediation**: Composite Score $< 50\%$.
