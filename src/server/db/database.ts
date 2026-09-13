import fs from 'fs';
import path from 'path';
import { 
  DbUser, DbSubject, DbCourse, DbUnit, DbLesson, DbLearningObjective,
  DbQuestion, DbQuestionOption, DbQuestionTag, DbExam, 
  DbStudentLessonProgress, DbStudentQuestionAttempt, 
  DbStudentExamAttempt, DbStudentMasterySnapshot, DbAdaptiveRecommendation,
  DbRefreshToken, DbAuditLog
} from './schema';
import { allLessons } from '../../data/lessonsData';
import { comprehensiveExams } from '../../data/examsData';
import { expandedQuestionBank } from '../../data/expandedQuestionBank';
import { hashPasswordSync } from '../auth/password';
import { studentMasteryEngine } from '../../domain/analytics/StudentMasteryEngine';
import { adaptiveRemediationEngine } from '../../domain/adaptive/AdaptiveRemediationEngine';
import { curriculumRegistry } from '../../domain/curriculum/CurriculumRegistry';

export interface DatabaseData {
  users: DbUser[];
  refreshTokens: DbRefreshToken[];
  subjects: DbSubject[];
  courses: DbCourse[];
  units: DbUnit[];
  lessons: DbLesson[];
  learningObjectives: DbLearningObjective[];
  questions: DbQuestion[];
  questionOptions: DbQuestionOption[];
  questionTags: DbQuestionTag[];
  exams: DbExam[];
  lessonProgress: DbStudentLessonProgress[];
  questionAttempts: DbStudentQuestionAttempt[];
  examAttempts: DbStudentExamAttempt[];
  masterySnapshots: DbStudentMasterySnapshot[];
  recommendations: DbAdaptiveRecommendation[];
  auditLogs: DbAuditLog[];
  meta: {
    version: string;
    lastPersisted: string;
    driver: string;
    schemaVersion: number;
  };
}

export class PersistentProductionDatabase {
  public users: DbUser[] = [];
  public refreshTokens: DbRefreshToken[] = [];
  public subjects: DbSubject[] = [];
  public courses: DbCourse[] = [];
  public units: DbUnit[] = [];
  public lessons: DbLesson[] = [];
  public learningObjectives: DbLearningObjective[] = [];
  public questions: DbQuestion[] = [];
  public questionOptions: DbQuestionOption[] = [];
  public questionTags: DbQuestionTag[] = [];
  public exams: DbExam[] = [];
  
  public lessonProgress: DbStudentLessonProgress[] = [];
  public questionAttempts: DbStudentQuestionAttempt[] = [];
  public examAttempts: DbStudentExamAttempt[] = [];
  public masterySnapshots: DbStudentMasterySnapshot[] = [];
  public recommendations: DbAdaptiveRecommendation[] = [];
  public auditLogs: DbAuditLog[] = [];

  private filePath: string;
  private backupDir: string;
  private readonly MAX_BACKUPS: number = 10;
  private inTransaction: boolean = false;
  private transactionSnapshot: DatabaseData | null = null;
  private initialized: boolean = false;

  constructor(customDbPath?: string) {
    const baseDir = process.cwd();
    this.filePath = customDbPath || path.join(baseDir, 'data', 'eb_accounting_database.json');
    this.backupDir = path.join(path.dirname(this.filePath), 'backups');
    this.initialize();
  }

  public getDbPath(): string {
    return this.filePath;
  }

  public isReady(): boolean {
    return this.initialized && fs.existsSync(this.filePath);
  }

  private ensureDirectories() {
    const dir = path.dirname(this.filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }
  }

  private initialize() {
    this.ensureDirectories();

    if (fs.existsSync(this.filePath)) {
      try {
        this.loadFromDisk();
        this.createBackup('startup');
        this.initialized = true;
        console.log(`[Database] Loaded from persistent storage: ${this.users.length} Users, ${this.lessons.length} Lessons, ${this.questions.length} Questions, ${this.questionAttempts.length} Attempts.`);
        return;
      } catch (err) {
        console.error(`[Database] Error loading database file, re-initializing with seed:`, err);
      }
    }

    // Seed baseline
    this.seed(true);
    this.persist();
    this.createBackup('initial-seed');
    this.initialized = true;
    console.log(`[Database] Initialized and persisted new database to ${this.filePath}`);
  }

