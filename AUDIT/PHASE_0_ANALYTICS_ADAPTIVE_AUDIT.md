# تقرير تدقيق التحليلات، الإتقان، والمسار التكيفي (Analytics, Mastery & Adaptive Engine Audit)

## 1. محرك إتقان الطالب متعدد الأبعاد (Student Mastery Engine)

### 1.1 الموقع والمعمارية
* **الملف الرئيسي:** `src/domain/analytics/StudentMasteryEngine.ts`

### 1.2 النموذج الرياضي لاحتساب الإتقان
يحسب المحرك درجة الإتقان التراكمية المركبة (`compositeMastery` من 0 إلى 100) عبر 4 مكونات موزونة:
$$\text{Composite Mastery} = (0.40 \times \text{Accuracy}) + (0.30 \times \text{Difficulty}) + (0.20 \times \text{Trend}) + (0.10 \times \text{Breadth})$$

1. **معدل الدقة العام (Accuracy Rate - 40%):** نسبة الإجابات الصحيحة الإجمالية.
2. **عامل الصعوبة النوعي (Difficulty Component - 30%):** أداء الطالب في الأسئلة المتقدمة والتحدي مقارنة بالأسئلة الأساسية.
3. **الاتجاه والتحسن الزمني (Recent Trend - 20%):** أداء الطالب في آخر 10 محاولات تدريبية لرصد المنحنى التصاعدي.
4. **الاتساع والتغطية الشاملة (Curriculum Breadth - 10%):** مدى تنوع محاولات الطالب عبر دروس الوحدة الستة.
5. **معامل الثقة الإحصائية (Statistical Confidence Index):** مقياس من 0.0 إلى 1.0 يتدرج حسب حجم العينة ($N=25$ محاولة لتحقيق ثقة 100%).

### 1.3 الملاحظات الجنائية على محرك الإتقان
* **نقطة القوة:** البناء الرياضي سليم ومتقن ويمنع تزييف الإتقان بحل الأسئلة السهلة فقط.
* **نقطة الضعف/الملاحظة:** تجميع المفاهيم في السطور 120-148 يتم على مستوى الدرس ككل (`conceptId: grp.lessonId`) وليس على مستوى مؤشرات نواتج التعلم الدقيقة (Granular Learning Objectives).

---

## 2. المحرك العلاجي والمسار التكيفي (Adaptive Remediation Engine)

### 2.1 الموقع والمعمارية
* **الملف الرئيسي:** `src/domain/adaptive/AdaptiveRemediationEngine.ts`

### 2.2 آلية توليد الروشتة العلاجية (Remedial Prescriptions)
* يقوم برصد معدلات الخطأ لكل درس.
* إذا تجاوزت نسبة الأخطاء 40% أو تم ارتكاب أخطاء حرجة، يولد المحرك:
  1. تشخيصاً لسوء الفهم الشائع (`misconceptionDiagnosed`).
  2. تصنيفاً لدرجة الخطورة (`HIGH`, `MEDIUM`, `LOW`).
  3. إحالة لصفحة كتاب الوزارة المعتمدة (`textbookPageRef`).
  4. اقتراحاً لسؤال تدريب متدرج وسؤال تحقق (`scaffoldedPracticeQuestionId` و `verificationQuestionId`).
  5. خطوة التوجيه القادمة (`nextLearningStep`).

### 2.3 الملاحظات الجنائية على المحرك التكيفي
* **الملاحظة الجنائية:** في السطر 69 (`const targetObj = lesson.objectives[0];`)، يختار المحرك الهدف الأول من الدرس دائماً كهدف علاجي افتراضي بدلاً من استهداف الناتج المحدد الذي أخطأ فيه الطالب فعلياً.

---

## 3. محرك تحليلات المعلم ومسؤول المحتوى (Teacher & Content Analytics Engines)

### 3.1 الموقع والمعمارية
* **ملفات التحليلات:**
  * `src/domain/analytics/TeacherAnalyticsEngine.ts`
  * `src/domain/analytics/ContentAnalyticsEngine.ts`
* **المؤشرات المرصودة:**
  * مؤشر الطلاب المعرضين للتعثر (At-Risk Students Profile).
  * معامل سهولة الأسئلة (Facility Index / $p$-value من 0.0 إلى 1.0).
  * تحذيرات التمييز السيكومتري (Discrimination Warnings للأسئلة الأسهل من 0.95 أو الأصعب من 0.25).
  * مصفوفة تتبع أداء المجموعة لكل مفهوم محاسبي.
