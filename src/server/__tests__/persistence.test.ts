import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import { db, PersistentProductionDatabase } from '../db/database';
import { userRepository } from '../db/repositories/userRepository';
import { lessonRepository } from '../db/repositories/lessonRepository';
import { questionRepository } from '../db/repositories/questionRepository';
import { examRepository } from '../db/repositories/examRepository';
import { attemptRepository } from '../db/repositories/attemptRepository';
import { auditRepository } from '../db/repositories/auditRepository';

describe('PHASE 1: Database & Runtime Persistence Integrity Suite', () => {
  const testDbDir = path.join(process.cwd(), 'data', 'test_env');
  const testDbPath = path.join(testDbDir, `test_db_${Date.now()}.json`);

  beforeEach(() => {
    if (!fs.existsSync(testDbDir)) {
      fs.mkdirSync(testDbDir, { recursive: true });
    }
  });

  it('P0-DB-1: Should persist data to disk and reload intact across instance restarts', () => {
    // 1. Instantiate database on test path
    const db1 = new PersistentProductionDatabase(testDbPath);
    expect(db1.isReady()).toBe(true);

    const initialUsersCount = db1.users.length;
    const testEmail = `student_${Date.now()}@eb.edu.eg`;

    // 2. Create new user and attempt
    const createdUser = db1.createUser({
      email: testEmail,
      passwordHash: 'hashed_pw_test_123',
      firstName: 'كريم',
      lastName: 'السيد',
      role: 'STUDENT'
    });

    const attempt = db1.recordQuestionAttempt({
      user_id: createdUser.id,
      question_id: 'e1-q1',
      lesson_id: 'lesson-1',
      user_answer: 'أداة للقياس والتبويب',
      is_correct: true,
      score: 2,
      max_score: 2,
      time_spent_seconds: 40,
      attempt_number: 1,
      difficulty: 'basic'
    });

    // 3. Confirm file exists on disk
    expect(fs.existsSync(testDbPath)).toBe(true);

    // 4. Simulate complete process restart: instantiate a brand new Database pointing to same file
    const db2 = new PersistentProductionDatabase(testDbPath);
    expect(db2.users.length).toBe(initialUsersCount + 1);

    const reloadedUser = db2.findUserByEmail(testEmail);
    expect(reloadedUser).toBeDefined();
    expect(reloadedUser?.id).toBe(createdUser.id);
    expect(reloadedUser?.full_name).toBe('كريم السيد');

    const reloadedAttempts = db2.questionAttempts.filter(a => a.user_id === createdUser.id);
    expect(reloadedAttempts.length).toBe(1);
    expect(reloadedAttempts[0].id).toBe(attempt.id);
    expect(reloadedAttempts[0].is_correct).toBe(true);
    expect(reloadedAttempts[0].score).toBe(2);

    // Clean up test file
    try {
      if (fs.existsSync(testDbPath)) fs.unlinkSync(testDbPath);
    } catch {}
  });

  it('P0-DB-2: Should enforce Foreign Key constraints and reject orphaned attempts', () => {
    const invalidUserId = 'usr-non-existent-9999';

    expect(() => {
      db.recordQuestionAttempt({
        user_id: invalidUserId,
        question_id: 'e1-q1',
        lesson_id: 'lesson-1',
        user_answer: 'test',
        is_correct: false,
        score: 0,
        max_score: 2,
        time_spent_seconds: 10,
        attempt_number: 1,
        difficulty: 'basic'
      });
    }).toThrow(/Foreign Key Violation/);
  });

  it('P0-DB-3: Should support Atomic Transactions and rollback on failure', async () => {
    const initialUsersCount = db.users.length;
    const testRollbackEmail = `rollback_${Date.now()}@eb.edu.eg`;

    await expect(
      db.runInTransaction(async () => {
        db.createUser({
          email: testRollbackEmail,
          passwordHash: 'dummy_hash',
          firstName: 'مؤقت',
          lastName: 'فاشل',
          role: 'STUDENT'
        });

        expect(db.users.length).toBe(initialUsersCount + 1);

        // Intentionally throw midway to force rollback
        throw new Error('Simulated transaction mid-flight failure');
      })
    ).rejects.toThrow('Simulated transaction mid-flight failure');

    // Verify rollback restored user count
    expect(db.users.length).toBe(initialUsersCount);
    expect(db.findUserByEmail(testRollbackEmail)).toBeUndefined();
  });

  it('P0-DB-4: Should enforce Unique Constraints on email address', () => {
    const duplicateEmail = 'student@eb.edu.eg';

    expect(() => {
      db.createUser({
        email: duplicateEmail,
        passwordHash: 'hash',
        firstName: 'مكرر',
        lastName: 'مكرر',
        role: 'STUDENT'
      });
    }).toThrow(/البريد الإلكتروني مسجل بالفعل/);
  });

  it('P1-DB-1: Should maintain Seed Idempotency when seed() is called repeatedly', () => {
    // Initialize with seed first to establish stable baseline
    db.seed(false);
    const beforeSeedUsers = db.users.length;
    const beforeSeedLessons = db.lessons.length;
    const beforeSeedQuestions = db.questions.length;

    // Call seed multiple times
    db.seed(false);
    db.seed(false);

    expect(db.users.length).toBe(beforeSeedUsers);
    expect(db.lessons.length).toBe(beforeSeedLessons);
    expect(db.questions.length).toBe(beforeSeedQuestions);
  });

  it('P1-DB-2: Should record and retrieve Audit Logs for security and compliance', () => {
    const auditCountBefore = db.auditLogs.length;

    const logged = db.recordAuditLog({
      actor_id: 'usr-admin-1',
      actor_role: 'ADMIN',
      action: 'SYSTEM_SETTINGS_UPDATE',
      resource: 'Settings',
      resource_id: 'config-academic-year',
      result: 'SUCCESS',
      metadata: { term: 'TERM_1_2026' }
    });

    expect(db.auditLogs.length).toBe(auditCountBefore + 1);
    expect(logged.id).toBeDefined();
    expect(logged.timestamp).toBeDefined();

    const retrieved = db.getAuditLogs({ actor_id: 'usr-admin-1' });
    expect(retrieved.some(l => l.id === logged.id)).toBe(true);
  });

  it('P1-DB-3: Should verify Repository Layer integration', async () => {
    const users = await userRepository.listAll();
    expect(users.length).toBeGreaterThanOrEqual(4);

    const lessons = await lessonRepository.getAll();
    expect(lessons.length).toBeGreaterThanOrEqual(6);
    expect(lessons[0].learningObjectives.length).toBeGreaterThanOrEqual(1);

    const questionsCount = await questionRepository.count();
    expect(questionsCount).toBeGreaterThanOrEqual(60);

    const exams = await examRepository.getAll();
    expect(exams.length).toBeGreaterThanOrEqual(2);

    const attemptsCount = await attemptRepository.countAttempts();
    expect(attemptsCount).toBeGreaterThanOrEqual(2);
  });
});
