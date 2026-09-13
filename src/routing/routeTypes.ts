import { PlatformRole } from '../types';

export const APP_ROUTES = {
  HOME: '/',
  
  // Curriculum
  CURRICULUM: '/curriculum',
  CURRICULUM_UNIT: '/curriculum/:unitSlug',
  CURRICULUM_LESSONS: '/curriculum/:unitSlug/lessons',
  CURRICULUM_LESSON: '/curriculum/:unitSlug/lessons/:lessonSlug',
  
  // Training
  TRAINING: '/training',
  TRAINING_EXERCISES: '/training/exercises',
  TRAINING_JRE: '/training/jre',
  TRAINING_SIMULATORS: '/training/simulators',
  
  // Assessment
  ASSESSMENT: '/assessment',
  ASSESSMENT_QBANK: '/assessment/question-bank',
  ASSESSMENT_UNIT_TESTS: '/assessment/unit-tests',
  ASSESSMENT_MOCK_EXAMS: '/assessment/mock-exams',
  
  // My Path (Adaptive & Mastery)
  MY_PATH: '/my-path',
  MY_PATH_PROGRESS: '/my-path/progress',
  MY_PATH_MASTERY: '/my-path/mastery',
  MY_PATH_RECOMMENDATIONS: '/my-path/recommendations',
  
  // Role-Protected Dashboards
  TEACHER_DASHBOARD: '/teacher-dashboard',
  CONTENT_ANALYTICS: '/content-analytics',
  
  // Utilities & Fallbacks
  PRINT: '/print',
  UNAUTHORIZED: '/unauthorized',
  NOT_FOUND: '/404'
} as const;

export type AppRouteKey = keyof typeof APP_ROUTES;
export type AppRoutePath = typeof APP_ROUTES[AppRouteKey];

export interface RouteMeta {
  path: string;
  labelAr: string;
  category: 'core' | 'curriculum' | 'training' | 'assessment' | 'my-path' | 'admin';
  requiredRoles?: PlatformRole[];
  showInNav?: boolean;
}

export interface CurriculumRouteParams {
  unitSlug?: string;
  lessonSlug?: string;
}
