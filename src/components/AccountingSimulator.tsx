import React, { useState } from 'react';
import { 
  Scale, BookMarked, PenTool, Calculator, FileSpreadsheet, 
  Sparkles, ShieldAlert, EyeOff, Eye, CheckCircle2, Award, 
  HelpCircle, AlertTriangle, BookOpen
} from 'lucide-react';
import { TAccountSimulator, TAccountSimulatorProps } from './TAccountSimulator';

export interface AccountingSimulatorProps extends TAccountSimulatorProps {
  showCurriculumGuide?: boolean;
}

/**
 * AccountingSimulator:
 * المنظومة المتكاملة لمحاكاة الدورة المحاسبية طبقاً لمنهج كتاب الوزارة الرسمي (البكالوريا المصرية).
 * يعرض نماذج تفاعلية لـ:
 * 1. دفاتر اليومية المساعدة (الوحدة 3)
 * 2. دفتر الأستاذ العام وحسابات حرف T
 * 3. ميزان المراجعة وكاشف الأخطاء والحساب المعلق
 * 4. خيار 'الترحيل اليدوي' بالتوازي مع الترحيل التلقائي
 * 5. زر خاص لـ 'محاكاة الأخطاء' لإخفاء الترحيل الصحيح واكتشاف الفروق
 * 6. الحسابات الختامية والميزانية العمومية المفصلة
 * 7. حالات تدريبية واقعية معتمدة من الكتاب الرسمي
 */
export const AccountingSimulator: React.FC<AccountingSimulatorProps> = ({
  initialSubTab = 'subsidiary',
  initialPostingMode = 'manual',
  initialHideCorrectPosting = true,
  showCurriculumGuide = true
}) => {
  const [activeTab, setActiveTab] = useState<
    'subsidiary' | 'journal' | 't_accounts' | 'posting_challenge' | 'trial_balance' | 'final_accounts' | 'guided_cases'
  >(initialSubTab);

  const [mode, setMode] = useState<'auto' | 'manual'>(initialPostingMode);
  const [hideCorrect, setHideCorrect] = useState<boolean>(initialHideCorrectPosting);
  const [showCurriculumModal, setShowCurriculumModal] = useState<boolean>(false);

  return (
    <div className="space-y-6 font-serif" dir="rtl">
      {/* Official Curriculum Banner */}
      <div className="bg-[#FFFFFF] border-2 border-[#1D1D1B] p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-[#1D1D1B] text-[#C4A484] text-xs font-bold px-2.5 py-0.5 uppercase tracking-wider">
                كتاب المحاسبة المالية المعتمد • وزارة التربية والتعليم
              </span>
              <span className="bg-[#C4A484]/25 text-[#1D1D1B] text-xs font-bold px-2 py-0.5 border border-[#1D1D1B]/20">
                الوحدتان الثالثة والرابعة (الدورة المستندية والمحاسبية)
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#1D1D1B] mt-1">
              مكون المحاكاة المحاسبية التفاعلي (Accounting Simulator)
            </h1>
            <p className="text-xs sm:text-sm text-[#1D1D1B]/75 max-w-4xl leading-relaxed">
              محاكاة ميدانية تفاعلية متزامنة تغطي دفاتر اليومية المساعدة، دفتر اليومية العامة، دفتر الأستاذ العام (حسابات T)، ميزان المراجعة بالأرصدة والمجاميع، مع خيار <strong>الترحيل اليدوي</strong> وزر مخصص لـ <strong>محاكاة أخطاء الترحيل</strong> لكشف الفروق ومعالجتها بالحساب المعلق.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowCurriculumModal(!showCurriculumModal)}
              className="px-3 py-2 bg-[#F9F7F2] hover:bg-[#F0EEE6] text-[#1D1D1B] border border-[#1D1D1B]/30 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-[#C4A484]" />
              <span>{showCurriculumModal ? 'إخفاء دليل الحالات' : 'دليل حالات الكتاب المدرسي'}</span>
            </button>
          </div>
        </div>

        {/* Expandable Official Cases Curriculum Guide */}
        {showCurriculumModal && (
          <div className="mt-4 pt-4 border-t border-[#1D1D1B]/15 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-[#F9F7F2] border border-[#1D1D1B]/15 space-y-1">
              <span className="font-bold text-[#1D1D1B] block">1. دفاتر اليومية المساعدة (الوحدة 3)</span>
              <p className="text-[#1D1D1B]/70 leading-relaxed text-[11px]">
                تطبيق حالات منشأة فريدة ومحلات بلال: يومية المبيعات الآجلة، يومية المشتريات الآجلة، مردودات المبيعات والمشتريات، دفتر النقدية ذو الأعمدة الثلاثة، وسلفة المصروفات النثرية المستديمة.
              </p>
            </div>
            <div className="p-3 bg-[#F9F7F2] border border-[#1D1D1B]/15 space-y-1">
              <span className="font-bold text-[#1D1D1B] block">2. الترحيل اليدوي ومحاكاة الأخطاء (الوحدة 4)</span>
              <p className="text-[#1D1D1B]/70 leading-relaxed text-[11px]">
                ممارسة الطالب للترحيل مع إمكانية إخفاء الترحيل النموذجي؛ لمحاكاة خطأ الترحيل العكسي (تأثيره ضعف المبلغ)، قلب الأرقام (يقبل القسمة على 9)، وترحيل طرف دون الآخر.
              </p>
            </div>
            <div className="p-3 bg-[#F9F7F2] border border-[#1D1D1B]/15 space-y-1">
              <span className="font-bold text-[#1D1D1B] block">3. ميزان المراجعة والحسابات الختامية</span>
              <p className="text-[#1D1D1B]/70 leading-relaxed text-[11px]">
                مطابقة توازن الأرصدة والمجاميع، فتح الحساب المعلق تلقائياً عند اكتشاف فرق الترحيل، وتوليد حساب المتاجرة والأرباح والخسائر والميزانية العمومية المفصلة.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Core Simulation Engine */}
      <TAccountSimulator
        key={`${activeTab}-${mode}-${hideCorrect}`}
        initialSubTab={activeTab}
        initialPostingMode={mode}
        initialHideCorrectPosting={hideCorrect}
      />
    </div>
  );
};

export { TAccountSimulator };
export default AccountingSimulator;
