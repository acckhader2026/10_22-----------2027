import React from 'react';
import { BookOpen, Sparkles, Award, ArrowLeft, CheckCircle2, ShieldCheck, TrendingUp, Layers, PenTool } from 'lucide-react';
import { bookMetadata } from '../data/bookMetadata';

interface CoverPageProps {
  onStartReading: () => void;
  onOpenAnalysis: (unitId?: 'unit-1' | 'unit-2' | 'unit-3') => void;
}

export const CoverPage: React.FC<CoverPageProps> = ({ onStartReading, onOpenAnalysis }) => {
  return (
    <div className="min-h-[88vh] flex flex-col items-center justify-center p-4 sm:p-8 bg-[#F9F7F2] text-[#1D1D1B] relative overflow-hidden">
      {/* Editorial Decorative Subtle Grids */}
      <div className="max-w-4xl w-full mx-auto relative z-10">
        
        {/* Editorial Book Volume Container */}
        <div className="bg-[#FFFFFF] border-2 border-[#1D1D1B] rounded-none p-6 sm:p-12 shadow-sm relative overflow-hidden">
          
          {/* Top Stamp / Masthead */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#1D1D1B]/15">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#1D1D1B] text-[#C4A484] flex items-center justify-center font-serif font-black text-xl border border-[#1D1D1B]">
                ١١
              </div>
              <div>
                <span className="inline-block border border-[#1D1D1B] bg-[#F9F7F2] text-[#1D1D1B] text-xs font-bold px-3 py-0.5 uppercase tracking-wider">
                  كتاب الطالب الخارجي المعتمد
                </span>
                <p className="text-xs text-[#1D1D1B]/60 mt-1 font-serif">جمهورية مصر العربية • وزارة التربية والتعليم والتعليم الفني</p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-[#F9F7F2] px-4 py-2 border border-[#1D1D1B]/20 text-xs font-bold text-[#1D1D1B]">
              <ShieldCheck className="w-4 h-4 text-[#C4A484]" />
              <span>معايير البكالوريا الدولية (Advised by IB Approach)</span>
            </div>
          </div>

          {/* Main Title Block */}
          <div className="my-8 text-center sm:text-right">
            <div className="inline-flex items-center gap-2 bg-[#1D1D1B] text-[#C4A484] px-4 py-1.5 text-xs sm:text-sm font-bold mb-4 uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>المحاسبة المالية للبكالوريا المصرية • الصف الثاني الثانوي</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#1D1D1B] font-serif tracking-tight leading-tight">
              {bookMetadata.title}
            </h1>

            <h2 className="text-xl sm:text-2xl font-bold text-[#1D1D1B]/80 mt-3 font-serif">
              {bookMetadata.subtitle}
            </h2>

            <p className="text-base sm:text-lg text-[#1D1D1B]/70 mt-4 max-w-2xl font-serif italic leading-relaxed border-r-2 border-[#C4A484] pr-4">
              «{bookMetadata.slogan}»
            </p>
          </div>

          {/* Features Editorial Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-8 border-y border-[#1D1D1B]/15 py-6">
            <div className="p-4 bg-[#F9F7F2] border border-[#1D1D1B]/10 flex items-start gap-3">
              <div className="p-2 bg-[#1D1D1B] text-[#C4A484] shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#1D1D1B] font-serif">تغطية منهجية 100%</h4>
                <p className="text-xs text-[#1D1D1B]/70 mt-1 leading-relaxed">
                  تطابق تام ومكتمل مع المادة المعتمدة: الدفاتر المساعدة الخمسة، الترحيل للأستاذ، وحسابات المراقبة.
                </p>
              </div>
            </div>

            <div className="p-4 bg-[#F9F7F2] border border-[#1D1D1B]/10 flex items-start gap-3">
              <div className="p-2 bg-[#1D1D1B] text-[#C4A484] shrink-0">
                <PenTool className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#1D1D1B] font-serif">إتقان مقال JRE وحالة بلال</h4>
                <p className="text-xs text-[#1D1D1B]/70 mt-1 leading-relaxed">
                  حل تفصيلي لحالة محلات بلال الرسمية، مع صياغة الحجج المالية وفق سلم تقييم الـ 20 درجة.
                </p>
              </div>
            </div>

            <div className="p-4 bg-[#F9F7F2] border border-[#1D1D1B]/10 flex items-start gap-3">
              <div className="p-2 bg-[#1D1D1B] text-[#C4A484] shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#1D1D1B] font-serif">دورة محاسبية وتطبيق متكامل</h4>
                <p className="text-xs text-[#1D1D1B]/70 mt-1 leading-relaxed">
                  دراسة حالة مؤسسة فريدة الكاملة، دفتر النقدية ذو الأعمدة الثلاثة، والسلفة المستديمة.
                </p>
              </div>
            </div>
          </div>

          {/* Actions CTA */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-2 text-xs text-[#1D1D1B]/60 font-medium">
              <CheckCircle2 className="w-4 h-4 text-[#C4A484]" />
              <span>طبعة 2026 / 2027 الرقمية التفاعلية المعتمدة — المادة الرسمية حصراً</span>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <button
                onClick={() => onOpenAnalysis('unit-3')}
                className="px-4 py-2.5 bg-[#FFFFFF] hover:bg-[#F9F7F2] border border-[#1D1D1B] text-xs font-bold text-[#1D1D1B] transition flex items-center gap-1.5 cursor-pointer"
              >
                <span>مطابقة المنهج (الوحدة الثالثة)</span>
              </button>
              <button
                onClick={onStartReading}
                className="px-6 py-2.5 bg-[#1D1D1B] hover:bg-[#333330] text-[#F9F7F2] text-xs sm:text-sm font-bold transition flex items-center gap-2 border border-[#1D1D1B] cursor-pointer"
              >
                <span>ابدأ دراسة الوحدة الثالثة</span>
                <ArrowLeft className="w-4 h-4 text-[#C4A484]" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
