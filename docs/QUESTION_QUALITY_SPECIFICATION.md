# Question Quality Specification & Psychometric Engine
**Egyptian Baccalaureate (EB) Management & Financial Accounting Platform**
*Specification Code: SPEC-EB-QUESTION-QUALITY-12PT*

---

## 1. The 12 Mandatory Psychometric Quality Rules

Every assessment item ingested into or delivered from the Question Bank must be audited against these 12 formal criteria:

1. **Unambiguous Single Key**: Exactly one objectively defensible correct answer is designated.
2. **Plausible Distractors**: Distractors must represent documented student misconceptions (e.g., confusing matching with cash basis, swapping debit/credit for revenues).
3. **No Cluing / Grammatical Leakage**: Option lengths, phrasing, and syntax must be symmetrical; correct options must not contain unintended giveaway cues.
4. **No Duplicated Options**: All response alternatives must be distinct.
5. **Prompt Clarity & Precision**: Prompt states the problem unambiguously without redundant phrasing.
6. **Difficulty Calibration**: Basic (single concept), Intermediate (2-step application), Advanced/Challenge (synthesis & multi-account interaction).
7. **Taxonomy Alignment**: Cognitive demand matches the target Bloom level (Remember, Understand, Apply, Analyze, Evaluate, Create).
8. **Curriculum Traceability**: Explicitly tagged with `lesson_id`, `learning_objective_id`, and Ministry Textbook page number (`source_page`).
9. **Curriculum Scope Compliance**: No out-of-scope concepts (e.g., advanced corporate consolidation outside Unit 1).
10. **Independent Calculation Verification**: For all computational items (journal entries, trial balances, ledger balances), numbers are mathematically verified to balance.
11. **Comprehensive Pedagogical Explanation**: Explains *why* the correct answer is valid and *why* specific distractors are incorrect.
12. **Diagnostic Misconception Tagging**: Explicit identification of the misconception triggered by incorrect selections.

---

## 2. Automated Validation Scoring Architecture

The `QuestionQualityEngine` evaluates each item:

$$\text{Quality Score} = 100 - (\text{Critical Issues} \times 25) - (\text{Warning Issues} \times 5)$$

- **Pass Threshold**: Quality Score $\ge 85/100$ and $\text{Critical Issues} = 0$.
- **Rejection Status**: Any item violating Rules 1, 8, 10, or 11 is immediately flagged as `CRITICAL_REJECT` and excluded from exam generation.
