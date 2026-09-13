import { describe, it, expect } from 'vitest';
import { APP_ROUTES } from '../routeTypes';
import { 
  normalizeUnitSlug, 
  normalizeLessonSlug, 
  isValidUnitSlug, 
  isValidLessonSlug, 
  getLessonIndexFromSlugs, 
  getSlugsFromLessonIndex,
  buildUnitUrl,
  buildLessonUrl
} from '../routeParams';
import { 
  LEGACY_TAB_TO_PATH, 
  LEGACY_ROUTE_REDIRECTS, 
  pathToLegacyTab,
  legacyUnitToSlug,
  slugToLegacyUnit,
  legacyIndexToLessonPath,
  lessonPathToLegacyIndex
} from '../legacyNavigationAdapter';
import { PRIMARY_NAVIGATION_ITEMS, PROTECTED_ROUTES } from '../../app/routeConfig';
import { curriculumRegistry } from '../../domain/curriculum/CurriculumRegistry';

describe('PHASE 2: Routing Architecture, Slugs & Deep Links Suite', () => {
  
  describe('Gate 2.1: Canonical Route Definitions', () => {
    it('should define all canonical routes for Curriculum, Training, Assessment, My Path, and Dashboards', () => {
      expect(APP_ROUTES.HOME).toBe('/');
      expect(APP_ROUTES.CURRICULUM).toBe('/curriculum');
      expect(APP_ROUTES.CURRICULUM_UNIT).toBe('/curriculum/:unitSlug');
      expect(APP_ROUTES.CURRICULUM_LESSONS).toBe('/curriculum/:unitSlug/lessons');
      expect(APP_ROUTES.CURRICULUM_LESSON).toBe('/curriculum/:unitSlug/lessons/:lessonSlug');
      
      expect(APP_ROUTES.TRAINING).toBe('/training');
      expect(APP_ROUTES.TRAINING_EXERCISES).toBe('/training/exercises');
      expect(APP_ROUTES.TRAINING_JRE).toBe('/training/jre');
      expect(APP_ROUTES.TRAINING_SIMULATORS).toBe('/training/simulators');
      
      expect(APP_ROUTES.ASSESSMENT).toBe('/assessment');
      expect(APP_ROUTES.ASSESSMENT_QBANK).toBe('/assessment/question-bank');
      expect(APP_ROUTES.ASSESSMENT_UNIT_TESTS).toBe('/assessment/unit-tests');
      expect(APP_ROUTES.ASSESSMENT_MOCK_EXAMS).toBe('/assessment/mock-exams');
      
      expect(APP_ROUTES.MY_PATH).toBe('/my-path');
      expect(APP_ROUTES.MY_PATH_PROGRESS).toBe('/my-path/progress');
      expect(APP_ROUTES.MY_PATH_MASTERY).toBe('/my-path/mastery');
      expect(APP_ROUTES.MY_PATH_RECOMMENDATIONS).toBe('/my-path/recommendations');
      
      expect(APP_ROUTES.TEACHER_DASHBOARD).toBe('/teacher-dashboard');
      expect(APP_ROUTES.CONTENT_ANALYTICS).toBe('/content-analytics');
      expect(APP_ROUTES.UNAUTHORIZED).toBe('/unauthorized');
      expect(APP_ROUTES.NOT_FOUND).toBe('/404');
    });
  });

  describe('Gate 2.2: URL Slug Parsing & Normalization', () => {
    it('should correctly normalize unit slugs including leading zeros and aliases', () => {
      expect(normalizeUnitSlug('unit-1')).toBe('unit-1');
      expect(normalizeUnitSlug('unit-01')).toBe('unit-1');
      expect(normalizeUnitSlug('u1')).toBe('unit-1');
      
      expect(normalizeUnitSlug('unit-2')).toBe('unit-2');
      expect(normalizeUnitSlug('unit-02')).toBe('unit-2');
      expect(normalizeUnitSlug('u2')).toBe('unit-2');
      
      expect(normalizeUnitSlug('unit-99')).toBeNull();
      expect(normalizeUnitSlug(undefined)).toBeNull();
      expect(normalizeUnitSlug('')).toBeNull();
    });

    it('should correctly normalize lesson slugs including leading zeros', () => {
      expect(normalizeLessonSlug('lesson-1')).toBe('lesson-1');
      expect(normalizeLessonSlug('lesson-01')).toBe('lesson-1');
      expect(normalizeLessonSlug('lesson-6')).toBe('lesson-6');
      expect(normalizeLessonSlug('lesson-06')).toBe('lesson-6');
      expect(normalizeLessonSlug('u1-lesson-3')).toBe('lesson-3');
      expect(normalizeLessonSlug('u2-lesson-05')).toBe('lesson-5');
      
      expect(normalizeLessonSlug('lesson-7')).toBeNull();
      expect(normalizeLessonSlug('unknown')).toBeNull();
      expect(normalizeLessonSlug(undefined)).toBeNull();
    });

    it('should validate unit and lesson existence against CurriculumRegistry', () => {
      expect(isValidUnitSlug('unit-1')).toBe(true);
      expect(isValidUnitSlug('unit-01')).toBe(true);
      expect(isValidUnitSlug('unit-2')).toBe(true);
      expect(isValidUnitSlug('unit-3')).toBe(true);
      expect(isValidUnitSlug('unit-4')).toBe(true);

      expect(isValidLessonSlug('unit-1', 'lesson-1')).toBe(true);
      expect(isValidLessonSlug('unit-1', 'lesson-6')).toBe(true);
      expect(isValidLessonSlug('unit-2', 'lesson-1')).toBe(true);
      expect(isValidLessonSlug('unit-2', 'lesson-6')).toBe(true);
      
      expect(isValidLessonSlug('unit-1', 'lesson-9')).toBe(false);
      expect(isValidLessonSlug('invalid-unit', 'lesson-1')).toBe(false);
    });

    it('should build canonical unit and lesson URLs', () => {
      expect(buildUnitUrl('unit-1')).toBe('/curriculum/unit-1');
      expect(buildUnitUrl('unit-02')).toBe('/curriculum/unit-2');
      expect(buildLessonUrl('unit-1', 'lesson-03')).toBe('/curriculum/unit-1/lessons/lesson-3');
      expect(buildLessonUrl('unit-2', 'lesson-6')).toBe('/curriculum/unit-2/lessons/lesson-6');
    });
  });

  describe('Gate 2.3: Zero-Based Index Bi-Directional Mapping (0..11)', () => {
    it('should convert unit and lesson slugs to exact zero-based global index', () => {
      // Unit 1 (0..5)
      expect(getLessonIndexFromSlugs('unit-1', 'lesson-1')).toBe(0);
      expect(getLessonIndexFromSlugs('unit-1', 'lesson-2')).toBe(1);
      expect(getLessonIndexFromSlugs('unit-1', 'lesson-3')).toBe(2);
      expect(getLessonIndexFromSlugs('unit-1', 'lesson-4')).toBe(3);
      expect(getLessonIndexFromSlugs('unit-1', 'lesson-5')).toBe(4);
      expect(getLessonIndexFromSlugs('unit-1', 'lesson-6')).toBe(5);

      // Unit 2 (6..11)
      expect(getLessonIndexFromSlugs('unit-2', 'lesson-1')).toBe(6);
      expect(getLessonIndexFromSlugs('unit-2', 'lesson-2')).toBe(7);
      expect(getLessonIndexFromSlugs('unit-2', 'lesson-3')).toBe(8);
      expect(getLessonIndexFromSlugs('unit-2', 'lesson-4')).toBe(9);
      expect(getLessonIndexFromSlugs('unit-2', 'lesson-5')).toBe(10);
      expect(getLessonIndexFromSlugs('unit-2', 'lesson-6')).toBe(11);
    });

    it('should convert zero-based global index to canonical unit and lesson slugs', () => {
      expect(getSlugsFromLessonIndex(0)).toEqual({ unitSlug: 'unit-1', lessonSlug: 'lesson-1' });
      expect(getSlugsFromLessonIndex(5)).toEqual({ unitSlug: 'unit-1', lessonSlug: 'lesson-6' });
      expect(getSlugsFromLessonIndex(6)).toEqual({ unitSlug: 'unit-2', lessonSlug: 'lesson-1' });
      expect(getSlugsFromLessonIndex(11)).toEqual({ unitSlug: 'unit-2', lessonSlug: 'lesson-6' });
    });

    it('should handle boundary and out-of-range indices gracefully', () => {
      expect(getSlugsFromLessonIndex(-5)).toEqual({ unitSlug: 'unit-1', lessonSlug: 'lesson-1' });
      expect(getSlugsFromLessonIndex(99)).toEqual({ unitSlug: 'unit-4', lessonSlug: 'lesson-6' });
    });
  });

  describe('Gate 2.4: Legacy Navigation Adapter & Backward Compatibility', () => {
    it('should map all legacy tabs to their respective modern hierarchical paths', () => {
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

    it('should reverse-derive active tab from URL path', () => {
      expect(pathToLegacyTab('/')).toBe('cover');
      expect(pathToLegacyTab('/curriculum')).toBe('welcome');
      expect(pathToLegacyTab('/curriculum/unit-1')).toBe('map');
      expect(pathToLegacyTab('/curriculum/unit-2')).toBe('map');
      expect(pathToLegacyTab('/curriculum/unit-1/lessons/lesson-3')).toBe('lessons');
      expect(pathToLegacyTab('/training/simulators')).toBe('simulator');
      expect(pathToLegacyTab('/training/jre')).toBe('jre_workshop');
      expect(pathToLegacyTab('/assessment/question-bank')).toBe('qbank');
      expect(pathToLegacyTab('/assessment/unit-tests')).toBe('review');
      expect(pathToLegacyTab('/assessment/mock-exams')).toBe('exams');
      expect(pathToLegacyTab('/print')).toBe('print');
    });

    it('should provide complete legacy path redirects dictionary', () => {
      expect(LEGACY_ROUTE_REDIRECTS['/welcome']).toBe('/curriculum');
      expect(LEGACY_ROUTE_REDIRECTS['/map']).toBe('/curriculum/unit-1');
      expect(LEGACY_ROUTE_REDIRECTS['/lessons']).toBe('/curriculum/unit-1/lessons/lesson-1');
      expect(LEGACY_ROUTE_REDIRECTS['/simulator']).toBe('/training/simulators');
      expect(LEGACY_ROUTE_REDIRECTS['/jre']).toBe('/training/jre');
      expect(LEGACY_ROUTE_REDIRECTS['/review']).toBe('/assessment/unit-tests');
      expect(LEGACY_ROUTE_REDIRECTS['/qbank']).toBe('/assessment/question-bank');
      expect(LEGACY_ROUTE_REDIRECTS['/exams']).toBe('/assessment/mock-exams');
    });

    it('should convert between legacy unit identifiers and canonical slugs', () => {
      expect(legacyUnitToSlug('unit-1')).toBe('unit-1');
      expect(legacyUnitToSlug('unit-2')).toBe('unit-2');
      expect(slugToLegacyUnit('unit-1')).toBe('unit-1');
      expect(slugToLegacyUnit('unit-2')).toBe('unit-2');
    });

    it('should translate legacy lesson index to modern URL and vice-versa', () => {
      expect(legacyIndexToLessonPath(0)).toBe('/curriculum/unit-1/lessons/lesson-1');
      expect(legacyIndexToLessonPath(8)).toBe('/curriculum/unit-2/lessons/lesson-3');
      expect(lessonPathToLegacyIndex('unit-2', 'lesson-3')).toBe(8);
    });
  });

  describe('Gate 2.5: Deep Linking & Curriculum Content Resolution', () => {
    it('should resolve every lesson in both units from slugs through CurriculumRegistry', () => {
      const units = curriculumRegistry.getUnits();
      expect(units.length).toBe(2);

      units.forEach(unit => {
        expect(unit.lessons.length).toBe(6);

        unit.lessons.forEach(lesson => {
          const resolved = curriculumRegistry.getLessonBySlug(unit.id, lesson.id);
          expect(resolved).toBeDefined();
          expect(resolved?.id).toBe(lesson.id);

          const legacyContent = curriculumRegistry.getLegacyLessonContent(unit.id, lesson.id);
          expect(legacyContent).toBeDefined();
          expect(legacyContent?.title).toBeTruthy();
        });
      });
    });

    it('should guarantee question IDs are accessible for every unit and lesson', () => {
      const u1Questions = curriculumRegistry.getQuestionIds('unit-1');
      const u2Questions = curriculumRegistry.getQuestionIds('unit-2');
      
      expect(u1Questions.length).toBeGreaterThan(0);
      expect(u2Questions.length).toBeGreaterThan(0);

      // Total across curriculum
      const totalCurriculumQuestions = u1Questions.length + u2Questions.length;
      expect(totalCurriculumQuestions).toBeGreaterThanOrEqual(130);
    });
  });

  describe('Gate 2.6: Route Configuration & Role-Protection Meta', () => {
    it('should define primary navigation items with Arabic labels and valid paths', () => {
      expect(PRIMARY_NAVIGATION_ITEMS.length).toBeGreaterThan(5);
      PRIMARY_NAVIGATION_ITEMS.forEach(item => {
        expect(item.path).toBeTruthy();
        expect(item.labelAr).toBeTruthy();
        expect(item.category).toBeTruthy();
      });
    });

    it('should enforce role protection metadata on administrative dashboards', () => {
      const teacherRoute = PROTECTED_ROUTES.find(r => r.path === APP_ROUTES.TEACHER_DASHBOARD);
      expect(teacherRoute).toBeDefined();
      expect(teacherRoute?.requiredRoles).toContain('TEACHER');
      expect(teacherRoute?.requiredRoles).toContain('ADMIN');

      const contentRoute = PROTECTED_ROUTES.find(r => r.path === APP_ROUTES.CONTENT_ANALYTICS);
      expect(contentRoute).toBeDefined();
      expect(contentRoute?.requiredRoles).toContain('CONTENT_MANAGER');
      expect(contentRoute?.requiredRoles).toContain('ADMIN');
    });
  });

});
