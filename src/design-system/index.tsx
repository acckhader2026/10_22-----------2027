import React from 'react';
import { DifficultyLevel } from '../types';

export const THEME = {
  colors: {
    bgPaper: '#F9F7F2',
    bgPure: '#FFFFFF',
    textMain: '#1D1D1B',
    textMuted: '#1D1D1B/70',
    accentGold: '#C4A484',
    accentDark: '#1D1D1B',
    borderLight: '#1D1D1B/15',
    borderMedium: '#1D1D1B/30',
    successBg: '#F4F8F4',
    successText: '#1B4D2E',
    warningBg: '#FAF7EE',
    warningText: '#7A5210',
    errorBg: '#FDF3F2',
    errorText: '#8A1F1D',
  },
  typography: {
    serif: 'font-serif',
    sans: "font-['Cairo',sans-serif]",
    mono: 'font-mono'
  }
};

// ==========================================
// 1. Difficulty & Taxonomy Badges
// ==========================================

export const DifficultyBadge: React.FC<{ level: DifficultyLevel; className?: string }> = ({ level, className = '' }) => {
  const map: Record<DifficultyLevel, { label: string; bg: string; text: string }> = {
    basic: { label: 'مستوى أساسي', bg: 'bg-[#F9F7F2]', text: 'text-[#1D1D1B]' },
    intermediate: { label: 'مستوى متوسط', bg: 'bg-[#F9F7F2]', text: 'text-[#1D1D1B]' },
    advanced: { label: 'مستوى متقدم', bg: 'bg-[#1D1D1B]', text: 'text-[#C4A484]' },
    challenge: { label: 'تحدي وتفكير ناقد', bg: 'bg-[#1D1D1B]', text: 'text-[#F9F7F2]' }
  };

  const item = map[level] || map.basic;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-bold border border-[#1D1D1B]/20 font-serif ${item.bg} ${item.text} ${className}`}>
      <span>●</span>
      <span>{item.label}</span>
    </span>
  );
};

export const RoleBadge: React.FC<{ role: string; className?: string }> = ({ role, className = '' }) => {
  const map: Record<string, { label: string; bg: string; text: string }> = {
    STUDENT: { label: 'طالب (EB Student)', bg: 'bg-[#F9F7F2]', text: 'text-[#1D1D1B]' },
    TEACHER: { label: 'معلم معتمد (Teacher)', bg: 'bg-[#1D1D1B]', text: 'text-[#C4A484]' },
    CONTENT_MANAGER: { label: 'مسؤول المحتوى (Content Manager)', bg: 'bg-[#1D1D1B]', text: 'text-[#F9F7F2]' },
    ADMIN: { label: 'مدير النظام (Administrator)', bg: 'bg-[#C4A484]', text: 'text-[#1D1D1B]' }
  };

  const item = map[role] || map.STUDENT;

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-bold border border-[#1D1D1B]/25 font-serif ${item.bg} ${item.text} ${className}`}>
      {item.label}
    </span>
  );
};

// ==========================================
// 2. Buttons & Inputs
// ==========================================

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) => {
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-xs sm:text-sm',
    lg: 'px-6 py-3 text-sm sm:text-base'
  };

  const variantStyles = {
    primary: 'bg-[#1D1D1B] text-[#F9F7F2] hover:bg-[#333330] border border-[#1D1D1B]',
    secondary: 'bg-[#FFFFFF] text-[#1D1D1B] hover:bg-[#F9F7F2] border border-[#1D1D1B]/20',
    outline: 'bg-transparent text-[#1D1D1B] hover:bg-[#1D1D1B]/5 border border-[#1D1D1B]/30',
    danger: 'bg-[#1D1D1B] text-[#F9F7F2] hover:bg-rose-950 border border-rose-900',
    gold: 'bg-[#C4A484] text-[#1D1D1B] hover:bg-[#b09070] border border-[#1D1D1B]'
  };

  return (
    <button
      className={`font-serif font-bold transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// ==========================================
// 3. Editorial Cards
// ==========================================

export const EditorialCard: React.FC<{
  title?: string;
  subtitle?: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  headerAction?: React.ReactNode;
}> = ({ title, subtitle, badge, children, className = '', headerAction }) => {
  return (
    <div className={`bg-[#FFFFFF] border border-[#1D1D1B]/15 p-5 sm:p-6 shadow-xs space-y-4 ${className}`}>
      {(title || badge || headerAction) && (
        <div className="flex items-center justify-between border-b border-[#1D1D1B]/10 pb-3">
          <div>
            {badge && <div className="mb-1">{badge}</div>}
            {title && <h3 className="font-serif font-extrabold text-base sm:text-lg text-[#1D1D1B]">{title}</h3>}
            {subtitle && <p className="text-xs text-[#1D1D1B]/70 font-serif mt-0.5">{subtitle}</p>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
};

// ==========================================
// 4. Progress & Mastery Indicators
// ==========================================

export const MasteryIndicator: React.FC<{
  score: number;
  label?: string;
  showCategory?: boolean;
}> = ({ score, label = 'مستوى الإتقان الأكاديمي', showCategory = true }) => {
  const getCategory = (val: number) => {
    if (val >= 80) return { title: 'متقن ومتميز (Mastered)', color: 'text-[#1D1D1B]', desc: 'إتقان تام لكافة المفاهيم والتطبيقات' };
    if (val >= 60) return { title: 'مستوى جيد (Good)', color: 'text-[#1D1D1B]', desc: 'استيعاب قوي مع حاجة لتدريبات متقدمة' };
    if (val >= 40) return { title: 'يحتاج إلى مراجعة (Review)', color: 'text-[#1D1D1B]', desc: 'يوصى بإعادة مراجعة المفاهيم والأسس' };
    return { title: 'يحتاج إلى دعم علاجي (Needs Support)', color: 'text-[#1D1D1B]', desc: 'البدء فوراً بالمسار التعليمي التكيفي' };
  };

  const cat = getCategory(score);

  return (
    <div className="space-y-2 font-serif border border-[#1D1D1B]/15 bg-[#F9F7F2] p-4">
      <div className="flex items-center justify-between text-xs font-bold">
        <span className="text-[#1D1D1B]">{label}</span>
        <span className="font-mono text-sm text-[#1D1D1B]">{Math.round(score)}%</span>
      </div>
      
      {/* Progress Track */}
      <div className="w-full h-2 bg-[#FFFFFF] border border-[#1D1D1B]/20 overflow-hidden">
        <div
          className="h-full bg-[#1D1D1B] transition-all duration-500"
          style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
        />
      </div>

      {showCategory && (
        <div className="pt-1 flex items-center justify-between text-[11px]">
          <span className={`font-bold ${cat.color}`}>{cat.title}</span>
          <span className="text-[#1D1D1B]/70">{cat.desc}</span>
        </div>
      )}
    </div>
  );
};
