import { describe, it, expect } from 'vitest';
import { db } from '../db/database';
import { sanitizeExamForStudent } from '../modules/exams';
import { handleGetQuestions, handleGetQuestionById } from '../modules/questions';
import { handleRegister, handleAdminCreateUser } from '../modules/auth';
import { handleRecordQuestionAttempt } from '../modules/progress';

// Helper mock response
function createMockResponse() {
  const res: any = {
    statusCode: 200,
    headers: {},
    jsonData: null,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(data: any) {
      this.jsonData = data;
      return this;
    }
  };
  return res;
}

describe('P0 Security Hardening & Vulnerability Remediation Suite', () => {

  // =========================================================================
  // ITEM 1: Exam Data Sanitization
  // =========================================================================
  describe('1. Exam Data Sanitization (Anti-Leakage)', () => {
    it('strips correctAnswer, modelAnswer, explanation, and rubricCriteria from student exam views', () => {
      const rawExam = db.exams[0];
      expect(rawExam).toBeDefined();

      const sanitized = sanitizeExamForStudent(rawExam);

      for (const section of sanitized.sections) {
        for (const question of section.questions) {
          expect(question).not.toHaveProperty('correctAnswer');
          expect(question).not.toHaveProperty('modelAnswer');
          expect(question).not.toHaveProperty('explanation');
          expect(question).not.toHaveProperty('rubricCriteria');
          // Verify required public fields are preserved
          expect(question).toHaveProperty('id');
          expect(question).toHaveProperty('prompt');
          expect(question).toHaveProperty('type');
        }
      }
    });
  });

  // =========================================================================
  // ITEM 2: Question Bank Option Sanitization
  // =========================================================================
  describe('2. Question Bank Option Sanitization', () => {
    it('handleGetQuestions strips is_correct from options and omits explanation prior to attempt', () => {
      const req: any = { query: {} };
      const res = createMockResponse();

      handleGetQuestions(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.jsonData.questions.length).toBeGreaterThan(0);

      for (const q of res.jsonData.questions) {
        expect(q).not.toHaveProperty('explanation');
        if (q.options && q.options.length > 0) {
          for (const opt of q.options) {
            expect(opt).not.toHaveProperty('is_correct');
            expect(opt).toHaveProperty('id');
            expect(opt).toHaveProperty('content');
          }
        }
      }
    });

    it('handleGetQuestionById strips is_correct from options and omits explanation', () => {
      const sampleQ = db.questions[0];
      const req: any = { params: { id: sampleQ.id } };
      const res = createMockResponse();

      handleGetQuestionById(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.jsonData.question).toBeDefined();
      expect(res.jsonData.question).not.toHaveProperty('explanation');
      for (const opt of res.jsonData.question.options) {
        expect(opt).not.toHaveProperty('is_correct');
      }
    });
  });

  // =========================================================================
  // ITEM 3: Server-Authoritative Grading
  // =========================================================================
  describe('3. Server-Authoritative Grading & Client Spoof Prevention', () => {
    const studentUser = {
      userId: 'usr-student-1',
      email: 'student@eb.edu.eg',
      role: 'STUDENT' as const,
      fullName: 'أحمد محمود (طالب EB)'
    };

    it('rejects attempts for non-existent questions with 400 INVALID_QUESTION', () => {
      const req: any = {
        user: studentUser,
        body: {
          questionId: 'non-existent-q-9999',
          userAnswer: 'any answer'
        }
      };
      const res = createMockResponse();

      handleRecordQuestionAttempt(req, res);

      expect(res.statusCode).toBe(400);
      expect(res.jsonData.error.code).toBe('INVALID_QUESTION');
    });

    it('ignores client-sent isCorrect flag and grades authoritatively on the server (WRONG answer gets 0)', () => {
      const mcqQuestion = db.questions.find(q => q.type.toUpperCase() === 'MCQ')!;
      const options = db.questionOptions.filter(o => o.question_id === mcqQuestion.id);
      const wrongOption = options.find(o => !o.is_correct)!;

      // Attacker attempts to spoof `isCorrect: true` for a wrong answer
      const req: any = {
        user: studentUser,
        body: {
          questionId: mcqQuestion.id,
          userAnswer: wrongOption.id,
          isCorrect: true // SPOOFED FLAG
        }
      };
      const res = createMockResponse();

      handleRecordQuestionAttempt(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.jsonData.isCorrect).toBe(false); // Server corrected the flag
      expect(res.jsonData.score).toBe(0); // Score is 0
      expect(res.jsonData.attempt.is_correct).toBe(false);
      expect(res.jsonData.attempt.score).toBe(0);
    });

    it('awards 2 points when the student answers correctly', () => {
      const mcqQuestion = db.questions.find(q => q.type.toUpperCase() === 'MCQ')!;
      const options = db.questionOptions.filter(o => o.question_id === mcqQuestion.id);
      const correctOption = options.find(o => o.is_correct)!;

      const req: any = {
        user: studentUser,
        body: {
          questionId: mcqQuestion.id,
          userAnswer: correctOption.id
        }
      };
      const res = createMockResponse();

      handleRecordQuestionAttempt(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.jsonData.isCorrect).toBe(true);
      expect(res.jsonData.score).toBe(2);
      expect(res.jsonData.correctOptionId).toBe(correctOption.id);
      expect(res.jsonData.explanation).toBeDefined();
    });
  });

  // =========================================================================
  // ITEM 4: Public Registration Locked to STUDENT & Admin User Management
  // =========================================================================
  describe('4. Public Registration Security & Role Escalation Prevention', () => {
    it('forces role to STUDENT when an attacker attempts to register as ADMIN', async () => {
      const testEmail = `test_attacker_${Date.now()}@example.com`;
      const req: any = {
        body: {
          email: testEmail,
          password: 'Password123!',
          firstName: 'مهاجم',
          lastName: 'النظام',
          role: 'ADMIN' // Malicious role injection attempt
        }
      };
      const res = createMockResponse();

      await handleRegister(req, res);

      expect(res.statusCode).toBe(201);
      expect(res.jsonData.user.role).toBe('STUDENT'); // Role MUST be forced to STUDENT

      // Verify in DB directly
      const createdInDb = db.findUserByEmail(testEmail);
      expect(createdInDb).toBeDefined();
      expect(createdInDb?.role).toBe('STUDENT');
    });

    it('allows ADMIN to create specialized role users with audit logging', async () => {
      const adminUser = {
        userId: 'usr-admin-1',
        email: 'admin@eb.edu.eg',
        role: 'ADMIN' as const,
        fullName: 'د. سارة عثمان (مدير النظام)'
      };

      const teacherEmail = `teacher_${Date.now()}@eb.edu.eg`;
      const req: any = {
        user: adminUser,
        body: {
          email: teacherEmail,
          password: 'TeacherPassword123!',
          firstName: 'أستاذ',
          lastName: 'المحاسبة',
          role: 'TEACHER'
        }
      };
      const res = createMockResponse();

      await handleAdminCreateUser(req, res);

      expect(res.statusCode).toBe(201);
      expect(res.jsonData.user.role).toBe('TEACHER');

      // Verify audit log
      const auditEntry = db.auditLogs.find(a => a.action === 'ADMIN_CREATE_USER' && a.metadata?.email === teacherEmail);
      expect(auditEntry).toBeDefined();
      expect(auditEntry?.actor_role).toBe('ADMIN');
    });

    it('rejects non-admin users from creating elevated accounts', async () => {
      const studentUser = {
        userId: 'usr-student-1',
        email: 'student@eb.edu.eg',
        role: 'STUDENT' as const,
        fullName: 'أحمد محمود'
      };

      const req: any = {
        user: studentUser,
        body: {
          email: `new_admin_${Date.now()}@eb.edu.eg`,
          password: 'Password123!',
          firstName: 'مزور',
          lastName: 'الرتبة',
          role: 'ADMIN'
        }
      };
      const res = createMockResponse();

      await handleAdminCreateUser(req, res);

      expect(res.statusCode).toBe(403);
      expect(res.jsonData.error.code).toBe('FORBIDDEN');
    });
  });

  // =========================================================================
  // ITEM 5: Question Bank Count Reconciliation (Verified Questions)
  // =========================================================================
  describe('5. Question Bank Count Reconciliation (Verified Questions)', () => {
    it('verifies verified questions exist in database seed and bank', () => {
      expect(db.questions.length).toBeGreaterThanOrEqual(62);
      
      const mcqs = db.questions.filter(q => q.type.toUpperCase() === 'MCQ');
      const trueFalse = db.questions.filter(q => q.type.toUpperCase() === 'TRUE_FALSE');
      const fillBlank = db.questions.filter(q => q.type.toUpperCase() === 'FILL_BLANK');
      const numerical = db.questions.filter(q => q.type.toUpperCase() === 'NUMERICAL');
      const jre = db.questions.filter(q => q.type.toUpperCase() === 'JRE');
      const tAccount = db.questions.filter(q => q.type.toUpperCase() === 'T_ACCOUNT');

      expect(mcqs.length).toBeGreaterThanOrEqual(42);
      expect(trueFalse.length).toBeGreaterThanOrEqual(10);
      expect(fillBlank.length).toBeGreaterThanOrEqual(5);
      expect(numerical.length).toBeGreaterThanOrEqual(2);
      expect(jre.length).toBeGreaterThanOrEqual(2);
      expect(tAccount.length).toBeGreaterThanOrEqual(1);

      expect(db.questions.length).toBe(130);
    });
  });
});