  public createBackup(tag: string = 'manual'): string {
    try {
      this.ensureDirectories();
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupFile = path.join(this.backupDir, `backup-${tag}-${timestamp}.json`);
      const state = this.serializeState();
      fs.writeFileSync(backupFile, JSON.stringify(state, null, 2), 'utf8');
      this.rotateBackups();
      return backupFile;
    } catch (e) {
      console.error('[Database] Failed to create backup:', e);
      return '';
    }
  }

  private rotateBackups(): void {
    try {
      if (!fs.existsSync(this.backupDir)) return;

      const entries = fs.readdirSync(this.backupDir)
        .filter(name => name.endsWith('.json') && name.startsWith('backup-'))
        .map(name => {
          const fullPath = path.join(this.backupDir, name);
          try {
            const stat = fs.statSync(fullPath);
            return { name, fullPath, mtimeMs: stat.mtimeMs };
          } catch {
            return { name, fullPath, mtimeMs: 0 };
          }
        })
        .sort((a, b) => b.mtimeMs - a.mtimeMs);

      if (entries.length > this.MAX_BACKUPS) {
        const excess = entries.slice(this.MAX_BACKUPS);
        for (const item of excess) {
          try {
            if (fs.existsSync(item.fullPath)) {
              fs.unlinkSync(item.fullPath);
            }
          } catch (err) {
            console.warn(`[Database] Failed to prune excess backup ${item.name}:`, err);
          }
        }
      }
    } catch (err) {
      console.warn('[Database] Failed to rotate backups:', err);
    }
  }

  public loadFromDisk() {
    if (!fs.existsSync(this.filePath)) {
      throw new Error(`Database file not found at ${this.filePath}`);
    }

    const raw = fs.readFileSync(this.filePath, 'utf8');
    const data: DatabaseData = JSON.parse(raw);

    this.users = data.users || [];
    this.refreshTokens = data.refreshTokens || [];
    this.subjects = data.subjects || [];
    this.courses = data.courses || [];
    this.units = data.units || [];
    this.lessons = data.lessons || [];
    this.learningObjectives = data.learningObjectives || [];
    this.questions = data.questions || [];
    this.questionOptions = data.questionOptions || [];
    this.questionTags = data.questionTags || [];
    this.exams = data.exams || [];
    this.lessonProgress = data.lessonProgress || [];
    this.questionAttempts = data.questionAttempts || [];
    this.examAttempts = data.examAttempts || [];
    this.masterySnapshots = data.masterySnapshots || [];
    this.recommendations = data.recommendations || [];
    this.auditLogs = data.auditLogs || [];

    // Ensure Unit 2 questions are properly tagged and mapped
    let updatedU2 = false;
    this.questions.forEach(q => {
      const isU2 = q.id.startsWith('eb2-') || (q.lesson_id?.startsWith('u2-') ?? false);
      if (isU2) {
        if (q.unit_id !== 'unit-2') {
          q.unit_id = 'unit-2';
          updatedU2 = true;
        }
        if (q.status === 'UNMAPPED' || q.learning_objective_id === 'UNMAPPED') {
          const lessonMatch = q.lesson_id?.match(/u2-lesson-(\d)/);
          const loNum = lessonMatch ? lessonMatch[1] : '1';
          q.learning_objective_id = `LO-2.${loNum}`;
          q.status = 'ACTIVE';
          updatedU2 = true;
        }
      }
    });
    if (updatedU2) {
      this.persist();
    }
  }

  private serializeState(): DatabaseData {
    return {
      users: this.users,
      refreshTokens: this.refreshTokens,
      subjects: this.subjects,
      courses: this.courses,
      units: this.units,
      lessons: this.lessons,
      learningObjectives: this.learningObjectives,
      questions: this.questions,
      questionOptions: this.questionOptions,
      questionTags: this.questionTags,
      exams: this.exams,
      lessonProgress: this.lessonProgress,
      questionAttempts: this.questionAttempts,
      examAttempts: this.examAttempts,
      masterySnapshots: this.masterySnapshots,
      recommendations: this.recommendations,
      auditLogs: this.auditLogs,
      meta: {
        version: '2.0.0',
        lastPersisted: new Date().toISOString(),
        driver: 'atomic-persistent-disk-engine',
        schemaVersion: 1
      }
    };
  }

