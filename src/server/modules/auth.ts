import { Request, Response } from 'express';
import { z } from 'zod';
import { db } from '../db/database';
import { hashPassword, verifyPassword } from '../auth/password';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../auth/jwt';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

const registerSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صالح'),
  password: z.string().min(6, 'كلمة المرور يجب ألا تقل عن 6 أحرف'),
  firstName: z.string().min(2, 'الاسم الأول مطلوب'),
  lastName: z.string().min(2, 'اسم العائلة مطلوب')
  // Role is strictly omitted from public registration to prevent privilege escalation
});

const adminCreateUserSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صالح'),
  password: z.string().min(6, 'كلمة المرور يجب ألا تقل عن 6 أحرف'),
  firstName: z.string().min(2, 'الاسم الأول مطلوب'),
  lastName: z.string().min(2, 'اسم العائلة مطلوب'),
  role: z.enum(['STUDENT', 'TEACHER', 'CONTENT_MANAGER', 'ADMIN'])
});

const updateRoleSchema = z.object({
  role: z.enum(['STUDENT', 'TEACHER', 'CONTENT_MANAGER', 'ADMIN'])
});

const loginSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صالح'),
  password: z.string().min(1, 'كلمة المرور مطلوبة')
});

export async function handleRegister(req: Request, res: Response) {
  try {
    const parseResult = registerSchema.safeParse(req.body);
    if (!parseResult.success) {
      const msg = parseResult.error.issues?.[0]?.message || 'بيانات التسجيل غير صالحة';
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: msg
        }
      });
    }

    const { email, password, firstName, lastName } = parseResult.data;

    const existingUser = db.findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: {
          code: 'EMAIL_EXISTS',
          message: 'البريد الإلكتروني مسجل مسبقاً في المنظومة'
        }
      });
    }

    const passwordHash = await hashPassword(password);
    // Security P0 Fix: Public registration is strictly locked to STUDENT
    const user = db.createUser({
      email,
      passwordHash,
      firstName,
      lastName,
      role: 'STUDENT'
    });

    db.recordAuditLog({
      actor_id: user.id,
      actor_role: 'STUDENT',
      action: 'REGISTER_STUDENT',
      resource: 'User',
      resource_id: user.id,
      result: 'SUCCESS',
      metadata: { email: user.email, role: 'STUDENT' }
    });

    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      fullName: user.full_name
    };

    const accessToken = signAccessToken(tokenPayload);
    const refreshToken = signRefreshToken(tokenPayload);
    db.saveRefreshToken(user.id, refreshToken);

    return res.status(201).json({
      success: true,
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        status: user.status
      }
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: err.message || 'حدث خطأ أثناء التسجيل' }
    });
  }
}

export async function handleLogin(req: Request, res: Response) {
  try {
    const parseResult = loginSchema.safeParse(req.body);
    if (!parseResult.success) {
      const msg = parseResult.error.issues?.[0]?.message || 'البريد الإلكتروني وكلمة المرور مطلوبان';
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: msg
        }
      });
    }

    const { email, password } = parseResult.data;
    const user = db.findUserByEmail(email);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
        }
      });
    }

    const isValidPassword = await verifyPassword(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
        }
      });
    }

    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      fullName: user.full_name
    };

    const accessToken = signAccessToken(tokenPayload);
    const refreshToken = signRefreshToken(tokenPayload);
    db.saveRefreshToken(user.id, refreshToken);

    return res.json({
      success: true,
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        status: user.status
      }
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: err.message || 'حدث خطأ أثناء تسجيل الدخول' }
    });
  }
}

