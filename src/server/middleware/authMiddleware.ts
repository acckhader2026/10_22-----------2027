import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, TokenPayload } from '../auth/jwt';

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

export function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'جلسة تسجيل الدخول غير صالحة أو منتهية. يرجى تسجيل الدخول.'
      }
    });
  }

  const token = authHeader.split(' ')[1];
  const payload = verifyAccessToken(token);

  if (!payload) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message: 'رمز التحقق غير صالح أو منتهي الصلاحية.'
      }
    });
  }

  req.user = payload;
  return next();
}

export function requireRole(...allowedRoles: Array<'STUDENT' | 'TEACHER' | 'CONTENT_MANAGER' | 'ADMIN'>) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'المصادقة مطلوبة.' }
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'ليس لديك الصلاحية الكافية للوصول إلى هذا المورد الأكاديمي.'
        }
      });
    }

    return next();
  };
}

export function requireOwnershipOrStaff(targetUserIdExtractor: (req: AuthenticatedRequest) => string | undefined) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'المصادقة مطلوبة.' }
      });
    }

    const targetUserId = targetUserIdExtractor(req);

    // Teachers and Admins have supervisory oversight access
    if (req.user.role === 'ADMIN' || req.user.role === 'TEACHER' || req.user.role === 'CONTENT_MANAGER') {
      return next();
    }

    // Students can ONLY access their own records
    if (req.user.role === 'STUDENT') {
      if (!targetUserId || targetUserId === req.user.userId) {
        return next();
      }
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN_OWNERSHIP',
          message: 'غير مصرح لك بالاطلاع على بيانات طالب آخر.'
        }
      });
    }

    return res.status(403).json({
      success: false,
      error: { code: 'FORBIDDEN', message: 'صلاحيات غير كافية.' }
    });
  };
}