  public persist() {
    if (this.inTransaction) {
      // Defer disk write until commit
      return;
    }

    this.ensureDirectories();
    const state = this.serializeState();
    const jsonStr = JSON.stringify(state, null, 2);
    const tmpPath = `${this.filePath}.tmp`;

    // Atomic write pattern: write to .tmp then atomic renameSync
    fs.writeFileSync(tmpPath, jsonStr, 'utf8');
    fs.renameSync(tmpPath, this.filePath);
  }

  // --- Transaction Management ---

  public beginTransaction() {
    if (this.inTransaction) {
      throw new Error('Transaction already in progress');
    }
    this.inTransaction = true;
    this.transactionSnapshot = JSON.parse(JSON.stringify(this.serializeState()));
  }

  public commit() {
    if (!this.inTransaction) {
      throw new Error('No transaction in progress to commit');
    }
    this.inTransaction = false;
    this.transactionSnapshot = null;
    this.persist();
  }

  public rollback() {
    if (!this.inTransaction || !this.transactionSnapshot) {
      throw new Error('No transaction in progress to rollback');
    }
    const data = this.transactionSnapshot;
    this.users = data.users || [];
    this.refreshTokens = data.refreshTokens || [];
    this.subjects = data.subjects || [];
    this.courses = data.courses || [];
    this.units = data.units || [];
    this.lessons = data.lessons || [];
    this.learningObjectives = data.learningObjectives || [];
    this.questions = data.questions || [];
    this.questionOptions = data.questionOptions || [];
    this.questionTags = data.questionTags || [];
    this.exams = data.exams || [];
    this.lessonProgress = data.lessonProgress || [];
    this.questionAttempts = data.questionAttempts || [];
    this.examAttempts = data.examAttempts || [];
    this.masterySnapshots = data.masterySnapshots || [];
    this.recommendations = data.recommendations || [];
    this.auditLogs = data.auditLogs || [];

    this.inTransaction = false;
    this.transactionSnapshot = null;
  }

  public async runInTransaction<T>(operation: () => Promise<T> | T): Promise<T> {
    this.beginTransaction();
    try {
      const result = await operation();
      this.commit();
      return result;
    } catch (error) {
      this.rollback();
      throw error;
    }
  }

  // --- Audit Logging ---

  public recordAuditLog(log: Omit<DbAuditLog, 'id' | 'timestamp'>): DbAuditLog {
    const newLog: DbAuditLog = {
      ...log,
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString()
    };
    this.auditLogs.push(newLog);
    this.persist();
    return newLog;
  }

  public getAuditLogs(filters?: { actor_id?: string; resource?: string; action?: string }): DbAuditLog[] {
    return this.auditLogs.filter(l => {
      if (filters?.actor_id && l.actor_id !== filters.actor_id) return false;
      if (filters?.resource && l.resource !== filters.resource) return false;
      if (filters?.action && l.action !== filters.action) return false;
      return true;
    });
  }

  // --- Idempotent Seed ---

