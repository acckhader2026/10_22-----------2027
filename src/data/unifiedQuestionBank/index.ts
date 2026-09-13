import { TraceableQuestion } from '../expandedQuestionBank';
import { unit1CoreBank } from './unit1CoreBank';
import { unit2Bank } from './unit2Bank';
import { unit3Bank } from './unit3Bank';
import { unit4Bank } from './unit4Bank';
import { UNIFIED_LO_MAPPING, mapSourceLOToCanonical } from './loMapping';

export { unit1CoreBank } from './unit1CoreBank';
export { unit2Bank } from './unit2Bank';
export { unit3Bank } from './unit3Bank';
export { unit4Bank } from './unit4Bank';
export { UNIFIED_LO_MAPPING, mapSourceLOToCanonical } from './loMapping';

/**
 * بنك الأسئلة التدريبي الموحد (Unified Question Bank v4.0)
 * إجمالي 144 أسئلة تعليمية مصاغة بدقة:
 * - 36 سؤالاً للوحدة الأولى
 * - 36 سؤالاً للوحدة الثانية
 * - 36 سؤالاً للوحدة الثالثة
 * - 36 سؤالاً للوحدة الرابعة
 */
export const UNIFIED_ALL_QUESTIONS: TraceableQuestion[] = [
  ...unit1CoreBank,
  ...unit2Bank,
  ...unit3Bank,
  ...unit4Bank
];

export function getUnifiedQuestionsByUnit(unitId: 'unit-1' | 'unit-2' | 'unit-3' | 'unit-4'): TraceableQuestion[] {
  if (unitId === 'unit-1') return unit1CoreBank;
  if (unitId === 'unit-2') return unit2Bank;
  if (unitId === 'unit-3') return unit3Bank;
  if (unitId === 'unit-4') return unit4Bank;
  return [];
}

export function getUnifiedQuestionsBySkill(skillCode: string): TraceableQuestion[] {
  return UNIFIED_ALL_QUESTIONS.filter(q => q.skillCode === skillCode);
}

export function getUnifiedQuestionsByBloom(bloomLevel: string): TraceableQuestion[] {
  return UNIFIED_ALL_QUESTIONS.filter(q => q.bloomLevel === bloomLevel);
}

export function getUnifiedQuestionsByType(type: string): TraceableQuestion[] {
  return UNIFIED_ALL_QUESTIONS.filter(q => q.questionType === type);
}

export function getUnifiedQuestionById(id: string): TraceableQuestion | undefined {
  return UNIFIED_ALL_QUESTIONS.find(q => q.id === id || q.originalId === id);
}
