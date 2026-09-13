import React from 'react';
import { BookOpen, Sparkles, Compass, Lightbulb, AlertTriangle, Brain, Target, Star, Rocket, CheckCircle2, ArrowLeft } from 'lucide-react';
import { bookMetadata } from '../data/bookMetadata';

interface WelcomeAndGuideProps {
  onGoToLessons: () => void;
  onGoToMap: () => void;
}

export const WelcomeAndGuide: React.FC<WelcomeAndGuideProps> = ({ onGoToLessons, onGoToMap }) => {
  const { welcomeMessage, learningObjectives } = bookMetadata;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      
      {/* Hero Welcome Card */}
      <div className="bg-[#1D1D1B] text-[#F9F7F2] rounded-none p-6 sm:p-10 shadow-sm border border-[#1D1D1B] relative overflow-hidden">
        
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 bg-[#C4A484] text-[#1D1D1B] px-3 py-1 rounded-none text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>رسالة ترحيب من فريق التأليف</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#F9F7F2] font-serif">
            {welcomeMessage.greeting}
          </h2>

          <div className="space-y-3 text-[#F9F7F2]/85 text-sm sm:text-base leading-relaxed font-serif">
            {welcomeMessage.paragraphs.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>

          <div className="pt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={onGoToLessons}
              className="px-5 py-2.5 bg-[#C4A484] hover:bg-[#b89574] text-[#1D1D1B] font-bold text-xs sm:text-sm transition flex items-center gap-2 border border-[#C4A484]"
            >
              <BookOpen className="w-4 h-4" />
              <span>الانتقال المباشر للدروس</span>
            </button>
            <button
              onClick={onGoToMap}
              className="px-5 py-2.5 bg-[#FFFFFF]/10 hover:bg-[#FFFFFF]/20 border border-[#F9F7F2]/30 text-[#F9F7F2] font-bold text-xs sm:text-sm transition flex items-center gap-2"
            >
              <Compass className="w-4 h-4 text-[#C4A484]" />
              <span>استكشاف خريطة الوحدة ونواتج التعلم</span>
            </button>
          </div>
        </div>
      </div>

      {/* How to Study */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-[#1D1D1B]/15 pb-3">
          <div className="w-8 h-8 bg-[#1D1D1B] text-[#C4A484] flex items-center justify-center font-bold">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#1D1D1B] font-serif">كيف تذاكر هذا الكتاب لتحقيق أعلى الدرجات؟</h3>
            <p className="text-xs text-[#1D1D1B]/60">منهجية المذاكرة الفعالة لطلاب البكالوريا المصرية</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {welcomeMessage.howToStudy.map((item) => (
            <div key={item.step} className="bg-[#FFFFFF] border border-[#1D1D1B]/15 p-5 shadow-xs hover:border-[#1D1D1B] transition">
              <div className="flex items-center gap-3 mb-2">
                <span className="w-7 h-7 bg-[#1D1D1B] text-[#C4A484] font-bold text-xs flex items-center justify-center">
                  {item.step}
                </span>
                <h4 className="font-bold text-[#1D1D1B] text-sm font-serif">{item.title}</h4>
              </div>
              <p className="text-xs text-[#1D1D1B]/70 leading-relaxed pr-10">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Visual Identity & Difficulty Legend */}
      <div className="bg-[#FFFFFF] border border-[#1D1D1B]/15 p-6 sm:p-8 space-y-6">
        <div className="border-b border-[#1D1D1B]/10 pb-3">
          <h3 className="text-lg font-bold text-[#1D1D1B] mb-1 font-serif">دليل الرموز ومستويات الصعوبة في الكتاب</h3>
          <p className="text-xs text-[#1D1D1B]/60">تم تصميم كل رمز في هذا الكتاب ليقدم لك قيمة تعليمية فورية</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {welcomeMessage.symbolGuide.map((sym, idx) => (
            <div key={idx} className="bg-[#F9F7F2] p-3.5 border border-[#1D1D1B]/10 shadow-xs flex items-start gap-3">
              <span className="text-xl shrink-0 p-1.5 bg-[#FFFFFF] border border-[#1D1D1B]/10">{sym.symbol}</span>
              <div>
                <div className="font-bold text-xs text-[#1D1D1B] font-serif">{sym.name}</div>
                <div className="text-[11px] text-[#1D1D1B]/60 mt-0.5 leading-snug">{sym.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Learning Outcomes Checklist */}
      <div className="bg-[#FFFFFF] border border-[#1D1D1B]/15 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#1D1D1B]/10 pb-3">
          <div>
            <h3 className="text-lg font-bold text-[#1D1D1B] font-serif">أهداف ونواتج تعلم الوحدة الأولى</h3>
            <p className="text-xs text-[#1D1D1B]/60">بنهاية دراستك لهذه الوحدة ستكون قادراً على إتقان هذه المهارات القياسية:</p>
          </div>
          <span className="text-xs border border-[#1D1D1B] bg-[#F9F7F2] text-[#1D1D1B] font-bold px-3 py-1 uppercase tracking-wider">
            8 أهداف رئيسية
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {learningObjectives.map((obj) => (
            <div key={obj.id} className="flex items-start gap-3 p-3.5 bg-[#F9F7F2] border border-[#1D1D1B]/10">
              <CheckCircle2 className="w-5 h-5 text-[#C4A484] shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-semibold text-[#1D1D1B]">
                  <span className="text-[#1D1D1B] font-bold ml-1 underline decoration-[#C4A484] underline-offset-2">أن {obj.actionVerb}:</span>
                  {obj.text}
                </div>
                <span className="text-[10px] text-[#1D1D1B]/60 mt-1 inline-block bg-[#FFFFFF] px-2 py-0.5 border border-[#1D1D1B]/15">
                  مستوى بلوم: {obj.bloomLevel}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