  public seed(forceFresh: boolean = false) {
    const now = new Date().toISOString();
    const standardPasswordHash = hashPasswordSync('Password123!');

    const baseUsers: DbUser[] = [
      {
        id: 'usr-student-1',
        email: 'student@eb.edu.eg',
        password_hash: standardPasswordHash,
        first_name: 'أحمد',
        last_name: 'محمود',
        full_name: 'أحمد محمود (طالب EB)',
        role: 'STUDENT',
        status: 'ACTIVE',
        created_at: now,
        updated_at: now
      },
      {
        id: 'usr-teacher-1',
        email: 'teacher@eb.edu.eg',
        password_hash: standardPasswordHash,
        first_name: 'خالد',
        last_name: 'عبد الرحمن',
        full_name: 'د. خالد عبد الرحمن (معلم خبير)',
        role: 'TEACHER',
        status: 'ACTIVE',
        created_at: now,
        updated_at: now
      },
      {
        id: 'usr-content-1',
        email: 'content@eb.edu.eg',
        password_hash: standardPasswordHash,
        first_name: 'محمود',
        last_name: 'العربي',
        full_name: 'أستاذ المحتوى الأكاديمي',
        role: 'CONTENT_MANAGER',
        status: 'ACTIVE',
        created_at: now,
        updated_at: now
      },
      {
        id: 'usr-admin-1',
        email: 'admin@eb.edu.eg',
        password_hash: standardPasswordHash,
        first_name: 'مدير',
        last_name: 'المنظومة',
        full_name: 'مدير المنظومة التعليمية',
        role: 'ADMIN',
        status: 'ACTIVE',
        created_at: now,
        updated_at: now
      }
    ];

    if (forceFresh || this.users.length === 0) {
      this.users = baseUsers;
    } else {
      // Idempotently merge base users without overwriting custom users
      baseUsers.forEach(bu => {
        const existing = this.users.find(u => u.email.toLowerCase() === bu.email.toLowerCase() || u.id === bu.id);
        if (!existing) {
          this.users.push(bu);
        }
      });
    }

    // 2. Seed Subjects, Courses, Units
    // 2. Seed Subjects, Courses, Units from CurriculumRegistry
    this.subjects = [
      {
        id: 'subj-acc-1',
        name: 'المحاسبة المالية وإتقان الأعمال',
        slug: 'financial-accounting',
        description: 'منهاج المحاسبة المعتمد لشهادة البكالوريا المصرية (EB)',
        status: 'ACTIVE'
      }
    ];

    this.courses = [
      {
        id: 'course-eb-acc-g10',
        subject_id: 'subj-acc-1',
        title: 'محاسبة الصف العاشر (البكالوريا المصرية)',
        code: 'EB-ACC-101',
        description: 'الأسس النظرية والتطبيقية للمحاسبة المالية، معادلة الميزانية، وقيود اليومية'
      }
    ];

    const allCanonicalUnits = curriculumRegistry.getUnits();

    this.units = allCanonicalUnits.map(u => ({
        id: u.id,
        subject_id: 'subj-acc-1',
        title: u.titleAr,
        unit_number: u.unitNumber,
        description: u.descriptionAr,
        order_index: u.unitNumber
    }));

    // 3. Seed Lessons & Learning Objectives
    this.lessons = [];
    this.learningObjectives = [];

    // allLessons imported at top
    // We match by lessonNumber and unit fallback, but we should make sure unitId is assigned properly.
    
    // We map allLessons to units based on their prefix or index if unitId is missing.
    // In our case unit1Lessons are first 6, unit2Lessons are next 6 in allLessons.
    let indexCount = 0;
    for (const l of allLessons) {
      const isU2 = l.id.startsWith('u2-');
      const unitId = isU2 ? 'unit-2' : 'unit-1';
      
      // Attempt to normalize lesson slug
      const slug = isU2 ? `unit-02/lesson-0${l.lessonNumber}` : `unit-01/lesson-0${l.lessonNumber}`;

      this.lessons.push({
        id: l.id,
        unit_id: unitId,
        title: l.title,
        lesson_number: l.lessonNumber,
        slug: slug,
        content: l,
        learning_objectives: l.whatYouWillLearn || [],
        difficulty: indexCount < 2 ? 'basic' : indexCount < 4 ? 'intermediate' : 'advanced',
        order_index: l.lessonNumber,
        status: 'PUBLISHED'
      });
      indexCount++;
    }

    allCanonicalUnits.forEach(u => {
      u.lessons.forEach(l => {
        l.objectives.forEach(obj => {
          this.learningObjectives.push({
            id: obj.id,
            lesson_id: l.id, // note: l.id is canonical, e.g. 'lesson-1'. We might need to map it back if questions use it?
            code: obj.code,
            description_ar: obj.titleAr,
            taxonomy_level: obj.taxonomy,
            blooms_level: obj.taxonomy
          });
        });
      });
    });

    const loAliasMap: Record<string, string> = {
      'obj-1-1': 'LO-1.1',
      'obj-1-2': 'LO-1.2',
      'obj-2-1': 'LO-2.1',
      'obj-2-2': 'LO-2.2',
      'obj-2-3': 'LO-2.3',
      'obj-2-4': 'LO-2.4',
      'obj-2-5': 'LO-2.5',
      'obj-2-6': 'LO-2.6',
      'obj-3-1': 'LO-3.1',
      'obj-3-2': 'LO-3.2',
      'obj-4-1': 'LO-4.1',
      'obj-4-2': 'LO-4.2',
      'obj-5-1': 'LO-5.1',
      'obj-5-2': 'LO-5.2',
      'obj-6-1': 'LO-6.1'
    };

    const validObjectiveIds = new Set([
      ...this.learningObjectives.map(o => o.id),
      ...Object.values(loAliasMap)
    ]);
    const validLessonIds = new Set(this.lessons.map(l => l.id));

    this.questions = [];
    this.questionOptions = [];
    this.questionTags = [];

    expandedQuestionBank.forEach((q) => {
      const qTypeMap: Record<string, any> = {
        mcq: 'MCQ',
        true_false: 'TRUE_FALSE',
        fill_blank: 'FILL_BLANK',
        concept: 'SHORT_ANSWER',
        applied: 'NUMERICAL',
        case: 'CASE_STUDY',
        analytical: 'SHORT_ANSWER',
        jre: 'JRE',
        t_account: 'T_ACCOUNT'
      };

      const isU2 = q.id.startsWith('eb2-') || (q.lessonId?.startsWith('u2-') ?? false);
      const normalizedLoId = q.learningObjectiveId ? (loAliasMap[q.learningObjectiveId] || q.learningObjectiveId) : null;
      const hasValidLo = normalizedLoId && validObjectiveIds.has(normalizedLoId);
      const isUnmapped = !hasValidLo;
      const questionStatus = isUnmapped ? 'UNMAPPED' : 'ACTIVE';

      const dbQ: DbQuestion = {
        id: q.id,
        lesson_id: validLessonIds.has(q.lessonId) ? q.lessonId : (isU2 ? 'u2-lesson-1' : 'lesson-1'),
        unit_id: isU2 ? 'unit-2' : 'unit-1',
        type: qTypeMap[q.questionType] || 'MCQ',
        difficulty: q.difficulty || 'basic',
        content: q.question,
        explanation: q.explanation || '',
        learning_objective_id: isUnmapped ? 'UNMAPPED' : normalizedLoId!,
        concept: q.concept || 'مفاهيم عامة',
        source_document: q.sourceMapping?.source_document || 'كتاب الوزارة',
        source_page: q.sourceMapping?.source_page || 1,
        status: questionStatus,
        created_at: now,
        updated_at: now
      };
      this.questions.push(dbQ);

      if (q.options && Array.isArray(q.options)) {
        q.options.forEach((optText, optIdx) => {
          this.questionOptions.push({
            id: `opt-${q.id}-${optIdx}`,
            question_id: q.id,
            content: optText,
            is_correct: optText === q.correctAnswer,
            order_index: optIdx + 1
          });
        });
      }

      if (q.tags && Array.isArray(q.tags)) {
        q.tags.forEach(t => {
          this.questionTags.push({
            id: `tag-${q.id}-${t}`,
            question_id: q.id,
            tag: t
          });
        });
      }
    });

    this.exams = comprehensiveExams.map(e => ({
      id: e.id,
      title: e.title,
      subtitle: e.subtitle,
      time_allowed_minutes: e.timeAllowedMinutes,
      total_marks: e.totalMarks,
      instructions: e.instructions,
      sections: e.sections
    }));

    if (forceFresh || this.lessonProgress.length === 0) {
      this.lessonProgress = [
        {
          id: 'lp-init-1',
          user_id: 'usr-student-1',
          lesson_id: 'lesson-1',
          completed: true,
          score: 92,
          time_spent_seconds: 1420,
          last_accessed_at: now
        }
      ];
    }

    if (forceFresh || this.questionAttempts.length === 0) {
      this.questionAttempts = [
        {
          id: 'att-seed-1',
          user_id: 'usr-student-1',
          question_id: 'e1-q1',
          lesson_id: 'lesson-1',
          user_answer: 'أداة للقياس والتبويب وتوصيل المعلومات لمتخذي القرارات',
          is_correct: true,
          score: 2,
          max_score: 2,
          time_spent_seconds: 25,
          attempt_number: 1,
          difficulty: 'basic',
          timestamp: now
        },
        {
          id: 'att-seed-2',
          user_id: 'usr-student-1',
          question_id: 'e1-q2',
          lesson_id: 'lesson-2',
          user_answer: '210000',
          is_correct: true,
          score: 2,
          max_score: 2,
          time_spent_seconds: 35,
          attempt_number: 1,
          difficulty: 'intermediate',
          timestamp: now
        }
      ];
    }

    this.recalculateAndSaveMasterySnapshot('usr-student-1');
  }

