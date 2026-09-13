import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowRight, Home, BookOpen } from 'lucide-react';

interface NotFoundPageProps {
  message?: string;
  suggestedPath?: string;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({
  message = 'الصفحة أو الرابط المطلوب غير موجود أو تم تعديل مساره.',
  suggestedPath = '/curriculum'
}) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 font-serif" dir="rtl">
      <div className="max-w-lg w-full bg-white border-2 border-[#1D1D1B] p-8 shadow-xl text-center space-y-6">
        <div className="w-16 h-16 bg-[#8A1F1D] text-white flex items-center justify-center mx-auto text-2xl font-bold shadow-xs">
          <AlertCircle className="w-8 h-8" />
        </div>
        
        <div className="space-y-2">
          <span className="text-xs font-mono font-bold text-[#8A1F1D] tracking-widest uppercase">
            خطأ 404 • المسار غير معرّف
          </span>
          <h1 className="text-2xl font-extrabold text-[#1D1D1B]">
            الصفحة غير موجودة
          </h1>
          <p className="text-sm text-[#1D1D1B]/70 leading-relaxed max-w-md mx-auto">
            {message}
          </p>
        </div>

        <div className="border-t border-[#1D1D1B]/15 pt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto px-4 py-2.5 border border-[#1D1D1B] text-[#1D1D1B] font-bold text-xs hover:bg-[#1D1D1B]/5 transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" />
            <span>الرجوع للصفحة السابقة</span>
          </button>

          <Link
            to={suggestedPath}
            className="w-full sm:w-auto px-4 py-2.5 bg-[#1D1D1B] text-[#F9F7F2] font-bold text-xs hover:bg-[#333333] transition flex items-center justify-center gap-1.5 shadow-xs"
          >
            <BookOpen className="w-4 h-4 text-[#C4A484]" />
            <span>استعراض المنهاج المعتمد</span>
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
