# PHASE 0 — التقرير التنفيذي للتدقيق الجنائي الشامل (Forensic Baseline Audit)

## مشروع منصة: «المحاسبة ببساطة وإتقان» — البكالوريا المصرية (EB)
**تاريخ التدقيق:** 2026-08-29  
**الصفة المهنية:** Principal Enterprise Software Architect + Senior Security & Assessment Auditor + QA Lead  
**القاعدة الحاكمة للمرحلة:** Phase 0 — Read / Inspect / Analyze / Report Only (ممنوع تعديل أي كود إنتاجي)

---

## 1. الملخص التنفيذي ومستوى الجاهزية الحالية

| المحور الأساسي | الحالة الجنائية الفعلية | الدرجة المرصودة | الحالة |
| :--- | :--- | :---: | :---: |
| **1. المعمارية وقاعدة البيانات (Architecture & DB)** | ازدواجية هيكلية بين Prisma/PostgreSQL وذاكرة In-Memory مؤقتة | **60 / 100** | ⚠️ خطر عالي |
| **2. الأمن والمصادقة والصلاحيات (Auth & RBAC)** | Bcrypt و JWT فعالان، ولكن ثغرة تسجيل Admin مفتوحة والواجهة تسجل تلقائياً | **68 / 100** | 🔴 ثغرة حرجة |
| **3. أمن التقييم والامتحانات (Assessment Security)** | تسريب مفاتيح الإجابات (is_correct و modelAnswer) وقبول درجات من العميل | **45 / 100** | 🔴 ثغرة حرجة |
| **4. بنك الأسئلة والمصفوفة وتغطية المنهج (Curriculum & QB)** | 62 سؤالاً فعلياً فقط (الادعاء 215+)، غياب تصنيف التاكسونومي (100% Understand) | **58 / 100** | ⚠️ فجوة كمية |
| **5. محركات التصحيح التطبيقي ومقال الـ JRE (Grading Engines)** | محرك JRE 20-Mark ومحرك Applied Grading يعملان بخطوات تفصيلية ممتازة | **90 / 100** | 🟢 ممتاز |
| **6. محرك الإتقان والمسار التكيفي (Mastery & Adaptive)** | محرك الإتقان رباعي الأبعاد سليم حسابياً، والمسار التكيفي يربط بالدروس | **82 / 100** | 🟡 جيد جداً |
| **المعدل العام للجاهزية والامتثال (Baseline Score)** | **الحقيقة الجنائية للنظام في وضعه الحالي قبل أي تعديل** | **67.2 / 100** | **دون المستوى المستهدف (≥95/100)** |

---

## 2. أبرز 5 ثغرات ومخاطر حرجة (Critical P0 Findings)

### 🔴 1. تسريب مفاتيح الإجابات الكاملة للامتحانات والأسئلة (Answer Key Leakage)
* **الموقع:** `/src/server/modules/questions.ts` (الأسطر 24-37) و `/src/server/modules/exams.ts` (السطر 28).
* **الدليل الجنائي:** 
  * عند طلب `GET /api/questions`، يعيد الخادم مصفوفة `options` محتوية على حقل `is_correct: boolean` مكشوفاً في الـ JSON.
  * عند طلب `GET /api/exams/:id` لبدء الامتحان، يرسل الخادم كائن الامتحان كاملاً متضمناً `correctAnswer`، `explanation`، و `modelAnswer` قبل أن يبدأ الطالب في الإجابة.
* **الأثر:** إمكانية غش كاملة في أي اختبار بنسبة 100% عبر فحص الـ Network Payload.

### 🔴 2. تصحيح الأسئلة الفردية يتحكم به العميل (Client-Controlled Grading)
* **الموقع:** `/src/server/modules/progress.ts` (الأسطر 11، 35، 42-43).
* **الدليل الجنائي:**
  * يقبل endpoint `POST /api/progress/attempt` الحقل `isCorrect: boolean` من الـ Request Body مباشرة دون أي مطابقة مع الإجابة الصحيحة المسجلة في السيرفر، ويمنح الطالب درجتين تلقائياً إذا أرسل العميل `isCorrect: true`.