  // --- Canonical User Methods ---

  public findUserByEmail(email: string): DbUser | undefined {
    return this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  public findUserById(id: string): DbUser | undefined {
    return this.users.find(u => u.id === id);
  }

  public createUser(data: {
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    role?: DbUser['role'];
  }): DbUser {
    const existing = this.findUserByEmail(data.email);
    if (existing) {
      throw new Error('البريد الإلكتروني مسجل بالفعل');
    }

    const now = new Date().toISOString();
    const newUser: DbUser = {
      id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      email: data.email.toLowerCase().trim(),
      password_hash: data.passwordHash,
      first_name: data.firstName.trim(),
      last_name: data.lastName.trim(),
      full_name: `${data.firstName} ${data.lastName}`.trim(),
      role: data.role || 'STUDENT',
      status: 'ACTIVE',
      created_at: now,
      updated_at: now
    };

    this.users.push(newUser);
    this.recordAuditLog({
      actor_id: newUser.id,
      actor_role: newUser.role,
      action: 'USER_REGISTERED',
      resource: 'User',
      resource_id: newUser.id,
      result: 'SUCCESS',
      metadata: { email: newUser.email, role: newUser.role }
    });

    this.persist();
    return newUser;
  }

  public updateUserRole(userId: string, newRole: DbUser['role'], adminActorId: string): DbUser {
    const user = this.findUserById(userId);
    if (!user) throw new Error('المستخدم غير موجود');

    const admin = this.findUserById(adminActorId);
    if (!admin || admin.role !== 'ADMIN') {
      this.recordAuditLog({
        actor_id: adminActorId,
        actor_role: admin?.role || 'UNKNOWN',
        action: 'UPDATE_USER_ROLE_REJECTED',
        resource: 'User',
        resource_id: userId,
        result: 'REJECTED',
        metadata: { attemptedRole: newRole }
      });
      throw new Error('غير مصرح لك بتغيير أدوار المستخدمين');
    }

    const oldRole = user.role;
    user.role = newRole;
    user.updated_at = new Date().toISOString();

    this.recordAuditLog({
      actor_id: adminActorId,
      actor_role: admin.role,
      action: 'USER_ROLE_UPDATED',
      resource: 'User',
      resource_id: userId,
      result: 'SUCCESS',
      metadata: { oldRole, newRole }
    });

    this.persist();
    return user;
  }

  // --- Refresh Token Methods ---

  public saveRefreshToken(userId: string, token: string, expiresInDays: number = 7) {
    const expiresAt = new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000).toISOString();
    const rt: DbRefreshToken = {
      id: `rt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      user_id: userId,
      token,
      expires_at: expiresAt,
      created_at: new Date().toISOString()
    };
    this.refreshTokens.push(rt);
    this.persist();
    return rt;
  }

  public findRefreshToken(token: string): DbRefreshToken | undefined {
    return this.refreshTokens.find(rt => rt.token === token && new Date(rt.expires_at) > new Date());
  }

  public deleteRefreshToken(token: string) {
    this.refreshTokens = this.refreshTokens.filter(rt => rt.token !== token);
    this.persist();
  }

  // --- Questions Query & Management ---

  public getQuestions(filters?: {
    lessonId?: string;
    learningObjectiveId?: string;
    difficulty?: string;
    status?: string;
    concept?: string;
  }): DbQuestion[] {
    return this.questions.filter(q => {
      if (filters?.lessonId && q.lesson_id !== filters.lessonId) return false;
      if (filters?.learningObjectiveId && q.learning_objective_id !== filters.learningObjectiveId) return false;
      if (filters?.difficulty && q.difficulty !== filters.difficulty) return false;
      if (filters?.status && q.status !== filters.status) return false;
      if (filters?.concept && q.concept !== filters.concept) return false;
      return true;
    });
  }

  public getQuestionById(id: string): DbQuestion | undefined {
    return this.questions.find(q => q.id === id);
  }

  public getQuestionOptions(questionId: string): DbQuestionOption[] {
    return this.questionOptions
      .filter(o => o.question_id === questionId)
      .sort((a, b) => a.order_index - b.order_index);
  }

  public createQuestion(data: Omit<DbQuestion, 'created_at' | 'updated_at'> & { options?: string[]; correctAnswerIndex?: number }, actorId: string): DbQuestion {
    // Check FK
    const lesson = this.lessons.find(l => l.id === data.lesson_id);
    if (!lesson) throw new Error(`Foreign Key Violation: Lesson with id ${data.lesson_id} does not exist`);

    const existing = this.getQuestionById(data.id);
    if (existing) throw new Error(`Unique Constraint Violation: Question with id ${data.id} already exists`);

    const now = new Date().toISOString();
    const newQ: DbQuestion = {
      ...data,
      created_at: now,
      updated_at: now
    };

    this.questions.push(newQ);

    if (data.options && Array.isArray(data.options)) {
      data.options.forEach((optText, idx) => {
        this.questionOptions.push({
          id: `opt-${newQ.id}-${idx}`,
          question_id: newQ.id,
          content: optText,
          is_correct: idx === (data.correctAnswerIndex ?? 0),
          order_index: idx + 1
        });
      });
    }

    this.recordAuditLog({
      actor_id: actorId,
      actor_role: 'CONTENT_MANAGER',
      action: 'CREATE_QUESTION',
      resource: 'Question',
      resource_id: newQ.id,
      result: 'SUCCESS',
      metadata: { type: newQ.type, lessonId: newQ.lesson_id }
    });

    this.persist();
    return newQ;
  }

  // --- Exam Query & Retrieval ---

  public getExams(): DbExam[] {
    return this.exams;
  }

  public getExamById(id: string): DbExam | undefined {
    return this.exams.find(e => e.id === id);
  }

  // --- Question and Exam Attempt Logging ---

  public recordQuestionAttempt(data: Omit<DbStudentQuestionAttempt, 'id' | 'timestamp'>): DbStudentQuestionAttempt {
    // Foreign Key check: User must exist
    const user = this.findUserById(data.user_id);
    if (!user) throw new Error(`Foreign Key Violation: User ${data.user_id} does not exist`);

    const attempt: DbStudentQuestionAttempt = {
      ...data,
      id: `att-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString()
    };
    this.questionAttempts.push(attempt);
    
    // Canonical Single-Source Mastery Evaluation
    this.recalculateAndSaveMasterySnapshot(data.user_id);
    this.persist();
    return attempt;
  }

