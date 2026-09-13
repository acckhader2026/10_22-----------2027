import React, { useState, useMemo } from 'react';
import { 
  BookA, Search, X, BookOpen, AlertTriangle, CheckCircle2, 
  Lightbulb, Sparkles, Filter, ChevronRight, Bookmark, ArrowUpRight 
} from 'lucide-react';
import { accountingGlossary, AccountingGlossaryItem } from '../data/accountingGlossaryData';

interface AccountingGlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTermId?: string | null;
  onNavigateToLesson?: (lessonIndex: number) => void;
}

export const AccountingGlossaryModal: React.FC<AccountingGlossaryModalProps> = ({
  isOpen,
  onClose,
  initialTermId,
  onNavigateToLesson
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTermId, setSelectedTermId] = useState<string>(
    initialTermId || accountingGlossary[0]?.id || 'entity-concept'
  );

  // Sync if initialTermId changes
  React.useEffect(() => {
    if (initialTermId) {
      setSelectedTermId(initialTermId);
      const found = accountingGlossary.find(g => g.id === initialTermId);
      if (found) {
        setSelectedCategory('all');
      }
    }
  }, [initialTermId]);

  const categories = [
    { id: 'all', label: 'كافة المصطلحات (' + accountingGlossary.length + ')' },
    { id: 'فروض ومبادئ', label: 'فروض ومبادئ' },
    { id: 'معادلة وقيد', label: 'معادلة وقيد' },
    { id: 'أستاذ وميزان', label: 'أستاذ وميزان' },
    { id: 'حسابات ختامية', label: 'حسابات ختامية' },
    { id: 'استدلال JRE', label: 'استدلال JRE' },
  ];

  const filteredItems = useMemo(() => {
    return accountingGlossary.filter(item => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const query = searchQuery.trim().toLowerCase();
      const matchesQuery = !query || 
        item.term.toLowerCase().includes(query) ||
        item.termEn.toLowerCase().includes(query) ||
        item.simpleDefinition.toLowerCase().includes(query) ||
        item.tags.some(t => t.toLowerCase().includes(query));
      return matchesCategory && matchesQuery;
    });
  }, [searchQuery, selectedCategory]);

  const activeItem: AccountingGlossaryItem | undefined = useMemo(() => {
    return accountingGlossary.find(i => i.id === selectedTermId) || filteredItems[0] || accountingGlossary[0];
  }, [selectedTermId, filteredItems]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#1D1D1B]/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div 
        id="accounting-glossary-modal"
        className="bg-[#FDFCF7] border-2 border-[#1D1D1B] w-full max-w-5xl h-[90vh] max-h-[780px] shadow-2xl flex flex-col overflow-hidden text-[#1D1D1B]"
      >
        {/* Header */}
        <div className="px-5 py-4 bg-[#1D1D1B] text-[#F9F7F2] flex items-center justify-between border-b border-[#1D1D1B]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#C4A484] text-[#1D1D1B] flex items-center justify-center font-bold">
              <BookA className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black font-serif tracking-wide">
                  قاموس المصطلحات والمبادئ المحاسبية المعتمد
                </h2>
                <span className="px-2 py-0.5 bg-[#C4A484]/30 text-[#E8DCC4] text-[11px] font-mono border border-[#C4A484]/40">
                  EB-ACC-GLOSSARY
                </span>
              </div>
              <p className="text-xs text-[#E8DCC4]/80">
                مرجع تفاعلي سريع لشرح الفروض والمصطلحات المحاسبية بأسلوب مبسط وأكاديمي مدعوم بأمثلة وتنبيهات
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-1.5 text-[#E8DCC4] hover:text-[#FFFFFF] hover:bg-[#333330] transition cursor-pointer"
            title="إغلاق القاموس"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-3 sm:p-4 bg-[#FFFFFF] border-b border-[#1D1D1B]/15 space-y-3">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-[#1D1D1B]/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن مصطلح (مثال: الاستحقاق، التكلفة التاريخية، T-Account، ميزان المراجعة)..."
                className="w-full pr-9 pl-3 py-2 text-xs sm:text-sm bg-[#F9F7F2] border border-[#1D1D1B]/30 focus:border-[#1D1D1B] focus:bg-[#FFFFFF] outline-hidden transition font-sans"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-[#1D1D1B]/50 hover:text-[#1D1D1B]"
                >
                  مسح
                </button>
              )}
            </div>

            {/* Category Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-2.5 py-1.5 text-xs font-bold whitespace-nowrap transition cursor-pointer border ${
                    selectedCategory === cat.id
                      ? 'bg-[#1D1D1B] text-[#F9F7F2] border-[#1D1D1B]'
                      : 'bg-[#F9F7F2] text-[#1D1D1B]/70 hover:bg-[#E8DCC4]/50 border-[#1D1D1B]/20'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Main Workspace: Split View */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12">
          
          {/* Left / Sidebar: List of Terms (4 Cols) */}
          <div className="md:col-span-4 border-l border-[#1D1D1B]/15 bg-[#F9F7F2] overflow-y-auto p-2 space-y-1.5 max-h-[260px] md:max-h-full">
            <div className="px-2 py-1 flex items-center justify-between text-[11px] font-bold text-[#1D1D1B]/60 uppercase tracking-wider">
              <span>قائمة المصطلحات ({filteredItems.length})</span>
              <span>اختر للقراءة</span>
            </div>

            {filteredItems.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#1D1D1B]/50 space-y-2">
                <BookOpen className="w-6 h-6 mx-auto opacity-40" />
                <p>لا توجد مصطلحات مطابقة للبحث.</p>
              </div>
            ) : (
              filteredItems.map(item => {
                const isSelected = activeItem?.id === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedTermId(item.id)}
                    className={`w-full text-right p-2.5 transition border cursor-pointer block space-y-1 ${
                      isSelected
                        ? 'bg-[#FFFFFF] border-[#1D1D1B] shadow-xs translate-x-0.5'
                        : 'bg-[#FFFFFF]/70 hover:bg-[#FFFFFF] border-[#1D1D1B]/10 text-[#1D1D1B]/80'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className={`text-xs font-bold font-serif ${isSelected ? 'text-[#1D1D1B]' : 'text-[#1D1D1B]/90'}`}>
                        {item.term}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 bg-[#E8DCC4] text-[#1D1D1B] font-mono shrink-0">
                        {item.category}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#1D1D1B]/60 font-mono line-clamp-1">
                      {item.termEn}
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Right: Detailed Term Inspector (8 Cols) */}
          <div className="md:col-span-8 bg-[#FFFFFF] overflow-y-auto p-4 sm:p-6 space-y-5">
            {activeItem ? (
              <div className="space-y-5 animate-in fade-in duration-150">
                {/* Header of Term */}
                <div className="pb-3 border-b border-[#1D1D1B]/15 space-y-1.5">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="px-2.5 py-1 bg-[#1D1D1B] text-[#F9F7F2] text-xs font-bold font-mono">
                      {activeItem.category}
                    </span>
                    <span className="text-xs text-[#1D1D1B]/60 font-mono">
                      {activeItem.termEn}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black font-serif text-[#1D1D1B]">
                    {activeItem.term}
                  </h3>
                </div>

                {/* 1. Simple Student Definition */}
                <div className="p-4 bg-[#F9F7F2] border-r-4 border-r-[#C4A484] border border-[#1D1D1B]/15 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#1D1D1B]">
                    <Lightbulb className="w-4 h-4 text-[#8C6D4F]" />
                    <span>المفهوم ببساطة (الفهم المباشر):</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#1D1D1B] leading-relaxed">
                    {activeItem.simpleDefinition}
                  </p>
                </div>

                {/* 2. Academic Definition */}
                <div className="p-4 bg-[#FFFFFF] border border-[#1D1D1B]/20 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#1D1D1B]/80 font-mono">
                    <BookOpen className="w-4 h-4 text-[#1D1D1B]" />
                    <span>التعريف الأكاديمي والمعياري:</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#1D1D1B]/90 leading-relaxed font-sans">
                    {activeItem.academicDefinition}
                  </p>
                </div>

                {/* 3. Practical Example */}
                <div className="p-4 bg-[#E8DCC4]/20 border border-[#C4A484]/50 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#1D1D1B]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>مثال تطبيقي عملي:</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#1D1D1B] leading-relaxed">
                    {activeItem.practicalExample}
                  </p>
                </div>

                {/* 4. Common Misconception Warning */}
                <div className="p-4 bg-amber-50/70 border border-amber-300 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>انتبه! خطأ شائع يقع فيه الطلاب:</span>
                  </div>
                  <p className="text-xs sm:text-sm text-amber-950 leading-relaxed">
                    {activeItem.commonMistake}
                  </p>
                </div>

                {/* Footer Link to Lesson */}
                <div className="pt-2 flex items-center justify-between flex-wrap gap-2 text-xs border-t border-[#1D1D1B]/10">
                  <div className="flex items-center gap-1.5 text-[#1D1D1B]/60">
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>الدرس المرتبط:</span>
                    <span className="font-bold text-[#1D1D1B]">
                      {activeItem.relatedLessonId.replace('lesson-', 'الدرس ')}
                    </span>
                  </div>

                  {onNavigateToLesson && (
                    <button
                      onClick={() => {
                        const num = parseInt(activeItem.relatedLessonId.replace('lesson-', ''), 10) - 1;
                        if (!isNaN(num) && num >= 0) {
                          onNavigateToLesson(num);
                          onClose();
                        }
                      }}
                      className="px-3 py-1.5 bg-[#1D1D1B] text-[#F9F7F2] hover:bg-[#333330] font-bold text-xs flex items-center gap-1 cursor-pointer transition"
                    >
                      <span>الانتقال لشرح هذا الدرس</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-[#1D1D1B]/50">
                اختر مصطلحاً لعرض تفاصيله
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-[#F9F7F2] border-t border-[#1D1D1B]/15 flex items-center justify-between text-xs text-[#1D1D1B]/70">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block"></span>
            <span>معتمد وفق المعايير المحاسبية والمقرر الوزاري المصري للبكالوريا (EB)</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#1D1D1B] text-[#F9F7F2] font-bold text-xs hover:bg-[#333330] transition cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