export function handleRefreshToken(req: Request, res: Response) {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({
      success: false,
      error: { code: 'MISSING_TOKEN', message: 'رمز التجديد مطلوب' }
    });
  }

  const validStored = db.findRefreshToken(refreshToken);
  if (!validStored) {
    return res.status(401).json({
      success: false,
      error: { code: 'INVALID_REFRESH_TOKEN', message: 'رمز التجديد غير صالح أو منتهي الصلاحية' }
    });
  }

  const payload = verifyRefreshToken(refreshToken);
  if (!payload) {
    return res.status(401).json({
      success: false,
      error: { code: 'EXPIRED_REFRESH_TOKEN', message: 'رمز التجديد منتهي الصلاحية' }
    });
  }

  const newAccessToken = signAccessToken({
    userId: payload.userId,
    email: payload.email,
    role: payload.role,
    fullName: payload.fullName
  });

  return res.json({
    success: true,
    accessToken: newAccessToken
  });
}

export function handleLogout(req: Request, res: Response) {
  const { refreshToken } = req.body;
  if (refreshToken) {
    db.deleteRefreshToken(refreshToken);
  }
  return res.json({ success: true, message: 'تم تسجيل الخروج بنجاح' });
}

export function handleGetMe(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'يرجى تسجيل الدخول' }
    });
  }

  const user = db.findUserById(req.user.userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      error: { code: 'USER_NOT_FOUND', message: 'المستخدم غير موجود في قاعدة البيانات' }
    });
  }

  return res.json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      status: user.status
    }
  });
}

export function handleListUsers(req: AuthenticatedRequest, res: Response) {
  return res.json({
    success: true,
    users: db.users.map(u => ({
      id: u.id,
      email: u.email,
      full_name: u.full_name,
      role: u.role,
      status: u.status
    }))
  });
}

export async function handleAdminCreateUser(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user || req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'صلاحية مسؤول النظام (ADMIN) مطلوبة لإنشاء حسابات برتب خاصة' }
      });
    }

    const parseResult = adminCreateUserSchema.safeParse(req.body);
    if (!parseResult.success) {
      const msg = parseResult.error.issues?.[0]?.message || 'بيانات إنشاء المستخدم غير صالحة';
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: msg }
      });
    }

    const { email, password, firstName, lastName, role } = parseResult.data;

    const existingUser = db.findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: { code: 'EMAIL_EXISTS', message: 'البريد الإلكتروني مسجل مسبقاً في المنظومة' }
      });
    }

    const passwordHash = await hashPassword(password);
    const user = db.createUser({
      email,
      passwordHash,
      firstName,
      lastName,
      role
    });

    db.recordAuditLog({
      actor_id: req.user.userId,
      actor_role: 'ADMIN',
      action: 'ADMIN_CREATE_USER',
      resource: 'User',
      resource_id: user.id,
      result: 'SUCCESS',
      metadata: { createdUserId: user.id, email: user.email, assignedRole: user.role }
    });

    return res.status(201).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        status: user.status
      }
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: err.message || 'حدث خطأ أثناء إنشاء المستخدم' }
    });
  }
}

export function handleAdminUpdateUserRole(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user || req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'صلاحية مسؤول النظام (ADMIN) مطلوبة لتعديل رتب المستخدمين' }
      });
    }

    const { id } = req.params;
    const parseResult = updateRoleSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'الرتبة المحددة غير صالحة' }
      });
    }

    const targetUser = db.findUserById(id);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        error: { code: 'USER_NOT_FOUND', message: 'المستخدم غير موجود' }
      });
    }

    const oldRole = targetUser.role;
    const newRole = parseResult.data.role;

    targetUser.role = newRole;
    targetUser.updated_at = new Date().toISOString();
    db.persist();

    db.recordAuditLog({
      actor_id: req.user.userId,
      actor_role: 'ADMIN',
      action: 'ADMIN_UPDATE_ROLE',
      resource: 'User',
      resource_id: targetUser.id,
      result: 'SUCCESS',
      metadata: { targetUserId: targetUser.id, oldRole, newRole }
    });

    return res.json({
      success: true,
      user: {
        id: targetUser.id,
        email: targetUser.email,
        full_name: targetUser.full_name,
        role: targetUser.role,
        status: targetUser.status
      }
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: err.message || 'حدث خطأ أثناء تعديل رتبة المستخدم' }
    });
  }
}