  public recordExamAttempt(data: Omit<DbStudentExamAttempt, 'id' | 'submitted_at'>): DbStudentExamAttempt {
    // Foreign Key check: User and Exam must exist
    const user = this.findUserById(data.user_id);
    if (!user) throw new Error(`Foreign Key Violation: User ${data.user_id} does not exist`);

    const exam = this.getExamById(data.exam_id);
    if (!exam) throw new Error(`Foreign Key Violation: Exam ${data.exam_id} does not exist`);

    const attempt: DbStudentExamAttempt = {
      ...data,
      id: `ex-att-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      submitted_at: new Date().toISOString()
    };
    this.examAttempts.push(attempt);

    this.recordAuditLog({
      actor_id: data.user_id,
      actor_role: user.role,
      action: 'EXAM_SUBMITTED',
      resource: 'ExamAttempt',
      resource_id: attempt.id,
      result: 'SUCCESS',
      metadata: { examId: data.exam_id, score: data.total_score, percentage: data.percentage }
    });

    // Recalculate canonical student mastery
    this.recalculateAndSaveMasterySnapshot(data.user_id);
    this.persist();
    return attempt;
  }

  public updateLessonProgress(userId: string, lessonId: string, completed: boolean, score: number, timeSpent: number) {
    const user = this.findUserById(userId);
    if (!user) throw new Error(`Foreign Key Violation: User ${userId} does not exist`);

    const lesson = this.lessons.find(l => l.id === lessonId);
    if (!lesson) throw new Error(`Foreign Key Violation: Lesson ${lessonId} does not exist`);

    const existing = this.lessonProgress.find(lp => lp.user_id === userId && lp.lesson_id === lessonId);
    if (existing) {
      existing.completed = completed || existing.completed;
      existing.score = Math.max(existing.score, score);
      existing.time_spent_seconds += timeSpent;
      existing.last_accessed_at = new Date().toISOString();
      this.persist();
      return existing;
    }
    const newLp: DbStudentLessonProgress = {
      id: `lp-${Date.now()}`,
      user_id: userId,
      lesson_id: lessonId,
      completed,
      score,
      time_spent_seconds: timeSpent,
      last_accessed_at: new Date().toISOString()
    };
    this.lessonProgress.push(newLp);
    this.persist();
    return newLp;
  }

  // --- Canonical Mastery Recalculation ---

  public recalculateAndSaveMasterySnapshot(userId: string): DbStudentMasterySnapshot {
    const userAttempts = this.questionAttempts.filter(a => a.user_id === userId);
    const userExams = this.examAttempts.filter(e => e.user_id === userId);

    const masteryEval = studentMasteryEngine.calculateStudentMastery({
      userId,
      questionAttempts: userAttempts,
      examAttempts: userExams
    });

    const statusMap: Record<string, DbStudentMasterySnapshot['status']> = {
      'INSUFFICIENT_DATA': 'INSUFFICIENT_DATA',
      'NO_DATA': 'INSUFFICIENT_DATA',
      'NOVICE': 'NEEDS_REMEDIATION',
      'DEVELOPING': 'DEVELOPING',
      'PROFICIENT': 'PROFICIENT',
      'MASTERED': 'MASTERED'
    };

    const snapshotStatus = masteryEval.status === 'INSUFFICIENT_DATA'
      ? 'INSUFFICIENT_DATA'
      : (statusMap[masteryEval.masteryBand] || 'DEVELOPING');

    const snapshot: DbStudentMasterySnapshot = {
      id: `snap-${userId}-${Date.now()}`,
      user_id: userId,
      scope_type: 'COURSE',
      scope_id: 'course-eb-acc-g10',
      mastery_score: masteryEval.compositeMastery,
      confidence: masteryEval.confidence,
      evidence_count: userAttempts.length + userExams.length,
      status: snapshotStatus,
      calculated_at: new Date().toISOString(),
      algorithm_version: 'mastery-v1.0'
    };

    // Replace previous snapshot
    this.masterySnapshots = this.masterySnapshots.filter(s => s.user_id !== userId);
    this.masterySnapshots.push(snapshot);

    // Sync adaptive recommendations via AdaptiveRemediationEngine
    if (masteryEval.weakestConcepts.length > 0) {
      masteryEval.weakestConcepts.forEach(weakConcept => {
        const existing = this.recommendations.find(r => r.user_id === userId && r.weak_concept === weakConcept && !r.resolved);
        if (!existing) {
          const recPath = adaptiveRemediationEngine.generateRemediationPlan({
            weakConceptName: weakConcept,
            relatedLessonId: 'lesson-3'
          });
          this.recommendations.push({
            id: `rec-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
            user_id: userId,
            weak_concept: weakConcept,
            recommended_path: {
              simplified_explanation: recPath.simplifiedRule,
              micro_example: recPath.workedExample,
              drill_question_ids: recPath.drillQuestionIds,
              suggested_lesson_slug: recPath.targetLessonSlug
            },
            created_at: new Date().toISOString(),
            resolved: false
          });
        }
      });
    }

    return snapshot;
  }
}

export const db = new PersistentProductionDatabase();
