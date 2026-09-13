import React, { useState } from 'react';
import { Shield, Lock, Mail, User, X, CheckCircle, AlertCircle, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        await login(email, password);
        setSuccessMsg('تم تسجيل الدخول بنجاح');
        setTimeout(() => {
          onClose();
        }, 500);
      } else {
        await register({ email, password, firstName, lastName });
        setSuccessMsg('تم إنشاء الحساب وتسجيل الدخول كطالب بنجاح');
        setTimeout(() => {
          onClose();
        }, 500);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'حدث خطأ أثناء معالجة الطلب');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1D1D1B]/80 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-[#F9F7F2] border-2 border-[#1D1D1B] max-w-md w-full p-6 shadow-2xl relative text-right">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-1 text-[#1D1D1B]/60 hover:text-[#1D1D1B] hover:bg-[#1D1D1B]/10 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6 pb-3 border-b border-[#1D1D1B]/20">
          <div className="w-10 h-10 bg-[#1D1D1B] text-[#C4A484] flex items-center justify-center shadow-xs">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-[#1D1D1B]">
              {mode === 'login' ? 'تسجيل الدخول للمنصة' : 'إنشاء حساب طالب جديد'}
            </h2>
            <p className="text-xs text-[#1D1D1B]/70 font-sans">
              منصة المحاسبة المالية للمرحلة الثانوية - البكالوريا المصرية
            </p>
          </div>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex border border-[#1D1D1B]/30 mb-5 bg-[#FFFFFF]">
          <button
            type="button"
            onClick={() => { setMode('login'); setErrorMsg(null); setSuccessMsg(null); }}
            className={`flex-1 py-2 text-xs font-bold flex items-center justify-center gap-1.5 transition ${
              mode === 'login'
                ? 'bg-[#1D1D1B] text-[#F9F7F2]'
                : 'text-[#1D1D1B]/70 hover:bg-[#1D1D1B]/5'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>تسجيل الدخول</span>
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setErrorMsg(null); setSuccessMsg(null); }}
            className={`flex-1 py-2 text-xs font-bold flex items-center justify-center gap-1.5 transition ${
              mode === 'register'
                ? 'bg-[#1D1D1B] text-[#F9F7F2]'
                : 'text-[#1D1D1B]/70 hover:bg-[#1D1D1B]/5'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>حساب جديد</span>
          </button>
        </div>

        {/* Alerts */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-300 text-rose-800 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#1D1D1B]/80 mb-1">الاسم الأول</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="أحمد"
                    className="w-full px-3 py-2 text-xs bg-[#FFFFFF] border border-[#1D1D1B]/30 focus:border-[#1D1D1B] focus:outline-hidden"
                  />
                  <User className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#1D1D1B]/40" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#1D1D1B]/80 mb-1">اسم العائلة</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="محمود"
                    className="w-full px-3 py-2 text-xs bg-[#FFFFFF] border border-[#1D1D1B]/30 focus:border-[#1D1D1B] focus:outline-hidden"
                  />
                  <User className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#1D1D1B]/40" />
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[#1D1D1B]/80 mb-1">البريد الإلكتروني</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="w-full px-3 py-2 text-xs bg-[#FFFFFF] border border-[#1D1D1B]/30 focus:border-[#1D1D1B] focus:outline-hidden text-left"
                dir="ltr"
              />
              <Mail className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#1D1D1B]/40" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1D1D1B]/80 mb-1">كلمة المرور</label>
            <div className="relative">
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 text-xs bg-[#FFFFFF] border border-[#1D1D1B]/30 focus:border-[#1D1D1B] focus:outline-hidden text-left"
                dir="ltr"
              />
              <Lock className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#1D1D1B]/40" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 mt-2 bg-[#1D1D1B] hover:bg-[#333330] text-[#F9F7F2] text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>جاري المعالجة...</span>
            ) : mode === 'login' ? (
              <>
                <LogIn className="w-4 h-4 text-[#C4A484]" />
                <span>دخول</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4 text-[#C4A484]" />
                <span>تسجيل حساب طالب</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
