import { ActiveTab } from '../components/Header';
import { getLessonIndexFromSlugs, getSlugsFromLessonIndex, normalizeUnitSlug } from './routeParams';

/**
 * Mapping legacy tab names to modern hierarchical route paths
 */
export const LEGACY_TAB_TO_PATH: Record<ActiveTab, string> = {
  cover: '/',
  home: '/',
  welcome: '/curriculum',
  curriculum: '/curriculum',
  map: '/curriculum/unit-1',
  lessons: '/curriculum/unit-1/lessons/lesson-1',
  simulator: '/training/simulators',
  jre_workshop: '/training/jre',
  training: '/training',
  review: '/assessment/unit-tests',
  qbank: '/assessment/question-bank',
  exams: '/assessment/mock-exams',
  assessment: '/assessment',
  mypath: '/my-path',
  print: '/print'
};

/**
 * Maps legacy flat paths to modern route paths
 */
export const LEGACY_ROUTE_REDIRECTS: Record<string, string> = {
  '/welcome': '/curriculum',
  '/map': '/curriculum/unit-1',
  '/lessons': '/curriculum/unit-1/lessons/lesson-1',
  '/simulator': '/training/simulators',
  '/jre': '/training/jre',
  '/review': '/assessment/unit-tests',
  '/qbank': '/assessment/question-bank',
  '/exams': '/assessment/mock-exams'
};

/**
 * Converts a current URL pathname to its corresponding legacy ActiveTab
 * for components that still consume activeTab for styling or legacy callbacks.
 */
export function pathToLegacyTab(pathname: string): ActiveTab {
  const p = pathname.toLowerCase();
  if (p === '/' || p === '') return 'cover';
  if (p === '/print') return 'print';
  if (p.startsWith('/my-path')) return 'mypath';
  if (p.startsWith('/curriculum') && p.includes('/lessons')) return 'lessons';
  if (p.startsWith('/curriculum') && (p.includes('/unit-') || p.includes('/map'))) return 'map';
  if (p.startsWith('/curriculum')) return 'welcome';
  if (p.startsWith('/training/simulators') || p === '/simulator') return 'simulator';
  if (p.startsWith('/training/jre') || p === '/jre') return 'jre_workshop';
  if (p.startsWith('/training')) return 'training';
  if (p.startsWith('/assessment/question-bank') || p === '/qbank') return 'qbank';
  if (p.startsWith('/assessment/mock-exams') || p === '/exams') return 'exams';
  if (p.startsWith('/assessment/unit-tests') || p === '/review') return 'review';
  if (p.startsWith('/assessment')) return 'assessment';
  return 'cover';
}

/**
 * Resolves legacy selectedUnit ('unit-1' | 'unit-2' | 'unit-3' | 'unit-4') to canonical unit slug
 */
export function legacyUnitToSlug(unitId?: 'unit-1' | 'unit-2' | 'unit-3' | 'unit-4' | string): string {
  return normalizeUnitSlug(unitId) || 'unit-1';
}

/**
 * Resolves canonical unit slug to legacy selectedUnit type
 */
export function slugToLegacyUnit(slug?: string): 'unit-1' | 'unit-2' | 'unit-3' | 'unit-4' {
  const normalized = normalizeUnitSlug(slug);
  if (normalized === 'unit-4') return 'unit-4';
  if (normalized === 'unit-3') return 'unit-3';
  if (normalized === 'unit-2') return 'unit-2';
  return 'unit-1';
}

/**
 * Converts legacy currentLessonIndex to modern URL path
 */
export function legacyIndexToLessonPath(index: number): string {
  const { unitSlug, lessonSlug } = getSlugsFromLessonIndex(index);
  return `/curriculum/${unitSlug}/lessons/${lessonSlug}`;
}

/**
 * Converts modern URL path params to legacy currentLessonIndex
 */
export function lessonPathToLegacyIndex(unitSlug?: string, lessonSlug?: string): number {
  return getLessonIndexFromSlugs(unitSlug, lessonSlug);
}
