import express from 'express';
import path from 'path';
import rateLimit from 'express-rate-limit';
import { createServer as createViteServer } from 'vite';

import { db } from './src/server/db/database';

// Import auth and modules
import { 
  handleLogin, 
  handleRegister, 
  handleRefreshToken, 
  handleLogout, 
  handleGetMe, 
  handleListUsers,
  handleAdminCreateUser,
  handleAdminUpdateUserRole
} from './src/server/modules/auth';
import { handleGetLessons, handleGetLessonById } from './src/server/modules/lessons';
import { handleGetQuestions, handleGetQuestionById } from './src/server/modules/questions';
import { handleGetExams, handleGetExamById, handleSubmitExam } from './src/server/modules/exams';
import { handleRecordQuestionAttempt, handleGetStudentProgress } from './src/server/modules/progress';
import { handleGetAdaptivePath } from './src/server/modules/adaptive';
import { handleGetTeacherAnalytics, handleGetContentAnalytics } from './src/server/modules/analytics';
import { handleEvaluateJreEssay } from './src/server/modules/ai';
import { authenticate, requireRole } from './src/server/middleware/authMiddleware';
import { runFullPsychometricSuite } from './src/domain/__tests__/psychometricValidation';
import { runAppliedGradingTests } from './src/domain/__tests__/appliedGradingValidation';
import { runP0ProductionSuite } from './src/server/__tests__/p0_production_suite';
import { verifiedAssessmentRegistry } from './src/domain/assessment/registry/VerifiedAssessmentRegistry';
import { sourceSnapshotRegistry } from './src/domain/assessment/registry/SourceSnapshotRegistry';
import { masterIntegrityAuditEngine } from './src/domain/assessment/audit/MasterIntegrityAuditEngine';
import { authoritativeGradingEngine } from './src/domain/assessment/grading/AuthoritativeGradingEngine';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Trust proxy for reverse proxy environments (e.g. Cloud Run, Nginx)
  app.set('trust proxy', 1);

  // Middleware: Security headers, CORS & Body parsing
  app.use(express.json({ limit: '5mb' }));
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
      return res.sendStatus(204);
    }
    next();
  });

  // Login Rate Limiter (Prevent Brute Force)
  const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per IP per window
    standardHeaders: true,
    legacyHeaders: false,
    validate: {
      xForwardedForHeader: false,
      forwardedHeader: false,
      trustProxy: false
    },
    message: {
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'تم تجاوز الحد المسموح به لمحاولات تسجيل الدخول. يرجى المحاولة بعد قليل.'
      }
    }
  });

  // Logging
  app.use((req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/health')) {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    }
    next();
  });

  // 1. Health & Readiness Endpoints
  const getHealthHandler = (req: express.Request, res: express.Response) => {
    const isDbReady = db.isReady();
    res.status(isDbReady ? 200 : 503).json({
      status: isDbReady ? 'ok' : 'degraded',
      version: '2.0.0',
      service: 'eb-accounting-platform',
      database: {
        ready: isDbReady,
        driver: 'atomic-persistent-disk-engine',
        usersCount: db.users.length,
        lessonsCount: db.lessons.length,
        questionsCount: db.questions.length,
        attemptsCount: db.questionAttempts.length + db.examAttempts.length
      },
      timestamp: new Date().toISOString()
    });
  };

  app.get('/health', getHealthHandler);
  app.get('/api/health', getHealthHandler);

  app.get('/ready', (req, res) => {
    const isDbReady = db.isReady();
    if (!isDbReady) {
      return res.status(503).json({
        status: 'not_ready',
        error: 'Database initialization pending or persistent file unreadable',
        timestamp: new Date().toISOString()
      });
    }
    res.json({
      status: 'ready',
      database: 'connected',
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString()
    });
  });

  // 2. OpenAPI / API Documentation Route
  app.get('/api/docs', (req, res) => {
    res.json({
      openapi: '3.0.0',
      info: {
        title: 'EB Accounting Production API v2.0',
        version: '2.0.0',
        description: 'REST API for Egyptian Baccalaureate Financial Accounting & Business Platform'
      },
      paths: {
        '/health': { get: { summary: 'System Health Check' } },
        '/ready': { get: { summary: 'Kubernetes Readiness Probe' } },
        '/api/auth/register': { post: { summary: 'Register new student account' } },
        '/api/auth/login': { post: { summary: 'User login with bcrypt & JWT' } },
        '/api/auth/refresh': { post: { summary: 'Refresh JWT Access Token' } },
        '/api/auth/logout': { post: { summary: 'Invalidate refresh token session' } },
        '/api/auth/me': { get: { summary: 'Current authenticated user profile' } },
        '/api/auth/users': { get: { summary: 'List platform users (Admin/Teacher)' } },
        '/api/lessons': { get: { summary: 'List all published curriculum lessons' } },
        '/api/lessons/{id}': { get: { summary: 'Get lesson details' } },
        '/api/questions': { get: { summary: 'Query question bank items' } },
        '/api/exams': { get: { summary: 'List examination papers' } },
        '/api/exams/submit': { post: { summary: 'Submit exam answers & calculate score' } },
        '/api/progress/attempt': { post: { summary: 'Record question attempt' } },
        '/api/progress/student': { get: { summary: 'Get canonical student mastery & progress' } },
        '/api/adaptive/path': { get: { summary: 'Get adaptive remedial path' } },
        '/api/analytics/teacher': { get: { summary: 'Teacher dashboard metrics' } },
        '/api/analytics/content': { get: { summary: 'Content manager quality metrics' } },
        '/api/ai/evaluate-jre': { post: { summary: 'Evaluate JRE essay with canonical 20-point Rubric' } }
      }
    });
  });

  // 3. Auth Routes
  app.post('/api/auth/register', handleRegister);
  app.post('/api/auth/login', loginLimiter, handleLogin);
  app.post('/api/auth/refresh', handleRefreshToken);
  app.post('/api/auth/logout', handleLogout);
  app.get('/api/auth/me', authenticate, handleGetMe);
  app.get('/api/auth/users', authenticate, requireRole('ADMIN', 'TEACHER'), handleListUsers);
  app.post('/api/admin/users', authenticate, requireRole('ADMIN'), handleAdminCreateUser);
  app.patch('/api/admin/users/:id/role', authenticate, requireRole('ADMIN'), handleAdminUpdateUserRole);

  // 4. Content Routes
  app.get('/api/lessons', handleGetLessons);
  app.get('/api/lessons/:id', handleGetLessonById);
  app.get('/api/questions', handleGetQuestions);
  app.get('/api/questions/:id', handleGetQuestionById);
  app.get('/api/exams', handleGetExams);
  app.get('/api/exams/:id', handleGetExamById);
  app.post('/api/exams/submit', authenticate, handleSubmitExam);

  // 5. Progress, Analytics & Adaptive (Strictly Protected)
  app.post('/api/progress/attempt', authenticate, handleRecordQuestionAttempt);
  app.get('/api/progress/student', authenticate, handleGetStudentProgress);
  app.get('/api/progress/me', authenticate, handleGetStudentProgress);
  app.get('/api/adaptive/path', authenticate, handleGetAdaptivePath);
  app.get('/api/analytics/teacher', authenticate, requireRole('TEACHER', 'ADMIN'), handleGetTeacherAnalytics);
  app.get('/api/analytics/content', authenticate, requireRole('CONTENT_MANAGER', 'ADMIN'), handleGetContentAnalytics);
  app.post('/api/ai/evaluate-jre', authenticate, handleEvaluateJreEssay);

  // 6. Verified Assessment Registry & Sources
  app.get('/api/registry/sources', (req, res) => {
    res.json({
      success: true,
      sources: sourceSnapshotRegistry.getAllSnapshots()
    });
  });

  app.get('/api/registry/assessments', (req, res) => {
    const { lessonId } = req.query;
    const items = verifiedAssessmentRegistry.getStudentSafeAssessments(lessonId as string | undefined);
    res.json({
      success: true,
      total: items.length,
      assessments: items
    });
  });

  app.get('/api/registry/assessments/:id', (req, res) => {
    const item = verifiedAssessmentRegistry.getStudentSafeAssessmentById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, error: 'Assessment not found in registry' });
    }
    res.json({
      success: true,
      assessment: item
    });
  });

  // 7. Automated Audit / Regression Test Endpoints
  app.get('/api/audit/master-integrity', (req, res) => {
    const report = masterIntegrityAuditEngine.runMasterAudit();
    res.json(report);
  });

  app.get('/api/audit/p0-production-suite', async (req, res) => {
    const suiteRes = await runP0ProductionSuite();
    res.json(suiteRes);
  });

  app.get('/api/audit/psychometric-suite', (req, res) => {
    const testResults = runFullPsychometricSuite();
    const allPassed = testResults.every(t => t.passed);
    res.json({
      success: allPassed,
      totalTests: testResults.length,
      passedTests: testResults.filter(t => t.passed).length,
      tests: testResults
    });
  });

  app.get('/api/audit/applied-grading-suite', (req, res) => {
    const suiteRes = runAppliedGradingTests();
    res.json(suiteRes);
  });

  // 7. Vite / Static serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Production v2.0] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
