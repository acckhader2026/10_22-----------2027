import { describe, it, expect } from 'vitest';
import { requireRole, requireOwnershipOrStaff, AuthenticatedRequest } from '../middleware/authMiddleware';

describe('P0 Production - RBAC & Data Ownership Enforcement', () => {
  it('should block unauthenticated requests when role check is applied', () => {
    const req = {} as AuthenticatedRequest;
    let statusCode = 0;
    let responseData: any = null;

    const res = {
      status: (code: number) => {
        statusCode = code;
        return {
          json: (data: any) => { responseData = data; }
        };
      }
    } as any;

    const middleware = requireRole('ADMIN', 'TEACHER');
    let nextCalled = false;

    middleware(req, res, () => { nextCalled = true; });

    expect(nextCalled).toBe(false);
    expect(statusCode).toBe(401);
    expect(responseData?.error?.code).toBe('UNAUTHORIZED');
  });

  it('should forbid STUDENT from accessing TEACHER or ADMIN resources (403)', () => {
    const req = {
      user: {
        userId: 'usr-student-test',
        email: 'student@eb.edu.eg',
        role: 'STUDENT',
        fullName: 'طالب'
      }
    } as AuthenticatedRequest;

    let statusCode = 0;
    let responseData: any = null;

    const res = {
      status: (code: number) => {
        statusCode = code;
        return {
          json: (data: any) => { responseData = data; }
        };
      }
    } as any;

    const middleware = requireRole('TEACHER', 'ADMIN');
    let nextCalled = false;

    middleware(req, res, () => { nextCalled = true; });

    expect(nextCalled).toBe(false);
    expect(statusCode).toBe(403);
    expect(responseData?.error?.code).toBe('FORBIDDEN');
  });

  it('should permit TEACHER or ADMIN when accessing authorized roles', () => {
    const req = {
      user: {
        userId: 'usr-teacher-test',
        email: 'teacher@eb.edu.eg',
        role: 'TEACHER',
        fullName: 'معلم'
      }
    } as AuthenticatedRequest;

    const res = {} as any;
    const middleware = requireRole('TEACHER', 'ADMIN');
    let nextCalled = false;

    middleware(req, res, () => { nextCalled = true; });

    expect(nextCalled).toBe(true);
  });

  it('should forbid students from accessing another student records via requireOwnershipOrStaff', () => {
    const req = {
      user: {
        userId: 'usr-student-1',
        email: 'student1@eb.edu.eg',
        role: 'STUDENT',
        fullName: 'طالب 1'
      },
      params: { studentId: 'usr-student-2' }
    } as any;

    let statusCode = 0;
    let responseData: any = null;

    const res = {
      status: (code: number) => {
        statusCode = code;
        return {
          json: (data: any) => { responseData = data; }
        };
      }
    } as any;

    const middleware = requireOwnershipOrStaff((r) => r.params?.studentId);
    let nextCalled = false;

    middleware(req, res, () => { nextCalled = true; });

    expect(nextCalled).toBe(false);
    expect(statusCode).toBe(403);
    expect(responseData?.error?.code).toBe('FORBIDDEN_OWNERSHIP');
  });

  it('should allow students to access their own records via requireOwnershipOrStaff', () => {
    const req = {
      user: {
        userId: 'usr-student-1',
        email: 'student1@eb.edu.eg',
        role: 'STUDENT',
        fullName: 'طالب 1'
      },
      params: { studentId: 'usr-student-1' }
    } as any;

    const res = {} as any;
    const middleware = requireOwnershipOrStaff((r) => r.params?.studentId);
    let nextCalled = false;

    middleware(req, res, () => { nextCalled = true; });

    expect(nextCalled).toBe(true);
  });
});