* **الأثر:** تزييف سجلات الإتقان والتقدم للطلاب بدون حل صحيح.

### 🔴 3. التسجيل المفتوح برتبة مسؤول (Privilege Escalation via Open Role Registration)
* **الموقع:** `/src/server/modules/auth.ts` (الأسطر 13، 49).
* **الدليل الجنائي:**
  * مخطط التحقق `registerSchema` يقبل `role: z.enum(['STUDENT', 'TEACHER', 'CONTENT_MANAGER', 'ADMIN'])` دون أي تحقق من صلاحية المنشئ أو حماية الـ Endpoint.
* **الأثر:** أي مستخدم خارجي يستطيع إنشاء حساب `ADMIN` بصلاحيات كاملة مباشرة عبر الـ API.

### ⚠️ 4. فجوة الأرقام المدعاة لبنك الأسئلة (Claim vs. Reality Gap)
* **الموقع:** `/src/data/expandedQuestionBank.ts` (السطر 22) مقارنة بعدد الكائنات الفعلي.
* **الدليل الجنائي:**
  * التعليق في الكود والتوثيق يذكر: `// 215+ Traceable Questions across all 6 lessons`.
  * الفحص الجنائي الفعلي للبيانات أثبت وجود **62 سؤالاً فقط** في `expandedQuestionBank.ts`، و **20 سؤالاً** في `questionBankData.ts`.
  * اختبار الانحدار `p0_production_suite.ts` (السطر 159) يفحص `db.questions.length >= 215` ويفشل منطقياً لأن العدد الحقيقي 62.
* **الأثر:** غياب التغطية الكافية لمؤشرات نواتج التعلم وتدني مؤشر صحة المخطط التوجيهي (Blueprint Health Score = 50/100).

### ⚠️ 5. الازدواجية البنيوية لقاعدة البيانات (Architecture Duality)
* **الموقع:** `/server.ts`، `/src/server/db/database.ts`، `/src/server/db/prisma.ts`، و `/src/server/db/repositories/`.
* **الدليل الجنائي:**
  * توجد بيئة Prisma و PostgreSQL مع مخطط كامل في `prisma/schema.prisma` و Repositories جاهزة.
  * ولكن كافة الـ API Modules في الخادم (`/src/server/modules/*.ts`) تستورد وتتعامل مع كائن الذاكرة المؤقتة `import { db } from '../db/database'`.
* **الأثر:** فقدان كافة محاولات الطلاب، تقدم الدروس، وسجلات الامتحانات عند إعادة تشغيل الحاوية أو السيرفر (Cold Start Data Loss).

---

## 3. خارطة ملفات التدقيق التفصيلية
تم توثيق كافة الأدلة والسطور البرمجية والتحليلات الجنائية في الملفات التالية داخل مجلد `/AUDIT/`:
1. `PHASE_0_EXECUTIVE_SUMMARY.md` — هذا التقرير التنفيذي.
2. `PHASE_0_ARCHITECTURE_DATABASE_AUDIT.md` — تدقيق المعمارية وازدواجية الـ In-Memory vs. Prisma.
3. `PHASE_0_SECURITY_RBAC_AUDIT.md` — تدقيق أمن التشفير، المصادقة، والـ RBAC وتسريب الصلاحيات.
4. `PHASE_0_CURRICULUM_QUESTION_BANK_AUDIT.md` — التدقيق الإحصائي لبنك الأسئلة وتغطية مؤشرات نواتج التعلم ومستويات بلوم.
5. `PHASE_0_ASSESSMENT_GRADING_AUDIT.md` — تدقيق محركات التصحيح (JRE 20-Mark & Applied Grading) وأمن الاختبارات.
6. `PHASE_0_ANALYTICS_ADAPTIVE_AUDIT.md` — تدقيق محرك الإتقان رباعي الأبعاد والمسار العلاجي التكيفي.
7. `PHASE_0_SCORECARD_AND_ROADMAP.md` — بطاقة الدرجات الكاملة وخارطة طريق الانتقال لمرحلة Phase 1 للوصول إلى ≥95/100.
