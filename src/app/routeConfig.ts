import { APP_ROUTES, RouteMeta } from '../routing/routeTypes';

export const PRIMARY_NAVIGATION_ITEMS: RouteMeta[] = [
  {
    path: APP_ROUTES.HOME,
    labelAr: 'الرئيسية والغلاف',
    category: 'core',
    showInNav: true
  },
  {
    path: APP_ROUTES.CURRICULUM,
    labelAr: 'المنهاج والوحدات',
    category: 'curriculum',
    showInNav: true
  },
  {
    path: '/curriculum/unit-1/lessons/lesson-1',
    labelAr: 'الدروس التفصيلية (18 درساً)',
    category: 'curriculum',
    showInNav: true
  },
  {
    path: APP_ROUTES.TRAINING_SIMULATORS,
    labelAr: 'محاكي الحسابات T',
    category: 'training',
    showInNav: true
  },
  {
    path: APP_ROUTES.TRAINING_JRE,
    labelAr: 'ورشة JRE للتفسير المحاسبي',
    category: 'training',
    showInNav: true
  },
  {
    path: APP_ROUTES.ASSESSMENT_UNIT_TESTS,
    labelAr: 'المراجعة الشاملة',
    category: 'assessment',
    showInNav: true
  },
  {
    path: APP_ROUTES.ASSESSMENT_QBANK,
    labelAr: 'بنك الأسئلة المعتمد',
    category: 'assessment',
    showInNav: true
  },
  {
    path: APP_ROUTES.ASSESSMENT_MOCK_EXAMS,
    labelAr: 'الامتحانات المحاكية الرسمية',
    category: 'assessment',
    showInNav: true
  },
  {
    path: APP_ROUTES.MY_PATH,
    labelAr: 'مسار الإتقان والتعلم التكيفي',
    category: 'my-path',
    showInNav: true
  }
];

export const PROTECTED_ROUTES: RouteMeta[] = [
  {
    path: APP_ROUTES.TEACHER_DASHBOARD,
    labelAr: 'لوحة المعلم والأداء الصفي',
    category: 'admin',
    requiredRoles: ['TEACHER', 'ADMIN'],
    showInNav: false
  },
  {
    path: APP_ROUTES.CONTENT_ANALYTICS,
    labelAr: 'جودة المحتوى وإحصائيات البنك',
    category: 'admin',
    requiredRoles: ['CONTENT_MANAGER', 'ADMIN'],
    showInNav: false
  }
];
