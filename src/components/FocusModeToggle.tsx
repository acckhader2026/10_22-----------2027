import React from 'react';
import { Eye, Sparkles, LayoutGrid, Check, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { useFocusMode, FocusFontSize } from '../context/FocusModeContext';

interface FocusModeToggleProps {
  isFocusMode: boolean;
  onToggle: () => void;
  className?: string;
}

export const FocusModeToggle: React.FC<FocusModeToggleProps> = ({
  isFocusMode,
  onToggle,
  className = ''
}) => {
  const { fontSize, setFontSize, increaseFontSize, decreaseFontSize } = useFocusMode();

  const getFontSizeLabel = (size: FocusFontSize): string => {
    switch (size) {
      case 'normal': return 'عادي';
      case 'large': return 'كبير (تناسبي)';
      case 'xlarge': return 'كبير جداً';
      case 'huge': return 'أقصى تكبير';
    }
  };

  return (
    <div
      id="reading-focus-mode-bar"
      className={`border transition-all duration-300 ${
        isFocusMode
          ? 'bg-[#1D1D1B] text-[#F9F7F2] border-[#C4A484]/40 shadow-sm'
          : 'bg-[#FFFFFF] text-[#1D1D1B] border-[#1D1D1B]/15 shadow-xs'
      } p-4 sm:p-5 ${className}`}
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Mode Info & Description */}
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-2.5">
            <span
              className={`p-1.5 transition ${
                isFocusMode ? 'bg-[#C4A484] text-[#1D1D1B]' : 'bg-[#1D1D1B] text-[#F9F7F2]'
              }`}
            >
              {isFocusMode ? <Sparkles className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-bold text-sm sm:text-base font-serif">
                {isFocusMode ? 'وضع التركيز (ملء الصفحة وتكبير الخط التناسبي)' : 'الوضع الافتراضي (Default Mode)'}
              </h3>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider font-mono ${
                  isFocusMode
                    ? 'bg-emerald-900/80 text-emerald-200 border border-emerald-500/50'
                    : 'bg-[#F9F7F2] text-[#1D1D1B]/70 border border-[#1D1D1B]/20'
                }`}
              >
                {isFocusMode ? 'مفعّل' : 'العادي'}
              </span>
              {isFocusMode && (
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-[#C4A484] bg-[#FFFFFF]/10 px-2 py-0.5 border border-[#C4A484]/30">
                  <Maximize2 className="w-3 h-3" />
                  <span>ملء تلقائي للشاشة</span>
                </span>
              )}
            </div>
          </div>
          <p
            className={`text-xs sm:text-sm leading-relaxed font-serif ${
              isFocusMode ? 'text-[#F9F7F2]/80' : 'text-[#1D1D1B]/70'
            }`}
          >
            {isFocusMode
              ? 'تم ملء مساحة العرض تلقائياً مع تكبير الخطوط والمسافات لتناسب أبعاد الشاشة تماماً وتمنحك تجربة قراءة فائقة الراحة والوضوح خالية من أي مشتتات.'
              : 'يعرض جميع القوائم وشاشات التنقل الجانبية. بدّل إلى وضع التركيز لملء الشاشة وتكبير الخط تلقائياً.'}
          </p>
        </div>

        {/* Interactive Controls & Font Scaling */}
        <div className="flex flex-wrap items-center gap-3 shrink-0 self-start lg:self-center">
          
          {/* Font Size Adjuster (Active in Focus Mode) */}
          {isFocusMode && (
            <div
              id="focus-font-size-controls"
              className="flex items-center gap-1 bg-[#2A2A28] border border-[#C4A484]/30 px-2 py-1 text-xs"
              title="التحكم في حجم الخط"
            >
              <span className="text-[#C4A484] font-serif text-[11px] ml-1 font-bold">الخط:</span>
              <button
                id="btn-decrease-font"
                type="button"
                onClick={decreaseFontSize}
                disabled={fontSize === 'normal'}
                className="p-1 hover:bg-[#FFFFFF]/20 text-[#F9F7F2] disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                title="تصغير الخط"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>

              <span className="font-mono text-[11px] font-bold text-[#F9F7F2] px-1.5 py-0.5 bg-[#1D1D1B] border border-[#F9F7F2]/20 min-w-[75px] text-center">
                {getFontSizeLabel(fontSize)}
              </span>

              <button
                id="btn-increase-font"
                type="button"
                onClick={increaseFontSize}
                disabled={fontSize === 'huge'}
                className="p-1 hover:bg-[#FFFFFF]/20 text-[#F9F7F2] disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                title="تكبير الخط"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Segmented Mode Switcher */}
          <div
            className={`inline-flex p-1 border ${
              isFocusMode ? 'bg-[#2A2A28] border-[#F9F7F2]/10' : 'bg-[#F9F7F2] border-[#1D1D1B]/15'
            }`}
            role="group"
            aria-label="خيارات نمط القراءة"
          >
            <button
              id="btn-mode-default"
              type="button"
              onClick={() => {
                if (isFocusMode) onToggle();
              }}
              className={`px-3 py-1.5 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer font-serif ${
                !isFocusMode
                  ? 'bg-[#1D1D1B] text-[#F9F7F2] shadow-xs'
                  : 'text-[#F9F7F2]/70 hover:text-[#F9F7F2]'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>الوضع الافتراضي</span>
              {!isFocusMode && <Check className="w-3 h-3 text-[#C4A484]" />}
            </button>

            <button
              id="btn-mode-focus"
              type="button"
              onClick={() => {
                if (!isFocusMode) onToggle();
              }}
              className={`px-3 py-1.5 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer font-serif ${
                isFocusMode
                  ? 'bg-[#C4A484] text-[#1D1D1B] shadow-xs'
                  : 'text-[#1D1D1B]/70 hover:text-[#1D1D1B]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>وضع التركيز</span>
              {isFocusMode && <Check className="w-3 h-3 text-[#1D1D1B]" />}
            </button>
          </div>

          {/* Toggle Switch Component */}
          <button
            id="reading-mode-toggle-switch"
            type="button"
            role="switch"
            aria-checked={isFocusMode}
            aria-label="تبديل وضع التركيز"
            onClick={onToggle}
            className={`relative inline-flex h-7 w-13 shrink-0 cursor-pointer items-center border transition-colors duration-200 ease-in-out focus:outline-hidden ${
              isFocusMode
                ? 'bg-[#C4A484] border-[#C4A484]'
                : 'bg-[#1D1D1B]/20 border-[#1D1D1B]/30 hover:bg-[#1D1D1B]/30'
            }`}
            title={isFocusMode ? 'العودة للوضع الافتراضي' : 'تفعيل وضع التركيز'}
          >
            <span
              aria-hidden="true"
              className={`pointer-events-none inline-block h-5 w-5 transform bg-[#FFFFFF] shadow-sm transition duration-200 ease-in-out ${
                isFocusMode ? '-translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>

          {/* Quick Exit hint when active */}
          {isFocusMode && (
            <span className="text-[11px] font-mono text-[#F9F7F2]/60 hidden md:inline">
              [Esc للإنهاء]
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
