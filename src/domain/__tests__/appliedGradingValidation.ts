/**
 * appliedGradingValidation.ts
 * 
 * Exhaustive Verification & Regression Test Suite for AppliedGradingEngine
 * Confirms that:
 * 1. Bug Elimination: String length > 10 never awards marks without valid accounting substance.
 * 2. Numerical Tolerances & Normalization: Arabic-Indic numerals, currency symbols, thousands separators are parsed correctly.
 * 3. Step/Working Mark Allocations: Multi-step calculations award step-by-step partial credit.
 * 4. Semantic Journal Entry Evaluation: Accounts, Dr/Cr directions, and balances are accurately verified.
 * 5. Case Multi-Criterion Rubrics: Conceptual analysis, error mechanisms, and correcting entries are scored independently.
 */

import { appliedGradingEngine } from '../assessment/grading/AppliedGradingEngine';

export function runAppliedGradingTests() {
  console.log('--- STARTING APPLIED GRADING TEST SUITE ---');
  let passedCount = 0;
  let totalCount = 0;

  function assert(condition: boolean, testName: string, details?: string) {
    totalCount++;
    if (condition) {
      passedCount++;
      console.log(`✅ [PASS] ${testName}`);
    } else {
      console.error(`❌ [FAIL] ${testName} - ${details || ''}`);
    }
  }

  // TEST 1: Empty and Random Non-Accounting Text must get 0 marks
  {
    const emptyRes = appliedGradingEngine.gradeAppliedResponse({
      questionId: 'e1-q7',
      studentAnswer: '',
      context: { questionId: 'e1-q7', prompt: 'test', type: 'applied', marks: 10 }
    });
    assert(emptyRes.awardedMarks === 0 && emptyRes.status === 'INCORRECT', 'Test 1.1: Empty submission returns 0 marks');

    const gibberishRes = appliedGradingEngine.gradeAppliedResponse({
      questionId: 'e1-q7',
      studentAnswer: 'أنا لا أعرف الإجابة وسأكتب أي كلام هنا لتجاوز عشرة حروف',
      context: { questionId: 'e1-q7', prompt: 'test', type: 'applied', marks: 10 }
    });
    assert(gibberishRes.awardedMarks === 0 && gibberishRes.status === 'INCORRECT', 'Test 1.2: Random text > 10 chars receives 0 marks (P0 Bug Fixed)');
  }

  // TEST 2: Multi-Step Income Statement (e1-q7) - Full Marks
  {
    const fullAnswer = `
    1) تكلفة البضاعة المباعة = 30000 + 160000 - 40000 = 150,000 جنيه.
    2) مجمل الربح = 280,000 - 150,000 = 130,000 جنيه.
    3) المصروفات التشغيلية = 15000 + 25000 + 5000 = 45,000 جنيه.
    4) صافي الربح = 130000 - 45000 = 85,000 جنيه.
    `;
    const res = appliedGradingEngine.gradeAppliedResponse({
      questionId: 'e1-q7',
      studentAnswer: fullAnswer,
      context: { questionId: 'e1-q7', prompt: 'test', type: 'applied', marks: 10 }
    });
    assert(res.awardedMarks === 10 && res.status === 'CORRECT', 'Test 2.1: Full multi-step calculation awards 10/10 marks');
    assert(res.stepBreakdown.length === 4 && res.stepBreakdown.every(s => s.passed), 'Test 2.2: All 4 step breakdown items passed');
  }

  // TEST 3: Multi-Step Income Statement (e1-q7) - Arabic Numerals
  {
    const arabicAnswer = `
    تكلفة البضاعة = ١٥٠,٠٠٠ ج.م
    مجمل الربح = ١٣٠,٠٠٠ ج
    المصروفات = ٤٥,٠٠٠ جنيه
    صافي الربح = ٨٥,٠٠٠ جنيه
    `;
    const res = appliedGradingEngine.gradeAppliedResponse({
      questionId: 'e1-q7',
      studentAnswer: arabicAnswer,
      context: { questionId: 'e1-q7', prompt: 'test', type: 'applied', marks: 10 }
    });
    assert(res.awardedMarks === 10 && res.status === 'CORRECT', 'Test 3.1: Arabic-Indic numerals normalized and awarded full marks');
  }

  // TEST 4: Multi-Step Income Statement (e1-q7) - Partial Credit
  {
    const partialAnswer = `
    تكلفة المبيعات = 150000 جنيه
    مجمل الربح = 130000 جنيه
    المصروفات = 20000 جنيه
    صافي الربح = 110000 جنيه
    `;
    const res = appliedGradingEngine.gradeAppliedResponse({
      questionId: 'e1-q7',
      studentAnswer: partialAnswer,
      context: { questionId: 'e1-q7', prompt: 'test', type: 'applied', marks: 10 }
    });
    assert(res.awardedMarks === 6 && res.status === 'PARTIALLY_CORRECT', `Test 4.1: Partial credit correctly awarded (awarded ${res.awardedMarks}/10)`);
    assert(res.stepBreakdown.find(s => s.stepId === 'cogs')?.passed === true, 'Test 4.2: COGS step marked passed');
    assert(res.stepBreakdown.find(s => s.stepId === 'gross-profit')?.passed === true, 'Test 4.3: Gross profit step marked passed');
    assert(res.stepBreakdown.find(s => s.stepId === 'operating-expenses')?.passed === false, 'Test 4.4: Erroneous expenses rejected as expected');
  }

  // TEST 5: Journal Entries (e1-q6) - Full Marks
  {
    const journalAnswer = `
    1) من حـ/ النقدية 150,000 إلى حـ/ رأس المال 150,000
    2) من حـ/ المعدات 50,000 إلى حـ/ النقدية 50,000
    3) من حـ/ المشتريات 35,000 إلى حـ/ الدائنين شركة الإخلاص 35,000
    4) من حـ/ الدائنين شركة الإخلاص 15,000 إلى حـ/ النقدية 15,000
    `;
    const res = appliedGradingEngine.gradeAppliedResponse({
      questionId: 'e1-q6',
      studentAnswer: journalAnswer,
      context: { questionId: 'e1-q6', prompt: 'test', type: 'applied', marks: 10 }
    });
    assert(res.awardedMarks === 10 && res.status === 'CORRECT', 'Test 5.1: 4 Journal entries awarded 10/10 marks');
    assert(res.stepBreakdown.length === 4, 'Test 5.2: 4 step allocations evaluated');
  }

  // TEST 6: Journal Entries (e1-q6) - Partial Credit (2 out of 4 entries)
  {
    const partialJournal = `
    1) من حـ/ النقدية 150000 إلى حـ/ رأس المال 150000
    2) من حـ/ المعدات 50000 إلى حـ/ النقدية 50000
    `;
    const res = appliedGradingEngine.gradeAppliedResponse({
      questionId: 'e1-q6',
      studentAnswer: partialJournal,
      context: { questionId: 'e1-q6', prompt: 'test', type: 'applied', marks: 10 }
    });
    assert(res.awardedMarks === 5.0 && res.status === 'PARTIALLY_CORRECT', `Test 6.1: Partial 2 entries awarded 5.0/10 (awarded ${res.awardedMarks})`);
  }

  // TEST 7: Case Study - Trial Balance Error Analysis (e1-q8)
  {
    const caseAnswer = `
    التحليل: ترحيل مصروف الصيانة البالغ 4000 جنيه في الجانب الدائن بدلاً من المدين أدى إلى نقص المدين وزيادة الدائن مما نتج عنه فارق مضاعف مقداره 8000 جنيه في ميزان المراجعة.
    قيد التصحيح:
    من حـ/ مصروف الصيانة 8,000
    إلى حـ/ الحساب المعلق 8,000
    `;
    const res = appliedGradingEngine.gradeAppliedResponse({
      questionId: 'e1-q8',
      studentAnswer: caseAnswer,
      context: { questionId: 'e1-q8', prompt: 'test', type: 'case', marks: 15 }
    });
    assert(res.awardedMarks === 15 && res.status === 'CORRECT', 'Test 7.1: Comprehensive case analysis and correcting entry awarded 15/15 marks');
    assert(res.stepBreakdown.length === 3, 'Test 7.2: Rubric criteria count is 3 (discrepancy, mechanism, correcting entry)');
  }

  // TEST 8: Standard EB Final Statements Simulation (sim-q3)
  {
    const fullEBAnswer = `
    1. حساب المتاجرة: تكلفة البضاعة المباعة = 20,000 + 110,000 - 25,000 = 105,000 ج. مجمل الربح = 180,000 - 105,000 = 75,000 جنيه.
    2. حساب الأرباح والخسائر: إجمالي المصروفات التشغيلية = 30,000 ج. صافي الربح = 75,000 - 30,000 = 45,000 جنيه.
    3. قائمة حقوق الملكية: رأس المال آخر المدة = 50,000 + 45,000 - 10,000 = 85,000 جنيه.
    4. قائمة المركز المالي: مجموع الأصول (55,000 متداولة + 70,000 غير متداولة) = 125,000 جنيه. مجموع الخصوم وحقوق الملكية (قرض 40,000 + حقوق ملكية 85,000) = 125,000 جنيه.
    `;
    const res = appliedGradingEngine.gradeAppliedResponse({
      questionId: 'sim-q3',
      studentAnswer: fullEBAnswer,
      context: { questionId: 'sim-q3', prompt: 'test', type: 'applied', marks: 30 }
    });
    assert(res.awardedMarks === 30 && res.status === 'CORRECT', 'Test 8.1: Full EB Financial statements awarded 30/30 marks');
  }

  // TEST 9: Unit 2 Trial Balance Evaluation (gradeUnit2TrialBalance)
  {
    const fullTBAnswer = `
    أرصدة مدينة: النقدية 50,000، البنك 120,000، العملاء 40,000، مصروف الإيجار 15,000، مصروف الرواتب 25,000.
    أرصدة دائنة: رأس المال 200,000، الدائنون 30,000، المبيعات 20,000.
    مجموع الجانب المدين = 250,000 جنيه.
    مجموع الجانب الدائن = 250,000 جنيه.
    التحقق: توازن تام وتساوي كفتي الميزان (المدين = الدائن = 250,000 ج).
    `;
    const res = appliedGradingEngine.gradeUnit2TrialBalance(fullTBAnswer, 10, 'u2-bank-q20');
    assert(res.awardedMarks === 10 && res.status === 'CORRECT', 'Test 9.1: Full Unit 2 Trial Balance awarded 10/10 marks');
    assert(res.stepBreakdown.length === 4, 'Test 9.2: 4 step allocations evaluated in Trial Balance');
  }

  // TEST 10: Unit 2 Error Correction & Suspense (gradeUnit2CorrectionEntries)
  {
    const fullCorrectionAnswer = `
    1) تشخيص الخطأ: خطأ توجيه محاسبي ناجم عن رسملة مصروفات استشارات بمبلغ 40,000 ج وتحميلها لأصل براءات الاختراع، وهو خطأ متكافئ لا يخل بتوازن ميزان المراجعة.
    2) الأثر المالي: تضخيم غير حقيقي في صافي الربح بمقدار 40,000 ج وتضخيم موازٍ في أصول المركز المالي.
    3) قيد التصحيح:
    من حـ/ مصروفات استشارات 40,000
    إلى حـ/ براءات الاختراع 40,000
    4) التسوية: لا حاجة لفتح الحساب المعلق لأن الخطأ متكافئ والميزان متوازن مسبقاً، ويستعاد التمثيل الصادق بإقفال المصروف في قائمة الدخل.
    `;
    const res = appliedGradingEngine.gradeUnit2CorrectionEntries(fullCorrectionAnswer, 10, 'u2-bank-q30');
    assert(res.awardedMarks === 10 && res.status === 'CORRECT', 'Test 10.1: Full Unit 2 Correction awarded 10/10 marks');
    assert(res.stepBreakdown.length === 4, 'Test 10.2: 4 step allocations evaluated in Error Correction');
  }

  // TEST 11: Unit 2 Compound Journal Entries (gradeUnit2CompoundJournalEntries)
  {
    const fullCompoundAnswer = `
    من حـ/ السيارات 120,000
    إلى مذكورين:
    حـ/ البنك 40,000
    حـ/ النقدية 30,000
    حـ/ الدائنين شركة الأمل 50,000
    (شراء سيارة نقل بشيك ونقد وعلى الحساب، وتساوي الطرفين 120,000 = 40,000 + 30,000 + 50,000)
    `;
    const fullRes = appliedGradingEngine.gradeUnit2CompoundJournalEntries(fullCompoundAnswer, 10, 'unified-u2-q10');
    assert(fullRes.awardedMarks === 10 && fullRes.status === 'CORRECT', 'Test 11.1: Full Unit 2 Compound entry awarded 10/10 marks');
    assert(fullRes.stepBreakdown.length === 4 && fullRes.stepBreakdown.every(s => s.passed), 'Test 11.2: All 4 compound steps evaluated and passed');

    const partialCompoundAnswer = 'من حـ/ السيارات 120,000 إلى حـ/ البنك 40,000';
    const partialRes = appliedGradingEngine.gradeUnit2CompoundJournalEntries(partialCompoundAnswer, 10, 'unified-u2-q10');
    assert(partialRes.awardedMarks > 0 && partialRes.awardedMarks < 10 && partialRes.status === 'PARTIALLY_CORRECT', 'Test 11.3: Partial Compound entry awarded partial marks between 0 and 10');
    assert(partialRes.stepBreakdown.length === 4, 'Test 11.4: Partial Compound returns full stepBreakdown array');
  }

  // TEST 12: Unit 2 Trial Balance Partial Credit
  {
    const partialTBAnswer = 'أرصدة مدينة: النقدية 50,000، والبنك 120,000';
    const res = appliedGradingEngine.gradeUnit2TrialBalance(partialTBAnswer, 10, 'u2-bank-q20');
    assert(res.awardedMarks > 0 && res.awardedMarks < 10 && res.status === 'PARTIALLY_CORRECT', 'Test 12.1: Partial Trial Balance awarded partial marks');
    assert(res.stepBreakdown.length === 4, 'Test 12.2: Partial TB stepBreakdown contains 4 steps');
  }

  // TEST 13: Unit 2 Error Correction Partial Credit
  {
    const partialCorrAnswer = 'تشخيص الخطأ: خطأ توجيه أثر على أرباح الشركة والمركز المالي.';
    const res = appliedGradingEngine.gradeUnit2CorrectionEntries(partialCorrAnswer, 10, 'u2-bank-q30');
    assert(res.awardedMarks > 0 && res.awardedMarks < 10 && res.status === 'PARTIALLY_CORRECT', 'Test 13.1: Partial Correction awarded partial marks');
    assert(res.stepBreakdown.length === 4, 'Test 13.2: Partial Correction stepBreakdown contains 4 steps');
  }

  console.log(`--- TEST RESULTS: ${passedCount} / ${totalCount} PASSED ---`);
  return { passedCount, totalCount, success: passedCount === totalCount };
}
