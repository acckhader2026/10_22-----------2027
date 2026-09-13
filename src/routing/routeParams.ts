import { curriculumRegistry } from '../domain/curriculum/CurriculumRegistry';

export const VALID_UNIT_SLUGS = ['unit-1', 'unit-2', 'unit-3', 'unit-4', 'unit-01', 'unit-02', 'unit-03', 'unit-04'] as const;

export const VALID_LESSON_SLUGS = [
  'lesson-1', 'lesson-2', 'lesson-3', 'lesson-4', 'lesson-5', 'lesson-6',
  'lesson-01', 'lesson-02', 'lesson-03', 'lesson-04', 'lesson-05', 'lesson-06'
] as const;

/**
 * Normalizes a unit slug to canonical 'unit-1', 'unit-2', 'unit-3', or 'unit-4'
 */
export function normalizeUnitSlug(slug?: string): string | null {
  if (!slug) return null;
  const s = slug.toLowerCase().trim();
  if (s === 'unit-1' || s === 'unit-01' || s === 'u1') return 'unit-1';
  if (s === 'unit-2' || s === 'unit-02' || s === 'u2') return 'unit-2';
  if (s === 'unit-3' || s === 'unit-03' || s === 'u3') return 'unit-3';
  if (s === 'unit-4' || s === 'unit-04' || s === 'u4') return 'unit-4';
  const registered = curriculumRegistry.getUnitById(s) || curriculumRegistry.getUnitBySlug(s);
  if (registered) return registered.id;
  return null;
}

/**
 * Normalizes a lesson slug to canonical 'lesson-1' through 'lesson-6'
 */
export function normalizeLessonSlug(slug?: string): string | null {
  if (!slug) return null;
  const s = slug.toLowerCase().trim();
  const match = s.match(/^(?:u[1234]-)?lesson-?0?([1-6])$/);
  if (match) {
    return `lesson-${match[1]}`;
  }
  return null;
}

/**
 * Checks if a unit slug is valid
 */
export function isValidUnitSlug(slug?: string): boolean {
  return normalizeUnitSlug(slug) !== null;
}

/**
 * Checks if a lesson slug is valid in context of a unit
 */
export function isValidLessonSlug(unitSlug?: string, lessonSlug?: string): boolean {
  const normUnit = normalizeUnitSlug(unitSlug);
  const normLesson = normalizeLessonSlug(lessonSlug);
  if (!normUnit || !normLesson) return false;
  const unit = curriculumRegistry.getUnitById(normUnit);
  if (!unit) return false;
  return unit.lessons.some(l => l.id === normLesson);
}

/**
 * Converts unit and lesson slugs to a global zero-based lesson index (0..11)
 */
export function getLessonIndexFromSlugs(unitSlug?: string, lessonSlug?: string): number {
  const normUnit = normalizeUnitSlug(unitSlug) || 'unit-1';
  const normLesson = normalizeLessonSlug(lessonSlug) || 'lesson-1';
  const num = parseInt(normLesson.replace('lesson-', ''), 10) || 1;
  let unitOffset = 0;
  if (normUnit === 'unit-2') unitOffset = 6;
  if (normUnit === 'unit-3') unitOffset = 12;
  if (normUnit === 'unit-4') unitOffset = 18;
  const idx = unitOffset + (num - 1);
  return Math.max(0, Math.min(23, idx));
}

/**
 * Converts a global zero-based lesson index (0..23) to canonical unitSlug and lessonSlug
 */
export function getSlugsFromLessonIndex(index: number): { unitSlug: 'unit-1' | 'unit-2' | 'unit-3' | 'unit-4'; lessonSlug: string } {
  const safeIndex = Math.max(0, Math.min(23, Math.floor(index)));
  let unitSlug: 'unit-1' | 'unit-2' | 'unit-3' | 'unit-4';
  let lessonNum: number;
  
  if (safeIndex < 6) {
    unitSlug = 'unit-1';
    lessonNum = safeIndex + 1;
  } else if (safeIndex < 12) {
    unitSlug = 'unit-2';
    lessonNum = safeIndex - 5;
  } else if (safeIndex < 18) {
    unitSlug = 'unit-3';
    lessonNum = safeIndex - 11;
  } else {
    unitSlug = 'unit-4';
    lessonNum = safeIndex - 17;
  }
  
  const lessonSlug = `lesson-${lessonNum}`;
  return { unitSlug, lessonSlug };
}

/**
 * Generates canonical URLs
 */
export function buildUnitUrl(unitSlug: string): string {
  const norm = normalizeUnitSlug(unitSlug) || 'unit-1';
  return `/curriculum/${norm}`;
}

export function buildLessonUrl(unitSlug: string, lessonSlug: string): string {
  const normUnit = normalizeUnitSlug(unitSlug) || 'unit-1';
  const normLesson = normalizeLessonSlug(lessonSlug) || 'lesson-1';
  return `/curriculum/${normUnit}/lessons/${normLesson}`;
}
