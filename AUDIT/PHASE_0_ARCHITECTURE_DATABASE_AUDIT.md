# تقرير التدقيق المعماري وقاعدة البيانات (Architecture & Database Forensic Audit)

## 1. التوصيف المعماري الحالي للنظام (Current Architecture)

### 1.1 المكونات التقنية
* **الخادم الخلفي (Backend):** Node.js + Express + TypeScript (`server.ts`).
* **الواجهة الأمامية (Frontend):** React 18 + Vite + Tailwind CSS + Lucide Icons (`src/App.tsx`).
* **محرك إدارة البيانات:** كائن أحادي `PersistentProductionDatabase` محمل في ذاكرة السيرفر (`src/server/db/database.ts`).
* **طبقة الـ ORM المهملة:** Prisma ORM 5.x (`prisma/schema.prisma` و `src/server/db/prisma.ts`).

---

## 2. النتائج الجنائية لطبقة البيانات (Forensic Database Findings)

### النتيجة 1: الازدواجية المعمارية القاتلة (In-Memory Duality vs. Prisma Repositories)
* **الملفات المعنية:**
  * `server.ts` (الأسطر 50-80)
  * `src/server/db/database.ts` (الأسطر 1-350)
  * `src/server/modules/auth.ts`, `questions.ts`, `exams.ts`, `progress.ts`
  * `src/server/db/repositories/userRepository.ts`
* **السلوك الجنائي الفعلي:**
  1. توجد مكتبة `PrismaClient` مهيأة في `src/server/db/prisma.ts` ومربوطة بملف `prisma/schema.prisma`.
  2. تم بناء مستودعات بيانات مثل `UserRepository` في `src/server/db/repositories/userRepository.ts` تستخدم `prisma.user`.
  3. **ولكن في الواقع العملي:** كافة مسارات الـ API في `src/server/modules/*.ts` تستورد `import { db } from '../db/database'` فقط!
  4. فئة `PersistentProductionDatabase` تحتفظ بمصفوفات JavaScript في الذاكرة:
     * `this.users = [...]`
     * `this.lessons = [...]`
     * `this.questions = [...]`
     * `this.questionAttempts = []`
     * `this.examAttempts = []`
     * `this.refreshTokens = []`
  5. عند إعادة تشغيل السيرفر أو إعادة نشر الحاوية، يتم تصفير مصفوفات `questionAttempts` و `examAttempts`، وتعود البيانات للحالة الابتدائية.
* **الأثر والمخاطر:** انعدام الاستمرارية الدائمة (Data Persistence Loss) لبيانات الطلاب الفعلية بمجرد حدوث Server Restart.

---

## 3. تدقيق بنية المخطط (Schema Audit)

### 3.1 جدول المستخدمين والأدوار
* في `prisma/schema.prisma`:
  * الرتب المعرفة: `STUDENT`, `TEACHER`, `CONTENT_MANAGER`, `ADMIN`.
  * حقول كلمات المرور: `passwordHash String`.
* في `src/server/db/schema.ts` (النماذج الحالية المستخدمة بالذاكرة):
  * `DbUser`: `{ id, email, password_hash, first_name, last_name, full_name, role, status, created_at, updated_at }`.

### 3.2 سلامة العلاقات والربط
* في الـ In-memory DB:
  * يتم عمل Seed أولي من `expandedQuestionBank` في الدالة `seedQuestionBank()` داخل `src/server/db/database.ts`.
  * الأسئلة التي لا تحتوي على `learningObjectiveId` صالح يتم وسمها كـ `status: 'UNMAPPED'` و `learning_objective_id: 'UNMAPPED'`.
  * عدد الأسئلة الإجمالي في `db.questions`: 62 سؤالاً.
  * عدد الأهداف التعليمية في `db.learningObjectives`: 18 هدفاً (تطابق `CANONICAL_UNIT_1`).
  * عدد الدروس في `db.lessons`: 6 دروس.
  * عدد الاختبارات في `db.exams`: 2 اختبار شامل.

---

## 4. تقييم الأداء والموثوقية (Performance & Reliability)

| المعيار | التقييم | الملاحظات الجنائية |
| :--- | :---: | :--- |
| **زمن استجابة الـ In-Memory API** | < 5ms | سريع للغاية كونه يعمل من الذاكرة المحلية مباشرة |
| **الاستقرارية عند إعادة التشغيل** | 0% | يتم مسح محاولات الطلاب الجدد عند إعادة تشغيل Node process |
| **توافقية التزامن (Concurrency)** | ضعيف | التعديل على مصفوفات الذاكرة غير محمي بعمليات قفل أو Transactions |
| **العزل بين الطلاب (Tenant Isolation)** | يعتمد على كود الـ API | تم فحص `requireOwnershipOrStaff` ويعمل برمجياً |

---

## 5. توصيات المعمارية لمرحلة Phase 1
1. توحيد مصدر البيانات إما عبر تفعيل اتصال PostgreSQL بالكامل وربط المسارات بـ `Prisma`، أو توثيق نموذج التخزين السحابي الدائم وحمايته.
2. عزل طبقة الـ Data Access Layer عن الـ Controllers لضمان استقلالية الأعمال عن تقنية التخزين.
