import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldAlert, LogIn, Home, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const UnauthorizedPage: React.FC = () => {
  const { role, user, setIsAuthModalOpen } = useAuth();
  const location = useLocation();
  const state = location.state as { attemptedPath?: string; requiredRoles?: string[] } | undefined;

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 font-serif" dir="rtl">
      <div className="max-w-lg w-full bg-white border-2 border-[#1D1D1B] p-8 shadow-xl text-center space-y-6">
        <div className="w-16 h-16 bg-[#8A1F1D] text-white flex items-center justify-center mx-auto text-2xl font-bold shadow-xs">
          <ShieldAlert className="w-8 h-8" />
        </div>
        
        <div className="space-y-2">
          <span className="text-xs font-mono font-bold text-[#8A1F1D] tracking-widest uppercase">
            صلاحيات غير كافية • 403 Forbidden
          </span>
          <h1 className="text-2xl font-extrabold text-[#1D1D1B]">
            غير مصرح بالدخول
          </h1>
          <p className="text-sm text-[#1D1D1B]/70 leading-relaxed max-w-md mx-auto">
            الصفحة المطلوبة تتطلب صلاحيات خاصة ({state?.requiredRoles?.join(', ') || 'صلاحيات إدارية'}). دورك الحالي هو: <strong className="text-[#1D1D1B]">{role}</strong>.
          </p>
          {user && (
            <p className="text-xs text-[#1D1D1B]/50 font-mono">
              المستخدم المسجل: {user.email}
            </p>
          )}
        </div>

        <div className="border-t border-[#1D1D1B]/15 pt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="w-full sm:w-auto px-4 py-2.5 bg-[#1D1D1B] text-[#F9F7F2] font-bold text-xs hover:bg-[#333333] transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
          >
            <LogIn className="w-4 h-4 text-[#C4A484]" />
            <span>تسجيل الدخول بحساب آخر</span>
          </button>

          <Link
            to="/curriculum"
            className="w-full sm:w-auto px-4 py-2.5 border border-[#1D1D1B] text-[#1D1D1B] font-bold text-xs hover:bg-[#1D1D1B]/5 transition flex items-center justify-center gap-1.5"
          >
            <BookOpen className="w-4 h-4 text-[#C4A484]" />
            <span>العودة للمنهاج</span>
          </Link>

          <Link
            to="/"
            className="w-full sm:w-auto px-4 py-2.5 bg-[#C4A484] text-[#1D1D1B] font-bold text-xs hover:bg-[#b89574] transition flex items-center justify-center gap-1.5 shadow-xs"
          >
            <Home className="w-4 h-4" />
            <span>الرئيسية</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
