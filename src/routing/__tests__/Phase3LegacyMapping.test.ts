import { describe, it, expect } from 'vitest';
import { 
  LEGACY_TAB_TO_PATH, 
  LEGACY_ROUTE_REDIRECTS, 
  pathToLegacyTab,
  legacyUnitToSlug,
  slugToLegacyUnit,
  legacyIndexToLessonPath,
  lessonPathToLegacyIndex
} from '../legacyNavigationAdapter';
import { APP_ROUTES } from '../routeTypes';

describe('Section 11 Gate 8: Phase3 Legacy Navigation & Redirects Mapping Suite', () => {
  it('maps every legacy tab to its designated canonical modern route', () => {
    expect(LEGACY_TAB_TO_PATH['home']).toBe('/');
    expect(LEGACY_TAB_TO_PATH['curriculum']).toBe('/curriculum');
    expect(LEGACY_TAB_TO_PATH['training']).toBe('/training');
    expect(LEGACY_TAB_TO_PATH['assessment']).toBe('/assessment');
    expect(LEGACY_TAB_TO_PATH['mypath']).toBe('/my-path');

    // Backwards-compatible legacy tabs
    expect(LEGACY_TAB_TO_PATH['cover']).toBe('/');
    expect(LEGACY_TAB_TO_PATH['welcome']).toBe('/curriculum');
    expect(LEGACY_TAB_TO_PATH['map']).toBe('/curriculum/unit-1');
    expect(LEGACY_TAB_TO_PATH['lessons']).toBe('/curriculum/unit-1/lessons/lesson-1');
    expect(LEGACY_TAB_TO_PATH['simulator']).toBe('/training/simulators');
    expect(LEGACY_TAB_TO_PATH['jre_workshop']).toBe('/training/jre');
    expect(LEGACY_TAB_TO_PATH['review']).toBe('/assessment/unit-tests');
    expect(LEGACY_TAB_TO_PATH['qbank']).toBe('/assessment/question-bank');
    expect(LEGACY_TAB_TO_PATH['exams']).toBe('/assessment/mock-exams');
    expect(LEGACY_TAB_TO_PATH['print']).toBe('/print');
  });

  it('guarantees 100% redirect coverage for legacy URLs to prevent breaking external deep links', () => {
    expect(LEGACY_ROUTE_REDIRECTS['/welcome']).toBe('/curriculum');
    expect(LEGACY_ROUTE_REDIRECTS['/map']).toBe('/curriculum/unit-1');
    expect(LEGACY_ROUTE_REDIRECTS['/lessons']).toBe('/curriculum/unit-1/lessons/lesson-1');
    expect(LEGACY_ROUTE_REDIRECTS['/simulator']).toBe('/training/simulators');
    expect(LEGACY_ROUTE_REDIRECTS['/jre']).toBe('/training/jre');
    expect(LEGACY_ROUTE_REDIRECTS['/review']).toBe('/assessment/unit-tests');
    expect(LEGACY_ROUTE_REDIRECTS['/qbank']).toBe('/assessment/question-bank');
    expect(LEGACY_ROUTE_REDIRECTS['/exams']).toBe('/assessment/mock-exams');
  });

  it('accurately resolves pathname back to active tab identifier', () => {
    expect(pathToLegacyTab('/')).toBe('cover');
    expect(pathToLegacyTab('/curriculum')).toBe('welcome');
    expect(pathToLegacyTab('/curriculum/unit-1')).toBe('map');
    expect(pathToLegacyTab('/curriculum/unit-2/lessons/lesson-3')).toBe('lessons');
    expect(pathToLegacyTab('/training')).toBe('training');
    expect(pathToLegacyTab('/training/simulators')).toBe('simulator');
    expect(pathToLegacyTab('/training/jre')).toBe('jre_workshop');
    expect(pathToLegacyTab('/assessment')).toBe('assessment');
    expect(pathToLegacyTab('/assessment/question-bank')).toBe('qbank');
    expect(pathToLegacyTab('/assessment/mock-exams')).toBe('exams');
    expect(pathToLegacyTab('/my-path')).toBe('mypath');
    expect(pathToLegacyTab('/my-path/mastery')).toBe('mypath');
    expect(pathToLegacyTab('/print')).toBe('print');
  });

  it('maps legacy lesson indices to modern hierarchal slugs bidirectionally', () => {
    // Unit 1 (0 to 5)
    expect(legacyIndexToLessonPath(0)).toBe('/curriculum/unit-1/lessons/lesson-1');
    expect(legacyIndexToLessonPath(5)).toBe('/curriculum/unit-1/lessons/lesson-6');
    expect(lessonPathToLegacyIndex('unit-1', 'lesson-1')).toBe(0);
    expect(lessonPathToLegacyIndex('unit-1', 'lesson-6')).toBe(5);

    // Unit 2 (6 to 11)
    expect(legacyIndexToLessonPath(6)).toBe('/curriculum/unit-2/lessons/lesson-1');
    expect(legacyIndexToLessonPath(11)).toBe('/curriculum/unit-2/lessons/lesson-6');
    expect(lessonPathToLegacyIndex('unit-2', 'lesson-1')).toBe(6);
    expect(lessonPathToLegacyIndex('unit-2', 'lesson-6')).toBe(11);
  });
});
