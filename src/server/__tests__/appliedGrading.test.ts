import { describe, it, expect } from 'vitest';
import { runAppliedGradingTests } from '../../domain/__tests__/appliedGradingValidation';
import { appliedGradingEngine } from '../../domain/assessment/grading/AppliedGradingEngine';

describe('P0 Production - Applied Grading Engine Regression Tests', () => {
  it('should pass all applied grading verification tests', () => {
    const result = runAppliedGradingTests();
    expect(result.success).toBe(true);
    expect(result.passedCount).toBe(result.totalCount);
  });

  describe('Unit 2 Specialized Applied Grading Methods', () => {
    it('should grade Unit 2 Trial Balance with full marks and populated stepBreakdown', () => {
      const fullAnswer = `
      أرصدة مدينة: النقدية 50,000، البنك 120,000، العملاء 40,000، مصروف الإيجار 15,000، مصروف الرواتب 25,000.
      أرصدة دائنة: رأس المال 200,000، الدائنون 30,000، المبيعات 20,000.
      مجموع الجانب المدين = 250,000 جنيه.
      مجموع الجانب الدائن = 250,000 جنيه.
      التحقق: توازن تام وتساوي كفتي الميزان (المدين = الدائن = 250,000 ج).
      `;
      const res = appliedGradingEngine.gradeUnit2TrialBalance(fullAnswer, 10, 'unified-u2-q20');
      expect(res.awardedMarks).toBe(10);
      expect(res.status).toBe('CORRECT');
      expect(res.stepBreakdown).toHaveLength(4);
      expect(res.stepBreakdown.every(s => s.passed)).toBe(true);
      const totalWeight = res.stepBreakdown.reduce((sum, s) => sum + s.maxMarks, 0);
      expect(totalWeight).toBeCloseTo(10, 1);
    });

    it('should grade Unit 2 Trial Balance with partial marks (between 0 and 10)', () => {
      const partialAnswer = 'أرصدة مدينة: النقدية 50,000، والبنك 120,000';
      const res = appliedGradingEngine.gradeUnit2TrialBalance(partialAnswer, 10, 'unified-u2-q20');
      expect(res.awardedMarks).toBeGreaterThan(0);
      expect(res.awardedMarks).toBeLessThan(10);
      expect(res.status).toBe('PARTIALLY_CORRECT');
      expect(res.stepBreakdown).toHaveLength(4);
    });

    it('should grade Unit 2 Correction Entries with full marks and populated stepBreakdown', () => {
      const fullAnswer = `
      1) تشخيص الخطأ: خطأ توجيه محاسبي ناجم عن رسملة مصروفات استشارات بمبلغ 40,000 ج وتحميلها لأصل براءات الاختراع، وهو خطأ متكافئ لا يخل بتوازن ميزان المراجعة.
      2) الأثر المالي: تضخيم غير حقيقي في صافي الربح بمقدار 40,000 ج وتضخيم موازٍ في أصول المركز المالي.
      3) قيد التصحيح:
      من حـ/ مصروفات استشارات 40,000
      إلى حـ/ براءات الاختراع 40,000
      4) التسوية: لا حاجة لفتح الحساب المعلق لأن الخطأ متكافئ والميزان متوازن مسبقاً، ويستعاد التمثيل الصادق بإقفال المصروف في قائمة الدخل.
      `;
      const res = appliedGradingEngine.gradeUnit2CorrectionEntries(fullAnswer, 10, 'unified-u2-q30');
      expect(res.awardedMarks).toBe(10);
      expect(res.status).toBe('CORRECT');
      expect(res.stepBreakdown).toHaveLength(4);
      expect(res.stepBreakdown.every(s => s.passed)).toBe(true);
      const totalWeight = res.stepBreakdown.reduce((sum, s) => sum + s.maxMarks, 0);
      expect(totalWeight).toBeCloseTo(10, 1);
    });

    it('should grade Unit 2 Correction Entries with partial marks (between 0 and 10)', () => {
      const partialAnswer = 'تشخيص الخطأ: خطأ توجيه أثر على أرباح الشركة والمركز المالي.';
      const res = appliedGradingEngine.gradeUnit2CorrectionEntries(partialAnswer, 10, 'unified-u2-q30');
      expect(res.awardedMarks).toBeGreaterThan(0);
      expect(res.awardedMarks).toBeLessThan(10);
      expect(res.status).toBe('PARTIALLY_CORRECT');
      expect(res.stepBreakdown).toHaveLength(4);
    });

    it('should grade Unit 2 Compound Journal Entries with full marks and populated stepBreakdown', () => {
      const fullAnswer = `
      من حـ/ السيارات 120,000
      إلى مذكورين:
      حـ/ البنك 40,000
      حـ/ النقدية 30,000
      حـ/ الدائنين شركة الأمل 50,000
      (شراء سيارة نقل بشيك ونقد وعلى الحساب، وتساوي الطرفين 120,000 = 40,000 + 30,000 + 50,000)
      `;
      const res = appliedGradingEngine.gradeUnit2CompoundJournalEntries(fullAnswer, 10, 'unified-u2-q10');
      expect(res.awardedMarks).toBe(10);
      expect(res.status).toBe('CORRECT');
      expect(res.stepBreakdown).toHaveLength(4);
      expect(res.stepBreakdown.every(s => s.passed)).toBe(true);
      const totalWeight = res.stepBreakdown.reduce((sum, s) => sum + s.maxMarks, 0);
      expect(totalWeight).toBeCloseTo(10, 1);
    });

    it('should grade Unit 2 Compound Journal Entries with partial marks (between 0 and 10)', () => {
      const partialAnswer = 'من حـ/ السيارات 120,000 إلى حـ/ البنك 40,000';
      const res = appliedGradingEngine.gradeUnit2CompoundJournalEntries(partialAnswer, 10, 'unified-u2-q10');
      expect(res.awardedMarks).toBeGreaterThan(0);
      expect(res.awardedMarks).toBeLessThan(10);
      expect(res.status).toBe('PARTIALLY_CORRECT');
      expect(res.stepBreakdown).toHaveLength(4);
    });
  });
});
